import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-04',
  useCdn: false
});

async function verify() {
  const exps = await c.fetch('*[_type == "experience"] | order(order asc, startDate desc)');
  const edus = await c.fetch('*[_type == "education"] | order(order asc, startDate desc)');
  const leads = await c.fetch('*[_type == "leadershipActivity"] | order(order asc)');
  const meta = await c.fetch('*[_type == "syncMetadata" && _id == "linkedin-sync-metadata"][0]');

  console.log('✅ Sanity Experience Items Count:', exps.length);
  exps.forEach(e => console.log(' -', e.role, '@', e.company, `(${e.startDate} - ${e.endDate || 'Present'})`));

  console.log('\n✅ Sanity Education Items Count:', edus.length);
  edus.forEach(e => console.log(' -', e.degree, '@', e.institution));

  const summary = await c.fetch('*[_type == "profileSummary" && _id == "profile-summary"][0]');

  console.log('\n📄 --- LIVE PROFILE SUMMARY IN SANITY (GEMINI GENERATED) ---');
  console.log('Title:', summary?.title);
  console.log('Summary:\n', summary?.summary);
  console.log('Short Summary:\n', summary?.shortSummary);
  console.log('Highlights:', summary?.highlights);
  console.log('Source:', summary?.source);

  console.log('\n🌟 --- LIVE LEADERSHIP ACTIVITIES IN SANITY (GEMINI GENERATED) ---');
  leads.forEach((l, i) => {
    console.log(`${i + 1}. [${l.title}]:\n   ${l.description}`);
  });
}

verify();
