# Content Guide — geraldgyimah.com

How to manage the website's content yourself, without a developer.

Everything on the site — films, photos, trailers, festivals, posters — is edited
in **Sanity Studio**. Nothing here requires code.

**Open the Studio:** [geraldgyimah.com/studio](https://geraldgyimah.com/studio)
and sign in with your Sanity account.

Changes appear on the live site within a minute of pressing **Publish**.

---

## Contents

1. [The two things you edit](#1-the-two-things-you-edit)
2. [Hotspot — stopping faces getting cropped](#2-hotspot--stopping-faces-getting-cropped)
3. [Photos of you (Site Settings)](#3-photos-of-you-site-settings)
4. [Films](#4-films)
5. [Trailers and teasers](#5-trailers-and-teasers)
6. [Festivals and official selections](#6-festivals-and-official-selections)
7. [Posters](#7-posters)
8. [Image sizes — quick reference](#8-image-sizes--quick-reference)
9. [Alt text](#9-alt-text)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. The two things you edit

The Studio sidebar has two sections:

| | What it holds |
|---|---|
| **Site Settings** | Photos of you and the wide atmospheric bands on the homepage. There is only one of these — you edit it, you never create a new one. |
| **Project** | One entry per film. Add, edit and remove these freely. |

---

## 2. Hotspot — stopping faces getting cropped

**This is the most useful thing in this guide.**

The same photo has to fit slots of different shapes — a tall column on desktop,
a wide letterbox on mobile, a square-ish card in the film grid. The site has to
crop your photo to fit, and by default it crops from the centre, which often
cuts off the top of a head.

The **hotspot** tells the site which part of the picture must never be cropped
out.

### How to set it

1. Click on any image in the Studio.
2. Click the **crop icon** (⊹) in the image toolbar.
3. You will see two controls:
   - **A circle** — drag this over the part that must stay visible. For a
     portrait, put it over the face.
   - **A rectangle** — optionally drag its edges to trim the picture down.
4. Press **Publish**.

That is it. The site now keeps that point in frame at every screen size.

> **Worth knowing:** you can upload a photo of any shape — portrait, landscape,
> square. Set the hotspot and the layout will not break. You do not need to crop
> pictures before uploading.

---

## 3. Photos of you (Site Settings)

Open **Site Settings** in the sidebar. It has two tabs.

### Tab: Photos of Gerald

**Portrait of Gerald**
Your main photo. It appears in two places: on the homepage beside the About
text, and on the About page.

These two slots are different shapes, and on mobile the homepage one crops to a
wide 4:3 — which cuts a portrait photo hard. **Set the hotspot on your face** and
both will frame correctly.

- Recommended: portrait orientation, at least 1600px on the long edge
- A 4:5 or 3:4 photo works best

**On set / behind the scenes**
A working photo, shown below the portrait on the About page.

**This slot is optional.** Leave it empty and it disappears completely — no
empty box, no gap. Add a photo whenever you have one and it appears.

- Recommended: landscape, at least 1600px wide

### Tab: Homepage bands

**Directing image**
The wide band in the Directing section of the homepage. Shown in black and
white automatically — upload a colour photo, the site handles it.

Leave it empty and the whole Directing section is hidden.

- Recommended: landscape, at least 1920px wide

**Atmospheric bands**
The full-width strips near the bottom of the homepage. These are a very wide
letterbox shape (21:9), so they crop hard — **the hotspot matters most here.**

- Click **Add item** to add one, drag the handles to reorder
- Each can have an optional caption, shown small in the bottom-left corner
- Leave the list empty and no bands appear
- Recommended: landscape, at least 2400px wide

---

## 4. Films

Each film is one **Project** entry.

**To add a film:** click **Project** in the sidebar → **Create new**.

### The fields

| Field | Notes |
|---|---|
| **Title** | Required. |
| **Slug** | The web address. Fill in the title, then click **Generate**. |
| **Year** | Worth filling in — it is shown in the Selected Work list. |
| **Format** | Short Film, Feature Film, Documentary or Series. |
| **Duration** | e.g. `11 mins`. Typing just `11` also works. |
| **Status** | Complete, In Development or Post-Production. |
| **Logline** | One or two sentences. Shown on the film page and used for Google if no SEO Synopsis is set. |
| **Stills** | Film stills — see below. |
| **Cast** | Actor name + character name. |
| **Credits** | Role + name. A single Director and Writer with the same name are automatically combined into "Written & Directed by". |
| **Production** | Company, country, language. |
| **Trailer / Teaser URL** | [See section 5](#5-trailers-and-teasers). |
| **Festivals** | [See section 6](#6-festivals-and-official-selections). |
| **Poster** | [See section 7](#7-posters). |
| **SEO Synopsis** | Optional. 1–2 sentences, under 160 characters, used as the Google search description. Leave blank and the logline is used. |
| **Release Date** | Optional. |
| **Display Order** | Controls the order films appear. See below. |

### Stills

The **first still** is used as the film's card on the homepage grid and as the
image when the page is shared on social media. All stills appear on the film
page itself.

- Recommended: landscape, at least 1600px wide
- **Set the hotspot on each one** — the homepage card is a hard 16:9 crop

### Display Order

Films are sorted by this number, lowest first. Give them `1`, `2`, `3` and so
on.

> **Please note:** several films currently share the same number, so their order
> is unpredictable. Giving each film a unique number fixes this. Films with no
> number are listed last.

---

## 5. Trailers and teasers

Paste a **Vimeo or YouTube link** into **Trailer / Teaser URL**.

- Any normal link works — the share link, the address bar, `youtu.be/…`
- Use **Video heading** to choose whether it says **TRAILER** or **TEASER**
- **Leave it empty and no video section appears**
- The video never plays on its own — a visitor has to press play

If you paste something that is not a Vimeo or YouTube link, the Studio will warn
you, and the site shows no video rather than a broken player.

---

## 6. Festivals and official selections

Under **Festivals / Official Selections**, click **Add item** for each festival.

| Field | Required? |
|---|---|
| **Festival name** | Yes |
| **Year** | Optional |
| **Award / Nomination** | Optional — e.g. "Best Short Film". Leave empty and it shows as "Official Selection". |
| **Laurel image** | Optional |

- **Drag the handles to reorder** — put the most significant first
- **Leave the list empty and the whole section is hidden**
- Add rows as selections come in

**Laurel images:** ideally a PNG with a transparent background. Laurels are
always shown whole, never cropped. If you do not have one, the festival name
and award still appear as text.

---

## 7. Posters

The **Poster** field is for the vertical marketing poster — the one with the
title and credits on it.

**This is not a film still.** Do not put a landscape image here.

- Recommended: portrait, around 2:3 — e.g. 1400 × 2000px
- Shown whole at its natural shape, below the film information
- Never stretched, never cropped, never used as a background
- Leave it empty and no poster section appears

There is no hotspot on this field, because the poster is never cropped.

---

## 8. Image sizes — quick reference

You do not need to resize anything before uploading — the site produces the
right size for each visitor's screen automatically. These are minimums for
sharpness.

| Where | Shape | Minimum |
|---|---|---|
| Portrait of Gerald | Portrait (4:5 or 3:4) | 1600px tall |
| On set / behind the scenes | Landscape | 1600px wide |
| Directing image | Landscape | 1920px wide |
| Atmospheric bands | Wide landscape | 2400px wide |
| Film stills | Landscape | 1600px wide |
| Poster | Portrait (2:3) | 1400 × 2000px |
| Festival laurel | Any | 400px wide, transparent PNG |

**Upload the best quality you have.** Large files are fine — the site shrinks
them automatically. Do not upload screenshots or images pulled from social
media, as those are already compressed and will look soft.

---

## 9. Alt text

Every image has an **Image description** field. This is read aloud by screen
readers and is used by Google.

Describe what is in the picture, plainly:

- Good: *"Gerald Gyimah on set, reviewing a monitor with the crew"*
- Not useful: *"photo"*, *"image1"*, *"Gerald Gyimah"*

The Studio will warn you if you leave it blank, but will still let you publish.

> **Please note:** none of the current film stills have descriptions. Adding
> them is worthwhile for both accessibility and search.

---

## 10. Troubleshooting

**I published a change but the site looks the same.**
Wait about a minute and refresh. If it still looks wrong, try a hard refresh
(Ctrl+F5, or Cmd+Shift+R on a Mac).

**My photo is cropped badly / someone's head is cut off.**
The hotspot is not set, or is in the wrong place.
[See section 2](#2-hotspot--stopping-faces-getting-cropped).

**A section is missing from the site.**
That is intentional — sections hide themselves when empty. Add the image, video
or festival and the section reappears. This applies to: the on-set photo, the
Directing band, the atmospheric bands, trailers, festivals and posters.

**The films are in the wrong order.**
Give each film a unique **Display Order** number.

**My trailer is not showing.**
It must be a Vimeo or YouTube link. Check the Studio has not flagged a warning
on the field.

**I cannot delete Site Settings.**
Correct — it is deliberately protected, because the site expects exactly one.
You can clear individual fields inside it.

---

## Still to confirm

Two things need your input, flagged during the site handover:

1. **Contact email.** The site currently shows three different addresses:
   `gerald@geraldgyimah.com` on the homepage, and `hello@` and `press@` on the
   contact page. Please confirm which of these you actually check, so enquiries
   are not lost.

2. **Vimeo.** The contact page previously linked to a Vimeo profile, but the
   link pointed at Vimeo's homepage rather than a real profile, so it has been
   removed. If you have a Vimeo page, send the address and it can be added back.

---

*Any questions about the site or this guide, get in touch.*
