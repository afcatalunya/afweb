/* ============================================================
   ALUMINIOS FRANCO — main.js v4.0
   Limpio · Robusto · Sin dependencias externas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS ── */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    const updateProgress = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) progress.style.width = (window.scrollY / total * 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── CURSOR PERSONALIZADO ── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    let cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── NAV HAMBURGER ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const menu = document.querySelector('.nav__menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Cerrar al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── REVEAL (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── CONTADOR ANIMADO ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const start  = performance.now();
        const isInt  = Number.isInteger(target);

        const animate = now => {
          const t      = Math.min((now - start) / duration, 1);
          const eased  = 1 - Math.pow(1 - t, 3);
          const value  = eased * target;
          el.textContent = prefix + (isInt ? Math.round(value) : value.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ── PARALLAX HERO ── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const page = href.split('/').pop().replace('.html', '');
    if (currentPage === href || currentPage.includes(page) && page !== '') {
      link.classList.add('active');
    }
  });

  /* ── TABS ── */
  document.querySelectorAll('.tabs__nav').forEach(nav => {
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const parent = btn.closest('.tabs') || nav.parentElement;
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = parent.querySelector('[data-pane="' + target + '"]');
        if (pane) pane.classList.add('active');
      });
    });
  });

  /* ── FILTROS DE PROYECTOS ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        projectCards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
          if (show) { card.style.opacity = '0'; setTimeout(() => { card.style.transition = 'opacity .3s ease'; card.style.opacity = '1'; }, 10); }
        });
      });
    });
  }

  /* ── FORMULARIO CONTACTO (simulado) ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const success = document.getElementById('form-success');
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        if (success) { success.style.display = 'block'; }
      }, 1200);
    });
  }

  /* ── SMOOTH SCROLL ANCHORS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
