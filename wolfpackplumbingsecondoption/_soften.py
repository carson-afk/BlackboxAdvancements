#!/usr/bin/env python3
"""One-shot: strip computery phrasing from the v2 pages, swap fonts, warm captions.
Run from inside wolfpackplumbingsecondoption/.
"""
import re
from pathlib import Path

HERE = Path(__file__).parent

# --- font link swap (drop mono, add Inter + Caveat) ---
OLD_FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet">'
NEW_FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">'

# --- flat string replacements (careful: must be unique / safe to replace globally) ---
FLAT = [
    # Section headers (uppercase in source)
    ("CORE SERVICES", "OUR SERVICES"),
    ("OPERATIONS PROTOCOL", "OUR PROCESS"),
    ("FIELD REPORTS", "NEIGHBOR REVIEWS"),
    ("PROJECT ARCHIVE", "OUR RECENT WORK"),
    ("SERVICE AREAS", "WHERE WE SERVE"),
    ("PRIMARY COVERAGE", "OUR SERVICE AREA"),
    ("DISPATCH / TRANSMIT", "GET IN TOUCH"),
    ("OPERATIONS DOSSIER", "ABOUT US"),
    ("FULL SERVICE LIST", "EVERY PLUMBING JOB"),
    ("QUESTIONS / ANSWERS", "COMMON QUESTIONS"),
    ("WHY WOLF PACK", "WHY CHOOSE US"),
    ("WHY SALEM PICKS US", "WHY YOUR NEIGHBORS PICK US"),
    ("SYS.ESTIMATE/60s", "QUICK ESTIMATE"),
    ("SYS.ESTIMATE", "QUICK ESTIMATE"),
    ("LOCAL DISPATCH", "YOUR LOCAL PLUMBER"),
    ("FIELD LOG", "RECENT WORK"),
    ("FULL COVERAGE", "FULL COVERAGE"),
    ("SALEM JOB LIST", "WHAT WE DO HERE"),
    ("KEIZER JOB LIST", "WHAT WE DO HERE"),
    ("WOODBURN JOB LIST", "WHAT WE DO HERE"),
    ("SILVERTON JOB LIST", "WHAT WE DO HERE"),
    ("STAYTON JOB LIST", "WHAT WE DO HERE"),
    ("TURNER JOB LIST", "WHAT WE DO HERE"),
    ("MONMOUTH JOB LIST", "WHAT WE DO HERE"),
    ("DALLAS JOB LIST", "WHAT WE DO HERE"),
    ("INDEPENDENCE JOB LIST", "WHAT WE DO HERE"),
    ("MT. ANGEL JOB LIST", "WHAT WE DO HERE"),
    ("SALEM FIELD LOG", "OUR RECENT WORK"),
    ("KEIZER FIELD LOG", "OUR RECENT WORK"),
    ("WOODBURN FIELD LOG", "OUR RECENT WORK"),
    ("SILVERTON FIELD LOG", "OUR RECENT WORK"),
    ("STAYTON FIELD LOG", "OUR RECENT WORK"),
    ("TURNER FIELD LOG", "OUR RECENT WORK"),
    ("MONMOUTH FIELD LOG", "OUR RECENT WORK"),
    ("DALLAS FIELD LOG", "OUR RECENT WORK"),
    ("INDEPENDENCE FIELD LOG", "OUR RECENT WORK"),
    ("MT. ANGEL FIELD LOG", "OUR RECENT WORK"),

    # CTAs / buttons (unique phrasings)
    ("RUN ESTIMATOR", "GET A QUOTE"),
    ("RUN ESTIMATE", "SEE YOUR PRICE"),
    ("CALCULATE JOB COST", "SEE YOUR PRICE"),
    ("LOCK IT IN — CALL NOW", "BOOK IT — CALL NOW"),
    (">TRANSMIT ", ">SEND MESSAGE "),
    (">RUN ESTIMATOR ", ">GET A QUOTE "),
    ("Run Estimator →", "Get a Quote →"),
    ("// RANGE ONLY · FINAL PRICE LOCKED AT ON-SITE WALK-THROUGH", "Range only · Final price locked in at the on-site walk-through"),

    # Headlines / subheads (specific to index.html)
    ("WE DON'T JUST", "STRAIGHT-TALKING"),
    ("FIX PLUMBING—", "PLUMBING"),
    ("/ WE EARN", "WE EARN YOUR"),
    ("LIVE RANGE.", "YOUR PRICE RANGE."),
    ("LIVE RANGE", "YOUR PRICE RANGE"),
    ("NO GUESSING.", "NO GUESSING."),
    ("KNOW WHAT IT'LL COST", "SEE THE PRICE"),
    ("BEFORE WE ROLL OUT.", "BEFORE WE SHOW UP."),
    ("BLUNT TOOLS.", "HONEST WORK."),
    ("PRECISION WORK.", "HONEST PRICES."),
    ("FOUR STEPS.", "FOUR STEPS."),
    ("NO MYSTERY PRICING.", "NO HIDDEN FEES."),
    ("WHAT NEIGHBORS", "WHAT YOUR NEIGHBORS"),
    ("ACTUALLY SAY.", "SAY ABOUT US."),
    ("RUN LIKE A CREW.", "A CREW YOU CAN"),
    ("PAID LIKE A TRADE.", "ACTUALLY TRUST."),
    ("THE SYSTEM.", "HOW IT GOES."),
    ("HIRE A CREW", "HIRE THE TEAM"),
    ("THAT EARNS IT.", "THAT SHOWS UP."),
    ("YOUR JOB", "WANT YOUR JOB"),
    ("ON THIS LIST NEXT?", "ON THIS LIST?"),
    ("10 TOWNS.", "10 TOWNS."),
    (" ONE CREW.", " ONE LOCAL CREW."),
    ("WHERE WE RUN", "WHERE WE"),
    ("THE CALL.", "WORK."),
    ("NOT SURE", "NOT SURE"),
    ("WHICH SERVICE?", "WHERE TO START?"),
    ("STILL HAVE", "STILL HAVE"),
    ("A QUESTION?", "A QUESTION?"),
    ("GOT WATER WHERE", "NEED A PLUMBER"),
    ("IT SHOULDN'T BE?", "RIGHT NOW?"),
    ("CALL. TEXT. EMAIL.", "CALL. TEXT. EMAIL."),
    ("WE ANSWER.", "WE ANSWER."),
    ("OUTSIDE OUR", "OUTSIDE OUR"),
    ("PRIMARY ZONE?", "USUAL AREA?"),
    ("STUFF PEOPLE", "QUESTIONS"),
    ("ACTUALLY ASK.", "WE GET OFTEN."),
    ("FAMILY-OWNED.", "FAMILY-OWNED."),
    ("SALEM-BUILT.", "SALEM-BUILT."),
    ("OUR STORY", "OUR STORY"),

    # Other bits
    ("EVERY PLUMBING CALL —", "EVERY PLUMBING JOB —"),
    ("ONE CREW.", "ONE LOCAL CREW."),
    (">// dispatch", ">dispatch"),  # any stray
    ("SEND A MESSAGE", "SEND US A MESSAGE"),
    ("TRANSMIT <span", "SEND MESSAGE <span"),  # button
    ("\"// ", "\""),  # confirm-message JS prefix (e.g., \"// message received...)

    # Remove '//' in section eye labels (HTML content)
    # The '.eye::before' CSS no longer adds '//' but leftover inline usage should go
    # (safe because we only catch exact strings)

    # Small phrasing softeners
    ("brutalist", "straight-forward"),
    ("straight-shooting", "honest, neighborhood"),
    ("Straight-shooting", "Honest, neighborhood"),
]

# --- regex patterns (structured HTML) ---
# pattern 1: `<span class="ico">// 01 DRAIN</span>` → `<span class="ico">01 · DRAIN</span>`
RE_ICO = re.compile(r'<span class="ico">//\s*(\d+)\s+([A-Z][A-Z &+\-]+?)</span>')

# pattern 2: `<span class="n">// 01 / DRAIN</span>` (.svc .n labels on service cards) — some pages use this
# Not present in this codebase, but safe to include.
RE_SVC_N = re.compile(r'<span class="n">//\s*(\d+)\s*/\s*([A-Z ]+?)</span>')

# pattern 3: gallery/showcase captions: `<figcaption>// 01 · PIPE_REPIPE · SALEM</figcaption>`
# → `<figcaption>Pipe Repipe <em>· Salem</em></figcaption>`
RE_CAP_FULL = re.compile(r'<figcaption>//\s*(?:\d+\s*·\s*)?([A-Z0-9_ ]+?)\s*·\s*([A-Z. ]+?)</figcaption>')

# pattern 4: simpler caption without city: `<figcaption>// SHOWER_VALVE.01</figcaption>`
RE_CAP_SHORT = re.compile(r'<figcaption>//\s*([A-Z0-9_]+)\.?(\d*)</figcaption>')

# pattern 5: `Unit<strong>WP-07</strong>` → drop the "Unit" readout entirely becomes "Crew" or similar
# We'll just replace WP-07 badge text with something natural
RE_BADGE_UNIT = re.compile(r'<span class="badge">UNIT WP-07</span>')

# pattern 6: `<span class="eye">DISPATCH / TRANSMIT</span>` → handled by FLAT above

# pattern 7: `<small>plumbing · salem or</small>` - already fine, kept

def titlecase(s: str) -> str:
    parts = s.replace('_', ' ').split()
    small = {'and', 'or', 'in', 'of', 'the', 'a'}
    out = []
    for i, p in enumerate(parts):
        if p.lower() in small and i != 0:
            out.append(p.lower())
        else:
            out.append(p.capitalize())
    return ' '.join(out)


def soften_file(p: Path):
    txt = p.read_text()

    # 1. fonts
    txt = txt.replace(OLD_FONTS, NEW_FONTS)

    # 2. badge
    txt = RE_BADGE_UNIT.sub('<span class="badge">On the Job</span>', txt)

    # 3. ico labels (services.html, etc.)
    txt = RE_ICO.sub(lambda m: f'<span class="ico">{m.group(1)} · {titlecase(m.group(2).strip())}</span>', txt)

    # 4. .svc .n labels
    txt = RE_SVC_N.sub(lambda m: f'<span class="n">{m.group(1)} · {titlecase(m.group(2).strip())}</span>', txt)

    # 5. full captions (city-bearing)
    def rep_cap_full(m):
        kind = titlecase(m.group(1).strip())
        city = m.group(2).strip().title()
        # handle "Mt. Angel" spelling
        city = city.replace('Mt.', 'Mt.').replace('Mt. angel', 'Mt. Angel').replace('Mt.angel', 'Mt. Angel')
        return f'<figcaption>{kind} <em>· {city}</em></figcaption>'
    txt = RE_CAP_FULL.sub(rep_cap_full, txt)

    # 6. short captions
    def rep_cap_short(m):
        kind = titlecase(m.group(1).strip())
        return f'<figcaption>{kind}</figcaption>'
    txt = RE_CAP_SHORT.sub(rep_cap_short, txt)

    # 7. flat replacements
    for old, new in FLAT:
        txt = txt.replace(old, new)

    p.write_text(txt)


def main():
    pages = sorted(HERE.glob('*.html'))
    for p in pages:
        soften_file(p)
        print(f'softened {p.name}')

    # Also soften animations.js (menu toggle labels)
    js = HERE / 'animations.js'
    if js.exists():
        t = js.read_text()
        t = t.replace("o ? '/ close' : '/ menu'", "o ? 'Close' : 'Menu'")
        t = t.replace('// message received. wolfpack dispatch will reply within 1 business day.',
                      'Message received — Joe or the crew will reply within one business day.')
        # mobile-toggle initial text is set from HTML, not JS — handled there
        js.write_text(t)
        print('softened animations.js')


if __name__ == '__main__':
    main()
