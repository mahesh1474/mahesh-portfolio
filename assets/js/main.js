/* ═══════════════════════════════════════════════════
   main.js — Portfolio JavaScript
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   AOS — scroll animations (init after DOM ready)
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 750, once: true, offset: 60 });
});

/* ─────────────────────────────────────────────
   TYPED.JS — hero typewriter
───────────────────────────────────────────── */
window.addEventListener("load", function () {
  new Typed("#typing", {
    strings: [
      "Technology Analyst",
      "QA Automation Specialist",
      "Selenium &amp; Playwright Expert",
      "Framework Architect",
    ],
    typeSpeed: 60,
    backSpeed: 35,
    loop: true,
    backDelay: 1500,
  });
});

/* ─────────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  setTimeout(() => {
    loader.classList.add("loader-hidden");
    setTimeout(() => (loader.style.display = "none"), 800);
  }, 900);
});

/* ─────────────────────────────────────────────
   SCROLL — progress bar, scroll-top btn, navbar
───────────────────────────────────────────── */
const scrollTopBtn = document.getElementById("scrollTopBtn");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const s = document.documentElement.scrollTop;
  const h =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  document.getElementById("progressBar").style.width = (s / h) * 100 + "%";
  scrollTopBtn.style.display = s > 300 ? "flex" : "none";
  navbar.classList.toggle("scrolled", s > 50);
});

scrollTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK on scroll
───────────────────────────────────────────── */
const sectionEls = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener("scroll", () => {
  let current = "";
  sectionEls.forEach((sec) => {
    if (scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinkEls.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current)
      link.classList.add("active");
  });
});

/* ─────────────────────────────────────────────
   REVEAL on scroll
───────────────────────────────────────────── */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((r) => revObs.observe(r));

/* ─────────────────────────────────────────────
   ANIMATED COUNTERS
───────────────────────────────────────────── */
const cntObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let count = 0;
      const inc = target / 55;
      const run = () => {
        if (count < target) {
          count += inc;
          el.innerText = Math.ceil(count);
          requestAnimationFrame(run);
        } else el.innerText = target + "+";
      };
      run();
      cntObs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".counter").forEach((c) => cntObs.observe(c));

/* ─────────────────────────────────────────────
   EXPERIENCE — project expand / collapse
───────────────────────────────────────────── */
const expBtn = document.querySelector(".expand-btn");
const projDet = document.querySelector(".proj-details");
if (expBtn && projDet) {
  expBtn.addEventListener("click", () => {
    projDet.classList.toggle("show");
    expBtn.textContent = projDet.classList.contains("show")
      ? "Hide Projects ▲"
      : "View Projects ▼";
  });
}

/* ─────────────────────────────────────────────
   THEME TOGGLE — dark / light
───────────────────────────────────────────── */
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "light") themeToggle.checked = true;

themeToggle?.addEventListener("change", function () {
  document.documentElement.classList.toggle("light-theme", this.checked);
  localStorage.setItem("theme", this.checked ? "light" : "dark");
});

/* ─────────────────────────────────────────────
   CONTACT FORM — validation + success toast
───────────────────────────────────────────── */
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message").value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  if (!name || !emailRe.test(email) || msg.length < 10) return;

  const toast = document.createElement("div");
  toast.style.cssText = [
    "color:var(--green)",
    "font-size:0.85rem",
    "font-weight:500",
    "margin-top:14px",
    "display:flex",
    "align-items:center",
    "gap:8px",
  ].join(";");
  toast.innerHTML =
    '<i class="fa-solid fa-circle-check"></i> Message sent successfully!';
  e.target.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
  e.target.reset();
});

/* ─────────────────────────────────────────────
   MOBILE SIDEBAR — open / close / overlay
───────────────────────────────────────────── */
const navMenu = document.getElementById("navMenu");
const toggler = document.querySelector(".custom-toggler");
const overlay = document.querySelector(".mobile-overlay");

function openNav() {
  navMenu.classList.add("show");
  toggler.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeNav() {
  navMenu.classList.remove("show");
  toggler.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

toggler?.addEventListener("click", () =>
  navMenu.classList.contains("show") ? closeNav() : openNav()
);
overlay?.addEventListener("click", closeNav);

document.querySelectorAll(".nav-link").forEach((l) =>
  l.addEventListener("click", () => {
    if (window.innerWidth < 992) closeNav();
  })
);

window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) closeNav();
});
