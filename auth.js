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
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Pengguna sudah login
      if (onLoggedIn) {
        onLoggedIn(user);
      }
    } else {
      // Pengguna tidak login, paksa kembali ke halaman login
      console.log("Pengguna tidak login, mengarahkan ke login.html");
      window.location.replace("login.html");
    }
  });
}

/**
 * Hides admin-specific navigation links if the current user is not an admin.
 */
function manageNavLinks() {
  const userRole = localStorage.getItem("userRole");
  // NOTE: Manajemen role dengan Firebase adalah fitur lanjutan (Custom Claims).
  // Untuk saat ini, kita akan sembunyikan link admin secara default.
  const accountListLink = document.getElementById("account-list-link");
  if (accountListLink) accountListLink.style.display = "none";
  const addAdminLink = document.getElementById("add-admin-link");
  if (addAdminLink) addAdminLink.style.display = "none";
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
  // NOTE: Fungsi ini tidak lagi valid karena role tidak disimpan di localStorage.
  // Implementasi role-based access control memerlukan Firebase Cloud Functions.
  // Untuk sementara, kita bisa memanggil manageNavLinks() untuk menyembunyikan link.
}
