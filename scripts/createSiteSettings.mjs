/**
 * Creates the `siteSettings` singleton so the Studio has a document to edit.
 *
 * The homepage and About page query `*[_type == "siteSettings"][0]` for the
 * portrait, the on-set photo, the Directing band and the atmospheric bands.
 * Until that document exists there is nothing to find, so those slots stay
 * empty and cannot be filled from the Studio.
 *
 * Uses `createIfNotExists`, so running it twice is harmless — it never
 * overwrites content that has already been edited.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> NEXT_PUBLIC_SANITY_DATASET=staging \
 *     node scripts/createSiteSettings.mjs
 *
 * Create a token with Editor permissions at
 *   https://www.sanity.io/manage/project/yi82r3c7/api
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yi82r3c7'

if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN.\n\n' +
      'Create a token with Editor permissions at\n' +
      `  https://www.sanity.io/manage/project/${projectId}/api\n` +
      'then run:\n' +
      '  SANITY_WRITE_TOKEN=<token> NEXT_PUBLIC_SANITY_DATASET=staging node scripts/createSiteSettings.mjs\n'
  )
  process.exit(1)
}

// Guard: this script writes, so it refuses to touch production unless that is
// stated explicitly. Staging work should never reach the live dataset.
if (!dataset) {
  console.error(
    'Missing NEXT_PUBLIC_SANITY_DATASET.\n' +
      'Set it explicitly (e.g. staging) so this never writes to the wrong dataset.'
  )
  process.exit(1)
}

if (dataset === 'production' && process.env.ALLOW_PRODUCTION_WRITE !== 'yes') {
  console.error(
    'Refusing to write to the production dataset.\n\n' +
      'This creates a document in live content. If that is genuinely intended, re-run with:\n' +
      '  ALLOW_PRODUCTION_WRITE=yes\n'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// The id matches the singleton defined in src/sanity/structure.ts.
const doc = { _id: 'siteSettings', _type: 'siteSettings' }

try {
  const res = await client.createIfNotExists(doc)
  console.log(`✓ siteSettings ready in "${dataset}" (${res._id})`)
  console.log('\nOpen /studio → "Site Settings" to upload images and set hotspots.')
} catch (err) {
  console.error('Failed to create siteSettings:', err.message)
  process.exit(1)
}
