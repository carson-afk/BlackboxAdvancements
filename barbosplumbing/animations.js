/* Barbo's Plumbing — warm/playful interactions + estimator */
(function () {
  'use strict';

  /* Scroll reveals */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  /* Mobile menu */
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => {
      menu.classList.toggle('open', o);
      toggle.textContent = o ? 'Close ×' : 'Menu ☰';
      document.body.style.overflow = o ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  /* Infinite photo carousel duplication — guard against double-init */
  document.querySelectorAll('.photo-track').forEach((track) => {
    if (track.parentElement && track.parentElement.dataset.duped === '1') return;
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const wrap = document.createElement('div');
    wrap.dataset.duped = '1';
    wrap.style.cssText = 'display:flex; gap:1.8rem; width:max-content; animation:slideLeft 55s linear infinite;';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);
    wrap.appendChild(clone);
    track.style.animation = 'none';
    clone.style.animation = 'none';
  });
  document.querySelectorAll('.word-ticker .track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; gap:2.5rem; width:max-content; animation:slideLeft 32s linear infinite;';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none';
  });

  /* Counter animation for stats */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cIO.unobserve(en.target);
        const to = parseInt(en.target.dataset.count, 10);
        const suffix = en.target.dataset.suffix || '';
        const dur = 1400, start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.floor(to * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else en.target.textContent = to.toLocaleString() + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cIO.observe(c));
  }

  /* Estimator ---------------------------------------------- */
  const est = document.getElementById('estForm');
  if (!est) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#d94634';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  const PRIMARY_ZIPS = new Set([
    '98501','98502','98503','98506','98512','98513','98516',
    '98531','98532','98579','98589','98597','98327','98433',
    '98439','98444','98445','98465','98466','98467'
  ]);
  const BASES = {
    'water-heater': [1400, 3800],
    'repair':       [180, 820],
    'bathroom':     [4500, 14000],
    'kitchen':      [900, 4200],
    'waterline':    [3200, 9500],
    'sump':         [650, 2400],
    'drain':        [220, 1600]
  };
  const LABELS = {
    'water-heater': 'Water heater install/replace',
    'repair':       'Leak / fixture repair',
    'bathroom':     'Bathroom remodel',
    'kitchen':      'Kitchen plumbing',
    'waterline':    'Water line replacement',
    'sump':         'Sump pump',
    'drain':        'Drain / sewer'
  };

  const step1 = est.querySelector('[data-step="1"]');
  const step2 = est.querySelector('[data-step="2"]');
  const result = est.querySelector('[data-step="result"]');
  const goBtn = est.querySelector('#estGo');
  const backBtn = est.querySelector('#estBack');

  const show = (which) => {
    [step1, step2, result].forEach((el) => { if (el) el.hidden = true; });
    which.hidden = false;
    const y = est.getBoundingClientRect().top + scrollY - 80;
    scrollTo({ top: y, behavior: 'smooth' });
  };

  goBtn && goBtn.addEventListener('click', () => {
    const name = est.elements.name, phone = est.elements.phone, email = est.elements.email;
    let ok = true;
    if (!name.value.trim()) { flash(name, 'Required'); ok = false; }
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 7) { flash(phone, 'Valid phone'); ok = false; }
    if (!emailRe.test(email.value.trim())) { flash(email, 'Valid email'); ok = false; }
    if (!ok) return;
    show(step2);
  });
  backBtn && backBtn.addEventListener('click', () => show(step1));

  est.addEventListener('submit', (e) => {
    e.preventDefault();
    const jobSel = est.elements.job;
    if (!jobSel.value) { flash(jobSel, 'Pick a job'); return; }
    const urgency = est.elements.urgency.value || 'thisweek';
    const scope = est.elements.scope.value || 'medium';
    const baths = parseInt(est.elements.bathrooms.value, 10) || 0;
    const zip = (est.elements.zip.value || '').trim();

    let [lo, hi] = BASES[jobSel.value];
    const scopeM = { small: 0.65, medium: 1.0, large: 1.7 }[scope] || 1;
    lo *= scopeM; hi *= scopeM;
    if (jobSel.value === 'bathroom' && baths > 0) { lo *= baths; hi *= baths; }
    const urgM = { emergency: 1.25, thisweek: 1.0, flexible: 0.95 }[urgency] || 1;
    lo *= urgM; hi *= urgM;
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 95; hi += 135; }
    lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').textContent = `${fmt(lo)} – ${fmt(hi)}`;
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]} · ${urgency}${outOfArea ? ' (out-of-area travel included)' : ''}. Final price locked at the free on-site walk-through.`;
    show(result);
  });

  /* Contact form demo confirmation */
  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `Thanks! We'll reply within one business day. — Dan & Presley`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
