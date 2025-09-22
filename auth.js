/**
 * Applies the saved theme from localStorage.
 * Must be called as early as possible to prevent Flash of Unstyled Content (FOUC).
 */
function applyInitialTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
  document.documentElement.setAttribute("data-theme", savedTheme);
}

/**
 * Checks user's authentication state using Firebase.
 * If not logged in, redirects to the login page.
 * This function is asynchronous.
 * @param {function} onLoggedIn - A callback function to run if the user is logged in.
 */
function checkAuthentication(onLoggedIn) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // Pengguna sudah login, sekarang ambil data role dari Firestore
      try {
        const userDocRef = db.collection("users").doc(user.uid);
        const userDoc = await userDocRef.get();

        // Definisikan email admin utama di sini
        // Bandingkan dalam huruf kecil untuk menghindari masalah case-sensitivity
        const isAdminEmail =
          user.email.toLowerCase() === "raffz@everything.com";

        let userData;

        if (userDoc.exists) {
          // Dokumen pengguna sudah ada, gunakan datanya
          userData = userDoc.data();
          // Logika "Self-Healing": Perbaiki peran jika salah
          if (isAdminEmail && userData.role !== "admin") {
            console.log(`Memperbaiki peran untuk admin: ${user.email}`);
            await userDocRef.update({ role: "admin" });
            userData.role = "admin"; // Perbarui juga objek lokal
          }
        } else {
          // Dokumen pengguna TIDAK ada (misal: login Google pertama kali atau akun lama).
          // Solusi: Buat dokumen untuk mereka secara otomatis.
          console.log(`Membuat dokumen Firestore untuk pengguna: ${user.uid}`);
          userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "", // Ambil dari profil Google jika ada
            role: isAdminEmail ? "admin" : "user", // Set role dengan benar saat pembuatan
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          };
          await userDocRef.set(userData);
        }

        // Kirim data Auth dan data Firestore ke callback
        if (onLoggedIn) onLoggedIn(user, userData);
      } catch (error) {
        console.error(
          "Gagal mengambil/membuat data pengguna dari Firestore:",
          error
        );
        // Tampilkan pesan error yang jelas kepada pengguna
        alert(
          "Gagal memuat data profil dari database. Kemungkinan besar aturan keamanan Firestore Anda sudah kedaluwarsa. Silakan periksa Firebase Console -> Firestore Database -> Rules."
        );
        // Tampilkan halaman meskipun datanya mungkin tidak lengkap
        document.body.classList.remove("is-loading");
      }
    } else {
      // Pengguna tidak login, paksa kembali ke halaman login
      console.log("Pengguna tidak login, mengarahkan ke login.html");
      window.location.replace("login.html");
    }
  });
}

/**
 * Shows or hides admin-specific navigation links based on the user's role from Firestore.
 * @param {object} userData - The user data object from Firestore.
 */
function manageNavLinks(userData) {
  const accountListLink = document.getElementById("account-list-link");
  const addAdminLink = document.getElementById("add-admin-link");

  if (userData && userData.role === "admin") {
    // Jika pengguna adalah admin, tampilkan link
    if (accountListLink) accountListLink.style.display = "inline";
    if (addAdminLink) addAdminLink.style.display = "inline";
  } else {
    // Jika bukan admin, sembunyikan link
    if (accountListLink) accountListLink.style.display = "none";
    if (addAdminLink) addAdminLink.style.display = "none";
  }
}

/**
 * Attaches the logout event listener to the logout button.
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      auth.signOut().then(() => {
        // Logout berhasil, Firebase akan otomatis mengarahkan
        // (atau kita bisa paksa jika perlu)
        window.location.href = "login.html";
      });
    });
  }
}

/**
 * Attaches the theme switcher event listener to the theme toggle button.
 */
function setupThemeSwitcher() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    // Set initial text
    themeToggleBtn.textContent =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "Mode Terang"
        : "Mode Gelap";

    themeToggleBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      themeToggleBtn.textContent =
        newTheme === "dark" ? "Mode Terang" : "Mode Gelap";
    });
  }
}

/**
 * Secures a page for admin access only.
 * Redirects non-admins to the homepage.
 * This function assumes the user is already logged in.
 */
function protectAdminRoute() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists && userDoc.data().role === "admin") {
        // Pengguna adalah admin, biarkan akses.
      } else {
        // Pengguna bukan admin, tendang.
        alert("Anda tidak memiliki hak akses untuk halaman ini.");
        window.location.replace("index.html");
      }
    } else {
      // Tidak ada pengguna yang login, tendang.
      // (checkAuthentication seharusnya sudah menangani ini, tapi sebagai pengaman tambahan)
      window.location.replace("login.html");
    }
  });
}
