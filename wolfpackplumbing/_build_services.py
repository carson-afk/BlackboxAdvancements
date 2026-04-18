#!/usr/bin/env python3
"""Build service detail pages + add Services dropdown to every nav.

Idempotent: running twice produces the same output as running once.
Mirrors the pattern used by _build_areas.py for city pages.
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).parent

# Service catalog — (slug, nav_label, nav_tagline, eye_big, title_top, title_red, description, bullets, photo, bigword)
SERVICES = [
    {
        "slug": "drain-cleaning",
        "nav": "Drain Cleaning",
        "tag": "Snake · Jet · Camera",
        "eye": "DRAIN SERVICE",
        "top": "DRAIN CLEANING",
        "red": "& HYDRO-JET.",
        "desc": "Kitchen, bath, laundry, floor drains, and main lines. Every mainline call includes a camera inspection — so we actually see what's in the pipe before we quote. Cleared drains are backed by our 30-day no-clog guarantee.",
        "bullets": [
            ("Snake + auger clearing", "For hair, grease, and kitchen fats."),
            ("High-pressure hydro-jet", "Roots, scale, heavy debris — stripped clean."),
            ("Sewer camera inspection", "Included on every mainline. Video sent to you."),
            ("30-day no-clog guarantee", "Backs up again? We come back free."),
        ],
        "photo": "camera-inspection.png",
        "bigword": "DRAIN",
        "jobs": [
            ("01 / MAINLINE", "Mainline Backups", "Camera-locate, jet, and cleared with a 30-day guarantee."),
            ("02 / KITCHEN", "Kitchen Drains", "Grease + fats cleared without tearing up cabinets."),
            ("03 / FLOOR", "Floor Drains & Cleanouts", "Basement and laundry backups — fast turnaround."),
        ],
    },
    {
        "slug": "water-heater",
        "nav": "Water Heater",
        "tag": "Tank · Tankless · Heat-Pump",
        "eye": "WATER HEATER",
        "top": "HEATERS IN.",
        "red": "HEATERS OUT.",
        "desc": "Tank, tankless, hybrid, heat-pump. Code-compliant venting, drain pan, seismic strap, expansion tank — done right the first time. Every install carries a 6-year warranty on parts and labor.",
        "bullets": [
            ("Rheem · Bradford White · Rinnai · Navien", "Brands we stock and stand behind."),
            ("Gas · electric · heat-pump", "Including hybrid and recirculating configs."),
            ("Same-day diagnosis", "Cold shower at 8am? Same-day fix or swap."),
            ("Old unit haul-away", "We take the old tank with us. No surprise dump fee."),
        ],
        "photo": "water-heater-1.png",
        "bigword": "HEATER",
        "jobs": [
            ("01 / TANK", "Tank Replacement", "40/50/75-gal swaps with code-compliant venting and strap."),
            ("02 / TANKLESS", "Tankless Install", "Rinnai + Navien — gas line sizing and recirc loop included."),
            ("03 / REPAIR", "Pilot / Anode / Element", "Diagnose before swap. Flat-rate quote either way."),
        ],
    },
    {
        "slug": "pipe-replacement",
        "nav": "Pipe Replacement",
        "tag": "Repipe · Locate · Trenchless",
        "eye": "PIPE WORK",
        "top": "LOCATE, PULL,",
        "red": "REPLACE.",
        "desc": "Partial repipe, service line pulls, leak locate with acoustic + tracer wire. Trenchless on qualifying runs — we skip the trench where we can. Permit pulled, utility pre-locate coordinated.",
        "bullets": [
            ("Copper · PEX · HDPE", "Right material for the job, not the truck's last roll."),
            ("Trenchless pull", "Driveway stays. Lawn stays. We pull the new line through."),
            ("Utility pre-locate", "811 coordination handled — no guessing underground."),
            ("Permit pull included", "We handle the paperwork and the inspection walk-through."),
        ],
        "photo": "underground-pipe.png",
        "bigword": "PIPE",
        "jobs": [
            ("01 / REPIPE", "Whole-Home Repipe", "PEX or copper, planned around your schedule, inspected."),
            ("02 / SERVICE LINE", "Service Line Pulls", "Meter-to-house replacement, trenchless where we can."),
            ("03 / LOCATE", "Tracer + Acoustic Locate", "Find the line before we break concrete."),
        ],
    },
    {
        "slug": "leak-detection",
        "nav": "Leak Detection",
        "tag": "Acoustic · Thermal · Slab",
        "eye": "LEAK DETECTION",
        "top": "FIND IT FIRST.",
        "red": "FIX IT CLEAN.",
        "desc": "Acoustic, thermal, and pressure testing. Slab leaks, wall leaks, hidden pinholes — located before we cut drywall. No exploratory demolition on our watch.",
        "bullets": [
            ("Acoustic + thermal imaging", "Pinpoint the leak without guessing."),
            ("Slab leak locate", "Under-slab runs found with tracer + acoustic."),
            ("Pressure testing", "Isolate systems to confirm the source."),
            ("Minimal-damage repair", "We cut where it is, not where it might be."),
        ],
        "photo": "under-sink-plumbing.png",
        "bigword": "LEAK",
        "jobs": [
            ("01 / SLAB", "Slab Leak Locate", "Under-concrete pinhole leaks found and isolated."),
            ("02 / WALL", "In-Wall Leak Diag", "Thermal + acoustic before any drywall cut."),
            ("03 / PRESSURE", "System Pressure Test", "Isolate supply vs. drain to confirm the real source."),
        ],
    },
    {
        "slug": "fixtures",
        "nav": "Fixtures",
        "tag": "Faucet · Toilet · Disposal",
        "eye": "FIXTURE SERVICE",
        "top": "SWAPS, SETS,",
        "red": "REBUILDS.",
        "desc": "Faucet leaks, running toilets, disposals, angle stops, shower valves, ice-maker lines. Brand-agnostic — install what you buy, flat-rate, no upsell to premium parts you didn't ask for.",
        "bullets": [
            ("Faucet + shower valves", "Cartridge, stem, full body — rebuild or swap."),
            ("Toilet set / rebuild", "Wax ring, flange repair, flush assembly rebuilds."),
            ("Disposal install", "InSinkErator, Waste King, Moen — you pick, we install."),
            ("Ice-maker + dishwasher lines", "PEX or braided stainless, shut-off included."),
        ],
        "photo": "faucet.png",
        "bigword": "FIXTURES",
        "jobs": [
            ("01 / FAUCET", "Faucet Swap + Valve", "Kitchen, bath, laundry — install what you bought."),
            ("02 / TOILET", "Toilet Set + Rebuild", "New set, flange repair, or full rebuild."),
            ("03 / DISPOSAL", "Garbage Disposal", "Swap in 60 minutes, brand-agnostic."),
        ],
    },
    {
        "slug": "emergency-plumbing",
        "nav": "Emergency",
        "tag": "24/7 · ~35 min Dispatch",
        "eye": "EMERGENCY LINE",
        "top": "2AM ON A HOLIDAY —",
        "red": "WE ANSWER.",
        "desc": "24/7 dispatch. Burst pipes, mainline back-ups, failing shut-offs, no-hot-water Christmas mornings. A real human answers the phone — not a voicemail loop — and dispatch averages 35 minutes in the Salem metro.",
        "bullets": [
            ("~35 min average dispatch", "In Salem, Keizer, Woodburn. Farther = longer, we'll quote."),
            ("Main shut-off coaching by phone", "We'll talk you through stopping the water before we get there."),
            ("Same-night stabilization", "If we can't fix it tonight, we'll make it safe tonight."),
            ("Flat-rate on arrival", "Price before work. No hourly surprises at 3am."),
        ],
        "photo": "toilet-mechanics.png",
        "bigword": "24/7",
        "jobs": [
            ("01 / BURST", "Burst Pipe / Flood", "Kill the water, stabilize, repair. Same night."),
            ("02 / BACK-UP", "Mainline Back-Up", "Jet or snake — get your drains running before sunrise."),
            ("03 / NO HOT", "No Hot Water Call", "Pilot, element, or full swap — diagnosed in one visit."),
        ],
    },
    {
        "slug": "remodel",
        "nav": "Remodel",
        "tag": "Kitchen · Bath · Shower",
        "eye": "REMODEL PLUMBING",
        "top": "ROUGH-IN",
        "red": "& FINISH.",
        "desc": "Kitchen and bath rough-in plus finish plumbing, coordinated with your GC — or ours. Permitted, inspected, on schedule. Tub-to-shower conversions a specialty.",
        "bullets": [
            ("Full rough-in packages", "Supply + DWV laid per plan, ready for inspection."),
            ("Vanity + shower valve relocate", "New layout? We move the lines."),
            ("Tub-to-shower conversion", "Curbless, linear drain, code-compliant."),
            ("GC coordination", "Or we bring our own crew — your call."),
        ],
        "photo": "finished-sink.png",
        "bigword": "REMODEL",
        "jobs": [
            ("01 / KITCHEN", "Kitchen Rough-In", "Sink, dishwasher, pot-filler, ice-maker — all planned."),
            ("02 / BATH", "Bath Rough + Finish", "Vanity, tub, shower, toilet — rough to trim."),
            ("03 / SHOWER", "Tub-to-Shower Conversion", "Curbless, linear drain, waterproofed, permitted."),
        ],
    },
    {
        "slug": "property-management",
        "nav": "Property Mgmt",
        "tag": "Rentals · Turnover · PMs",
        "eye": "PROPERTY SUPPORT",
        "top": "LANDLORDS &",
        "red": "PROPERTY MGRS.",
        "desc": "Direct line for PMs and landlords. Rental turnover, scheduled maintenance, emergency escalation, and portfolio-friendly billing. Tenant-friendly scheduling so you're not the bad guy.",
        "bullets": [
            ("Turn-over checks", "Full supply + drain walkthrough between tenants."),
            ("Scheduled PM packages", "Quarterly or semi-annual, flat-rate by unit."),
            ("Portfolio invoicing", "One monthly statement across all your units."),
            ("Tenant-friendly scheduling", "We coordinate with tenants — you don't chase it."),
        ],
        "photo": "shower-1.png",
        "bigword": "PM",
        "jobs": [
            ("01 / TURN-OVER", "Rental Turn Check", "Between-tenant inspection + small-fix bundle."),
            ("02 / PM PACK", "Scheduled Maintenance", "Quarterly walk per unit, flat-rate, predictable."),
            ("03 / EMERGENCY", "Portfolio Emergency Line", "PMs get a direct dispatch line. No queue."),
        ],
    },
    {
        "slug": "water-filtration",
        "nav": "Water Filtration",
        "tag": "Filters · Softeners · RO",
        "eye": "WATER QUALITY",
        "top": "CLEAN WATER,",
        "red": "SIZED RIGHT.",
        "desc": "Whole-home filters, softeners, under-sink RO, and iron/sulfur treatment. Sized to your supply and tested after install — we don't guess based on square footage.",
        "bullets": [
            ("Whole-home filtration", "Chlorine, chloramine, sediment — picked for your water."),
            ("Water softeners", "Well-water hardness cured. Salt-based and salt-free options."),
            ("Under-sink RO systems", "Dedicated faucet or tied to the fridge and ice-maker."),
            ("Well-pump + pressure-tank service", "Pressure switch, bladder, controls — we service the whole system."),
        ],
        "photo": "water-filter.png",
        "bigword": "FILTER",
        "jobs": [
            ("01 / WHOLE-HOME", "Whole-Home Filter", "Sediment + carbon + UV where needed."),
            ("02 / SOFTENER", "Softener Install", "Hardness test first, then the right resin count."),
            ("03 / RO", "Under-Sink RO", "Dedicated faucet or fridge-tied, 4-stage standard."),
        ],
    },
]


def nav_dropdown_html() -> str:
    items = "\n        ".join(
        f'<a href="{s["slug"]}.html"><span class="city">{s["nav"]}</span><span class="county">{s["tag"]}</span></a>'
        for s in SERVICES
    )
    return f"""<div class="nav-dropdown" data-services>
      <a href="services.html">Services <span class="caret">▾</span></a>
      <div class="menu">
        {items}
        <a href="services.html" class="more"><span>All services</span><span>→</span></a>
      </div>
    </div>"""


def mobile_services_html() -> str:
    items = "".join(
        f'<a href="{s["slug"]}.html">{s["nav"]}</a>'
        for s in SERVICES
    )
    return f"""<details class="m-group" data-services><summary>Services <span class="caret">▾</span></summary><div class="m-sub">{items}<a href="services.html">All services →</a></div></details>"""


def update_nav(html: str, current_slug: str | None) -> str:
    """Replace a simple <a href="services.html">Services</a> (possibly with active class) with the dropdown.
    If the dropdown is already there (data-services), refresh its contents."""
    dropdown = nav_dropdown_html()

    # If dropdown already present, replace the whole block.
    new_html, n = re.subn(
        r'<div class="nav-dropdown"[^>]*data-services[^>]*>.*?</div>\s*</div>',
        dropdown,
        html,
        count=1,
        flags=re.DOTALL,
    )
    if n == 0:
        # First run — replace the plain nav link.
        new_html, n = re.subn(
            r'<a href="services\.html"(?:\s+class="active")?>Services</a>',
            dropdown,
            html,
            count=1,
        )

    # Mark active if current page is services.html or a service detail page.
    service_slugs = {s["slug"] for s in SERVICES}
    if current_slug == "services" or current_slug in service_slugs:
        new_html = new_html.replace(
            '<div class="nav-dropdown" data-services>',
            '<div class="nav-dropdown active" data-services>',
            1,
        )

    # Mobile menu — replace a bare services link OR an existing services m-group.
    mobile = mobile_services_html()
    # Existing services m-group (from a prior run)
    new_html, mn = re.subn(
        r'<details class="m-group"[^>]*data-services[^>]*>.*?</details>',
        mobile,
        new_html,
        count=1,
        flags=re.DOTALL,
    )
    if mn == 0:
        # Plain <a href="services.html">Services</a> inside mobile-menu
        new_html = re.sub(
            r'<a href="services\.html">Services</a>',
            mobile,
            new_html,
            count=1,
        )

    # Mark mobile services group open on the services/detail pages
    if current_slug == "services" or current_slug in service_slugs:
        new_html = new_html.replace(
            '<details class="m-group" data-services>',
            '<details class="m-group" data-services open>',
            1,
        )
    return new_html


def service_page_html(s: dict) -> str:
    bullets = "".join(
        f'<li><strong>{b[0]}</strong><br/><span class="muted">{b[1]}</span></li>'
        for b in s["bullets"]
    )
    jobs = "".join(
        f'<article class="svc"><span class="n">{j[0]}</span><h3>{j[1]}</h3><p>{j[2]}</p></article>'
        for j in s["jobs"]
    )
    title = f'{s["nav"]} — Wolf Pack Plumbing · Salem OR'
    meta_desc = s["desc"].replace('"', "&quot;")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<base href="/wolfpackplumbing/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{meta_desc} Licensed Salem OR plumber. OR CCB #244621." />
<link rel="icon" href="images/logo.png" type="image/png" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css" />
</head>
<body>

<header class="nav">
  <a href="index.html" class="nav-brand">
    <span class="logo-mark"><img src="images/logo.png" alt="Wolf Pack Plumbing logo" /></span>
    <span class="tm">WOLF PACK<small>plumbing · salem or</small></span>
  </a>
  <nav class="nav-links">
    <a href="index.html">Home</a>
    __NAV_SERVICES__
    <a href="estimator.html">Estimator</a>
    <a href="gallery.html">Projects</a>
    <div class="nav-dropdown">
      <a href="areas.html">Areas <span class="caret">▾</span></a>
      <div class="menu">
        <a href="salem.html"><span class="city">Salem</span><span class="county">Marion · 97301</span></a>
        <a href="keizer.html"><span class="city">Keizer</span><span class="county">Marion · 97303</span></a>
        <a href="woodburn.html"><span class="city">Woodburn</span><span class="county">Marion · 97071</span></a>
        <a href="silverton.html"><span class="city">Silverton</span><span class="county">Marion · 97381</span></a>
        <a href="stayton.html"><span class="city">Stayton</span><span class="county">Marion · 97383</span></a>
        <a href="turner.html"><span class="city">Turner</span><span class="county">Marion · 97392</span></a>
        <a href="monmouth.html"><span class="city">Monmouth</span><span class="county">Polk · 97361</span></a>
        <a href="dallas.html"><span class="city">Dallas</span><span class="county">Polk · 97338</span></a>
        <a href="independence.html"><span class="city">Independence</span><span class="county">Polk · 97351</span></a>
        <a href="mount-angel.html"><span class="city">Mt. Angel</span><span class="county">Marion · 97362</span></a>
        <a href="areas.html" class="more"><span>All coverage areas</span><span>→</span></a>
      </div>
    </div>
    <a href="about.html">About</a>
    <a href="faq.html">FAQ</a>
    <a href="contact.html">Contact</a>
  </nav>
  <span class="nav-meta">24/7 dispatch</span>
  <a href="tel:+15038782523" class="nav-cta">(503) 878-2523 <span>→</span></a>
  <button class="mobile-toggle" aria-label="Menu">/ menu</button>
</header>
<div class="mobile-menu">
  <a href="index.html">Home</a>__MOBILE_SERVICES__<a href="estimator.html">Estimator</a><a href="gallery.html">Projects</a>
  <details class="m-group"><summary>Areas <span class="caret">▾</span></summary><div class="m-sub">
    <a href="salem.html">Salem</a><a href="keizer.html">Keizer</a><a href="woodburn.html">Woodburn</a><a href="silverton.html">Silverton</a><a href="stayton.html">Stayton</a><a href="turner.html">Turner</a><a href="monmouth.html">Monmouth</a><a href="dallas.html">Dallas</a><a href="independence.html">Independence</a><a href="mount-angel.html">Mt. Angel</a><a href="areas.html">All areas →</a>
  </div></details>
  <a href="about.html">About</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a>
  <a href="tel:+15038782523" class="btn btn-primary" style="margin-top:1.5rem;">(503) 878-2523</a>
</div>

<main>
<section class="page-hero" data-bigword="{s['bigword']}">
  <div class="wrap">
    <span class="eye">{s['eye']}</span>
    <h1>{s['top']}<br/><span class="red">{s['red']}</span></h1>
    <p>{s['desc']}</p>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eye">WHAT'S INCLUDED</span>
      <h2>FLAT-RATE.<br/><span class="red">NO MYSTERY PRICING.</span></h2>
      <p>Price before work. 6-year warranty on every install. 30-day no-clog guarantee on drain work. Wisetack financing available on most jobs.</p>
      <ul style="margin-top: 1.2rem; display: grid; gap: 1rem;">{bullets}</ul>
      <div class="hero-cta" style="margin-top: 1.5rem;"><a href="estimator.html" class="btn btn-primary">RUN ESTIMATOR <span class="arrow">→</span></a><a href="tel:+15038782523" class="btn">(503) 878-2523</a></div>
    </div>
    <div class="split-photo reveal">
      <span class="corner"></span><span class="corner br"></span>
      <img src="images/{s['photo']}" alt="Wolf Pack {s['nav']} work" loading="lazy">
    </div>
  </div>
</section>

<div class="stripe-bar" aria-hidden="true"></div>

<section class="section">
  <div class="wrap">
    <header class="section-head reveal"><span class="eye">COMMON CALLS</span><h2>WHAT WE RUN<br/><span class="red">MOST OFTEN.</span></h2></header>
    <div class="svc-grid stagger">{jobs}</div>
  </div>
</section>

<section class="section" style="padding:3rem 0;">
  <div class="wrap">
    <div class="guarantee reveal">
      <div class="g"><span class="n">/ OPTION 1</span><h4>FLAT-RATE</h4><p>Price before work. No hourly surprises.</p></div>
      <div class="g"><span class="n">/ OPTION 2</span><h4>WISETACK FINANCING</h4><p>Pay over time, soft credit check, instant approval.</p></div>
      <div class="g"><span class="n">/ OPTION 3</span><h4>6-YR WARRANTY</h4><p>Install covered end-to-end. Parts + labor.</p></div>
      <div class="g"><span class="n">/ OPTION 4</span><h4>NO-CLOG / 30-DAY</h4><p>Drain backs up within 30 days? We come back free.</p></div>
    </div>
  </div>
</section>
</main>

<section class="cta">
  <div class="wrap">
    <h2>NEED A<br/>{s['nav'].upper()} CALL?</h2>
    <p>Flat-rate quote before work. 24/7 dispatch. CCB #244621. Describe the problem and we'll tell you what it is, roughly what it costs, and whether it's urgent.</p>
    <div class="hero-cta">
      <a href="estimator.html" class="btn btn-primary">RUN ESTIMATOR <span class="arrow">→</span></a>
      <a href="tel:+15038782523" class="btn">(503) 878-2523 <span class="arrow">→</span></a>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="wrap foot-grid">
    <div><div class="brand"><span class="logo-mark"><img src="images/logo.png" alt="" /></span><span class="tm">WOLF PACK</span></div><p style="max-width:32ch;">Straight-shooting plumbers for Salem, Keizer, Woodburn and the mid-Willamette. OR CCB #244621.</p></div>
    <div><h5>/ services</h5><ul><li><a href="drain-cleaning.html">Drain cleaning</a></li><li><a href="water-heater.html">Water heaters</a></li><li><a href="leak-detection.html">Leak detection</a></li><li><a href="pipe-replacement.html">Pipe replacement</a></li></ul></div>
    <div><h5>/ service area</h5><ul><li><a href="salem.html">Salem</a> · <a href="keizer.html">Keizer</a></li><li><a href="woodburn.html">Woodburn</a> · <a href="silverton.html">Silverton</a></li><li><a href="areas.html">All coverage →</a></li></ul></div>
    <div><h5>/ contact</h5><ul><li><a href="tel:+15038782523">(503) 878-2523</a></li><li><a href="mailto:joe@wolfpackplumbingservices.com">joe@wolfpack<wbr/>plumbingservices.com</a></li><li><a href="faq.html">FAQ</a></li></ul></div>
  </div>
  <div class="wrap foot-bottom"><span>© <span id="year"></span> Wolf Pack Plumbing · OR CCB #244621 · Licensed · Bonded · Insured</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div>
</footer>

<div class="sticky-cta"><a href="tel:+15038782523">☎ (503) 878-2523</a><a href="estimator.html">Run Estimator →</a></div>

<script src="animations.js" defer></script>
</body>
</html>
"""


def linkify_services_page(html: str) -> str:
    """Wrap each .feature card on services.html in an <a> tag to its detail page.
    Each feature has id="<shortid>" matching a slug key.
    """
    id_to_slug = {
        "drain": "drain-cleaning",
        "heater": "water-heater",
        "pipe": "pipe-replacement",
        "leak": "leak-detection",
        "fixtures": "fixtures",
        "emergency": "emergency-plumbing",
    }
    # Extra features without id in the current services.html (remodel, property, water-quality)
    # — they are the 3 trailing <div class="feature"> blocks. We'll assign IDs + links to them after regex.

    # Wrap each <div class="feature" id="xxx"> ... </div> block in <a href="...">
    def repl(m: re.Match) -> str:
        fid = m.group(1)
        slug = id_to_slug.get(fid, fid)
        inner = m.group(2)
        return f'<a class="feature feature-link" id="{fid}" href="{slug}.html">{inner}</a>'

    html = re.sub(
        r'<div class="feature" id="([\w-]+)">(.*?)</div>\s*(?=<div class="feature"|\s*</div>\s*</div>\s*</section>)',
        repl,
        html,
        flags=re.DOTALL,
    )

    # Handle the three trailing <div class="feature"> blocks (no id)
    trailing = [
        ("remodel", "remodel"),
        ("property", "property-management"),
        ("water-quality", "water-filtration"),
    ]
    counter = {"i": 0}

    def trailing_repl(m: re.Match) -> str:
        i = counter["i"]
        if i >= len(trailing):
            return m.group(0)
        fid, slug = trailing[i]
        counter["i"] += 1
        return f'<a class="feature feature-link" id="{fid}" href="{slug}.html">{m.group(1)}</a>'

    html = re.sub(
        r'<div class="feature">(.*?)</div>\s*(?=<div class="feature"|\s*</div>\s*</div>\s*</section>)',
        trailing_repl,
        html,
        flags=re.DOTALL,
    )
    return html


def main() -> None:
    # 1. Write each service detail page
    for s in SERVICES:
        path = ROOT / f"{s['slug']}.html"
        base = service_page_html(s)
        html = base.replace("__NAV_SERVICES__", nav_dropdown_html()).replace(
            "__MOBILE_SERVICES__", mobile_services_html()
        )
        # mark active for current service
        html = html.replace(
            '<div class="nav-dropdown" data-services>',
            '<div class="nav-dropdown active" data-services>',
            1,
        )
        html = html.replace(
            '<details class="m-group" data-services>',
            '<details class="m-group" data-services open>',
            1,
        )
        path.write_text(html)
        print(f"wrote {path.name}")

    # 2. Update nav + mobile-menu on every existing .html file
    slugs = {s["slug"] for s in SERVICES}
    for path in sorted(ROOT.glob("*.html")):
        stem = path.stem
        if stem.startswith("_"):
            continue
        src = path.read_text()
        # Don't double-process service pages we just wrote
        out = update_nav(src, stem) if stem not in slugs else src

        # Wrap feature cards on services.html
        if stem == "services":
            out = linkify_services_page(out)

        if out != src:
            path.write_text(out)
            print(f"updated {path.name}")


if __name__ == "__main__":
    main()
