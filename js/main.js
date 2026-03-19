// ── Navbar scroll shadow ──────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu — overlay appended to body ───────────────────
const overlay = document.createElement('div');
overlay.className = 'mobile-nav-overlay';
const desktopUL = document.querySelector('.nav-desktop ul');
overlay.innerHTML = `
  <button class="mobile-nav-close" onclick="closeMenu()" aria-label="Close menu">&times;</button>
  <ul class="nav-links">${desktopUL ? desktopUL.innerHTML : ''}</ul>
`;
document.body.appendChild(overlay);

function openMenu() {
  overlay.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
}
function closeMenu() {
  overlay.classList.remove('open');
  document.documentElement.style.overflow = '';
}
function toggleMenu() {
  overlay.classList.contains('open') ? closeMenu() : openMenu();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── Active nav link (desktop + overlay) ──────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
    a.classList.add('active');
  }
});
overlay.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
    a.classList.add('active');
  }
  a.addEventListener('click', closeMenu);
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Testimonial Slider ────────────────────────────────────────
const items = document.querySelectorAll('.testimonial-item');
const dots  = document.querySelectorAll('.slider-dot');
let current = 0, timer;
function goTo(n) {
  items[current].classList.remove('active');
  dots[current] && dots[current].classList.remove('active');
  current = (n + items.length) % items.length;
  items[current].classList.add('active');
  dots[current] && dots[current].classList.add('active');
}
if (items.length) {
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  function restart() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 4800); }
  restart();
}

// ── Counter animation ─────────────────────────────────────────
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(interval);
  }, 40);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));
