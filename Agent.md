**Task:** Refactor an existing single-file static portfolio website into a **React + Vite + Tailwind CSS** project. The result must be fully responsive (mobile-first), deployable to **GitHub Pages**, and use **hash-based routing only**.

### 1. Context — current implementation

The site currently exists as two files:

**`index.html`** — a single self-contained page with:
- A fixed, full-viewport `<canvas id="bg">` that renders a **scroll-driven image sequence** (90 JPEG frames at `ezgif-70d0b7be815a4889-jpg/ezgif-frame-001.jpg` … `-090.jpg`). Logic: preload all frames, then interpolate a `current` value toward a `target` derived from total page scroll progress, using `requestAnimationFrame` with an exponential smoothing lerp (`1 - Math.exp(-8 * dt)`). Frames are drawn with a "cover" fit anchored to the top. On resize, canvas is resized with DPR capped at 2.
- A `.veil` fixed overlay div (linear-gradient scrim) so text stays readable over any frame.
- A fixed `<nav>` with logo, section links, and a "Get in touch" pill button (`<a class="cta" href="mailto:...">`) containing an arrow badge.
- Sections: **Hero** (`#home`), **About** (`#about`), **Projects** (`#projects`), **Skills** (`#skills`), **Contact** (`#contact`), plus a `<footer>`.
- `.reveal` elements that fade/slide in via `IntersectionObserver`.
- `scroll-behavior: smooth`, forced scroll-to-top on reload, orange accent color `#ff4d1c`, Inter font, black background.

**`server.js`** — a dependency-free Node static file server (dev-only, not needed for GitHub Pages).

**Content to preserve verbatim** (unless a change is explicitly requested below):

- Logo: `Pouria.dev` (the `.` in orange)
- Hero H1: "Software Engineer"; hero side heading: "AI that ships, not just demos."; hero side paragraph about building production-grade AI systems.
- Hero tags: `#01 AI Agents`, `#02 RAG Systems`, `#03 MLOps & Docker`, `#04 LLM Fine-tuning`
- About: kicker "About", title "Bridging research and reliability.", lead paragraph about Pouria Sarmasti, and the 3 fact cards (9 AI microservices / Technical lead / Sharif University).
- Projects (6, in this order): RAG Agents & Text-to-SQL; Speech-to-Speech Translation; Face Search System; EEG Task Classification; LLM & ASR Fine-tuning; ETL & MLOps Pipelines — each with its existing description and category label.
- Skills: 5 groups (Software Engineering, AI/ML, Backend & Data, MLOps & Infra, Exploring) with their existing chip lists.
- Contact: "Let's build something.", email `pouria98sarmasti@gmail.com`, location "Tehran, Iran".
- Footer: "© 2026 Pouria Sarmasti" / "Software Engineer — Tehran"

### 2. Tech stack & hard constraints

- **React 18** + **Vite** (function components + hooks only; no TypeScript, no class components).
- **Tailwind CSS** for all styling. No CSS-in-JS, no separate hand-written stylesheet except a tiny `index.css` for Tailwind directives and the few things Tailwind can't express (e.g. the `.veil` gradient if you prefer it as a utility string — either is fine, but keep it minimal).
- **Plain JavaScript only** — no TypeScript, no `.ts`/`.tsx` files.
- **Hash routing only.** The site must work when served from `https://<user>.github.io/<repo>/` with no server-side rewrites.
  - Use `react-router-dom`'s **`HashRouter`** if you introduce routes (e.g. `#/`, `#/projects/:slug` for project detail pages).
  - In-page section navigation must use hash anchors (`#home`, `#about`, `#projects`, `#skills`, `#contact`) with smooth scrolling.
  - **Never** use `BrowserRouter`, `createBrowserRouter`, history `pushState`-based routing, or any pattern that requires a server to rewrite URLs to `index.html`.
- **Static hosting only.** No Node/Express runtime, no API routes, no server-side rendering. The build output must be pure static HTML/CSS/JS.
- Set Vite's `base` to `'./'` (relative) so assets resolve correctly under the repo subpath. Verify no hard-coded absolute `/` asset paths remain.
- No external services, no analytics, no paid APIs.

### 3. Required changes vs. the current site

**3.1 Mobile-first responsive redesign**

- Write all Tailwind classes mobile-first (unprefixed = smallest screen), then layer `sm:`, `md:`, `lg:` upward.
- Every section must be usable and legible from a 320px-wide viewport to ultra-wide.
- Nav: the desktop link list is currently hidden below 900px with no replacement. **Add a working mobile menu** — a hamburger toggle that opens an accessible overlay/drawer containing the nav links and the contact CTA. It must close on link tap, on `Escape`, and trap/restore focus sensibly.
- Projects, skills chips, and about facts must reflow cleanly (single column → multi-column).
- No horizontal overflow at any width. Test the hero H1 and the giant email link at 320px.
- Respect `prefers-reduced-motion`: disable or drastically reduce the canvas scrub animation, the smooth scroll, and `.reveal` transitions for users who ask for it.

**3.2 Project cards**

Replace the current row-based project list with a **card grid**. Each project becomes its own card containing:

1. **Title**
2. **Description** — reuse the existing description text
3. **Learnings** — a short list of 2–4 bullet points per project, written by you, describing concrete technical takeaways (e.g. "Structuring LangGraph agents so tools are testable in isolation", "Tuning chunking strategy against retrieval eval sets", "Diarization error propagation across pipeline stages"). Keep them specific and credible, not generic filler. If the description doesn't give enough signal, infer sensibly from the project title and category.
4. **GitHub repo link** — an anchor styled as a card action (e.g. "View repo ↗"), opening in a new tab with `rel="noopener noreferrer"`.

Card requirements:

- Cards live in a responsive grid: 1 column on mobile, 2 on `md`, 3 on `lg` (or a layout you judge better — justify it in a comment).
- Each card keeps the numeric index badge (`/01`, `/02`, …) and the category label.
- Cards must be visually consistent in height within a row where practical; use flex/grid so the repo link sits at the bottom of each card.
- Add a subtle hover/focus state (border color shift to `#ff4d1c`, slight lift). Focus states must be visible for keyboard users.
- The whole card should not be a link (nested interactive elements are an a11y problem) — only the repo link is clickable.

**3.3 "Get in touch" button**

- Make it **smaller** than the current version: reduce padding and font size (roughly `text-sm`, `px-4 py-2`), keep the arrow badge but shrink it proportionally.
- **Change its behavior:** clicking it must **scroll smoothly to the `#contact` section**, not open `mailto:`. It can remain an `<a href="#contact">` for correctness (works without JS) with a click handler that does `scrollIntoView({ behavior: 'smooth' })` and updates focus for accessibility.
- The same smaller button appears in the mobile menu.

**3.4 Contact section**

Add, alongside the existing email and location:

- **LinkedIn profile** link
- **GitHub profile** link

Render them as a row of clearly-labelled links (with icons if you include an icon set — otherwise simple text labels are fine). All external links: `target="_blank"` + `rel="noopener noreferrer"`. Use obvious placeholder URLs and mark them with a `TODO` comment so they're easy to swap:

```js
export const SOCIALS = {
  email: 'pouria98sarmasti@gmail.com',
  linkedin: 'https://www.linkedin.com/in/TODO-linkedin-handle', // TODO: replace
  github: 'https://github.com/TODO-github-handle',             // TODO: replace
};
```

### 4. Data layer

Move all content out of JSX into a small set of plain-JS data modules under `src/data/`:

- `projects.js` — array of `{ id, index, title, description, learnings: string[], category, repoUrl }`
- `skills.js` — array of `{ group, items: string[] }`
- `socials.js` — email, LinkedIn, GitHub, location
- `nav.js` — section link definitions (label + hash)

Components must map over this data; no hard-coded project/skill markup. Project `repoUrl` values should be placeholders with a `TODO` comment.

### 5. Canvas background animation

Port the existing scroll-sequence animation into React without regressing behavior:

- Extract it into a dedicated component (e.g. `<ScrollSequenceBackground />`) mounted once at the app root, rendered behind the content.
- Preserve: frame preloading with graceful boot (start rendering as soon as frame 1 or all frames are ready), the DPR-capped resize handling, the top-anchored "cover" fit, the `requestAnimationFrame` + exponential-lerp smoothing, and the scroll-to-progress mapping across the **entire page**.
- Use `useRef` for mutable animation state (`current`, `target`, `raf`, canvas/ctx) so re-renders don't restart the loop. Clean up listeners and cancel the RAF on unmount.
- Move the 90 JPEGs into `public/frames/` and reference them with a **relative** path so they work under a GitHub Pages subpath. Update the filename pattern accordingly.
- Keep the `.veil` scrim overlay above the canvas and below the content.
- Guard against: frame images failing to load, `scrollHeight - innerHeight === 0`, and rapid resize storms (debounce or just let the existing render-on-resize handle it).

### 6. Proposed file structure

```
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .github/workflows/deploy.yml
├── public/
│   └── frames/ezgif-frame-001.jpg … 090.jpg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/{projects,skills,socials,nav}.js
    ├── hooks/{useScrollSequence,useReveal,useMediaQuery}.js
    └── components/
        ├── ScrollSequenceBackground.jsx
        ├── Veil.jsx
        ├── Nav.jsx
        ├── MobileMenu.jsx
        ├── CtaButton.jsx
        ├── Hero.jsx
        ├── About.jsx
        ├── Projects.jsx
        ├── ProjectCard.jsx
        ├── Skills.jsx
        ├── Contact.jsx
        └── Footer.jsx
```

Adjust as you see fit, but keep concerns separated: content in `data/`, animation/observer logic in `hooks/`, presentation in `components/`.

### 7. GitHub Pages deployment

- Add a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds the Vite project on push to `main` and publishes `dist/` using `actions/upload-pages-artifact` + `actions/deploy-pages`.
- Include the correct `permissions` (`contents: read`, `pages: write`, `id-token: write`) and a `concurrency` group.
- Add npm scripts: `dev`, `build`, `preview`.
- Add a short `README.md` section explaining: how to set `base` for a repo-named project page, how to enable Pages (Settings → Pages → Source: GitHub Actions), and how to replace the placeholder repo/social URLs.
- Because routing is hash-only, **no `404.html` workaround or SPA redirect hack is needed** — but state this explicitly in the README so future contributors don't reintroduce `BrowserRouter`.
- `server.js` is no longer required. You may delete it, or keep it purely as an optional local preview server with a comment explaining it isn't used in production. Prefer deleting it to avoid confusion.

### 8. Explicitly forbidden

- `BrowserRouter`, `createBrowserRouter`, `history.pushState`, or any routing that breaks on a static host without rewrites.
- TypeScript, `.ts`/`.tsx` files, or a `tsconfig.json`.
- Any build step that outputs a non-static bundle (SSR, API routes, server functions).
- Absolute asset paths that break under `/repo-name/` subpath hosting.
- Adding a UI component library (MUI, Chakra, shadcn, etc.) — hand-roll with Tailwind.
- Removing or watering down the existing copy, the orange `#ff4d1c` accent, the Inter font, or the scroll-driven canvas background.
- Any `mailto:` as the primary behavior of the "Get in touch" nav button (it may still exist inside the Contact section).

### 9. Acceptance criteria

The task is complete when all of the following are true:

1. `npm install && npm run build` succeeds with no errors or warnings that matter.
2. `npm run preview` serves the site and it looks correct at 320px, 375px, 768px, 1024px, 1440px, and 1920px widths with no horizontal scroll and no overlapping text.
3. The scroll-driven canvas animation plays smoothly across the full page scroll and does not stutter or restart on React re-renders.
4. Every one of the 6 projects renders as a card with title, description, learnings list, category, index badge, and a working GitHub repo link opening in a new tab.
5. The nav "Get in touch" button is visibly smaller than before and, when clicked on desktop **and** from the mobile menu, smoothly scrolls to the contact section.
6. The contact section shows email, LinkedIn, and GitHub links, all functional (placeholders are acceptable, but clearly marked).
7. The mobile menu opens, closes on link tap and on `Escape`, and is keyboard navigable.
8. Deploying the repo to GitHub Pages via the included workflow produces a fully working site at `https://<user>.github.io/<repo>/`, with all frames, fonts, and assets loading correctly under the subpath.
9. Changing the URL hash manually (e.g. appending `#about`) and reloading lands on the correct section — with no 404s.
10. `prefers-reduced-motion: reduce` disables the heavy animation while leaving the site fully usable and readable.

### 10. Working style

- Work incrementally: scaffold the Vite project, then port styles, then components, then the animation, then deployment. Verify the build after each major step.
- Leave brief comments only where the reasoning isn't obvious — especially around the animation math, the hash-routing decision, and the GitHub Pages `base` config.
- Don't invent new copy for the sections whose text is specified above; only the **Learnings** bullets are new authored content.
- At the end, give me a short summary of: files created/changed, anything you had to deviate on and why, and the exact steps I need to take to deploy.