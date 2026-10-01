import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const key = process.env.GEMINI_API_KEY;

const testModels = [
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

async function testAll() {
  console.log('Testing models for response...');
  for (const m of testModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Respond with OK' }] }] })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`🎉 SUCCESS with model: ${m}! Output:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
        return m;
      } else {
        console.log(`❌ Model ${m}: HTTP ${res.status} - ${data.error?.message?.slice(0, 80)}`);
      }
    } catch (e) {
      console.log(`Err on ${m}:`, e.message);
    }
  }
  return null;
}

testAll();
