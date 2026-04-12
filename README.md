# Blackbox Advancements

Static marketing site for **Blackbox Advancements**, built for **GitHub Pages** with **Namecheap** as the domain registrar for `blackboxadvancements.com`.

## Included pages

- `index.html`
- `services.html`
- `solutions.html`
- `industries.html`
- `about.html`
- `contact.html`

## Assets

- `assets/logo.svg`
- `assets/favicon.svg`
- `style.css`
- `script.js`
- `CNAME`
- `.nojekyll`

## Deploy to GitHub Pages

1. Create a GitHub repo.
2. Push this folder to the `main` branch.
3. In GitHub, go to **Settings → Pages**.
4. Set the source to **Deploy from a branch**.
5. Choose **main** and **/(root)**.
6. Save.

GitHub Pages will serve the static files automatically.

## Connect the custom domain in Namecheap

Add these records in **Namecheap → Domain List → Manage → Advanced DNS**:

- `@` → A → `185.199.108.153`
- `@` → A → `185.199.109.153`
- `@` → A → `185.199.110.153`
- `@` → A → `185.199.111.153`
- `www` → CNAME → `<your-github-username>.github.io`

Then in GitHub Pages:

- set custom domain to `blackboxadvancements.com`
- wait for certificate issuance
- enable HTTPS when it becomes available

## Notes

- This site is fully static and GitHub Pages safe.
- The contact form currently uses a `mailto:` action for static compatibility.
- Replace `hello@blackboxadvancements.com` with the final business inbox if needed.
- If you want a real submission endpoint later, connect the form to Formspree, Basin, a Cloudflare Worker, or another static-friendly form handler.
