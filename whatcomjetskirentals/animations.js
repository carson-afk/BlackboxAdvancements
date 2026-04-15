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
  const carouselDur = () => {
    const w = window.innerWidth;
    if (w <= 640) return 90;
    if (w <= 980) return 65;
    return 45;
  };
  document.querySelectorAll('.carousel').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentNode.appendChild(clone);
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex; gap:1rem; will-change:transform; animation:slideLeft ${carouselDur()}s linear infinite;`;
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

  /* Estimator --------------------------------------------------------- */
  const est = document.getElementById('estimatorForm');
  const estStart = document.getElementById('estStart');
  if (estStart && est) {
    estStart.addEventListener('click', () => {
      est.hidden = false;
      estStart.hidden = true;
      const first = est.querySelector('input, select');
      if (first) first.focus({ preventScroll: true });
      const y = est.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }
  if (est) {
    const step1 = est.querySelector('[data-step="1"]');
    const step2 = est.querySelector('[data-step="2"]');
    const resultEl = est.querySelector('[data-step="result"]');
    const continueBtn = est.querySelector('#estContinue');
    const backBtn = est.querySelector('#estBack');

    const show = (which) => {
      [step1, step2, resultEl].forEach((el) => { if (el) el.hidden = true; });
      which.hidden = false;
      const y = est.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    const flash = (input, msg) => {
      let err = input.parentNode.querySelector('.est-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'est-error';
        input.parentNode.appendChild(err);
      }
      err.textContent = msg;
      input.style.borderColor = '#ff8a8a';
      input.addEventListener('input', () => {
        err.textContent = '';
        input.style.borderColor = '';
      }, { once: true });
    };

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    continueBtn.addEventListener('click', () => {
      const name = est.elements.name;
      const phone = est.elements.phone;
      const email = est.elements.email;
      let ok = true;
      if (!name.value.trim()) { flash(name, 'Required'); ok = false; }
      if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 7) { flash(phone, 'Enter a valid phone'); ok = false; }
      if (!emailRe.test(email.value.trim())) { flash(email, 'Enter a valid email'); ok = false; }
      if (!ok) return;
      show(step2);
    });

    backBtn.addEventListener('click', () => show(step1));

    const PRICES = {
      '4hr-1': { base: 399, label: '4 Hours · 1 Jet Ski' },
      '4hr-2': { base: 749, label: '4 Hours · 2 Jet Skis' },
      '8hr-1': { base: 649, label: '8 Hours · 1 Jet Ski' },
      '8hr-2': { base: 1249, label: '8 Hours · 2 Jet Skis' },
    };

    est.addEventListener('submit', async (e) => {
      e.preventDefault();
      const lake = est.elements.lake;
      const pkg = est.elements.package;
      if (!lake.value) { flash(lake, 'Pick a lake'); return; }
      if (!pkg.value) { flash(pkg, 'Pick a package'); return; }

      const riders = parseInt(est.elements.riders.value, 10) || 2;
      const skis = pkg.value.endsWith('-2') ? 2 : 1;
      const cap = skis * 2;
      const extraRiderFee = Math.max(0, riders - cap) * 40;
      const { base, label } = PRICES[pkg.value];
      const total = base + extraRiderFee;
      const low = Math.round((total * 0.92) / 5) * 5;
      const high = Math.round((total * 1.08) / 5) * 5;

      const fmt = (n) => `$${n.toLocaleString('en-US')}`;
      const range = est.querySelector('.est-range');
      const summary = est.querySelector('.est-summary');
      range.textContent = `${fmt(low)} – ${fmt(high)}`;
      const dateStr = est.elements.date.value ? ` on ${est.elements.date.value}` : '';
      summary.textContent = `${label} at ${lake.value}${dateStr} for ${riders} rider${riders === 1 ? '' : 's'}. We'll text a firm quote with open time slots ASAP.`;
      show(resultEl);

      const payload = {
        name: est.elements.name.value.trim(),
        phone: est.elements.phone.value.trim(),
        email: est.elements.email.value.trim(),
        lake: lake.value,
        package: label,
        riders,
        date: est.elements.date.value || '',
        estimate_low: low,
        estimate_high: high,
        source: 'whatcomjetskirentals estimator',
        _subject: `New jet-ski estimate request — ${est.elements.name.value.trim()}`,
      };
      const endpoint = est.getAttribute('data-formspree-id');
      if (endpoint) {
        try {
          await fetch(`https://formspree.io/f/${endpoint}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (_) { /* UX already rendered */ }
      } else {
        console.info('[estimator] lead captured (no endpoint configured):', payload);
      }
    });
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
