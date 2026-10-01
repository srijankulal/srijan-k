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

  console.log('\n--- SANITY EXPERIENCES ---');
  experiences.forEach((e) => {
    console.log(`ID: ${e._id} | Role: ${e.role} | Company: ${e.company} | Type: ${e.type}`);
  });

  console.log('\n--- SANITY EDUCATIONS ---');
  educations.forEach((edu) => {
    console.log(`ID: ${edu._id} | Degree: ${edu.degree} | School: ${edu.institution}`);
  });
}

listDocs();
