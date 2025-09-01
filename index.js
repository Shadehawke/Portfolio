// Sidebar: collapse/expand (vanilla)
(function () {
  const sidebar = document.querySelector('.sidebar');
  const btnOpen = document.getElementById('sm-open');
  const btnClose = document.getElementById('sm-close');

  if (!sidebar || !btnOpen || !btnClose) {
    console.warn('Sidebar init: missing elements', { sidebar: !!sidebar, btnOpen: !!btnOpen, btnClose: !!btnClose });
    return;
  }

  // Make sure anchors are clickable regardless of markup
  btnOpen.setAttribute('href', '#');  btnOpen.setAttribute('role', 'button');
  btnClose.setAttribute('href', '#'); btnClose.setAttribute('role', 'button');

  const KEY = 'rlw_sidebar_collapsed';

  const setAria = (collapsed) => {
    const expanded = (!collapsed).toString();
    btnOpen.setAttribute('aria-expanded', expanded);
    btnClose.setAttribute('aria-expanded', expanded);
  };

  // Init from storage (default = expanded)
  const stored = localStorage.getItem(KEY);
  if (stored === '1') {
    // user last collapsed → start collapsed
    sidebar.classList.add('is-collapsed');
    setAria(true);
  } else {
    // default or last expanded → start expanded
    sidebar.classList.remove('is-collapsed');
    setAria(false);
  }

  const collapse = (e) => {
    if (e) e.preventDefault();
    sidebar.classList.add('is-collapsed');
    localStorage.setItem(KEY, '1');
    setAria(true);
  };

  const expand = (e) => {
    if (e) e.preventDefault();
    sidebar.classList.remove('is-collapsed');
    localStorage.setItem(KEY, '0');
    setAria(false);
  };

  btnOpen.addEventListener('click', expand);
  btnClose.addEventListener('click', collapse);
})();

// Contact form: tiny UX layer on top of native validation
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('.field');
  const submitBtn = document.getElementById('contact-submit');
  const statusEl = form.querySelector('.submit-status');

  // Show inline errors when the browser finds invalid fields
  form.addEventListener('submit', (e) => {
    // If invalid, let the browser show its bubbles, but also fill our <p.error>
    let valid = form.checkValidity();
    fields.forEach(f => {
      const input = f.querySelector('input, textarea');
      const err = f.querySelector('.error');
      if (!input || !err) return;
      err.textContent = input.validity.valid ? '' : input.validationMessage;
    });

    if (!valid) {
      // prevent sending, let the user fix inputs
      e.preventDefault();
      statusEl.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // Set sending state; FormSubmit will navigate on success
    submitBtn.setAttribute('disabled', 'true');
    statusEl.textContent = 'Sending…';
  });

  // Optional: realtime error clearing on input
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (!field) return;
    const input = field.querySelector('input, textarea');
    const err = field.querySelector('.error');
    if (input && err) {
      err.textContent = input.validity.valid ? '' : '';
    }
    statusEl.textContent = '';
  });
})();

// Navbar shadow on scroll
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Active section link highlighting
(function () {
  const sections = ['home','about','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const links = Array.from(document.querySelectorAll('.nav-links a'));

  if (!sections.length || !links.length) return;

  const byHref = (id) => links.find(a => (a.getAttribute('href') || '').replace('#','') === id);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = byHref(id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px', // triggers when section is near middle of viewport
    threshold: 0
  });

  sections.forEach(sec => obs.observe(sec));
})();

// Fade-in on scroll
(function() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.2 } // trigger when 20% visible
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

