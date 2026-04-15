/* Whatcom Jet Ski Rentals — animation orchestration (21st.dev-style) */

(function () {
  'use strict';

  /* Custom glow cursor (desktop/fine-pointer only) -------------------- */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch) {
    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'cursor';
    dot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function render() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    })();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .carousel-item, .rate-card, .location-card, .fleet-row, input, textarea, select'))
        cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .carousel-item, .rate-card, .location-card, .fleet-row, input, textarea, select'))
        cursor.classList.remove('hover');
    });
  }

  /* Scroll reveals ---------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));

  /* Hero word reveal --------------------------------------------------- */
  document.querySelectorAll('.hero-title .word').forEach((w, i) => {
    w.style.transform = 'translateY(110%)';
    w.style.transition = `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { w.style.transform = 'translateY(0)'; });
    });
  });

  /* Mobile menu -------------------------------------------------------- */
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const setState = (open) => {
      menu.classList.toggle('open', open);
      toggle.textContent = open ? '— CLOSE' : '— MENU';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setState(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setState(false)));
  }

  /* Ticker — duplicate for seamless scroll ----------------------------- */
  document.querySelectorAll('.ticker-track').forEach((track) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; gap:3rem; white-space:nowrap; animation:marqueeScroll 40s linear infinite; will-change:transform;';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    wrap.appendChild(clone);
  });
  // Inject keyframes for marquee
  const style = document.createElement('style');
  style.textContent = '@keyframes marqueeScroll { from{transform:translateX(0);} to{transform:translateX(-50%);} }';
  document.head.appendChild(style);

  /* Carousel seamless duplication ------------------------------------- */
  document.querySelectorAll('.carousel').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentNode.appendChild(clone);
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; gap:1rem; will-change:transform; animation:slideLeft 40s linear infinite;';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);
    wrap.appendChild(clone);
    track.style.animation = 'none';
    clone.style.animation = 'none';
  });

  /* Meteors — spawn random streaks ------------------------------------ */
  document.querySelectorAll('.meteors').forEach((host) => {
    const count = parseInt(host.dataset.count || '14', 10);
    for (let i = 0; i < count; i++) {
      const m = document.createElement('span');
      m.className = 'meteor';
      m.style.setProperty('--x', `${Math.random() * 100}%`);
      m.style.setProperty('--delay', `${Math.random() * 6}s`);
      m.style.setProperty('--dur', `${4 + Math.random() * 6}s`);
      host.appendChild(m);
    }
  });

  /* Sparkle burst on click --------------------------------------------- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('a, button')) return;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      const ang = Math.random() * Math.PI * 2;
      const d = 20 + Math.random() * 40;
      s.style.left = `${e.clientX + Math.cos(ang) * d - 1.5}px`;
      s.style.top  = `${e.clientY + Math.sin(ang) * d - 1.5}px`;
      s.style.setProperty('--dur', `${1.2 + Math.random() * 0.8}s`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  });

  /* Spotlight host cursor follow -------------------------------------- */
  document.querySelectorAll('.spotlight-host').forEach((host) => {
    host.addEventListener('mousemove', (e) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty('--mx', `${e.clientX - r.left}px`);
      host.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Hero background parallax ------------------------------------------ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) heroBg.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* Booking form — fake submit for demo ------------------------------- */
  const form = document.querySelector('form[data-demo-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-confirm');
      if (msg) {
        msg.style.opacity = '1';
        msg.textContent = `✓ Thanks — we'll confirm your ${form.date.value || 'booking'} by text at ${form.phone.value || 'the number you provided'}.`;
        setTimeout(() => form.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
