# geraldgyimah.com

Personal website for Gerald Gyimah — writer/director, founder of Still Room
Productions. Next.js (App Router) with Sanity as the CMS, deployed on Vercel.

- **Live site:** https://www.geraldgyimah.com
- **Studio:** https://www.geraldgyimah.com/studio
- **Editing content:** see [CONTENT-GUIDE.md](./CONTENT-GUIDE.md) — written for
  the client, no code required
- **Handover audit:** see [AUDIT-REPORT.md](./AUDIT-REPORT.md)

> This is a **separate Sanity project** from stillroomproductions.com.
> Gerald is `yi82r3c7`; Still Room is `tk6o47ip`. They share no content.

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

The Studio is served by the Next app at `/studio` — there is no separate studio
process to run.

### Environment

Create `.env.local`:

```bash
# Defaults to production; set to staging for any work that writes content.
NEXT_PUBLIC_SANITY_DATASET=staging
NEXT_PUBLIC_SANITY_PROJECT_ID=yi82r3c7

# Canonical URL used for metadata, sitemap and JSON-LD.
NEXT_PUBLIC_SITE_URL=https://www.geraldgyimah.com
```

Reading content needs no token — the dataset is publicly readable, as a public
website requires. Only the write scripts below need one.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Both `lint` and `typecheck` are expected to pass with **zero errors and zero
warnings**.

> `lint` is scoped to source directories on purpose. Pointing ESLint at the repo
> root makes it walk the Sanity Studio bundle and run out of memory.

## Content-writing scripts

These write to Sanity, so they refuse to run without an explicit dataset and
will not touch `production` unless forced.

```bash
# Create the Site Settings singleton (safe to re-run)
SANITY_WRITE_TOKEN=<token> NEXT_PUBLIC_SANITY_DATASET=staging \
  node scripts/createSiteSettings.mjs

# Upload a photo into a Site Settings slot
SANITY_WRITE_TOKEN=<token> NEXT_PUBLIC_SANITY_DATASET=staging \
  node scripts/uploadSiteImage.mjs portrait ./photo.jpg "Gerald Gyimah"
```

Tokens are created at
https://www.sanity.io/manage/project/yi82r3c7/api (Editor permission).
Never commit one.

---

## How images work

This is the part most likely to trip up future work, so it is worth reading.

**Every image comes from Sanity. There are no bundled fallback images.** A slot
with nothing uploaded renders nothing — the surrounding section hides itself
rather than showing an empty box or a placeholder.

Three things have to stay true for hotspots to keep working:

1. **Queries must spread the whole image object** (`...` plus `hotspot`, `crop`)
   — see `IMAGE_FIELDS` in [src/lib/queries.ts](./src/lib/queries.ts).
   Selecting `asset->url` returns the untouched original and silently discards
   the crop and hotspot. This was the original bug: the Studio showed a working
   hotspot control that did nothing.

2. **Rendering must go through
   [`SanityPicture`](./src/components/SanityPicture.tsx)**, which builds the URL
   from the image object (so Sanity applies the crop) and sets `objectPosition`
   from the hotspot (so the focal point survives the slot's aspect ratio).

3. **Resizing is Sanity's job, not Next's.** A custom global loader
   ([src/lib/sanityImageLoader.ts](./src/lib/sanityImageLoader.ts), wired up via
   `images.loader`) sends resize requests to Sanity's CDN. Routing them through
   `next/image` as well encodes every image twice and times out on a cold cache,
   which previously left the wide homepage bands rendering as blank space.

`SanityPoster` is the exception: posters are shown whole at their natural
aspect ratio, never cropped, so it uses intrinsic dimensions read from the
asset reference rather than `fill` + `object-cover`.

## Layout

```
src/
  app/                     routes (App Router)
    page.tsx               homepage
    about/  contact/  work/
    work/[slug]/           film detail
    studio/[[...tool]]/    embedded Sanity Studio
  components/
    SanityPicture.tsx      every image slot goes through here
  lib/
    queries.ts             GROQ + projections
    imageUrl.ts            hotspot/crop helpers
    videoEmbed.ts          Vimeo/YouTube → embed URL
    sanityImageLoader.ts   global next/image loader
  sanity/
    env.ts                 project id + dataset
    schemaTypes/           project, siteSettings
    structure.ts           Studio sidebar + singleton config
```

## Notes for whoever works on this next

- **Site Settings is a singleton** at the fixed document id `siteSettings`. The
  Studio config blocks creating, duplicating or deleting it.
- **Trailer URLs are never passed to an iframe raw.** `videoEmbedUrl()`
  validates the host and extracts the video id; anything unrecognised renders no
  video at all.
- **Unknown film slugs return a real 404** via `notFound()`. They used to render
  a "not found" page with a 200 status, which invites indexing of every typo.
- **`keywords` meta is ignored by Google.** Two entries asserting unverified
  credits were removed; do not add claims there that cannot be substantiated.
