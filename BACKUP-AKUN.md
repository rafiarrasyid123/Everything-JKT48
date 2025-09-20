# 🔐 Backup & Restore Akun Mikaela

**⚠️ PENTING: Fitur backup/restore sekarang tersembunyi untuk keamanan!**

## 📋 Cara Mengakses Admin Panel

### Metode 1: Melalui Icon Admin (Tersembunyi)
1. Login ke akun Mikaela
2. Di halaman home, cari icon **⚙️** di navigation bar
3. Klik icon tersebut untuk membuka Admin Panel

### Metode 2: Akses Langsung
1. Pastikan sudah login ke akun
2. Akses langsung: `admin.html`

## 🎯 Fitur Admin Panel

### 💾 Backup Semua Akun
- Export semua akun dalam 1 file JSON
- Format: `mikaela-users-backup-YYYY-MM-DD.json`
- Berisi semua data user dengan metadata lengkap

### 📦 Export Individual Files
- Export setiap akun menjadi file terpisah
- Format: `mikaela-user-[username]-YYYY-MM-DD.json`
- Cocok untuk berbagi akun individual

### 📁 Restore dari Backup
- Import akun dari file backup yang sudah di-export
- Auto-merge dengan data existing
- Notifikasi sukses/error yang jelas

### 👥 Lihat Daftar User
- Tampilkan semua akun yang terdaftar
- Informasi: username, email, role, tanggal dibuat

## 🔒 Keamanan

- **Role-based Access Control** - icon admin hanya muncul untuk role "admin"
- **Admin Panel tersembunyi** - hanya bisa diakses melalui icon ⚙️
- **Auto-logout** - panel otomatis tertutup setelah 60 detik
- **Password terenkripsi** - disimpan dalam format base64
- **Cross-device compatible** - file backup bisa digunakan di device lain

## 👤 Sistem Role

### Admin Role
- **Username:** admin
- **Password:** admin
- **Akses:** Semua fitur admin panel
- **Icon:** ⚙️ (merah) muncul di navigation

### User Role
- **Username:** user1, user2, testuser
- **Password:** user1, user2, test
- **Akses:** Tidak ada akses admin panel
- **Icon:** Tidak ada icon admin di navigation

## 📱 Cara Backup untuk Device Lain

1. **Di Device Lama:**
   - Login ke akun
   - Klik icon ⚙️ → "Backup Semua Akun"
   - Simpan file backup di tempat yang aman

2. **Di Device Baru:**
   - Login dengan akun yang sama
   - Klik icon ⚙️ → "Restore dari Backup"
   - Pilih file backup yang sudah di-download
   - Sistem akan auto-merge data

## 🚨 Troubleshooting

### File Backup Tidak Bisa Di-download
- Pastikan browser mengizinkan download
- Coba gunakan browser lain (Chrome/Firefox)
- Nonaktifkan ad-blocker sementara

### Import Data Gagal
- Pastikan file backup dalam format JSON yang benar
- Cek apakah file tidak corrupt
- Pastikan ukuran file tidak terlalu besar

### Admin Panel Tidak Muncul
- Pastikan sudah login ke akun
- Refresh halaman dan coba lagi
- Cek console browser untuk error message

## 💡 Tips Penggunaan

- **Backup rutin** setiap minggu untuk keamanan data
- **Simpan file backup** di cloud storage (Google Drive, OneDrive)
- **Test restore** di device lain untuk memastikan backup berfungsi
- **Jangan bagikan** file backup ke orang lain untuk keamanan

## 📞 Support

Jika mengalami masalah dengan fitur backup/restore, silakan hubungi admin sistem.

---

**🔐 Admin Panel Mikaela v2.0** - Fitur tersembunyi untuk keamanan maksimal
