const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navbar = document.querySelector(".nav");
const mobileLayout = window.matchMedia("(max-width: 850px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenuOpen(open) {
  navLinks.classList.toggle("show", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  if (open) navbar.classList.remove("nav-hidden");
}

menuBtn.addEventListener("click", () => {
  setMenuOpen(menuBtn.getAttribute("aria-expanded") !== "true");
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("show")) {
    setMenuOpen(false);
    menuBtn.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!navbar.contains(event.target)) setMenuOpen(false);
});

mobileLayout.addEventListener("change", () => setMenuOpen(false));

// Content stays visible unless the observer is initialized successfully.
const sections = document.querySelectorAll(".reveal");
let animationObserver;
function revealAllSections() {
  animationObserver?.disconnect();
  sections.forEach((section) => section.classList.remove("reveal-pending"));
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  try {
    animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    sections.forEach((section) => {
      animationObserver.observe(section);
      section.classList.add("reveal-pending");
    });
  } catch {
    revealAllSections();
  }
}
reducedMotion.addEventListener("change", (event) => {
  if (event.matches) revealAllSections();
});

let lastScrollTop = Math.max(0, window.scrollY);
let scrollDirection = 0;
let scrollDistance = 0;
const scrollThreshold = 10;

window.addEventListener("scroll", () => {
  const scrollTop = Math.max(0, window.scrollY);
  const delta = scrollTop - lastScrollTop;
  lastScrollTop = scrollTop;

  if (scrollTop <= 150 || navLinks.classList.contains("show")
    || navbar.contains(document.activeElement)) {
    navbar.classList.remove("nav-hidden");
    scrollDirection = 0;
    scrollDistance = 0;
    return;
  }
  if (delta === 0) return;

  const direction = Math.sign(delta);
  scrollDistance = direction === scrollDirection
    ? scrollDistance + Math.abs(delta) : Math.abs(delta);
  scrollDirection = direction;
  if (scrollDistance < scrollThreshold) return;

  const hide = direction > 0;
  if (navbar.classList.contains("nav-hidden") !== hide) {
    navbar.classList.toggle("nav-hidden", hide);
  }
  scrollDistance = 0;
}, { passive: true });
navbar.addEventListener("focusin", () => navbar.classList.remove("nav-hidden"));
