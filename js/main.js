// ── Navbar scroll shadow ─────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu ──────────────────────────────────────────────
function toggleMenu() {
  const nav = document.querySelector('.navbar nav');
  const btn = document.querySelector('.menu-toggle');
  if (!nav) return;
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  const spans = btn.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const nav = document.querySelector('.navbar nav');
    if (nav && nav.classList.contains('open')) toggleMenu();
  }
});
// Close on nav link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    const nav = document.querySelector('.navbar nav');
    if (nav && nav.classList.contains('open')) toggleMenu();
  });
});

// ── Active nav link ──────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Scroll Reveal ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Testimonial Slider ───────────────────────────────────────
const items = document.querySelectorAll('.testimonial-item');
const dots  = document.querySelectorAll('.slider-dot');
let current = 0, timer;
function goTo(n) {
  items[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + items.length) % items.length;
  items[current].classList.add('active');
  dots[current].classList.add('active');
}
if (items.length) {
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  function restart() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 4800); }
  restart();
}

// ── Counter animation ────────────────────────────────────────
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
