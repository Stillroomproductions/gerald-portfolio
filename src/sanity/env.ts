export const apiVersion = '2024-01-01'

/**
 * Sanity project and dataset.
 *
 * The dataset is env-driven so staging work never touches production content:
 * set NEXT_PUBLIC_SANITY_DATASET=staging in .env.local while developing.
 * It falls back to production so a deploy without the var behaves as before.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'yi82r3c7'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
