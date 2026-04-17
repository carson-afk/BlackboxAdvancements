#!/usr/bin/env node
/**
 * Generate "Service Areas" hub + 10 city subpages per client.
 * Run: node _generate-areas.js
 * NOTE: can be deleted after run; kept in repo for regeneration.
 */
const fs = require('fs');
const path = require('path');

/* shared unsplash photo pool (stable URLs) */
const PHOTOS = [
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1621568781996-d624a470ddae?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1542013936693-884638d954f2?auto=format&fit=crop&w=900&q=75',
];
const HVAC_PHOTOS = [
  'https://images.unsplash.com/photo-1631545308456-8ee9fa20acb8?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1531756716853-09cbd304dc0a?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1580636803906-3bc43976d141?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=75',
];
const ELECTRIC_PHOTOS = [
  'https://images.unsplash.com/photo-1621905252472-e8de10a07b8d?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1558617320-b3a7d59a5a55?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1624365169364-0640dd10e180?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1565043534407-2df03d1f8b46?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1547026229-4c9df0773eb4?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1581092915737-d34a8e1ea7f4?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&w=900&q=75',
];

const CLIENTS = {
  barbosplumbing: {
    slug: 'barbosplumbing',
    brand: "Barbo's Plumbing",
    industry: 'plumbing',
    photos: PHOTOS,
    phone: '(360) 584-9290',
    phoneHref: 'tel:+13605849290',
    email: 'barbosplumbing@gmail.com',
    areas: [
      { slug: 'olympia',    name: 'Olympia',    county: 'Thurston County',  zip: '98501', note: 'Our home base. Olympia homes range from post-war bungalows with original galvanized supply lines to brand-new South Capitol construction — we handle both.' },
      { slug: 'lacey',      name: 'Lacey',      county: 'Thurston County',  zip: '98503', note: "Lacey's subdivisions often have polybutylene or early PEX that's hitting end-of-life. We do a lot of water-heater swaps and partial repipes here." },
      { slug: 'tumwater',   name: 'Tumwater',   county: 'Thurston County',  zip: '98501', note: 'Tumwater mixes older Littlerock-area farmhouses with newer Tumwater Hill development. Water pressure issues and sump needs are common calls.' },
      { slug: 'yelm',       name: 'Yelm',       county: 'Thurston County',  zip: '98597', note: 'Yelm rural properties often run on wells with PRVs that need attention. We also see a lot of remodel and addition plumbing out here.' },
      { slug: 'tenino',     name: 'Tenino',     county: 'Thurston County',  zip: '98589', note: "Smaller town, older housing stock — classic Tenino plumbing runs are copper and cast iron. We're comfortable working in every vintage." },
      { slug: 'rainier',    name: 'Rainier',    county: 'Thurston County',  zip: '98576', note: 'Rural Rainier properties present well-water, septic, and crawl-space drainage challenges we solve regularly.' },
      { slug: 'rochester',  name: 'Rochester',  county: 'Thurston County',  zip: '98579', note: 'Rochester is rural and our further-out calls — still inside our primary service window, still flat-rate.' },
      { slug: 'dupont',     name: 'DuPont',     county: 'Pierce County',    zip: '98327', note: "DuPont's newer neighborhoods and proximity to JBLM means we see a lot of military families and fast turnover — fast, clean fixes appreciated." },
      { slug: 'centralia',  name: 'Centralia',  county: 'Lewis County',     zip: '98531', note: 'Centralia has beautiful historic homes with corresponding plumbing surprises. Careful work on older vintages is our specialty.' },
      { slug: 'chehalis',   name: 'Chehalis',   county: 'Lewis County',     zip: '98532', note: 'Chehalis service calls: bathroom remodels and leak repairs in 1940s-60s housing stock. Out-of-area travel applies.' }
    ],
    renderer: renderBarbos,
  },
  wolfpackplumbing: {
    slug: 'wolfpackplumbing',
    brand: 'Wolf Pack Plumbing',
    industry: 'plumbing',
    photos: PHOTOS,
    phone: '(503) 878-2523',
    phoneHref: 'tel:+15038782523',
    email: 'joe@wolfpackplumbingservices.com',
    areas: [
      { slug: 'salem',          name: 'Salem',          county: 'Marion County',    zip: '97301', note: "Salem's mix of historic and post-war homes means we see everything from cast-iron drains to new polybutylene failures." },
      { slug: 'keizer',         name: 'Keizer',         county: 'Marion County',    zip: '97303', note: "Keizer's 70s-80s development era has typical water heater and supply line end-of-life calls. 24/7 emergency coverage." },
      { slug: 'woodburn',       name: 'Woodburn',       county: 'Marion County',    zip: '97071', note: 'Woodburn service zone includes orchards and farms — well-pump and pressure-tank work alongside residential.' },
      { slug: 'silverton',      name: 'Silverton',      county: 'Marion County',    zip: '97381', note: "Silverton's historic downtown and newer hillside homes both get our full Wolf Pack service: flat-rate, 6-yr warranty." },
      { slug: 'stayton',        name: 'Stayton',        county: 'Marion County',    zip: '97383', note: 'Stayton rural properties with private wells, septic tie-ins, and older galvanized supply lines — straightforward for us.' },
      { slug: 'turner',         name: 'Turner',         county: 'Marion County',    zip: '97392', note: "Turner is small-town territory with tight communities — one referral leads to five. We've become the default plumber here." },
      { slug: 'monmouth',       name: 'Monmouth',       county: 'Polk County',      zip: '97361', note: 'Monmouth college-town rentals drive constant plumbing turnover work. Property managers love our response time.' },
      { slug: 'dallas',         name: 'Dallas',         county: 'Polk County',      zip: '97338', note: 'Dallas properties tend toward larger lots with irrigation systems, backflow preventers, and outdoor hose-bib clusters we service.' },
      { slug: 'independence',   name: 'Independence',   county: 'Polk County',      zip: '97351', note: 'Independence historic homes often need careful, non-invasive leak work — right in our wheelhouse.' },
      { slug: 'mount-angel',    name: 'Mt. Angel',      county: 'Marion County',    zip: '97362', note: 'Mt. Angel heritage homes with 100+ years of plumbing retrofits. We approach every fix with respect for the building.' }
    ],
    renderer: renderWolfPack,
  },
  valleyviewhvac: {
    slug: 'valleyviewhvac',
    brand: 'Valley View HVAC',
    industry: 'hvac',
    photos: HVAC_PHOTOS,
    phone: '(971) 712-6763',
    phoneHref: 'tel:+19717126763',
    email: 'vvhvac.nw@gmail.com',
    areas: [
      { slug: 'salem',         name: 'Salem',         county: 'Marion County',   zip: '97301', note: "Salem's mix of 50s bungalows and newer suburban development means we spec everything from 2-ton minimums to 5-ton variable-speed systems." },
      { slug: 'albany',        name: 'Albany',        county: 'Linn County',     zip: '97321', note: "Albany's climate extremes and mixed housing stock call for right-sized heat pumps and careful duct sealing." },
      { slug: 'dallas',        name: 'Dallas',        county: 'Polk County',     zip: '97338', note: 'Dallas homes run the gamut — we do cold-climate heat pump installs here and plenty of ductless retrofits.' },
      { slug: 'mcminnville',   name: 'McMinnville',   county: 'Yamhill County',  zip: '97128', note: 'McMinnville wine-country properties often need careful, aesthetic installs for tasting rooms and historic farmhouses.' },
      { slug: 'molalla',       name: 'Molalla',       county: 'Clackamas County',zip: '97038', note: 'Molalla rural properties include larger homes needing two-stage systems and detached shops with ductless.' },
      { slug: 'stayton',       name: 'Stayton',       county: 'Marion County',   zip: '97383', note: 'Stayton HVAC work: propane-to-heat-pump conversions are big here thanks to electrification incentives.' },
      { slug: 'independence',  name: 'Independence',  county: 'Polk County',     zip: '97351', note: "Independence's historic homes benefit from ductless mini-splits where ducting isn't feasible — a big share of our work." },
      { slug: 'woodburn',      name: 'Woodburn',      county: 'Marion County',   zip: '97071', note: 'Woodburn we handle residential, retirement community, and light-commercial HVAC with scheduled maintenance plans.' },
      { slug: 'keizer',        name: 'Keizer',        county: 'Marion County',   zip: '97303', note: 'Keizer service area: mostly residential, usually heat-pump conversions and tune-up maintenance programs.' },
      { slug: 'monmouth',      name: 'Monmouth',      county: 'Polk County',     zip: '97361', note: 'Monmouth HVAC spans Western Oregon University rentals, historic downtown homes, and newer neighborhoods.' }
    ],
    renderer: renderValleyView,
  },
  bjorkandsons: {
    slug: 'bjorkandsons',
    brand: 'Bjork & Sons Plumbing',
    industry: 'plumbing',
    photos: PHOTOS,
    phone: '(541) 420-9370',
    phoneHref: 'tel:+15414209370',
    email: 'kevin.bjork85@gmail.com',
    areas: [
      { slug: 'eugene',         name: 'Eugene',         county: 'Lane County', zip: '97401', note: 'Eugene is where Bjork & Sons started — we know every neighborhood from South Hills to Cal Young, and every era of Eugene plumbing.' },
      { slug: 'springfield',    name: 'Springfield',    county: 'Lane County', zip: '97477', note: 'Springfield has a higher concentration of 60s-80s housing. Polybutylene replacement and water-heater swaps are routine here.' },
      { slug: 'creswell',       name: 'Creswell',       county: 'Lane County', zip: '97426', note: 'Creswell rural properties often feature wells, pressure tanks, and long supply line runs. We service and upgrade them.' },
      { slug: 'cottage-grove',  name: 'Cottage Grove',  county: 'Lane County', zip: '97424', note: "Cottage Grove's historic downtown and surrounding neighborhoods include some of our longest-standing customer relationships." },
      { slug: 'junction-city',  name: 'Junction City',  county: 'Lane County', zip: '97448', note: 'Junction City service work includes modest residential, larger agricultural properties, and outbuildings.' },
      { slug: 'veneta',         name: 'Veneta',         county: 'Lane County', zip: '97487', note: 'Veneta rural homes often have well-pump systems and crawlspace plumbing that needs seasonal attention.' },
      { slug: 'pleasant-hill',  name: 'Pleasant Hill',  county: 'Lane County', zip: '97455', note: 'Pleasant Hill is mostly rural — we handle well systems, long supply runs, and careful remodel work on older homes.' },
      { slug: 'harrisburg',     name: 'Harrisburg',     county: 'Linn County', zip: '97446', note: "Harrisburg is at the northern edge of our service area — we've built enough relationships here to keep coming back." },
      { slug: 'coburg',         name: 'Coburg',         county: 'Lane County', zip: '97408', note: 'Coburg historic homes with their own century of plumbing retrofits deserve a plumber who respects original materials.' },
      { slug: 'oakridge',       name: 'Oakridge',       county: 'Lane County', zip: '97463', note: 'Oakridge mountain properties have unique challenges — freezing crawlspaces, well systems, summer-home water shut-offs. We know them.' }
    ],
    renderer: renderBjork,
  },
  jjelectric: {
    slug: 'jjelectric',
    brand: 'JJ & S Electric',
    industry: 'electric',
    photos: ELECTRIC_PHOTOS,
    phone: '509.504.5504',
    phoneHref: 'tel:+15095045504',
    email: 'jjselectricllc509@gmail.com',
    areas: [
      { slug: 'yakima',           name: 'Yakima',           county: 'Yakima County',   zip: '98901', note: 'Yakima is our primary service area — residential, commercial, new-construction across the city. Historic panels and brand-new service drops equally.' },
      { slug: 'selah',            name: 'Selah',            county: 'Yakima County',   zip: '98942', note: 'Selah residential work leans toward panel upgrades and EV-charger installs for single-family homes. Agricultural work too.' },
      { slug: 'moxee',            name: 'Moxee',            county: 'Yakima County',   zip: '98936', note: 'Moxee ranges from ag-belt operations to residential — we wire hop barns, pivots, and housing tracts all in the same week.' },
      { slug: 'union-gap',        name: 'Union Gap',        county: 'Yakima County',   zip: '98903', note: 'Union Gap commercial and residential runs. Strip-mall TI work, convenience-store upgrades, residential panel swaps.' },
      { slug: 'terrace-heights',  name: 'Terrace Heights',  county: 'Yakima County',   zip: '98901', note: "Terrace Heights newer subdivision work: smart-home lighting, EV chargers, whole-home surge protection." },
      { slug: 'wapato',           name: 'Wapato',           county: 'Yakima County',   zip: '98951', note: 'Wapato: mostly residential and small commercial. Agricultural irrigation-controller work too.' },
      { slug: 'toppenish',        name: 'Toppenish',        county: 'Yakima County',   zip: '98948', note: 'Toppenish historic downtown storefront TI work and residential rewires in older housing stock.' },
      { slug: 'zillah',           name: 'Zillah',           county: 'Yakima County',   zip: '98953', note: "Zillah vineyard-country electrical — we wire tasting rooms, estate homes, and a fair amount of agricultural service work." },
      { slug: 'sunnyside',        name: 'Sunnyside',        county: 'Yakima County',   zip: '98944', note: 'Sunnyside commercial base is significant — cold-storage, food processing, and residential all on our book.' },
      { slug: 'ellensburg',       name: 'Ellensburg',       county: 'Kittitas County', zip: '98926', note: "Ellensburg is at our northern edge — CWU rentals, historic homes, and new construction. We cover the whole city." }
    ],
    renderer: renderJJ,
  },
  wallawallaair: {
    slug: 'wallawallaair',
    brand: 'Walla Walla Air',
    industry: 'hvac',
    photos: HVAC_PHOTOS,
    phone: '(509) 525-1339',
    phoneHref: 'tel:+15095251339',
    email: 'dan@wallawallaair.com',
    areas: [
      { slug: 'walla-walla',      name: 'Walla Walla',      county: 'Walla Walla County',  zip: '99362', note: 'Walla Walla is home base. Historic downtown homes with complex retrofit needs. Tasting-room climate systems. Estate homes in the hills.' },
      { slug: 'college-place',    name: 'College Place',    county: 'Walla Walla County',  zip: '99324', note: 'College Place newer and mid-century homes, often ductless retrofits for college faculty housing and small-family residences.' },
      { slug: 'milton-freewater', name: 'Milton-Freewater', county: 'Umatilla County, OR', zip: '97862', note: "Milton-Freewater crosses the OR/WA border — we serve it as part of the greater Walla Walla Valley with careful work." },
      { slug: 'touchet',          name: 'Touchet',          county: 'Walla Walla County',  zip: '99360', note: 'Touchet rural properties include agricultural spaces, custom estate homes, and vineyard operations needing HVAC.' },
      { slug: 'dayton',           name: 'Dayton',           county: 'Columbia County',     zip: '99328', note: "Dayton's historic homes deserve careful HVAC retrofits. Gas fireplace work is common here given the climate." },
      { slug: 'waitsburg',        name: 'Waitsburg',        county: 'Walla Walla County',  zip: '99361', note: 'Waitsburg farmhouses and small downtown properties with older mechanical systems benefit from right-sized heat-pump retrofits.' },
      { slug: 'prescott',         name: 'Prescott',         county: 'Walla Walla County',  zip: '99348', note: 'Prescott is rural Walla Walla Valley — we serve scattered estates and working farms with HVAC and gas-line work.' },
      { slug: 'lowden',           name: 'Lowden',           county: 'Walla Walla County',  zip: '99360', note: 'Lowden wine-country residences and tasting rooms need climate systems designed for precise humidity and temperature control.' },
      { slug: 'burbank',          name: 'Burbank',          county: 'Walla Walla County',  zip: '99323', note: 'Burbank residential and light-commercial HVAC work — we cover this area with the same standards as our home city.' },
      { slug: 'pendleton',        name: 'Pendleton',        county: 'Umatilla County, OR', zip: '97801', note: "Pendleton is at the southern edge of our service area. We extend out here for larger projects where our standards are valued." }
    ],
    renderer: renderWalla,
  }
};

/* -------- Renderers per client (match each site's design system) -------- */

function renderBarbos({ client, area, isHub }) {
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@500;700&display=swap" rel="stylesheet">`;
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">🔧</span><span><span class="tm">Barbo's <em>Plumbing</em></span><small>a family business built on trust</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="estimator.html">Instant Estimate</a>
    <a href="gallery.html">Gallery</a>
    <a href="areas.html"${navActive('areas')}>Service Areas</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </nav>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone}</a>
  <button class="mobile-toggle" aria-label="Menu">Menu ☰</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Instant Estimate</a><a href="gallery.html">Gallery</a><a href="areas.html">Service Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  <a href="${client.phoneHref}" class="btn btn-coral" style="margin-top:1rem;">Call ${client.phone}</a>
</div>`;
  const footer = `<footer class="foot">
  <div class="wrap foot-grid">
    <div><div class="brand"><span class="mark">🔧</span><span class="tm">Barbo's Plumbing</span></div><p style="color:rgba(255,255,255,0.7); max-width:30ch;">Father-daughter master plumbers serving the South Sound since 2009.</p></div>
    <div><h5>Services</h5><ul><li><a href="services.html">Water Heaters</a></li><li><a href="services.html">Leak Repair</a></li><li><a href="services.html">Bath &amp; Kitchen</a></li></ul></div>
    <div><h5>Service area</h5><ul><li><a href="areas.html">All service areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
    <div><h5>Say hi</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li><li>Mon–Thu 7am–5pm</li></ul></div>
  </div>
  <div class="wrap foot-bottom"><span>© <span id="year"></span> Barbo's Plumbing LLC</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div>
</footer>`;

  if (isHub) {
    const cards = client.areas.map((a, i) => `
      <a href="${a.slug}.html" class="svc">
        <span class="tag">${a.county}</span>
        <div class="ico">📍</div>
        <h3>${a.name}</h3>
        <p>${a.note}</p>
      </a>`).join('');

    return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><base href="/barbosplumbing/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — Barbo's Plumbing</title>
<meta name="description" content="Barbo's Plumbing serves Olympia, Lacey, Tumwater, Yelm, Tenino, Rainier, Rochester, DuPont, Centralia, and Chehalis across Thurston and Lewis counties." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>
${nav}
<section class="page-hero"><div class="wrap">
  <span class="eye">service areas</span>
  <h1>Where we <span class="sq">show up.</span></h1>
  <p>Ten South Sound communities where Barbo's has been showing up for 15+ years. Pick your town below for local details, common jobs, and neighborhood-specific notes.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">across the south sound</span><h2>Pick your <span class="sq">town.</span></h2><p>Same family crew. Same flat-rate honesty. Same warranty-backed work — no matter which corner of the South Sound you're in.</p></header>
  <div class="svc-grid stagger" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">${cards}</div>
</div></section>
<section class="cta"><span class="wiggle">your town, your crew ✨</span><div class="wrap">
  <h2>Don't see<br/><span class="sun-hl">your town?</span></h2>
  <p style="max-width:56ch; margin:1rem auto 2rem;">If you're in the South Sound, there's a good chance we serve you — out-of-area travel fees apply past our primary zone but the price is always up-front.</p>
  <div class="cta-actions"><a href="estimator.html" class="btn btn-primary">Get instant estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn btn-coral">${client.phone}</a></div>
</div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  /* city page */
  const pic1 = client.photos[0];
  const pic2 = client.photos[3 % client.photos.length];
  const pic3 = client.photos[6 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><base href="/barbosplumbing/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plumber in ${area.name}, WA — Barbo's Plumbing</title>
<meta name="description" content="Licensed plumber serving ${area.name}, ${area.county}. Water heaters, leak repair, bath remodels, sump pumps. Family-owned, flat-rate pricing, warranty-backed." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>
${nav}
<section class="page-hero"><div class="wrap">
  <span class="eye">service area · ${area.county.toLowerCase()}</span>
  <h1>Plumber in<br/><span class="sq">${area.name}, WA.</span></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap" style="display:grid; grid-template-columns:1.1fr 1fr; gap:3rem; align-items:center;">
  <div class="reveal">
    <span class="eye">what we do here</span>
    <h2 style="font-family:var(--ff-display); font-weight:500; font-size:clamp(2rem,4.5vw,3.2rem); line-height:1.05; letter-spacing:-0.02em; margin:0.5rem 0 1rem;">A familiar face,<br/><em style="color:var(--coral);">when ${area.name} calls.</em></h2>
    <p style="color:var(--ink-soft); font-size:1.1rem; margin-bottom:1rem;">Barbo's has been running jobs in ${area.name} for over a decade. Water heaters, slab leaks, bathroom rough-ins, emergency fixes — same crew every time, same flat-rate pricing, same 5-star follow-through.</p>
    <p style="color:var(--ink-soft); margin-bottom:1.5rem;">Dispatch from Olympia averages 40 minutes to ${area.name}. If you're in ${area.zip} or the surrounding area, we'll be there faster than most.</p>
    <div class="hero-cta">
      <a href="estimator.html" class="btn btn-coral">Get an estimate <span class="arrow">→</span></a>
      <a href="${client.phoneHref}" class="btn">${client.phone}</a>
    </div>
  </div>
  <div class="hero-photo reveal" style="padding:0;">
    <div class="frame" style="aspect-ratio:4/5;"><img src="${pic1}" alt="Work in ${area.name}"></div>
    <div class="sticker s1"><span class="num">${area.name}</span><span class="lbl">your neighborhood</span></div>
    <div class="sticker s2"><span class="num">~40min</span><span class="lbl">dispatch</span></div>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eye">common ${area.name} jobs</span><h2>Services we run<br/><span class="sq">around here.</span></h2></header>
  <div class="svc-grid stagger">
    <article class="svc"><span class="tag">~ typical ${area.name} home</span><div class="ico">🔥</div><h3>Water heater swap</h3><p>Tank, tankless, heat-pump. Same-day diagnostics, manufacturer-backed installs, code-compliant venting + drip pan.</p></article>
    <article class="svc"><span class="tag">~ leaky faucets</span><div class="ico">💧</div><h3>Leak repair</h3><p>Acoustic + thermal leak detection — find the source without tearing up your walls or floors.</p></article>
    <article class="svc"><span class="tag">~ design + build</span><div class="ico">🛁</div><h3>Bath remodel</h3><p>Rough-in + finish plumbing, permitted, coordinated with your contractor. Tub-to-shower conversions a specialty.</p></article>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eye">recent ${area.name} jobs</span><h2>Field notes from<br/><span class="sq">around the block.</span></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>water heater swap · ${area.name.toLowerCase()}</figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>bath remodel rough-in · ${area.name.toLowerCase()}</figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>leak locate · ${area.name.toLowerCase()}</figcaption></figure>
  </div>
</div></section>

<section class="cta"><span class="wiggle">hey ${area.name.toLowerCase()} ✨</span><div class="wrap">
  <h2>Need a plumber in<br/><span class="sun-hl">${area.name}?</span></h2>
  <p style="max-width:52ch; margin:1rem auto 2rem;">Call the shop or use the instant estimator. We'll send a real person — Dan or Presley — for a flat-rate walk-through.</p>
  <div class="cta-actions"><a href="estimator.html" class="btn btn-primary">Instant estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn btn-coral">${client.phone} <span class="arrow">→</span></a></div>
</div></section>

${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderWolfPack({ client, area, isHub }) {
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">▲</span><span class="tm">WOLF PACK<small>plumbing · salem or</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimator</a><a href="gallery.html">Projects</a><a href="areas.html"${navActive('areas')}>Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  </nav>
  <span class="nav-meta">24/7 dispatch</span>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone} <span>→</span></a>
  <button class="mobile-toggle" aria-label="Menu">/ menu</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimator</a><a href="gallery.html">Projects</a><a href="areas.html">Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
</div>`;
  const footer = `<footer class="foot"><div class="wrap foot-grid">
  <div><div class="brand"><span class="mark">▲</span><span class="tm">WOLF PACK</span></div><p style="max-width:30ch;">Straight-shooting plumbers for Salem, Keizer, Woodburn and the mid-Willamette.</p></div>
  <div><h5>/ services</h5><ul><li><a href="services.html">Drain cleaning</a></li><li><a href="services.html">Water heaters</a></li><li><a href="services.html">Leak detection</a></li></ul></div>
  <div><h5>/ service area</h5><ul><li><a href="areas.html">All areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
  <div><h5>/ contact</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li></ul></div>
</div><div class="wrap foot-bottom"><span>© <span id="year"></span> Wolf Pack Plumbing · Licensed · Bonded · Insured</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div></footer>`;

  if (isHub) {
    const cards = client.areas.map((a, i) => `
      <a href="${a.slug}.html" class="svc">
        <span class="n">${String(i+1).padStart(2,'0')} / ${a.county.toUpperCase()}</span>
        <h3>${a.name.toUpperCase()}</h3>
        <p>${a.note}</p>
      </a>`).join('');

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/wolfpackplumbing/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — Wolf Pack Plumbing</title>
<meta name="description" content="Wolf Pack Plumbing serves Salem, Keizer, Woodburn, Silverton, Stayton, Turner, Monmouth, Dallas, Independence, and Mt. Angel across Marion and Polk counties." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}<main>
<section class="page-hero" data-bigword="AREAS"><div class="wrap">
  <span class="eye">SERVICE AREAS</span><h1>WHERE WE RUN<br/><span class="red">THE CALL.</span></h1>
  <p>Ten mid-Willamette towns under our direct coverage. Pick yours — each page has the local job notes, response time, and typical work we run in your neighborhood.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">PRIMARY COVERAGE</span><h2>10 TOWNS. <span class="red">ONE CREW.</span></h2><p>Same flat-rate pricing, same 6-year install warranty, same 30-day no-clog. Whether you're in downtown Salem or out past Mt. Angel.</p></header>
  <div class="svc-grid stagger">${cards}</div>
</div></section></main>
<section class="cta"><div class="wrap"><h2>OUTSIDE OUR<br/>PRIMARY ZONE?</h2><p>We still come. A small travel fee applies past our ten-town coverage — you'll see it on the estimate, no surprises.</p><div class="hero-cta"><a href="estimator.html" class="btn">RUN ESTIMATOR <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  const pic1 = client.photos[1];
  const pic2 = client.photos[4 % client.photos.length];
  const pic3 = client.photos[7 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/wolfpackplumbing/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plumber in ${area.name}, OR — Wolf Pack Plumbing</title>
<meta name="description" content="Licensed Wolf Pack plumber for ${area.name}, ${area.county}. 24/7 emergency dispatch, flat-rate quotes, 6-yr install warranty, 30-day no-clog guarantee." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}<main>
<section class="page-hero" data-bigword="${area.name.toUpperCase().slice(0,8)}"><div class="wrap">
  <span class="eye">${area.county.toUpperCase()} · ${area.zip}</span>
  <h1>WOLF PACK IN<br/><span class="red">${area.name.toUpperCase()}.</span></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap" style="display:grid; grid-template-columns:1.2fr 1fr; gap:3rem; align-items:center;">
  <div class="reveal">
    <span class="eye">LOCAL DISPATCH</span>
    <h2 style="font-family:var(--ff-display); font-size:clamp(2rem,4.5vw,3.2rem); line-height:0.95; letter-spacing:-0.02em; text-transform:uppercase; margin:0.8rem 0 1rem;">Your ${area.name}<br/><span style="color:var(--red);">plumber, 24/7.</span></h2>
    <p style="color:var(--ash); margin-bottom:1rem;">Dispatch from Salem averages 25–35 minutes to ${area.name}. Flat-rate quotes before work, 6-year warranty on every install, and a 30-day no-clog guarantee on drain work.</p>
    <p style="color:var(--ash); margin-bottom:1.5rem;">Whether it's a backed-up main on a Tuesday night or a scheduled water-heater swap, the same crew answers and shows up.</p>
    <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">RUN ESTIMATOR <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
  </div>
  <div class="hero-panel reveal">
    <span class="corner"></span><span class="corner tr"></span><span class="corner br"></span><span class="corner bl"></span>
    <img src="${pic1}" alt="Work in ${area.name}">
    <div class="readout"><div class="r">ZIP<strong>${area.zip}</strong></div><div class="r">RESPONSE<strong>~30 min</strong></div></div>
  </div>
</div></section>

<div class="stripe-bar" aria-hidden="true"></div>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">${area.name.toUpperCase()} JOB LIST</span><h2>COMMON JOBS<br/><span class="red">AROUND HERE.</span></h2></header>
  <div class="svc-grid stagger">
    <article class="svc"><span class="n">01 / DRAIN</span><h3>Drain Cleaning</h3><p>${area.name} mainline + fixture drain clearing, camera inspection included, 30-day no-clog guarantee.</p></article>
    <article class="svc"><span class="n">02 / HEATER</span><h3>Water Heater</h3><p>Tank, tankless, heat-pump installs for ${area.name} homes. Same-day diagnosis, 6-yr warranty.</p></article>
    <article class="svc"><span class="n">03 / EMERGENCY</span><h3>24/7 Emergency</h3><p>Burst lines, back-ups, failing shut-offs. ${area.name} dispatch runs 24/7 — we pick up when the other guys won't.</p></article>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">${area.name.toUpperCase()} FIELD LOG</span><h2>RECENT WORK<br/><span class="red">${area.name.toUpperCase()}.</span></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>// MAINLINE · ${area.name.toUpperCase()}</figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>// TANKLESS · ${area.name.toUpperCase()}</figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>// LEAK DIAG · ${area.name.toUpperCase()}</figcaption></figure>
  </div>
</div></section>
</main>
<section class="cta"><div class="wrap"><h2>${area.name.toUpperCase()} —<br/>YOUR PLUMBER.</h2><p>Wolf Pack runs every ${area.name} call under the same standards — flat-rate, permit-pulled, warranty-backed, no ghosting.</p><div class="hero-cta"><a href="${client.phoneHref}" class="btn">${client.phone} <span class="arrow">→</span></a><a href="estimator.html" class="btn">ESTIMATOR <span class="arrow">→</span></a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderValleyView({ client, area, isHub }) {
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">VV</span><span class="tm">Valley View HVAC<small>CCB #243211 · salem + surrounding</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Get Estimate</a><a href="gallery.html">Work</a><a href="areas.html"${navActive('areas')}>Service Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  </nav>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone}</a>
  <button class="mobile-toggle" aria-label="Menu">Menu</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Get Estimate</a><a href="gallery.html">Work</a><a href="areas.html">Service Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
</div>`;
  const footer = `<footer class="foot"><div class="wrap foot-grid">
  <div><div class="brand"><span class="mark">VV</span><span class="tm">Valley View HVAC</span></div><p style="color:rgba(255,255,255,0.7); max-width:30ch;">Dependable HVAC for Salem &amp; the mid-Willamette. CCB #243211.</p></div>
  <div><h5>Services</h5><ul><li><a href="services.html">AC Install</a></li><li><a href="services.html">Heat Pumps</a></li><li><a href="services.html">Ductless</a></li></ul></div>
  <div><h5>Service Area</h5><ul><li><a href="areas.html">All areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
  <div><h5>Contact</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li></ul></div>
</div><div class="wrap foot-bottom"><span>© <span id="year"></span> Valley View HVAC · CCB #243211</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div></footer>`;

  if (isHub) {
    const cards = client.areas.map((a) => `
      <a href="${a.slug}.html" class="svc">
        <div class="ico">📍</div>
        <h3>${a.name}</h3>
        <p>${a.note}</p>
        <span class="arrow-box">View ${a.name} →</span>
      </a>`).join('');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/valleyviewhvac/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — Valley View HVAC</title>
<meta name="description" content="Valley View HVAC serves Salem, Albany, Dallas, McMinnville, Molalla, Stayton, Independence, Woodburn, Keizer, and Monmouth across the mid-Willamette Valley." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>
<div class="discount-banner"><div class="wrap"><div class="msg"><strong>10% off</strong> for seniors, veterans, educators, and first responders.</div></div></div>
${nav}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>Service areas</span>
  <h1>Dependable HVAC across<br/><span class="blue">the mid-Willamette.</span></h1>
  <p>Ten communities under our regular coverage — each with its own climate challenges and home stock. Pick your town below for local service details and recent work.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Primary coverage</span><h2>Where <span class="blue">Valley View</span> shows up.</h2><p>Same CCB license, same 10-yr equipment warranty, same 10% community discount — whether you're in Salem or out by the coast range.</p></header>
  <div class="svc-grid stagger">${cards}</div>
</div></section>
<section class="cta"><div class="wrap">
  <h2>Outside our primary zone?<br/><span class="orange">We still come.</span></h2>
  <p>A small travel fee applies past our ten-community coverage — always itemized before work starts.</p>
  <div class="cta-actions"><a href="estimator.html" class="btn btn-orange">Get instant estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
</div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  const pic1 = client.photos[0];
  const pic2 = client.photos[3 % client.photos.length];
  const pic3 = client.photos[6 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/valleyviewhvac/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>HVAC in ${area.name}, OR — Valley View HVAC</title>
<meta name="description" content="Licensed HVAC contractor for ${area.name}, ${area.county}. Heat pumps, furnaces, AC, ductless. CCB #243211, 10-yr equipment warranty, community discounts." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>${area.county} · ${area.zip}</span>
  <h1>HVAC in<br/><span class="blue">${area.name}, OR.</span></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap" style="display:grid; grid-template-columns:1.15fr 1fr; gap:3rem; align-items:center;">
  <div class="reveal">
    <span class="pill"><span class="dot"></span>Licensed · Insured · CCB #243211</span>
    <h2 style="font-family:var(--ff-display); font-weight:700; font-size:clamp(2rem,4.5vw,3.4rem); letter-spacing:-0.02em; line-height:1.04; margin:1rem 0;">Your <span style="color:var(--blue);">${area.name}</span> HVAC partner.</h2>
    <p style="color:var(--ink-soft); font-size:1.1rem; margin-bottom:1rem;">Valley View designs HVAC systems specifically for ${area.name}'s climate demands. Cold-climate heat pumps, right-sized central air, ductless mini-splits — backed by a 10-year equipment and 2-year workmanship warranty.</p>
    <p style="color:var(--ink-soft); margin-bottom:1.5rem;">Every ${area.name} install begins with a Manual-J load calculation and a free in-home walk-through. We itemize equipment, labor, permits, and rebates — you see every number.</p>
    <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">Get estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
  </div>
  <div class="hero-card reveal" style="aspect-ratio:4/5;">
    <img src="${pic1}" alt="HVAC work in ${area.name}" />
    <div class="tile t1"><div class="k">${area.name}</div><div class="v">Local<br/><em>service area</em></div></div>
    <div class="tile t2"><div class="k">Warranty</div><div class="v">10-yr / <em>2-yr</em></div></div>
    <div class="tile t3"><div class="k">ZIP</div><div class="v"><em>${area.zip}</em></div></div>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Common ${area.name} services</span><h2>What we run <span class="blue">around here.</span></h2></header>
  <div class="feature-grid stagger">
    <div class="feature"><div class="ico">❄️</div><h3>Heat pump installs</h3><p>Cold-climate heat pumps sized for ${area.name} winters. Federal tax credits + Energy Trust rebates filed on your behalf.</p><ul><li>14–21 SEER2 options</li><li>Rebate paperwork handled</li></ul></div>
    <div class="feature"><div class="ico">🔥</div><h3>Furnace repair + swap</h3><p>Gas and electric furnace installs and service. Code-compliant venting, proper combustion analysis, and clean commissioning.</p><ul><li>80%–98% AFUE</li><li>Same-day diagnostics</li></ul></div>
    <div class="feature"><div class="ico">🔁</div><h3>Ductless mini-splits</h3><p>${area.name} historic homes and additions benefit from ductless — single zone to whole-home multi-zone.</p><ul><li>Mitsubishi, Daikin, Carrier</li><li>Clean line-hide runs</li></ul></div>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Recent ${area.name} work</span><h2>Around the <span class="orange">neighborhood.</span></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>Heat pump install · ${area.name}</figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>Furnace swap · ${area.name}</figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>Ductless retrofit · ${area.name}</figcaption></figure>
  </div>
</div></section>

<section class="cta"><div class="wrap">
  <h2>Your ${area.name} home,<br/><span class="orange">properly conditioned.</span></h2>
  <p>Free in-home walk-through. Manual-J load calc, itemized rebate review, 10-yr equipment and 2-yr workmanship warranty on every install.</p>
  <div class="cta-actions"><a href="estimator.html" class="btn btn-orange">Get instant estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone} <span class="arrow">→</span></a></div>
</div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderBjork({ client, area, isHub }) {
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`;
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">B</span><span><span class="tm">Bjork &amp; Sons</span><small>plumbing · eugene, or</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Work</a><a href="areas.html"${navActive('areas')}>Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  </nav>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone}</a>
  <button class="mobile-toggle" aria-label="Menu">≡ Menu</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Work</a><a href="areas.html">Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
</div>`;
  const footer = `<footer class="foot"><div class="wrap foot-grid">
  <div><div class="brand"><span class="mark">B</span><span class="tm">Bjork &amp; Sons</span></div><p class="foot-desc">Quiet plumbing craftsmanship for Eugene since 1985.</p></div>
  <div><h5>Services</h5><ul><li><a href="services.html">Water heaters</a></li><li><a href="services.html">Leak repair</a></li><li><a href="services.html">Bath &amp; kitchen</a></li></ul></div>
  <div><h5>Service area</h5><ul><li><a href="areas.html">All areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
  <div><h5>Contact</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li></ul></div>
</div><div class="wrap foot-bottom"><span>© <span id="year"></span> Bjork &amp; Sons Plumbing</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div></footer>`;

  if (isHub) {
    const items = client.areas.map((a, i) => `
      <a href="${a.slug}.html" class="svc-item">
        <span class="num">${String(i+1).padStart(2,'0')} · ${a.county}</span>
        <h3>${a.name}, <em>OR.</em></h3>
        <p>${a.note}</p>
      </a>`).join('');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/bjorkandsons/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — Bjork &amp; Sons Plumbing</title>
<meta name="description" content="Bjork &amp; Sons Plumbing serves Eugene, Springfield, Creswell, Cottage Grove, Junction City, Veneta, Pleasant Hill, Harrisburg, Coburg, and Oakridge." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">Service areas</span>
  <h1>Ten <em>towns.</em><br/>One quiet trade.</h1>
  <p>Bjork &amp; Sons has been quietly running plumbing across the South Willamette since 1985. Here are the towns we serve — pick yours for local notes and recent work.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Primary coverage</span><h2>Where we <em>show up.</em></h2><p>Same father-and-son crew. Same flat-rate pricing. Same 5-year workmanship guarantee on every install.</p></header>
  <div class="svc-list stagger">${items}</div>
</div></section>
<section class="cta"><div class="wrap"><div><h2>Outside our zone?<br/><em>We'll consider it.</em></h2><p>Email or call. If the project is a good fit, we'll travel — out-of-area fees apply, always disclosed up-front.</p></div><div class="cta-side"><a href="estimator.html" class="btn btn-copper">Request an estimate</a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  const pic1 = client.photos[2];
  const pic2 = client.photos[5 % client.photos.length];
  const pic3 = client.photos[8 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/bjorkandsons/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plumber in ${area.name}, OR — Bjork &amp; Sons Plumbing</title>
<meta name="description" content="Quiet, careful plumbing for ${area.name}, ${area.county}. Water heaters, leak repair, remodels, service lines. 40 years, 5-yr workmanship warranty." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">${area.county} · ${area.zip}</span>
  <h1>Plumber in <em>${area.name}, OR.</em></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap" style="display:grid; grid-template-columns:1.15fr 1fr; gap:4rem; align-items:center;">
  <div class="reveal">
    <h2 class="display" style="font-size:clamp(2rem,4.5vw,3.4rem); margin-bottom:1.2rem;">A quiet <em>partnership</em><br/>for ${area.name}.</h2>
    <p style="color:var(--ink-soft); font-size:1.15rem; line-height:1.6; margin-bottom:1rem;">Kevin Bjork has been running plumbing in ${area.name} since Reagan was in office. The work has stayed quiet, careful, and consistent for four decades.</p>
    <p style="color:var(--ink-soft); font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">Every ${area.name} job starts with a walk-through — no phone estimates, no surprises. Flat-rate after we see the house, 5-year workmanship guarantee after we finish.</p>
    <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">Request an estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
  </div>
  <div class="hero-img reveal" style="aspect-ratio:3/4;">
    <img src="${pic1}" alt="Work in ${area.name}">
    <div class="caption"><div><div>Service area</div><span>${area.name}, OR</span></div><div style="text-align:right;"><div>Since</div><span>1985</span></div></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">What we do here</span><h2>Common ${area.name} <em>work.</em></h2></header>
  <div class="feature-grid stagger">
    <div class="feature"><span class="n">01 · Heaters</span><h3>Water <em>heater service.</em></h3><p>${area.name} homes range in vintage — we handle everything from 40-gal tank swaps to tankless and heat-pump retrofits.</p><ul><li>Tank, tankless, heat-pump</li><li>10-yr mfr + 5-yr workmanship</li></ul></div>
    <div class="feature"><span class="n">02 · Repairs</span><h3>Leak + <em>fixture repair.</em></h3><p>Acoustic leak detection, careful drywall-respectful repair, proper fixture installs in ${area.name} kitchens and baths.</p><ul><li>Minimal-damage repair</li><li>Slab leak locate</li></ul></div>
    <div class="feature"><span class="n">03 · Remodels</span><h3>Kitchen + <em>bath remodel.</em></h3><p>Permitted rough-in and finish plumbing, coordinated with your GC. Tub-to-shower, vanity relocates, pot fillers.</p><ul><li>Coordinated with GC</li><li>Permitted + inspected</li></ul></div>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Recent ${area.name} work</span><h2>Field notes from<br/><em>the last season.</em></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>Water heater swap<small>${area.name.toLowerCase()}</small></figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>Bath remodel<small>${area.name.toLowerCase()}</small></figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>Leak repair<small>${area.name.toLowerCase()}</small></figcaption></figure>
  </div>
</div></section>

<section class="cta"><div class="wrap"><div><h2>Hire a ${area.name} plumber<br/>you can <em>trust.</em></h2><p>Kevin and his sons run ${area.name} like they run Eugene — careful, quiet, and thorough. Flat-rate after walk-through, 5-yr workmanship warranty.</p></div><div class="cta-side"><a href="estimator.html" class="btn btn-copper">Request an estimate</a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderJJ({ client, area, isHub }) {
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">⚡</span><span class="tm">JJ <em>&amp;</em> S Electric<small>yakima · 509</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Projects</a><a href="areas.html"${navActive('areas')}>Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  </nav>
  <span class="nav-status">24/7 · ONLINE</span>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone}</a>
  <button class="mobile-toggle" aria-label="Menu">MENU</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Projects</a><a href="areas.html">Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
</div>`;
  const footer = `<footer class="foot"><div class="wrap foot-grid">
  <div><div class="brand"><span class="mark">⚡</span><span class="tm">JJ <em>&amp;</em> S ELECTRIC</span></div><p style="max-width:30ch;">Licensed electricians, Yakima County.</p></div>
  <div><h5>// SERVICES</h5><ul><li><a href="services.html">Panel Upgrade</a></li><li><a href="services.html">EV Charger</a></li><li><a href="services.html">Troubleshoot</a></li></ul></div>
  <div><h5>// SERVICE AREA</h5><ul><li><a href="areas.html">All areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
  <div><h5>// CONTACT</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li></ul></div>
</div><div class="wrap foot-bottom"><span>© <span id="year"></span> JJ &amp; S ELECTRIC LLC</span><span>BUILT BY <a href="https://blackboxadvancements.com">BLACKBOX ADVANCEMENTS</a></span></div></footer>`;

  if (isHub) {
    const cards = client.areas.map((a, i) => `
      <a href="${a.slug}.html" class="svc">
        <span class="code">AREA.${String(i+1).padStart(2,'0')} / ${a.county.toUpperCase()}</span>
        <h3>${a.name.toUpperCase()}</h3>
        <p>${a.note}</p>
        <span class="more">ENTER ${a.name.toUpperCase()} →</span>
      </a>`).join('');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/jjelectric/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — JJ &amp; S Electric</title>
<meta name="description" content="JJ &amp; S Electric serves Yakima, Selah, Moxee, Union Gap, Terrace Heights, Wapato, Toppenish, Zillah, Sunnyside, and Ellensburg." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}<main>
<section class="page-hero" data-bigword="AREAS"><div class="wrap">
  <span class="eye">SERVICE COVERAGE</span><h1>TEN TOWNS.<br/><span class="y">ONE CREW.</span></h1>
  <p>JJ &amp; S Electric covers Yakima County and into Kittitas. Below are the ten towns under our direct 24/7 dispatch — pick yours for local notes and job history.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">PRIMARY DISPATCH</span><h2>CIRCUIT COVERAGE —<br/><span class="y">SAME STANDARD.</span></h2><p>WA L&amp;I licensed, bonded, insured. Every job permit-ready and inspection-compliant. Same 24/7 dispatch whether you're in downtown Yakima or out past Ellensburg.</p></header>
  <div class="svc-grid stagger">${cards}</div>
</div></section></main>
<section class="cta"><div class="wrap"><h2>OUTSIDE OUR<br/>PRIMARY COVERAGE?</h2><p>We still run calls past our ten-town zone. Out-of-area travel applies — always on the estimate before work starts.</p><div class="cta-actions"><a href="estimator.html" class="btn">RUN ESTIMATOR <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone} <span class="arrow">→</span></a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  const pic1 = client.photos[0];
  const pic2 = client.photos[3 % client.photos.length];
  const pic3 = client.photos[6 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/jjelectric/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Electrician in ${area.name}, WA — JJ &amp; S Electric</title>
<meta name="description" content="Licensed electrician for ${area.name}, ${area.county}. Panel upgrades, EV chargers, rewires, troubleshooting, 24/7 emergency. WA L&amp;I licensed, bonded, insured." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}<main>
<section class="page-hero" data-bigword="${area.name.toUpperCase().slice(0,8)}"><div class="wrap">
  <span class="eye">${area.county.toUpperCase()} · ${area.zip} · 24/7</span>
  <h1>ELECTRICIAN IN<br/><span class="y">${area.name.toUpperCase()}.</span></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap hero-inner">
  <div class="reveal">
    <span class="eye">LICENSED · BONDED · 24/7</span>
    <h2 style="font-family:var(--ff-display); font-size:clamp(2rem,4.5vw,3.5rem); line-height:1; text-transform:uppercase; letter-spacing:-0.02em; margin:1rem 0 1rem;">YOUR ${area.name.toUpperCase()}<br/><span class="y">ELECTRICIAN.</span></h2>
    <p style="color:var(--fog); margin-bottom:1rem;">JJ &amp; S runs every ${area.name} call to WA L&amp;I code — flat-rate quotes, permits pulled where required, inspector sign-offs handled. Panel upgrades, EV charger installs, rewires, lighting, and 24/7 emergency dispatch.</p>
    <p style="color:var(--fog); margin-bottom:2rem;">Call lands on a real person. Dispatch averages ~40 minutes to ${area.name} from Yakima base.</p>
    <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">RUN ESTIMATOR <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
  </div>
  <div class="hero-panel reveal">
    <div class="stripe"></div>
    <img src="${pic1}" alt="${area.name} electrical work">
    <div class="readouts"><div class="r">LOCATION<strong>${area.zip}</strong></div><div class="r">STATUS<strong>ONLINE</strong></div></div>
  </div>
</div></section>

<div class="stripe-bar" aria-hidden="true"></div>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">${area.name.toUpperCase()} / CORE SERVICES</span><h2>WHAT WE RUN<br/><span class="y">AROUND HERE.</span></h2></header>
  <div class="svc-grid stagger">
    <article class="svc"><span class="code">CKT.01 / PANEL</span><h3>Panel Upgrade</h3><p>${area.name} service panel swaps — 100A / 200A / 400A. Inspection-ready labeling, whole-home surge, proper grounding.</p></article>
    <article class="svc"><span class="code">CKT.02 / EV</span><h3>EV Charger Install</h3><p>Level 2 240V installs on a dedicated circuit. Permit pulled, rebate paperwork handled where applicable.</p></article>
    <article class="svc"><span class="code">CKT.03 / TRACE</span><h3>Troubleshoot</h3><p>Flickering lights, tripping breakers, burning smells — we trace to root cause, not just symptoms.</p></article>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eye">${area.name.toUpperCase()} / FIELD LOG</span><h2>RECENT<br/><span class="y">WORK.</span></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>// PANEL.UPG · ${area.name.toUpperCase()}</figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>// EV.CHARGER · ${area.name.toUpperCase()}</figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>// REWIRE · ${area.name.toUpperCase()}</figcaption></figure>
  </div>
</div></section>
</main>
<section class="cta"><div class="wrap"><h2>${area.name.toUpperCase()} —<br/>WE PICK UP.</h2><p>No matter what your circuit is doing, JJ &amp; S dispatches 24/7. Licensed, bonded, and the same standards on every job.</p><div class="cta-actions"><a href="${client.phoneHref}" class="btn">CALL ${client.phone} <span class="arrow">→</span></a><a href="estimator.html" class="btn">RUN ESTIMATOR <span class="arrow">→</span></a></div></div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderWalla({ client, area, isHub }) {
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
  const navActive = (p) => (p === (isHub ? 'areas' : 'city') ? ' class="active"' : '');
  const nav = `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">W</span><span><span class="tm">Walla Walla Air</span><small>est. walla walla valley</small></span></a>
  <nav class="nav-links">
    <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Portfolio</a><a href="areas.html"${navActive('areas')}>Service Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
  </nav>
  <a href="${client.phoneHref}" class="nav-cta">${client.phone}</a>
  <button class="mobile-toggle" aria-label="Menu">Menu</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimate</a><a href="gallery.html">Portfolio</a><a href="areas.html">Service Areas</a><a href="about.html">About</a><a href="contact.html">Contact</a>
</div>`;
  const footer = `<footer class="foot"><div class="wrap foot-grid">
  <div><div class="brand"><span class="mark">W</span><span class="tm">Walla Walla Air</span></div><p class="foot-desc">Owner-led HVAC practice for the Walla Walla Valley.</p></div>
  <div><h5>Services</h5><ul><li><a href="services.html">Ductless</a></li><li><a href="services.html">HVAC install</a></li><li><a href="services.html">Fireplaces</a></li></ul></div>
  <div><h5>Service area</h5><ul><li><a href="areas.html">All areas</a></li>${client.areas.slice(0,5).map(a=>`<li><a href="${a.slug}.html">${a.name}</a></li>`).join('')}</ul></div>
  <div><h5>Contact</h5><ul><li><a href="${client.phoneHref}">${client.phone}</a></li><li><a href="mailto:${client.email}">${client.email}</a></li></ul></div>
</div><div class="wrap foot-bottom"><span>© <span id="year"></span> Walla Walla Air</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div></footer>`;

  if (isHub) {
    const cards = client.areas.map((a, i) => `
      <a href="${a.slug}.html" class="svc">
        <span class="num">${String(i+1).padStart(2,'0')} · ${a.county}</span>
        <h3>${a.name}, <em>WA.</em></h3>
        <p>${a.note}</p>
      </a>`).join('');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/wallawallaair/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Areas — Walla Walla Air</title>
<meta name="description" content="Walla Walla Air serves Walla Walla, College Place, Milton-Freewater, Touchet, Dayton, Waitsburg, Prescott, Lowden, Burbank, and Pendleton across the Valley." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">Service areas</span>
  <h1>The Valley,<br/><em>in ten communities.</em></h1>
  <p>Walla Walla Air is a small practice by design — and every community we serve gets the same owner-led attention. Ten towns under our regular coverage; pick yours for local notes.</p>
</div></section>
<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Primary service area</span><h2>Communities <em>we serve.</em></h2><p>Each visit is led by Dan personally — assessment, design, commissioning. Same standards across the Valley.</p></header>
  <div class="svc-layout stagger">${cards}</div>
</div></section>
<section class="cta"><div class="wrap">
  <div><h2>Just outside?<br/><em>Get in touch.</em></h2><p>If you're near the Valley and we're a good fit for the project, we'll quote it. Out-of-area travel is always itemized.</p></div>
  <div class="cta-side"><a href="estimator.html" class="btn btn-terra">Request an estimate</a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
</div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
  }

  const pic1 = client.photos[0];
  const pic2 = client.photos[3 % client.photos.length];
  const pic3 = client.photos[6 % client.photos.length];

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><base href="/wallawallaair/" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>HVAC in ${area.name} — Walla Walla Air</title>
<meta name="description" content="HVAC service and install in ${area.name}, ${area.county}. Owner-led practice. Ductless, heat pumps, furnaces, fireplaces, gas lines. Precision, punctuality, excellence." />
${fonts}<link rel="stylesheet" href="styles.css" /></head><body>${nav}
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">${area.county} · ${area.zip}</span>
  <h1>HVAC in <em>${area.name}.</em></h1>
  <p>${area.note}</p>
</div></section>

<section class="section"><div class="wrap" style="display:grid; grid-template-columns:1.1fr 1fr; gap:4rem; align-items:center;">
  <div class="reveal">
    <span class="eyebrow">Owner-led in ${area.name}</span>
    <h2 style="font-family:var(--ff-display); font-size:clamp(2rem,4.5vw,3.4rem); letter-spacing:-0.02em; line-height:1.04; margin:1rem 0;">Careful work,<br/><em>${area.name} homes.</em></h2>
    <p style="color:var(--ink-soft); font-size:1.15rem; line-height:1.6; margin-bottom:1rem;">Dan leads every ${area.name} assessment personally — load calculation, equipment check, duct review — before any proposal is sent. Installs are commissioned to manufacturer spec and backed by a 10-year equipment warranty.</p>
    <p style="color:var(--ink-soft); margin-bottom:1.5rem;">Ductless mini-splits for historic ${area.name} homes, right-sized heat pumps for primary residences, fireplace installs, and natural gas line work — all under one accountable craftsman.</p>
    <div class="hero-cta"><a href="estimator.html" class="btn btn-wine">Request an estimate <span class="arrow">→</span></a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
  </div>
  <div class="hero-img reveal">
    <div class="tag">${area.name.toUpperCase()}</div>
    <img src="${pic1}" alt="HVAC install in ${area.name}">
    <div class="caption">${area.note.split('.')[0]}.<small>${area.county}</small></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Common ${area.name} projects</span><h2>What we <em>typically do here.</em></h2></header>
  <div class="feature-grid stagger">
    <div class="feature"><span class="n">I · Ductless</span><h3>Ductless <em>mini-splits.</em></h3><p>${area.name} historic homes and additions benefit from Mitsubishi/Daikin zoned systems — quiet, efficient, visually discreet.</p><ul><li>Single- to multi-zone</li><li>Wall, ceiling cassette, floor</li></ul></div>
    <div class="feature"><span class="n">II · HVAC</span><h3>System <em>retrofits.</em></h3><p>Full heat pump + air handler upgrades. Manual-J load calc, proper duct static, clean mechanical-room layouts.</p><ul><li>Variable-speed options</li><li>Rebate paperwork handled</li></ul></div>
    <div class="feature"><span class="n">III · Fireplace</span><h3>Hearth &amp; <em>gas.</em></h3><p>Gas fireplace installs, conversions, annual servicing. We handle the gas plumbing and the venting as one scope.</p><ul><li>Direct-vent gas</li><li>Outdoor fire appliances</li></ul></div>
  </div>
</div></section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Recent ${area.name} work</span><h2>From the <em>portfolio.</em></h2></header>
  <div class="gallery reveal">
    <figure><img src="${pic1}" alt=""><figcaption>Ductless retrofit<small>${area.name}</small></figcaption></figure>
    <figure><img src="${pic2}" alt=""><figcaption>Heat pump install<small>${area.name}</small></figcaption></figure>
    <figure><img src="${pic3}" alt=""><figcaption>Fireplace install<small>${area.name}</small></figcaption></figure>
  </div>
</div></section>

<section class="cta"><div class="wrap">
  <div><h2>${area.name} home?<br/><em>Speak with Dan.</em></h2><p>Complimentary in-home consultation. Dan walks the home, spec's the project, and sends an itemized proposal — rebates and tax credits included.</p></div>
  <div class="cta-side"><a href="estimator.html" class="btn btn-terra">Request an estimate</a><a href="${client.phoneHref}" class="btn">${client.phone}</a></div>
</div></section>
${footer}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

/* ---- Main ------------------------------------------------ */

const BASE = __dirname;

Object.values(CLIENTS).forEach((client) => {
  const dir = path.join(BASE, client.slug);
  if (!fs.existsSync(dir)) {
    console.error(`missing dir: ${dir}`);
    return;
  }
  /* hub */
  fs.writeFileSync(path.join(dir, 'areas.html'), client.renderer({ client, isHub: true }));
  console.log(`wrote ${client.slug}/areas.html`);
  /* city pages */
  client.areas.forEach((area) => {
    fs.writeFileSync(path.join(dir, `${area.slug}.html`), client.renderer({ client, area, isHub: false }));
    console.log(`wrote ${client.slug}/${area.slug}.html`);
  });
});

console.log('\nDone.');
