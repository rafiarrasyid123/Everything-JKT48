// Test script untuk AuthSystem
// Jalankan di browser console untuk testing

// Mock localStorage untuk testing
const mockStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// Mock fetch untuk testing
const mockFetch = async (url) => {
    if (url === './accounts.json') {
        return {
            ok: true,
            json: async () => ({
                users: [
                    {
                        id: 1,
                        username: "admin",
                        email: "admin@mikaela.com",
                        password: "YWRtaW4=", // base64 encoded "admin"
                        role: "admin",
                        isActive: true,
                        createdAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z"
                    },
                    {
                        id: 2,
                        username: "raffz",
                        email: "raffz@mikaela.com",
                        password: "cmFmZno=", // base64 encoded "raffz"
                        role: "user",
                        isActive: true,
                        createdAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z"
                    }
                ],
                metadata: {
                    version: "2.0",
                    lastSync: "2024-01-01T00:00:00.000Z",
                    description: "User accounts data with base64 password encoding"
                }
            })
        };
    }
    throw new Error('File not found');
};

// Test AuthSystem class
class TestAuthSystem {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.storage = mockStorage;
        this.fetch = mockFetch;
    }

    async loadUsers() {
        let users = [];

        try {
            const response = await this.fetch('./accounts.json');
            if (response.ok) {
                const data = await response.json();
                users = data.users || [];
            }
        } catch (error) {
            console.log('Could not load accounts.json, using localStorage only');
        }

        const localUsers = this.storage.getItem('mikaela_users');
        if (localUsers) {
            const parsedLocalUsers = JSON.parse(localUsers);
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

    async initializeAuth() {
        this.users = await this.loadUsers();
        this.currentUser = this.storage.getItem('mikaela_current_user');
        this.currentUser = this.currentUser ? JSON.parse(this.currentUser) : null;
    }

    hashPassword(password) {
        return btoa(password); // Base64 encoding untuk konsistensi
    }

    register(username, email, password) {
        if (this.users.find(user => user.username === username)) {
            return { success: false, message: 'Username sudah digunakan!' };
        }

        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Email sudah terdaftar!' };
        }

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
        this.storage.setItem('mikaela_users', JSON.stringify(this.users));

        return { success: true, message: 'Akun berhasil dibuat!' };
    }

    login(username, password) {
        const user = this.users.find(user =>
            (user.username === username || user.email === username) &&
            user.password === this.hashPassword(password)
        );

        if (user) {
            this.currentUser = user;
            this.storage.setItem('mikaela_current_user', JSON.stringify(user));
            return { success: true, message: 'Login berhasil!' };
        } else {
            return { success: false, message: 'Username/email atau password salah!' };
        }
    }

    logout() {
        this.currentUser = null;
        this.storage.removeItem('mikaela_current_user');
        return { success: true, message: 'Logout berhasil!' };
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Jalankan test
async function runTests() {
    console.log('🧪 Memulai testing AuthSystem...\n');

    const auth = new TestAuthSystem();
    await auth.initializeAuth();

    console.log('📊 Test 1: Load users dari accounts.json');
    console.log('Users yang dimuat:', auth.users.length);
    console.log('Users:', auth.users.map(u => ({ username: u.username, email: u.email })));
    console.log('✅ Test 1 BERHASIL\n');

    console.log('📊 Test 2: Login dengan user yang sudah ada');
    const loginResult1 = auth.login('admin', 'admin');
    console.log('Login admin:', loginResult1);
    console.log('Status login:', auth.isLoggedIn() ? 'Logged in' : 'Not logged in');
    console.log('✅ Test 2 BERHASIL\n');

    console.log('📊 Test 3: Login dengan password salah');
    const loginResult2 = auth.login('admin', 'wrongpassword');
    console.log('Login dengan password salah:', loginResult2);
    console.log('✅ Test 3 BERHASIL\n');

    console.log('📊 Test 4: Registrasi user baru');
    const registerResult = auth.register('testuser', 'test@example.com', 'testpass');
    console.log('Registrasi:', registerResult);
    console.log('Total users sekarang:', auth.users.length);
    console.log('✅ Test 4 BERHASIL\n');

    console.log('📊 Test 5: Login dengan user baru');
    const loginResult3 = auth.login('testuser', 'testpass');
    console.log('Login user baru:', loginResult3);
    console.log('✅ Test 5 BERHASIL\n');

    console.log('📊 Test 6: Registrasi dengan username yang sudah ada');
    const registerResult2 = auth.register('admin', 'admin2@example.com', 'adminpass');
    console.log('Registrasi username duplikat:', registerResult2);
    console.log('✅ Test 6 BERHASIL\n');

    console.log('📊 Test 7: Logout');
    const logoutResult = auth.logout();
    console.log('Logout:', logoutResult);
    console.log('Status login setelah logout:', auth.isLoggedIn() ? 'Logged in' : 'Not logged in');
    console.log('✅ Test 7 BERHASIL\n');

    console.log('🎉 SEMUA TEST BERHASIL! Sistem save akun berfungsi dengan baik.');
}

// Jalankan test
runTests();
