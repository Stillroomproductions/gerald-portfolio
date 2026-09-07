'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './src/sanity/schemaTypes/index'
import {structure, singletonIds, singletonTypes} from './src/sanity/structure'
import {dataset, projectId} from './src/sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Keep the one-off Site Settings document out of the global "create new"
    // menu so it cannot be duplicated — it is edited in place from the sidebar.
    templates: (prev) => prev.filter((t) => !singletonTypes.has(t.schemaType)),
  },

  document: {
    // Singletons can be edited and published, but not created or deleted.
    actions: (prev, {schemaType, documentId}) =>
      singletonTypes.has(schemaType) || (!!documentId && singletonIds.has(documentId))
        ? prev.filter(({action}) => !action || !['duplicate', 'delete', 'unpublish'].includes(action))
        : prev,
  },

  // The Vision GROQ playground is a developer tool with no purpose for the
  // client, so it is not loaded here.
  plugins: [structureTool({structure})],
})
