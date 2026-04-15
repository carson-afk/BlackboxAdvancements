/* Grass Monkey — lightweight animation helpers */
(function(){
  // meteors
  document.querySelectorAll('.meteors').forEach(el=>{
    const n = parseInt(el.dataset.count||'14',10);
    for(let i=0;i<n;i++){
      const s=document.createElement('span');
      s.style.setProperty('--x', (Math.random()*100).toFixed(2)+'%');
      s.style.setProperty('--dur', (3+Math.random()*5).toFixed(2)+'s');
      s.style.setProperty('--delay', (Math.random()*6).toFixed(2)+'s');
      el.appendChild(s);
    }
  });

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // mobile nav
  const t=document.querySelector('.mobile-toggle');
  const m=document.querySelector('.mobile-menu');
  if(t&&m){t.addEventListener('click',()=>m.classList.toggle('open'))}

  // faq
  document.querySelectorAll('.faq-item').forEach(i=>{
    i.addEventListener('click',()=>i.classList.toggle('open'));
  });

  // carousel clone for seamless loop
  document.querySelectorAll('.carousel-track').forEach(track=>{
    const items = Array.from(track.children);
    items.forEach(c=>track.appendChild(c.cloneNode(true)));
  });

  // heavy marquee clone
  document.querySelectorAll('.heavy-marquee-track').forEach(track=>{
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // tilt on service cards
  document.querySelectorAll('.service-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`translateY(-6px) perspective(800px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });

  // ESTIMATOR
  const form = document.getElementById('estimator');
  if(form){
    const state = { service:null, size:null, frequency:null, extras:[], name:'', email:'', phone:'', address:'', notes:'' };
    const steps = form.querySelectorAll('.step');
    const dots = form.querySelectorAll('.step-dot');
    const bars = form.querySelectorAll('.step-bar');
    let current = 0;

    function render(){
      steps.forEach((s,i)=>s.classList.toggle('active',i===current));
      dots.forEach((d,i)=>{
        d.classList.toggle('active',i===current);
        d.classList.toggle('done',i<current);
      });
      bars.forEach((b,i)=>b.classList.toggle('done',i<current));
    }

    form.querySelectorAll('[data-group]').forEach(group=>{
      const key = group.dataset.group;
      const multi = group.dataset.multi==='true';
      group.querySelectorAll('.choice').forEach(ch=>{
        ch.addEventListener('click',()=>{
          const val = ch.dataset.value;
          if(multi){
            ch.classList.toggle('selected');
            const arr = state[key];
            const idx = arr.indexOf(val);
            if(idx>-1)arr.splice(idx,1); else arr.push(val);
          }else{
            group.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected'));
            ch.classList.add('selected');
            state[key] = val;
          }
        });
      });
    });

    form.querySelectorAll('input,select,textarea').forEach(inp=>{
      inp.addEventListener('input',()=>{ state[inp.name] = inp.value });
    });

    form.querySelectorAll('[data-next]').forEach(b=>{
      b.addEventListener('click',()=>{
        // simple per-step validation
        if(current===0){
          if(!state.service){ alert('Pick a service to continue.'); return; }
          if(!state.size){ alert('Tell us the size of your property.'); return; }
        }
        if(current===1){
          if(!state.name||!state.email||!state.phone){ alert('Please fill in your name, email, and phone.'); return; }
        }
        if(current===1){
          computeEstimate();
        }
        current = Math.min(current+1, steps.length-1);
        render();
        window.scrollTo({top:form.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});
      });
    });
    form.querySelectorAll('[data-back]').forEach(b=>{
      b.addEventListener('click',()=>{ current=Math.max(0,current-1); render(); });
    });

    function computeEstimate(){
      const base = { mowing:55, landscaping:180, cleanup:220, fullservice:320, hedges:120, mulch:260 }[state.service] || 80;
      const sizeMult = { small:1, medium:1.6, large:2.4, xlarge:3.6, acreage:5.4 }[state.size] || 1;
      const freqMult = { oneTime:1, biweekly:.9, weekly:.85, monthly:.95 }[state.frequency] || 1;
      const extras = (state.extras||[]).length * 45;
      const low = Math.round(base*sizeMult*freqMult + extras*.5);
      const high = Math.round(base*sizeMult*freqMult*1.35 + extras);
      document.getElementById('estPrice').textContent = `$${low} – $${high}`;
      document.getElementById('estService').textContent = labelFor('service', state.service);
      document.getElementById('estSize').textContent = labelFor('size', state.size);
      document.getElementById('estFreq').textContent = labelFor('frequency', state.frequency) || 'One-time';
      document.getElementById('estName').textContent = state.name;
    }

    function labelFor(key,val){
      const el = form.querySelector(`[data-group="${key}"] .choice[data-value="${val}"] .nm`);
      return el ? el.textContent : '';
    }

    render();
  }
})();
