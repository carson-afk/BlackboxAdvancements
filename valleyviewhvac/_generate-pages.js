#!/usr/bin/env node
/**
 * Generate service pages, GEO landing pages, blog, FAQ, reviews, sitemap
 * for Valley View HVAC to match valleyviewhvac.com's page structure.
 * Run: node _generate-pages.js  (from the valleyviewhvac/ folder)
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

const BRAND = {
  name: 'Valley View HVAC',
  slug: 'valleyviewhvac',
  phone: '(971) 712-6763',
  phoneHref: '+19717126763',
  email: 'vvhvac.nw@gmail.com',
  city: 'Salem',
  state: 'OR',
  street: 'Salem, OR',
  ccb: '243211',
  founded: 2019,
  lat: 44.9429,
  lng: -123.0351,
  site: 'https://blackboxadvancements.com/valleyviewhvac',
};

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

/* ----- Services ----- */
const SERVICES = [
  { slug: 'ac-installations', group: 'residential', h1: 'AC Installation',
    pitch: "High-efficiency central air sized right for your Salem-area home — no oversizing, no short-cycling, and every install backed by a 10-year equipment warranty.",
    benefits: [
      'Manual-J load calculation before quote',
      '14–21 SEER2 options (Trane, Carrier, Lennox, Goodman, Mitsubishi)',
      'Permit pulled, inspected, signed off',
      'Old unit haul-away included',
      '10-yr equipment / 2-yr workmanship warranty',
      'Federal + Energy Trust of Oregon rebates handled',
    ],
    bullets: [
      { t: 'Right-sized, not oversized', b: 'We run a real ACCA Manual-J load calc. An oversized AC short-cycles, dehumidifies poorly, and dies early. A right-sized system runs longer cycles, costs less to run, and lasts 2–3× longer.' },
      { t: 'Brand-agnostic install', b: "We'll install any major brand — we recommend based on your home, climate, and budget, not on which vendor pays the best spiff." },
      { t: 'Rebate paperwork handled', b: 'Federal IRA tax credits, Energy Trust of Oregon rebates, PGE/Pacific Power utility incentives — we file them, you keep the money.' },
    ],
    faq: [
      { q: 'How long does an AC install take?', a: 'Most single-family residential AC installs are a one-day job. Older homes needing duct modifications or electrical upgrades can extend to two days.' },
      { q: 'What size AC do I need?', a: 'Depends on your home size, insulation, window area, and duct condition — not just square feet. Our Manual-J load calc takes 15 minutes on-site and prevents costly oversizing.' },
      { q: 'What rebates am I eligible for?', a: 'Most Salem-area homeowners qualify for $300–$2,000 in Energy Trust of Oregon rebates plus a federal 30% tax credit on heat-pump AC systems. We file the paperwork at no charge.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/RSshutterstock_207837970-1920w.jpg',
  },
  { slug: 'ac-maintenance', group: 'residential', h1: 'AC Maintenance',
    pitch: 'Spring AC tune-ups that actually matter — coil clean, refrigerant verify, electrical check, and a written condition report. Keeps your system efficient and catches problems before they turn into breakdowns.',
    benefits: [
      'Coil clean (indoor + outdoor)',
      'Refrigerant charge verification',
      'Capacitor, contactor, relay check',
      'Condensate drain clean',
      'Thermostat calibration',
      'Written condition report after every visit',
    ],
    bullets: [
      { t: 'Why annual tune-ups pay for themselves', b: "A dirty evaporator coil drops efficiency 20–40%. A slightly undercharged system shortens compressor life by half. Annual maintenance typically saves $15–30/month and extends equipment life 5+ years." },
      { t: "What we actually do (not just checklist theater)", b: 'Every tune-up includes a real combustion-check on the furnace stage, amp-draw test on the compressor, static pressure measurement, and temperature drop across the coil. We document numbers — not tick boxes.' },
      { t: 'Membership plans available', b: "Two-visit annual plans include spring AC and fall furnace service, priority dispatch when you need a repair, and discounts on parts. Details on our customer savings plans page." },
    ],
    faq: [
      { q: 'How often should I service my AC?', a: 'Once a year is the industry standard. Salem-area homes with heavy pollen or wildfire smoke exposure benefit from twice-yearly service.' },
      { q: 'Will tune-ups really save money?', a: 'Yes. A properly maintained AC uses 15–40% less energy than a neglected one and lasts 5+ years longer. The tune-up cost pays back within the first summer.' },
      { q: 'What if you find a problem?', a: "We'll tell you what it is, what it costs to fix, and whether it's urgent or can wait. No pressure, no upsells — just the information you need to decide." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/RSshutterstock_132189722-1920w.jpg',
  },
  { slug: 'ac-repair', group: 'residential', h1: 'AC Repair',
    pitch: 'Same-day AC diagnostics for Salem, Albany, Dallas, McMinnville, and the mid-Willamette Valley. Flat-rate quote before work — no diagnostic fee if we do the repair.',
    benefits: [
      'Same-day service calls in-season',
      'Flat-rate pricing before work begins',
      'No diagnostic fee with approved repair',
      'Refrigerant recovery + recharge',
      'Blower motor, capacitor, contactor replacement',
      'Control board + thermostat replacement',
    ],
    bullets: [
      { t: 'Common AC repair calls we handle daily', b: "AC not cooling, frozen evaporator coil, compressor won't start, tripping breaker, strange noises, water leaking from indoor unit, refrigerant leak, failed capacitor, contactor burn, blower motor failure." },
      { t: 'When to repair vs. replace', b: "If your AC is 10+ years old, uses R-22 refrigerant, has a failed compressor, or the repair costs 30%+ of a new unit — replacement usually pays back within 3 years via efficiency savings. We'll walk you through the math." },
      { t: 'Emergency service', b: 'Valley View keeps late-summer on-call coverage for members and existing customers. Call the main line — if you reach voicemail, leave a message and we call back within 30 minutes during peak season.' },
    ],
    faq: [
      { q: 'How much does an AC repair cost?', a: 'Typical residential AC repairs range from $180 (capacitor replacement) to $1,200 (compressor hard-start, evap coil clean + recharge). Our estimator gives a more specific range once you pick the symptom.' },
      { q: 'Do you charge for diagnostics?', a: "Yes — $149 flat diagnostic fee, but it's applied in full toward your repair cost if you approve the work. You only pay the diagnostic if you decline to repair." },
      { q: 'How fast can you come out?', a: 'Same-day most in-season calls (May through September). During cold snaps we prioritize heating emergencies and AC calls may push to next-day.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-residential-hvac-services-1920w.jpg',
  },
  { slug: 'air-duct-services', group: 'residential', h1: 'Air Duct Services',
    pitch: 'Duct cleaning, sealing, and repair for mid-Willamette homes. We restore airflow, improve indoor air quality, and cut the energy waste that leaky ducts cause.',
    benefits: [
      'Whole-home duct cleaning',
      'Aeroseal duct sealing',
      'Static pressure measurement',
      'Duct leak testing',
      'Repair and rebuild of damaged runs',
      'Vent & register cleaning',
    ],
    bullets: [
      { t: 'Why duct leakage matters', b: 'Industry studies show the average home loses 20–30% of conditioned air through duct leaks. For a Salem home with a $250/month summer electric bill, that can mean $50–75 of pure waste every month.' },
      { t: 'When to clean ducts', b: "After a renovation, if you notice visible dust buildup at registers, after water damage, or if someone in the home has severe allergies. We don't recommend duct cleaning on a set schedule — only when there's a reason." },
      { t: 'Aeroseal — seal leaks without tearing apart walls', b: 'Aeroseal pressurizes your duct system and injects a polymer aerosol that seals leaks from the inside. Installed in 4–8 hours, certified result, no drywall demolition required.' },
    ],
    faq: [
      { q: 'Do I really need my ducts cleaned?', a: 'Not on a schedule — only when you have a specific issue (renovation dust, mold, severe allergies, visible buildup). Most HVAC contractors over-recommend cleaning; we only sell it when it actually helps.' },
      { q: 'Does duct cleaning help allergies?', a: 'Sometimes. If dust, pet dander, or mold spores are living in your ducts, yes. If the allergen is pollen from outside, duct cleaning does less than a MERV 13+ filter.' },
      { q: 'How much does duct sealing cost?', a: 'Aeroseal for a typical 2,000 sqft home runs $1,500–$2,800 and pays back in 3–5 years through lower energy bills. Spot-sealing specific leaks runs $300–$900.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-content-home-01-1920w.jpg',
  },
  { slug: 'furnace-installations', group: 'residential', h1: 'Furnace Installation',
    pitch: 'Gas, electric, and heat-pump furnace installs for Salem, Keizer, Albany, and the mid-Willamette Valley. Code-compliant venting, proper combustion analysis, and a 10-year equipment warranty on every install.',
    benefits: [
      '80–98% AFUE efficiency range',
      'Natural gas, propane, electric, heat-pump',
      'Proper venting + combustion analysis',
      'Right-sized (Manual-J) for your home',
      'Permit + inspection handled',
      '10-yr equipment / 2-yr workmanship warranty',
    ],
    bullets: [
      { t: 'Gas furnace vs. heat pump — what we recommend in Salem', b: 'Salem winters are mild enough that modern cold-climate heat pumps deliver heat down to 5°F at good efficiency. For most homes we recommend a heat pump paired with a small electric or gas backup rather than a traditional gas furnace — lower lifetime cost and rebate-eligible.' },
      { t: 'Combustion analysis matters', b: 'A furnace that looks fine can produce high CO at the register — we test every install with a calibrated analyzer and document the numbers. This is the single biggest safety + efficiency check most contractors skip.' },
      { t: 'Financing and rebates', b: "Energy Trust of Oregon rebates, federal tax credits, and our Enhancify financing partner mean most furnace upgrades can start with $0 down and a fixed monthly payment." },
    ],
    faq: [
      { q: 'How long does a furnace last?', a: 'A well-maintained gas furnace lasts 15–20 years. Heat pumps last 12–15 years. An electric furnace can push 20–25 years. When yours hits 12+ years and needs a significant repair, replacement usually makes economic sense.' },
      { q: 'Should I replace AC and furnace together?', a: "If either is 10+ years old and you're replacing one, replacing both together saves 15–25% on the combined install (one service trip, shared labor) and ensures matched efficiency between the systems." },
      { q: 'What size furnace do I need?', a: "Manual-J load calc is the only right way to size. We measure your home's heat loss, not just square feet. Oversized furnaces short-cycle, over-dry your air, and cost more to run." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/RSshutterstock_223543426-1920w.jpg',
  },
  { slug: 'furnace-maintenance', group: 'residential', h1: 'Furnace Maintenance',
    pitch: 'Fall furnace tune-ups that actually look at your system. Combustion analysis, safety checks, cleaning — not a 15-minute visual scan and a sticker.',
    benefits: [
      'Combustion analysis with calibrated analyzer',
      'Heat exchanger inspection + CO check',
      'Ignition, flame sensor, limit switch verification',
      'Blower motor amp draw + static pressure',
      'Burner clean, filter swap',
      'Written condition report',
    ],
    bullets: [
      { t: 'Why safety matters more than convenience', b: "A cracked heat exchanger can leak carbon monoxide into your home — slowly, invisibly, and lethally. Combustion analysis detects this before your CO alarm does. We've flagged cracked exchangers on three Salem homes this year alone." },
      { t: "What's actually included", b: 'Full 27-point inspection including electrical, mechanical, and combustion checks. We document every measurement so you can compare year-over-year and catch trends before they become failures.' },
      { t: 'Member priority', b: 'Maintenance plan members get priority dispatch during winter cold snaps — when every HVAC company in the Willamette Valley is backed up 3–5 days, members skip the line.' },
    ],
    faq: [
      { q: 'When should I schedule fall maintenance?', a: 'September through early November is ideal. Schedule before the first cold snap — once temperatures drop below freezing, every HVAC company in the Valley gets slammed and routine tune-ups push to December.' },
      { q: 'What does a tune-up cost?', a: '$149 for a full 27-point inspection, or $249 for the combined spring AC + fall furnace annual plan with priority dispatch and 10% repair discounts.' },
      { q: 'Do gas furnaces really need combustion analysis?', a: "Yes. It's the only way to catch a cracked heat exchanger, improper gas pressure, or partial blockage in the flue — all of which can produce dangerous CO levels. Any HVAC company that skips this is doing you a disservice." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/RSshutterstock_132189722-1920w.jpg',
  },
  { slug: 'furnace-repair', group: 'residential', h1: 'Furnace Repair',
    pitch: 'Same-day furnace repair across Salem and the mid-Willamette Valley. No heat in December? We get you running before dinner.',
    benefits: [
      'Same-day winter emergency response',
      'Flat-rate pricing before work begins',
      'Ignitor, flame sensor, gas valve replacement',
      'Blower motor, inducer, control board',
      'Heat exchanger inspection',
      'All major brands serviced',
    ],
    bullets: [
      { t: 'Common winter furnace failures', b: "No ignition (dirty flame sensor, cracked ignitor), short-cycling (overheating limit, dirty filter), blower won't stop (stuck relay, bad control board), cold air blowing (ignition lockout, gas supply issue). 80% of winter service calls are one of these five." },
      { t: 'What we fix vs. recommend replacing', b: "Small repairs on a younger furnace (under 10 years): fix it. Major repairs on an older system (heat exchanger crack, compressor failure, control board on a 15-year-old unit): replacement usually saves money within 2–3 years." },
      { t: 'Safety first', b: "If there's any suspicion of a cracked heat exchanger or CO leak, we red-tag the system and shut down the gas supply until it's repaired or replaced. We don't operate with CO risk — full stop." },
    ],
    faq: [
      { q: 'My furnace is making a loud bang when it starts. What is it?', a: 'Usually delayed ignition — gas builds up for a second before the ignitor fires. Common causes: dirty burners, misaligned flame sensor, low gas pressure. We diagnose it on-site in 15 minutes.' },
      { q: 'How much does a furnace repair cost?', a: 'Common repairs run $200 (flame sensor) to $1,400 (control board + blower motor). The estimator on our site gives a range once you describe the symptom.' },
      { q: 'Should I just buy a new furnace?', a: "Depends on age and repair cost. Under 10 years old + small repair: fix it. Over 15 years + major repair: replace. 10–15 + moderate repair: we'll walk you through the math." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-residential-hvac-services-1920w.jpg',
  },
  { slug: 'heat-pumps-and-ductless-solutions', group: 'residential', h1: 'Heat Pumps & Ductless Solutions',
    pitch: 'Cold-climate heat pumps and ductless mini-splits for Salem-area homes. 30–50% lower heating bills than gas, with Federal tax credits and Energy Trust rebates that often cover 30–40% of the install.',
    benefits: [
      'Cold-climate heat pumps (Mitsubishi, Daikin, Fujitsu, Carrier)',
      'Single-zone to 8-zone ductless',
      'Wall, ceiling cassette, floor-mount units',
      'Federal 30% tax credit + Energy Trust rebates',
      'Variable-speed inverter technology',
      'Whole-home retrofit or single-room',
    ],
    bullets: [
      { t: 'Why heat pumps make sense in Salem', b: 'Salem winters rarely drop below 20°F — well within the efficient range of modern cold-climate heat pumps. For typical Salem homes, switching from gas heat to a heat pump cuts heating costs 30–50% and adds central AC for free.' },
      { t: 'Ductless vs. central — when each wins', b: "Ductless wins: older homes without ducts, room additions, garage conversions, ADUs, tasting rooms. Central wins: newer homes with existing duct work in good condition, whole-home retrofits, budget priority." },
      { t: 'Rebates make heat pumps surprisingly affordable', b: "Energy Trust of Oregon: up to $2,000. Federal tax credit: up to $2,000. Utility bonus rebates: up to $500. Combined, most Salem heat-pump installs see $3,000–$4,500 off sticker price." },
    ],
    faq: [
      { q: "Will a heat pump work in Salem's winter?", a: "Yes. Modern cold-climate heat pumps maintain full heating capacity down to 5°F — Salem rarely sees below 20°F. We install models rated for much colder climates than ours." },
      { q: 'Are heat pumps loud?', a: 'Modern inverter-driven heat pumps are significantly quieter than gas furnaces. Outdoor units run 50–60 dB (conversational volume). Indoor air handlers are near-silent.' },
      { q: 'Do I need a backup heat source?', a: 'Usually not. Modern cold-climate heat pumps handle 99% of Salem winter hours on their own. For worst-case cold snaps, a small electric resistance backup (built into the air handler) or a space heater in one room is enough.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/RSshutterstock_223543426-1920w.jpg',
  },
  { slug: 'residential-hvac-services', group: 'hub', h1: 'Residential HVAC Services',
    pitch: 'Complete residential HVAC: installation, repair, maintenance, indoor air quality, and smart controls — one accountable partner for heating, cooling, and everything in between.',
    benefits: [
      'AC installation, repair, maintenance',
      'Furnace installation, repair, maintenance',
      'Heat pumps & ductless mini-splits',
      'Air duct cleaning, sealing, repair',
      'Indoor air quality (IAQ)',
      'Smart thermostats and zoning',
    ],
    bullets: [
      { t: 'A full-stack residential partner', b: "We're not specialists in one product — we design, install, service, and maintain the whole residential HVAC stack, which means we recommend based on your home's actual needs rather than pushing the one thing we sell." },
      { t: 'Built for the Willamette Valley climate', b: "Salem winters are long, wet, and rarely bitter. Summers are increasingly hot. We size equipment for THIS climate, not textbook averages — meaning your system runs efficiently year-round." },
      { t: 'Priority for members', b: 'Customer Savings Plan members skip the queue during winter cold snaps and summer heat waves — when every HVAC shop is booked 4+ days out, members see us the same or next day.' },
    ],
    faq: [
      { q: 'Do you offer financing?', a: 'Yes — through our Enhancify partnership. Most customers qualify for 0% down, fixed monthly payment plans on installs over $2,000.' },
      { q: 'What brands do you install?', a: "We're brand-agnostic — Trane, Carrier, Lennox, Goodman, Mitsubishi, Daikin, Rheem, Bryant. We recommend based on your home and budget, not vendor spiffs." },
      { q: 'Do you serve commercial properties too?', a: 'Yes. See our commercial HVAC services page for restaurant, office, retail, and small industrial work.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-residential-hvac-services-1920w.jpg',
  },
  { slug: 'commercial-hvac-services', group: 'hub', h1: 'Commercial HVAC Services',
    pitch: 'Commercial HVAC for restaurants, offices, retail, and light-industrial properties across the mid-Willamette Valley. Service contracts, scheduled maintenance, and emergency response tuned to business hours.',
    benefits: [
      'Rooftop unit (RTU) install + service',
      'Split system + ductless arrays',
      'Service contracts with scheduled PM',
      'After-hours + weekend scheduling',
      'Emergency response for members',
      'Energy audits + efficiency upgrades',
    ],
    bullets: [
      { t: 'Service contracts built for business', b: 'Quarterly or semi-annual PM visits, documented equipment condition reports, priority dispatch for breakdowns, discounted parts and labor. One predictable line item per quarter.' },
      { t: 'After-hours + weekend work', b: "We'll work around your business hours — overnight install, weekend retrofit, early-morning service call. Your customers never see a tarp or a ladder." },
      { t: 'Energy audits for commercial properties', b: 'Infrared + blower-door + combustion analysis on your building envelope, HVAC systems, and controls. Report includes prioritized fixes with ROI calculations — typical commercial buildings find 15–30% energy savings.' },
    ],
    faq: [
      { q: 'Do you provide 24/7 emergency service?', a: 'For service-contract members: yes, 24/7 priority dispatch. For non-members, during business hours only with next-morning follow-up for after-hours calls.' },
      { q: 'What types of businesses do you serve?', a: 'Restaurants, retail storefronts, professional offices, medical/dental, light industrial, multi-tenant buildings, and tasting rooms across the mid-Willamette Valley.' },
      { q: 'Can you handle RTU replacements?', a: 'Yes — we own a boom truck rated for most commercial rooftop work. Larger crane-lift installs coordinate with a crane subcontractor.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-commercial--hvac-repairs-and-maintenance-5c816ca4-1920w.jpg',
  },
  { slug: 'commercial-ac-installations', group: 'commercial', h1: 'Commercial AC Installation',
    pitch: 'Commercial AC install for restaurants, retail, offices, and light industrial — RTUs, split systems, VRF multi-zone, and ductless arrays.',
    benefits: [
      '3-ton to 20-ton rooftop units',
      'Split systems and ductless arrays',
      'VRF multi-zone installs',
      'After-hours + weekend scheduling',
      'Permit + code compliance',
      'Warranty + service contract options',
    ],
    bullets: [
      { t: 'Rooftop units + crane-assisted lifts', b: "We install units up to 20 tons on our own boom; larger commercial RTUs coordinate with a licensed crane operator. All installs include curb work, electrical, gas, and duct connections." },
      { t: 'After-hours work — your customers never see us', b: "Most commercial AC replacements run overnight Friday-to-Sunday. We coordinate with your property manager for roof access, noise restrictions, and ETA so your business opens Monday morning as usual." },
      { t: 'Efficiency upgrades with rebate eligibility', b: "Commercial AC replacements often qualify for Energy Trust of Oregon commercial incentives and federal Section 179D deductions. We include the paperwork in the install package." },
    ],
    faq: [
      { q: 'How long does a commercial AC install take?', a: 'A straightforward RTU replacement is typically an 8–12 hour job. Full split-system or VRF installs run 2–5 days depending on scope.' },
      { q: 'Do you handle the electrical work?', a: 'Yes — our team includes a licensed electrician who handles disconnect, breaker, whip, and labeling. Larger commercial service changes may coordinate with a separate electrical contractor.' },
      { q: 'Can you work on weekends?', a: 'Yes. Most commercial replacements prefer weekend or overnight scheduling so the business stays open. No weekend upcharge for scheduled projects.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-commercial--hvac-repairs-and-maintenance-5c816ca4-1920w.jpg',
  },
  { slug: 'commercial-heating-and-installations', group: 'commercial', h1: 'Commercial Heating Installations',
    pitch: 'Commercial heating installs — gas and electric furnaces, commercial heat pumps, VRF, boilers, and rooftop heating packages.',
    benefits: [
      'Gas + electric commercial furnaces',
      'Commercial heat pumps (up to 20 tons)',
      'VRF multi-zone heat + cool',
      'Boiler + hydronic systems',
      'Combustion analysis + safety',
      'Emergency boiler service for members',
    ],
    bullets: [
      { t: 'Commercial heat pump upgrades', b: 'Many mid-Willamette commercial properties are still running 1990s gas furnaces or failing electric resistance heat. Modern VRF or commercial heat pumps cut operating costs 30–50% and qualify for significant rebates.' },
      { t: 'Boiler work for older buildings', b: 'Historic downtown Salem and Albany buildings often rely on boiler + radiator systems. We service, retrofit, and replace boilers, including low-NOx upgrades required by some municipal code updates.' },
      { t: 'Designed for Oregon winters', b: 'Commercial heating design in Oregon has to balance wet-cold winters with summer cooling load. We size systems for annual performance, not just peak heat day.' },
    ],
    faq: [
      { q: 'Can I replace a boiler with a heat pump?', a: "Sometimes — depends on the building's distribution (radiator vs. forced air) and electrical capacity. Hydronic boiler → hydronic heat-pump retrofits exist but require careful design. We'll walk you through feasibility in a free consultation." },
      { q: 'Do commercial heat pumps work in cold weather?', a: 'Yes — modern commercial cold-climate heat pumps maintain capacity down to 0°F, well below Salem winter lows.' },
      { q: 'What about gas price volatility?', a: "That's exactly why many commercial owners are switching to heat pumps — stable electric pricing and 30–50% lower operating costs hedge against gas price swings." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-commercial--hvac-repairs-and-maintenance-5c816ca4-1920w.jpg',
  },
  { slug: 'repairs-and-maintenance', group: 'commercial', h1: 'Commercial Repairs & Maintenance',
    pitch: 'Commercial HVAC repair and maintenance contracts — scheduled visits, priority dispatch, documented condition reports.',
    benefits: [
      'Quarterly or semi-annual PM visits',
      'Priority dispatch for breakdowns',
      'Documented condition reports',
      'Filter changes + belt/motor checks',
      'Refrigerant + combustion analysis',
      'Flat-fee contracts — no surprise bills',
    ],
    bullets: [
      { t: 'What a commercial service contract covers', b: 'Scheduled preventive maintenance 2–4x per year, priority dispatch (typically 4-hour response), 15% discount on repairs, annual filter supply, documented equipment condition reports.' },
      { t: 'Why contracts beat on-demand', b: 'A contract costs 30–40% less over three years than the same mix of emergency + PM + repair work paid separately — and keeps your equipment in warranty-compliant condition, extending its service life.' },
      { t: 'Documentation that matters for renewals', b: 'Quarterly written reports help you budget for replacements, demonstrate facility maintenance to building inspectors, and satisfy lease or insurance documentation requirements.' },
    ],
    faq: [
      { q: 'What does a service contract cost?', a: 'Depends on equipment count and complexity. Typical small-retail or office contracts run $150–$400/month. We quote after a free on-site assessment.' },
      { q: 'What happens during a breakdown?', a: "Members get priority dispatch — typically on-site within 4 business hours vs. 1–3 days for non-members during busy seasons." },
      { q: 'Can I upgrade equipment under contract?', a: 'Yes — contract members get 10–15% off install pricing on equipment replacement, and the PM visits transfer seamlessly to the new equipment.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-commercial--hvac-repairs-and-maintenance-5c816ca4-1920w.jpg',
  },
  { slug: 'customer-savings-plans', group: 'hub', h1: 'Customer Savings Plans',
    pitch: 'Two-visit annual maintenance programs that pay for themselves in energy savings and priority dispatch. The smart way to protect your HVAC investment.',
    benefits: [
      'Spring AC tune-up + fall furnace tune-up',
      'Priority dispatch during cold snaps',
      '15% off repairs',
      'Extended equipment warranties',
      'Documented condition reports',
      'Transferable to new homeowners',
    ],
    bullets: [
      { t: 'Why maintenance plans save money', b: 'Annual tune-ups cut energy use 15–40%, extend equipment life 5+ years, and catch small problems before they become expensive failures. The plan usually pays for itself in year one through utility savings alone.' },
      { t: "What's actually included", b: 'Two visits per year, full 27-point inspection, filter changes, coil clean, refrigerant verify, combustion analysis. Written report after every visit.' },
      { t: 'Priority matters in bad weather', b: 'When Salem hits a December cold snap or August heat wave, every HVAC company is booked 3–5 days out. Members skip the queue and see us same-day or next-day.' },
    ],
    faq: [
      { q: 'How much does the plan cost?', a: '$199/yr for single-family residential with one system, covering both spring and fall visits. Multi-system homes and commercial plans are priced on walk-through.' },
      { q: 'Is it worth it?', a: "Math check: a typical tune-up is $149. Two of them = $298. Plan is $199 and includes priority dispatch + 15% repair discount. Even if you don't use the discount, you save $99/year on scheduled service alone." },
      { q: 'Does it transfer if I sell my home?', a: "Yes — remaining plan value transfers to the new homeowner at no cost. It's actually a small sale feature when you list." },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-why-choose-us-1920w.jpg',
  },
  { slug: 'affiliate-services', group: 'hub', h1: 'Affiliate Services',
    pitch: 'Trusted trade partners we recommend for services outside our scope — electricians, plumbers, insulation, roofers. One call to us, vetted referrals.',
    benefits: [
      'Licensed electrical partners',
      'Vetted plumbing contractors',
      'Insulation & weatherization',
      'Roofing for HVAC equipment access',
      'Smart-home integration',
      'Solar installers',
    ],
    bullets: [
      { t: 'Why we refer instead of subcontract', b: "When a project needs work outside HVAC, you want a specialist — not a jack-of-all-trades. We keep a short list of contractors we've worked alongside for years and trust to do right by our customers." },
      { t: "We don't take referral fees", b: "Our recommendations are based on quality, not kickbacks. If a partner ever disappoints a customer, they come off the list." },
      { t: 'Coordinated scheduling', b: "For bigger projects we'll coordinate timing between contractors so you're not playing project manager between five different companies." },
    ],
    faq: [
      { q: 'Do you charge for referrals?', a: "No. We don't take kickbacks from our partners — referrals are free to you." },
      { q: 'What if a referral doesn\'t work out?', a: "Tell us. Partners come off the list if they disappoint our customers. We'd rather lose a referral relationship than damage trust with you." },
      { q: 'Can you coordinate multiple trades?', a: 'For larger projects (HVAC + electrical panel upgrade + new service, for example), yes. We scope timing across contractors so you get one completion date instead of five.' },
    ],
    img: 'https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-callout-1920w.png',
  },
];

/* ----- Cities (for GEO landing pages) — match valleyviewhvac.com sitemap ----- */
const CITIES = [
  { slug: 'amity-or',          name: 'Amity',          county: 'Yamhill County' },
  { slug: 'aumsville-or',      name: 'Aumsville',      county: 'Marion County' },
  { slug: 'aurora-or',         name: 'Aurora',         county: 'Marion County' },
  { slug: 'dallas-or',         name: 'Dallas',         county: 'Polk County' },
  { slug: 'dayton-or',         name: 'Dayton',         county: 'Yamhill County' },
  { slug: 'dundee-or',         name: 'Dundee',         county: 'Yamhill County' },
  { slug: 'falls-city-or',     name: 'Falls City',     county: 'Polk County' },
  { slug: 'four-corners-or',   name: 'Four Corners',   county: 'Marion County' },
  { slug: 'gervais-or',        name: 'Gervais',        county: 'Marion County' },
  { slug: 'hayesville-or',     name: 'Hayesville',     county: 'Marion County' },
  { slug: 'hubbard-or',        name: 'Hubbard',        county: 'Marion County' },
  { slug: 'independence-or',   name: 'Independence',   county: 'Polk County' },
  { slug: 'jefferson-or',      name: 'Jefferson',      county: 'Marion County' },
  { slug: 'keizer-or',         name: 'Keizer',         county: 'Marion County' },
  { slug: 'marion-or',         name: 'Marion',         county: 'Marion County' },
  { slug: 'mcminnville-or',    name: 'McMinnville',    county: 'Yamhill County' },
  { slug: 'millersburg-or',    name: 'Millersburg',    county: 'Linn County' },
  { slug: 'monmouth-or',       name: 'Monmouth',       county: 'Polk County' },
  { slug: 'mount-angel-or',    name: 'Mount Angel',    county: 'Marion County' },
  { slug: 'newberg-or',        name: 'Newberg',        county: 'Yamhill County' },
  { slug: 'scio-or',           name: 'Scio',           county: 'Linn County' },
  { slug: 'sheridan-or',       name: 'Sheridan',       county: 'Yamhill County' },
  { slug: 'silverton-or',      name: 'Silverton',      county: 'Marion County' },
  { slug: 'st-benedict-or',    name: 'St. Benedict',   county: 'Marion County' },
  { slug: 'st-paul-or',        name: 'St. Paul',       county: 'Marion County' },
  { slug: 'stayton-or',        name: 'Stayton',        county: 'Marion County' },
  { slug: 'turner-or',         name: 'Turner',         county: 'Marion County' },
  { slug: 'willamina-or',      name: 'Willamina',      county: 'Yamhill County' },
  { slug: 'woodburn-or',       name: 'Woodburn',       county: 'Marion County' },
  { slug: 'yamhill-or',        name: 'Yamhill',        county: 'Yamhill County' },
];

/* ----- Shared chrome ----- */
function discountBanner() {
  return `<div class="discount-banner">
  <div class="wrap">
    <div class="msg"><strong>10% off</strong> for seniors, veterans, educators, and first responders.</div>
    <div class="tags"><span>Seniors</span><span>Veterans</span><span>Educators</span><span>First Responders</span></div>
  </div>
</div>`;
}

function nav(activeSlug = '') {
  const isActive = (s) => activeSlug === s ? ' class="active"' : '';
  return `<header class="nav">
  <a href="index.html" class="nav-brand"><span class="mark">VV</span><span class="tm">Valley View HVAC<small>CCB #${BRAND.ccb} · salem + surrounding</small></span></a>
  <nav class="nav-links">
    <a href="index.html"${isActive('index')}>Home</a>
    <div class="nav-drop"><a href="residential-hvac-services.html"${isActive('residential-hvac-services')}>Residential ▾</a>
      <div class="nav-drop-menu">
        <a href="ac-installations.html">AC Installation</a>
        <a href="ac-maintenance.html">AC Maintenance</a>
        <a href="ac-repair.html">AC Repair</a>
        <a href="furnace-installations.html">Furnace Installation</a>
        <a href="furnace-maintenance.html">Furnace Maintenance</a>
        <a href="furnace-repair.html">Furnace Repair</a>
        <a href="heat-pumps-and-ductless-solutions.html">Heat Pumps &amp; Ductless</a>
        <a href="air-duct-services.html">Air Duct Services</a>
      </div></div>
    <div class="nav-drop"><a href="commercial-hvac-services.html"${isActive('commercial-hvac-services')}>Commercial ▾</a>
      <div class="nav-drop-menu">
        <a href="commercial-ac-installations.html">Commercial AC</a>
        <a href="commercial-heating-and-installations.html">Commercial Heating</a>
        <a href="repairs-and-maintenance.html">Repairs &amp; Maintenance</a>
      </div></div>
    <a href="estimator.html"${isActive('estimator')}>Estimate</a>
    <a href="areas.html"${isActive('areas')}>Service Areas</a>
    <div class="nav-drop"><a href="about.html"${isActive('about')}>About ▾</a>
      <div class="nav-drop-menu">
        <a href="about.html">About Us</a>
        <a href="reviews.html">Reviews</a>
        <a href="faqs.html">FAQs</a>
        <a href="blog.html">Blog</a>
        <a href="customer-savings-plans.html">Savings Plans</a>
        <a href="affiliate-services.html">Affiliate Services</a>
        <a href="gallery.html">Work</a>
      </div></div>
    <a href="contact.html"${isActive('contact')}>Contact</a>
  </nav>
  <a href="tel:${BRAND.phoneHref}" class="nav-cta">${BRAND.phone}</a>
  <button class="mobile-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span class="mt-bar"></span></button>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mm-head">
    <a href="index.html" class="mm-brand">
      <img src="https://lh3.googleusercontent.com/d/1oEo3tFVFCspVWwUCMgyz49gkMNJ11pue=w120" alt="${BRAND.name}" />
      <span>${BRAND.name}<small>CCB #${BRAND.ccb} · ${BRAND.city} &amp; area</small></span>
    </a>
    <button type="button" class="mm-close" aria-label="Close menu">&times;</button>
  </div>
  <nav class="mm-links" aria-label="Mobile">
    <a href="index.html">Home</a>

    <button type="button" class="mm-group" data-mm-group="residential" aria-expanded="false" aria-controls="mm-sub-residential">
      Residential <i class="mm-chev" aria-hidden="true">&#9662;</i>
    </button>
    <div class="mm-sub" id="mm-sub-residential" data-mm-member="residential">
      <a href="residential-hvac-services.html">All Residential Services</a>
      <a href="ac-installations.html">AC Installation</a>
      <a href="ac-maintenance.html">AC Maintenance</a>
      <a href="ac-repair.html">AC Repair</a>
      <a href="furnace-installations.html">Furnace Installation</a>
      <a href="furnace-maintenance.html">Furnace Maintenance</a>
      <a href="furnace-repair.html">Furnace Repair</a>
      <a href="heat-pumps-and-ductless-solutions.html">Heat Pumps &amp; Ductless</a>
      <a href="air-duct-services.html">Air Duct Services</a>
    </div>

    <button type="button" class="mm-group" data-mm-group="commercial" aria-expanded="false" aria-controls="mm-sub-commercial">
      Commercial <i class="mm-chev" aria-hidden="true">&#9662;</i>
    </button>
    <div class="mm-sub" id="mm-sub-commercial" data-mm-member="commercial">
      <a href="commercial-hvac-services.html">All Commercial Services</a>
      <a href="commercial-ac-installations.html">Commercial AC Installation</a>
      <a href="commercial-heating-and-installations.html">Commercial Heating</a>
      <a href="repairs-and-maintenance.html">Repairs &amp; Maintenance</a>
    </div>

    <a href="estimator.html">Instant Estimate</a>
    <a href="request-consultation.html">Request Consultation</a>
    <a href="areas.html">Service Areas</a>

    <button type="button" class="mm-group" data-mm-group="about" aria-expanded="false" aria-controls="mm-sub-about">
      About &amp; Resources <i class="mm-chev" aria-hidden="true">&#9662;</i>
    </button>
    <div class="mm-sub" id="mm-sub-about" data-mm-member="about">
      <a href="about.html">About Us</a>
      <a href="reviews.html">Reviews</a>
      <a href="faqs.html">FAQs</a>
      <a href="blog.html">Blog</a>
      <a href="customer-savings-plans.html">Savings Plans</a>
      <a href="affiliate-services.html">Affiliate Services</a>
      <a href="gallery.html">Our Work</a>
    </div>

    <a href="contact.html">Contact</a>
  </nav>
  <div class="mm-foot">
    <a href="tel:${BRAND.phoneHref}" class="mm-call">&#128222; ${BRAND.phone}</a>
    <span class="mm-note">Licensed · CCB #${BRAND.ccb} · ${BRAND.city}, ${BRAND.state}</span>
  </div>
</div>`;
}

function footer() {
  return `<footer class="foot">
  <div class="wrap foot-grid">
    <div><div class="brand"><span class="mark">VV</span><span class="tm">Valley View HVAC</span></div><p style="color:rgba(255,255,255,0.7); max-width:32ch;">Dependable heating, cooling, and indoor air quality for Salem &amp; the mid-Willamette since ${BRAND.founded}. CCB #${BRAND.ccb} · EPA-2 · Bonded · Insured.</p></div>
    <div><h5>Residential</h5><ul>
      <li><a href="ac-installations.html">AC Installation</a></li>
      <li><a href="ac-repair.html">AC Repair</a></li>
      <li><a href="furnace-installations.html">Furnace Install</a></li>
      <li><a href="furnace-repair.html">Furnace Repair</a></li>
      <li><a href="heat-pumps-and-ductless-solutions.html">Heat Pumps</a></li>
      <li><a href="air-duct-services.html">Air Ducts</a></li>
    </ul></div>
    <div><h5>Commercial &amp; More</h5><ul>
      <li><a href="commercial-ac-installations.html">Commercial AC</a></li>
      <li><a href="commercial-heating-and-installations.html">Commercial Heating</a></li>
      <li><a href="repairs-and-maintenance.html">Service Contracts</a></li>
      <li><a href="customer-savings-plans.html">Savings Plans</a></li>
      <li><a href="areas.html">Service Areas</a></li>
      <li><a href="blog.html">Blog</a></li>
      <li><a href="faqs.html">FAQs</a></li>
      <li><a href="reviews.html">Reviews</a></li>
    </ul></div>
    <div><h5>Contact</h5><ul>
      <li><a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a></li>
      <li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li>
      <li>Mon–Sat 7am–7pm</li>
      <li><a href="request-consultation.html">Request consultation</a></li>
      <li><a href="estimator.html">Instant estimate</a></li>
    </ul></div>
  </div>
  <div class="wrap foot-bottom"><span>© <span id="year"></span> Valley View HVAC · OR CCB #${BRAND.ccb} · Licensed · Bonded · Insured</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div>
</footer>`;
}

function schemaLocalBusiness({ extraTypes = [], serviceName = '' } = {}) {
  const services = SERVICES.filter(s => s.group === 'residential' || s.group === 'commercial').map(s => s.h1);
  const cities = CITIES.slice(0, 30).map(c => c.name + ', OR');
  const schema = {
    "@context": "https://schema.org",
    "@type": ["HVACBusiness", "LocalBusiness", ...extraTypes],
    "@id": BRAND.site + "/#business",
    "name": BRAND.name,
    "url": BRAND.site + "/",
    "telephone": BRAND.phone,
    "email": BRAND.email,
    "founder": "Valley View HVAC team",
    "foundingDate": String(BRAND.founded),
    "priceRange": "$$",
    "image": "https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-logo-1920w.jpg",
    "address": { "@type": "PostalAddress", "addressLocality": BRAND.city, "addressRegion": BRAND.state, "addressCountry": "US" },
    "geo": { "@type": "GeoCoordinates", "latitude": BRAND.lat, "longitude": BRAND.lng },
    "areaServed": cities.map(c => ({ "@type": "City", "name": c })),
    "hasOfferCatalog": { "@type": "OfferCatalog", "name": "HVAC Services",
      "itemListElement": services.map(n => ({ "@type": "Offer", "itemOffered": { "@type": "Service", "name": n } }))
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "07:00", "closes": "19:00"
    }],
    "sameAs": []
  };
  if (serviceName) schema.makesOffer = { "@type": "Offer", "itemOffered": { "@type": "Service", "name": serviceName } };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function schemaBreadcrumbs(trail) {
  const list = trail.map((t, i) => ({
    "@type": "ListItem", "position": i + 1, "name": t.name, "item": t.url
  }));
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": list
  })}</script>`;
}

function schemaFAQ(qas) {
  if (!qas?.length) return '';
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": qas.map(f => ({
      "@type": "Question", "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  })}</script>`;
}

function head({ title, description, slug }) {
  const canonical = BRAND.site + '/' + (slug === 'index' ? '' : slug);
  return `<meta charset="UTF-8" />
<base href="/${BRAND.slug}/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="theme-color" content="#1e3a8a" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta name="twitter:card" content="summary_large_image" />
${FONTS}
<link rel="stylesheet" href="styles.css" />`;
}

/* ---------- Service page template ---------- */
function renderService(s) {
  const title = `${s.h1} in Salem, OR — Valley View HVAC | CCB #${BRAND.ccb}`;
  const description = s.pitch.slice(0, 155);
  const trail = [
    { name: 'Home', url: BRAND.site + '/' },
    { name: s.group === 'hub' ? s.h1 : (s.group === 'commercial' ? 'Commercial' : 'Residential'),
      url: BRAND.site + '/' + (s.group === 'commercial' ? 'commercial-hvac-services' : 'residential-hvac-services') },
    { name: s.h1, url: BRAND.site + '/' + s.slug }
  ];

  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: s.slug })}
${schemaLocalBusiness({ serviceName: s.h1 })}
${schemaBreadcrumbs(trail)}
${schemaFAQ(s.faq)}
</head><body>
${discountBanner()}
${nav(s.slug)}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>${s.h1} · Salem &amp; mid-Willamette</span>
  <h1>${s.h1}<br/><span class="blue">done right for Salem homes.</span></h1>
  <p>${s.pitch}</p>
  <div class="hero-cta" style="margin-top:1.4rem;"><a href="estimator.html" class="btn btn-primary">Get instant estimate <span class="arrow">→</span></a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div>
</div></section>

<section class="section">
  <div class="wrap" style="display:grid; grid-template-columns:1.15fr 1fr; gap:3rem; align-items:center;">
    <div class="reveal">
      <span class="eyebrow">What's included</span>
      <h2 style="font-family:var(--ff-display); font-weight:700; font-size:clamp(1.9rem,4vw,2.9rem); letter-spacing:-0.02em; line-height:1.05; margin:1rem 0;">${s.h1} <span class="blue">from Valley View.</span></h2>
      <ul style="list-style:none; display:grid; gap:0.55rem;">
        ${s.benefits.map(b => `<li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>${b}</li>`).join('')}
      </ul>
      <div class="hero-cta" style="margin-top:1.6rem;"><a href="request-consultation.html" class="btn btn-orange">Request consultation <span class="arrow">→</span></a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div>
    </div>
    <div class="hero-card reveal" style="aspect-ratio:4/5;">
      <img src="${s.img}" alt="${s.h1} in Salem, OR" loading="lazy" />
      <div class="tile t1"><div class="k">Warranty</div><div class="v">10-yr / <em>2-yr</em></div></div>
      <div class="tile t2"><div class="k">Licensed</div><div class="v">CCB <em>#${BRAND.ccb}</em></div></div>
      <div class="tile t3"><div class="k">Service</div><div class="v">Same-<em>day</em></div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="wrap">
    <header class="section-head reveal"><span class="eyebrow">Deep dive</span><h2>Everything you should know about <span class="blue">${s.h1.toLowerCase()} in Salem.</span></h2></header>
    <div class="feature-grid stagger">
      ${s.bullets.map((bu, i) => `<div class="feature">
        <div class="ico">${['⚙️','🔍','💰','🛡️'][i%4]}</div>
        <h3>${bu.t}</h3>
        <p>${bu.b}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="wrap">
    <header class="section-head reveal"><span class="eyebrow">Questions, answered</span><h2>FAQ — ${s.h1}.</h2></header>
    <div style="display:grid; gap:0.8rem; max-width:56rem;">
      ${s.faq.map(f => `<details class="feature" style="cursor:pointer;"><summary style="font-family:var(--ff-display); font-weight:700; font-size:1.15rem; color:var(--ink); list-style:none;">${f.q}</summary><p style="margin-top:0.7rem; color:var(--ink-soft);">${f.a}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;"><div class="wrap">
  <header class="section-head reveal"><span class="eyebrow">Areas served</span><h2>${s.h1} across <span class="blue">the Valley.</span></h2></header>
  <div style="display:flex; flex-wrap:wrap; gap:0.55rem;">
    ${CITIES.map(c => `<a href="furnace-repairs-${c.slug}.html" style="padding:0.55rem 1rem; border:1px solid var(--border); border-radius:999px; background:var(--white); color:var(--ink-soft); font-weight:500; font-size:0.92rem; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.color='var(--blue)';" onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--ink-soft)';">${c.name}</a>`).join('')}
  </div>
</div></section>

<section class="cta">
  <div class="wrap">
    <h2>Ready for ${s.h1.toLowerCase()}?<br/><span class="orange">Start with a free walk-through.</span></h2>
    <p>No-pressure in-home consultation. Manual-J load calc, itemized rebate review, and a clear 10-yr equipment / 2-yr workmanship warranty on every install.</p>
    <div class="cta-actions"><a href="estimator.html" class="btn btn-orange">Get instant estimate <span class="arrow">→</span></a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone} <span class="arrow">→</span></a></div>
  </div>
</section>

${footer()}

<script src="animations.js" defer></script>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body></html>`;
}

/* ---------- Geo landing page (City × Service) ---------- */
function renderGeoPage({ city, service, kind }) {
  const keyword = kind === 'furnace' ? 'Furnace Repair' : 'Local HVAC Companies';
  const slugPrefix = kind === 'furnace' ? 'furnace-repairs' : 'local-hvac';
  const slug = `${slugPrefix}-${city.slug}`;
  const title = `${keyword} in ${city.name}, OR — Valley View HVAC`;
  const description = `${keyword} in ${city.name}, ${city.county}. Same-day service, CCB #${BRAND.ccb} licensed, 10-yr equipment warranty, Energy Trust rebates handled. Call ${BRAND.phone}.`;
  const trail = [
    { name: 'Home', url: BRAND.site + '/' },
    { name: 'Service Areas', url: BRAND.site + '/areas' },
    { name: city.name, url: BRAND.site + '/' + slug }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": keyword,
    "provider": { "@type": "HVACBusiness", "name": BRAND.name, "telephone": BRAND.phone, "url": BRAND.site + '/' },
    "areaServed": { "@type": "City", "name": city.name + ', OR', "containedInPlace": { "@type": "AdministrativeArea", "name": city.county } },
    "availableChannel": { "@type": "ServiceChannel", "servicePhone": BRAND.phone, "serviceUrl": BRAND.site + '/' + slug }
  };

  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug })}
${schemaLocalBusiness({ serviceName: keyword })}
${schemaBreadcrumbs(trail)}
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head><body>
${discountBanner()}
${nav('areas')}

<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>${city.county} · ${keyword}</span>
  <h1>${keyword} in<br/><span class="blue">${city.name}, OR.</span></h1>
  <p>Valley View HVAC is CCB #${BRAND.ccb} licensed and serves ${city.name} homes and businesses with same-day ${keyword.toLowerCase()}, backed by a 10-year equipment warranty and a 2-year workmanship guarantee. Call ${BRAND.phone} or get an instant estimate below.</p>
  <div class="hero-cta" style="margin-top:1.2rem;"><a href="estimator.html" class="btn btn-primary">Get an estimate <span class="arrow">→</span></a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div>
</div></section>

<section class="section">
  <div class="wrap" style="display:grid; grid-template-columns:1.15fr 1fr; gap:3rem; align-items:center;">
    <div class="reveal">
      <span class="eyebrow">Why ${city.name} chooses Valley View</span>
      <h2 style="font-family:var(--ff-display); font-weight:700; font-size:clamp(1.9rem,4vw,2.9rem); letter-spacing:-0.02em; line-height:1.05; margin:1rem 0;">Local HVAC, <span class="orange">real response times.</span></h2>
      <p style="color:var(--ink-soft); font-size:1.08rem; margin-bottom:1rem;">We dispatch from Salem to ${city.name} and the rest of ${city.county} in under 45 minutes most days. Every call is answered by a real person during business hours — not a call-center routing you through a menu.</p>
      <p style="color:var(--ink-soft); margin-bottom:1.2rem;">Whether your furnace quit in December, your AC is struggling in August, or you're planning a heat-pump retrofit, we have ${city.name} covered with the same licensing, same warranty, and same 10% community discount (seniors, veterans, educators, first responders) as our home city.</p>
      <ul style="list-style:none; display:grid; gap:0.5rem;">
        <li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>CCB #${BRAND.ccb} licensed, bonded, insured</li>
        <li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>EPA-2 certified refrigerant handling</li>
        <li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>Same-day dispatch to ${city.name}</li>
        <li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>10-yr equipment / 2-yr workmanship warranty</li>
        <li style="padding-left:1.6rem; position:relative; color:var(--ink-soft);"><span style="position:absolute; left:0; color:var(--orange); font-weight:800;">✓</span>Energy Trust of Oregon rebate filing included</li>
      </ul>
      <div class="hero-cta" style="margin-top:1.4rem;"><a href="estimator.html" class="btn btn-primary">Run estimate</a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div>
    </div>
    <div class="hero-card reveal" style="aspect-ratio:4/5;">
      <img src="https://le-cdn.hibuwebsites.com/08264d7ffe52494e81ba036ede612efa/dms3rep/multi/opt/valley-view-hvac-hero-residential-hvac-services-1920w.jpg" alt="HVAC service in ${city.name}, OR" loading="lazy" />
      <div class="tile t1"><div class="k">Service area</div><div class="v">${city.name}<br/><em>${city.county}</em></div></div>
      <div class="tile t2"><div class="k">Response</div><div class="v">Same-<em>day</em></div></div>
      <div class="tile t3"><div class="k">Licensed</div><div class="v">CCB <em>#${BRAND.ccb}</em></div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="wrap">
    <header class="section-head reveal"><span class="eyebrow">What we handle in ${city.name}</span><h2>HVAC services <span class="blue">across ${city.name}.</span></h2></header>
    <div class="feature-grid stagger">
      <div class="feature"><div class="ico">❄️</div><h3>AC repair &amp; install</h3><p>Same-day diagnostics, flat-rate pricing, manufacturer-backed installs for ${city.name} homes.</p><ul><li><a href="ac-repair.html">AC repair details</a></li><li><a href="ac-installations.html">AC installation</a></li></ul></div>
      <div class="feature"><div class="ico">🔥</div><h3>Furnace repair &amp; install</h3><p>Gas and electric furnaces, combustion analysis, code-compliant venting. Winter emergency response in ${city.name}.</p><ul><li><a href="furnace-repair.html">Furnace repair</a></li><li><a href="furnace-installations.html">Furnace install</a></li></ul></div>
      <div class="feature"><div class="ico">⚡</div><h3>Heat pumps</h3><p>Cold-climate heat pumps for ${city.name} homes — 30–50% lower heating bills, rebate-eligible installs.</p><ul><li><a href="heat-pumps-and-ductless-solutions.html">Heat pumps &amp; ductless</a></li></ul></div>
      <div class="feature"><div class="ico">🔁</div><h3>Ductless mini-splits</h3><p>Perfect for older ${city.name} homes without existing duct work — and ADUs, additions, and tasting rooms.</p><ul><li><a href="heat-pumps-and-ductless-solutions.html">Ductless solutions</a></li></ul></div>
      <div class="feature"><div class="ico">🛠️</div><h3>Maintenance plans</h3><p>Two-visit annual maintenance with priority dispatch — ${city.name} members skip the queue in cold snaps.</p><ul><li><a href="customer-savings-plans.html">Savings plans</a></li></ul></div>
      <div class="feature"><div class="ico">💨</div><h3>Indoor air quality</h3><p>Filtration, UV, humidity control, duct cleaning for ${city.name} homes dealing with pollen, smoke, or allergens.</p><ul><li><a href="air-duct-services.html">Air duct services</a></li></ul></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="wrap">
    <header class="section-head reveal"><span class="eyebrow">Other ${city.county} areas</span><h2>Nearby ${city.county} cities <span class="blue">we serve.</span></h2></header>
    <div style="display:flex; flex-wrap:wrap; gap:0.55rem;">
      ${CITIES.filter(c => c.county === city.county && c.slug !== city.slug).map(c =>
        `<a href="furnace-repairs-${c.slug}.html" style="padding:0.55rem 1rem; border:1px solid var(--border); border-radius:999px; color:var(--ink-soft); font-weight:500; font-size:0.92rem;">${c.name}</a>`
      ).join('')}
      <a href="areas.html" style="padding:0.55rem 1rem; border:1px solid var(--blue); border-radius:999px; color:var(--blue); font-weight:600; font-size:0.92rem;">All areas →</a>
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <h2>${city.name} HVAC help,<br/><span class="orange">right now.</span></h2>
    <p>Call our Salem dispatch for same-day service anywhere in ${city.county} — or get an instant ballpark estimate in under a minute.</p>
    <div class="cta-actions"><a href="estimator.html" class="btn btn-orange">Instant estimate</a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div>
  </div>
</section>

${footer()}
<script src="animations.js" defer></script>
<script>document.getElementById('year').textContent=new Date().getFullYear();</script>
</body></html>`;
}

/* ---------- FAQ page ---------- */
function renderFAQ() {
  const allFaqs = SERVICES.flatMap(s => s.faq.slice(0, 2));
  const title = 'HVAC FAQs — Valley View HVAC | Salem, OR';
  const description = 'Answers to common HVAC questions: AC install, furnace repair, heat pumps, rebates, warranties, maintenance plans. Straight answers from a Salem, OR HVAC contractor.';
  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: 'faqs' })}
${schemaLocalBusiness()}
${schemaFAQ(allFaqs)}
</head><body>
${discountBanner()}
${nav('faqs')}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>Frequently asked questions</span>
  <h1>HVAC <span class="blue">FAQs.</span></h1>
  <p>Straight answers about HVAC install, repair, maintenance, heat pumps, rebates, and warranties — from the Valley View team. Don't see your question? Call us at ${BRAND.phone}.</p>
</div></section>

<section class="section">
  <div class="wrap" style="max-width:64rem;">
  ${SERVICES.filter(s => s.group !== 'hub').map(s => `
    <header class="section-head reveal" style="margin-top:2.5rem;">
      <span class="eyebrow">${s.group === 'commercial' ? 'Commercial' : 'Residential'} · ${s.h1}</span>
      <h2 style="font-family:var(--ff-display); font-weight:700; font-size:clamp(1.6rem,3vw,2.2rem); letter-spacing:-0.02em;">${s.h1} questions.</h2>
    </header>
    <div style="display:grid; gap:0.7rem;">
      ${s.faq.map(f => `<details class="feature" style="cursor:pointer;"><summary style="font-family:var(--ff-display); font-weight:700; font-size:1.1rem; color:var(--ink); list-style:none;">${f.q}</summary><p style="margin-top:0.7rem; color:var(--ink-soft);">${f.a} <a href="${s.slug}.html" style="color:var(--blue); font-weight:600;">— ${s.h1.toLowerCase()} →</a></p></details>`).join('')}
    </div>
  `).join('')}
  </div>
</section>
<section class="cta"><div class="wrap"><h2>Still have <span class="orange">questions?</span></h2><p>Call our Salem office and talk to a real technician — not a call-center.</p><div class="cta-actions"><a href="tel:${BRAND.phoneHref}" class="btn btn-orange">${BRAND.phone}</a><a href="contact.html" class="btn">Email us</a></div></div></section>
${footer()}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

/* ---------- Reviews ---------- */
function renderReviews() {
  const reviews = [
    { name:'Jennifer B.', city:'Salem, OR', rating:5, text:"Replaced our 20-year-old AC with a heat pump. They walked us through every rebate — Energy Trust, federal, PGE. Our power bill dropped noticeably in the first month, and the install looked like a factory photo." },
    { name:'Dan M.', city:'Albany, OR', rating:5, text:"Furnace went out mid-cold-snap. Valley View had a technician on-site the same afternoon and a new unit installed before the weekend. No 'emergency fee' surprises." },
    { name:'Rachel L.', city:'McMinnville, OR', rating:5, text:"Installed Mitsubishi ductless mini-splits in our ADU. Clean wiring, tidy refrigerant runs, actual explanations of the controls. This is what careful work looks like." },
    { name:'Property Mgmt Co.', city:'Salem, OR', rating:5, text:"We have Valley View on a service contract for six commercial properties. Scheduled PM visits happen on time, emergency response has been fast every time. Quarterly reports help us budget." },
    { name:'Linda T.', city:'Keizer, OR', rating:5, text:"They diagnosed a cracked heat exchanger two other HVAC companies missed. Red-tagged the system that day and had a replacement running in three. Probably saved our family from a CO event." },
    { name:'Mark O.', city:'Dallas, OR', rating:5, text:"Honest quote. Showed up on time. Cleaned up like they were never there. The combined spring + fall maintenance plan is the best $199 we've spent on this house." },
    { name:'Kim F.', city:'Woodburn, OR', rating:5, text:"Called about a gas smell near the furnace. They walked me through an immediate shutoff on the phone before the technician arrived. Turned out to be a minor flex connector issue, but they took it seriously." },
    { name:'Tasting Room Owner', city:'McMinnville, OR', rating:5, text:"Installed ductless units in our tasting room — line runs nearly invisible, conditioning is silent, bill matched the quote to the dollar. Best vendor experience we've had in years." },
    { name:'Thomas R.', city:'Stayton, OR', rating:5, text:"I had three quotes. Valley View wasn't the cheapest or the most expensive — they were the only ones who did an actual Manual-J load calc before quoting. Install was flawless and the system runs like a dream." },
    { name:'Nancy H.', city:'Silverton, OR', rating:5, text:"We're seniors and they honored the 10% community discount without us having to push for it. Small thing, but it meant a lot." },
  ];
  const title = 'Customer Reviews — Valley View HVAC | 5-Star Salem HVAC Contractor';
  const description = 'Real reviews from Salem, Albany, McMinnville, Keizer, and mid-Willamette homeowners and businesses who chose Valley View HVAC for their heating, cooling, and indoor air quality work.';
  const schema = {
    "@context":"https://schema.org", "@type":"HVACBusiness", "@id": BRAND.site + '/#business',
    "name": BRAND.name, "aggregateRating": { "@type":"AggregateRating", "ratingValue": "5.0", "reviewCount": reviews.length },
    "review": reviews.map(r => ({
      "@type":"Review", "author": { "@type":"Person", "name": r.name },
      "reviewRating": { "@type":"Rating", "ratingValue": String(r.rating), "bestRating":"5" },
      "reviewBody": r.text
    }))
  };

  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: 'reviews' })}
${schemaLocalBusiness()}
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head><body>
${discountBanner()}
${nav('reviews')}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>5.0 average · ${reviews.length}+ verified reviews</span>
  <h1>Customer <span class="blue">reviews.</span></h1>
  <p>Real homeowners and business owners across Salem, Albany, McMinnville, Keizer, and the mid-Willamette who trusted Valley View with their HVAC. Read their actual words — not marketing copy.</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="quotes stagger" style="grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));">
    ${reviews.map((r, i) => `<div class="quote">
      <div class="stars">${'★'.repeat(r.rating)}</div>
      <p>${r.text}</p>
      <div class="who"><div class="av">${r.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><strong>${r.name}</strong><span>${r.city}</span></div></div>
    </div>`).join('')}
  </div>
</div></section>
<section class="cta"><div class="wrap"><h2>Ready to experience it <span class="orange">yourself?</span></h2><div class="cta-actions"><a href="estimator.html" class="btn btn-orange">Get an estimate</a><a href="tel:${BRAND.phoneHref}" class="btn">${BRAND.phone}</a></div></div></section>
${footer()}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

/* ---------- Blog hub + articles ---------- */
const BLOG_POSTS = [
  { slug: 'benefits-of-employing-a-local-hvac-company', title: 'Benefits of Employing a Local HVAC Company',
    summary: 'Why hiring local — instead of a regional chain or a national brand — usually means faster response, better warranty follow-through, and accountability that matters.',
    body: [
      ['Faster response when you need it', "Local HVAC shops keep their trucks dispatched from a single regional hub. When your furnace quits at 6pm on a Tuesday in December, the difference between a 45-minute response and a 'we'll see you Friday' response is usually whether you picked someone local."],
      ['Real accountability', "Local companies trade on reputation because they only have one community to lose. A national chain can afford to burn a customer in Salem — local shops can't. That economic reality translates into better customer care."],
      ['Warranty claims that actually get handled', "When a install has a problem six months later, local shops want to fix it because you know their name and tell your neighbors. Regional chains often bounce you around a help desk. That's not a theoretical difference — it's the #1 HVAC complaint on Better Business Bureau filings."],
      ['Climate-specific design knowledge', "Salem's long wet winters + increasingly hot summers need equipment sized for THIS climate — not a textbook 'Pacific Northwest' average. Local shops see Willamette Valley homes every day and size accordingly. National chains use regional defaults."],
      ['Community participation', "Local contractors sponsor little league, hire local tradespeople, pay local taxes, and show up at community events. It's not charity — it's how local trades keep their name in the conversation. And that money stays in Salem."],
    ]
  },
  { slug: 'signs-you-need-to-call-furnace-repair-services', title: "Signs You Need to Call Furnace Repair Services",
    summary: 'Seven warning signs your furnace is telling you to get it looked at — before it fails on the coldest night of the year.',
    body: [
      ['1. Strange smells', "A burning smell on first run of the season is usually dust burn-off — normal. A persistent burning, electrical, or gas smell is not — shut off the furnace immediately and call us."],
      ['2. Unusual noises', "Light whooshing = normal ignition. Banging on startup = delayed ignition (fix it). Grinding = blower bearing failure (fix soon). Boom or loud cracking = heat exchanger issue (shut down immediately)."],
      ['3. Short cycling', "If your furnace runs for 3–5 minutes, shuts off, and restarts five minutes later, something is wrong — typically a dirty flame sensor, clogged filter, overheating limit, or oversized unit. Short cycling wears out components fast."],
      ['4. Inconsistent heating', "Some rooms warm, others cold? Could be duct leakage (fixable), blower issues, zoning problems, or a failing blower motor. All are repairable — but ignoring them stresses the system."],
      ['5. Yellow pilot or burner flame', "A healthy burner flame is crisp blue with a small yellow tip. Mostly yellow flame = incomplete combustion, which produces carbon monoxide. Shut down and call."],
      ['6. Skyrocketing heating bills', "A sudden jump in gas or electric usage (without a weather change) usually means the system is losing efficiency — clogged coil, failing motor, duct leakage, or developing mechanical problem."],
      ['7. Your furnace is over 15 years old', "Average residential gas furnace life: 15–20 years. At 15+ you should start budgeting for replacement. When a significant repair ($800+) hits a 15+ year unit, replacement almost always saves money within 3 years via efficiency gains."],
    ]
  },
  { slug: 'the-importance-of-hiring-a-professional-hvac-company', title: 'The Importance of Hiring a Professional HVAC Company',
    summary: "Why HVAC DIY and 'handyman' fixes cost more in the long run — safety, warranty, code, and why the price gap shrinks when you count the whole lifecycle.",
    body: [
      ['HVAC work is safety-critical', "Gas combustion, high-voltage electrical, refrigerants under pressure, carbon monoxide risk. A $400 savings on an install becomes a $40,000 liability if a CO event happens. Licensed pros carry insurance, follow code, and document safety tests."],
      ['Warranties require licensed installs', "Most equipment manufacturer warranties are void if the installer isn't licensed. A 10-year compressor warranty on an unlicensed install becomes a 'good luck' warranty. That's not a detail — it's a $3,000–$8,000 detail."],
      ['Code compliance and permits', "Oregon requires permits for furnace, AC, and heat-pump installs, with inspector sign-off. Unpermitted work shows up in home sale disclosures, can fail home inspections, and can invalidate homeowner insurance claims."],
      ['Right-sizing matters more than brand', "An oversized AC short-cycles, dehumidifies poorly, and wears out 2–3x faster than a properly sized unit. Pros do Manual-J load calculations; DIY and unlicensed installers guess by square feet. The 'savings' from skipping professional design often burn faster than a lottery ticket."],
      ['Lifecycle cost, not sticker cost', "Pro install + proper sizing + permit + warranty + annual maintenance usually costs 15–25% more than DIY or handyman install — but delivers 40–60% longer equipment life and 20–30% lower operating costs. The math is not close."],
      ['Peace of mind has dollar value', "When something goes wrong on a pro install, you have recourse: licensed, bonded, insured, with a warranty and a phone number. When something goes wrong on a DIY or handyman install, you have a problem."],
    ]
  },
];

function renderBlogHub() {
  const title = 'HVAC Tips &amp; News — Valley View HVAC Blog | Salem, OR';
  const description = 'Practical HVAC articles for Salem-area homeowners — when to repair vs. replace, why hiring local matters, and the signs your furnace is trying to tell you something.';
  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: 'blog' })}
${schemaLocalBusiness()}
<script type="application/ld+json">${JSON.stringify({
  "@context":"https://schema.org", "@type":"Blog", "name":"Valley View HVAC Blog", "url": BRAND.site + '/blog',
  "publisher": { "@type":"Organization", "name": BRAND.name, "url": BRAND.site + '/' },
  "blogPost": BLOG_POSTS.map(p => ({
    "@type":"BlogPosting", "headline": p.title, "url": BRAND.site + '/' + p.slug, "abstract": p.summary,
    "author": { "@type":"Organization", "name": BRAND.name }
  }))
})}</script>
</head><body>
${discountBanner()}
${nav('blog')}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>Tips &amp; guides</span>
  <h1>Valley View <span class="blue">blog.</span></h1>
  <p>Practical HVAC writing for Salem-area homeowners and businesses — when to repair vs. replace, how to spot a failing furnace, what 'local' actually gets you, and why right-sizing matters more than brand.</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="feature-grid stagger">
    ${BLOG_POSTS.map(p => `<a href="${p.slug}.html" class="feature" style="text-decoration:none; color:inherit;">
      <div class="ico">📖</div>
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <span class="arrow-box">Read article →</span>
    </a>`).join('')}
  </div>
</div></section>
<section class="cta"><div class="wrap"><h2>Questions a blog post <span class="orange">can't answer?</span></h2><p>Talk to a real technician — no call-center, no sales funnel.</p><div class="cta-actions"><a href="tel:${BRAND.phoneHref}" class="btn btn-orange">${BRAND.phone}</a><a href="contact.html" class="btn">Email us</a></div></div></section>
${footer()}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

function renderBlogPost(p) {
  const title = `${p.title} — Valley View HVAC`;
  const description = p.summary;
  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: p.slug })}
${schemaLocalBusiness()}
<script type="application/ld+json">${JSON.stringify({
  "@context":"https://schema.org", "@type":"BlogPosting", "headline": p.title, "url": BRAND.site + '/' + p.slug,
  "publisher": { "@type":"Organization", "name": BRAND.name, "url": BRAND.site + '/' },
  "author": { "@type":"Organization", "name": BRAND.name },
  "mainEntityOfPage": BRAND.site + '/' + p.slug,
  "description": p.summary
})}</script>
</head><body>
${discountBanner()}
${nav('blog')}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>Valley View blog · HVAC guide</span>
  <h1>${p.title}</h1>
  <p>${p.summary}</p>
</div></section>
<section class="section"><div class="wrap" style="max-width:52rem;">
  ${p.body.map(([h, b]) => `<article style="margin-bottom:2.4rem;"><h2 style="font-family:var(--ff-display); font-weight:700; font-size:clamp(1.5rem,2.8vw,2rem); letter-spacing:-0.01em; color:var(--ink); margin-bottom:0.8rem;">${h}</h2><p style="color:var(--ink-soft); font-size:1.08rem; line-height:1.7;">${b}</p></article>`).join('')}
  <hr style="border:0; border-top:1px solid var(--border); margin:3rem 0;">
  <p style="color:var(--ink-soft);">Have a specific HVAC question we didn't cover? <a href="contact.html" style="color:var(--blue); font-weight:600;">Email us</a> or call <a href="tel:${BRAND.phoneHref}" style="color:var(--blue); font-weight:600;">${BRAND.phone}</a> — a Valley View technician will get back to you.</p>
  <div style="margin-top:2rem; display:flex; gap:0.8rem; flex-wrap:wrap;"><a href="estimator.html" class="btn btn-primary">Get an estimate</a><a href="blog.html" class="btn">← Back to all articles</a></div>
</div></section>
${footer()}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

/* ---------- Request consultation (form-heavy) ---------- */
function renderRequestConsultation() {
  const title = 'Request a Consultation — Valley View HVAC | Salem, OR';
  const description = 'Schedule a free in-home HVAC consultation in Salem, Keizer, Albany, McMinnville, or the mid-Willamette. Load calculation, equipment recommendation, rebate review — no obligation.';
  return `<!DOCTYPE html><html lang="en"><head>
${head({ title, description, slug: 'request-consultation' })}
${schemaLocalBusiness()}
</head><body>
${discountBanner()}
${nav('request-consultation')}
<section class="page-hero"><div class="wrap">
  <span class="pill"><span class="dot"></span>Free in-home consultation</span>
  <h1>Request a <span class="blue">consultation.</span></h1>
  <p>Schedule a free in-home HVAC consultation. We'll run a Manual-J load calculation, review your existing equipment, itemize available rebates, and send you a proposal within the week. No pressure, no obligation.</p>
</div></section>
<section class="section"><div class="wrap" style="max-width:64rem;">
  <form class="est-host" data-demo>
    <span class="kicker">● Consultation request</span>
    <h2>Tell us about your project.</h2>
    <p class="sub">We'll get in touch within one business day to schedule the walk-through.</p>
    <div class="est-row">
      <div class="est-field"><label>Name</label><input name="name" required placeholder="Alex Johnson" /></div>
      <div class="est-field"><label>Phone</label><input name="phone" type="tel" required placeholder="971-555-1234" /></div>
    </div>
    <div class="est-row">
      <div class="est-field"><label>Email</label><input name="email" type="email" required placeholder="you@example.com" /></div>
      <div class="est-field"><label>Street address</label><input name="street" required placeholder="123 Main St" autocomplete="street-address" /></div>
    </div>
    <div class="est-row">
      <div class="est-field"><label>City</label><input name="city" required placeholder="Salem" autocomplete="address-level2" /></div>
      <div class="est-field"><label>State</label><input name="state" required placeholder="OR" maxlength="2" value="OR" /></div>
    </div>
    <div class="est-row">
      <div class="est-field"><label>ZIP</label><input name="zip" inputmode="numeric" maxlength="5" required placeholder="97301" /></div>
      <div class="est-field"><label>Property type</label><select name="property"><option>Residential — single family</option><option>Residential — multi-family</option><option>Commercial — office</option><option>Commercial — restaurant</option><option>Commercial — retail</option><option>Commercial — other</option></select></div>
    </div>
    <div class="est-row">
      <div class="est-field"><label>What are you considering?</label><select name="scope"><option>AC installation</option><option>Furnace installation</option><option>Heat pump retrofit</option><option>Ductless mini-split</option><option>Complete HVAC replacement</option><option>Maintenance plan</option><option>Repair / diagnostic</option><option>Commercial project</option></select></div>
      <div class="est-field"><label>Timing</label><select name="timing"><option>Planning ahead</option><option>This month</option><option>ASAP / urgent</option></select></div>
    </div>
    <div class="est-row full">
      <div class="est-field"><label>Tell us about the project</label><textarea name="notes" rows="4" placeholder="Current system age, specific issues, rebate interests, budget range — anything that helps us prep for the walk-through."></textarea></div>
    </div>
    <div class="est-actions">
      <button type="submit" class="btn btn-primary">Submit request <span class="arrow">→</span></button>
      <a href="tel:${BRAND.phoneHref}" class="btn">Or call ${BRAND.phone}</a>
    </div>
    <p class="demo-confirm est-disclaimer" style="opacity:0; transition:opacity 0.4s; margin-top:1rem;"></p>
  </form>

  <div class="feature-grid stagger" style="margin-top:3rem;">
    <div class="feature"><div class="ico">📋</div><h3>What to expect</h3><p>A Valley View technician will call within one business day to schedule the walk-through at a time that works for you.</p></div>
    <div class="feature"><div class="ico">🧮</div><h3>At the walk-through</h3><p>Manual-J load calculation, existing equipment assessment, equipment tier options with itemized rebates and financing.</p></div>
    <div class="feature"><div class="ico">🛡️</div><h3>After</h3><p>Detailed written proposal within the week. Every install backed by 10-year equipment / 2-year workmanship warranty.</p></div>
  </div>
</div></section>
${footer()}<script src="animations.js" defer></script><script>document.getElementById('year').textContent=new Date().getFullYear();</script></body></html>`;
}

/* ---------- Sitemap + robots ---------- */
function renderSitemap() {
  const pages = [
    '', 'services', 'estimator', 'gallery', 'about', 'contact', 'areas',
    'faqs', 'reviews', 'blog', 'request-consultation',
    ...SERVICES.map(s => s.slug),
    ...BLOG_POSTS.map(p => p.slug),
    ...CITIES.map(c => `furnace-repairs-${c.slug}`),
    ...CITIES.map(c => `local-hvac-${c.slug}`),
    // original city pages from the areas build
    'salem','keizer','albany','dallas','mcminnville','molalla','stayton','independence','woodburn','monmouth'
  ];
  const today = new Date().toISOString().slice(0,10);
  const urls = [...new Set(pages)].map(p => {
    const loc = BRAND.site + '/' + p;
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${p === '' ? '1.0' : '0.7'}</priority></url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /${BRAND.slug}/
Sitemap: ${BRAND.site}/sitemap.xml
`;
}

/* ---------- Execute ---------- */

// Service pages
SERVICES.forEach(s => {
  fs.writeFileSync(path.join(DIR, `${s.slug}.html`), renderService(s));
  console.log('wrote', s.slug + '.html');
});

// Geo landing pages — furnace + local-hvac variants × 30 cities
CITIES.forEach(city => {
  fs.writeFileSync(path.join(DIR, `furnace-repairs-${city.slug}.html`), renderGeoPage({ city, kind: 'furnace' }));
  fs.writeFileSync(path.join(DIR, `local-hvac-${city.slug}.html`), renderGeoPage({ city, kind: 'local-hvac' }));
});
console.log('wrote', CITIES.length * 2, 'geo pages');

// Utility pages
fs.writeFileSync(path.join(DIR, 'faqs.html'), renderFAQ());
fs.writeFileSync(path.join(DIR, 'reviews.html'), renderReviews());
fs.writeFileSync(path.join(DIR, 'blog.html'), renderBlogHub());
fs.writeFileSync(path.join(DIR, 'request-consultation.html'), renderRequestConsultation());
BLOG_POSTS.forEach(p => {
  fs.writeFileSync(path.join(DIR, `${p.slug}.html`), renderBlogPost(p));
});

// Sitemap + robots
fs.writeFileSync(path.join(DIR, 'sitemap.xml'), renderSitemap());
fs.writeFileSync(path.join(DIR, 'robots.txt'), renderRobots());

console.log('\nDone.');
