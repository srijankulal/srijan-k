// scripts/cleanupNonLinkedInDocs.mjs
import { createClient } from 'next-sanity';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-04',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const docsToDelete = [
  'experience-linkedin-bytesize-project-full-stack-web-developer',
  'experience-linkedin-independent-open-source-software-developer-open-',
  'education-linkedin-st-aloysius-university-bachelor-of-computer-appl'
];

async function cleanup() {
  console.log('🧹 Cleaning up old placeholder documents...');
  for (const id of docsToDelete) {
    try {
      await client.delete(id);
      console.log(`  🗑️ Deleted: ${id}`);
    } catch (e) {
      console.log(`  ℹ️ Not found or already deleted: ${id}`);
    }
  }
  console.log('✅ Cleanup complete! Only authentic LinkedIn entries remain.');
}

cleanup();
