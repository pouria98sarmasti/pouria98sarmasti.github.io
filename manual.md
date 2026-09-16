# Portfolio Manual — updating content & CV

> This file is the project's operating manual. (The `README.md` at the repo root
> is the GitHub **profile** page — a CV in markdown format, not project docs.)

All visible text lives in **`src/i18n/dictionaries.ts`** in two blocks: `en` (English)
and `fa` (Persian). **Always edit both** — otherwise one language shows stale copy.

After any change: commit and push to `main`. The workflow in
`.github/workflows/deploy.yml` rebuilds and redeploys automatically in ~1–2 minutes.
Then hard-refresh the site (`Ctrl+Shift+R`) to see the update.

---

## 1. Change the CV file

The download button points at `public/Pouria-Sarmasti-CV.pdf`.

**Easiest (no code change):** replace the file, keeping the exact same name:

```bash
# put your new CV here, named exactly:
public/Pouria-Sarmasti-CV.pdf
```

**Use a different filename:** replace the file, then update the link in
`src/components/Hero.tsx` (both `href` and `download`):

```tsx
<a
  href="My-New-CV-Name.pdf"
  download="My-New-CV-Name.pdf"
```

Rules:

- Keep asset links **root-relative** (e.g. `Pouria-Sarmasti-CV.pdf` next to the
  deployed `index.html` at `https://pouria98sarmasti.github.io/`).
- Keep the PDF small (a few MB max) so the download button feels instant.
- Test: `npm run dev` → click Download CV → then test again on the deployed URL.

---

## 2. Change project details / add / remove projects

Projects live in `src/i18n/dictionaries.ts` twice:

- `en.projects.items` — English copy
- `fa.projects.items` — Persian copy (same order, same `id`s)

One entry looks like this:

```ts
{
  id: 'rag-agents-text-to-sql', // unique slug, never shown; keep stable
  index: '01',                  // zero-padded number shown on the card
  title: 'RAG Agents & Text-to-SQL',
  description: 'GenAI microservices for ...',
  learnings: [
    'Structuring LangGraph agents so each tool is testable in isolation',
    '...', // 2–4 concrete technical bullets
  ],
  category: 'GenAI · FastAPI',  // keep English tech labels in both languages
  repoUrl: 'https://github.com/<your-user>/<your-repo>', // real repo URL
},
```

- **Edit a project:** change the fields in **both** `en` and `fa`
  (translate `title`, `description`, `learnings`; keep `category` English).
- **Add a project:** insert a new object in **both** arrays at the same position.
- **Remove a project:** delete the object from **both** arrays.
- **Reorder:** reorder **both** arrays identically, then renumber `index`
  sequentially (`'01'`, `'02'`, …).
- `repoUrl` values built by the `REPO('slug')` helper are placeholders —
  replace with the real `https://github.com/...` URL (still opens in a new tab).

---

## 3. Change the About section cards

The fact cards live in `src/i18n/dictionaries.ts`:

- `en.about.facts` — English
- `fa.about.facts` — Persian (same order)

```ts
facts: [
  {
    title: '9 AI microservices',
    text: 'Delivered to production — secure, on-premise deployments ...',
  },
  // ... one object per card
],
```

- **Edit:** change `title`/`text` in **both** languages.
- **Add:** append an object in **both** arrays (3 cards recommended; 2–4 fit the
  grid: 1 column on mobile → 2–3 on desktop, no other change needed).
- **Remove:** delete the object from **both** arrays.

The About heading and lead paragraph are just above the facts in the same file
(`about.titleLine1/2`, `about.leadBefore/leadName/leadAfter`).

---

## Publishing checklist (GitHub Pages — user page)

This project deploys as a **user page**: the repo must be named
`pouria98sarmasti.github.io`, served at `https://pouria98sarmasti.github.io/`.

1. `git add -A && git commit -m "..." && git push origin main`
2. Open the repo → **Actions** tab → the run must be green.
3. **Settings → Pages → Source** must be **GitHub Actions** (one-time setup).
4. Wait ~1–2 min, open `https://pouria98sarmasti.github.io/`, hard-refresh.
5. Keep `base: '/'` in `vite.config.ts` — a user page is served from the domain
   root, so absolute asset paths always resolve. (Do **not** switch back to `'./'`.)
6. Unrelated but easy to break: the contact form needs the `VITE_WEB3FORMS_KEY`
   Actions secret to send mail — don't remove it while editing the workflow.

---

# Part 2 — development & hosting reference
(moved from the old project README)

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck (tsc --noEmit) + production build to dist/
npm run preview   # serve the production build locally
```

Requires Node 20+ (CI uses Node 22). Built with **React 19 + TypeScript + Vite +
Tailwind CSS v4**. The scroll-driven canvas background and all content run
client-side with no server — the build output is pure static HTML/CSS/JS.

## Deploying to GitHub Pages (user page)

The included workflow (`.github/workflows/deploy.yml`) builds and publishes the site
on every push to `main`.

1. Name the repo exactly **`pouria98sarmasti.github.io`** and push to GitHub, then
   open **Settings → Pages → Build and deployment → Source** → select
   **GitHub Actions**.
2. That's it — the next push to `main` deploys. The site appears at
   `https://pouria98sarmasti.github.io/`.

### `base` (user page)

Because a user page is served from the domain root, `vite.config.ts` uses
`base: '/'`. Keep it — absolute asset paths (`/assets/...`) always resolve here.
(Only repo subpath project pages need the relative `'./'` workaround; this project
is not one.)

After changing config, run `npm run build` and check `dist/index.html` — asset paths
should start with `/assets/`.

## Contact form (Web3Forms)

The Contact section includes a `Name / Email / Phone (required) / Website / Message`
form that sends to your email via [Web3Forms](https://web3forms.com) — pure
client-side `fetch`, so it works on static GitHub Pages with no backend. The access
key is **env-only by design** (never hard-coded in `src/`):

1. **Local dev** — copy `.env.example` to `.env` and paste your key:
   `VITE_WEB3FORMS_KEY=<your-key>` (`.env` is gitignored).
2. **GitHub Pages** — add the same value as an Actions secret at
   **Settings → Secrets and variables → Actions → New repository secret**,
   named `VITE_WEB3FORMS_KEY`. The deploy workflow injects it at build time.
3. Optional but recommended: in the Web3Forms dashboard, restrict the key to your
   Pages domain so nobody else can submit with it.

Without the key, the form shows an honest notice and falls back to a `mailto:` link.

## Theme & language

- **Theme** — Light / System / Dark via the header pill (desktop) or the mobile menu.
  `system` (default) follows the OS and updates live; the choice persists in
  `localStorage`. Dark is the pre-hydration default, so first paint never flashes.
  In light mode the photo canvas is dimmed and scrims flip to white for contrast.
- **Language** — EN/FA toggle in the header (desktop) or mobile menu. Persian sets
  `dir=rtl` on `<html>`, switches the font to Vazirmatn, and mirrors the layout via
  logical CSS properties. All copy (including project descriptions and learnings)
  lives in `src/i18n/dictionaries.ts`; tech terms and chips stay in English.

## Links & socials (already set)

- **Project repo URLs** — `src/i18n/dictionaries.ts`: every `repoUrl` is built by the
  `REPO()` helper under `https://github.com/pouria98sarmasti/`. Both languages
  share them. If a repo moves, update the slug there.
- **LinkedIn / GitHub profiles** — `src/data/socials.ts`, currently
  `https://linkedin.com/in/pouria-sarmasti` and
  `https://github.com/pouria98sarmasti`.
- These flow into the project cards, the Contact section, and (via `socials.ts`)
  the site automatically. The profile `README.md` badges carry the same URLs —
  keep them in sync if anything changes.

## Routing: hash anchors only (deliberate)

All navigation uses in-page hash anchors (`#home`, `#about`, `#projects`, `#skills`,
`#contact`) with smooth scrolling.

**There is no `react-router` and no `BrowserRouter` — and that is intentional.**
Hash-only navigation needs **no `404.html` workaround and no SPA redirect hack** on
GitHub Pages: the server only ever sees `/` (or `/index.html`) and the fragment is
resolved client-side. Please don't reintroduce history-API routing; it would 404 on
every deep link on this static host.

## UI/UX skill (project-local)

The repo ships with the [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
design-intelligence skill in `.agents/skills/` (installed via `uipro init --ai universal`).
It provides searchable UI styles, color palettes, font pairings, and UX guidelines
used when designing or reviewing the site's interface.

- Refresh skill files with `npx uipro update`.
- The skill's Python search scripts are optional; without Python 3, the CSV datasets
  under `.agents/skills/*/data/` can be searched directly.

## Accessibility & motion

- The mobile menu is a focus-trapped dialog: it closes on link tap, `Escape`,
  backdrop clicks, and directional swipe; restores focus to the trigger.
- `prefers-reduced-motion: reduce` disables the canvas scrub animation and smooth
  scrolling, keeping the site fully readable.
