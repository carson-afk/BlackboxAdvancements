/* Wolf Pack Plumbing — interactions + estimator */
(function () {
  'use strict';

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveals */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  /* Mobile menu */
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const set = (o) => {
      menu.classList.toggle('open', o);
      toggle.textContent = o ? '/ close' : '/ menu';
      document.body.style.overflow = o ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  }

  /* Desktop areas dropdown — click toggle + outside-click close (hover handled by CSS) */
  document.querySelectorAll('.nav-dropdown').forEach((dd) => {
    const trigger = dd.querySelector('a');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth < 1101) return;
      e.preventDefault();
      dd.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });

  /* Marquee clone (banner + showcase seamless loop) */
  document.querySelectorAll('.banner .track, .showcase-track').forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const wrap = document.createElement('div');
    const dur = track.classList.contains('showcase-track') ? 60 : 40;
    wrap.style.cssText = `display:flex; gap:${track.classList.contains('showcase-track') ? '1rem' : '3rem'}; width:max-content; animation:slideLeft ${dur}s linear infinite;`;
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track); wrap.appendChild(clone);
    track.style.animation = 'none'; clone.style.animation = 'none';
  });

  /* Metric counter */
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

  /* Spotlight on cards — follows cursor for radial highlight */
  if (!prefersReduced) {
    const spotlight = (el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    };
    document.querySelectorAll('.svc, .feature, .quote').forEach(spotlight);
  }

  /* Hero panel subtle tilt on mouse — 21st.dev-style */
  if (!prefersReduced) {
    document.querySelectorAll('.hero-panel, .split-photo').forEach((panel) => {
      const strength = panel.classList.contains('split-photo') ? 4 : 6;
      panel.addEventListener('pointermove', (e) => {
        const r = panel.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        panel.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
      });
      panel.addEventListener('pointerleave', () => { panel.style.transform = ''; });
    });
  }

  /* Sticky mobile CTA visibility — show after scrolling past hero */
  const sticky = document.querySelector('.sticky-cta');
  if (sticky) {
    const threshold = 480;
    const onScroll = () => { sticky.classList.toggle('is-on', window.scrollY > threshold); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Estimator ---------------------------------------------- */
  const est = document.getElementById('estForm');
  if (est) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const flash = (input, msg) => {
      let err = input.parentNode.querySelector('.est-err');
      if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
      err.textContent = msg;
      input.style.borderColor = '#dc2e34';
      input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
    };

    const PRIMARY_ZIPS = new Set([
      '97301','97302','97303','97304','97305','97306','97307','97308','97309','97310','97314',
      '97317','97381','97385','97071','97325','97002','97026','97032','97373','97137','97338','97351'
    ]);
    const BASES = {
      'drain':       [220, 1400],
      'water-heater':[1300, 3600],
      'pipe':        [450, 2400],
      'leak':        [260, 950],
      'repair':      [180, 780],
      'emergency':   [350, 1600],
      'remodel':     [2800, 12000]
    };
    const LABELS = {
      'drain': 'Drain cleaning / hydro-jet',
      'water-heater': 'Water heater install',
      'pipe': 'Pipe replacement / locate',
      'leak': 'Leak detection + repair',
      'repair': 'Fixture repair (faucet / toilet / disposal)',
      'emergency': 'Emergency plumbing',
      'remodel': 'Plumbing remodel'
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
      const prop = est.elements.property.value || 'residential';
      const zip = (est.elements.zip.value || '').trim();

      let [lo, hi] = BASES[jobSel.value];
      const scopeM = { small: 0.65, medium: 1.0, large: 1.7 }[scope] || 1;
      lo *= scopeM; hi *= scopeM;
      const propM = { residential: 1.0, commercial: 1.2, rental: 0.95 }[prop] || 1;
      lo *= propM; hi *= propM;
      const urgM = { emergency: 1.3, thisweek: 1.0, flexible: 0.92 }[urgency] || 1;
      lo *= urgM; hi *= urgM;
      const outOfArea = zip.length === 5 && !PRIMARY_ZIPS.has(zip);
      if (outOfArea) { lo += 85; hi += 140; }
      lo = Math.round(lo / 25) * 25; hi = Math.round(hi / 25) * 25;

      const fmt = (n) => `$${n.toLocaleString('en-US')}`;
      est.querySelector('.est-range').textContent = `${fmt(lo)} — ${fmt(hi)}`;
      est.querySelector('.est-summary').textContent =
        `${LABELS[jobSel.value]} · ${prop} · ${urgency}${outOfArea ? ' · out-of-area travel included' : ''}. 6-year warranty on installs. Final price locked at on-site walk-through.`;
      show(result);
    });
  }

  /* Contact form demo — local-only confirmation, no endpoint wired */
  const demo = document.querySelector('form[data-demo]');
  if (demo) {
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = demo.querySelector('.demo-confirm');
      if (msg) {
        msg.textContent = `// message received. wolfpack dispatch will reply within 1 business day.`;
        msg.style.opacity = '1';
        setTimeout(() => demo.reset(), 400);
        setTimeout(() => { msg.style.opacity = '0'; }, 8000);
      }
    });
  }

  /* Current year in footer — redundant safety */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
