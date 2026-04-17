/* Bjork & Sons Plumbing — editorial interactions + estimator */
(function () {
  'use strict';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle('open', o); toggle.textContent = o ? '× Close' : '≡ Menu'; document.body.style.overflow = o ? 'hidden' : ''; };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  document.querySelectorAll('.marquee-track, .carousel-track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const isCar = track.classList.contains('carousel-track');
    const gap = isCar ? '1.2rem' : '3rem';
    const dur = isCar ? 65 : 45;
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex; gap:${gap}; width:max-content; animation:slideLeft ${dur}s linear infinite;`;
    if (isCar) wrap.style.paddingInline = 'clamp(1.25rem, 5vw, 3.5rem)';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none'; clone.style.animation = 'none';
    if (isCar) track.style.padding = 0;
  });

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cIO.unobserve(en.target);
        const to = parseFloat(en.target.dataset.count);
        const suffix = en.target.dataset.suffix || '';
        const dur = 1600, start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.floor(to * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else en.target.textContent = to.toLocaleString() + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cIO.observe(c));
  }

  /* Estimator ------------------------------------------ */
  const est = document.getElementById('estForm');
  if (!est) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#8b5e31';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  /* Eugene/Springfield 541 area */
  const PRIMARY_ZIPS = new Set([
    '97401','97402','97403','97404','97405','97408','97477','97478',
    '97440','97448','97451','97453','97455','97487','97426','97431',
    '97437','97438','97479','97490','97493','97424','97419','97389'
  ]);
  const BASES = {
    'water-heater':[1300, 3500],
    'repair':      [180, 820],
    'remodel':     [4200, 13500],
    'waterline':   [3000, 9000],
    'sump':        [650, 2200],
    'drain':       [220, 1500],
    'emergency':   [320, 1800],
    'inspection':  [180, 420]
  };
  const LABELS = {
    'water-heater': 'Water heater install or repair',
    'repair': 'Fixture or leak repair',
    'remodel': 'Bath or kitchen remodel plumbing',
    'waterline': 'Water line replacement',
    'sump': 'Sump pump service',
    'drain': 'Drain or sewer service',
    'emergency': 'Emergency plumbing',
    'inspection': 'Home plumbing inspection'
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
    if (!jobSel.value) { flash(jobSel, 'Pick a service'); return; }
    const urgency = est.elements.urgency.value || 'thisweek';
    const scope = est.elements.scope.value || 'medium';
    const zip = (est.elements.zip.value || '').trim();

    let [lo, hi] = BASES[jobSel.value];
    const scopeM = { small: 0.7, medium: 1.0, large: 1.6 }[scope] || 1;
    lo *= scopeM; hi *= scopeM;
    const urgM = { emergency: 1.25, thisweek: 1.0, flexible: 0.93 }[urgency] || 1;
    lo *= urgM; hi *= urgM;
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 85; hi += 130; }
    lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').innerHTML = `${fmt(lo)} <em>—</em> ${fmt(hi)}`;
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]}, ${scope} scope, ${urgency}${outOfArea ? ', out-of-area travel included' : ''}. Final price confirmed after a no-cost walk-through — we're never going to guess at your house.`;
    show(result);
  });

  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `Thank you — we'll reply within one business day. — Kevin & the Bjork & Sons crew`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
