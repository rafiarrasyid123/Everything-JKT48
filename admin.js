// Admin Panel untuk Backup & Restore Akun Mikaela
// File ini berisi fungsi-fungsi admin yang tersembunyi

class AdminPanel {
    constructor(authSystem) {
        this.auth = authSystem;
    }

    // Show admin panel popup
    showAdminPanel() {
        // Hapus admin panel yang sudah ada
        const existingPanel = document.querySelector('.admin-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Buat admin panel
        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 2px solid #333;
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                z-index: 10001;
                min-width: 350px;
                max-width: 500px;
                color: white;
            ">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h3 style="margin: 0; color: white; font-size: 24px;">🔐 Admin Panel</h3>
                    <p style="margin: 8px 0; color: #e0e0e0; font-size: 14px;">Backup & Restore Akun Mikaela</p>
                    <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-top: 10px;">
                        <small style="color: #fff;">⚠️ Fitur admin tersembunyi - gunakan dengan hati-hati</small>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="adminPanel.handleExportData()" style="
                        padding: 12px 18px;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                        💾 Backup Semua Akun
                    </button>

                    <button onclick="adminPanel.handleExportIndividual()" style="
                        padding: 12px 18px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
                        📦 Export Individual Files
                    </button>

                    <button onclick="adminPanel.handleImportData()" style="
                        padding: 12px 18px;
                        background: #ffc107;
                        color: black;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#e0a800'" onmouseout="this.style.background='#ffc107'">
                        📁 Restore dari Backup
                    </button>

                    <button onclick="adminPanel.showUserList()" style="
                        padding: 12px 18px;
                        background: #17a2b8;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#138496'" onmouseout="this.style.background='#17a2b8'">
                        👥 Lihat Daftar User
                    </button>

                    <button onclick="adminPanel.showUserDetails()" style="
                        padding: 12px 18px;
                        background: #6f42c1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#5a359a'" onmouseout="this.style.background='#6f42c1'">
                        🔍 Lihat Detail & Password
                    </button>

                    <button onclick="adminPanel.showAddAdminForm()" style="
                        padding: 12px 18px;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                        👤+ Tambah Admin Baru
                    </button>

                    <button onclick="document.querySelector('.admin-panel').remove(); document.querySelector('.admin-overlay').remove()" style="
                        padding: 12px 18px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        margin-top: 15px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                        ❌ Tutup Panel
                    </button>
                </div>

                <div style="margin-top: 20px; font-size: 11px; color: #e0e0e0; text-align: center; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">
                    <p>💡 <strong>Informasi:</strong></p>
                    <p>• Backup berkala untuk keamanan data</p>
                    <p>• File backup kompatibel antar device</p>
                    <p>• Password tersimpan dalam format base64</p>
                    <p>• Total akun: <strong>${this.auth.users.length}</strong></p>
                </div>
            </div>
        `;

        // Tambah overlay
        const overlay = document.createElement('div');
        overlay.className = 'admin-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            backdrop-filter: blur(2px);
        `;
        overlay.onclick = () => {
            panel.remove();
            overlay.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Auto-close setelah 60 detik (untuk keamanan)
        setTimeout(() => {
            if (panel.parentNode) {
                panel.remove();
                overlay.remove();
            }
        }, 60000);
    }

    // Show user list
    showUserList() {
        const userList = this.auth.users.map(user => `
            <div style="background: rgba(255,255,255,0.1); padding: 8px; margin: 5px 0; border-radius: 5px;">
                <strong>${user.username}</strong> (${user.email})
                <br><small>Role: ${user.role} | Dibuat: ${new Date(user.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');

        const listPanel = document.createElement('div');
        listPanel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #333;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                z-index: 10002;
                max-width: 400px;
                max-height: 60vh;
                overflow-y: auto;
            ">
                <h4 style="margin-top: 0; color: #333;">👥 Daftar User (${this.auth.users.length})</h4>
                <div>${userList}</div>
                <button onclick="document.querySelector('.user-list-panel').remove()" style="
                    margin-top: 15px;
                    padding: 8px 16px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Tutup</button>
            </div>
        `;

        document.body.appendChild(listPanel);
    }

    // Show user details with passwords
    showUserDetails() {
        const userDetails = this.auth.users.map(user => {
            // Decode password dari base64
            let decodedPassword = 'Tidak dapat decode';
            try {
                decodedPassword = atob(user.password);
            } catch (e) {
                decodedPassword = 'Error decode password';
            }

            return `
                <div style="background: rgba(255,255,255,0.1); padding: 12px; margin: 6px 0; border-radius: 6px; border-left: 3px solid #6f42c1;">
                    <div style="margin-bottom: 8px;">
                        <strong style="color: white; font-size: 15px;">${user.username}</strong>
                        <span style="background: ${user.role === 'admin' ? '#28a745' : '#007bff'}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 8px;">
                            ${user.role.toUpperCase()}
                        </span>
                    </div>
                    <div style="font-size: 12px; color: #e0e0e0; margin-bottom: 6px;">
                        📧 Email: <strong>${user.email}</strong>
                    </div>
                    <div style="font-size: 12px; color: #e0e0e0; margin-bottom: 6px;">
                        🔑 Password: <strong style="color: #ff6b6b;">${decodedPassword}</strong>
                    </div>
                    <div style="font-size: 12px; color: #e0e0e0; margin-bottom: 6px;">
                        📅 Dibuat: <strong>${new Date(user.createdAt).toLocaleString()}</strong>
                    </div>
                    <div style="font-size: 12px; color: #e0e0e0; margin-bottom: 6px;">
                        🔄 Update: <strong>${new Date(user.updatedAt).toLocaleString()}</strong>
                    </div>
                    <div style="font-size: 12px; color: #e0e0e0;">
                        ✅ Status: <strong style="${user.isActive ? 'color: #28a745' : 'color: #ffc107'}">
                            ${user.isActive ? 'Aktif' : 'Non-aktif'}
                        </strong>
                    </div>
                </div>
            `;
        }).join('');

        const detailsPanel = document.createElement('div');
        detailsPanel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 2px solid #e74c3c;
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                z-index: 10002;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                width: 90%;
                color: white;
            ">
                <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 15px;">
                    <h3 style="margin: 0; color: white; font-size: 22px;">🔍 Detail Lengkap Akun & Password</h3>
                    <p style="margin: 5px 0; color: #e0e0e0; font-size: 13px;">
                        ⚠️ <strong>INFORMASI SENSITIF</strong> - Password ditampilkan dalam format asli
                    </p>
                </div>

                <div style="background: rgba(231, 76, 60, 0.2); padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
                    <strong style="color: #ff6b6b;">🔒 PERINGATAN KEAMANAN:</strong>
                    <div style="margin-top: 5px; font-size: 12px; color: #f8d7da;">
                        • Data password ditampilkan dalam format asli (decoded dari base64)<br>
                        • Pastikan tidak ada orang lain yang melihat layar<br>
                        • Tutup panel ini segera setelah selesai
                    </div>
                </div>

                <div>${userDetails}</div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid rgba(255,255,255,0.2); text-align: center;">
                    <button onclick="document.querySelector('.user-details-panel').remove()" style="
                        padding: 12px 25px;
                        background: linear-gradient(135deg, #dc3545, #c82333);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                    ">🔒 Tutup Panel (AMAN)</button>
                </div>
            </div>
        `;

        document.body.appendChild(detailsPanel);
    }

    // Handle export data
    handleExportData() {
        const result = this.auth.exportUserData();
        if (result.success) {
            this.showNotification(result.message, 'success');
        } else {
            this.showNotification('Gagal export data: ' + result.message, 'error');
        }
    }

    // Handle import data
    handleImportData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = this.auth.importUserData(e.target.result);
                    if (result.success) {
                        this.showNotification(result.message, 'success');
                        // Refresh halaman setelah import berhasil
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        this.showNotification('Gagal import data: ' + result.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Handle export individual files
    handleExportIndividual() {
        const result = this.auth.saveToUserFiles();
        if (result.success) {
            this.showNotification(result.message, 'success');
        } else {
            this.showNotification('Gagal export individual: ' + result.message, 'error');
        }
    }

    // Handle add new admin
    handleAddAdmin() {
        const username = document.getElementById('newAdminUsername').value;
        const email = document.getElementById('newAdminEmail').value;
        const password = document.getElementById('newAdminPassword').value;

        if (!username || !email || !password) {
            this.showNotification('Semua field harus diisi!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password minimal 6 karakter!', 'error');
            return;
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Format email tidak valid!', 'error');
            return;
        }

        // Cek apakah username sudah ada
        const existingUser = this.auth.users.find(u => u.username === username);
        if (existingUser) {
            this.showNotification('Username sudah digunakan!', 'error');
            return;
        }

        // Cek apakah email sudah ada
        const existingEmail = this.auth.users.find(u => u.email === email);
        if (existingEmail) {
            this.showNotification('Email sudah digunakan!', 'error');
            return;
        }

        // Generate ID baru
        const newId = Math.max(...this.auth.users.map(u => u.id), 0) + 1;

        // Buat user baru
        const newAdmin = {
            id: newId,
            username: username,
            email: email,
            password: btoa(password), // Enkripsi ke base64
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Tambahkan ke sistem
        this.auth.users.push(newAdmin);

        // Simpan ke localStorage sebagai backup
        localStorage.setItem('mikaela_users_backup', JSON.stringify(this.auth.users));

        // Update accounts.json file
        try {
            // Buat data JSON yang akan disimpan
            const dataToSave = {
                users: this.auth.users,
                metadata: {
                    version: "2.0",
                    lastSync: new Date().toISOString(),
                    description: "User accounts data with base64 password encoding - Role-based access control",
                    totalUsers: this.auth.users.length,
                    adminCount: this.auth.users.filter(u => u.role === 'admin').length
                }
            };

            // Simpan ke file menggunakan teknik yang berbeda
            const dataStr = JSON.stringify(dataToSave, null, 2);

            // Buat blob dan download file
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'accounts.json';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            this.showNotification(
                `✅ Admin baru berhasil ditambahkan!\n\n` +
                `👤 Username: ${username}\n` +
                `📧 Email: ${email}\n` +
                `🔑 Password: ${password}\n` +
                `🛡️ Role: admin\n\n` +
                `📁 File accounts.json telah di-download.\n` +
                `Silakan ganti file accounts.json lama dengan file yang baru.`,
                'success'
            );

        } catch (error) {
            console.error('Error saving admin:', error);
            this.showNotification(
                `✅ Admin baru berhasil ditambahkan ke sistem!\n\n` +
                `👤 Username: ${username}\n` +
                `📧 Email: ${email}\n` +
                `🔑 Password: ${password}\n\n` +
                `⚠️ Gagal membuat file backup otomatis.\n` +
                `Data tersimpan di localStorage.`,
                'success'
            );
        }

        // Tutup form dan refresh daftar user
        setTimeout(() => {
            const formPanel = document.querySelector('.add-admin-panel');
            if (formPanel) {
                formPanel.remove();
            }
            // Refresh daftar user
            this.showUserList();
        }, 4000);
    }

    // Show add admin form
    showAddAdminForm() {
        const formPanel = document.createElement('div');
        formPanel.className = 'add-admin-panel';
        formPanel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #e74c3c;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10002;
                max-width: 450px;
                width: 90%;
            ">
                <h3 style="margin-top: 0; color: #e74c3c; text-align: center;">👤+ Tambah Admin Baru</h3>

                <form id="addAdminForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="text-align: left;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Username:</label>
                        <input type="text" id="newAdminUsername" placeholder="Masukkan username admin baru" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 14px;
                        ">
                    </div>

                    <div style="text-align: left;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Email:</label>
                        <input type="email" id="newAdminEmail" placeholder="Masukkan email admin baru" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 14px;
                        ">
                    </div>

                    <div style="text-align: left;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Password:</label>
                        <input type="password" id="newAdminPassword" placeholder="Masukkan password admin baru" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 14px;
                        ">
                    </div>

                    <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <small style="color: #856404;">
                            💡 <strong>Catatan:</strong> Password akan otomatis dienkripsi ke format base64
                        </small>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button type="submit" style="
                            flex: 1;
                            padding: 12px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                        ">✅ Tambah Admin</button>

                        <button type="button" onclick="document.querySelector('.add-admin-panel').remove()" style="
                            flex: 1;
                            padding: 12px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                        ">❌ Batal</button>
                    </div>
                </form>
            </div>
        `;

        // Tambah overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            backdrop-filter: blur(2px);
        `;
        overlay.onclick = () => {
            formPanel.remove();
            overlay.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(formPanel);

        // Handle form submission
        document.getElementById('addAdminForm').onsubmit = (e) => {
            e.preventDefault();
            this.handleAddAdmin();
        };
    }

    // Show notification
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

// Initialize admin panel when auth system is ready
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth system to be initialized
    const checkAuth = setInterval(() => {
        if (window.auth) {
            adminPanel = new AdminPanel(window.auth);
            clearInterval(checkAuth);
        }
    }, 100);
});
