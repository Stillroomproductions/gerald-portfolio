import { createClient } from '@sanity/client'

const client = createClient({
  projectId: "yi82r3c7",
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const projects = [
  {
    _id: 'project-on-record',
    _type: 'project',
    slug: { _type: 'slug', current: 'on-record' },
    title: 'On Record',
    year: 2023,
    format: 'Short Film',
    duration: '18 min',
    status: 'Complete',
    logline: 'A hospital waiting room at 4am. Three strangers sit with what they cannot say. Time passes. Nothing is resolved.',
    stills: [],
    credits: [
      { _key: 'c1', role: 'Director', name: 'Gerald Gyimah' },
      { _key: 'c2', role: 'Writer', name: 'Gerald Gyimah' },
      { _key: 'c3', role: 'Producer', name: '—' },
      { _key: 'c4', role: 'Cinematographer', name: '—' },
      { _key: 'c5', role: 'Editor', name: '—' },
      { _key: 'c6', role: 'Sound', name: '—' },
    ],
    production: {
      company: 'Still Room Productions',
      country: 'United Kingdom',
      language: 'English',
    },
    festivals: [],
    order: 1,
  },
  {
    _id: 'project-protocol',
    _type: 'project',
    slug: { _type: 'slug', current: 'protocol' },
    title: 'Protocol',
    year: 2024,
    format: 'Feature Film',
    duration: 'TBC',
    status: 'In Development',
    logline: 'A film about the hours between. What lingers in spaces after people have left.',
    stills: [],
    credits: [
      { _key: 'c1', role: 'Director', name: 'Gerald Gyimah' },
      { _key: 'c2', role: 'Writer', name: 'Gerald Gyimah' },
    ],
    production: {
      company: 'Still Room Productions',
      country: 'United Kingdom',
      language: 'English',
    },
    festivals: [],
    order: 2,
  },
  {
    _id: 'project-consultation',
    _type: 'project',
    slug: { _type: 'slug', current: 'consultation' },
    title: 'The Consultation',
    year: 2024,
    format: 'Feature Film',
    duration: 'TBC',
    status: 'In Development',
    logline: 'A film about the hours between. What lingers in spaces after people have left.',
    stills: [],
    credits: [
      { _key: 'c1', role: 'Director', name: 'Gerald Gyimah' },
      { _key: 'c2', role: 'Writer', name: 'Gerald Gyimah' },
    ],
    production: {
      company: 'Still Room Productions',
      country: 'United Kingdom',
      language: 'English',
    },
    festivals: [],
    order: 3,
  },
  {
    _id: 'project-assessment',
    _type: 'project',
    slug: { _type: 'slug', current: 'assessment' },
    title: 'Assessment',
    year: 2024,
    format: 'Feature Film',
    duration: 'TBC',
    status: 'In Development',
    logline: 'A film about the hours between. What lingers in spaces after people have left.',
    stills: [],
    credits: [
      { _key: 'c1', role: 'Director', name: 'Gerald Gyimah' },
      { _key: 'c2', role: 'Writer', name: 'Gerald Gyimah' },
    ],
    production: {
      company: 'Still Room Productions',
      country: 'United Kingdom',
      language: 'English',
    },
    festivals: [],
    order: 4,
  },
]

async function seed() {
  for (const project of projects) {
    await client.createOrReplace(project)
    console.log(`✓ ${project.title}`)
  }
  console.log('Done!')
}

seed().catch(console.error)