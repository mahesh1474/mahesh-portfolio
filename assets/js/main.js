/* ═══════════════════════════════════════════════
   main.js — Portfolio JavaScript (All Fixes Applied)
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   AOS — scroll animations
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
   FIX 2: MOBILE IMAGE FLIP — tap toggles flip,
   tap again to flip back. Outside click resets.
───────────────────────────────────────────── */
const flipCard = document.getElementById("flipCard");
const tapHint = document.querySelector(".tap-hint");
let isFlipped = false;

if (flipCard) {
  flipCard.addEventListener("click", (e) => {
    // Only handle tap/click on mobile (no hover capability)
    if (window.matchMedia("(hover: none)").matches) {
      e.stopPropagation();
      isFlipped = !isFlipped;
      flipCard.classList.toggle("flipped", isFlipped);
      // Update tap hint text
      if (tapHint) {
        tapHint.innerHTML = isFlipped
          ? '<i class="fa-solid fa-hand-pointer"></i> Tap to flip back'
          : '<i class="fa-solid fa-hand-pointer"></i> Tap to flip';
      }
    }
  });
}

/* ─────────────────────────────────────────────
   EMAILJS CONFIG — Replace these 3 values!
   Step 1: Sign up at https://www.emailjs.com
   Step 2: Add Gmail service → copy Service ID
   Step 3: Create email template → copy Template ID
   Step 4: Account → API Keys → copy Public Key
───────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = "YfNbrehdyBUjv5iZZ";
const EMAILJS_SERVICE_ID  = "service_z70q1gg";
const EMAILJS_TEMPLATE_ID = "template_51vvyol";

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/* ─────────────────────────────────────────────
   FIX 4: CONTACT FORM — Friendly real-time
   validation + EmailJS sender
───────────────────────────────────────────── */

const nameInput    = document.getElementById("name");
const emailInput   = document.getElementById("email");
const msgTextarea  = document.getElementById("message");
const charCount    = document.getElementById("charCount");
const nameErr      = document.getElementById("nameErr");
const emailErr     = document.getElementById("emailErr");
const msgErr       = document.getElementById("msgErr");

const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* ── Validation helpers ── */
function showFieldError(errEl, inputEl, msg) {
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.add("show");
  }
  if (inputEl) {
    inputEl.classList.remove("valid");
    inputEl.classList.add("error");
  }
}
function clearFieldError(errEl, inputEl) {
  if (errEl) {
    errEl.textContent = "";
    errEl.classList.remove("show");
  }
  if (inputEl) inputEl.classList.remove("error");
}
function markValid(inputEl) {
  if (inputEl) {
    inputEl.classList.remove("error");
    inputEl.classList.add("valid");
  }
}

/* ── Real-time: Name ── */
nameInput?.addEventListener("input", () => {
  const val = nameInput.value.trim();
  if (!val) {
    showFieldError(nameErr, nameInput, "Please enter your full name.");
  } else if (val.length < 2) {
    showFieldError(nameErr, nameInput, "Name must be at least 2 characters.");
  } else {
    clearFieldError(nameErr, nameInput);
    markValid(nameInput);
  }
});

/* ── Real-time: Email ── */
emailInput?.addEventListener("input", () => {
  const val = emailInput.value.trim();
  if (!val) {
    showFieldError(emailErr, emailInput, "Please enter your email address.");
  } else if (!emailRe.test(val)) {
    showFieldError(emailErr, emailInput, "Please enter a valid email (e.g. you@example.com).");
  } else {
    clearFieldError(emailErr, emailInput);
    markValid(emailInput);
  }
});

/* ── Real-time: Message character count ── */
msgTextarea?.addEventListener("input", () => {
  const len = msgTextarea.value.trim().length;
  if (charCount) {
    if (len < 10) {
      charCount.textContent = `${len} / 10 min characters`;
      charCount.classList.remove("ok");
      showFieldError(msgErr, msgTextarea, "Message must be at least 10 characters.");
    } else {
      charCount.textContent = `${len} characters — looks good!`;
      charCount.classList.add("ok");
      clearFieldError(msgErr, msgTextarea);
      markValid(msgTextarea);
    }
  }
});

/* ── Form submit ── */
document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name    = nameInput?.value.trim()    || "";
  const email   = emailInput?.value.trim()   || "";
  const subject = document.getElementById("subject")?.value.trim() || "";
  const msg     = msgTextarea?.value.trim()  || "";

  // Full validation on submit
  let hasError = false;

  if (!name || name.length < 2) {
    showFieldError(nameErr, nameInput, "Please enter your full name (at least 2 characters).");
    hasError = true;
  }
  if (!email || !emailRe.test(email)) {
    showFieldError(emailErr, emailInput, "Please enter a valid email address (e.g. you@gmail.com).");
    hasError = true;
  }
  if (msg.length < 10) {
    showFieldError(msgErr, msgTextarea, "Message is too short — please write at least 10 characters.");
    hasError = true;
  }

  if (hasError) {
    // Scroll to first error
    const firstError = document.querySelector(".form-group input.error, .form-group textarea.error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Disable button & show sending state
  const btn = this.querySelector(".send-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  // EmailJS template params
  const templateParams = {
    from_name  : name,
    from_email : email,
    subject    : subject || "Portfolio Contact",
    message    : msg,
    reply_to   : email,
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("success", "Message sent! I'll get back to you soon. 🎉");
      e.target.reset();
      // Reset visual states
      [nameInput, emailInput, msgTextarea].forEach(el => {
        el?.classList.remove("valid", "error");
      });
      if (charCount) {
        charCount.textContent = "0 / 10 min characters";
        charCount.classList.remove("ok");
      }
    })
    .catch((err) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("error", "Oops! Something went wrong. Please try WhatsApp or email directly.");
      console.error("EmailJS error:", err);
    });
});

/* Helper — show form status message */
function showFormMsg(type, text) {
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
  setTimeout(() => msg?.remove(), 6000);
}

/* ─────────────────────────────────────────────
   MOBILE SIDEBAR — FIX 1: open/close/overlay
───────────────────────────────────────────── */
const navMenu = document.getElementById("navMenu");
const toggler = document.querySelector(".custom-toggler");
const overlay = document.querySelector(".mobile-overlay");

function openNav() {
  navMenu.classList.add("show");
  toggler.classList.add("active");
  overlay.classList.add("active");
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

/* ─────────────────────────────────────────────
   FIX 3 (Issue 3): Block horizontal swipe
───────────────────────────────────────────── */
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
    if (insideSidebar) {
      if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    } else {
      e.preventDefault();
    }
  } else {
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault();
    }
  }
}, { passive: false });

document.addEventListener("touchend", (e) => {
  if (!navMenu.classList.contains("show")) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dx > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    closeNav();
  }
}, { passive: true });
