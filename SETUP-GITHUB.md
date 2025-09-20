# 🚀 Setup GitHub Cross-Device Authentication System

Panduan lengkap untuk menghubungkan sistem Save Akun dengan GitHub Anda.

## 📋 Langkah-langkah Setup

### 1. Buat Repository GitHub Baru

1. **Login ke GitHub** di https://github.com
2. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
3. Isi detail repository:
   - **Repository name**: `mikaela-auth-system` (atau nama yang Anda suka)
   - **Description**: `Cross-device authentication system untuk website Mikaela`
   - **Visibility**: ✅ **Private** (untuk keamanan data user)
   - **⚠️ JANGAN centang**: "Add a README file" (karena kita sudah punya)
4. Klik **"Create repository"**

### 2. Setup GitHub OAuth App

1. Buka https://github.com/settings/developers
2. Klik **"OAuth Apps"** di sidebar kiri
3. Klik **"New OAuth App"**
4. Isi form:
   - **Application name**: `Mikaela Auth System`
   - **Homepage URL**: `http://localhost:3000` (atau domain Anda)
   - **Application description**: `Cross-device authentication untuk website Mikaela`
   - **Authorization callback URL**: `http://localhost:3000/github-callback.html`
5. Klik **"Register application"**
6. **Copy Client ID dan Client Secret** - ini akan digunakan di config

### 3. Update Konfigurasi

Buka file `github-config.js` dan ganti:

```javascript
this.clientId = 'YOUR_GITHUB_CLIENT_ID'; // Ganti dengan Client ID dari GitHub
this.clientSecret = 'YOUR_GITHUB_CLIENT_SECRET'; // Ganti dengan Client Secret
```

### 4. Push Code ke Repository Baru

```bash
# Clone repository baru Anda
git clone https://github.com/YOUR_USERNAME/mikaela-auth-system.git

# Copy semua file dari project ini ke repository baru
# Atau push dari repository ini jika Anda punya akses

# Push ke GitHub
git add .
git commit -m "Initial commit - GitHub auth system"
git push origin main
```

## 🔧 Testing Sistem

### 1. Jalankan Local Server
```bash
# Pastikan server authentication berjalan
cd server-auth-system
npm install
npm start
```

### 2. Buka di Browser
```
http://localhost:3000/home.html
```

### 3. Test GitHub Login
1. Klik **"🔗 Login dengan GitHub"**
2. Authorize aplikasi
3. Sistem akan otomatis buat repository di GitHub Anda
4. Coba akses dari device lain dengan GitHub account yang sama

## 📱 Cara Menggunakan

### Login dari Device Baru:
1. Buka `http://localhost:3000/home.html` di device baru
2. Klik **"🔗 Login dengan GitHub"**
3. Login dengan GitHub account yang sama
4. Data akan otomatis ter-sync dari repository GitHub

### Kelola Device:
1. Klik **"📱 Kelola Device"** atau buka `device-dashboard.html`
2. Lihat semua device yang terhubung
3. Hapus device yang tidak dikenal
4. Export data device untuk backup

## 🔐 Keamanan

### Repository Security:
- ✅ Repository **Private** - data tidak terlihat publik
- ✅ Access token terenkripsi di localStorage
- ✅ Device verification otomatis
- ✅ Session timeout untuk keamanan

### Data Protection:
- Data user tersimpan di repository pribadi GitHub
- Tidak ada data sensitif di localStorage
- Secure API calls dengan authentication
- Auto backup setiap perubahan

## 🆘 Troubleshooting

### Error: "Repository access denied"
- Pastikan repository visibility = **Private**
- Cek permission OAuth app
- Verify callback URL sudah benar

### Error: "OAuth callback failed"
- Cek Authorization callback URL di GitHub OAuth app
- Pastikan URL mengarah ke `github-callback.html`
- Verify Client ID dan Secret sudah benar

### Error: "Cannot create repository"
- Pastikan GitHub account Anda punya akses untuk buat repository
- Cek quota repository (GitHub free = unlimited private repos)
- Pastikan nama repository belum digunakan

## 📞 Support

Jika ada masalah:
1. Cek console browser (F12) untuk error messages
2. Verify setup di GitHub OAuth app
3. Test dengan repository baru jika perlu
4. Cek dokumentasi di `README.md`

## 🎉 Selamat!

Setelah setup selesai, Anda sudah punya sistem Save Akun cross-device yang:
- ✅ Login dengan GitHub dari berbagai device
- ✅ Auto-sync data antar device
- ✅ Device management dan monitoring
- ✅ Backup otomatis ke GitHub
- ✅ Secure dan private

Sistem siap digunakan! 🚀
