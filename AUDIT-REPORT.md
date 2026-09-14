# AUDIT REPORT — geraldgyimah.com

**Date:** 7 September 2026
**Auditor:** sbharvadiya
**Branch:** `staging` (created from `master`; `master` and the live site untouched)
**Scope:** Phase 1 — audit only. No fixes applied.

---

## 0. Executive summary

The site is **structurally sound and builds clean**. The layout is well-made: no responsive breaks at any tested width, no broken links, no exposed secrets, sensible security headers, and genuinely good SEO/JSON-LD work.

The problems are concentrated in one area: **images and the CMS wiring behind them.**

Three findings need attention before anything else:

1. **The homepage "About" photo is a stock image of a man who is not Gerald Gyimah.** It is a bundled placeholder shipped by the previous developer and it is live right now.
2. **The /about page right-hand column is entirely empty** — two large grey boxes labelled "PORTRAIT" and "ON SET, UNDATED". This is the blank space referred to in the brief. It is live at every screen size.
3. **Hotspot/focal-point does not work anywhere on the site.** The control is switched on in the Studio, so Gerald can drag the focal point — but the site ignores it completely. It is wired up in a way that looks functional and is not.

Confirmed: **this is a separate Sanity project from stillroomproductions.com**, not a shared one.

---

## 1. Sanity project — separate, not shared

The brief asked to confirm whether the Sanity project is shared with stillroomproductions.com. **It is not.**

| | Gerald | Still Room |
|---|---|---|
| Project ID | `yi82r3c7` | `tk6o47ip` |
| Dataset | `production` | `production` |
| Document types | `project`, `sanity.imageAsset` | `project`, `sanity.imageAsset`, `siteSettings` |

Two independent Sanity projects with separate content. They must be managed separately — a change to one has no effect on the other. Note that Still Room already has a `siteSettings` singleton; Gerald's project does not (see §4).

**Dataset visibility:** the `production` dataset on both projects is **publicly readable** without a token. This is normal and expected for a public website (the front end reads it anonymously), and no private data is stored in it. Flagging for awareness, not as a defect.

---

## 2. Security & ownership

### Clean — no action needed

- **No exposed secrets, API keys, or hardcoded credentials.** Write tokens are correctly read from `process.env` (`SANITY_WRITE_TOKEN`, `SANITY_API_TOKEN`) and never committed.
- **No `.env` file has ever been committed** — verified across full git history.
- **No previous-developer personal info** in the shipped code (no names, emails, or personal accounts in source).
- **Security headers are properly configured** in `next.config.ts`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection`. `poweredByHeader` is disabled.
- **`robots.ts` correctly disallows `/studio`.**
- **No debug endpoints or dev routes.** No `/api/*` routes exist at all. No `console.log` in shipped page code.

### Findings

**S1 — `scripts/seed-sanity.ts` can destroy live content. (HIGH)**
The script targets the **production** dataset with hardcoded `projectId: "yi82r3c7"` and calls `client.createOrReplace(...)` on four documents with fixed `_id`s. Its seed data is the previous developer's **placeholder content** — wrong titles ("Protocol" as a Feature Film), wrong loglines, and `credits` with literal `"—"` em-dash names.

Two of its `_id`s (`project-consultation`, `project-assessment`) correspond to films that now hold real content. Anyone running `npx tsx scripts/seed-sanity.ts` with a token in their environment would **silently overwrite real client content with placeholder text.** There is no dry-run, no confirmation, and no dataset guard.

**S2 — Previous developer's commit history. (INFO — no action)**
All 40 commits are authored by `abdullahadwad` and `M Talha`. This is normal handover history and is not a defect. Noted only because the brief asked about previous-developer references. Their names appear only in git metadata, never in shipped code.

**S3 — Sanity Vision (GROQ query tool) is enabled in the production Studio. (LOW)**
`visionTool()` is loaded in `sanity.config.ts`. It sits behind Sanity's own authentication, so it is not publicly exposed, but it is a developer tool with no purpose for Gerald. Worth removing to simplify the Studio UI.

---

## 3. Build & code quality

### Build: passes clean

```
✓ Compiled successfully in 61s
✓ Generating static pages (15/15)
```

Zero errors, zero warnings. One informational notice about the edge runtime on the OG image route — expected and harmless.

### Lint: **`npm run lint` crashes. (MEDIUM)**

```
FATAL ERROR: Ineffective mark-compacts near heap limit
JavaScript heap out of memory
```

**Cause:** the `lint` script is bare `eslint` with no path, so it walks the committed `dist/` directory — a prebuilt Sanity Studio bundle containing multi-megabyte JS files. ESLint exhausts the 4GB heap trying to parse them.

The `dist/` and `.sanity/` directories (54 tracked files) are **build output that should never have been committed.** They are stale, bloat the repo, and break linting. A `.gitignore` update and removal was already staged as uncommitted work in the working tree.

When scoped correctly to `src/`, lint completes and reports **17 errors, 2 warnings** — all in `src/app/work/[slug]/page.tsx` (`no-explicit-any`, `ban-ts-comment`) plus two unused imports. These are code-hygiene issues, not bugs.

### C1 — Dead code with `@ts-ignore` for fields that do not exist. (MEDIUM)

`src/app/work/[slug]/page.tsx` contains fully-built, styled UI for four features suppressed behind `@ts-ignore`:

| Feature | Line | Schema field exists? |
|---|---|---|
| Trailer iframe (16:9) | ~400 | **No** |
| Short paragraph | ~447 | **No** |
| Awards & Laurels | ~493 | **No** |
| Press Kit PDF | ~514 | **No** |

None of these fields exist in the `project` schema, so **none of this UI can ever render.** The `@ts-ignore` comments exist specifically to silence TypeScript's correct complaint that the fields are absent.

This is directly relevant to Phase 2: the trailer and festivals/laurels sections are on the requested scope. The markup is a useful starting point, but each needs a real schema field behind it. Note the existing trailer `<iframe>` also passes `allow="autoplay"`, which contradicts the no-autoplay requirement, and injects `project.trailerUrl` directly as the iframe `src` with no URL validation.

### C2 — Unused files. (LOW)

- **`src/components/HeroSection.tsx`** — imported nowhere. Imports `@/assets/images/hero.jpg`, **a file that does not exist.** It survives only because nothing imports it; any attempt to use it fails the build. Contains hardcoded placeholder meta ("Active: 2014 — Present").
- **`src/assets/data.ts`** — the previous developer's hardcoded project array, fully superseded by Sanity. Only referenced in commented-out imports. Contains placeholder content: three of four films share the identical logline *"A film about the hours between..."*, and credits are literal `"—"`.
- **`src/sanity/env.ts`** — exports an `assertValue` helper that is never called.
- **Unused image assets:** `background1–4.png`, `stopdoor.jpg` (~93MB combined, `background3`/`background4` are 43MB each and byte-identical duplicates).

---

## 4. Image handling — the core problem area

### I1 — Hotspot/focal point is non-functional sitewide. (HIGH)

The schema enables it (`options: { hotspot: true }`) and the query requests it. **No component ever applies it.** There is no `objectPosition` anywhere in the codebase — verified by grep across all of `src/`.

The chain breaks in two independent places:

1. **The GROQ query selects `"url": asset->url`** — the raw, untouched original. Any crop rectangle set in the Studio is discarded server-side before the image reaches the page.
2. **Rendering uses `object-cover` with no `objectPosition`** — so every image is cropped dead-centre regardless of the hotspot value.

**Consequence for Gerald:** the Studio presents a working hotspot control. He can drag the focal point onto a face, save, and publish — and the site will look exactly the same. This is worse than not having the feature, because it fails silently.

**Pages affected:** all of them — homepage film grid (16:9), film detail stills (16:10), homepage About headshot, Directing band (16:9), atmospheric bands (21:9). The 21:9 bands crop most aggressively and need the hotspot most.

**Current hotspot data:** only 1 of 16 stills across the 8 films has a hotspot set — unsurprising, since setting one has no visible effect.

### I2 — The blank space is the /about right-hand column. (HIGH)

**Location:** `src/app/about/page.tsx`, lines ~196–243.

Two large containers render as empty grey boxes with only a text label:
- **"PORTRAIT"** — `aspect-3/4`, roughly 624×830px at 1440
- **"ON SET, UNDATED"** — `aspect-16/9`, roughly 624×350px at 1440

Both have their `<Image>` component **commented out**, referencing `@/assets/images/person1.jpg` and `person2.jpg` — **neither file exists in the repo.** The previous developer commented out the images rather than removing the containers, leaving the boxes behind.

This is roughly **60% of the visible area of the /about page** at desktop width, and it is live now. Confirmed on production at both 360px and 1440px. Screenshots captured.

**This is the blank space referenced in the brief** — and it needs two photos of Gerald, matching exactly the "one portrait, one working/behind-the-scenes shot" requirement in Phase 2.

### I3 — Hardcoded fallback images, including a stock photo of the wrong person. (HIGH — reputational)

The homepage imports four bundled images directly:

```
headshot.jpg      → About section
back3.jpeg        → Directing band
back1/back2.jpeg  → Atmospheric bands
```

The `headshot.jpg` currently live on the homepage About section is **a stock photograph of a white man who is not Gerald Gyimah.** Verified in the rendered page and on production.

This is the same class of reputational risk flagged on Still Room, and arguably more serious: it misrepresents the client's own identity on his personal portfolio homepage.

None of these four slots are editable in Sanity. Changing any of them currently requires a developer and a redeploy.

### I4 — Atmospheric bands read as blank space on load. (MEDIUM)

The two 21:9 bands near the bottom of the homepage are backed by **7.3MB and 7.9MB JPEGs**. On a cold cache the browser renders 1440×617px of empty cream while Next.js optimizes them — they eventually appear, but the first impression is two large blank bands.

Total bundled image weight: **23MB in `.next/static/media`**, of which 22.6MB is these three placeholder JPEGs. Once real images are moved into Sanity these files should be deleted entirely — Sanity's CDN handles resizing and format negotiation properly.

### I5 — Sanity images bypass proper sizing. (MEDIUM)

Because queries return `asset->url`, the browser receives full-resolution originals — **up to 4608×3164** on the live homepage. Next.js optimizes them at request time, but this wastes bandwidth and processing that Sanity's CDN would do better and cheaper via the image URL builder.

Additionally, the homepage film grid and `/work/[slug]` stills pass **no `sizes` attribute**, so Next generates srcsets against the full 3840px width regardless of the actual slot size.

### I6 — Alt text is required in schema but absent in content. (MEDIUM — accessibility/SEO)

The `stills` schema defines `alt` with `Rule.required().warning(...)` — a **warning, not an error**, so it never blocks publishing. Result: **0 of 16 stills across all 8 films have alt text.**

The film detail page falls back to a generated string, but the homepage grid uses `alt={project.title}` — the film's title as the alt text for a photograph, which is not descriptive.

### I7 — No awkward cropping found. (INFO)

Checked at all four breakpoints. Because every image is centre-cropped, no image is currently visibly mangled — the stills happen to be centre-weighted. This is luck, not design: the moment Gerald uploads a portrait-oriented photo or an off-centre composition, it will crop badly, with no way for him to correct it (see I1).

---

## 5. Content

### Pages: 4 static + 8 dynamic film pages

| Route | Type | Rendering | Status |
|---|---|---|---|
| `/` | Homepage | Dynamic | 200 |
| `/work` | Film index | Dynamic | 200 |
| `/about` | About | Dynamic | 200 |
| `/contact` | Contact | Static | 200 |
| `/work/[slug]` | Film detail (×8) | Dynamic | 200 |
| `/studio` | Sanity Studio | Static | 200 (auth-gated) |

**Films in Sanity (8, all real content):** On Record, Best Interests, Not Here, Protocol, The Consultation, Assessment, Next Time, I Dey.

All eight have genuine loglines, real cast/credits, and 2 stills each. **The film content is in good shape** — this is real, well-written material, not placeholder.

### Broken links: none

All external links resolve (IMDb, Old Vic, Instagram ×2, Still Room, YouTube). TikTok returned no response to automated checking — this is TikTok's standard bot-blocking, not a broken link.

### Content findings

**N1 — Three different contact emails across the site, none verified. (MEDIUM)**

| Page | Address |
|---|---|
| Homepage | `gerald@geraldgyimah.com` |
| Contact | `hello@geraldgyimah.com` |
| Contact | `press@geraldgyimah.com` |

The domain has valid MX records (`privateemail.com`), so these *may* all work — but three addresses for one person is inconsistent, and I cannot verify which are real mailboxes. **Needs Gerald's confirmation.** If one bounces, enquiries are silently lost.

**N2 — Placeholder Vimeo link. (MEDIUM — reputational)**
`src/app/contact/page.tsx` lists a Vimeo row with `href: "https://vimeo.com"` displayed as `/geraldgyimah`. It advertises a personal Vimeo profile and dumps the visitor on Vimeo's generic homepage. Either a real URL or removal.

**N3 — Duplicate `order` values break film sequencing. (MEDIUM)**
Four films share `order: 2` (Best Interests, Not Here, Protocol) and two have `order: null` (Next Time, I Dey). With `order(order asc, year desc)` the sequence is effectively arbitrary and can shift between requests. Gerald has no reliable way to control the order films appear in.

**N4 — Missing `year` on two films. (LOW)**
Next Time and I Dey have `year: null`. The /about "Selected Work" list renders the year directly, so a null would display as an empty column.

**N5 — Stale hardcoded slugs in sitemap fallback. (LOW)**
`src/app/sitemap.ts` falls back to `["on-record", "protocol", "consultation", "assessment"]` if Sanity is unreachable. Two of those (`protocol`, `consultation`) are real, but the list omits four films that now exist. The live sitemap is correct (it fetches successfully); this only bites during a Sanity outage.

**N6 — Homepage keyword meta contains speculative claims. (LOW — reputational)**
`src/app/layout.tsx` lists keywords including `"Gerald Gyimah EastEnders director"` and `"Protocol short film 2026"`. If Gerald has no EastEnders credit, this is a false association in the page metadata. **Needs confirmation.** (Note: `keywords` meta is ignored by Google, so this carries no SEO benefit — only risk.)

**N7 — Unused Sanity document types: none.** Only `project` exists and it is fully used. Nothing to clean up. (The `siteSettings` type referenced in Still Room does not exist here — it needs to be *created* in Phase 2, not removed.)

**N8 — Navbar hash-link scroll is fragile. (LOW)**
`Navbar.tsx` navigates home then scrolls after a fixed `setTimeout(300)`. On a slow connection the target may not exist yet and the scroll silently fails.

---

## 6. Responsive check

Tested at **360, 768, 1024, 1440** across homepage, /work, /about, /contact, and a film detail page, using headless Chromium with per-element overflow detection.

**Result: no layout breaks. Zero horizontal overflow at any width on any page.**

| Page | 360 | 768 | 1024 | 1440 |
|---|---|---|---|---|
| Home | ok | ok | ok | ok |
| Work | ok | ok | ok | ok |
| About | ok | empty box | empty box | empty box |
| Contact | ok | ok | ok | ok |
| Film detail | ok | ok | ok | ok |

The only flags are the **empty placeholder boxes on /about** (I2) — a content problem, not a layout one. The responsive engineering is genuinely solid: the grid collapses correctly, the /work table reflows to a stacked layout on mobile, and typography scales with `clamp()`.

Two minor notes:
- **`Footer.tsx` uses fixed `px-12`** while every other component uses `px-6 md:px-12`, giving the footer wider mobile padding than the rest of the site. Cosmetic inconsistency.
- **`/about` mobile ordering:** the two empty boxes sit below a large gap after "Still Room Productions →". Once real images fill them this resolves itself.

---

## 7. Comparison with stillroomproductions.com

**The codebases are completely different.** Not a shared template or a fork.

| | Gerald | Still Room |
|---|---|---|
| Framework | Next.js 16 App Router, TypeScript | Next.js, JavaScript |
| Studio | Embedded at `/studio` | Separate `studio/` directory |
| Schema | TypeScript, `defineType` | JavaScript, plain objects |
| Styling | Tailwind v4 + inline style objects | Separate approach |
| Sanity project | `yi82r3c7` | `tk6o47ip` |

**Shared issues — both sites had:**
- Hardcoded placeholder images not manageable via CMS
- Hotspot not properly applied to rendering
- Placeholder/fake content posing reputational risk
- Blank space where images should be

**Unique to Gerald:**
- A stock photo of the wrong person on the homepage (I3) — worse than anything on Still Room
- The entire /about right column empty (I2)
- `npm run lint` crashing (§3)
- A destructive seed script targeting production (S1)

**Already solved on Still Room, portable to here:**
Still Room's `studio/schemaTypes/project.js` already contains production-ready, well-documented implementations of **exactly** the Phase 2 requirements — `trailerUrl` + `trailerLabel` (with YouTube/Vimeo validation), `festivalSelections` (name required, year/award/laurel optional, with preview), and `poster` (portrait, never cropped). Its `CONTENT-GUIDE.md` is also a good template. Phase 2 should port these patterns rather than reinvent them, adapted to this repo's TypeScript `defineType` style.

**Good news:** Gerald's site is in better shape than Still Room was in one important respect — the film content itself (8 films, real loglines, real cast/credits) is already properly in Sanity and well-written. The work here is almost entirely about images and CMS control, not content rescue.

---

## 8. Prioritised fix list

### P0 — Reputational / live-content risk

| # | Fix | Ref |
|---|---|---|
| 1 | **Replace the stock-photo headshot** on the homepage with a real photo of Gerald | I3 |
| 2 | **Fill the /about blank space** with Gerald's portrait + behind-the-scenes shot | I2 |
| 3 | **Neutralise `scripts/seed-sanity.ts`** — delete it, or add a dataset guard and confirmation | S1 |
| 4 | **Fix or remove the placeholder Vimeo link** | N2 |
| 5 | **Confirm the EastEnders keyword claim**; remove if unsubstantiated | N6 |

### P1 — Core functionality (the main body of Phase 2)

| # | Fix | Ref |
|---|---|---|
| 6 | **Make hotspot actually work sitewide** — build the URL from the image object, apply `objectPosition` on every slot | I1 |
| 7 | **Create a `siteSettings` singleton** so the headshot, directing band, and atmospheric bands are CMS-managed | I3 |
| 8 | **Wire the /about portrait + BTS images to Sanity** | I2 |
| 9 | **Add trailer/teaser support** — `trailerUrl` + `trailerLabel`, 16:9, no autoplay, hidden when empty | C1 |
| 10 | **Add festivals / official selections** — name required; year, award, laurel optional; reorderable; hidden when empty | C1 |
| 11 | **Add poster support** — portrait, natural aspect ratio, never cropped, never a hero | — |
| 12 | **Resolve the contact email inconsistency** (needs Gerald's input) | N1 |

### P2 — Quality & hygiene

| # | Fix | Ref |
|---|---|---|
| 13 | Remove committed `dist/` + `.sanity/`; scope the lint script — **unblocks `npm run lint`** | §3 |
| 14 | Delete dead `@ts-ignore` UI once real schema fields replace it | C1 |
| 15 | Delete unused files: `HeroSection.tsx`, `data.ts`, `assertValue`, ~93MB of unused images | C2 |
| 16 | Fix duplicate/null `order` values so film sequencing is deterministic | N3 |
| 17 | Add `sizes` to all `<Image fill>`; serve properly-sized Sanity URLs | I5 |
| 18 | Promote alt text from warning to required; backfill 16 missing entries | I6 |
| 19 | Return a real 404 for unknown film slugs (currently HTTP 200) | §5 |
| 20 | Refresh the stale sitemap fallback slug list | N5 |
| 21 | Remove `visionTool` from the production Studio | S3 |
| 22 | Fix `Footer.tsx` mobile padding to match the rest of the site | §6 |
| 23 | Add missing `year` values for Next Time and I Dey | N4 |

### P3 — Documentation

| # | Fix |
|---|---|
| 24 | Write `CONTENT-GUIDE.md` — image dimensions, hotspot usage, posters, trailers, festivals |
| 25 | Replace the default `create-next-app` README with real project documentation |

---

## 9. Questions for Gerald

These block or shape Phase 2 and need answers:

1. **Photos** — please provide the portrait and, if available, a working/behind-the-scenes shot. Needed for P0 #1 and #2.
2. **Email** — which address is correct: `gerald@`, `hello@`, or `press@`? Are all three live mailboxes?
3. **Vimeo** — is there a real profile URL, or should the row be removed?
4. **EastEnders** — is there a genuine credit behind that keyword?
5. **Film order** — what sequence should the 8 films appear in?
6. **Posters** — are there poster artworks for any of the films, and should the poster section be built now?
7. **Staging dataset** — I will need a Sanity token with permission to create a `staging` dataset, so no Phase 2 work touches production content.

---

## 10. Verification notes

Everything above was verified directly, not inferred:

- **Build:** `npx next build` — clean, 15/15 static pages
- **Lint:** reproduced the OOM crash; re-ran scoped to `src/` for the real error list
- **Sanity:** queried both projects' live APIs for document types and content
- **Responsive:** headless Chromium at 4 widths × 5 pages, with per-element bounding-box overflow detection; screenshots captured
- **Images:** inspected `naturalWidth`/`currentSrc` of every `<img>` on the homepage to distinguish Sanity-served from bundled placeholders
- **Live site:** confirmed the stock headshot, the /about blank boxes, and the raw-URL image pattern on production
- **Links:** HTTP-checked every external URL; DNS MX lookup on the email domain
- **Secrets:** grepped source and full git history

**Nothing on `master` or the live site was modified.** The working tree's prior uncommitted changes were preserved with `git stash` (`stash@{0}`) before branching — they contain a partial earlier attempt at the hotspot and `siteSettings` work and are worth reviewing as a starting point for Phase 2.

---

**Phase 1 complete. Awaiting approval before any fixes.**
