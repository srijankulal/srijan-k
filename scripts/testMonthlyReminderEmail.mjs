import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { Resend } from 'resend';

console.log('🧪 Testing Monthly Posts Reminder Email Dispatching...');

const apiKey = process.env.RESEND_API_KEY;
const recipient = process.env.ALERT_EMAIL || 'srijankulal1010@gmail.com';
const portalSecret = process.env.POSTS_PORTAL_SECRET || 'srijan-posts-sec-2026-auth';
const siteUrl = 'https://srijan-k.me';
const portalUrl = `${siteUrl}/admin/posts-sync?token=${encodeURIComponent(portalSecret)}`;
const keepExistingUrl = `${siteUrl}/api/posts-sync?action=keep_existing&token=${encodeURIComponent(portalSecret)}`;

if (!apiKey) {
  console.error('❌ RESEND_API_KEY missing');
  process.exit(1);
}

const resend = new Resend(apiKey);
const nowReadable = new Date().toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Monthly LinkedIn Posts Sync</title>
  </head>
  <body style="margin: 0; padding: 24px 12px; background-color: #0b0f14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, monospace; color: #c9d1d9;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #121820; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.7);">
      
      <div style="background: linear-gradient(135deg, #1b2838 0%, #121820 100%); padding: 26px 28px; border-bottom: 1px solid #00ffff33;">
        <div style="display: inline-block; padding: 4px 10px; background-color: #00ffff22; border: 1px solid #00ffff; color: #00ffff; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
          Monthly Sync Routine
        </div>
        <h1 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0; font-family: monospace; font-weight: 700;">
          📬 Update LinkedIn Posts for Resume
        </h1>
        <p style="color: #8b949e; font-size: 13px; margin: 0; font-family: monospace;">
          portfolio: srijan-k.me • date: ${nowReadable}
        </p>
      </div>

      <div style="padding: 28px;">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #e6edf3;">
          Hello Srijan,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #c9d1d9;">
          It has been 30 days since your last LinkedIn posts review. To ensure your resume summary and leadership activities stay accurate and up to date, you can upload your latest offline scraped posts or choose to keep your current summary.
        </p>

        <div style="background-color: #161f2c; border: 1px solid #203348; border-radius: 8px; padding: 22px; margin: 24px 0; text-align: center;">
          <div style="margin-bottom: 20px;">
            <a href="${portalUrl}" style="display: inline-block; background-color: #00e5ff; color: #050b14; font-weight: 700; font-size: 14px; padding: 12px 28px; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 229, 255, 0.3);">
              🚀 Upload New Bulk Posts
            </a>
            <p style="font-size: 12px; color: #8b949e; margin: 8px 0 0 0;">
              Opens your private, authenticated upload portal.
            </p>
          </div>

          <div style="border-top: 1px solid #212e3d; margin: 18px 0;"></div>

          <div>
            <a href="${keepExistingUrl}" style="display: inline-block; background-color: transparent; border: 1px solid #58a6ff; color: #58a6ff; font-weight: 600; font-size: 13px; padding: 10px 22px; text-decoration: none; border-radius: 6px;">
              ⏩ Continue with Current Summary (No New Posts)
            </a>
            <p style="font-size: 12px; color: #8b949e; margin: 8px 0 0 0;">
              Instantly confirms no changes and resets the 30-day timer with 1 click.
            </p>
          </div>
        </div>

        <div style="background-color: #0d1117; border-left: 3px solid #f0883e; padding: 14px 18px; border-radius: 0 6px 6px 0; margin: 20px 0;">
          <div style="font-weight: 700; font-size: 12px; color: #f0883e; margin-bottom: 4px; text-transform: uppercase;">
            ⏳ 48-Hour Grace Period Policy
          </div>
          <div style="font-size: 12px; color: #8b949e; line-height: 1.5;">
            If you do not take action within <strong>2 days</strong>, a follow-up reminder will be sent. If no action is taken after that, your existing resume summary will smoothly stay active until the next monthly cycle.
          </div>
        </div>
      </div>

      <div style="background-color: #0b0f14; padding: 14px 28px; text-align: center; border-top: 1px solid #21262d; font-size: 11px; color: #6e7681; font-family: monospace;">
        Automated Reminder Service • Srijan K Portfolio (srijan-k.me)
      </div>
    </div>
  </body>
</html>
`.trim();

async function run() {
  console.log(`📡 Sending test monthly reminder email to ${recipient}...`);
  const res = await resend.emails.send({
    from: 'Portfolio Sync <onboarding@resend.dev>',
    to: [recipient],
    subject: `📬 [Monthly Reminder] Update Your LinkedIn Posts for Resume Summary`,
    html,
  });

  if (res.error) {
    console.error('❌ Resend Error:', res.error);
    process.exit(1);
  }

  console.log('✅ SUCCESS! Monthly reminder email delivered.');
  console.log('📧 Message ID:', res.data?.id);
  console.log('🔗 Portal Link included:', portalUrl);
}

run();
