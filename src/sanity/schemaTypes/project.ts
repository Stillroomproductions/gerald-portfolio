import { defineType, defineField, defineArrayMember } from 'sanity'

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'year', type: 'number', title: 'Year' }),
    defineField({ name: 'format', type: 'string', title: 'Format', options: { list: ['Short Film', 'Feature Film', 'Documentary', 'Series'] } }),
    defineField({ name: 'duration', type: 'string', title: 'Duration' }),
    defineField({
      name: 'status', type: 'string', title: 'Status',
      options: { list: ['Complete', 'In Development', 'Post-Production'] }
    }),
    defineField({ name: 'logline', type: 'text', title: 'Logline', rows: 3 }),
    defineField({
      name: 'stills', type: 'array', title: 'Stills',
      description:
        'Film stills. The first is used on the homepage grid; all of them appear on ' +
        'the film page. For each one, click the crop icon and drag the circle over ' +
        'the part that must always stay visible — the site keeps that point in frame ' +
        'when the image is cropped to fit different screen sizes.',
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({
            name: 'alt',
            type: 'string',
            title: 'Image description (for SEO & accessibility)',
            description: 'Describes the still for screen readers and Google.',
            validation: (rule) =>
              rule.required().warning('Alt text is recommended for accessibility and SEO.'),
          }),
        ],
      })]
    }),
    defineField({
      name: 'cast', type: 'array', title: 'Cast / Starring',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'role', type: 'string', title: 'Character Name' },
          { name: 'name', type: 'string', title: 'Actor Name' },
        ],
        preview: {
          select: { title: 'name', subtitle: 'role' }
        }
      })]
    }),
    defineField({
      name: 'credits', type: 'array', title: 'Credits',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'role', type: 'string', title: 'Role' },
          { name: 'name', type: 'string', title: 'Name' },
        ],
        preview: {
          select: { title: 'name', subtitle: 'role' }
        }
      })]
    }),
    defineField({
      name: 'production', type: 'object', title: 'Production',
      fields: [
        { name: 'company', type: 'string', title: 'Company' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'language', type: 'string', title: 'Language' },
      ]
    }),
    // ── Trailer / teaser ────────────────────────────────────────────────────
    defineField({
      name: 'trailerUrl',
      title: 'Trailer / Teaser URL',
      type: 'url',
      description:
        'Paste the Vimeo or YouTube link for the film. Leave empty and no video ' +
        'section appears on the page. The video never plays on its own — a visitor ' +
        'has to press play.',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).custom((value) => {
          if (!value) return true
          return /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(value)
            ? true
            : 'Must be a YouTube or Vimeo link.'
        }),
    }),
    defineField({
      name: 'trailerLabel',
      title: 'Video heading',
      type: 'string',
      description: 'The wording shown above the video. Defaults to Trailer.',
      options: {
        list: [
          { title: 'Trailer', value: 'Trailer' },
          { title: 'Teaser', value: 'Teaser' },
        ],
        layout: 'radio',
      },
      initialValue: 'Trailer',
    }),

    // ── Festivals / official selections ─────────────────────────────────────
    defineField({
      name: 'festivalSelections',
      title: 'Festivals / Official Selections',
      type: 'array',
      description:
        'Add a row per festival as selections come in. Only the festival name is ' +
        'required. Drag the handles to reorder. Leave this empty and no festivals ' +
        'section appears on the film page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'festival',
          title: 'Festival',
          fields: [
            defineField({
              name: 'name',
              title: 'Festival name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              description: 'e.g. 2026. Optional.',
            }),
            defineField({
              name: 'award',
              title: 'Award / Nomination',
              type: 'string',
              description:
                'Optional, e.g. "Best Short Film" or "Nominated — Best Director". ' +
                'Leave empty for a plain official selection.',
            }),
            defineField({
              name: 'laurel',
              title: 'Laurel image',
              type: 'image',
              description:
                'Optional. The festival laurel, ideally a PNG with a transparent ' +
                'background. Shown small beside the entry; the text is always shown ' +
                'whether or not a laurel is added.',
              options: { hotspot: false },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Image description',
                  type: 'string',
                  description: 'For screen readers. Optional but recommended.',
                }),
              ],
            }),
          ],
          preview: {
            select: { name: 'name', year: 'year', award: 'award', media: 'laurel' },
            prepare: ({ name, year, award, media }) => ({
              title: [name, year].filter(Boolean).join(' — '),
              subtitle: award || 'Official Selection',
              media,
            }),
          },
        }),
      ],
    }),

    // ── Poster ──────────────────────────────────────────────────────────────
    defineField({
      name: 'poster',
      title: 'Film poster (portrait)',
      type: 'image',
      description:
        'The vertical marketing poster with the title and credits on it. This is ' +
        'NOT a film still — do not put a landscape image here. It appears on its own ' +
        'below the film information, shown whole at its natural shape. ' +
        'Recommended: portrait, around 2:3 (e.g. 1400 x 2000px).',
      // Hotspot is deliberately off: the poster is never cropped on the site —
      // it always shows in full, so a hotspot would have no visible effect.
      options: { hotspot: false },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description',
          type: 'string',
          description: 'Describes the poster for screen readers and Google.',
        }),
      ],
    }),

    // synopsis: 1-2 sentences used for meta descriptions on /work/[slug] pages.
    // Keep under 160 chars for ideal SEO. Leave blank and logline will be used as fallback.
    defineField({ name: 'synopsis', type: 'text', title: 'SEO Synopsis (1–2 sentences, ≤160 chars)', rows: 3 }),
    // releaseDate: used for JSON-LD datePublished on film detail pages.
    defineField({ name: 'releaseDate', type: 'date', title: 'Release Date' }),
    defineField({ name: 'order', type: 'number', title: 'Display Order' }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})