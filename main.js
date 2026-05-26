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

// ── Single-page smooth scroll navigation ──────────────────────
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a, .d-link');

function scrollToPage(name, opts = {}) {
  const { pushHistory = true, behavior = 'smooth' } = opts;

  // Close mobile drawer if open
  drawer?.classList.remove('open');

  if (name === 'home') {
    window.scrollTo({ top: 0, behavior });
  } else {
    const target = document.querySelector(`.page[data-page="${name}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior, block: 'start' });
  }

  // Update URL
  if (pushHistory) {
    const newUrl = name === 'home' ? location.pathname : `${location.pathname}#${name}`;
    history.pushState({ page: name }, '', newUrl);
  }
}

// Intercept internal hash links (nav, drawer, hero CTAs, floating buttons)
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"], a[href="/"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href === '#' || href === '/' || href === '#home') {
    e.preventDefault();
    scrollToPage('home');
    return;
  }
  if (href.startsWith('#')) {
    const target = href.slice(1);
    if (document.querySelector(`.page[data-page="${target}"]`)) {
      e.preventDefault();
      scrollToPage(target);
    }
  }
});

// Browser back/forward
window.addEventListener('popstate', () => {
  const hash = (location.hash || '').replace('#', '') || 'home';
  scrollToPage(hash, { pushHistory: false });
});

// Initial page from URL hash — jump instantly (no smooth animation on load)
{
  const initialHash = (location.hash || '').replace('#', '') || 'home';
  if (initialHash !== 'home') {
    // Wait for layout + reveals to settle, then jump
    requestAnimationFrame(() => {
      scrollToPage(initialHash, { pushHistory: false, behavior: 'auto' });
    });
  }
}

// Active nav highlight based on scroll position
const pageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pageName = entry.target.dataset.page;
      navLinks.forEach(a => {
        const href = (a.getAttribute('href') || '').replace('#', '');
        a.classList.toggle('is-active', href === pageName);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

pages.forEach(p => pageObserver.observe(p));

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
