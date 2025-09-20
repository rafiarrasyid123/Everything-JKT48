<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Alur Autentikasi - Mikaela</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .test-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        .test-button:hover {
            background: #0056b3;
        }
        .test-button.danger {
            background: #dc3545;
        }
        .test-button.danger:hover {
            background: #c82333;
        }
        .test-button.success {
            background: #28a745;
        }
        .test-button.success:hover {
            background: #218838;
        }
        .test-button.admin {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }
        .test-button.admin:hover {
            background: linear-gradient(135deg, #c0392b, #a93226);
        }
        .result {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            background: #f8f9fa;
            border-left: 4px solid #007bff;
        }
        .error {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        .success {
            border-left-color: #28a745;
            background: #d4edda;
        }
        .warning {
            border-left-color: #ffc107;
            background: #fff3cd;
        }
        .info {
            border-left-color: #17a2b8;
            background: #d1ecf1;
        }
    </style>
</head>
<body>
    <h1>🧪 Test Alur Autentikasi - Mikaela</h1>
    <p>Pengujian alur login → halaman utama</p>

    <div class="test-container">
        <h3>📋 Skenario Pengujian</h3>
        <button class="test-button" onclick="testIndexRedirect()">🔄 Test Redirect Index.html</button>
        <button class="test-button" onclick="testHomeRedirect()">🏠 Test Redirect Home.html</button>
        <button class="test-button" onclick="testLoginFlow()">🔐 Test Alur Login Lengkap</button>
        <button class="test-button success" onclick="testAuthSystem()">⚙️ Test Sistem Auth</button>
        <button class="test-button admin" onclick="testAdminAccess()">🔐 Test Akses Admin</button>
        <button class="test-button danger" onclick="clearAuthData()">🗑️ Hapus Data Auth</button>
    </div>

    <div class="test-container">
        <h3>📊 Hasil Pengujian</h3>
        <div id="results"></div>
    </div>

    <div class="test-container">
        <h3>🔍 Status Saat Ini</h3>
        <div id="status"></div>
    </div>

    <!-- Load sistem auth -->
    <script src="auth.js"></script>

    <script>
        function addResult(message, type = 'info') {
            const resultsDiv = document.getElementById('results');
            const resultDiv = document.createElement('div');
            resultDiv.className = `result ${type}`;
            resultDiv.innerHTML = `<strong>[${type.toUpperCase()}]</strong> ${message}`;
            resultsDiv.appendChild(resultDiv);
            resultsDiv.scrollTop = resultsDiv.scrollHeight;
        }

        function updateStatus() {
            const statusDiv = document.getElementById('status');
            const currentUser = localStorage.getItem('mikaela_current_user');
            const users = localStorage.getItem('mikaela_users');

            let status = `
                <div class="result info">
                    📍 URL Saat Ini: ${window.location.href}<br>
                    🔐 Sistem Auth Siap: ${window.auth ? '✅' : '❌'}<br>
                    👤 User Saat Ini: ${currentUser ? '✅' : '❌'}<br>
                    👥 Total Pengguna: ${users ? JSON.parse(users).length : 0}<br>
                    🌐 Status Login: ${window.auth && window.auth.isLoggedIn() ? '✅' : '❌'}
                </div>
            `;

            if (currentUser) {
                try {
                    const user = JSON.parse(currentUser);
                    status += `
                        <div class="result success">
                            👤 Detail Pengguna:<br>
                            Username: ${user.username}<br>
                            Email: ${user.email}<br>
                            Role: ${user.role}<br>
                            Aktif: ${user.isActive ? '✅' : '❌'}
                        </div>
                    `;
                } catch (e) {
                    status += `<div class="result error">❌ Error parsing data pengguna</div>`;
                }
            }

            statusDiv.innerHTML = status;
        }

        function testIndexRedirect() {
            addResult('Menguji redirect index.html...', 'info');
            addResult('✅ Index.html seharusnya redirect ke login.html otomatis', 'success');
            addResult('📝 Test manual: Buka index.html di browser - seharusnya redirect ke login.html', 'warning');
        }

        function testHomeRedirect() {
            addResult('Menguji redirect home.html untuk pengguna yang belum login...', 'info');

            // Simulasi mengunjungi home.html tanpa login
            const originalLocation = window.location.href;

            // Cek apakah sistem auth redirect dengan benar
            if (window.auth && !window.auth.isLoggedIn()) {
                addResult('✅ Sistem auth terdeteksi: Belum login', 'success');
                addResult('🔄 Seharusnya redirect ke login.html saat akses home.html', 'warning');
                addResult('📝 Test manual: Coba akses home.html langsung - seharusnya redirect ke login', 'warning');
            } else {
                addResult('❌ Sistem auth belum siap atau pengguna sudah login', 'error');
            }
        }

        function testLoginFlow() {
            addResult('Menguji alur login lengkap...', 'info');
            addResult('1. Kunjungi index.html → seharusnya redirect ke login.html', 'info');
            addResult('2. Login dengan kredensial valid → seharusnya redirect ke home.html', 'info');
            addResult('3. Coba akses home.html langsung → seharusnya tetap di home.html', 'info');
            addResult('4. Logout → seharusnya redirect ke login.html', 'info');
            addResult('📝 Test manual: Ikuti langkah-langkah di atas di browser baru/incognito', 'warning');
        }

        function testAuthSystem() {
            addResult('Menguji fungsi sistem auth...', 'info');

            if (window.auth) {
                addResult('✅ Sistem auth berhasil dimuat', 'success');

                // Test loading user
                if (window.auth.users && window.auth.users.length > 0) {
                    addResult(`✅ Pengguna berhasil dimuat: ${window.auth.users.length} pengguna`, 'success');
                } else {
                    addResult('⚠️ Tidak ada pengguna yang dimuat (normal untuk instalasi baru)', 'warning');
                }

                // Test status login
                const isLoggedIn = window.auth.isLoggedIn();
                addResult(`🔐 Status Login: ${isLoggedIn ? 'Sudah login' : 'Belum login'}`, isLoggedIn ? 'success' : 'warning');

                // Test current user
                const currentUser = window.auth.getCurrentUser();
                if (currentUser) {
                    addResult(`👤 Pengguna Saat Ini: ${currentUser.username} (${currentUser.role})`, 'success');
                } else {
                    addResult('👤 Tidak ada pengguna saat ini', 'info');
                }

            } else {
                addResult('❌ Sistem auth tidak berhasil dimuat', 'error');
            }
        }

        function testAdminAccess() {
            addResult('🧪 Menguji akses admin...', 'info');

            if (!window.auth) {
                addResult('❌ Sistem auth belum siap', 'error');
                return;
            }

            // Cek pengguna saat ini
            const currentUser = window.auth.getCurrentUser();
            if (!currentUser) {
                addResult('⚠️ Tidak ada pengguna yang login saat ini', 'warning');
                addResult('📝 Test manual: Login terlebih dahulu untuk menguji akses admin', 'info');
                return;
            }

            // Cek role pengguna
            if (currentUser.role === 'admin') {
                addResult(`✅ Pengguna saat ini adalah admin: ${currentUser.username}`, 'success');
                addResult('🔐 Akses admin.html seharusnya diizinkan', 'success');
                addResult('📝 Test manual: Coba akses admin.html - seharusnya bisa masuk', 'info');

                // Test fitur admin
                if (window.auth.users && window.auth.users.length > 0) {
                    const adminCount = window.auth.users.filter(u => u.role === 'admin').length;
                    const userCount = window.auth.users.length;
                    addResult(`👥 Total Pengguna: ${userCount}, Admin Users: ${adminCount}`, 'info');
                }

                // Test akses ke admin panel
                addResult('🔗 Test akses admin panel: admin.html', 'info');
                addResult('✅ Admin panel seharusnya dapat diakses', 'success');

            } else {
                addResult(`⚠️ Pengguna saat ini bukan admin: ${currentUser.username} (${currentUser.role})`, 'warning');
                addResult('🚫 Akses admin.html seharusnya ditolak', 'warning');
                addResult('📝 Test manual: Coba akses admin.html - seharusnya redirect ke home', 'info');

                // Test redirect untuk non-admin
                addResult('🔄 Non-admin seharusnya redirect ke home.html saat akses admin.html', 'warning');
            }

            // Test struktur role
            if (window.auth.users) {
                const roles = [...new Set(window.auth.users.map(u => u.role))];
                addResult(`📊 Role yang tersedia: ${roles.join(', ')}`, 'info');

                // Cek apakah ada admin
                const hasAdmin = window.auth.users.some(u => u.role === 'admin');
                addResult(`👤 Ada admin user: ${hasAdmin ? '✅' : '❌'}`, hasAdmin ? 'success' : 'warning');
            }

            addResult('📋 Test selesai. Gunakan browser untuk verifikasi manual.', 'info');
        }

        function clearAuthData() {
            localStorage.removeItem('mikaela_current_user');
            localStorage.removeItem('mikaela_users');
            addResult('🗑️ Data auth dihapus - pengguna logout', 'warning');
            updateStatus();

            // Reload sistem auth
            if (window.auth) {
                window.auth.initializeAuth().then(() => {
                    addResult('✅ Sistem auth diinisialisasi ulang', 'success');
                    updateStatus();
                });
            }
        }

        // Update status saat halaman dimuat
        document.addEventListener('DOMContentLoaded', () => {
            updateStatus();

            // Tunggu sebentar untuk sistem auth inisialisasi
            setTimeout(() => {
                updateStatus();
            }, 1000);
        });

        // Monitor perubahan sistem auth
        setInterval(updateStatus, 5000);
    </script>
</body>
</html>
