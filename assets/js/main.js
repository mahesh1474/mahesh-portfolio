/* ═══════════════════════════════════════════════════════════
   main.js — Mahesh Portfolio
   FIX: Theme toggle inside sidebar does NOT close sidebar
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   EMAILJS CONFIG — defined at top so they are available
   everywhere in this file (fixes init-before-declaration bug)
═══════════════════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = "YfNbrehdyBUjv5iZZ";
const EMAILJS_SERVICE_ID  = "service_z70q1gg";
const EMAILJS_TEMPLATE_ID = "template_51vvyol";

/* ─── AOS ─── */
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 800, once: true, offset: 60, easing: "ease-out-quart" });
});

/* ─── TYPED.JS + EMAILJS INIT ─── */
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
    showCursor: false,
  });

  /* Initialise EmailJS after all scripts have loaded */
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
  document.querySelectorAll("a, button, .skill-viz-card, .work-card, .achieve-card").forEach((el) => {
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

  // Tab filter — with aria-pressed and keyboard support
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-pressed", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-pressed", "true");

      const cat = tab.dataset.cat;
      cards.forEach((card) => {
        const match = cat === "all" || card.dataset.cat === cat;
        if (match) {
          card.classList.remove("hidden");
          card.removeAttribute("aria-hidden");
          // Re-trigger bar animation for newly visible cards
          const bar = card.querySelector(".skill-bar-fill");
          if (bar) {
            bar.style.width = "0%";
            setTimeout(() => { bar.style.width = (bar.dataset.pct || 0) + "%"; }, 80);
          }
        } else {
          card.classList.add("hidden");
          card.setAttribute("aria-hidden", "true");
        }
      });
    });

    // Arrow-key navigation between tabs
    tab.addEventListener("keydown", (e) => {
      const tabList = Array.from(tabs);
      const idx = tabList.indexOf(tab);
      if (e.key === "ArrowRight") { e.preventDefault(); tabList[(idx + 1) % tabList.length].focus(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); tabList[(idx - 1 + tabList.length) % tabList.length].focus(); }
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   PREMIUM UPGRADE 3 — TRUE 3D HERO IMAGE (desktop only)
   - tilt-scene rotates on all axes as mouse moves
   - floating badges get extra Z parallax
   - holographic shimmer follows cursor angle
   - smooth lerp so motion feels spring-like
═══════════════════════════════════════════════════════════ */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const wrapper = document.getElementById("tiltWrapper");
  const scene   = document.getElementById("tiltScene");
  const holo    = scene?.querySelector(".hero-holo");
  const shadow  = scene?.querySelector(".hero-depth-shadow");
  if (!wrapper || !scene) return;

  const MAX_TILT = 16;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovering = false;
  let raf = null;

  wrapper.addEventListener("mouseenter", () => { isHovering = true; });
  wrapper.addEventListener("mouseleave", () => {
    isHovering = false;
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2); // -1 … 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 … 1

    targetX = -dy * MAX_TILT;
    targetY =  dx * MAX_TILT;

    // Holographic shimmer: shift gradient angle with mouse
    if (holo) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 200;
      holo.style.background = `conic-gradient(
        from ${angle}deg at ${50 + dx * 12}% ${50 + dy * 12}%,
        rgba(79,142,247,0.0)   0deg,
        rgba(79,142,247,0.22)  35deg,
        rgba(244,114,182,0.2)  85deg,
        rgba(251,191,36,0.14)  135deg,
        rgba(52,211,153,0.1)   175deg,
        rgba(79,142,247,0.0)   210deg,
        rgba(79,142,247,0.0)   360deg
      )`;
    }

    if (!raf) raf = requestAnimationFrame(tick);
  });

  function tick() {
    const lerpSpeed = isHovering ? 0.1 : 0.06;
    currentX += (targetX - currentX) * lerpSpeed;
    currentY += (targetY - currentY) * lerpSpeed;

    // Main scene rotation
    scene.style.transform =
      `rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

    // Shadow shifts opposite to tilt — makes depth convincing
    if (shadow) {
      const sx = -currentY * 1.8;
      const sy =  currentX * 1.8;
      shadow.style.transform =
        `translateZ(-30px) translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px) scale(0.94)`;
      shadow.style.boxShadow = `
        ${sx.toFixed(1)}px ${(40 + sy).toFixed(1)}px 100px rgba(0,0,0,0.55),
        0 20px 60px rgba(79,142,247,${(0.12 + Math.abs(currentX + currentY) * 0.004).toFixed(3)}),
        0 0 0 1px rgba(79,142,247,0.18)
      `;
    }

    const stillMoving =
      Math.abs(targetX - currentX) > 0.02 ||
      Math.abs(targetY - currentY) > 0.02;

    if (stillMoving) {
      raf = requestAnimationFrame(tick);
    } else {
      scene.style.transform =
        `rotateX(${targetX.toFixed(3)}deg) rotateY(${targetY.toFixed(3)}deg)`;
      raf = null;
    }
  }
})();

/* ═══════════════════════════════════════════════════════════
   CREATIVE ENHANCEMENT 1 — HERO PARTICLE FIELD
   Responsive dot grid that ripples toward mouse cursor
═══════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];
  let mouseX = -9999, mouseY = -9999;
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 120;
  const REPEL_DIST = 90;

  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function spawn() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        ox: 0, oy: 0,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isLight = document.documentElement.classList.contains("light-theme");
    const dotColor = isLight ? "rgba(29,78,216," : "rgba(79,142,247,";

    particles.forEach(p => {
      // Drift
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repel
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_DIST) {
        const force = (REPEL_DIST - dist) / REPEL_DIST;
        p.ox = dx / dist * force * 18;
        p.oy = dy / dist * force * 18;
      } else {
        p.ox *= 0.88;
        p.oy *= 0.88;
      }

      const rx = p.x + p.ox;
      const ry = p.y + p.oy;

      // Draw dot
      ctx.beginPath();
      ctx.arc(rx, ry, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor + "0.7)";
      ctx.fill();

      // Connect nearby
      particles.forEach(q => {
        const qx = q.x + q.ox;
        const qy = q.y + q.oy;
        const d = Math.sqrt((rx - qx) ** 2 + (ry - qy) ** 2);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(qx, qy);
          ctx.strokeStyle = dotColor + (0.18 * (1 - d / CONNECT_DIST)).toFixed(3) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => { mouseX = -9999; mouseY = -9999; });
  }

  window.addEventListener("resize", () => { resize(); spawn(); });
  resize(); spawn(); draw();
})();

/* ═══════════════════════════════════════════════════════════
   CREATIVE ENHANCEMENT 2 — MAGNETIC BUTTON EFFECT
   CTA buttons subtly pull toward cursor on hover
═══════════════════════════════════════════════════════════ */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll(".btn-primary-c, .btn-outline-c, .btn-whatsapp-c").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      btn.style.transform = `translate(${dx * 7}px, ${dy * 5}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   CREATIVE ENHANCEMENT 3 — CURSOR SPARKLE TRAIL
   Tiny fading sparkles follow the cursor (desktop only)
═══════════════════════════════════════════════════════════ */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const colors = ["#4f8ef7", "#f472b6", "#fbbf24", "#34d399", "#a78bfa"];
  let lastTime = 0;
  const INTERVAL = 55; // ms between sparkles

  document.addEventListener("mousemove", e => {
    const now = Date.now();
    if (now - lastTime < INTERVAL) return;
    lastTime = now;

    const s = document.createElement("div");
    s.className = "sparkle";
    const size = Math.random() * 6 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:${color};`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 620);
  });
})();

/* ═══════════════════════════════════════════════════════════
   CREATIVE ENHANCEMENT 4 — EASED COUNTER ANIMATION
   Replaces linear increment with easeOutExpo curve
   + adds .done class for CSS pop on completion
═══════════════════════════════════════════════════════════ */
(function () {
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const start = performance.now();
      el.classList.remove("done");

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        el.innerText = Math.ceil(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.innerText = target + "+";
          el.classList.add("done");
        }
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".counter").forEach(c => obs.observe(c));
})();

/* ═══════════════════════════════════════════════════════════
   CREATIVE ENHANCEMENT 5 — SKILL BAR PULSE DOT
   Adds .animated class after bar fills so CSS pulse kicks in
═══════════════════════════════════════════════════════════ */
(function () {
  document.querySelectorAll(".skill-bar-fill").forEach(bar => {
    const mo = new MutationObserver(() => {
      const w = parseFloat(bar.style.width);
      if (w > 0) {
        setTimeout(() => bar.classList.add("animated"), 1200);
        mo.disconnect();
      }
    });
    mo.observe(bar, { attributeFilter: ["style"] });
  });
})();
