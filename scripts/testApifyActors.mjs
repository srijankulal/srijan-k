// scripts/testApifyActors.mjs
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });

const token = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
console.log('Testing Apify Token:', token ? token.slice(0, 10) + '...' : 'Missing');

const actors = [
  'curious_coder~linkedin-profile-scraper',
  'harvestapi~linkedin-profile-scraper',
  'apimaestro~linkedin-profile-search-scraper',
  'bebity~linkedin-profile-scraper',
  'anchor~linkedin-profile-scraper'
];

async function check() {
  for (const a of actors) {
    try {
      const res = await fetch(`https://api.apify.com/v2/acts/${a}?token=${token}`);
      console.log(`Actor [${a}] -> Status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const json = await res.json();
        console.log(`  Title: ${json.data?.title || json.data?.name}`);
      }
    } catch (e) {
      console.log(`Actor [${a}] -> Error:`, e.message);
    }
  }
}

check();
