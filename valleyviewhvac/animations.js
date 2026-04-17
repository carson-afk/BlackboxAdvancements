/* Valley View HVAC — interactions + estimator */
(function () {
  'use strict';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle('open', o); toggle.textContent = o ? 'Close' : 'Menu'; document.body.style.overflow = o ? 'hidden' : ''; };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  document.querySelectorAll('.ticker-track, .showcase-track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const wrap = document.createElement('div');
    const isShow = track.classList.contains('showcase-track');
    const dur = isShow ? 55 : 40;
    wrap.style.cssText = `display:flex; gap:${isShow ? '1rem' : '3rem'}; width:max-content; animation:slideLeft ${dur}s linear infinite;`;
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
          const val = to * eased;
          en.target.textContent = (val % 1 === 0 ? Math.floor(val) : val.toFixed(1)).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else en.target.textContent = to.toLocaleString() + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cIO.observe(c));
  }

  /* Estimator --------------------------------------------- */
  const est = document.getElementById('estForm');
  if (!est) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#d94e00';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  /* Salem / mid-Willamette primary zones */
  const PRIMARY_ZIPS = new Set([
    '97301','97302','97303','97304','97305','97306','97307','97308','97309','97317',
    '97321','97322','97324','97352','97371','97373','97381','97385','97071','97325',
    '97002','97026','97032','97128','97132','97137','97392'
  ]);
  const BASES = {
    'ac-install':   [4800, 9500],
    'furnace':      [3800, 8200],
    'heat-pump':    [5500, 14500],
    'ductless':     [3200, 9800],
    'repair':       [180, 1200],
    'maintenance':  [149, 399],
    'duct':         [450, 3200],
    'iaq':          [300, 2400]
  };
  const LABELS = {
    'ac-install': 'AC install / replace',
    'furnace': 'Furnace install / replace',
    'heat-pump': 'Heat pump install',
    'ductless': 'Ductless mini-split',
    'repair': 'System repair',
    'maintenance': 'Tune-up / maintenance',
    'duct': 'Duct cleaning / sealing',
    'iaq': 'Indoor air quality upgrade'
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
    const size = est.elements.size.value || 'medium';
    const property = est.elements.property.value || 'residential';
    const discount = est.elements.discount && est.elements.discount.value !== 'none';
    const zip = (est.elements.zip.value || '').trim();

    let [lo, hi] = BASES[jobSel.value];
    const sizeM = { small: 0.75, medium: 1.0, large: 1.45, xlarge: 1.85 }[size] || 1;
    lo *= sizeM; hi *= sizeM;
    const propM = { residential: 1.0, commercial: 1.35 }[property] || 1;
    lo *= propM; hi *= propM;
    if (discount) { lo *= 0.9; hi *= 0.9; }
    const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
    if (outOfArea) { lo += 100; hi += 150; }
    lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    est.querySelector('.est-range').textContent = `${fmt(lo)} – ${fmt(hi)}`;
    est.querySelector('.est-summary').textContent =
      `${LABELS[jobSel.value]} · ${property} · ${size}${discount ? ' · 10% community discount applied' : ''}${outOfArea ? ' · out-of-area travel' : ''}. 10-year equipment / 2-year workmanship warranty. Final price confirmed at free in-home estimate.`;
    show(result);
  });

  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `Thanks! A Valley View technician will reach out within one business day.`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }
})();
