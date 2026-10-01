// scripts/testApifyRun.mjs
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });

const token = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
const targetUrl = 'https://www.linkedin.com/in/srijan-kulal/';

async function testHarvestApi() {
  console.log('\n🚀 Testing harvestapi~linkedin-profile-scraper (No Cookies required)...');
  const endpoint = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-scraper/run-sync-get-dataset-items?token=${token}&timeout=60`;
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queries: [targetUrl],
        urls: [targetUrl],
        profileUrls: [targetUrl]
      })
    });

    console.log(`📡 Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Response:', JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
      const err = await res.text();
      console.log('❌ Error:', err.slice(0, 300));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testHarvestApi();
