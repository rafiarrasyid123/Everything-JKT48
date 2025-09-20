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

    // Sync dengan accounts.json (untuk environment yang mendukung)
    async syncWithAccountsJson() {
        try {
            // Note: This will only work if running on a server that allows file writing
            // or if using a different mechanism like server-side API
            console.log('Attempting to sync with accounts.json...');

            // For now, we'll just log the data that would be synced
            const syncData = {
                users: this.users,
                metadata: {
                    version: "2.0",
                    lastSync: new Date().toISOString(),
                    description: "User accounts data with base64 password encoding",
                    syncedFrom: "localStorage"
                }
            };

            console.log('Data to sync:', JSON.stringify(syncData, null, 2));

            // In a real implementation, you would send this to a server endpoint
            // that can write to accounts.json or use a different sync mechanism

        } catch (error) {
            console.log('Sync with accounts.json failed (expected in browser environment):', error.message);
        }
    }

    // Export user data untuk backup/manual sync
    exportUserData() {
        const exportData = {
            users: this.users,
            exportDate: new Date().toISOString(),
            version: "2.0"
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mikaela-users-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, message: 'Data berhasil di-export!' };
    }

    // Import user data dari backup
    importUserData(jsonData) {
        try {
            const importData = JSON.parse(jsonData);

            if (importData.users && Array.isArray(importData.users)) {
                // Merge dengan data existing
                const combinedUsers = [...this.users];
                importData.users.forEach(importUser => {
                    const existingIndex = combinedUsers.findIndex(u => u.id === importUser.id);
                    if (existingIndex >= 0) {
                        combinedUsers[existingIndex] = importUser;
                    } else {
                        combinedUsers.push(importUser);
                    }
                });

                this.users = combinedUsers;
                this.saveUsers();

                return { success: true, message: `Berhasil import ${importData.users.length} user!` };
            } else {
                return { success: false, message: 'Format data tidak valid!' };
            }
        } catch (error) {
            return { success: false, message: 'Error parsing JSON: ' + error.message };
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

    // Reset password
    resetPassword(email) {
        const user = this.users.find(user => user.email === email);
        if (user) {
            // Simulasi kirim email reset
            return { success: true, message: 'Link reset password telah dikirim ke email Anda!' };
        } else {
            return { success: false, message: 'Email tidak ditemukan!' };
        }
    }

    // Logout
    logout() {
        this.setCurrentUser(null);
        return { success: true, message: 'Logout berhasil!' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
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

        // Reset form
        const resetForm = document.getElementById('resetForm');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReset();
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
            setTimeout(() => {
                window.location.href = 'home.html';
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
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    }

    // Handle reset form submission
    handleReset() {
        const email = document.getElementById('resetEmail').value;
        const messageDiv = document.getElementById('resetMessage');

        const result = this.resetPassword(email);

        if (result.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    }

    // Check login status and redirect if needed
    checkLoginStatus() {
        // Jika di halaman home dan belum login, redirect ke login
        if (window.location.pathname.includes('home.html') && !this.isLoggedIn()) {
            window.location.href = 'login.html';
        }

        // Jika di root domain (/) dan belum login, redirect ke login
        if (window.location.pathname === '/' && !this.isLoggedIn()) {
            window.location.href = 'login.html';
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
                window.location.href = 'login.html';
            };
            nav.appendChild(logoutLink);
        }
    }
}

// Initialize auth system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});
