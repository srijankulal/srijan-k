// scripts/listSanityDocs.mjs
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

async function listDocs() {
  const experiences = await client.fetch('*[_type == "experience"]');
  const educations = await client.fetch('*[_type == "education"]');
  const projects = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug.current, "hasDetails": defined(details) }');

  console.log('\n--- SANITY PROJECTS ---');
  projects.forEach((p) => {
    console.log(`ID: ${p._id} | Title: ${p.title} | Slug: ${p.slug} | HasDetails: ${p.hasDetails}`);
  });
}

listDocs();
