 // Device Management untuk Cross-Device Authentication System
class DeviceManager {
    constructor() {
        this.githubAuth = null;
        this.currentDevice = this.getCurrentDeviceInfo();
        this.connectedDevices = [];
        this.initializeDeviceManager();
    }

    async initializeDeviceManager() {
        // Wait for GitHub auth to be ready
        if (window.githubAuth) {
            this.githubAuth = window.githubAuth;
            await this.loadConnectedDevices();
            this.startDeviceMonitoring();
        } else {
            // Retry after a short delay
            setTimeout(() => this.initializeDeviceManager(), 1000);
        }
    }

    // Get current device information
    getCurrentDeviceInfo() {
        const userAgent = navigator.userAgent;
        const deviceInfo = {
            id: this.generateDeviceId(),
            name: this.getDeviceName(),
            type: this.getDeviceType(),
            browser: this.getBrowserInfo(),
            os: this.getOSInfo(),
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            userAgent: userAgent,
            ip: null, // Will be set by server
            lastActive: new Date().toISOString(),
            isCurrentDevice: true
        };

        return deviceInfo;
    }

    // Generate unique device ID
    generateDeviceId() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);

        const fingerprint = canvas.toDataURL().substring(0, 50);
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);

        return btoa(fingerprint + timestamp + random).substring(0, 32);
    }

    // Get device name
    getDeviceName() {
        const userAgent = navigator.userAgent;

        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            if (/iPad/i.test(userAgent)) return 'iPad';
            if (/iPhone/i.test(userAgent)) return 'iPhone';
            if (/Android/i.test(userAgent)) return 'Android Device';
            return 'Mobile Device';
        } else {
            return 'Desktop Computer';
        }
    }

    // Get device type
    getDeviceType() {
        const userAgent = navigator.userAgent;

        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            return 'mobile';
        } else if (/Tablet|iPad/i.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    // Get browser information
    getBrowserInfo() {
        const userAgent = navigator.userAgent;

        if (/Chrome/i.test(userAgent)) return 'Chrome';
        if (/Firefox/i.test(userAgent)) return 'Firefox';
        if (/Safari/i.test(userAgent)) return 'Safari';
        if (/Edge/i.test(userAgent)) return 'Edge';
        if (/Opera/i.test(userAgent)) return 'Opera';

        return 'Unknown Browser';
    }

    // Get OS information
    getOSInfo() {
        const userAgent = navigator.userAgent;

        if (/Windows NT/i.test(userAgent)) return 'Windows';
        if (/Mac OS X/i.test(userAgent)) return 'macOS';
        if (/Linux/i.test(userAgent)) return 'Linux';
        if (/Android/i.test(userAgent)) return 'Android';
        if (/iOS|iPhone|iPad/i.test(userAgent)) return 'iOS';

        return 'Unknown OS';
    }

    // Load connected devices from GitHub
    async loadConnectedDevices() {
        if (!this.githubAuth || !this.githubAuth.isAuthenticated()) {
            return;
        }

        try {
            const devicesPath = `devices`;
            const files = await this.githubAuth.api.listFiles(
                this.githubAuth.currentUser.username,
                'mikaela-auth-system',
                devicesPath
            );

            this.connectedDevices = [];

            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json')) {
                    try {
                        const deviceData = await this.githubAuth.api.getFileContents(
                            this.githubAuth.currentUser.username,
                            'mikaela-auth-system',
                            file.path
                        );

                        if (deviceData) {
                            deviceData.isCurrentDevice = deviceData.id === this.currentDevice.id;
                            this.connectedDevices.push(deviceData);
                        }
                    } catch (error) {
                        console.error('Error loading device data:', error);
                    }
                }
            }

            this.updateDeviceUI();
        } catch (error) {
            console.log('No devices found or error loading devices:', error);
        }
    }

    // Sync user account data with device registration
    async syncUserAccountData() {
        if (!window.auth || !this.githubAuth || !this.githubAuth.isAuthenticated()) {
            console.log('Auth or GitHub auth not available for user data sync');
            return;
        }

        try {
            console.log('Syncing user account data with device registration...');

            // Get current user data from auth system
            const userData = {
                users: window.auth.users,
                currentUser: window.auth.currentUser,
                metadata: {
                    version: "2.0",
                    lastSync: new Date().toISOString(),
                    description: "User account data synced with device registration",
                    syncedFrom: "device-manager",
                    deviceInfo: this.currentDevice
                }
            };

            // Save user data to GitHub
            await this.githubAuth.saveUserData(userData);

            console.log('User account data synced successfully');
            this.showNotification('Data akun berhasil di-sync dengan device', 'success');

        } catch (error) {
            console.error('Error syncing user account data:', error);
            this.showNotification('Gagal sync data akun: ' + error.message, 'error');
        }
    }

    // Load user account data from GitHub
    async loadUserAccountData() {
        if (!this.githubAuth || !this.githubAuth.isAuthenticated()) {
            console.log('GitHub auth not available for loading user data');
            return;
        }

        try {
            console.log('Loading user account data from GitHub...');

            const userData = await this.githubAuth.loadUserData();

            if (userData && userData.users && window.auth) {
                // Update auth system with loaded data
                window.auth.users = userData.users;
                window.auth.saveUsers();

                // Update current user if available
                if (userData.currentUser) {
                    window.auth.setCurrentUser(userData.currentUser);
                }

                console.log('User account data loaded successfully');
                this.showNotification(`Data akun berhasil dimuat (${userData.users.length} users)`, 'success');

                return userData;
            }

        } catch (error) {
            console.error('Error loading user account data:', error);
            this.showNotification('Gagal memuat data akun: ' + error.message, 'error');
        }
    }

    // Save current device to GitHub
    async saveCurrentDevice() {
        if (!this.githubAuth || !this.githubAuth.isAuthenticated()) {
            return;
        }

        try {
            const devicePath = `devices/${this.githubAuth.currentUser.username}-${this.currentDevice.id}.json`;

            await this.githubAuth.api.createOrUpdateFile(
                this.githubAuth.currentUser.username,
                'mikaela-auth-system',
                devicePath,
                this.currentDevice,
                `Register new device: ${this.currentDevice.name}`
            );

            await this.loadConnectedDevices(); // Reload devices list
        } catch (error) {
            console.error('Error saving device:', error);
        }
    }

    // Remove device from GitHub
    async removeDevice(deviceId) {
        if (!this.githubAuth || !this.githubAuth.isAuthenticated()) {
            return;
        }

        try {
            const device = this.connectedDevices.find(d => d.id === deviceId);
            if (!device) return;

            const devicePath = `devices/${this.githubAuth.currentUser.username}-${deviceId}.json`;

            // Get file SHA first
            const fileInfo = await this.githubAuth.api.makeRequest(
                `/repos/${this.githubAuth.currentUser.username}/mikaela-auth-system/contents/${devicePath}`
            );

            await this.githubAuth.api.makeRequest(
                `/repos/${this.githubAuth.currentUser.username}/mikaela-auth-system/contents/${devicePath}`,
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        message: `Remove device: ${device.name}`,
                        sha: fileInfo.sha,
                        branch: 'main'
                    })
                }
            );

            await this.loadConnectedDevices(); // Reload devices list
            this.showNotification(`Device ${device.name} berhasil dihapus`, 'success');
        } catch (error) {
            console.error('Error removing device:', error);
            this.showNotification('Gagal menghapus device', 'error');
        }
    }

    // Update device activity
    async updateDeviceActivity() {
        if (!this.githubAuth || !this.githubAuth.isAuthenticated()) {
            return;
        }

        try {
            this.currentDevice.lastActive = new Date().toISOString();

            const devicePath = `devices/${this.githubAuth.currentUser.username}-${this.currentDevice.id}.json`;

            await this.githubAuth.api.createOrUpdateFile(
                this.githubAuth.currentUser.username,
                'mikaela-auth-system',
                devicePath,
                this.currentDevice,
                `Update device activity: ${this.currentDevice.name}`
            );
        } catch (error) {
            console.error('Error updating device activity:', error);
        }
    }

    // Start monitoring device activity
    startDeviceMonitoring() {
        // Update activity every 5 minutes
        setInterval(() => {
            this.updateDeviceActivity();
        }, 5 * 60 * 1000);

        // Update activity when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateDeviceActivity();
            }
        });
    }

    // Update device UI
    updateDeviceUI() {
        const deviceList = document.getElementById('deviceList');
        if (!deviceList) return;

        deviceList.innerHTML = '';

        if (this.connectedDevices.length === 0) {
            deviceList.innerHTML = '<p>Tidak ada device yang terhubung</p>';
            return;
        }

        this.connectedDevices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = `device-item ${device.isCurrentDevice ? 'current-device' : ''}`;

            const lastActive = new Date(device.lastActive);
            const timeAgo = this.getTimeAgo(lastActive);

            deviceElement.innerHTML = `
                <div class="device-info">
                    <div class="device-name">${device.name}</div>
                    <div class="device-details">
                        ${device.browser} on ${device.os} • ${timeAgo}
                    </div>
                </div>
                <div class="device-actions">
                    ${device.isCurrentDevice ? '<span class="current-badge">Current</span>' :
                      `<button onclick="window.deviceManager.removeDevice('${device.id}')" class="remove-btn">
                          Hapus
                       </button>`}
                </div>
            `;

            deviceList.appendChild(deviceElement);
        });
    }

    // Get time ago string
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} hari yang lalu`;
        if (hours > 0) return `${hours} jam yang lalu`;
        if (minutes > 0) return `${minutes} menit yang lalu`;
        return 'Baru saja';
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (this.githubAuth) {
            this.githubAuth.showNotification(message, type);
        }
    }

    // Get connected devices
    getConnectedDevices() {
        return this.connectedDevices;
    }

    // Get current device
    getCurrentDevice() {
        return this.currentDevice;
    }
}

// Initialize Device Manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.deviceManager = new DeviceManager();
});
