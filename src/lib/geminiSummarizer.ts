import { sendSummaryErrorEmail } from './errorNotifier';

export interface SummarizedLeadershipActivity {
  title: string;
  description: string;
  order: number;
  source?: string;
}

export interface SummarizedProfileSummary {
  title: string;
  summary: string;
  shortSummary: string;
  highlights: string[];
  source: string;
}

export interface ProfileContext {
  name?: string;
  headline?: string;
  about?: string;
  posts?: string[];
  activities?: string[];
  experiences?: any[];
  education?: any[];
  certifications?: any[];
  skills?: any[];
}

const DEFAULT_PROFILE_SUMMARY: SummarizedProfileSummary = {
  title: "Software Developer",
  summary: "As an MCA student at MIT Manipal, I am deeply passionate about technology and continuous learning. My primary expertise spans Artificial Intelligence, software engineering, and full-stack web development, and I am currently expanding my technical horizons by actively exploring IoT and embedded systems. I thrive in collaborative, fast-paced environments and actively participate in technical events, collegiate competitions, and hackathons to build practical solutions and challenge myself alongside my peers.",
  shortSummary: "MCA student at MIT Manipal specializing in AI, full-stack software engineering, and embedded IoT systems.",
  highlights: [
    "Academic & Specialization: MCA student at MIT Manipal focusing on Artificial Intelligence, distributed architectures, and modern software engineering.",
    "Full-Stack & Web Engineering: Built scalable web applications and RESTful APIs using Next.js, Python (Flask), Java (Spring Boot), TypeScript, and PostgreSQL.",
    "IoT & Embedded Systems: Practical prototyping experience with microcontrollers, Arduino (C++), and hardware-level telemetry.",
    "Technical Leadership & Hackathons: Active participant and top achiever in competitive collegiate hackathons, technical fests, and cross-functional team projects.",
    "Systems & Digital Forensics: Real-world internship background in Linux security controls and Windows digital forensics analysis."
  ],
  source: "MIT Manipal Profile Alignment"
};

const DEFAULT_LEADERSHIP_ACTIVITIES: SummarizedLeadershipActivity[] = [
  {
    title: "Open Source Leadership & Tooling",
    description: "Active contributor and maintainer of open-source utilities and microcontroller libraries on GitHub, including embedded C++ display drivers and Python background services.",
    order: 0,
    source: "Verified Baseline Analysis"
  },
  {
    title: "Engineering Team Leadership",
    description: "Served as Project Lead for multi-disciplinary teams in network security, digital cryptography, and full-stack web application development.",
    order: 1,
    source: "Verified Baseline Analysis"
  },
  {
    title: "Hardware & IoT Exploration",
    description: "Prototyping physical computing architectures with microcontrollers, 7-segment display controllers, and local socket telemetry.",
    order: 2,
    source: "Verified Baseline Analysis"
  }
];

/**
 * Summarizes LinkedIn experiences, posts, and activity into IEEE Professional Summary using Gemini API.
 * Dispatches an automated email alert with code inspection instructions if any error occurs.
 */
export async function summarizeProfileWithGemini(
  context: ProfileContext
): Promise<SummarizedProfileSummary> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    const errorMsg = 'No GEMINI_API_KEY detected in environment variables. Falling back to verified baseline.';
    console.warn('[Gemini Summarizer] ' + errorMsg);
    await sendSummaryErrorEmail({
      stage: 'missing_key',
      targetFile: 'src/lib/geminiSummarizer.ts',
      errorMessage: errorMsg,
      profileName: context.name,
      details: { resolution: 'Add GEMINI_API_KEY to your .env.local file or deployment environment variables.' }
    });
    return DEFAULT_PROFILE_SUMMARY;
  }

  const postsText = (context.posts || []).join('\n---\n');
  const expText = (context.experiences || []).map((e: any) => `${e.role} @ ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.summary || ''} [${(e.highlights || []).join('; ')}]`).join('\n');
  const skillsText = (context.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean).join(', ');

  const prompt = `
You are writing a resume summary for developer ${context.name || 'Srijan K'}.
Instruction:
"Write a summary for my resume based on my details below. Write it exactly how I would write it myself: direct, simple, and grounded. Keep it professional enough for a resume, but don't make it overly polished or formal, and don't use buzzwords or big words I wouldn't normally use. No fluff, no exaggeration, and don't add anything I didn't tell you. Keep it short, 3 to 4 sentences."

Details:
- Role & Current Education: MCA (Master of Computer Applications) student at MIT Manipal (Manipal Institute of Technology), focusing on Artificial Intelligence, software engineering, and embedded IoT systems.
- Prior Education: Bachelor of Computer Applications (B.C.A) from St. Aloysius University.
- Headline & About: ${context.headline || ''} | ${context.about || ''}
- Verified Professional Experience:
${expText}
- Key Skills: ${skillsText || 'Python, Flask, Java, Spring Boot, Next.js, React, TypeScript, Flutter, PostgreSQL, MySQL, C++, Arduino, IoT'}
- LinkedIn Posts & Technical Updates:
${postsText || 'Built full-stack web applications, image steganography utilities (PixelCypher), cross-platform apps (zeroUI Player), and embedded microcontroller libraries.'}

Generate an updated Professional Summary JSON object:
1. "title": "Software Developer"
2. "summary": Exactly 3 to 4 sentences written strictly in the user's requested style: direct, simple, grounded, no buzzwords, no exaggeration, professional. Mention current MCA pursuit at MIT Manipal and core focus on AI, full-stack web dev, and IoT.
3. "shortSummary": 1 to 2 direct sentences summarizing background for quick recruiter scan.
4. "highlights": 4 to 5 grounded bullet points representing verified competencies (Academic & Specialization, Full-Stack & Web Engineering, IoT & Embedded Systems, Technical Leadership & Hackathons, Systems & Forensics).

Return ONLY a valid JSON object matching this schema:
{
  "title": "Software Developer",
  "summary": "...",
  "shortSummary": "...",
  "highlights": ["...", "..."]
}
`.trim();

  const model = 'gemini-3.1-flash-lite';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1000 }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      const errMsg = `Gemini API returned HTTP ${res.status} (${res.statusText}): ${errBody.slice(0, 300)}`;
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'api_call',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        endpoint: endpoint.replace(/key=[^&]+/, 'key=REDACTED'),
        profileName: context.name,
        details: { status: res.status, statusText: res.statusText }
      });
      return DEFAULT_PROFILE_SUMMARY;
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      const errMsg = 'Gemini API returned 200 OK but candidate response text was empty or filtered.';
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'profile_summary',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        profileName: context.name,
        details: { candidateDetails: json.candidates?.[0] }
      });
      return DEFAULT_PROFILE_SUMMARY;
    }

    let parsed: any;
    try {
      const cleaned = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr: any) {
      const errMsg = `Failed to parse Gemini JSON response: ${parseErr.message}. Raw output snippet: ${candidateText.slice(0, 200)}`;
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'json_parse',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        errorStack: parseErr.stack,
        model,
        profileName: context.name,
        details: { rawCandidateText: candidateText.slice(0, 500) }
      });
      return DEFAULT_PROFILE_SUMMARY;
    }

    if (parsed && parsed.summary) {
      console.log('✨ Generated Professional Summary with Gemini API!');
      return {
        title: parsed.title || 'Software Developer',
        summary: parsed.summary,
        shortSummary: parsed.shortSummary || DEFAULT_PROFILE_SUMMARY.shortSummary,
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : DEFAULT_PROFILE_SUMMARY.highlights,
        source: `Gemini AI (${model})`
      };
    } else {
      const errMsg = 'Gemini JSON was valid but missing the required "summary" property.';
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'profile_summary',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        profileName: context.name,
        details: { parsed }
      });
    }
  } catch (err: any) {
    console.error('[Gemini Summarizer] Profile summary generation execution error:', err);
    await sendSummaryErrorEmail({
      stage: 'profile_summary',
      targetFile: 'src/lib/geminiSummarizer.ts',
      errorMessage: err.message || String(err),
      errorStack: err.stack,
      model,
      profileName: context.name,
    });
  }

  return DEFAULT_PROFILE_SUMMARY;
}

/**
 * Summarizes LinkedIn posts and activity into IEEE-standard Leadership & Technical Activities using Gemini API.
 * Dispatches an automated email alert with code inspection instructions if any error occurs.
 */
export async function summarizeLeadershipWithGemini(
  context: ProfileContext
): Promise<{ activities: SummarizedLeadershipActivity[]; source: string }> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    const errorMsg = 'No GEMINI_API_KEY detected in environment variables. Leadership summary skipped.';
    console.warn('[Gemini Summarizer] ' + errorMsg);
    await sendSummaryErrorEmail({
      stage: 'missing_key',
      targetFile: 'src/lib/geminiSummarizer.ts',
      errorMessage: errorMsg,
      profileName: context.name,
      details: { resolution: 'Add GEMINI_API_KEY to your .env.local file or deployment environment variables.' }
    });
    return {
      activities: DEFAULT_LEADERSHIP_ACTIVITIES,
      source: 'Verified Profile Baseline'
    };
  }

  const postsText = (context.posts || []).join('\n---\n');
  const activitiesText = (context.activities || []).join('\n---\n');
  const certsText = (context.certifications || []).map((c: any) => c.title || c.name).join(', ');
  const expText = (context.experiences || []).map((e: any) => `${e.role} @ ${e.company} (${e.summary || ''})`).join('\n');

  const prompt = `
You are an expert technical resume writer adhering to IEEE Standard formats.
Analyze the following LinkedIn profile, posts, certifications, and technical activity for ${context.name || 'Srijan Kulal'}:

Headline: ${context.headline || ''}
About: ${context.about || ''}
Experience:
${expText}
Certifications: ${certsText}
LinkedIn Posts / Updates:
${postsText || 'Focused on open-source development, Python backend services, and IoT microcontrollers.'}
LinkedIn Activities:
${activitiesText || 'Active in software development, embedded systems, and network security.'}

Generate 2 to 3 concise, impactful "Leadership & Technical Activities" bullet points suitable for an IEEE Technical Resume.
Requirements:
1. Each item must have a short, bold 'title' (e.g. "Open Source Leadership & Tooling", "Technical Project Lead", "IoT & Hardware Exploration").
2. Each item must have an action-oriented 'description' highlighting leadership, team management, open source contribution, or technical innovation.
3. Keep descriptions factual, professional, and directly relevant to the developer's verified skills.

Return ONLY a valid JSON array in this exact schema:
[
  {
    "title": "Topic Title",
    "description": "Concise high-impact bullet description."
  }
]
`.trim();

  const model = 'gemini-3.1-flash-lite';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 900 }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      const errMsg = `Gemini API returned HTTP ${res.status} (${res.statusText}): ${errText.slice(0, 300)}`;
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'api_call',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        endpoint: endpoint.replace(/key=[^&]+/, 'key=REDACTED'),
        profileName: context.name,
        details: { status: res.status, statusText: res.statusText }
      });
      return {
        activities: DEFAULT_LEADERSHIP_ACTIVITIES,
        source: 'Verified Profile Baseline (API Fallback)'
      };
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      const errMsg = 'Gemini API returned 200 OK but candidate text for leadership activities was empty.';
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'leadership_summary',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        profileName: context.name,
      });
      return { activities: DEFAULT_LEADERSHIP_ACTIVITIES, source: 'Verified Profile Baseline' };
    }

    let parsed: any;
    try {
      const cleanedJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedJson);
    } catch (parseErr: any) {
      const errMsg = `Failed to parse Gemini leadership response as JSON: ${parseErr.message}. Output snippet: ${candidateText.slice(0, 200)}`;
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'json_parse',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        errorStack: parseErr.stack,
        model,
        profileName: context.name,
        details: { rawCandidateText: candidateText.slice(0, 500) }
      });
      return { activities: DEFAULT_LEADERSHIP_ACTIVITIES, source: 'Verified Profile Baseline' };
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      const formatted: SummarizedLeadershipActivity[] = parsed.slice(0, 3).map((item, idx) => ({
        title: item.title || `Activity ${idx + 1}`,
        description: item.description || '',
        order: idx,
        source: `Gemini AI (${model})`
      }));

      console.log('✨ Generated Leadership Activities with Gemini API!');
      return {
        activities: formatted,
        source: `Gemini AI (${model})`
      };
    } else {
      const errMsg = 'Gemini response for leadership activities was not a valid non-empty array.';
      console.error('[Gemini Summarizer] ' + errMsg);
      await sendSummaryErrorEmail({
        stage: 'leadership_summary',
        targetFile: 'src/lib/geminiSummarizer.ts',
        errorMessage: errMsg,
        model,
        profileName: context.name,
        details: { parsed }
      });
    }
  } catch (err: any) {
    console.error('[Gemini Summarizer] Leadership summarizer execution error:', err);
    await sendSummaryErrorEmail({
      stage: 'leadership_summary',
      targetFile: 'src/lib/geminiSummarizer.ts',
      errorMessage: err.message || String(err),
      errorStack: err.stack,
      model,
      profileName: context.name,
    });
  }

  return {
    activities: DEFAULT_LEADERSHIP_ACTIVITIES,
    source: 'Verified Profile Baseline'
  };
}
