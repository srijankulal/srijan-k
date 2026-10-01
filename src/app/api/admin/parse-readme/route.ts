import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ExtractedProject {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  linkToCode: string;
  linkToLive: string;
  isFreelance: boolean;
  detailsText: string;
  missing: {
    image: boolean;
    linkToCode: boolean;
    linkToLive: boolean;
  };
}

function cleanMarkdownJson(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

function fallbackHeuristicParse(readme: string, githubUrl?: string): ExtractedProject {
  // Extract title from first # heading or title line
  const titleMatch = readme.match(/^#\s+(?:[^\w\s]*\s*)?([^\n\r]+)/m) || readme.match(/title:\s*["']?([^"'\n\r]+)/i);
  let title = titleMatch ? titleMatch[1].replace(/^[^\w\s]+/, '').trim() : 'New Project';
  title = title.split('—')[0].split('-')[0].trim();

  // Generate slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Extract description from blockquote or first paragraph
  const quoteMatch = readme.match(/^>\s*\*?([^\n\r*]+)\*?/m);
  const descMatch = readme.match(/(?:^|\n\n)([A-Z][^\n\r]{40,250}\.)(?:\n\n|$)/m);
  const description = quoteMatch ? quoteMatch[1].trim() : descMatch ? descMatch[1].trim() : `${title} application and system architecture.`;

  // Extract technologies
  const techKeywords = [
    'Next.js', 'React', 'TypeScript', 'JavaScript', 'Python', 'Flask', 'FastAPI', 'Django',
    'Spring Boot', 'Java', 'Flutter', 'Dart', 'Node.js', 'Express', 'Supabase', 'PostgreSQL',
    'MySQL', 'MongoDB', 'Redis', 'Pinecone', 'Gemini', 'OpenAI', 'Tailwind', 'Tailwind CSS',
    'TanStack Start', 'Vite', 'Clerk', 'Cloudinary', 'Resend', 'AES-256-GCM', 'C++', 'Arduino',
    'Docker', 'Kubernetes', 'Vercel', 'AWS', 'GCP'
  ];

  const foundTech: string[] = [];
  techKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(readme)) {
      foundTech.push(kw);
    }
  });

  // Extract links
  const codeMatch = readme.match(/https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/i);
  const liveMatch = readme.match(/https:\/\/[a-zA-Z0-9_.-]+\.(?:vercel\.app|web\.app|com|dev|io)/i);

  const linkToCode = githubUrl || (codeMatch ? codeMatch[0] : '');
  const linkToLive = liveMatch && !liveMatch[0].includes('github.com') ? liveMatch[0] : '';

  return {
    title,
    slug,
    description,
    technologies: foundTech.length > 0 ? foundTech : ['Full-Stack', 'TypeScript'],
    linkToCode,
    linkToLive,
    isFreelance: /freelance|client/i.test(readme),
    detailsText: readme.slice(0, 3000),
    missing: {
      image: true,
      linkToCode: !linkToCode,
      linkToLive: !linkToLive,
    }
  };
}

import { parseGitHubUrl, fetchReadmeFromGitHub } from '@/app/api/admin/fetch-github-readme/route';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    let { readme, githubUrl, token } = await req.json();

    if (!isAuthorizedAdmin(req, token)) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    if ((!readme || typeof readme !== 'string' || readme.trim().length === 0) && githubUrl) {
      const parsedGithub = parseGitHubUrl(githubUrl);
      if (parsedGithub) {
        try {
          readme = await fetchReadmeFromGitHub(parsedGithub.owner, parsedGithub.repo);
        } catch (fetchErr: any) {
          return NextResponse.json({ error: fetchErr.message || 'Failed to fetch README from GitHub.' }, { status: 400 });
        }
      }
    }

    if (!readme || typeof readme !== 'string' || readme.trim().length === 0) {
      return NextResponse.json({ error: 'README content or valid GitHub URL is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('[Parse README] No GEMINI_API_KEY found, falling back to heuristic parser.');
      const parsed = fallbackHeuristicParse(readme, githubUrl);
      return NextResponse.json({ project: parsed, source: 'heuristic' });
    }

    const prompt = `You are a technical software portfolio architect. Analyze the following project README.md (and optional GitHub URL) and extract structured project metadata for a developer portfolio.

README Markdown Content:
"""
${readme.slice(0, 8000)}
"""
${githubUrl ? `GitHub Repo URL: ${githubUrl}` : ''}

Strictly extract and generate a valid JSON object matching this schema:
{
  "title": "Clean, proper project name (e.g. '2U Postal', 'DeepNote', 'zeroUI Player')",
  "slug": "url-friendly-kebab-case-slug (e.g. '2u-postal', 'deepnote', 'zeroui-player')",
  "description": "A crisp, engaging 2 to 3 sentence technical summary of what the project does, key problem it solves, and its architecture highlights.",
  "technologies": ["Array of distinct technologies, languages, libraries, and frameworks detected, e.g. 'TanStack Start', 'React', 'Supabase', 'Clerk', 'Cloudinary', 'Resend', 'AES-256-GCM', 'TypeScript'"],
  "linkToCode": "Direct GitHub or source repository URL if found, else empty string",
  "linkToLive": "Live deployment or production demo URL if found, else empty string",
  "isFreelance": false,
  "detailsText": "A structured, clean markdown engineering breakdown organized into logical sections:\\n\\nOverview:\\n[2 to 3 concise paragraphs explaining vision, architecture, and workflow]\\n\\nCore Features:\\n• [Feature 1 with clear summary]\\n• [Feature 2 with clear summary]\\n\\nArchitecture & Pipeline:\\n• [Services, database schemas, cryptographic flow, or API microservices]\\n\\nSecurity & Privacy:\\n• [Encryption controls, auth protocols, or tamper prevention]"
}

Output ONLY the JSON object. Do not enclose in markdown blocks if possible, or use standard json block.`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let jsonResult: any = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 2500 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = cleanMarkdownJson(rawText);
            jsonResult = JSON.parse(cleaned);
            break;
          }
        }
      } catch (err) {
        console.warn(`[Parse README] Attempt with model ${model} failed, trying next...`, err);
      }
    }

    if (!jsonResult) {
      console.warn('[Parse README] Gemini models could not parse output, using heuristic fallback.');
      const parsed = fallbackHeuristicParse(readme, githubUrl);
      return NextResponse.json({ project: parsed, source: 'heuristic' });
    }

    // Ensure links and missing indicators are properly set
    const finalLinkToCode = githubUrl || jsonResult.linkToCode || '';
    const finalLinkToLive = jsonResult.linkToLive || '';

    const project: ExtractedProject = {
      title: jsonResult.title || 'Untitled Project',
      slug: (jsonResult.slug || jsonResult.title || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      description: jsonResult.description || 'Project details and architecture overview.',
      technologies: Array.isArray(jsonResult.technologies) ? jsonResult.technologies : [],
      linkToCode: finalLinkToCode,
      linkToLive: finalLinkToLive,
      isFreelance: Boolean(jsonResult.isFreelance),
      detailsText: jsonResult.detailsText || readme.slice(0, 2000),
      missing: {
        image: true,
        linkToCode: !finalLinkToCode,
        linkToLive: !finalLinkToLive,
      }
    };

    return NextResponse.json({ project, source: 'gemini' });
  } catch (err: any) {
    console.error('[Parse README Error]', err);
    return NextResponse.json({ error: err.message || 'Failed to parse README with Gemini.' }, { status: 500 });
  }
}
