import {defineCliConfig} from 'sanity/cli'

// We need to access environment variables, but this file is often running in a node environment
// where typical nextjs env loading might not happen the same way for the CLI.
// However, newer sanity cli loads .env files.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
