import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `
Write a summary for my resume based on my details below. Write it exactly how I would write it myself: direct, simple, and grounded. Keep it professional enough for a resume, but don't make it overly polished or formal, and don't use buzzwords or big words I wouldn't normally use. No fluff, no exaggeration, and don't add anything I didn't tell you. Keep it short, 3 to 4 sentences.

Details:
- Role & Education: Software developer currently pursuing a Bachelor of Computer Applications (B.C.A) at St. Aloysius University, Mangalore.
- Engineering Leadership & Security: Led a cross-functional engineering team of 8 as Project Lead at Excelerate, setting up secure Linux environments with Risk Management Framework (RMF) controls and network monitoring tools like Wireshark, Tripwire, and Iftop.
- Digital Forensics: Analyzed Windows registry artifacts and extracted forensic insights during an internship at Sanmati Forensic Lab.
- Development & IoT: Build applications using Python (Flask), Java (Spring Boot), Next.js, and Flutter, with hands-on work in embedded systems using C++ and Arduino. Recognized as a top performer at Mindler for project execution.
`.trim();

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 300 }
    })
  });

  const data = await res.json();
  console.log('\n--- GEMINI GROUNDED SUMMARY ---');
  console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
}

run();
