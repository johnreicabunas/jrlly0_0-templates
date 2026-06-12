# jrlly0_0 — Creative Shot Templates (website)

Static storefront that showcases and sells jrlly0_0's Canva collage templates.
No build step — plain HTML/CSS/JS.

## Files

- `index.html` — the page.
- `styles.css` — theme (warm filmic / collage).
- `script.js` — template data + gallery, filters, lightbox, nav.
- `assets/` — web-optimized template previews (originals: `../raw/assets/`).

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Going live (2 edits in `script.js`)

1. **Buy links** — set each template's `buyUrl` to its checkout URL
   (Gumroad recommended). While `null`, buttons fall back to the Instagram DM
   (`IG_DM`).
2. **Price** — update `PRICE` (mirror `../wiki/02-product/pricing.md`).

Keep `TEMPLATES[]` in sync with `../wiki/02-product/templates-catalog.md`.

## Deploy

Static host (Vercel / Netlify / GitHub Pages); set the project root to this
`site/` folder. See `../wiki/03-website/website-plan.md`.
