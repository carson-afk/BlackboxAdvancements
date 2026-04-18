#!/usr/bin/env python3
"""Regenerate the 10 area subpages for Wolf Pack Plumbing.
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
            ("DRAIN", "Drain Cleaning", "Salem mainline + fixture drain clearing, camera inspection included, 30-day no-clog guarantee."),
            ("HEATER", "Water Heater", "Tank, tankless, heat-pump installs for Salem homes. Same-day diagnosis, 6-yr warranty."),
            ("EMERGENCY", "24/7 Emergency", "Burst lines, back-ups, failing shut-offs. Salem dispatch runs 24/7 — we pick up when the other guys won't."),
        ],
        "gallery": [("shower-hero.png", "SHOWER FINISH"), ("water-heater-1.png", "TANKLESS"), ("under-sink-plumbing.png", "LEAK DIAG")],
    },
    {
        "slug": "keizer", "name": "Keizer", "county": "Marion", "zip": "97303",
        "bigword": "KEIZER", "response": "20–30",
        "blurb": "Keizer's 70s–80s development era means we see a lot of end-of-life water heaters, original supply lines, and main-line tree-root invasions. We handle them all with the same flat-rate, warrantied approach.",
        "hero": "water-heater-1.png",
        "cards": [
            ("DRAIN", "Root Removal", "Keizer's mature trees mean root-invaded mainlines. Hydro-jet + camera, 30-day no-clog."),
            ("REPIPE", "Supply-Line Repipe", "Replacing original galvanized + polybutylene supply lines with PEX or copper."),
            ("HEATER", "Water Heater Swap", "Same-day diagnosis, install, and haul-away. 6-year warranty on every unit."),
        ],
        "gallery": [("water-heater-1.png", "HEATER SWAP"), ("camera-inspection.png", "CAM RUN"), ("faucet.png", "FIXTURE SWAP")],
    },
    {
        "slug": "woodburn", "name": "Woodburn", "county": "Marion", "zip": "97071",
        "bigword": "WOODBURN", "response": "30–40",
        "blurb": "Woodburn spans orchards, farms, and solid residential — well pumps, pressure tanks, and rural service live alongside typical home plumbing. One crew, whatever the property.",
        "hero": "underground-pipe.png",
        "cards": [
            ("WELL", "Well &amp; Pressure Tank", "Pump service, pressure-tank swaps, whole-home filtration for Woodburn rural properties."),
            ("MAIN", "Main Line Work", "Trenchless service line pulls, PEX repipes, underground utility coordination."),
            ("EMERGENCY", "Night Calls", "Woodburn gets 24/7 dispatch same as Salem — no rural penalty on response."),
        ],
        "gallery": [("underground-pipe.png", "MAIN LINE"), ("water-filter.png", "WATER FILTER"), ("water-heater-2.png", "HEATER")],
    },
    {
        "slug": "silverton", "name": "Silverton", "county": "Marion", "zip": "97381",
        "bigword": "SILVERTON", "response": "30–40",
        "blurb": "Silverton's historic downtown and newer hillside builds get the same full Wolf Pack service. We're careful with old-home retrofits — no ripping walls out unnecessarily, and we match finishes where it matters.",
        "hero": "finished-sink.png",
        "cards": [
            ("FIXTURES", "Fixture Install", "Faucet, toilet, disposal — brand-agnostic, flat-rate, clean install."),
            ("LEAK", "Historic Home Leaks", "Acoustic + thermal leak locate. Minimal-damage repair on older Silverton plaster."),
            ("REMODEL", "Bath Remodel", "Tub-to-shower conversions, vanity relocates, permitted + inspected."),
        ],
        "gallery": [("finished-sink.png", "SINK FINISH"), ("shower-hero.png", "SHOWER TRIM"), ("faucet.png", "FIXTURE")],
    },
    {
        "slug": "stayton", "name": "Stayton", "county": "Marion", "zip": "97383",
        "bigword": "STAYTON", "response": "35–45",
        "blurb": "Stayton rural properties run on wells with septic tie-ins, and many still have galvanized supply lines from the 60s and 70s. Straightforward work for us — we know the quirks of your area.",
        "hero": "water-filter.png",
        "cards": [
            ("WELL", "Well &amp; Filter", "Pressure-tank swaps, whole-home filtration, iron/sulfur treatment."),
            ("REPIPE", "Galvanized Retrofit", "Replacing old galvanized supply lines with PEX — full-home or partial."),
            ("EMERGENCY", "Rural Dispatch", "Same 24/7 coverage, same flat rate, even out past town."),
        ],
        "gallery": [("water-filter.png", "FILTER INSTALL"), ("underground-pipe.png", "REPIPE"), ("under-sink-1.png", "SUPPLY")],
    },
    {
        "slug": "turner", "name": "Turner", "county": "Marion", "zip": "97392",
        "bigword": "TURNER", "response": "35–45",
        "blurb": "Turner is small-town territory with tight communities — one referral leads to five. We've become the default plumber out here for a reason: we show up, flat-rate, and stand behind the work.",
        "hero": "faucet.png",
        "cards": [
            ("DRAIN", "Drain &amp; Sewer", "Mainline camera, hydro-jet, 30-day no-clog. Turner-priced, Salem-quality."),
            ("FIXTURES", "Fixture Work", "Faucet, toilet, disposal, ice-maker &amp; dishwasher lines — install what you buy."),
            ("EMERGENCY", "Neighbor-Answered", "We pick up. Always. Small-town plumbing on 24/7 dispatch."),
        ],
        "gallery": [("faucet.png", "FAUCET"), ("toilet-1.png", "TOILET SET"), ("under-sink-plumbing.png", "LEAK REPAIR")],
    },
    {
        "slug": "monmouth", "name": "Monmouth", "county": "Polk", "zip": "97361",
        "bigword": "MONMOUTH", "response": "35–45",
        "blurb": "Monmouth's college-town rental stock drives constant turnover plumbing — faucet swaps, toilet rebuilds, disposal replacements, angle-stop retrofits. Property managers love our PM packages and tenant-friendly scheduling.",
        "hero": "toilet-1.png",
        "cards": [
            ("RENTAL", "Rental Turnover", "Fixture swaps, leak checks, pressure tests — done between tenants, invoiced monthly."),
            ("PM", "PM Support", "Portfolio-level dispatch, one-number escalation, tenant-friendly windows."),
            ("FIXTURES", "Fast Fixture Work", "Faucet, toilet, disposal — flat-rate, install what the PM specs."),
        ],
        "gallery": [("toilet-1.png", "TOILET SET"), ("faucet.png", "FAUCET"), ("sink-3.png", "SINK INSTALL")],
    },
    {
        "slug": "dallas", "name": "Dallas", "county": "Polk", "zip": "97338",
        "bigword": "DALLAS", "response": "35–50",
        "blurb": "Dallas properties tend toward larger lots with irrigation systems, backflow preventers, and outdoor hose-bib clusters — we service the whole spread, not just what's inside the walls.",
        "hero": "under-sink-plumbing.png",
        "cards": [
            ("IRRIGATION", "Backflow &amp; Irrigation", "RPZ backflow cert, hose-bib retrofit, outdoor service line work."),
            ("MAIN", "Service Line", "Large-lot main-line pulls, leak locate, trenchless where qualifying."),
            ("LEAK", "Leak Detection", "Acoustic + thermal, even on larger Dallas homes with complex layouts."),
        ],
        "gallery": [("under-sink-plumbing.png", "LEAK DIAG"), ("underground-pipe.png", "MAIN LINE"), ("pipe-locating.png", "LOCATE")],
    },
    {
        "slug": "independence", "name": "Independence", "county": "Polk", "zip": "97351",
        "bigword": "INDEPENDENCE", "response": "35–50",
        "blurb": "Independence historic homes need careful, non-invasive leak work — right in our wheelhouse. Our acoustic + thermal approach means we find it first, then fix it clean.",
        "hero": "shower-1.png",
        "cards": [
            ("LEAK", "Historic Leak Detection", "Acoustic + thermal imaging on 100-year walls. No drywall demolition."),
            ("REMODEL", "Careful Retrofit", "Old-home plumbing upgrades done respectfully — match what's visible."),
            ("FIXTURES", "Period Fixtures", "Vintage-look fixture installs + plumbing that meets current code."),
        ],
        "gallery": [("shower-1.png", "SHOWER VALVE"), ("finished-sink.png", "SINK FINISH"), ("faucet.png", "FAUCET")],
    },
    {
        "slug": "mount-angel", "name": "Mt. Angel", "county": "Marion", "zip": "97362",
        "bigword": "MT.·ANGEL", "response": "40–55",
        "blurb": "Mt. Angel heritage homes have 100+ years of layered plumbing retrofits — galvanized into copper into PEX, often all in the same house. We approach every fix with respect for the building.",
        "hero": "pipe-locating.png",
        "cards": [
            ("LOCATE", "Pipe Locate", "Tracing unknown plumbing runs through historic walls and basements."),
            ("REPIPE", "Layered Retrofit", "Replacing mixed-era supply lines cleanly. Copper, PEX, HDPE."),
            ("EMERGENCY", "Heritage Dispatch", "24/7 coverage out here too. Same crew, same response standards."),
        ],
        "gallery": [("pipe-locating.png", "PIPE LOCATE"), ("underground-pipe.png", "REPIPE"), ("shower-hero.png", "FINISH")],
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
    <div><div class="brand"><span class="logo-mark"><img src="images/logo.png" alt="" /></span><span class="tm">WOLF PACK</span></div><p style="max-width:32ch;">Straight-shooting plumbers for Salem, Keizer, Woodburn and the mid-Willamette. OR CCB #244621.</p></div>
    <div><h5>/ services</h5><ul><li><a href="services.html#drain">Drain cleaning</a></li><li><a href="services.html#heater">Water heaters</a></li><li><a href="services.html#leak">Leak detection</a></li></ul></div>
    <div><h5>/ service area</h5><ul><li><a href="areas.html">All areas</a></li><li><a href="salem.html">Salem</a> · <a href="keizer.html">Keizer</a> · <a href="woodburn.html">Woodburn</a></li><li><a href="silverton.html">Silverton</a> · <a href="stayton.html">Stayton</a></li></ul></div>
    <div><h5>/ contact</h5><ul><li><a href="tel:+15038782523">(503) 878-2523</a></li><li><a href="mailto:joe@wolfpackplumbingservices.com">joe@wolfpackplumbingservices.com</a></li><li><a href="faq.html">FAQ</a></li></ul></div>
  </div>
  <div class="wrap foot-bottom"><span>© <span id="year"></span> Wolf Pack Plumbing · OR CCB #244621 · Licensed · Bonded · Insured</span><span>Built by <a href="https://blackboxadvancements.com">Blackbox Advancements</a></span></div>
</footer>"""


def build_page(area):
    cards_html = "\n    ".join([
        f'<article class="svc"><span class="n">{i+1:02d} / {n}</span><h3>{h}</h3><p>{p}</p></article>'
        for i, (n, h, p) in enumerate(area["cards"])
    ])
    gallery_html = "\n    ".join([
        f'<figure><img src="images/{img}" alt="" loading="lazy"><figcaption>// {cap} · {area["name"].upper()}</figcaption></figure>'
        for img, cap in area["gallery"]
    ])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<base href="/wolfpackplumbing/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plumber in {area['name']}, OR — Wolf Pack Plumbing</title>
<meta name="description" content="Licensed Wolf Pack plumber for {area['name']}, {area['county']} County. 24/7 emergency dispatch, flat-rate quotes, 6-yr install warranty, 30-day no-clog guarantee. OR CCB #244621." />
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
    {NAV_LINKS}
  </nav>
  <span class="nav-meta">24/7 dispatch</span>
  <a href="tel:+15038782523" class="nav-cta">(503) 878-2523 <span>→</span></a>
  <button class="mobile-toggle" aria-label="Menu">/ menu</button>
</header>
{MOBILE}

<main>
<section class="page-hero" data-bigword="{area['bigword']}">
  <div class="wrap">
    <span class="eye">{area['county'].upper()} COUNTY · {area['zip']}</span>
    <h1>WOLF PACK IN<br/><span class="red">{area['name'].upper()}.</span></h1>
    <p>{area['blurb']}</p>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eye">LOCAL DISPATCH</span>
      <h2>YOUR {area['name'].upper()}<br/><span class="red">PLUMBER, 24/7.</span></h2>
      <p>Dispatch averages <strong style="color:var(--bone);">{area['response']} minutes</strong> to {area['name']}. Flat-rate quotes before work, 6-year warranty on every install, and a 30-day no-clog guarantee on drain work.</p>
      <p>Whether it's a backed-up main on a Tuesday night or a scheduled water-heater swap, the same crew answers and shows up. Ask about our new-customer discount when you call.</p>
      <div class="hero-cta"><a href="estimator.html" class="btn btn-primary">RUN ESTIMATOR <span class="arrow">→</span></a><a href="tel:+15038782523" class="btn">(503) 878-2523</a></div>
    </div>
    <div class="split-photo reveal">
      <span class="corner"></span><span class="corner br"></span>
      <img src="images/{area['hero']}" alt="Wolf Pack work in {area['name']}" loading="lazy">
    </div>
  </div>
</section>

<div class="stripe-bar" aria-hidden="true"></div>

<section class="section">
  <div class="wrap">
    <header class="section-head reveal"><span class="eye">{area['name'].upper()} JOB LIST</span><h2>COMMON JOBS<br/><span class="red">AROUND HERE.</span></h2></header>
    <div class="svc-grid stagger">
    {cards_html}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <header class="section-head reveal"><span class="eye">{area['name'].upper()} FIELD LOG</span><h2>RECENT WORK<br/><span class="red">{area['name'].upper()}.</span></h2></header>
    <div class="gallery reveal">
    {gallery_html}
    </div>
  </div>
</section>
</main>

<section class="cta"><div class="wrap"><h2>{area['name'].upper()} —<br/>YOUR PLUMBER.</h2><p>Wolf Pack runs every {area['name']} call under the same standards — flat-rate, permit-pulled, warranty-backed, no ghosting.</p><div class="hero-cta"><a href="tel:+15038782523" class="btn btn-primary">(503) 878-2523 <span class="arrow">→</span></a><a href="estimator.html" class="btn">ESTIMATOR <span class="arrow">→</span></a></div></div></section>

{FOOTER}

<div class="sticky-cta"><a href="tel:+15038782523">☎ (503) 878-2523</a><a href="estimator.html">Run Estimator →</a></div>

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
