const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const prototypeForm = document.querySelector("#prototypeForm");
const formNote = document.querySelector("#formNote");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (prototypeForm && formNote) {
  prototypeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent =
      "Prototype only: this form is not connected to email, CRM, or data storage yet.";
  });
}
