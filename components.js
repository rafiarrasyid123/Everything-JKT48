/**
 * Creates and manages the "Scroll to Top" button.
 */
function setupScrollToTopButton() {
  // Create the button element
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scroll-to-top-btn";
  scrollToTopBtn.title = "Kembali ke atas";
  scrollToTopBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5"></path>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  `;
  document.body.appendChild(scrollToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top when clicked
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Loads reusable HTML components into placeholders.
 */
document.addEventListener("DOMContentLoaded", function () {
  // --- Load Footer ---
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("_footer.html")
      .then((response) => {
        if (response.ok) return response.text();
        throw new Error("Gagal memuat footer.");
      })
      .then((data) => {
        footerPlaceholder.innerHTML = data;

        // --- Animate Footer on Scroll ---
        const footerElement = footerPlaceholder.querySelector(".footer");
        if (footerElement) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  footerElement.classList.add("visible");
                  observer.unobserve(footerElement); // Hentikan observasi setelah animasi berjalan
                }
              });
            },
            { threshold: 0.1 } // Picu saat 10% elemen terlihat
          );
          observer.observe(footerElement);
        }
      })
      .catch((error) => console.error("Error memuat komponen:", error));
  }

  // --- Setup Scroll to Top Button ---
  setupScrollToTopButton();
});
