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
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative Text (for SEO & accessibility)',
            validation: (Rule: any) => Rule.required().warning('Alt text is recommended for accessibility and SEO.'),
          },
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
    // synopsis: 1-2 sentences used for meta descriptions on /work/[slug] pages.
    // Keep under 160 chars for ideal SEO. Leave blank and logline will be used as fallback.
    defineField({ name: 'synopsis', type: 'text', title: 'SEO Synopsis (1–2 sentences, ≤160 chars)', rows: 3 }),
    // releaseDate: used for JSON-LD datePublished on film detail pages.
    defineField({ name: 'releaseDate', type: 'date', title: 'Release Date' }),
    defineField({ name: 'order', type: 'number', title: 'Display Order' }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})