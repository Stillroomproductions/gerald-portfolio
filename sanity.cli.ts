/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'yi82r3c7'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

// `appId` pins deploys to the studio already registered for this project
// (gerald-portfolio.sanity.studio). Without it the CLI asks which application
// to deploy to, which cannot be answered in a non-interactive shell.
export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { appId: 'xc7t6hm6lu1flqxz2tdf4u54' },
})
