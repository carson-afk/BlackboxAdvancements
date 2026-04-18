#!/usr/bin/env python3
"""Regenerate the 10 area subpages for the v2 (navy) Wolf Pack site.
Run: python3 _build_areas.py
"""
from pathlib import Path

HERE = Path(__file__).parent

AREAS = [
    {
        "slug": "salem", "name": "Salem", "county": "Marion", "zip": "97301",
        "bigword": "SALEM", "response": "25–35",
        "blurb": "Salem's mix of historic and post-war homes means we see everything from cast-iron drains to new polybutylene failures. Whether it's a backed-up main on a Tuesday night or a scheduled water-heater swap, the same crew answers and shows up.",
        "hero": "water-heater-2.png",
        "cards": [
            ("Drain", "Drain Cleaning", "Salem mainline + fixture drain clearing, camera inspection included, 30-day no-clog guarantee."),
            ("Water Heater", "Water Heater", "Tank, tankless, and heat-pump installs for Salem homes. Same-day diagnosis, 6-year warranty."),
            ("Emergency", "24/7 Emergency", "Burst lines, back-ups, failing shut-offs. Salem dispatch runs 24/7 — we pick up when the other guys won't."),
        ],
        "gallery": [("shower-hero.png", "Shower Finish"), ("water-heater-1.png", "Tankless Install"), ("under-sink-plumbing.png", "Leak Diagnostic")],
    },
    {
        "slug": "keizer", "name": "Keizer", "county": "Marion", "zip": "97303",
        "bigword": "KEIZER", "response": "20–30",
        "blurb": "Keizer's 70s and 80s development era means we see a lot of end-of-life water heaters, original supply lines, and main-line tree-root invasions. We handle them all with the same flat-rate, warrantied approach.",
        "hero": "water-heater-1.png",
        "cards": [
            ("Drain", "Root Removal", "Keizer's mature trees mean root-invaded mainlines. Hydro-jet plus camera, 30-day no-clog guarantee."),
            ("Repipe", "Supply-Line Repipe", "Replacing original galvanized and polybutylene supply lines with PEX or copper."),
            ("Water Heater", "Water Heater Swap", "Same-day diagnosis, install, and haul-away. 6-year warranty on every unit."),
        ],
        "gallery": [("water-heater-1.png", "Heater Swap"), ("camera-inspection.png", "Camera Run"), ("faucet.png", "Fixture Swap")],
    },
    {
        "slug": "woodburn", "name": "Woodburn", "county": "Marion", "zip": "97071",
        "bigword": "WOODBURN", "response": "30–40",
        "blurb": "Woodburn spans orchards, farms, and solid residential — well pumps, pressure tanks, and rural service live alongside typical home plumbing. One local crew, whatever the property.",
        "hero": "underground-pipe.png",
        "cards": [
            ("Well", "Well &amp; Pressure Tank", "Pump service, pressure-tank swaps, and whole-home filtration for Woodburn rural properties."),
            ("Main Line", "Main Line Work", "Trenchless service line pulls, PEX repipes, and underground utility coordination."),
            ("Emergency", "Night Calls", "Woodburn gets 24/7 dispatch same as Salem — no rural penalty on response time."),
        ],
        "gallery": [("underground-pipe.png", "Main Line"), ("water-filter.png", "Water Filter"), ("water-heater-2.png", "Heater")],
    },
    {
        "slug": "silverton", "name": "Silverton", "county": "Marion", "zip": "97381",
        "bigword": "SILVERTON", "response": "30–40",
        "blurb": "Silverton's historic downtown and newer hillside builds get the same full Wolf Pack service. We're careful with old-home retrofits — no ripping walls out unnecessarily, and we match finishes where it matters.",
        "hero": "finished-sink.png",
        "cards": [
            ("Fixtures", "Fixture Install", "Faucets, toilets, disposals — brand-agnostic, flat-rate, clean install, no upsell."),
            ("Leak", "Historic Home Leaks", "Acoustic and thermal leak locate. Minimal-damage repair on older Silverton plaster."),
            ("Remodel", "Bath Remodel", "Tub-to-shower conversions, vanity relocates, permitted and inspected."),
        ],
        "gallery": [("finished-sink.png", "Sink Finish"), ("shower-hero.png", "Shower Trim"), ("faucet.png", "Fixture")],
    },
    {
        "slug": "stayton", "name": "Stayton", "county": "Marion", "zip": "97383",
        "bigword": "STAYTON", "response": "35–45",
        "blurb": "Stayton rural properties run on wells with septic tie-ins, and many still have galvanized supply lines from the 60s and 70s. Straightforward work for us — we know the quirks of your area.",
        "hero": "water-filter.png",
        "cards": [
            ("Well", "Well &amp; Filter", "Pressure-tank swaps, whole-home filtration, iron and sulfur treatment."),
            ("Repipe", "Galvanized Retrofit", "Replacing old galvanized supply lines with PEX — full-home or partial."),
            ("Emergency", "Rural Dispatch", "Same 24/7 coverage, same flat rate, even out past town."),
        ],
        "gallery": [("water-filter.png", "Filter Install"), ("underground-pipe.png", "Repipe"), ("under-sink-1.png", "Supply Lines")],
    },
    {
        "slug": "turner", "name": "Turner", "county": "Marion", "zip": "97392",
        "bigword": "TURNER", "response": "35–45",
        "blurb": "Turner is small-town territory with tight communities — one referral leads to five. We've become the default plumber out here for a reason: we show up, flat-rate, and stand behind our work.",
        "hero": "faucet.png",
        "cards": [
            ("Drain", "Drain &amp; Sewer", "Mainline camera, hydro-jet, 30-day no-clog. Turner-priced, Salem-quality."),
            ("Fixtures", "Fixture Work", "Faucets, toilets, disposals, ice-maker and dishwasher lines — install what you buy."),
            ("Emergency", "Neighbor-Answered", "We pick up. Always. Small-town plumbing on 24/7 dispatch."),
        ],
        "gallery": [("faucet.png", "Faucet"), ("toilet-1.png", "Toilet Set"), ("under-sink-plumbing.png", "Leak Repair")],
    },
    {
        "slug": "monmouth", "name": "Monmouth", "county": "Polk", "zip": "97361",
        "bigword": "MONMOUTH", "response": "35–45",
        "blurb": "Monmouth's college-town rental stock drives constant turnover plumbing — faucet swaps, toilet rebuilds, disposal replacements, angle-stop retrofits. Property managers love our monthly invoicing and tenant-friendly scheduling.",
        "hero": "toilet-1.png",
        "cards": [
            ("Rental", "Rental Turnover", "Fixture swaps, leak checks, pressure tests — done between tenants, invoiced monthly."),
            ("PM Support", "PM Support", "Portfolio-level dispatch, one-number escalation, tenant-friendly windows."),
            ("Fixtures", "Fast Fixture Work", "Faucets, toilets, disposals — flat-rate, install what the PM specs."),
        ],
        "gallery": [("toilet-1.png", "Toilet Set"), ("faucet.png", "Faucet"), ("sink-3.png", "Sink Install")],
    },
    {
        "slug": "dallas", "name": "Dallas", "county": "Polk", "zip": "97338",
        "bigword": "DALLAS", "response": "35–50",
        "blurb": "Dallas properties tend toward larger lots with irrigation systems, backflow preventers, and outdoor hose-bib clusters — we service the whole spread, not just what's inside the walls.",
        "hero": "under-sink-plumbing.png",
        "cards": [
            ("Irrigation", "Backflow &amp; Irrigation", "RPZ backflow certification, hose-bib retrofit, outdoor service line work."),
            ("Main Line", "Service Line", "Large-lot main-line pulls, leak locate, trenchless where qualifying."),
            ("Leak", "Leak Detection", "Acoustic and thermal, even on larger Dallas homes with complex layouts."),
        ],
        "gallery": [("under-sink-plumbing.png", "Leak Diagnostic"), ("underground-pipe.png", "Main Line"), ("pipe-locating.png", "Pipe Locate")],
    },
    {
        "slug": "independence", "name": "Independence", "county": "Polk", "zip": "97351",
        "bigword": "INDEPENDENCE", "response": "35–50",
        "blurb": "Independence historic homes need careful, non-invasive leak work — right in our wheelhouse. Our acoustic and thermal approach means we find it first, then fix it clean.",
        "hero": "shower-1.png",
        "cards": [
            ("Leak", "Historic Leak Detection", "Acoustic and thermal imaging on 100-year walls. No drywall demolition."),
            ("Remodel", "Careful Retrofit", "Old-home plumbing upgrades done respectfully — match what's visible."),
            ("Fixtures", "Period Fixtures", "Vintage-look fixture installs plus plumbing that meets current code."),
        ],
        "gallery": [("shower-1.png", "Shower Valve"), ("finished-sink.png", "Sink Finish"), ("faucet.png", "Faucet")],
    },
    {
        "slug": "mount-angel", "name": "Mt. Angel", "county": "Marion", "zip": "97362",
        "bigword": "MT.·ANGEL", "response": "40–55",
        "blurb": "Mt. Angel heritage homes have 100+ years of layered plumbing retrofits — galvanized into copper into PEX, often all in the same house. We approach every fix with respect for the building.",
        "hero": "pipe-locating.png",
        "cards": [
            ("Pipe Locate", "Pipe Locate", "Tracing unknown plumbing runs through historic walls and basements."),
            ("Repipe", "Layered Retrofit", "Replacing mixed-era supply lines cleanly. Copper, PEX, HDPE."),
            ("Emergency", "Heritage Dispatch", "24/7 coverage out here too. Same crew, same response standards."),
        ],
        "gallery": [("pipe-locating.png", "Pipe Locate"), ("underground-pipe.png", "Repipe"), ("shower-hero.png", "Finish")],
    },
]

NAV_LINKS = """<a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="estimator.html">Estimator</a>
    <a href="gallery.html">Projects</a>
    <div class="nav-dropdown active">
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
    <a href="contact.html">Contact</a>"""

MOBILE = """<div class="mobile-menu">
  <a href="index.html">Home</a><a href="services.html">Services</a><a href="estimator.html">Estimator</a><a href="gallery.html">Projects</a>
  <details class="m-group" open><summary>Areas <span class="caret">▾</span></summary><div class="m-sub">
    <a href="salem.html">Salem</a><a href="keizer.html">Keizer</a><a href="woodburn.html">Woodburn</a><a href="silverton.html">Silverton</a><a href="stayton.html">Stayton</a><a href="turner.html">Turner</a><a href="monmouth.html">Monmouth</a><a href="dallas.html">Dallas</a><a href="independence.html">Independence</a><a href="mount-angel.html">Mt. Angel</a><a href="areas.html">All areas →</a>
  </div></details>
  <a href="about.html">About</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a>
  <a href="tel:+15038782523" class="btn btn-primary" style="margin-top:1.5rem;">(503) 878-2523</a>
</div>"""

FOOTER = """<footer class="foot">
  <div class="wrap foot-grid">
    <div><div class="brand"><span class="logo-mark"><img src="images/logo.png" alt="" /></span><span class="tm">WOLF PACK</span></div><p style="max-width:32ch;">Honest, neighborhood plumbers for Salem, Keizer, Woodburn and the mid-Willamette. OR CCB #244621.</p></div>
    <div><h5>Services</h5><ul><li><a href="services.html#drain">Drain cleaning</a></li><li><a href="services.html#heater">Water heaters</a></li><li><a href="services.html#leak">Leak detection</a></li></ul></div>
    <div><h5>Service Area</h5><ul><li><a href="areas.html">All areas</a></li><li><a href="salem.html">Salem</a> · <a href="keizer.html">Keizer</a> · <a href="woodburn.html">Woodburn</a></li><li><a href="silverton.html">Silverton</a> · <a href="stayton.html">Stayton</a></li></ul></div>
    <div><h5>Contact</h5><ul><li><a href="tel:+15038782523">(503) 878-2523</a></li><li><a href="mailto:joe@wolfpackplumbingservices.com">joe@wolfpackplumbingservices.com</a></li><li><a href="faq.html">FAQ</a></li></ul></div>
  </div>
  <div class="wrap foot-bottom"><span>© <span id="year"></span> Wolf Pack Plumbing · OR CCB #244621 · Licensed · Bonded · Insured</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div>
</footer>"""

FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">'


def build_page(area):
    cards_html = "\n    ".join([
        f'<article class="svc"><span class="n">{i+1:02d} · {tag}</span><h3>{h}</h3><p>{p}</p></article>'
        for i, (tag, h, p) in enumerate(area["cards"])
    ])
    gallery_html = "\n    ".join([
        f'<figure><img src="images/{img}" alt="" loading="lazy"><figcaption>{cap} <em>· {area["name"]}</em></figcaption></figure>'
        for img, cap in area["gallery"]
    ])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<base href="/wolfpackplumbingsecondoption/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plumber in {area['name']}, OR — Wolf Pack Plumbing</title>
<meta name="description" content="Licensed Wolf Pack plumber for {area['name']}, {area['county']} County. 24/7 emergency dispatch, flat-rate quotes, 6-year install warranty, 30-day no-clog guarantee. OR CCB #244621." />
<link rel="icon" href="images/logo.png" type="image/png" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{FONTS}
<link rel="stylesheet" href="styles.css" />
</head>
<body>

<header class="nav">
  <a href="index.html" class="nav-brand">
    <span class="logo-mark"><img src="images/logo.png" alt="Wolf Pack Plumbing logo" /></span>
    <span class="tm">WOLF PACK<small>plumbing · salem or</small></span>
  </a>
  <nav class="nav-links">
    {NAV_LINKS}
  </nav>
  <span class="nav-meta">24/7 dispatch</span>
  <a href="tel:+15038782523" class="nav-cta">(503) 878-2523 <span>→</span></a>
  <button class="mobile-toggle" aria-label="Menu">Menu</button>
</header>
{MOBILE}

<main>
<section class="page-hero" data-bigword="{area['bigword']}">
  <div class="wrap">
    <span class="eye">{area['county']} County · {area['zip']}</span>
    <h1>Wolf Pack in<br/><span class="red">{area['name']}.</span></h1>
    <p>{area['blurb']}</p>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eye">Your Local Plumber</span>
      <h2>Your {area['name']}<br/><span class="red">plumber, 24/7.</span></h2>
      <p>Dispatch averages <strong style="color:var(--bone);">{area['response']} minutes</strong> to {area['name']}. Flat-rate quotes before work, 6-year warranty on every install, and a 30-day no-clog guarantee on drain work.</p>
      <p>Whether it's a backed-up main on a Tuesday night or a scheduled water-heater swap, the same crew answers and shows up. Ask about our new-customer discount when you call.</p>
      <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">Get a Quote <span class="arrow">→</span></a><a href="tel:+15038782523" class="btn">(503) 878-2523</a></div>
    </div>
    <div class="split-photo reveal">
      <span class="sticker">Local Crew</span>
      <img src="images/{area['hero']}" alt="Wolf Pack work in {area['name']}" loading="lazy">
    </div>
  </div>
</section>

<div class="stripe-bar" aria-hidden="true"></div>

<section class="section">
  <div class="wrap">
    <header class="section-head reveal"><span class="eye">What We Do Here</span><h2>Common jobs<br/><span class="red">around {area['name']}.</span></h2></header>
    <div class="svc-grid stagger">
    {cards_html}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="section-head reveal"><span class="eye">Recent Work</span><h2>From our {area['name']}<br/><span class="red">field log.</span></h2></header>
    <div class="gallery reveal">
    {gallery_html}
    </div>
  </div>
</section>
</main>

<section class="cta"><div class="wrap"><h2>{area['name']} —<br/>your plumber.</h2><p>Wolf Pack runs every {area['name']} call under the same standards: flat-rate pricing, permit-pulled work, warranty-backed, and we actually answer the phone.</p><div class="hero-cta"><a href="tel:+15038782523" class="btn btn-primary">(503) 878-2523 <span class="arrow">→</span></a><a href="estimator.html" class="btn">Get a Quote <span class="arrow">→</span></a></div></div></section>

{FOOTER}

<div class="sticky-cta"><a href="tel:+15038782523">☎ (503) 878-2523</a><a href="estimator.html">Get a Quote →</a></div>

<script src="animations.js" defer></script>
</body>
</html>
"""


def main():
    for area in AREAS:
        path = HERE / f"{area['slug']}.html"
        path.write_text(build_page(area))
        print(f"wrote {path.name}")


if __name__ == "__main__":
    main()
