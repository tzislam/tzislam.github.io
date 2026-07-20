# tanzimaislam.com — personal website

The personal academic website of **Dr. Tanzima Z. Islam**, developed in this repo, pushed to GitHub,
served on GitHub Pages, and shown to visitors at **https://www.tanzimaislam.com** via GoDaddy DNS.

It is a small **multi-page** site. Each page is a real URL so the links already indexed by Google
keep working after moving off Wix:

| Page | URL | What it is |
|---|---|---|
| Home | `/` (`index.html`) | Bio, awards, funding, Per4ML lab, contact |
| Research | `/research.html` | **Instant redirect** → `per4ml.github.io/#research` |
| Publications | `/publications.html` | **Instant redirect** → `per4ml.github.io/#publications` |
| Teaching & Leadership | `/teaching.html` | Teaching, service, panels, talks, membership |

**Stack:** React 19 + Vite 6 + TypeScript (same as the Per4ML lab site). No database, no backend —
it builds to plain static files.

---

## 1. One-time setup (new computer)

You need **Node.js 20 or newer** (includes `npm`). Check with `node -v`. If missing, install from
<https://nodejs.org> (LTS).

Then, in this folder, install dependencies once:

```bash
npm install
```

---

## 2. Where to change what

**You almost never touch the code.** Content lives in two easy places:

### 2a. Lists → the CSV files in `contents/`
Open any of these in **Excel, Numbers, or Google Sheets**, add/edit a **row**, and **Save as CSV**.
The row order in the file is the order shown on the page.

| File | Section on the site | Columns |
|---|---|---|
| `contents/awards.csv` | Awards & Honors (Home) | `text`, `highlight` |
| `contents/funding.csv` | Research & Other Fundings (Home) | `text`, `highlight`, `new` |
| `contents/teaching.csv` | Teaching (Teaching page) | `text` |
| `contents/service.csv` | Organizer / Committee / Reviewer / Leadership | `text` |
| `contents/panels.csv` | Proposal Review Panels | `text` |
| `contents/talks.csv` | Invited Talks, Workshops, Panels | `text` |
| `contents/membership.csv` | Membership | `text` |

Column meaning:
- **`text`** — the full entry text. Just type it normally; the spreadsheet handles commas/quotes.
- **`highlight`** — put `true` to make the row **bold** with an accent bullet (for signature items).
  Leave blank otherwise.
- **`new`** — (funding only) put `true` to show an orange **NEW** badge. Leave blank otherwise.

> Editing the raw file in a plain text editor instead of a spreadsheet? Then any `text` containing a
> comma must be wrapped in double quotes, and a literal `"` inside it must be doubled (`""`). A
> spreadsheet does this for you automatically — that's the easy path.

### 2b. Identity, bio, links, stats → `contents/profile.json`
This one is JSON (structured, not a list). Open in any text editor and edit the values:
- `name`, `title`, `subtitle`, `tagline`
- `bio` — an array of paragraphs (the About section)
- `labBlurb` — the Per4ML paragraph on the Home page
- `links` — Scholar, DBLP, GitHub, LinkedIn URLs
- `stats` — the four number cards in the hero
- `email`, `office`, `cv`, `bwcse`

Keep the quotes and commas intact. If unsure, change only the text **between** the quotes.

### 2c. Your photo and CV → `public/`
- **Photo:** replace `public/headshot.jpg` with your image (keep the same filename). Square works best.
- **CV:** drop a `public/cv.pdf` into the folder and the "CV" / "Download CV" buttons will work.
  (Prefer linking a hosted CV instead? Change `"cv"` in `profile.json` to that URL.)

### 2d. Section titles / where things point (rare)
- **Rename a section heading** (e.g. "Awards & Honors"): edit `src/data/loadContent.ts` — the headings
  are near the bottom of that file.
- **Change where Research/Publications redirect:** edit `public/research.html` and
  `public/publications.html` (both the `<meta http-equiv="refresh">` URL and the `window.location`
  line).
- **Colors / dark mode / fonts:** edit `src/index.css` (the `:root` block at the top).

---

## 3. Check it on your local machine (before pushing)

Start the live preview:

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser. This auto-refreshes as you edit files, so you can
tweak a CSV and watch the page update.

**Checklist while previewing:**
- [ ] Home shows your photo, bio, awards, and funding correctly.
- [ ] Teaching page shows all five sections.
- [ ] Clicking **Research** / **Publications** in the nav jumps to the Per4ML lab.
- [ ] The moon/sun button toggles dark mode.
- [ ] Narrow the window (or view on your phone) — layout still looks good.

Stop the server with **Ctrl+C** in the terminal.

**Optional — see the exact production build** (what visitors get):
```bash
npm run build      # creates the dist/ folder
npm run preview    # serves dist/ at http://localhost:4173
```

**Optional — catch mistakes:**
```bash
npm run lint       # type-check; should print nothing and exit cleanly
```

---

## 4. Deploy / publish your changes

Deployment is automatic: **push to GitHub → GitHub Actions builds → the site goes live** at
`www.tanzimaislam.com` (usually within ~1–2 minutes).

```bash
git add -A
git commit -m "Update funding and awards"   # describe your change
git push
```

That's the whole routine for day-to-day updates. Watch the build under the repo's **Actions** tab; a
green check means it's live.

> The build command and steps live in `.github/workflows/deploy.yml`. You don't need to run it — GitHub
> runs it for you on every push to `main`.

### First-time / infrastructure setup (only once)
These are one-time steps to connect the domain. If the site is already live at
`www.tanzimaislam.com`, you can ignore this section.

1. **Repo:** this project lives at `github.com/tzislam/tzislam.github.io`, branch `main`.
2. **GitHub Pages:** repo **Settings → Pages** → Source: *GitHub Actions*. Set **Custom domain** to
   `www.tanzimaislam.com` and **Enforce HTTPS**.
3. **`public/CNAME`** already contains `www.tanzimaislam.com` — it must stay; every deploy ships it so
   the domain stays attached.
4. **Only one site may own the domain.** The Per4ML lab repo must **not** also claim
   `www.tanzimaislam.com` (remove its `public/CNAME` + clear its Pages custom domain). Per4ML stays at
   `per4ml.github.io`.
5. **GoDaddy DNS** (in the tanzimaislam.com DNS panel):
   - `www` **CNAME** → `tzislam.github.io`
   - apex `@` **A records** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (optional) apex `@` **AAAA** → `2606:50c0:8000::153` … `:8003::153`
   - remove old Wix / parking / forwarding records for `@` and `www`.
6. Wait for DNS to propagate (minutes–48h), then GitHub issues the HTTPS certificate automatically.

Full details and verification commands are in `PLAN2.md` (§7).

---

## 5. AI & search discoverability

The site is built so that search engines and AI assistants (ChatGPT, Claude, Gemini, Perplexity) can
find, read, and recommend Dr. Islam for her research topics. What's in place:

- **`public/llms.txt`** — a clean, quotable summary written for AI systems: who she is, her research
  topics, named projects, awards, and authoritative links. *Update this when your focus changes.*
- **`public/robots.txt`** — explicitly allows the major AI crawlers (GPTBot, ClaudeBot, anthropic-ai,
  Google-Extended) plus normal search engines, and points to the sitemap.
- **`public/sitemap.xml`** — lists all four page URLs so they get crawled.
- **JSON-LD `Person` structured data** (in `index.html`) — machine-readable name, title, affiliation,
  education, awards, `sameAs` profile links, and `knowsAbout` research topics.
- **Per-page `<title>`, `<meta name="description">`, and `<meta name="keywords">`** — with the terms
  people (and models) actually search for.
- **Canonical URLs + Open Graph tags** — so links unfurl nicely and the `www` domain is the one
  indexed.
- **Real, crawlable text** — the bio and lists are actual page text, not images, so they're readable.

**To strengthen it over time:**
- Keep `llms.txt` and the `keywords` meta current with your latest topics and project names.
- After the domain goes live, add the site in **Google Search Console** and submit `sitemap.xml`
  (this is also how you confirm your *old* indexed URLs — anything not listed in §top table is caught
  by the friendly `public/404.html`).
- Make sure your Google Scholar, DBLP, and LinkedIn profiles link back to `www.tanzimaislam.com`
  (bidirectional links reinforce the `sameAs` graph).

> Honest expectation: these are the right, standard techniques and they materially improve how often
> and how accurately you're surfaced — but no site can *guarantee* a specific assistant always
> recommends you. Fresh content, real inbound links (Scholar/DBLP/lab/news), and keeping publications
> current on the Per4ML site matter as much as the on-page markup.

---

## 6. Project structure (reference)

```
.
├── index.html / teaching.html        # real page entry points (SEO <head> lives here)
├── public/
│   ├── research.html, publications.html   # static instant-redirect pages
│   ├── CNAME                         # www.tanzimaislam.com (keep!)
│   ├── headshot.jpg, cv.pdf          # your photo + CV (drop-ins)
│   ├── robots.txt, llms.txt, sitemap.xml, 404.html
├── contents/                         # ← YOU EDIT THESE
│   ├── profile.json                  # identity, bio, links, stats
│   └── *.csv                         # awards, funding, teaching, service, panels, talks, membership
├── src/
│   ├── pages/                        # Home, Teaching page layouts
│   ├── components/                   # NavBar, Hero, About, sections, footer…
│   ├── data/loadContent.ts           # loads JSON+CSV, holds section headings
│   ├── entries/                      # mounts each page
│   └── index.css                     # colors, fonts, dark mode, layout
├── .github/workflows/deploy.yml      # auto-build & deploy on push
├── vite.config.ts                    # multi-page build config
├── PLAN2.md                          # full design + deployment plan
└── README.md                         # this file
```

---

## 7. Troubleshooting

- **A CSV edit doesn't show up / page looks broken after editing a CSV:** you probably have an unquoted
  comma. Re-save from a spreadsheet app (it quotes automatically), or wrap the whole `text` cell in
  double quotes.
- **`npm run dev` says port 3000 in use:** an old preview is still running — close it, or run
  `npm run dev -- --port 3001`.
- **CV button 404s:** add `public/cv.pdf` (see §2c).
- **Photo not updating:** confirm the file is named exactly `public/headshot.jpg`, then hard-refresh
  the browser (Cmd/Ctrl+Shift+R).
- **Site not loading at the domain:** check the DNS records and CNAME in §4; DNS changes can take a
  while. Verify with the commands in `PLAN2.md` §7.5.
