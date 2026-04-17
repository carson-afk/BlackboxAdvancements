/* Barbo's Plumbing — animation + estimator orchestration */
(function () {
  'use strict';

  /* Cursor -------------------------------------------------------- */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch) {
    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'cursor'; dot.className = 'cursor-dot';
    document.body.appendChild(cursor); document.body.appendChild(dot);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function render() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .carousel-item, .feature, .info-card, .quote, input, textarea, select'))
        cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .carousel-item, .feature, .info-card, .quote, input, textarea, select'))
        cursor.classList.remove('hover');
    });
  }

  /* Scroll reveals ------------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));

  /* Hero word reveal ---------------------------------------------- */
  document.querySelectorAll('.hero-title .word').forEach((w, i) => {
    w.style.transform = 'translateY(110%)';
    w.style.transition = `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => { w.style.transform = 'translateY(0)'; }));
  });

  /* Mobile menu --------------------------------------------------- */
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle('open', o); toggle.textContent = o ? '— CLOSE' : '— MENU'; document.body.style.overflow = o ? 'hidden' : ''; };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  /* Ticker -------------------------------------------------------- */
  document.querySelectorAll('.ticker-track').forEach((track) => {
    const wrap = document.createElement('div');
    const dur = innerWidth <= 640 ? 90 : 65;
    wrap.style.cssText = `display:flex; gap:3rem; white-space:nowrap; animation:marqueeScroll ${dur}s linear infinite; will-change:transform;`;
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);
    const clone = track.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
    wrap.appendChild(clone);
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes marqueeScroll { from{transform:translateX(0);} to{transform:translateX(-50%);} } @keyframes slideLeft { from{transform:translateX(0);} to{transform:translateX(-50%);} }';
  document.head.appendChild(style);

  /* Carousel infinite --------------------------------------------- */
  const cDur = () => { const w = innerWidth; if (w <= 640) return 140; if (w <= 980) return 100; return 75; };
  document.querySelectorAll('.carousel').forEach((track) => {
    const clone = track.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
    track.parentNode.appendChild(clone);
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex; gap:1rem; will-change:transform; animation:slideLeft ${cDur()}s linear infinite;`;
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none'; clone.style.animation = 'none';
  });

  /* Meteors ------------------------------------------------------- */
  document.querySelectorAll('.meteors').forEach((host) => {
    const count = parseInt(host.dataset.count || '14', 10);
    for (let i = 0; i < count; i++) {
      const m = document.createElement('span');
      m.className = 'meteor';
      m.style.setProperty('--x', `${Math.random() * 100}%`);
      m.style.setProperty('--delay', `${Math.random() * 14}s`);
      m.style.setProperty('--dur', `${10 + Math.random() * 10}s`);
      host.appendChild(m);
    }
  });

  /* Sparkle burst -------------------------------------------------- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('a, button')) return;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span'); s.className = 'sparkle';
      const ang = Math.random() * Math.PI * 2; const d = 20 + Math.random() * 40;
      s.style.left = `${e.clientX + Math.cos(ang) * d - 1.5}px`;
      s.style.top  = `${e.clientY + Math.sin(ang) * d - 1.5}px`;
      s.style.setProperty('--dur', `${1.2 + Math.random() * 0.8}s`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  });

  /* Spotlight cursor follow ---------------------------------------- */
  document.querySelectorAll('.spotlight-host').forEach((host) => {
    host.addEventListener('mousemove', (e) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty('--mx', `${e.clientX - r.left}px`);
      host.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Hero bg parallax ---------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    addEventListener('scroll', () => {
      const y = scrollY;
      if (y < innerHeight * 1.2) heroBg.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* Estimator ----------------------------------------------------- */
  const est = document.getElementById('estimatorForm');
  if (!est) return;

  const step1 = est.querySelector('[data-step="1"]');
  const step2 = est.querySelector('[data-step="2"]');
  const result = est.querySelector('[data-step="result"]');
  const continueBtn = est.querySelector('#estContinue');
  const backBtn = est.querySelector('#estBack');

  const show = (which) => {
    [step1, step2, result].forEach((el) => { if (el) el.hidden = true; });
    which.hidden = false;
    const y = est.getBoundingClientRect().top + scrollY - 80;
    scrollTo({ top: y, behavior: 'smooth' });
  };

  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-error');
    if (!err) { err = document.createElement('span'); err.className = 'est-error'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#ff8a8a';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const PRIMARY_ZIPS = new Set([
    '98501','98502','98503','98506','98512','98513','98516',
    '98531','98532','98579','98589','98597','98327','98433',
    '98439','98444','98445','98465','98466','98467'
  ]);

  const BASES = {
    'water-heater':  [1400, 3800],
    'repair':        [180, 820],
    'bathroom':      [4500, 14000],
    'kitchen':       [900, 4200],
    'waterline':     [3200, 9500],
    'sump':          [650, 2400],
    'drain':         [220, 1600]
  };
  const LABELS = {
    'water-heater': 'Water heater install / replace',
    'repair':       'Leak / fixture repair',
    'bathroom':     'Bathroom remodel',
    'kitchen':      'Kitchen plumbing',
    'waterline':    'Water line replacement',
    'sump':         'Sump pump',
    'drain':        'Drain / sewer'
  };

  continueBtn && continueBtn.addEventListener('click', () => {
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

  backBtn && backBtn.addEventListener('click', () => show(step1));

  est.addEventListener('submit', async (e) => {
    e.preventDefault();
    const jobSel = est.elements.job;
    const urgency = est.elements.urgency.value || 'thisweek';
    const scope = est.elements.scope.value || 'medium';
    const baths = parseInt(est.elements.bathrooms.value, 10) || 0;
    const zip = (est.elements.zip.value || '').trim();
    if (!jobSel.value) { flash(jobSel, 'Pick a job type'); return; }

    const [baseLo, baseHi] = BASES[jobSel.value];
    let lo = baseLo, hi = baseHi;

    // Scope scaler
    const scopeM = { small: 0.65, medium: 1.0, large: 1.7 }[scope] || 1;
    lo = lo * scopeM; hi = hi * scopeM;

    // Bath count for bathroom remodel
    if (jobSel.value === 'bathroom' && baths > 0) { lo *= baths; hi *= baths; }

    // Urgency
    const urgM = { emergency: 1.25, thisweek: 1.0, flexible: 0.95 }[urgency] || 1;
    lo = lo * urgM; hi = hi * urgM;

    // Out-of-area fee
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 95; hi += 135; }

    // Round to nearest $25
    lo = Math.round(lo / 25) * 25;
    hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').textContent = `${fmt(lo)} — ${fmt(hi)}`;
    const oText = outOfArea ? ' (out-of-area travel included)' : '';
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]} · ${urgency}${oText}. We'll confirm the final price at a free on-site walk-through — no commitment.`;
    show(result);

    // Try formspree
    const endpoint = est.getAttribute('data-formspree-id');
    const payload = {
      name: est.elements.name.value.trim(),
      phone: est.elements.phone.value.trim(),
      email: est.elements.email.value.trim(),
      zip,
      job: LABELS[jobSel.value],
      urgency, scope, bathrooms: baths,
      notes: est.elements.notes.value.trim(),
      estimate_low: lo, estimate_high: hi,
      source: 'barbosplumbing estimator',
      _subject: `New estimate request — ${est.elements.name.value.trim()}`
    };
    if (endpoint) {
      try {
        await fetch(`https://formspree.io/f/${endpoint}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (_) {}
    } else {
      console.info('[estimator] captured (no endpoint configured):', payload);
    }
  });

  /* Contact form demo -------------------------------------------- */
  const form = document.querySelector('form[data-demo-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-confirm');
      if (msg) {
        msg.style.opacity = '1';
        msg.textContent = `✓ Thanks — we'll reply to ${form.email.value || form.phone.value || 'you'} within one business day.`;
        setTimeout(() => form.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }

})();
