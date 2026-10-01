import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testApify() {
  const token = process.env.APIFY_API_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID || 'harvestapi~linkedin-profile-scraper';
  const url = 'https://www.linkedin.com/in/srijan-kulal/';
  const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}&timeout=60`;

  console.log('Fetching Apify data...');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries: [url] })
  });
  if (res.ok) {
    const items = await res.json();
    const raw = items[0]?.profile || items[0]?.data || items[0] || {};
    console.log('Available keys in Apify output:', Object.keys(raw));
    console.log('Sample data:');
    for (const key of ['headline', 'summary', 'about', 'activities', 'posts', 'articles', 'projects', 'volunteering', 'certifications', 'skills']) {
      if (raw[key]) {
        console.log(`- ${key}:`, typeof raw[key] === 'object' ? JSON.stringify(raw[key]).slice(0, 200) : String(raw[key]).slice(0, 200));
      }
    }
  } else {
    console.log('Apify returned:', res.status, await res.text());
  }
}
testApify();
