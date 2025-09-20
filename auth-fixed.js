// Sistem Authentication untuk Website Mikaela
class AuthSystem {
    constructor() {
        this.initializeAuth();
    }

    async initializeAuth() {
        this.users = await this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Load users dari accounts.json dan localStorage
    async loadUsers() {
        let users = [];

        // Load dari accounts.json terlebih dahulu
        try {
            const response = await fetch('./accounts.json');
            if (response.ok) {
                const data = await response.json();
                users = data.users || [];
            }
        } catch (error) {
            console.log('Could not load accounts.json, using localStorage only');
        }

        // Load dari localStorage dan gabungkan
        const localUsers = localStorage.getItem('mikaela_users');
        if (localUsers) {
            const parsedLocalUsers = JSON.parse(localUsers);
            // Gabungkan users, prioritaskan localStorage untuk user yang sama
            const combinedUsers = [...users];
            parsedLocalUsers.forEach(localUser => {
                const existingIndex = combinedUsers.findIndex(u => u.id === localUser.id);
                if (existingIndex >= 0) {
                    combinedUsers[existingIndex] = localUser;
                } else {
                    combinedUsers.push(localUser);
                }
            });
            users = combinedUsers;
        }

        return users;
    }

    // Save users ke localStorage dan sync dengan accounts.json
    saveUsers() {
        // Primary storage: localStorage
        localStorage.setItem('mikaela_users', JSON.stringify(this.users));

        // Attempt to sync with accounts.json (limited by browser security)
        this.syncWithAccountsJson();
    }

    // Auto-sync dengan localStorage untuk cross-device compatibility
    async syncWithLocalStorage() {
        try {
            console.log('Auto-syncing user data with localStorage...');

            const syncData = {
                users: this.users,
                metadata: {
                    version: "2.0",
                    lastSync: new Date().toISOString(),
                    description: "User accounts data with base64 password encoding",
                    syncedFrom: "localStorage",
                    deviceInfo: this.getCurrentDeviceInfo()
                }
            };

            // Save to localStorage with timestamp
            const syncKey = 'mikaela_auto_sync';
            localStorage.setItem(syncKey, JSON.stringify(syncData));

            // Also save individual user files for better compatibility
            this.saveToUserFiles();

            // Update local metadata
            this.updateSyncMetadata('localStorage', new Date().toISOString());

            console.log('Successfully auto-synced with localStorage');
            return { success: true, message: 'Data berhasil di-sync otomatis' };

        } catch (error) {
            console.error('Auto-sync failed:', error);
            return { success: false, message: 'Gagal sync otomatis: ' + error.message };
        }
    }

    // Get current device info
    getCurrentDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            timestamp: new Date().toISOString()
        };
    }

    // Update sync metadata
    updateSyncMetadata(source, timestamp) {
        const metadata = {
            lastSyncSource: source,
            lastSyncTime: timestamp,
            lastSyncDevice: this.getCurrentDeviceInfo()
        };

        localStorage.setItem('mikaela_sync_metadata', JSON.stringify(metadata));
    }

    // Get sync metadata
    getSyncMetadata() {
        const metadata = localStorage.getItem('mikaela_sync_metadata');
        return metadata ? JSON.parse(metadata) : null;
    }

    // Hash password menggunakan base64 encoding
    hashPassword(password) {
        return btoa(password); // Base64 encoding untuk password
    }

    // Decode password dari base64
    decodePassword(encodedPassword) {
        return atob(encodedPassword); // Decode base64 ke plain text
    }

    // Register user baru
    register(username, email, password) {
        // Cek apakah username sudah ada
        if (this.users.find(user => user.username === username)) {
            return { success: false, message: 'Username sudah digunakan!' };
        }

        // Cek apakah email sudah ada
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Email sudah terdaftar!' };
        }

        // Buat user baru
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            role: "user",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Akun berhasil dibuat!' };
    }

    // Login user
    login(username, password) {
        const user = this.users.find(user =>
            (user.username === username || user.email === username) &&
            user.password === this.hashPassword(password)
        );

        if (user) {
            this.setCurrentUser(user);
            return { success: true, message: 'Login berhasil!' };
        } else {
            return { success: false, message: 'Username/email atau password salah!' };
        }
    }

    // Get current logged in user
    getCurrentUser() {
        const user = localStorage.getItem('mikaela_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem('mikaela_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('mikaela_current_user');
        }
        this.currentUser = user;
    }

    // Initialize event listeners
    init() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Check login status on page load
        this.checkLoginStatus();
    }

    // Handle login form submission
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('loginMessage');

        const result = this.login(username, password);

        if (result.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;

            // Auto-sync after successful login
            this.syncWithLocalStorage().then(syncResult => {
                console.log('✅ Auto-sync after login:', syncResult.message);
                if (syncResult.success) {
                    this.showNotification('✅ Data berhasil di-sync otomatis', 'success');
                }
            }).catch(error => {
                console.log('⚠️ Auto-sync after login failed:', error);
                this.showNotification('⚠️ Auto-sync gagal, tapi login berhasil', 'success');
            });

            setTimeout(() => {
                window.location.href = 'home-auto.html';
            }, 1000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    }

    // Handle register form submission
    handleRegister() {
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageDiv = document.getElementById('registerMessage');

        // Validasi password
        if (password !== confirmPassword) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Password tidak cocok!';
            return;
        }

        const result = this.register(username, email, password);

        if (result.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    }

    // Check login status and redirect if needed
    checkLoginStatus() {
        // Jika di halaman home dan belum login, redirect ke login
        if (window.location.pathname.includes('home.html') && !this.isLoggedIn()) {
            window.location.href = 'index.html';
        }

        // Update navigation
        this.updateNavigation();
    }

    // Update navigation based on login status
    updateNavigation() {
        const nav = document.querySelector('.nav');
        if (nav && this.isLoggedIn()) {
            // Tambah link logout jika sudah login
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.onclick = () => {
                this.logout();
                window.location.href = 'index.html';
            };
            nav.appendChild(logoutLink);

            // Tambah link admin tersembunyi HANYA untuk role admin
            if (this.currentUser && this.currentUser.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.textContent = '⚙️';
                adminLink.title = 'Admin Panel - Akses Terbatas';
                adminLink.style.fontSize = '16px';
                adminLink.style.color = '#ff6b6b';
                nav.appendChild(adminLink);
            }
        }
    }

    // Show notification untuk user feedback
    showNotification(message, type) {
        // Hapus notifikasi yang ada
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Buat notifikasi baru
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.textContent = message;

        // Style notifikasi
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set warna berdasarkan type
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        }

        document.body.appendChild(notification);

        // Animasi masuk
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto hide setelah 5 detik
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Initialize auth system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthSystem();
});
