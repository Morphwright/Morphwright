# Deploying Morphwright to Cloudflare Pages

Static Astro site. `npm run build` → `dist/`; Cloudflare Pages serves `dist/` at the edge.
No adapter or Functions are needed.

## Option A — Git-connected (recommended: auto-deploy on push)

1. Create a GitHub repo and push `main`:
   ```bash
   gh repo create morphwright --private --source=. --remote=origin --push
   # or: git remote add origin <url> && git push -u origin main
   ```
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   - Framework preset: **Astro** (or None)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Save & Deploy. Every push to `main` redeploys.

## Option B — Direct upload (no GitHub)

On a machine logged in to Cloudflare (`npx wrangler login`):
```bash
npm run build
npx wrangler pages deploy dist --project-name=morphwright
```

## Custom domain (Morphwright.com)

In the Pages project → **Custom domains → Set up a domain** → add `morphwright.com`
(and `www.morphwright.com`). Since the domain is already in your Cloudflare account,
Pages adds the CNAME/records automatically and provisions TLS. Add a `www` → apex
redirect (or vice-versa) under the domain's Rules if you want one canonical host.

## Pre-launch checklist (replace the intentional placeholders first)

- [ ] `src/pages/contact.astro` — replace `FORM_ENDPOINT` (`https://formspree.io/f/your-form-id`)
      with a real Formspree form id, or wire your own handler. Set up `hello@` / `careers@` mailboxes.
- [ ] `src/pages/team.astro` — real names, roles, bios (currently "Founder Name", etc.).
- [ ] `src/pages/careers.astro` — real open roles (the culture statement is final copy).
- [ ] Copy + logo polish across pages as desired (the contour-peak mark + wordmark are placeholders).
- [ ] Confirm `<title>`/meta descriptions per page; add OpenGraph/social image if wanted.

## Notes

- `wrangler.toml` and `public/_headers` (security + immutable asset caching) are committed.
- Optional perf: import only the `latin` Fontsource subsets if the broader subsets are unwanted.
