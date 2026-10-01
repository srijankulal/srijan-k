import { NextRequest, NextResponse } from 'next/server';
import { syncLinkedInToSanity } from '@/lib/linkedinSync';
import { client, writeClient } from '@/sanity/lib/client';
import { sendMonthlyPostsReminderEmail, sendFollowupPostsReminderEmail } from '@/lib/postsReminderNotifier';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const url = new URL(req.url);
  const secretParam = url.searchParams.get('secret');
  const username = url.searchParams.get('username') || 'srijan-kulal';

  // Verify authentication if CRON_SECRET is configured
  if (cronSecret && process.env.NODE_ENV === 'production') {
    const isAuthorized =
      isVercelCron ||
      authHeader === `Bearer ${cronSecret}` ||
      secretParam === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing Cron Secret' },
        { status: 401 }
      );
    }
  }

  const force = url.searchParams.get('force') === 'true' || url.searchParams.get('force') === '1';

  try {
    // 1. Run monthly profile & experience sync
    const report = await syncLinkedInToSanity({ username, force });

    // 2. Check & manage monthly LinkedIn posts bulk reminder & 48-hour follow-up
    let reminderStatus = 'none';
    try {
      const portalSecret = process.env.POSTS_PORTAL_SECRET || 'srijan-posts-sec-2026-auth';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://srijan-k.me';
      const portalUrl = `${siteUrl}/admin/posts-sync?token=${encodeURIComponent(portalSecret)}`;
      const keepExistingUrl = `${siteUrl}/api/posts-sync?action=keep_existing&token=${encodeURIComponent(portalSecret)}`;

      const postsDoc = await client.fetch(`*[_type == "linkedinPosts" && _id == "linkedin-posts-store"][0]`);
      const nowTime = Date.now();
      const nowIso = new Date().toISOString();

      const lastUpdated = postsDoc?.lastUpdated ? new Date(postsDoc.lastUpdated).getTime() : 0;
      const lastReminder = postsDoc?.lastReminderSent ? new Date(postsDoc.lastReminderSent).getTime() : 0;
      const followupSent = postsDoc?.followupReminderSent ? new Date(postsDoc.followupReminderSent).getTime() : 0;
      const reviewStatus = postsDoc?.reviewStatus || 'up-to-date';

      const daysSinceUpdate = lastUpdated > 0 ? (nowTime - lastUpdated) / (1000 * 60 * 60 * 24) : 999;
      const daysSinceReminder = lastReminder > 0 ? (nowTime - lastReminder) / (1000 * 60 * 60 * 24) : 999;

      // Condition A: Monthly reminder (>= 30 days since last update or reminder)
      if (daysSinceUpdate >= 30 && daysSinceReminder >= 30) {
        await sendMonthlyPostsReminderEmail({ portalUrl, keepExistingUrl });
        await writeClient.createOrReplace({
          _id: 'linkedin-posts-store',
          _type: 'linkedinPosts',
          title: 'Offline Bulk LinkedIn Posts & Reminder State',
          rawText: postsDoc?.rawText || '',
          postsCount: postsDoc?.postsCount || 0,
          lastReminderSent: nowIso,
          reviewStatus: 'reminder-sent',
          followupReminderSent: null,
        });
        reminderStatus = 'monthly_reminder_sent';
      }
      // Condition B: 48-Hour Follow-up if user has not yet acted
      else if (reviewStatus === 'reminder-sent' && daysSinceReminder >= 2 && !followupSent) {
        await sendFollowupPostsReminderEmail({ portalUrl, keepExistingUrl });
        await writeClient.createOrReplace({
          ...postsDoc,
          _id: 'linkedin-posts-store',
          _type: 'linkedinPosts',
          followupReminderSent: nowIso,
          reviewStatus: 'followup-sent',
        });
        reminderStatus = 'followup_48h_reminder_sent';
      }
      // Condition C: Grace period ended (2 days after follow-up) -> retain existing summary till next month
      else if (reviewStatus === 'followup-sent' && followupSent > 0) {
        const daysSinceFollowup = (nowTime - followupSent) / (1000 * 60 * 60 * 24);
        if (daysSinceFollowup >= 2) {
          await writeClient.createOrReplace({
            ...postsDoc,
            _id: 'linkedin-posts-store',
            _type: 'linkedinPosts',
            reviewStatus: 'dismissed',
          });
          reminderStatus = 'grace_period_ended_retaining_old_summary';
        }
      }
    } catch (reminderErr: any) {
      console.warn('[Cron] Posts reminder error:', reminderErr.message);
    }

    return NextResponse.json(
      {
        message: report.message || (report.status === 'skipped' ? 'Monthly sync already up to date' : 'LinkedIn sync completed'),
        ...report,
        reminderStatus,
      },
      {
        status: report.success ? 200 : (report.error ? 500 : 200),
      }
    );
  } catch (error: any) {
    console.error('LinkedIn Sync Cron Failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync LinkedIn data to Sanity',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
