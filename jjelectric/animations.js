/* JJ & S Electric — industrial interactions + estimator */
(function () {
  'use strict';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger, .metric').forEach((el) => io.observe(el));

  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle('open', o); toggle.textContent = o ? 'CLOSE' : 'MENU'; document.body.style.overflow = o ? 'hidden' : ''; };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  document.querySelectorAll('.ticker-track, .showcase-track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const isShow = track.classList.contains('showcase-track');
    const dur = isShow ? 60 : 38;
    const gap = isShow ? '1rem' : '3rem';
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex; gap:${gap}; width:max-content; animation:slideLeft ${dur}s linear infinite;`;
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none'; clone.style.animation = 'none';
  });

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cIO.unobserve(en.target);
        const to = parseFloat(en.target.dataset.count);
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

  /* Estimator */
  const est = document.getElementById('estForm');
  if (!est) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#ff3b3b';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  /* Yakima County 509 */
  const PRIMARY_ZIPS = new Set([
    '98901','98902','98903','98908','98948','98944','98930','98936',
    '98935','98947','98953','98933','98938','98922','98923','98937',
    '98939','98942','98932','98946','98921','98851','98952'
  ]);
  const BASES = {
    'panel':       [1800, 4800],
    'rewire':      [3500, 12000],
    'ev-charger':  [650, 2400],
    'lighting':    [220, 2800],
    'outlets':     [160, 1200],
    'troubleshoot':[180, 850],
    'generator':   [2800, 9500],
    'commercial':  [900, 15000],
    'newconstruct':[6500, 28000]
  };
  const LABELS = {
    'panel': 'Service panel upgrade',
    'rewire': 'Partial or whole-home rewire',
    'ev-charger': 'EV charger install (240V)',
    'lighting': 'Lighting install / upgrade',
    'outlets': 'Outlet / switch install',
    'troubleshoot': 'Troubleshooting / diagnostic',
    'generator': 'Generator / transfer switch',
    'commercial': 'Commercial electrical',
    'newconstruct': 'New construction wiring'
  };

  const step1 = est.querySelector('[data-step="1"]');
  const step2 = est.querySelector('[data-step="2"]');
  const result = est.querySelector('[data-step="result"]');
  const goBtn = est.querySelector('#estGo');
  const backBtn = est.querySelector('#estBack');

  const show = (which) => {
    [step1, step2, result].forEach((el) => { if (el) el.hidden = true; });
    which.hidden = false;
    const y = est.getBoundingClientRect().top + scrollY - 100;
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
    const amps = est.elements.amps.value || 'standard';
    const property = est.elements.property.value || 'residential';
    const urgency = est.elements.urgency.value || 'thisweek';
    const zip = (est.elements.zip.value || '').trim();

    let [lo, hi] = BASES[jobSel.value];
    const ampsM = { small: 0.75, standard: 1.0, large: 1.4 }[amps] || 1;
    lo *= ampsM; hi *= ampsM;
    const propM = { residential: 1.0, commercial: 1.3, industrial: 1.6 }[property] || 1;
    lo *= propM; hi *= propM;
    const urgM = { emergency: 1.35, thisweek: 1.0, flexible: 0.93 }[urgency] || 1;
    lo *= urgM; hi *= urgM;
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 95; hi += 150; }
    lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').textContent = `${fmt(lo)} — ${fmt(hi)}`;
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]} · ${property} · ${urgency}${outOfArea ? ' · out-of-area travel included' : ''}. Final price locked after free on-site assessment. All work permit-ready and inspection-compliant.`;
    show(result);
  });

  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `⚡ Transmission received. Jose or Sal will reach out within one business day.`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
