/**
 * Uploads a local image into Sanity and sets it on the `siteSettings`
 * singleton, so a photo can be put in place without clicking through the
 * Studio. Gerald can replace or reposition it afterwards from Site Settings —
 * this only does the first upload.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> NEXT_PUBLIC_SANITY_DATASET=staging \
 *     node scripts/uploadSiteImage.mjs <field> <file> ["alt text"]
 *
 *   <field>  portrait | onSetImage | directingImage
 *
 * Example:
 *   ... node scripts/uploadSiteImage.mjs portrait ./gerald.jpg "Gerald Gyimah"
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { basename } from 'node:path'

const FIELDS = new Set(['portrait', 'onSetImage', 'directingImage'])

const [field, filePath, altText] = process.argv.slice(2)
const token = process.env.SANITY_WRITE_TOKEN
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yi82r3c7'

function fail(message) {
  console.error(message)
  process.exit(1)
}

if (!token) fail('Missing SANITY_WRITE_TOKEN.')
if (!dataset) fail('Missing NEXT_PUBLIC_SANITY_DATASET (e.g. staging).')
if (dataset === 'production' && process.env.ALLOW_PRODUCTION_WRITE !== 'yes') {
  fail(
    'Refusing to write to the production dataset.\n' +
      'Re-run with ALLOW_PRODUCTION_WRITE=yes only if that is genuinely intended.'
  )
}
if (!field || !FIELDS.has(field)) {
  fail(`First argument must be one of: ${[...FIELDS].join(', ')}`)
}
if (!filePath || !existsSync(filePath)) {
  fail(`File not found: ${filePath}`)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const filename = basename(filePath)
console.log(`Uploading ${filename} to "${dataset}"…`)

const asset = await client.assets.upload('image', readFileSync(filePath), {
  filename,
})

console.log(`✓ asset uploaded (${asset._id}, ${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`)

// createIfNotExists first so this works on a dataset where the singleton has
// not been created yet, then patch just the one field — any other images
// already set in Site Settings are left untouched.
await client.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings' })

const value = {
  _type: 'image',
  asset: { _type: 'reference', _ref: asset._id },
  ...(altText ? { alt: altText } : {}),
}

await client.patch('siteSettings').set({ [field]: value }).commit()

console.log(`✓ siteSettings.${field} set`)
console.log('\nOpen /studio → Site Settings to position the hotspot on the face.')
