/**
 * ALUMINIOS FRANCO — main.js v3.0 PREMIUM
 * Vanilla JS · Sin dependencias · Production ready
 */

/* ── CURSOR PERSONALIZADO ─────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(hover:none)').matches) return;

  let mx = -100, my = -100, cx = -100, cy = -100;
  let raf;

  const move = e => { mx = e.clientX; my = e.clientY; };
  window.addEventListener('mousemove', move, { passive: true });

  const tick = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // Efecto hover en elementos interactivos
  const hoverEls = document.querySelectorAll('a, button, [data-cursor]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

/* ── SCROLL PROGRESS ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;
  const update = () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── HEADER SCROLL STATE ─────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  const open = () => {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const s = toggle.querySelectorAll('span');
    s[0].style.cssText = 'transform:rotate(45deg) translate(4.5px,4.5px)';
    s[1].style.cssText = 'opacity:0;transform:scaleX(0)';
    s[2].style.cssText = 'transform:rotate(-45deg) translate(4.5px,-4.5px)';
  };

  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  };

  toggle.addEventListener('click', () =>
    nav.classList.contains('open') ? close() : open()
  );

  // Cerrar al hacer clic en cualquier enlace
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) close();
  });
})();

/* ── REVEAL ON SCROLL (IntersectionObserver) ─────────────── */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── CONTADORES ANIMADOS ─────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target   = parseInt(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTs  = performance.now();

    const frame = (now) => {
      const elapsed = now - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        animate(target);
        io.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();

/* ── STAGGER en grids al entrar en pantalla ──────────────── */
(function initStagger() {
  const grids = document.querySelectorAll(
    '.products-grid, .values-grid, .locations-grid, .news-grid, .numbers-grid'
  );
  if (!grids.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const items = target.children;
      Array.from(items).forEach((item, i) => {
        item.style.transitionDelay = (i * 80) + 'ms';
        item.classList.add('revealed');
      });
      io.unobserve(target);
    });
  }, { threshold: 0.05 });

  grids.forEach(grid => {
    Array.from(grid.children).forEach(child => {
      if (!child.hasAttribute('data-reveal')) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 500ms ease, transform 500ms ease';
      }
    });
    io.observe(grid);
  });
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const selector = link.getAttribute('href');
    if (selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 76;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerH - 20,
      behavior: 'smooth'
    });
  });
});

/* ── COOKIE BANNER ───────────────────────────────────────── */
(function initCookies() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner || localStorage.getItem('af_consent')) return;

  setTimeout(() => banner.classList.add('visible'), 1500);

  const dismiss = (val) => {
    localStorage.setItem('af_consent', val);
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 600);
  };

  banner.querySelector('[data-accept]')?.addEventListener('click', () => dismiss('all'));
  banner.querySelector('[data-reject]')?.addEventListener('click', () => dismiss('essential'));
})();

/* ── PARALLAX SUTIL en hero background ───────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const update = () => {
    const scrolled = window.scrollY;
    const vh       = window.innerHeight;
    if (scrolled < vh * 1.5) {
      heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  };

  window.addEventListener('scroll', update, { passive: true });
})();

/* ── HOVER en project tiles: mostrar localización ───────── */
(function initProjectHover() {
  document.querySelectorAll('.project-tile').forEach(tile => {
    // Ya manejado con CSS, pero añadimos foco para accesibilidad
    tile.setAttribute('tabindex', '0');
    tile.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const link = tile.querySelector('a');
        if (link) link.click();
      }
    });
  });
})();
