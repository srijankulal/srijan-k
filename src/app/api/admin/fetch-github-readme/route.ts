import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const clean = url.trim().replace(/\.git$/i, '').replace(/\/$/, '');
  const match = clean.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i) ||
                clean.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function fetchReadmeFromGitHub(owner: string, repo: string): Promise<string> {
  // 1. Try GitHub REST API (resolves default branch automatically)
  try {
    const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'User-Agent': 'Portfolio-README-Fetcher',
        'Accept': 'application/vnd.github.raw+json',
      },
      next: { revalidate: 0 },
    });

    if (apiRes.ok) {
      const text = await apiRes.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    }
  } catch (err) {
    console.warn(`[GitHub API fetch error for ${owner}/${repo}]`, err);
  }

  // 2. Fallback to raw.githubusercontent.com across common branches & file namings
  const candidateUrls = [
    `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/main/readme.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/readme.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/dev/README.md`,
  ];

  for (const rawUrl of candidateUrls) {
    try {
      const rawRes = await fetch(rawUrl, { next: { revalidate: 0 } });
      if (rawRes.ok) {
        const text = await rawRes.text();
        if (text && text.trim().length > 0) {
          return text;
        }
      }
    } catch {
      // Continue trying next branch
    }
  }

  throw new Error(`Could not locate a README.md file in GitHub repository ${owner}/${repo}.`);
}

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'GitHub repository URL is required.' }, { status: 400 });
    }

    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid GitHub URL format. Use https://github.com/owner/repo' }, { status: 400 });
    }

    const readme = await fetchReadmeFromGitHub(parsed.owner, parsed.repo);

    return NextResponse.json({
      success: true,
      owner: parsed.owner,
      repo: parsed.repo,
      readme,
      sourceUrl: `https://github.com/${parsed.owner}/${parsed.repo}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch README from GitHub.' }, { status: 404 });
  }
}
