/* Enoch Okedere Portfolio — cinematic dark JS */

// ── NAV scroll effect ─────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile burger ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });
  drawer.querySelectorAll('.d-link').forEach(a => {
    a.addEventListener('click', () => drawer.classList.remove('open'));
  });
}

// ── Scroll reveal ─────────────────────────────────────────────
const revealEls = [
  { sel: '.hero-status',        delay: 0 },
  { sel: '.hero-photo-circle',  delay: 1 },
  { sel: '.hero-eyebrow',       delay: 2 },
  { sel: '.hero-name',          delay: 3 },
  { sel: '.hero-bio',           delay: 4 },
  { sel: '.hero-actions',       delay: 5 },
  { sel: '.hero-socials',       delay: 5 },
  { sel: '.hero-brands',        delay: 0 },
  { sel: '.stat-item',          delay: 'stagger' },
  { sel: '.section-header',     delay: 0 },
  { sel: '.work-filters',       delay: 1 },
  { sel: '.work-card',          delay: 'stagger' },
  { sel: '.post-card',          delay: 'stagger' },
  { sel: '.content-video-wrap', delay: 0 },
  { sel: '.posts-grid',         delay: 1 },
  { sel: '.about-left',         delay: 0 },
  { sel: '.about-right',        delay: 1 },
  { sel: '.eco-card',           delay: 'stagger' },
  { sel: '.stack-card',         delay: 'stagger' },
  { sel: '.footer-grid',        delay: 0 },
];

revealEls.forEach(({ sel, delay }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (delay === 'stagger') {
      el.classList.add(`reveal-d${(i % 5) + 1}`);
    } else if (typeof delay === 'number' && delay > 0) {
      el.classList.add(`reveal-d${delay}`);
    }
  });
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── Active nav link highlight ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
const sio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('is-active',
          a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => sio.observe(s));

// ── Work filter tabs ──────────────────────────────────────────
const filterTabs = document.querySelectorAll('.filter-tab');
const workCards = document.querySelectorAll('.work-card[data-cat]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    workCards.forEach(card => {
      const cats = (card.dataset.cat || '').split(/\s+/);
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('fade-out', !show);
    });
  });
});
