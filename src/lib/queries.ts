import { client } from './sanity'
import type { Project, SiteSettings } from './types'

/**
 * Image projection used everywhere.
 *
 * The `...` spread is the important part: it carries `asset`, `hotspot` and
 * `crop` through to the page so the image URL builder can apply the crop
 * rectangle set in the Studio and position the focal point. Selecting only
 * `asset->url` — as this file used to — returns the untouched original and
 * silently discards both, which is why the hotspot control appeared to do
 * nothing. `url` is kept as a fallback for any caller that still reads it.
 */
const IMAGE_FIELDS = `
  ...,
  alt,
  hotspot,
  crop,
  "url": asset->url
`

const PROJECT_FIELDS = `
  "slug": slug.current,
  title,
  year,
  format,
  duration,
  status,
  logline,
  stills[]{ _key, ${IMAGE_FIELDS} },
  cast[]{ role, name },
  credits[]{ role, name },
  production{ company, country, language },
  synopsis,
  releaseDate,
  order,
  trailerUrl,
  trailerLabel,
  festivalSelections[]{
    _key,
    name,
    year,
    award,
    laurel{ ${IMAGE_FIELDS} }
  },
  poster{ ${IMAGE_FIELDS} }
`

// Films are ordered by the editor's Display Order. `order asc` alone puts
// documents with no order first on some datasets and last on others, so
// missing values are coalesced to a large number to keep unordered films at
// the end, with title as a final tie-break so the sequence is stable between
// requests rather than arbitrary.
const PROJECT_ORDERING = `order(coalesce(order, 9999) asc, coalesce(year, 0) desc, title asc)`

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | ${PROJECT_ORDERING} { ${PROJECT_FIELDS} }`,
    {},
    { cache: 'no-store' }
  )
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
    { slug },
    { cache: 'no-store' }
  )
}

// Image slots that are not tied to a single project.
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0]{
      portrait{ ${IMAGE_FIELDS} },
      onSetImage{ ${IMAGE_FIELDS}, caption },
      directingImage{ ${IMAGE_FIELDS} },
      atmosphericImages[]{ ${IMAGE_FIELDS}, caption }
    }`,
    {},
    { cache: 'no-store' }
  )
}
