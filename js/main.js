/* =============================================================
   BLUE ORCHIDS – main.js
   Production-grade navigation + utilities
   ============================================================= */

// ── Navigation System ─────────────────────────────────────────
(function () {
  'use strict';

  const toggle  = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');

  if (!toggle || !navMenu) return;

  let isOpen  = false;
  let savedScrollY = 0;

  /* Focusable elements inside the open menu */
  function getFocusable() {
    return Array.from(
      navMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  /* ── Lock / unlock body scroll ── */
  function lockScroll() {
    savedScrollY = window.scrollY;
    // iOS Safari needs position:fixed; other browsers just need overflow:hidden
    document.documentElement.style.setProperty('--nav-scroll-y', '-' + savedScrollY + 'px');
    document.body.classList.add('nav-open');
  }
  function unlockScroll() {
    document.body.classList.remove('nav-open');
    document.documentElement.style.removeProperty('--nav-scroll-y');
    window.scrollTo(0, savedScrollY);
  }

  /* ── Open ── */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    navMenu.classList.add('open');
    navMenu.setAttribute('aria-hidden', 'false');

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');

    if (overlay) {
      overlay.removeAttribute('hidden');
      /* Trigger transition on next frame */
      requestAnimationFrame(() => overlay.classList.add('active'));
    }

    lockScroll();

    /* Focus first link after panel slides in */
    const focusable = getFocusable();
    if (focusable.length) {
      setTimeout(() => focusable[0].focus(), 380);
    }
  }

  /* ── Close ── */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    navMenu.classList.remove('open');
    navMenu.setAttribute('aria-hidden', 'true');

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');

    if (overlay) {
      overlay.classList.remove('active');
      /* Hide after CSS transition ends (400 ms) */
      setTimeout(() => {
        if (!isOpen) overlay.setAttribute('hidden', '');
      }, 420);
    }

    unlockScroll();
    toggle.focus();
  }

  /* ── Toggle ── */
  toggle.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  /* ── Overlay click closes menu ── */
  if (overlay) overlay.addEventListener('click', closeMenu);

  /* ── Escape key ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  /* ── Close when a nav link is clicked ── */
  navMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', closeMenu)
  );

  /* ── Focus trap ── */
  document.addEventListener('keydown', (e) => {
    if (!isOpen || e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  /* ── Auto-close on desktop resize ── */
  const mq = window.matchMedia('(min-width: 1024px)');
  const onResize = (e) => { if (e.matches && isOpen) closeMenu(); };
  if (mq.addEventListener) mq.addEventListener('change', onResize);
  else mq.addListener(onResize); /* Safari < 14 */

})();

// ── Navbar scroll shadow ──────────────────────────────────────
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// ── Active nav link (auto-detect) ────────────────────────────
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

// ── Scroll Reveal ─────────────────────────────────────────────
(function () {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
})();

// ── Testimonial Slider ────────────────────────────────────────
(function () {
  const items = document.querySelectorAll('.testimonial-item');
  const dots  = document.querySelectorAll('.slider-dot');
  if (!items.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    items[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (n + items.length) % items.length;
    items[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4800);
  }

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  restart();
})();

// ── Counter animation ─────────────────────────────────────────
(function () {
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let val = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      val = Math.min(val + step, target);
      el.textContent = val + suffix;
      if (val >= target) clearInterval(id);
    }, 40);
  }

  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach((el) => obs.observe(el));
})();
