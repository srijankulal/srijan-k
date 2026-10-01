import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import education from './education'
import experience from './experience'
import syncMetadata from './syncMetadata'
import leadershipActivity from './leadershipActivity'
import profileSummary from './profileSummary'
import linkedinPosts from './linkedinPosts'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, education, experience, syncMetadata, leadershipActivity, profileSummary, linkedinPosts],
}

