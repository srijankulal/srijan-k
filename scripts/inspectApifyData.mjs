// scripts/inspectApifyData.mjs
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });

const token = process.env.APIFY_API_TOKEN;
const targetUrl = 'https://www.linkedin.com/in/srijan-kulal/';

async function inspect() {
  const endpoint = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-scraper/run-sync-get-dataset-items?token=${token}&timeout=60`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries: [targetUrl] })
  });

  const data = await res.json();
  const profile = data[0];

  console.log('\n--- PROFILE OVERVIEW ---');
  console.log('Name:', profile.firstName, profile.lastName);
  console.log('Headline:', profile.headline);
  console.log('About:', profile.about);
  console.log('Location:', profile.location);

  console.log('\n--- EDUCATION ENTRIES ---');
  console.log(JSON.stringify(profile.education || profile.educations || profile.schools || [], null, 2));

  console.log('\n--- EXPERIENCE ENTRIES ---');
  console.log(JSON.stringify(profile.experience || profile.experiences || profile.positionHistory || profile.positions || [], null, 2));

  console.log('\n--- ALL KEYS AVAILABLE ---');
  console.log(Object.keys(profile));
}

inspect();
