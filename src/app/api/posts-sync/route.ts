import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/sanity/lib/client';
import { summarizeProfileWithGemini, summarizeLeadershipWithGemini } from '@/lib/geminiSummarizer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const POSTS_DOC_ID = 'linkedin-posts-store';

function isAuthorized(req: NextRequest, bodyToken?: string): boolean {
  const secret = process.env.POSTS_PORTAL_SECRET || 'srijan-posts-sec-2026-auth';
  const url = new URL(req.url);
  const queryToken = url.searchParams.get('token') || url.searchParams.get('key');
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  return (
    queryToken === secret ||
    authHeader === secret ||
    bodyToken === secret
  );
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid access token' }, { status: 401 });
  }

  // Handle 1-click action from email: keep_existing
  if (action === 'keep_existing') {
    const now = new Date().toISOString();
    try {
      await writeClient.createOrReplace({
        _id: POSTS_DOC_ID,
        _type: 'linkedinPosts',
        title: 'Offline Bulk LinkedIn Posts & Reminder State',
        reviewStatus: 'up-to-date',
        lastUpdated: now,
        followupReminderSent: null,
      });

      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Resume Summary Confirmed</title>
          </head>
          <body style="background: #0b0f14; color: #c9d1d9; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="background: #161f2c; border: 1px solid #203348; padding: 32px; border-radius: 8px; text-align: center; max-width: 480px;">
              <h2 style="color: #7ee787; margin-top: 0;">✅ Summary Confirmed</h2>
              <p style="font-size: 14px; line-height: 1.6;">Your existing resume summary will remain active. The monthly reminder timer has been reset for another 30 days.</p>
              <a href="/resume" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #00e5ff; color: #000; font-weight: bold; text-decoration: none; border-radius: 4px;">View Resume</a>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to update reminder state', details: err.message }, { status: 500 });
    }
  }

  // Fetch current store and summary state
  try {
    const [postsDoc, currentSummary] = await Promise.all([
      client.fetch(`*[_type == "linkedinPosts" && _id == "${POSTS_DOC_ID}"][0]`),
      client.fetch(`*[_type == "profileSummary" && _id == "profile-summary"][0]`),
    ]);

    return NextResponse.json({
      success: true,
      postsDoc: postsDoc || null,
      currentSummary: currentSummary || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load posts store', details: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (!isAuthorized(req, body.token || body.secret)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid access token' }, { status: 401 });
  }

  const { action, postsText } = body;
  const now = new Date().toISOString();

  // Action: Keep existing summary without changes
  if (action === 'keep_existing') {
    try {
      const existing = await client.fetch(`*[_type == "linkedinPosts" && _id == "${POSTS_DOC_ID}"][0]`);
      await writeClient.createOrReplace({
        _id: POSTS_DOC_ID,
        _type: 'linkedinPosts',
        title: 'Offline Bulk LinkedIn Posts & Reminder State',
        rawText: existing?.rawText || '',
        postsCount: existing?.postsCount || 0,
        reviewStatus: 'up-to-date',
        lastUpdated: now,
        followupReminderSent: null,
      });

      return NextResponse.json({
        success: true,
        message: 'Existing summary confirmed and monthly reminder reset.',
      });
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to confirm existing summary', details: err.message }, { status: 500 });
    }
  }

  // Action: Regenerate summary from bulk posts
  if (action === 'regenerate') {
    if (!postsText || typeof postsText !== 'string' || postsText.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide bulk post text to summarize.' }, { status: 400 });
    }

    try {
      // 1. Split posts by common bulk separators (e.g. --- or multiple newlines)
      const rawPosts = postsText
        .split(/\n{3,}|---|\*\*\*|___/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20);

      const postsList = rawPosts.length > 0 ? rawPosts : [postsText.trim()];

      // 2. Fetch experiences and education from Sanity for complete context
      const [experiences, education] = await Promise.all([
        client.fetch<any[]>('*[_type == "experience"] | order(order asc, startDate desc)'),
        client.fetch<any[]>('*[_type == "education"] | order(order asc, startDate desc)'),
      ]);

      // 3. Summarize Profile with Gemini using user's direct, grounded prompt
      const summaryResult = await summarizeProfileWithGemini({
        name: 'Srijan Kulal',
        headline: 'Software Developer | B.C.A Student',
        experiences,
        education,
        posts: postsList,
      });

      // 4. Summarize Leadership & Technical Activities
      const leadershipResult = await summarizeLeadershipWithGemini({
        name: 'Srijan Kulal',
        experiences,
        posts: postsList,
      });

      // 5. Save updated profileSummary to Sanity
      await writeClient.createOrReplace({
        _id: 'profile-summary',
        _type: 'profileSummary',
        title: summaryResult.title || 'Software Developer',
        summary: summaryResult.summary,
        shortSummary: summaryResult.shortSummary,
        highlights: summaryResult.highlights,
        source: `Gemini AI (LinkedIn Experience & Bulk Posts: ${postsList.length} updates)`,
        lastUpdated: now,
        isCustomOverride: false,
      });

      // 6. Save updated leadership activities to Sanity
      if (Array.isArray(leadershipResult.activities)) {
        for (let i = 0; i < leadershipResult.activities.length; i++) {
          const item = leadershipResult.activities[i];
          await writeClient.createOrReplace({
            _id: `leadership-activity-${i}`,
            _type: 'leadershipActivity',
            title: item.title,
            description: item.description,
            source: item.source || 'Gemini AI (Bulk Posts Analysis)',
            order: i,
          });
        }
      }

      // 7. Save raw bulk posts and update reminder state in Sanity
      await writeClient.createOrReplace({
        _id: POSTS_DOC_ID,
        _type: 'linkedinPosts',
        title: 'Offline Bulk LinkedIn Posts & Reminder State',
        rawText: postsText,
        postsCount: postsList.length,
        reviewStatus: 'up-to-date',
        lastUpdated: now,
        lastSummaryGenerated: now,
        followupReminderSent: null,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully analyzed ${postsList.length} post updates with Gemini and updated your resume summary!`,
        postsCount: postsList.length,
        summary: summaryResult,
        leadership: leadershipResult.activities,
      });
    } catch (err: any) {
      console.error('[Posts Sync API] Error:', err);
      return NextResponse.json(
        { error: 'Failed to process bulk posts and generate summary', details: err.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Invalid action. Supported: "regenerate", "keep_existing"' }, { status: 400 });
}
