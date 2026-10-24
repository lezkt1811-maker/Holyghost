# Holy Ghost Plumbing Services

Website for Holy Ghost Plumbing Services — plumbing for the Kansas City metro area.
📞 **816-879-9346**

## What's in it
- `index.html` — the full one-page site: services, free tools, how it works, service area, booking form, FAQ
- `styles.css` — neon glow theme matched to the logo (cyan, blue, violet, magenta on black), mobile-friendly
- `script.js` — glowing particles, emergency checker, drip waste calculator, burst-pipe checklist, service-area checker, booking form
- `assets/logo.png` — the Holy Ghost Plumbing logo (plus `logo-sm.png`, `favicon.png`, `apple-touch-icon.png`)
- `404.html`, `robots.txt`, `sitemap.xml` — "page vanished" page and search-engine files

## How the booking form works
No server needed. The form checks the fields, then opens the visitor's texting app with a
pre-written message to 816-879-9346 with their name, address, service, urgency,
preferred day and time window. A "Copy Message" button is there as a backup.

## Going live (GitHub Pages)
Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
The site will be at `https://lezkt1811-maker.github.io/holyghost/`.

## Editing
- Phone number: search `8168799346` / `816-879-9346` in `index.html` and `script.js`
- Cities served: the `AREAS` list at the top of `script.js`
