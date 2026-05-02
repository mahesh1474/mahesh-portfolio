/* ═══════════════════════════════════════════════════════════
   main.js — Mahesh Portfolio
   FIX: Theme toggle inside sidebar does NOT close sidebar
═══════════════════════════════════════════════════════════ */

/* ─── AOS ─── */
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 800, once: true, offset: 60, easing: "ease-out-quart" });
});

/* ─── TYPED.JS ─── */
window.addEventListener("load", function () {
  new Typed("#typing", {
    strings: [
      "Technology Analyst",
      "QA Automation Specialist",
      "Selenium & Playwright Expert",
      "Framework Architect",
    ],
    typeSpeed: 55,
    backSpeed: 30,
    loop: true,
    backDelay: 1800,
    showCursor: false, // we use our own cursor span
  });

  /* ═══════════════════════════════════════════════════════════
     EMAILJS CONFIG — initialised after all scripts have loaded
  ═══════════════════════════════════════════════════════════ */
  emailjs.init(EMAILJS_PUBLIC_KEY);
});

/* ─── PAGE LOADER ─── */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  setTimeout(() => {
    loader.classList.add("loader-hidden");
    setTimeout(() => (loader.style.display = "none"), 800);
  }, 1000);
});

/* ─── SCROLL: progress bar, scroll-top btn, navbar ─── */
const scrollTopBtn = document.getElementById("scrollTopBtn");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const s = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById("progressBar").style.width = (s / h) * 100 + "%";
  scrollTopBtn.style.display = s > 300 ? "flex" : "none";
  navbar.classList.toggle("scrolled", s > 50);
});

scrollTopBtn?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ─── ACTIVE NAV LINK on scroll ─── */
const sectionEls = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener("scroll", () => {
  let current = "";
  sectionEls.forEach((sec) => {
    if (scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinkEls.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

/* ─── REVEAL on scroll ─── */
const revObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((r) => revObs.observe(r));

/* ─── ANIMATED COUNTERS ─── */
const cntObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let count = 0;
      const inc = target / 60;
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

/* ─── EXPERIENCE expand/collapse ─── */
const expBtn = document.querySelector(".expand-btn");
const projDet = document.querySelector(".proj-details");
if (expBtn && projDet) {
  expBtn.addEventListener("click", () => {
    const isOpen = projDet.classList.toggle("show");
    expBtn.classList.toggle("open", isOpen);
    expBtn.innerHTML = isOpen
      ? '<i class="fa-solid fa-folder-open me-1"></i> Hide Projects <i class="fa-solid fa-chevron-up ms-1 expand-icon"></i>'
      : '<i class="fa-solid fa-folder-open me-1"></i> View Projects <i class="fa-solid fa-chevron-down ms-1 expand-icon"></i>';
  });
}

/* ═══════════════════════════════════════════════════════════
   MOBILE SIDEBAR — open / close / overlay
═══════════════════════════════════════════════════════════ */
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

// Close sidebar when nav LINKS (not theme toggle) are clicked
document.querySelectorAll(".nav-link").forEach((l) =>
  l.addEventListener("click", () => {
    if (window.innerWidth < 992) closeNav();
  })
);

// Close on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) closeNav();
});

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE — dark / light
   BUG FIX: stopPropagation so clicking the theme toggle
   inside the sidebar does NOT trigger overlay/close logic
═══════════════════════════════════════════════════════════ */
const themeToggle = document.getElementById("themeToggle");

// Restore saved theme state
if (localStorage.getItem("theme") === "light") {
  if (themeToggle) themeToggle.checked = true;
}

themeToggle?.addEventListener("change", function () {
  document.documentElement.classList.toggle("light-theme", this.checked);
  localStorage.setItem("theme", this.checked ? "light" : "dark");
  // Close sidebar on mobile after theme toggle
  if (window.innerWidth < 992) {
    setTimeout(() => closeNav(), 300);
  }
});

// ─── KEY FIX: The .nav-theme-wrap click must NOT bubble up
//     to the overlay or any document-level close handlers.
const themeWrap = document.querySelector(".nav-theme-wrap");
themeWrap?.addEventListener("click", function (e) {
  // Stop this click from reaching the mobile-overlay click listener
  e.stopPropagation();
});

/* ═══════════════════════════════════════════════════════════
   HERO IMAGE FLIP — tap to flip on mobile, hover on desktop
═══════════════════════════════════════════════════════════ */
const flipCard = document.getElementById("flipCard");
const tapHint = document.querySelector(".tap-hint");
let isFlipped = false;

if (flipCard) {
  flipCard.addEventListener("click", (e) => {
    if (window.matchMedia("(hover: none)").matches) {
      e.stopPropagation();
      isFlipped = !isFlipped;
      flipCard.classList.toggle("flipped", isFlipped);
      if (tapHint) {
        tapHint.innerHTML = isFlipped
          ? '<i class="fa-solid fa-hand-pointer"></i> Tap to flip back'
          : '<i class="fa-solid fa-hand-pointer"></i> Tap to flip';
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   EMAILJS CONFIG
═══════════════════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = "YfNbrehdyBUjv5iZZ";
const EMAILJS_SERVICE_ID  = "service_z70q1gg";
const EMAILJS_TEMPLATE_ID = "template_51vvyol";

/* ─── CONTACT FORM — validation + EmailJS ─── */
const nameInput   = document.getElementById("name");
const emailInput  = document.getElementById("email");
const msgTextarea = document.getElementById("message");
const charCount   = document.getElementById("charCount");
const nameErr     = document.getElementById("nameErr");
const emailErr    = document.getElementById("emailErr");
const msgErr      = document.getElementById("msgErr");

const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function showFieldError(errEl, inputEl, msg) {
  if (errEl) { errEl.textContent = msg; errEl.classList.add("show"); }
  if (inputEl) { inputEl.classList.remove("valid"); inputEl.classList.add("error"); }
}
function clearFieldError(errEl, inputEl) {
  if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
  if (inputEl) inputEl.classList.remove("error");
}
function markValid(inputEl) {
  if (inputEl) { inputEl.classList.remove("error"); inputEl.classList.add("valid"); }
}

nameInput?.addEventListener("input", () => {
  const val = nameInput.value.trim();
  if (!val) showFieldError(nameErr, nameInput, "Please enter your full name.");
  else if (val.length < 2) showFieldError(nameErr, nameInput, "Name must be at least 2 characters.");
  else { clearFieldError(nameErr, nameInput); markValid(nameInput); }
});

emailInput?.addEventListener("input", () => {
  const val = emailInput.value.trim();
  if (!val) showFieldError(emailErr, emailInput, "Please enter your email address.");
  else if (!emailRe.test(val)) showFieldError(emailErr, emailInput, "Please enter a valid email (e.g. you@example.com).");
  else { clearFieldError(emailErr, emailInput); markValid(emailInput); }
});

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

document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name    = nameInput?.value.trim()    || "";
  const email   = emailInput?.value.trim()   || "";
  const subject = document.getElementById("subject")?.value.trim() || "";
  const msg     = msgTextarea?.value.trim()  || "";

  let hasError = false;
  if (!name || name.length < 2) { showFieldError(nameErr, nameInput, "Please enter your full name."); hasError = true; }
  if (!email || !emailRe.test(email)) { showFieldError(emailErr, emailInput, "Please enter a valid email address."); hasError = true; }
  if (msg.length < 10) { showFieldError(msgErr, msgTextarea, "Message is too short — please write at least 10 characters."); hasError = true; }

  if (hasError) {
    const firstError = document.querySelector(".form-group input.error, .form-group textarea.error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const btn = this.querySelector(".send-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  name,
    from_email: email,
    subject:    subject || "Portfolio Contact",
    message:    msg,
    reply_to:   email,
  })
    .then(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("success", "Message sent! I'll get back to you soon. 🎉");
      e.target.reset();
      [nameInput, emailInput, msgTextarea].forEach(el => el?.classList.remove("valid", "error"));
      if (charCount) { charCount.textContent = "0 / 10 min characters"; charCount.classList.remove("ok"); }
    })
    .catch((err) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showFormMsg("error", "Oops! Something went wrong. Please try WhatsApp or email directly.");
      console.error("EmailJS error:", err);
    });
});

function showFormMsg(type, text) {
  const existing = document.getElementById("formMsg");
  if (existing) existing.remove();
  const msg = document.createElement("div");
  msg.id = "formMsg";
  const isSuccess = type === "success";
  msg.style.cssText = [
    "margin-top:14px", "padding:12px 16px", "border-radius:10px",
    "font-size:0.85rem", "font-weight:500", "display:flex",
    "align-items:center", "gap:8px",
    isSuccess
      ? "color:var(--green);background:rgba(67,217,162,0.1);border:1px solid rgba(67,217,162,0.25)"
      : "color:#f87171;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25)",
  ].join(";");
  msg.innerHTML = isSuccess
    ? '<i class="fa-solid fa-circle-check"></i> ' + text
    : '<i class="fa-solid fa-circle-xmark"></i> ' + text;
  document.getElementById("contactForm").appendChild(msg);
  setTimeout(() => msg?.remove(), 7000);
}

/* ─── SWIPE to close sidebar (touch) ─── */
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
    // Sidebar is open: prevent horizontal scroll outside sidebar only
    if (insideSidebar) {
      if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    } else {
      e.preventDefault();
    }
  }
  // Sidebar closed: do NOT block touchmove — allow normal page scrolling
}, { passive: false });

document.addEventListener("touchend", (e) => {
  if (!navMenu.classList.contains("show")) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dx > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) closeNav();
}, { passive: true });

/* ─── Issue 5: Custom cursor (desktop hover devices only) ─── */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale ring on interactive elements
  document.querySelectorAll("a, button, .skill-card, .work-card, .achieve-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.borderColor = "rgba(244,114,182,0.6)";
    });
    el.addEventListener("mouseleave", () => {
      ring.style.width = "28px";
      ring.style.height = "28px";
      ring.style.borderColor = "rgba(79,142,247,0.5)";
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   PREMIUM UPGRADE 1 — SECTION TRANSITIONS
   Watches each .section-reveal and adds .in-view when visible
═══════════════════════════════════════════════════════════ */
(function () {
  const sections = document.querySelectorAll(".section-reveal");
  if (!sections.length) return;

  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          sectionObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  sections.forEach((s) => sectionObs.observe(s));
})();

/* ═══════════════════════════════════════════════════════════
   PREMIUM UPGRADE 2 — INTERACTIVE SKILLS VISUALIZATION
   Filter tabs + animated bar fill on scroll-into-view
═══════════════════════════════════════════════════════════ */
(function () {
  const tabs = document.querySelectorAll(".skills-tab");
  const cards = document.querySelectorAll(".skill-viz-card");
  const bars = document.querySelectorAll(".skill-bar-fill");

  // Animate bars when scrolled into view
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.dataset.pct || 0;
          setTimeout(() => { bar.style.width = pct + "%"; }, 120);
          barObs.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((b) => barObs.observe(b));

  // Tab filter
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const cat = tab.dataset.cat;
      cards.forEach((card) => {
        const match = cat === "all" || card.dataset.cat === cat;
        if (match) {
          card.classList.remove("hidden");
          // Re-trigger bar animation for newly visible cards
          const bar = card.querySelector(".skill-bar-fill");
          if (bar) {
            bar.style.width = "0%";
            setTimeout(() => { bar.style.width = (bar.dataset.pct || 0) + "%"; }, 80);
          }
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   PREMIUM UPGRADE 3 — 3D TILT CARD (desktop only)
   Gentle CSS perspective tilt on mousemove over hero image
═══════════════════════════════════════════════════════════ */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const wrapper = document.getElementById("tiltWrapper");
  if (!wrapper) return;

  const inner = wrapper.querySelector(".hero-img-wrap");
  const shine = wrapper.querySelector(".tilt-shine");
  if (!inner) return;

  const MAX_TILT = 14; // degrees
  let raf = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetX = -dy * MAX_TILT;
    targetY = dx * MAX_TILT;

    // Move shine to cursor position
    if (shine) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.14), transparent 65%)`;
    }

    if (!raf) raf = requestAnimationFrame(animateTilt);
  });

  wrapper.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(animateTilt);
  });

  function animateTilt() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    inner.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;

    const stillMoving = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
    if (stillMoving) {
      raf = requestAnimationFrame(animateTilt);
    } else {
      inner.style.transform = `rotateX(${targetX.toFixed(2)}deg) rotateY(${targetY.toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;
      raf = null;
    }
  }
})();
