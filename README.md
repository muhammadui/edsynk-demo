# Edsynk — Product Preview

A static, click-through preview of Edsynk (Nigerian K-12 school OS) across all five personas —
admin/owner, teacher, student, parent, and platform/HQ — plus the public pages (landing, results
lookup, QR verify). **These are design mockups**: the screens look and navigate like the real app,
but there's no backend, no login, and the data shown is illustrative — it's a walkthrough of what
Edsynk offers, not the live product.

Every link is relative, so it serves cleanly from any host. External styling (Tailwind, Google
Fonts) loads from CDNs, so an internet connection is needed to render.

## Deploy (GitHub Pages)

1. Create a new **public** GitHub repo (e.g. `edsynk-demo`) and push this folder to it.
2. Repo → **Settings → Pages** → Source = **Deploy from a branch**, Branch = `main`, folder = `/ (root)`.
3. The included `CNAME` file binds **demo.edsynk.ng**. In your DNS, add a record for `demo` that
   points at GitHub Pages (this **specific** record overrides the `*.edsynk.ng` wildcard, so it
   won't collide with the main app):
   - `CNAME  demo  <your-github-username>.github.io`
4. Back in Settings → Pages, set the custom domain to `demo.edsynk.ng` and tick **Enforce HTTPS**
   (GitHub provisions the cert automatically once DNS resolves).

Landing page: `index.html` (the persona gallery). `404.html` handles unknown paths.

## Not included
The internal `_gen_*.py` generators and `files.md` from the source repo are intentionally left out —
this is the rendered preview only.
