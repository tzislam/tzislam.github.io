# Tanzima Z. Islam — Personal Website — PLAN2.md
## For Claude Code CLI Execution

> This plan builds Dr. Islam's **personal academic homepage** as a small **multi-page** site whose
> page URLs deliberately match the ones her current (Wix) site already exposes — `research.html`,
> `publications.html`, `teaching.html` — so that links already indexed by Google keep working and no
> visitor ever lands on a "page not found." The site is developed in this repo, pushed to GitHub, and
> served to visitors at **www.tanzimaislam.com** via GoDaddy DNS. Research and Publications funnel
> into the **Per4ML lab site**; nothing group-level is duplicated.
>
> **Status: PLAN. Implement only after PI approval.**

---

## 0. Decisions Locked In (from PI)

| Question | Decision |
|---|---|
| **Why this project exists** | **Preserve the existing indexed URLs.** The current site exposes `research.html`, `publications.html`, `teaching.html`. Google already links to them. The new site MUST serve those exact paths so incoming search traffic is never stranded on a 404. |
| Where it's developed / pushed | GitHub repo **`tzislam/tzislam.github.io`** (branch `main`). A **user** Pages site → served at the domain root `/`. |
| How visitors reach it | They type **`tanzimaislam.com`**. GoDaddy holds the domain (DNS only — no Wix, no GoDaddy hosting) and points it at GitHub Pages. Canonical host: **`www.tanzimaislam.com`**. |
| Auto-update | Push to `main` → GitHub Actions builds → Pages serves it → live at the domain. No manual publish step, no Wix. |
| Stack | **Reuse the Per4ML decisions verbatim:** React 19 + Vite 6 + Tailwind 4 (`@tailwindcss/vite`) + `motion` + `lucide-react`, TypeScript, deployed via GitHub Actions. Node-only build (no Python here). |
| Architecture | **Multi-page**, not single-scroll. One real HTML file per nav item (this is what makes `/research.html` etc. exist as URLs). |
| Nav items → pages | **Home** → `index.html` · **Research** → `research.html` · **Publications** → `publications.html` · **Teaching & Leadership** → `teaching.html`. |
| Research / Publications pages | **Landing page + prominent button** to the lab section (`per4ml.github.io/#research` / `#publications`). Keeps the URL alive with indexable content, then forwards. (One-line switch to full auto-redirect if preferred — Section 5.4.) |
| Redundancy | **Zero.** Research, publications, news, team, projects live only on the lab site and are linked, never re-rendered. |
| Voice | **First person** ("I", "my research"). |

---

## 1. Context and Constraints

- **Live URL (canonical):** https://www.tanzimaislam.com
- **Repo:** https://github.com/tzislam/tzislam.github.io (branch `main`) — a **user** GitHub Pages
  site, served at the **domain root** (`/`). `vite.config.ts` `base` must be `'/'`.
- **Domain registrar:** GoDaddy — **DNS only** (Section 7). No hosting there, no Wix.
- **Stack (mirrors Per4ML exactly):** Vite 6 + React 19 + TypeScript + Tailwind 4
  (`@tailwindcss/vite`) + `motion` + `lucide-react`. **Pure Node/Vite build — no Python, no
  build-time network calls.** (The Per4ML `bib2json.py` / `generate_seo.py` pipeline is NOT copied —
  publications are linked out, not rendered here.)
- **Deployment:** GitHub Pages via **GitHub Actions** (`upload-pages-artifact` → `deploy-pages`),
  adapted from Per4ML's `deploy.yml` (Python steps removed).
- **Data philosophy:** All personal content lives in JSON under `contents/`, never hardcoded in
  components. The PI edits source files and pushes.

### 1.1 The URL-preservation requirement (the core constraint)
The current Wix site is indexed at (at least) these paths:

```
tanzimaislam.com/research.html
tanzimaislam.com/publications.html
tanzimaislam.com/teaching.html
```

Vite emits one output file per HTML entry point. By declaring `research.html`, `publications.html`,
and `teaching.html` as entry points (Section 2.2), the build produces those exact files at the `dist`
root, so `www.tanzimaislam.com/research.html` resolves to a real page — **not** a 404 — for every
old Google result. This is non-negotiable and is verified in Section 11.

> If the old site also exposes other indexed paths (e.g. a `home.html`, `cv.html`, or trailing-slash
> variants), add each as an entry point too, or catch them with `public/404.html` (Section 2.3).
> **Action for PI:** confirm the full list of currently-indexed URLs (Google Search Console, or
> `site:tanzimaislam.com` in Google) before launch so none is missed.

---

## 2. Repository Structure (Target)

```
tzislam.github.io/
├── index.html                 # Home entry point (Vite HTML entry)
├── research.html              # Research entry point   -> /research.html
├── publications.html          # Publications entry point -> /publications.html
├── teaching.html              # Teaching & Leadership entry point -> /teaching.html
├── public/
│   ├── CNAME                  # contains exactly: www.tanzimaislam.com  (Section 7)
│   ├── 404.html               # friendly fallback for any un-preserved old path
│   ├── robots.txt             # AI-discoverability directives
│   ├── llms.txt               # AI crawler hints — PERSON-focused (Section 6)
│   ├── sitemap.xml            # lists all four page URLs (Section 6)
│   ├── headshot.jpg           # PI photo (drop-in)
│   └── cv.pdf                 # downloadable CV (drop-in; or link to hosted CV)
├── contents/
│   ├── profile.json           # name, titles, bio, social links, stat numbers, lab links
│   ├── funding.json           # "Research and Other Fundings" list
│   ├── awards.json            # Awards & Honors
│   ├── teaching.json          # courses taught
│   ├── service.json           # organizer/chair/PC/reviewer/leadership + proposal panels
│   ├── talks.json             # invited talks, workshops, panels
│   └── membership.json        # professional memberships (TPDS board, ACM, IEEE, BWCSE)
├── images/                    # any personal images referenced by JSON
├── src/
│   ├── pages/
│   │   ├── Home.tsx           # composes the Home sections
│   │   ├── Research.tsx       # landing + button -> lab #research
│   │   ├── Publications.tsx   # landing + button -> lab #publications
│   │   └── Teaching.tsx       # Teaching + Service/Leadership + Panels + Talks + Membership
│   ├── components/
│   │   ├── NavBar.tsx         # shared; 4 cross-page links, active page highlighted, theme toggle
│   │   ├── Footer.tsx         # shared; canonical link + socials
│   │   ├── Hero.tsx           # Home hero (name, title, headshot, quick links)
│   │   ├── About.tsx          # first-person bio + Per4ML lab blurb + optional stat counters
│   │   ├── Awards.tsx
│   │   ├── Funding.tsx
│   │   ├── LabCta.tsx         # reusable "Continue to the Per4ML Lab →" card/button
│   │   ├── SectionList.tsx    # generic titled bulleted list (service, talks, teaching, membership)
│   │   └── Contact.tsx
│   ├── data/
│   │   └── loadContent.ts     # typed loaders for the contents/*.json files
│   ├── entries/
│   │   ├── home.tsx           # mounts <Home/>   into index.html
│   │   ├── research.tsx       # mounts <Research/> into research.html
│   │   ├── publications.tsx   # mounts <Publications/> into publications.html
│   │   └── teaching.tsx       # mounts <Teaching/> into teaching.html
│   ├── index.css              # palette + fonts + dark-mode (shared)
│   └── shell.tsx              # <Shell> = NavBar + <main> + Footer, wraps every page
├── vite.config.ts             # base:'/', rollupOptions.input = the 4 HTML entries
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── deploy.yml         # adapted from Per4ML (no Python)
```

> No `scripts/`, no `requirements.txt`, no derived `src/data/*.json`, no `bib2json.py`. Publications
> are linked out, so the build stays Node-only and network-free.

### 2.1 Why multi-page instead of one scroll page
A single-page app has one URL (`/`) plus in-page `#anchors`. That would make
`/research.html` a **404** — exactly the failure this project exists to prevent. Separate HTML entry
points give each nav item a real, indexable, bookmarkable URL that matches the old site.

### 2.2 Vite multi-page config (the mechanism)
```ts
// vite.config.ts (essentials)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index:        resolve(__dirname, 'index.html'),
        research:     resolve(__dirname, 'research.html'),
        publications: resolve(__dirname, 'publications.html'),
        teaching:     resolve(__dirname, 'teaching.html'),
      },
    },
  },
});
```
Each root HTML file loads its matching entry module, e.g. `research.html` contains
`<script type="module" src="/src/entries/research.tsx"></script>`. `vite build` then emits
`dist/research.html`, `dist/publications.html`, `dist/teaching.html`, and `dist/index.html`.

### 2.3 `public/404.html`
A styled fallback (same nav + "That page moved — here's where to go" with links to the four real
pages and the lab). Catches any old indexed path not preserved as an entry point, so even misses stay
friendly and on-brand rather than a raw GitHub 404.

---

## 3. Page-by-Page Layout

Every page shares the same sticky `NavBar` (4 links, active page highlighted, theme toggle) and
`Footer`. `NavBar` links are **real cross-page `<a href>`** (`/`, `/research.html`,
`/publications.html`, `/teaching.html`) — not scroll anchors.

Content mapping is taken from the current site's sections (the PI's screenshots):

### 3.1 `index.html` — **Home**
Single-column editorial scroll of the personal, non-lab content:
1. **Hero** — **Tanzima Z. Islam**, title line ("Associate Professor of Computer Science, Texas State
   University · Director, Per4ML Lab"), one-line positioning, headshot, quick-link icon row
   (CV · Google Scholar · DBLP · Email · GitHub · LinkedIn · **Per4ML Lab →**).
2. **About / Bio** — first-person bio (the "Tanzima Islam earned her Ph.D. …" paragraph, rewritten to
   first person), including the BWCSE co-founder note with a link. Optional animated stat counters
   (publications, `$4.6M+` funding, years active, students mentored) — numbers from `profile.json`.
3. **Per4ML Laboratory** — the lab blurb ("I lead the Per4ML laboratory …") ending in a prominent
   **`LabCta`** button to `https://per4ml.github.io`.
4. **Awards & Honors** — from `awards.json` (NSF CAREER 2025, DOE Early Career 2022, R&D 100, etc.).
5. **Research & Other Fundings ($4.6M+)** — from `funding.json` (the grant list).
6. **Contact** — email, office, CV button, prospective-student note. Then `Footer`.

> Funding + Awards live on Home because they are *personal* (about her), not lab-group content, so
> there is no lab equivalent to be redundant with.

### 3.2 `research.html` — **Research** (landing + funnel)
- Nav + `Footer` (so the URL is a real, styled page, not a bare redirect).
- Short first-person line: "My research program lives in the Per4ML Lab."
- Optional 2–3 sentence positioning summary (data-efficient ML for HPC) — enough for SEO/context.
- Prominent **`LabCta`**: **"View my research at the Per4ML Lab →"** → `https://per4ml.github.io/#research`.

### 3.3 `publications.html` — **Publications** (landing + funnel)
- Same shape as Research.
- Line: "My publications are maintained on the Per4ML Lab site."
- Prominent **`LabCta`**: **"See all publications at the Per4ML Lab →"** →
  `https://per4ml.github.io/#publications`. Optionally also list Google Scholar + DBLP buttons.

### 3.4 `teaching.html` — **Teaching & Leadership**
All the service/teaching content from the current site, grouped with `SectionList`:
1. **Teaching** — course list from `teaching.json` (term-tagged, e.g. "[Sprg'21–'24] HPC@Scale").
2. **Organizer / Committee Member / Reviewer / Leadership** — from `service.json`.
3. **Proposal Review Panels** — from `service.json` (DOE ECRP, NSF CISE/OAC, …).
4. **Invited Talks, Workshops, Panels** — from `talks.json`.
5. **Membership** — from `membership.json` (TPDS Board 2020–present, ACM, IEEE, Founder BWCSE).

---

## 4. Visual Design — Complementary & Distinct

Direction: **"Editorial Academic"** — a light, typography-forward theme (which matches the PI's
current clean serif look) with one confident accent and a first-class dark mode. Harmonious with, but
distinct from, the lab's dark-navy/teal.

**Color palette (CSS variables in `src/index.css`):**
```css
:root {
  --bg:      #faf8f4;  /* warm paper / off-white */
  --surface: #ffffff;  /* cards */
  --ink:     #1a1a2e;  /* primary text */
  --muted:   #5b6270;  /* secondary text */
  --accent:  #6d28d9;  /* deep violet — personal signature accent */
  --accent-2:#c2410c;  /* warm ember — sparing highlights (awards, active nav) */
  --border:  #e7e2d8;  /* subtle warm borders */
}
:root[data-theme="dark"] {
  --bg:#14131a; --surface:#1d1b26; --ink:#ece9f3; --muted:#a0a0b0;
  --accent:#a78bfa; --accent-2:#fb923c; --border:#2a2833;
}
```
> Swap the violet accent for a deep teal if a tighter tie to the lab is preferred — a one-line change.

**Typography:** display/headings **Fraunces** (or **Newsreader**) — a modern serif matching her
current site; body/UI **Inter**; mono/tags **JetBrains Mono**. Self-hosted (`@fontsource`) — no
external font CDN.

**Motion:** `motion` for fade-in + slide-up on scroll; stat counters animate 0→target on first
viewport entry. Respect `prefers-reduced-motion`.

**Accessibility:** WCAG AA in both themes; `alt` on all images; keyboard-navigable nav; visible focus
rings; theme toggle persists via `data-theme` on `<html>` (no external storage lib — inline script in
each HTML `<head>` to set the attribute before paint, avoiding a flash).

---

## 5. Relationship to the Per4ML Lab Site — Redirect-Out

**Principle: the personal site never re-renders group-level content — it links to the lab's section
for each.**

### 5.1 Deep-link map
Base: `https://per4ml.github.io` (the lab's canonical host; it has no custom domain of its own — see
Section 7.6).

| Personal touchpoint | Navigates to | Rendered here? |
|---|---|---|
| `research.html` `LabCta` + nav | `https://per4ml.github.io/#research` | No — link only |
| `publications.html` `LabCta` + nav | `https://per4ml.github.io/#publications` | No — link only |
| Home "Per4ML Laboratory" button | `https://per4ml.github.io` | No — link only |
| (optional) News / Team / Projects / Funding on lab | `…/#news` etc. | No — link only |

### 5.2 What stays on the personal site
Hero, Bio, Awards, Funding list, Teaching, Service/Leadership, Proposal panels, Invited talks,
Membership, Contact/CV. None has a lab-site equivalent → nothing to be redundant with.

### 5.3 Cross-repo dependency (verify)
`per4ml.github.io/#publications` only scrolls to that section if the lab SPA honors the incoming hash
on initial load. Native anchors usually handle it, but SPA hydration can scroll-reset. **Verify** by
opening each deep link in a fresh tab; if any doesn't land, add a small "scroll to `location.hash`
after mount" effect in the lab's `App.tsx` (tracked in the Per4ML repo).

### 5.4 Landing vs. instant redirect (chosen: landing)
`research.html` / `publications.html` are **content landing pages with a button** — better for SEO
(the preserved URL still carries real, indexable text) and less jarring. To switch a page to an
**instant** redirect instead, add to its `<head>`:
`<meta http-equiv="refresh" content="0; url=https://per4ml.github.io/#research">`. Keep the visible
link as a no-JS fallback.

---

## 6. AI Discoverability & SEO (Person-Focused)

Entity is a **Person**. Goal: AI systems and search cite Dr. Islam and link to
**www.tanzimaislam.com**, and the migration preserves existing ranking.

### 6.1 `public/robots.txt`
```
User-agent: *
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://www.tanzimaislam.com/sitemap.xml
```

### 6.2 `public/sitemap.xml`
List all four canonical page URLs (`/`, `/research.html`, `/publications.html`, `/teaching.html`) so
search engines re-crawl the preserved paths quickly after the DNS cutover.

### 6.3 `public/llms.txt` (person-focused, canonical www)
```
# Tanzima Z. Islam — Personal Website

Dr. Tanzima Z. Islam is an Associate Professor of Computer Science at Texas State University and
director of the Per4ML laboratory. Her research develops data-efficient AI/ML methods for
high-performance computing (HPC): few-shot performance modeling, cross-system transfer learning,
multimodal HPC analytics, and generative AI for performance data synthesis.

Awards: NSF CAREER (2025), DOE Early Career (2022), R&D 100 (2019).
Funding: $4.6M+ from NSF, DOE, AMD, and national labs (LLNL, BNL, ORNL, NERSC/LBNL).
Community: co-founder, Bangladeshi Women in Computer Science and Engineering (BWCSE).

Website: https://www.tanzimaislam.com
Lab (research, publications, news, team, projects): https://per4ml.github.io
Google Scholar: https://scholar.google.com/citations?user=q56uneAAAAAJ&hl=en
Contact: tanzima@txstate.edu
```

### 6.4 Per-page `<head>` (in each of the four HTML files)
- Unique `<title>` and `<meta name="description">` per page.
- `<link rel="canonical">` pointing at that page's own `www.tanzimaislam.com/...` URL.
- Open Graph (`og:type=profile` on Home, `og:title/description/image/url`) + `twitter:card`.
- **JSON-LD `Person`** on Home:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tanzima Z. Islam",
  "jobTitle": "Associate Professor of Computer Science",
  "affiliation": { "@type": "CollegeOrUniversity", "name": "Texas State University" },
  "url": "https://www.tanzimaislam.com",
  "email": "mailto:tanzima@txstate.edu",
  "sameAs": [
    "https://per4ml.github.io",
    "https://scholar.google.com/citations?user=q56uneAAAAAJ&hl=en",
    "https://dblp.org/pers/hd/i/Islam:Tanzima_Zerin"
  ],
  "knowsAbout": ["HPC performance modeling","data-efficient machine learning",
    "few-shot learning","transfer learning","AI for systems","scientific computing"]
}
```

### 6.5 Semantic HTML
`<main>/<section>/<article>/<header>/<nav>/<footer>`; one `<h1>` per page; correct heading order.

---

## 7. Deployment & Custom Domain (GitHub Pages + GoDaddy DNS)

Model: **develop & push to GitHub → GitHub Pages builds & serves → GoDaddy DNS makes
`tanzimaislam.com` resolve to it.** GoDaddy is DNS-only. No Wix. This mirrors Per4ML's flow.

### 7.1 GitHub Actions workflow (`.github/workflows/deploy.yml`)
Adapt Per4ML's `deploy.yml`, **removing the Python setup/install/prebuild steps** (not needed):
`on: push: branches:[main]` (+ `workflow_dispatch`) → checkout → setup-node 22 (`cache:npm`) →
`npm ci` → `npm run build` → `configure-pages` → `upload-pages-artifact` (path `dist`) →
`deploy-pages`. Permissions `pages:write, id-token:write, contents:read`; concurrency group `pages`.

### 7.2 CNAME
- `public/CNAME` = exactly `www.tanzimaislam.com` (Vite copies `public/` into `dist/`, so every deploy
  re-ships it and Pages keeps the domain bound).
- Set once in UI: **Settings → Pages → Custom domain → `www.tanzimaislam.com` → Save**.

### 7.3 GoDaddy DNS records (registrar side)
In GoDaddy → tanzimaislam.com DNS:
- **`www` CNAME → `tzislam.github.io`** (canonical host record).
- **Apex `@` A records → GitHub Pages IPs:** `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153` (so the bare domain redirects to `www`).
- **Apex `@` AAAA (IPv6, recommended):** `2606:50c0:8000::153`, `2606:50c0:8001::153`,
  `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- **Remove GoDaddy parking / "Forwarding" records** for `@`/`www` that conflict (the usual cause of a
  custom domain not resolving). **Also remove any leftover Wix DNS records** pointing to Wix servers.

### 7.4 HTTPS & canonical redirects
After DNS propagates (up to ~48h), GitHub auto-provisions a Let's Encrypt cert → check **Enforce
HTTPS**. GitHub then 301-redirects `tzislam.github.io` → `www.tanzimaislam.com` and bare
`tanzimaislam.com` → `www.tanzimaislam.com`. Belt-and-suspenders: per-page `rel=canonical` + `og:url`.

### 7.5 Verification of domain wiring
```
dig +short www.tanzimaislam.com          # -> tzislam.github.io. (CNAME)
dig +short tanzimaislam.com              # -> the four 185.199.108–111.153 A records
curl -sI https://tzislam.github.io/      # -> 301 -> https://www.tanzimaislam.com/
curl -sI https://tanzimaislam.com/       # -> 301 -> https://www.tanzimaislam.com/
curl -sI https://www.tanzimaislam.com/research.html      # -> 200
curl -sI https://www.tanzimaislam.com/publications.html  # -> 200
curl -sI https://www.tanzimaislam.com/teaching.html      # -> 200
```

### 7.6 ⚠️ CNAME conflict to resolve first (blocker)
`Per4ML/public/CNAME` currently contains **`www.tanzimaislam.com`**. A custom domain can be bound to
**only one** GitHub Pages site. If both the lab repo and this personal repo claim
`www.tanzimaislam.com`, the domain will not attach here. **Before wiring DNS:** remove/blank the
custom domain on the Per4ML repo (delete `Per4ML/public/CNAME` and clear Settings → Pages → Custom
domain there) so the lab stays at `per4ml.github.io`, and let **only** `tzislam.github.io` own
`www.tanzimaislam.com`. *Confirm with the PI which site the domain should serve — this plan assumes
the personal site.*

---

## 8. Stat Numbers (no build-time data pipeline)
Because publications/news are linked out, there is no build-time fetch. Any Home counters read plain
numbers from `contents/profile.json`, e.g.
`{ "stats": { "publications": 90, "funding": "$4.6M+", "years_active": 12, "students_mentored": 15 } }`.
The PI edits these occasionally.

---

## 9. Implementation Phases (execute in order, after approval)

### Phase 1 — Scaffold & deploy an empty shell (prove the pipeline first)
1. `npm create vite@latest` (React + TS) in the repo; `base:'/'`.
2. Deps (match Per4ML): `@tailwindcss/vite tailwindcss motion lucide-react` +
   `@fontsource/inter @fontsource/fraunces @fontsource/jetbrains-mono`.
3. Create the **four** root HTML entries + `vite.config.ts` `rollupOptions.input` (Section 2.2), each
   loading a placeholder entry module.
4. Add `deploy.yml` (Section 7.1) and `public/CNAME`.
5. Ship four "Hello from <page>" pages → push → confirm Actions is green and all four URLs load on
   `tzislam.github.io` (`/`, `/research.html`, `/publications.html`, `/teaching.html`) **before**
   wiring the domain.
6. Resolve the CNAME conflict (Section 7.6), then do Section 7.2–7.4 → verify Section 7.5.

> Rationale: get a trivially-correct multi-page deploy + all four preserved URLs working end-to-end
> before adding real UI, so later failures are about the app, not the pipeline.

### Phase 2 — Content files
Create `contents/{profile,funding,awards,teaching,service,talks,membership}.json` with real seed
content lifted from the current site (screenshots) and rewritten to first person. Nothing hardcoded
in TSX. Add the lab deep-links + stat numbers to `profile.json`.

### Phase 3 — Shared shell
`src/index.css` (palette + fonts + dark-mode), `src/shell.tsx` (`NavBar` + `<main>` + `Footer`),
`NavBar.tsx` (4 cross-page links, active-page highlight from `window.location.pathname`, theme
toggle), `Footer.tsx`, per-page `<head>` blocks (title/description/canonical/OG; JSON-LD on Home),
`robots.txt`, `llms.txt`, `sitemap.xml`, `404.html`.

### Phase 4 — Pages (build each, verify render, then compose)
`Home.tsx` (Hero → About → Per4ML blurb → Awards → Funding → Contact) → `Research.tsx` (landing +
`LabCta`) → `Publications.tsx` (landing + `LabCta`) → `Teaching.tsx` (Teaching → Service → Panels →
Talks → Membership). Reusable `LabCta`, `SectionList`.

### Phase 5 — Cross-repo deep-link check
Open the lab deep links (Section 5.1) in fresh tabs; confirm each scrolls to its section. If not,
file the lab-side hash-on-load fix in the Per4ML repo (Section 5.3).

### Phase 6 — Polish, SEO & migration audit
Scroll animations (respect reduced-motion); responsive at 320/768/1440; `npm run build` clean;
Lighthouse Perf ≥ 90 / A11y ≥ 95 / SEO ≥ 95; **confirm the full list of old indexed URLs (Section
1.1) is either a real page or handled by `404.html`**; submit the new `sitemap.xml` in Google Search
Console after cutover.

---

## 10. Explicit Constraints
1. **Preserve the indexed URLs** — `research.html`, `publications.html`, `teaching.html` must be real
   pages at the domain root. Never let them 404.
2. **Multi-page build** — four HTML entry points in `rollupOptions.input`; no single-page-only routing
   that collapses everything to `/`.
3. **Zero redundancy with the lab** — research/publications/news/team/projects are linked, never
   rendered here.
4. **Never hardcode content** in components — all text from `contents/*.json`.
5. **`base:'/'`** (user Pages site at domain root). No subpath base.
6. **Pure Node/Vite build** — no Python, no build-time network calls. Do NOT copy Per4ML's
   `bib2json.py` / `generate_seo.py` / `requirements.txt`.
7. **Keep `public/CNAME`** (`www.tanzimaislam.com`) in every deploy; and ensure the Per4ML repo no
   longer claims that domain (Section 7.6).
8. **First-person voice** throughout.
9. **Lab links are real `<a href>`** to `https://per4ml.github.io/#<section>`, marked with ↗.
10. **No backend / no browser storage** — fully static, Actions-deployed. (Theme via `data-theme`
    attribute + inline head script is fine; no `localStorage` requirement.)
11. **TypeScript strict**; no `any` without a justified `// eslint-disable`.

---

## 11. Verification Checklist (run before declaring done)
- [ ] GitHub Actions run is green; `dist/` deploys.
- [ ] `dist/` contains `index.html`, `research.html`, `publications.html`, `teaching.html`.
- [ ] `dist/CNAME` present and equals `www.tanzimaislam.com`.
- [ ] Per4ML repo no longer binds `www.tanzimaislam.com` (Section 7.6); lab still live at
      `per4ml.github.io`.
- [ ] `https://www.tanzimaislam.com/` loads over valid HTTPS; `tzislam.github.io` and bare
      `tanzimaislam.com` both 301 to it.
- [ ] **All three preserved URLs return 200**, not 404:
      `/research.html`, `/publications.html`, `/teaching.html` (Section 7.5).
- [ ] `npm run build` exits 0; `npm run dev` renders every page with no console errors.
- [ ] NavBar appears on all four pages, highlights the current page, links across pages, theme toggle
      works.
- [ ] Home shows Hero, Bio, Per4ML blurb, Awards, Funding, Contact. Teaching page shows Teaching,
      Service/Leadership, Proposal Panels, Invited Talks, Membership.
- [ ] Research & Publications pages each render nav + content + a working `LabCta` button to the
      correct lab section, which lands on that section (Section 5.3).
- [ ] No publications list, news feed, team roster, or project cards rendered here (redundancy check).
- [ ] `robots.txt` allows GPTBot + ClaudeBot; `llms.txt` present; `sitemap.xml` lists all four URLs;
      JSON-LD `Person` in Home; each page has a unique `<title>` + `rel=canonical`.
- [ ] `public/404.html` present and styled.
- [ ] Lighthouse SEO ≥ 95, Accessibility ≥ 95. No TypeScript errors. Dark mode passes AA.

---

## 12. Seed Content Pointers (from the current site / screenshots)
- **Bio / About:** the "Tanzima Islam earned her Ph.D. …" + BWCSE paragraphs → first person → Home.
- **Per4ML Laboratory:** the "I lead the Per4ML laboratory …" blurb → Home, ending in `LabCta`.
- **Funding:** "Research and Other Fundings (PI/Co-PI; $4.6M+)" list → `funding.json`.
- **Awards:** "Awards & Honors" list → `awards.json`.
- **Teaching:** the course list → `teaching.json`.
- **Service/Leadership + Proposal Panels:** "Organizer/Committee Member/Reviewer/Leadership" and
  "Proposal Review Panel" lists → `service.json`.
- **Invited talks:** "Invited Talks, Workshops, Panels" list → `talks.json`.
- **Membership:** "Member" list (TPDS Board, ACM, IEEE, Founder BWCSE) → `membership.json`.
- **Research / Publications page bodies:** short first-person intro only — the substance is linked to
  the Per4ML lab, not seeded here.
