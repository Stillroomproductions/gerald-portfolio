'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './src/sanity/schemaTypes/index'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: 'yi82r3c7',
  dataset: 'production',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: '2024-01-01'}),
  ],
})