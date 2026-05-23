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
}

// ── Multi-page navigation ─────────────────────────────────────
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a, .d-link');

function showPage(name, opts = {}) {
  const { pushHistory = true } = opts;
  const target = name && document.querySelector(`.page[data-page="${name}"]`) ? name : 'home';

  pages.forEach(p => p.classList.toggle('is-active', p.dataset.page === target));

  // Update nav active states
  navLinks.forEach(a => {
    const href = (a.getAttribute('href') || '').replace('#', '');
    a.classList.toggle('is-active', href === target);
  });

  // Close mobile drawer if open
  drawer?.classList.remove('open');

  // Scroll to top of new page instantly
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  // Restore smooth scroll for any in-page anchors
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = '';
  });

  // Update URL
  if (pushHistory) {
    const newUrl = target === 'home' ? location.pathname : `${location.pathname}#${target}`;
    history.pushState({ page: target }, '', newUrl);
  }

  // Re-trigger scroll reveals within the new page
  const activePage = document.querySelector('.page.is-active');
  if (activePage) {
    activePage.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
}

// Intercept all internal hash links (nav, drawer, hero CTAs)
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"], a[href="/"]');
  if (!a) return;
  const href = a.getAttribute('href');
  // Skip pure "#" no-op anchors that don't map to a page (rare)
  if (href === '#' || href === '/') {
    e.preventDefault();
    showPage('home');
    return;
  }
  if (href.startsWith('#')) {
    const target = href.slice(1);
    if (document.querySelector(`.page[data-page="${target}"]`)) {
      e.preventDefault();
      showPage(target);
    }
  }
});

// Browser back/forward
window.addEventListener('popstate', () => {
  const hash = (location.hash || '').replace('#', '') || 'home';
  showPage(hash, { pushHistory: false });
});

// Initial page from URL hash — handle browser's hash-anchor auto-scroll
{
  const initialHash = (location.hash || '').replace('#', '') || 'home';
  showPage(initialHash, { pushHistory: false });
  // Browser auto-scrolls to id="X" when URL has #X — override it
  const killScroll = () => window.scrollTo(0, 0);
  killScroll();
  requestAnimationFrame(killScroll);
  setTimeout(killScroll, 0);
  setTimeout(killScroll, 80);
}

// ── Scroll reveal ─────────────────────────────────────────────
const revealEls = [
  { sel: '.hero-photo-circle',  delay: 1 },
  { sel: '.hero-eyebrow',       delay: 2 },
  { sel: '.hero-name',          delay: 3 },
  { sel: '.hero-bio',           delay: 4 },
  { sel: '.hero-actions',       delay: 5 },
  { sel: '.hero-socials',       delay: 5 },
  { sel: '.brand-marquee',      delay: 0 },
  { sel: '.stat-item',          delay: 'stagger' },
  { sel: '.section-header',     delay: 0 },
  { sel: '.work-filters',       delay: 1 },
  { sel: '.work-card',          delay: 'stagger' },
  { sel: '.featured-video',     delay: 0 },
  { sel: '.video-card',         delay: 'stagger' },
  { sel: '.about-left',         delay: 0 },
  { sel: '.about-right',        delay: 1 },
  { sel: '.eco-card',           delay: 'stagger' },
  { sel: '.stack-card',         delay: 'stagger' },
  { sel: '.contact-info',       delay: 0 },
  { sel: '.contact-form',       delay: 1 },
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

// ── Contact form → mailto ─────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const name = (f.name.value || '').trim();
    const email = (f.email.value || '').trim();
    const subject = (f.subject.value || 'Inquiry').trim();
    const message = (f.message.value || '').trim();

    if (!name || !email || !message) {
      f.reportValidity();
      return;
    }

    const mailSubject = `[${subject}] from ${name}`;
    const mailBody =
      `Hi Enoch,\n\n` +
      `${message}\n\n` +
      `— ${name}\n` +
      `Reply to: ${email}`;

    const mailto =
      `mailto:okedereenoch@gmail.com` +
      `?subject=${encodeURIComponent(mailSubject)}` +
      `&body=${encodeURIComponent(mailBody)}`;

    window.location.href = mailto;
  });
}

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
