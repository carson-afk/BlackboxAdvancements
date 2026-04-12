# Blackbox Advancements — Website

Static multi-page website for [blackboxadvancements.com](https://blackboxadvancements.com).

## Stack

- Plain HTML, CSS, JavaScript
- No build step, no dependencies
- Hosted on GitHub Pages

## Pages

- `index.html` — Home / landing page
- `services.html` — Full service breakdown
- `solutions.html` — Turnkey solution packages
- `industries.html` — Industry-specific automation
- `about.html` — Company mission and principles
- `contact.html` — Contact form and FAQ

## Local Development

Open any `.html` file directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## GitHub Pages Deployment

1. Push this repo to GitHub (e.g., `blackboxadvancements/blackboxadvancements.github.io` or any repo with Pages enabled).
2. In **Settings > Pages**, set source to the branch and root (`/`) directory.
3. The `CNAME` file is already configured for `blackboxadvancements.com`.
4. The `.nojekyll` file disables Jekyll processing (not needed for plain HTML).

## Namecheap DNS Configuration

In your Namecheap domain dashboard, set the following DNS records:

| Type  | Host | Value                          |
|-------|------|--------------------------------|
| A     | @    | 185.199.108.153                |
| A     | @    | 185.199.109.153                |
| A     | @    | 185.199.110.153                |
| A     | @    | 185.199.111.153                |
| CNAME | www  | `<your-username>.github.io`    |

After DNS propagates (up to 48 hours), enable **Enforce HTTPS** in GitHub Pages settings.

## File Structure

```
├── index.html
├── services.html
├── solutions.html
├── industries.html
├── about.html
├── contact.html
├── CNAME
├── .nojekyll
├── README.md
└── assets/
    ├── styles.css
    ├── main.js
    ├── logo.svg
    └── favicon.svg
```
