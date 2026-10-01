// scripts/testLinkedInFetch.mjs
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });

const username = process.argv[2] || 'srijan-kulal';
const targetUrl = `https://www.linkedin.com/in/${username}/`;

console.log(`\n🔍 [LinkedIn Diagnostic Tool] Testing live fetch for: ${targetUrl}`);
console.log('------------------------------------------------------------');

async function testFetch() {
  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
  const scraperUrl = process.env.LINKEDIN_SCRAPER_URL;
  const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY;

  if (apifyToken) {
    console.log('🤖 Testing Apify LinkedIn Profile Scraper (harvestapi)...');
    const actorId = process.env.APIFY_ACTOR_ID || 'harvestapi~linkedin-profile-scraper';
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}&timeout=60`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: [targetUrl],
          urls: [targetUrl],
          profileUrls: [targetUrl],
        }),
      });

      console.log(`📡 Apify Response HTTP Status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const items = await res.json();
        console.log(`✅ Apify Actor succeeded! Returned ${items.length} dataset item(s).`);
        if (items.length > 0) {
          const p = items[0].profile || items[0].data || items[0];
          console.log(`👤 Name: ${p.firstName} ${p.lastName || ''}`);
          console.log(`🎓 Educations found: ${(p.education || p.educations || []).length}`);
          console.log(`💼 Experiences found: ${(p.experience || p.experiences || p.positions || []).length}`);
        }
        return;
      } else {
        const err = await res.text();
        console.log(`⚠️ Apify error (${res.status}): ${err.slice(0, 200)}`);
      }
    } catch (e) {
      console.log('❌ Apify connection failed:', e.message);
    }
  } else if (scraperUrl || rapidApiKey) {
    console.log('✨ Scraper API configured in environment variables.');
    console.log(`🔗 Endpoint: ${scraperUrl || 'RapidAPI Fresh LinkedIn Profile'}`);
  } else {
    console.log('ℹ️ No APIFY_API_TOKEN or RAPIDAPI_KEY found in .env.local.');
    console.log('🌐 Attempting direct public HTTP request to LinkedIn...\n');
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    console.log(`📡 Response HTTP Status: ${res.status} ${res.statusText}`);
    
    if (res.status === 999) {
      console.log('\n❌ Result: HTTP 999 (Request Denied / Anti-Scraping Authwall)');
      console.log('👉 Explanation: LinkedIn actively blocks unauthenticated web scrapers and server IPs.');
      console.log('👉 Solution: The sync engine uses your verified profile snapshot or Scraper API to safely update Sanity without crashing.');
    } else if (res.status === 200) {
      console.log('✅ Public profile reachable! Parsing content...');
      const html = await res.text();
      console.log(`📄 Received ${html.length} bytes of markup.`);
    } else {
      console.log(`⚠️ LinkedIn returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('❌ Network fetch failed:', err.message);
  }
}

testFetch();
