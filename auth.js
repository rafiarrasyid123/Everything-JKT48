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
  // Menggunakan onAuthStateChanged untuk memantau status login secara real-time
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Pengguna sudah login
      if (onLoggedIn) {
        onLoggedIn(user); // Jalankan callback dan kirim data pengguna
      }
    } else {
      // Pengguna tidak login, paksa kembali ke halaman login
      console.log("Pengguna tidak login, mengarahkan ke login.html");
      window.location.replace("login.html");
    }
  });
}

/**
 * Shows or hides admin-specific navigation links based on the logged-in user's email.
 * @param {object} user - The user object from Firebase Auth.
 */
function manageNavLinks(user) {
  // GANTI DENGAN EMAIL ADMIN ANDA
  const ADMIN_EMAIL = "Raffz@Everything.com";

  const accountListLink = document.getElementById("account-list-link");
  const addAdminLink = document.getElementById("add-admin-link");

  if (user && user.email === ADMIN_EMAIL) {
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
  // GANTI DENGAN EMAIL ADMIN ANDA
  const ADMIN_EMAIL = "Raffz@Everything.com";

  auth.onAuthStateChanged((user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
      // Jika tidak ada user atau email tidak cocok dengan email admin
      alert("Anda tidak memiliki hak akses untuk halaman ini.");
      window.location.replace("index.html");
    }
  });
}
