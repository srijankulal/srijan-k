import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { createClient } from 'next-sanity';
import { Resend } from 'resend';

const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const geminiApiKey = process.env.GEMINI_API_KEY;

console.log('🤖 Gemini API Key configured:', Boolean(geminiApiKey));
console.log('📡 Sanity Project:', projectId, 'Dataset:', dataset);

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-04',
  useCdn: false,
  token,
});

async function callGemini(prompt, model = 'gemini-3.1-flash-lite') {
  // Use responsive active models
  const models = [model, 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.7-flash', 'gemini-flash-latest'];
  let lastError = null;

  for (const m of models) {
    try {
      console.log(`📡 Calling Gemini API with model: ${m}...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiApiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`⚠️ Model ${m} returned ${res.status}:`, errText.slice(0, 200));
        lastError = errText;
        continue;
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      console.warn(`⚠️ Request error on ${m}:`, e.message);
      lastError = e.message;
    }
  }

  throw new Error(`All Gemini models failed: ${lastError}`);
}

function parseJsonSafely(raw) {
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  const target = match ? match[0] : raw;
  return JSON.parse(target);
}

async function run() {
  console.log('\n🚀 Starting Real-time Gemini Summary Generation...');

  // 1. Fetch current authentic experiences, education, and LinkedIn info from Sanity
  const [experiences, education] = await Promise.all([
    client.fetch('*[_type == "experience"] | order(order asc, startDate desc)'),
    client.fetch('*[_type == "education"] | order(order asc, startDate desc)')
  ]);

  console.log(`📊 Found ${experiences.length} experiences and ${education.length} education entries in Sanity.`);

  // 2. Fetch Apify data if available to get raw posts / activities
  let rawPosts = [];
  let rawAbout = '';
  let headline = 'Software Developer';

  try {
    const apifyToken = process.env.APIFY_API_TOKEN;
    const actorId = process.env.APIFY_ACTOR_ID || 'harvestapi~linkedin-profile-scraper';
    const profileUrl = 'https://www.linkedin.com/in/srijan-kulal/';
    if (apifyToken) {
      console.log('🔍 Checking Apify for recent profile details & posts...');
      const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}&timeout=45`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: [profileUrl] })
      });
      if (res.ok) {
        const items = await res.json();
        const raw = items[0]?.profile || items[0]?.data || items[0] || {};
        rawAbout = raw.about || '';
        headline = raw.headline || headline;
        rawPosts = raw.posts || raw.activities || [];
        console.log(`✨ Retrieved profile data from Apify. Headline: "${headline}"`);
      }
    }
  } catch (e) {
    console.warn('ℹ️ Apify quick check skipped or timed out, continuing with Sanity profile data.');
  }

  // 3. Compile context for Gemini
  const expContext = experiences.map(e => 
    `- Role: ${e.role} at ${e.company} (${e.startDate} – ${e.endDate || 'Present'}) [${e.type}]
     Summary: ${e.summary || 'N/A'}
     Highlights: ${(e.highlights || []).join('; ')}
     Tech: ${(e.technologies || []).join(', ')}`
  ).join('\n\n');

  const eduContext = education.map(e =>
    `- ${e.degree} at ${e.institution} (${e.startDate} – ${e.endDate || 'Present'})`
  ).join('\n');

  // 4. Generate Professional Summary with Gemini
  const summaryPrompt = `
You are writing a resume summary for developer Srijan K.
Instruction:
"Write a summary for my resume based on my details below. Write it exactly how I would write it myself: direct, simple, and grounded. Keep it professional enough for a resume, but don't make it overly polished or formal, and don't use buzzwords or big words I wouldn't normally use. No fluff, no exaggeration, and don't add anything I didn't tell you. Keep it short, 3 to 4 sentences."

Details:
- Role & Education: Software Developer pursuing a Bachelor of Computer Applications (B.C.A) at St. Aloysius University, Mangalore.
- Headline & About: ${headline} | ${rawAbout || ''}
- Verified Professional Experience:
${expContext}
- Academic Education:
${eduContext}
- Key Projects & Posts:
${rawPosts.length > 0 ? rawPosts.join('\n') : 'Built event MVP platform (Balipu Club), LSB image steganography tool (PixelCypher), Flutter media player (zeroUI Player), and Arduino LED display drivers.'}

Generate an updated Professional Summary JSON object:
1. "title": "Software Developer"
2. "summary": Exactly 3 to 4 sentences written strictly in the user's requested style: direct, simple, grounded, no buzzwords, no exaggeration, professional.
3. "shortSummary": 1 to 2 direct sentences summarizing their background for quick recruiter scan.
4. "highlights": 4 to 5 grounded bullet points representing verified competencies.

Return ONLY a valid JSON object matching this exact schema:
{
  "title": "Software Developer",
  "summary": "...",
  "shortSummary": "...",
  "highlights": ["...", "..."]
}
`.trim();

  console.log('\n🤖 Generating Professional Summary via Gemini...');
  const summaryRaw = await callGemini(summaryPrompt);
  const summaryJson = parseJsonSafely(summaryRaw);

  console.log('✅ Generated Summary:\n', summaryJson.summary);

  // 5. Generate Leadership & Technical Activities with Gemini
  const leadershipPrompt = `
You are an expert technical resume writer adhering to IEEE Standard formats.
Analyze the developer's experience, project leadership, and technical initiatives:

Experiences:
${expContext}

Task:
Generate 3 distinct, high-impact "Leadership & Technical Activities" bullet points suitable for an IEEE Technical Resume.
Each item must have:
- "title": A bold category title (e.g. "Technical Project Leadership", "Open Source Development & Tooling", "Digital Forensics & Security Research", "Hardware & IoT Prototyping").
- "description": Action-driven description highlighting leadership, cross-functional collaboration, technical milestones, or open-source stewardship.

Return ONLY a valid JSON array matching this schema:
[
  {
    "title": "Category Title",
    "description": "Action-driven impact statement."
  }
]
`.trim();

  console.log('\n🤖 Generating Leadership & Technical Activities via Gemini...');
  const leadRaw = await callGemini(leadershipPrompt);
  const leadJson = parseJsonSafely(leadRaw);

  console.log('✅ Generated Leadership Activities:', leadJson.map(l => l.title));

  // 6. Save directly into Sanity CMS
  const now = new Date().toISOString();

  // Save profileSummary
  await client.createOrReplace({
    _id: 'profile-summary',
    _type: 'profileSummary',
    title: summaryJson.title || 'Software Developer',
    summary: summaryJson.summary,
    shortSummary: summaryJson.shortSummary,
    highlights: summaryJson.highlights || [],
    source: 'Gemini AI (LinkedIn Experience & Posts Analysis)',
    lastUpdated: now,
    isCustomOverride: false,
  });
  console.log('\n💾 Saved profileSummary to Sanity CMS (editable in Sanity Studio)!');

  // Save leadershipActivity documents
  if (Array.isArray(leadJson)) {
    for (let i = 0; i < leadJson.length; i++) {
      const item = leadJson[i];
      await client.createOrReplace({
        _id: `leadership-activity-${i}`,
        _type: 'leadershipActivity',
        title: item.title,
        description: item.description,
        source: 'Gemini AI (LinkedIn Analysis)',
        order: i,
      });
      console.log(`💾 Saved Leadership Activity [${i + 1}]: ${item.title}`);
    }
  }

  console.log('\n🎉 ALL SUMMARIES SUCCESSFULLY CREATED BY GEMINI AND STORED IN SANITY!');
}

run().catch(async (err) => {
  console.error('❌ Error generating summary:', err);

  const resendApiKey = process.env.RESEND_API_KEY;
  const alertRecipient = process.env.ALERT_EMAIL || 'srijankulal1010@gmail.com';

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      console.log(`📧 Sending failure alert email to ${alertRecipient}...`);
      await resend.emails.send({
        from: 'Portfolio Alerts <onboarding@resend.dev>',
        to: [alertRecipient],
        subject: `🚨 [Portfolio Action Required] Check Summarization Code: ${err.message.slice(0, 50)}`,
        html: `
          <div style="font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 24px; border: 1px solid #da3633; border-radius: 8px;">
            <h2 style="color: #f85149; margin-top: 0;">🚨 Gemini Summarization Pipeline Error</h2>
            <p>An error occurred while running the summary generator.</p>
            <div style="background: #21262d; padding: 12px; border-left: 4px solid #da3633; margin: 16px 0;">
              <strong>📂 File to Check:</strong> <code style="color: #58a6ff;">scripts/generateSummaryNow.mjs</code> / <code style="color: #58a6ff;">src/lib/geminiSummarizer.ts</code>
            </div>
            <div style="background: #1f1115; border: 1px solid #67171d; padding: 12px; border-radius: 4px; margin: 16px 0;">
              <strong style="color: #ff7b72;">⚠️ Error Message:</strong>
              <pre style="color: #ff7b72; margin: 8px 0 0 0; white-space: pre-wrap;">${err.message}</pre>
            </div>
            ${err.stack ? `<pre style="background: #161b22; padding: 10px; font-size: 11px; color: #8b949e; overflow-x: auto;">${err.stack.slice(0, 1000)}</pre>` : ''}
            <div style="margin-top: 20px; padding: 12px; background: #161b22; border-radius: 4px;">
              <strong style="color: #7ee787;">🛠️ Action to take:</strong>
              <p style="margin: 6px 0 0 0; font-size: 12px;">Check your GEMINI_API_KEY, network connectivity, and prompt output schemas.</p>
            </div>
          </div>
        `
      });
      console.log('✅ Error alert email dispatched successfully.');
    } catch (mailErr) {
      console.error('Failed to send error alert email:', mailErr);
    }
  }

  process.exit(1);
});

