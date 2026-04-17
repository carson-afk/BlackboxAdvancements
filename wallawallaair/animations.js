/* Walla Walla Air — elegant interactions + estimator */
(function () {
  'use strict';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle('open', o); toggle.textContent = o ? 'Close' : 'Menu'; document.body.style.overflow = o ? 'hidden' : ''; };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  document.querySelectorAll('.marquee-track, .showcase-track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const isShow = track.classList.contains('showcase-track');
    const gap = isShow ? '1.2rem' : '3.5rem';
    const dur = isShow ? 70 : 50;
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex; gap:${gap}; width:max-content; animation:slideLeft ${dur}s linear infinite;`;
    if (isShow) wrap.style.paddingInline = 'clamp(1.25rem, 5vw, 3.5rem)';
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none'; clone.style.animation = 'none';
    if (isShow) track.style.padding = 0;
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

  const est = document.getElementById('estForm');
  if (!est) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#7a1e2e';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  /* Walla Walla + College Place area */
  const PRIMARY_ZIPS = new Set([
    '99362','99361','99363','99324','99330','99328','99329','97862','97875','99326'
  ]);
  const BASES = {
    'ductless':  [3000, 9800],
    'hvac':      [4500, 12500],
    'fireplace': [2400, 7500],
    'gasline':   [450, 2800],
    'repair':    [180, 1100],
    'maintenance':[149, 399],
    'furnace':   [3500, 7800],
    'ac':        [4200, 9800]
  };
  const LABELS = {
    'ductless': 'Ductless mini-split install',
    'hvac': 'HVAC system install',
    'fireplace': 'Fireplace service or install',
    'gasline': 'Natural gas line work',
    'repair': 'System repair or diagnostic',
    'maintenance': 'Seasonal maintenance / tune-up',
    'furnace': 'Furnace install or replace',
    'ac': 'AC install or replace'
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
    if (!jobSel.value) { flash(jobSel, 'Please select a service'); return; }
    const size = est.elements.size.value || 'medium';
    const urgency = est.elements.urgency.value || 'flexible';
    const zip = (est.elements.zip.value || '').trim();

    let [lo, hi] = BASES[jobSel.value];
    const sizeM = { small: 0.72, medium: 1.0, large: 1.5 }[size] || 1;
    lo *= sizeM; hi *= sizeM;
    const urgM = { emergency: 1.28, thisweek: 1.0, flexible: 0.92 }[urgency] || 1;
    lo *= urgM; hi *= urgM;
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 120; hi += 180; }
    lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').innerHTML = `${fmt(lo)} <em>—</em> ${fmt(hi)}`;
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]}. ${size} scope, ${urgency} timing${outOfArea ? ', out-of-area travel included' : ''}. Dan personally confirms final pricing at a complimentary in-home consultation.`;
    show(result);
  });

  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `Thank you — Dan will be in touch within one business day.`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
