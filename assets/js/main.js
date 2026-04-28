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
   EMAILJS CONFIG — Replace these 3 values!
   Step 1: Sign up at https://www.emailjs.com
   Step 2: Add Gmail service → copy Service ID
   Step 3: Create email template → copy Template ID
   Step 4: Account → API Keys → copy Public Key
───────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";    // ← replace
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";    // ← replace
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";   // ← replace

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/* ─────────────────────────────────────────────
   CONTACT FORM — EmailJS real mail sender
───────────────────────────────────────────── */
document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const msg     = document.getElementById("message").value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  // Basic validation
  if (!name || !emailRe.test(email) || msg.length < 10) {
    showFormMsg("error", "Please fill all required fields correctly.");
    return;
  }

  // Disable button & show sending state
  const btn = this.querySelector(".send-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  // EmailJS template params — matches your template variables
  const templateParams = {
    from_name  : name,
    from_email : email,
    subject    : subject || "Portfolio Contact",
    message    : msg,
    reply_to   : email,
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      // Success
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("success", "Message sent! I'll get back to you soon. 🎉");
      e.target.reset();
    })
    .catch((err) => {
      // Error
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("error", "Oops! Something went wrong. Please try WhatsApp.");
      console.error("EmailJS error:", err);
    });
});

/* Helper — show form status message */
function showFormMsg(type, text) {
  // Remove any existing message
  const existing = document.getElementById("formMsg");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.id = "formMsg";
  const isSuccess = type === "success";
  msg.style.cssText = [
    "margin-top:14px",
    "padding:12px 16px",
    "border-radius:10px",
    "font-size:0.85rem",
    "font-weight:500",
    "display:flex",
    "align-items:center",
    "gap:8px",
    isSuccess
      ? "color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25)"
      : "color:#f87171;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25)",
  ].join(";");
  msg.innerHTML = isSuccess
    ? '<i class="fa-solid fa-circle-check"></i> ' + text
    : '<i class="fa-solid fa-circle-xmark"></i> ' + text;

  document.getElementById("contactForm").appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

/* ─────────────────────────────────────────────
   MOBILE SIDEBAR — open / close / overlay / swipe fix
───────────────────────────────────────────── */
const navMenu = document.getElementById("navMenu");
const toggler = document.querySelector(".custom-toggler");
const overlay = document.querySelector(".mobile-overlay");

function openNav() {
  navMenu.classList.add("show");
  toggler.classList.add("active");
  overlay.classList.add("active");
  // Lock body scroll but keep sidebar scrollable
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}
function closeNav() {
  navMenu.classList.remove("show");
  toggler.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
}

toggler?.addEventListener("click", () =>
  navMenu.classList.contains("show") ? closeNav() : openNav()
);
overlay?.addEventListener("click", closeNav);

// Close sidebar on nav link click (mobile)
document.querySelectorAll(".nav-link").forEach((l) =>
  l.addEventListener("click", () => {
    if (window.innerWidth < 992) closeNav();
  })
);

// Close on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) closeNav();
});

// ── Issue 3 fix: Block horizontal swipe/slide completely on mobile page ──
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  const dx = e.touches[0].clientX - touchStartX;
  const dy = e.touches[0].clientY - touchStartY;
  const insideSidebar = navMenu.contains(e.target);

  if (navMenu.classList.contains("show")) {
    // Sidebar open: allow vertical scroll inside sidebar only
    if (insideSidebar) {
      if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    } else {
      e.preventDefault(); // block overlay area completely
    }
  } else {
    // Sidebar closed: block any horizontal swipe on main page
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault();
    }
  }
}, { passive: false });

document.addEventListener("touchend", (e) => {
  if (!navMenu.classList.contains("show")) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Right swipe > 60px and mostly horizontal → close sidebar
  if (dx > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    closeNav();
  }
}, { passive: true });
