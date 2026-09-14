import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Singleton holding the images that are not tied to a single project.
 *
 * These slots were previously hardcoded imports in the page components, so
 * changing them required a developer and a redeploy. Moving them into Sanity
 * means the images can be replaced — and repositioned via the hotspot — from
 * the Studio.
 *
 * Every slot here is optional. A slot with no image is hidden on the site
 * rather than rendering an empty box, so a half-filled Site Settings never
 * leaves a grey gap on the page.
 */

/** Alt text field, repeated on each image slot. */
const altField = defineField({
  name: 'alt',
  title: 'Image description',
  type: 'string',
  description:
    'Describes the image for screen readers and Google. Recommended on every image.',
})

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'portraits', title: 'Photos of Gerald', default: true },
    { name: 'homepage', title: 'Homepage bands' },
  ],
  fields: [
    // ── Photos of Gerald ────────────────────────────────────────────────────
    defineField({
      name: 'portrait',
      title: 'Portrait of Gerald',
      type: 'image',
      group: 'portraits',
      description:
        'The main photo of Gerald. Used on the homepage beside the About text and ' +
        'as the portrait on the About page. These two slots are different shapes — ' +
        'a tall column on desktop and a wider crop on mobile — so click the crop ' +
        'icon and drag the circle over his face. That point is kept in frame ' +
        'whatever the shape, so the photo is never cut off at the top.',
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: 'onSetImage',
      title: 'On set / behind the scenes',
      type: 'image',
      group: 'portraits',
      description:
        'A working or behind-the-scenes photo, shown below the portrait on the ' +
        'About page. Leave this empty and the slot is hidden completely — no ' +
        'empty box appears on the page.',
      options: { hotspot: true },
      fields: [
        altField,
        defineField({
          name: 'caption',
          title: 'Caption (optional)',
          type: 'string',
          description: 'Small line shown over the bottom-left of the image.',
        }),
      ],
    }),

    // ── Homepage bands ──────────────────────────────────────────────────────
    defineField({
      name: 'directingImage',
      title: 'Directing image (homepage)',
      type: 'image',
      group: 'homepage',
      description:
        'The wide behind-the-scenes band in the Directing section of the homepage. ' +
        'Rendered in black and white. Drag the hotspot onto whatever must stay in ' +
        'frame. Leave empty to hide the whole Directing section.',
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: 'atmosphericImages',
      title: 'Atmospheric bands (homepage)',
      type: 'array',
      group: 'homepage',
      description:
        'The full-width bands near the bottom of the homepage. These are a very ' +
        'wide, letterbox shape that crops hard, so the hotspot matters most here. ' +
        'Leave empty and no bands appear.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            altField,
            defineField({
              name: 'caption',
              title: 'Caption (optional, shown bottom-left)',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { media: 'portrait' },
    prepare: ({ media }) => ({ title: 'Site Settings', media }),
  },
})
