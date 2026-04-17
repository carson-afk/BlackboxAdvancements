/* Walla Walla Air — elegant interactions + estimator */
(function () {
  'use strict';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  // Track the live bottom edge of the sticky nav so the mobile menu sits flush
  // under it regardless of reviews-bar / emergency-strip / scroll position.
  const navEl = document.querySelector('.nav');
  const setHeaderOffset = () => {
    if (!navEl) return;
    const b = Math.max(0, Math.round(navEl.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty('--mobile-menu-top', b + 'px');
  };
  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);
  window.addEventListener('scroll', setHeaderOffset, { passive: true });

  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    // Upgrade toggle to icon-based button
    toggle.innerHTML = '<i class="ph ph-list" aria-hidden="true"></i>';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    // Inject close button inside the menu if not present
    let closeBtn = menu.querySelector('.mobile-menu-close');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'mobile-menu-close';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<i class="ph ph-x" aria-hidden="true"></i>';
      menu.prepend(closeBtn);
    }

    let scrollY = 0;
    const set = (o) => {
      if (o) {
        scrollY = window.scrollY;
        setHeaderOffset();
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + scrollY + 'px';
        document.body.style.width = '100%';
      } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      }
      menu.classList.toggle('open', o);
      toggle.innerHTML = o ? '<i class="ph ph-x" aria-hidden="true"></i>' : '<i class="ph ph-list" aria-hidden="true"></i>';
      toggle.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      toggle.setAttribute('aria-expanded', o ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
    closeBtn.addEventListener('click', () => set(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) set(false); });

    // Collapsible sections inside the mobile menu (Services / Service Areas).
    menu.querySelectorAll('[data-mm-group]').forEach((trigger) => {
      const group = trigger.getAttribute('data-mm-group');
      const children = menu.querySelectorAll('[data-mm-member="' + group + '"]');
      const setOpen = (o) => {
        trigger.classList.toggle('is-open', o);
        trigger.setAttribute('aria-expanded', o ? 'true' : 'false');
        children.forEach((c) => c.style.display = o ? '' : 'none');
      };
      setOpen(false);
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        setOpen(!trigger.classList.contains('is-open'));
      });
    });
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

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const flash = (input, msg) => {
    let err = input.parentNode.querySelector('.est-err');
    if (!err) { err = document.createElement('span'); err.className = 'est-err'; input.parentNode.appendChild(err); }
    err.textContent = msg;
    input.style.borderColor = '#7a1e2e';
    input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; }, { once: true });
  };

  /* Quote tool (mirrors wallawallaair.com/instant-quote) */
  const qForm = document.getElementById('estForm');
  if (qForm && qForm.classList.contains('quote-host')) {
    const TOTAL_STEPS = 6;
    const state = { system:'', heat:'', loc:'', size:'', units:'', _labels:{} };
    const steps = qForm.querySelectorAll('.quote-step');
    const bar = document.getElementById('quoteProgress');
    const stepLbl = document.getElementById('qStepNum');
    const backWrap = qForm.querySelector('.quote-back');
    const backBtn = document.getElementById('quoteBack');
    const summaryBox = document.getElementById('quoteSummary');
    const history = [];
    let current = 1;

    const SYSTEM_BASE = {
      hvac: [3500, 6500],
      heat: [2200, 4200],
      ac:   [1800, 3500]
    };
    const HEAT_M = { gas: 1.0, electric: 0.92, dual: 1.15 };
    const LOC_M  = { attic: 1.07, garage: 0.97, closet: 1.0, basement: 1.0, crawl: 1.10 };
    const SYSTEM_LBL = {
      hvac: 'Complete heating & cooling system',
      heat: 'Heating system',
      ac:   'A/C system'
    };
    const HEAT_LBL = { gas: 'natural gas', electric: 'electric', dual: 'dual fuel' };
    const LOC_LBL  = { attic: 'attic', garage: 'garage', closet: 'closet', basement: 'basement', crawl: 'crawl space' };
    const TON_LBL  = { '2': '2 Ton', '2.5': '2.5 Ton', '3': '3 Ton', '4': '4 Ton', '5': '5 Ton' };

    const showStep = (n) => {
      steps.forEach(s => { s.hidden = true; });
      const tgt = qForm.querySelector('[data-qstep="' + n + '"]');
      if (!tgt) return;
      tgt.hidden = false;
      current = n;
      if (typeof n === 'number') {
        if (stepLbl) stepLbl.textContent = n;
        if (bar) bar.style.width = (Math.min(n, TOTAL_STEPS) / TOTAL_STEPS * 100) + '%';
        if (backWrap) backWrap.hidden = (n === 1);
      } else {
        if (backWrap) backWrap.hidden = true;
        if (bar) bar.style.width = '100%';
      }
      const y = qForm.getBoundingClientRect().top + scrollY - 80;
      try { scrollTo({ top: y, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, y); }
    };

    const renderSummary = () => {
      if (!summaryBox) return;
      const items = [
        ['System', SYSTEM_LBL[state.system]],
        ['Heat source', HEAT_LBL[state.heat]],
        ['Indoor unit', LOC_LBL[state.loc]],
        ['Size', TON_LBL[state.size]],
        ['Units', state.units]
      ].filter(([_, v]) => v);
      summaryBox.innerHTML = items.map(([k, v]) =>
        `<div class="qsum-row"><span class="qsum-k">${k}</span><span class="qsum-v">${v}</span></div>`
      ).join('');
    };

    qForm.querySelectorAll('.qtile').forEach(tile => {
      tile.addEventListener('click', () => {
        const key = tile.dataset.q;
        const val = tile.dataset.v;
        state[key] = val;
        qForm.querySelectorAll('.qtile[data-q="' + key + '"]').forEach(t => t.classList.remove('is-selected'));
        tile.classList.add('is-selected');
        history.push(current);
        const next = (typeof current === 'number') ? current + 1 : 1;
        if (next === 6) renderSummary();
        setTimeout(() => showStep(next), 220);
      });
    });

    backBtn && backBtn.addEventListener('click', () => {
      if (history.length) {
        const prev = history.pop();
        showStep(prev);
      } else if (typeof current === 'number' && current > 1) {
        showStep(current - 1);
      }
    });

    qForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = qForm.elements.fullname;
      const email = qForm.elements.email;
      const phone = qForm.elements.phone;
      const address = qForm.elements.address;
      let ok = true;
      if (!fullname || !fullname.value.trim()) { flash(fullname, 'Required'); ok = false; }
      if (!email || !emailRe.test((email.value || '').trim())) { flash(email, 'Valid email'); ok = false; }
      if (!phone || !phone.value.trim() || phone.value.replace(/\D/g, '').length < 7) { flash(phone, 'Valid phone'); ok = false; }
      if (!address || !address.value.trim()) { flash(address, 'Required'); ok = false; }
      if (!state.system || !state.heat || !state.loc || !state.size || !state.units) {
        if (address) flash(address, 'Please complete all earlier steps');
        ok = false;
      }
      if (!ok) return;

      const tons = parseFloat(state.size) || 3;
      const units = parseInt(state.units, 10) || 1;
      const base = SYSTEM_BASE[state.system] || SYSTEM_BASE.hvac;
      let lo = base[0] * tons;
      let hi = base[1] * tons;
      const m = (HEAT_M[state.heat] || 1) * (LOC_M[state.loc] || 1) * units;
      lo *= m; hi *= m;
      lo = Math.round(lo / 100) * 100;
      hi = Math.round(hi / 100) * 100;

      const fmt = (n) => '$' + n.toLocaleString('en-US');
      qForm.querySelector('.est-range').innerHTML = fmt(lo) + ' <em>—</em> ' + fmt(hi);
      qForm.querySelector('.est-summary').textContent =
        SYSTEM_LBL[state.system] + ' · ' + TON_LBL[state.size] + ' · ' + HEAT_LBL[state.heat] + ' heat · indoor unit in ' + LOC_LBL[state.loc] + ' · ' + units + ' unit' + (units > 1 ? 's' : '') + '. Dan will be in touch within one business day to confirm final pricing.';
      showStep('result');
    });
  }

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
