import { Resend } from 'resend';

const DEFAULT_RECIPIENT = 'srijankulal1010@gmail.com';

interface ReminderEmailOptions {
  portalUrl: string;
  keepExistingUrl: string;
  recipient?: string;
  lastUpdatedDate?: string;
}

/**
 * Dispatches monthly email asking user to upload new bulk LinkedIn posts or keep old summary.
 */
export async function sendMonthlyPostsReminderEmail(
  options: ReminderEmailOptions
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = options.recipient || process.env.ALERT_EMAIL || DEFAULT_RECIPIENT;

  if (!apiKey) {
    console.warn('[Posts Reminder] RESEND_API_KEY not configured. Cannot send monthly reminder email.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
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
          
          <!-- Header Banner -->
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

          <!-- Body Content -->
          <div style="padding: 28px;">
            <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #e6edf3;">
              Hello Srijan,
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #c9d1d9;">
              It has been 30 days since your last LinkedIn posts review. To ensure your resume summary and leadership activities stay accurate and up to date, you can upload your latest offline scraped posts or choose to keep your current summary.
            </p>

            <!-- Actions Panel -->
            <div style="background-color: #161f2c; border: 1px solid #203348; border-radius: 8px; padding: 22px; margin: 24px 0; text-align: center;">
              
              <!-- Option A: Upload Posts -->
              <div style="margin-bottom: 20px;">
                <a href="${options.portalUrl}" style="display: inline-block; background-color: #00e5ff; color: #050b14; font-weight: 700; font-size: 14px; padding: 12px 28px; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 229, 255, 0.3);">
                  🚀 Upload New Bulk Posts
                </a>
                <p style="font-size: 12px; color: #8b949e; margin: 8px 0 0 0;">
                  Opens your private, authenticated upload portal.
                </p>
              </div>

              <div style="border-top: 1px solid #212e3d; margin: 18px 0;"></div>

              <!-- Option B: Keep Same Summary -->
              <div>
                <a href="${options.keepExistingUrl}" style="display: inline-block; background-color: transparent; border: 1px solid #58a6ff; color: #58a6ff; font-weight: 600; font-size: 13px; padding: 10px 22px; text-decoration: none; border-radius: 6px;">
                  ⏩ Continue with Current Summary (No New Posts)
                </a>
                <p style="font-size: 12px; color: #8b949e; margin: 8px 0 0 0;">
                  Instantly confirms no changes and resets the 30-day timer with 1 click.
                </p>
              </div>
            </div>

            <!-- Reminder Policy Notice -->
            <div style="background-color: #0d1117; border-left: 3px solid #f0883e; padding: 14px 18px; border-radius: 0 6px 6px 0; margin: 20px 0;">
              <div style="font-weight: 700; font-size: 12px; color: #f0883e; margin-bottom: 4px; text-transform: uppercase;">
                ⏳ 48-Hour Grace Period Policy
              </div>
              <div style="font-size: 12px; color: #8b949e; line-height: 1.5;">
                If you do not take action within <strong>2 days</strong>, a follow-up reminder will be sent. If no action is taken after that, your existing resume summary will smoothly stay active until the next monthly cycle.
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #0b0f14; padding: 14px 28px; text-align: center; border-top: 1px solid #21262d; font-size: 11px; color: #6e7681; font-family: monospace;">
            Automated Reminder Service • Srijan K Portfolio (srijan-k.me)
          </div>
        </div>
      </body>
    </html>
  `.trim();

  try {
    const res = await resend.emails.send({
      from: 'Portfolio Sync <onboarding@resend.dev>',
      to: [to],
      subject: `📬 [Monthly Reminder] Update Your LinkedIn Posts for Resume Summary`,
      html,
    });

    if (res.error) {
      console.error('[Posts Reminder] Resend error:', res.error);
      return { success: false, error: res.error.message };
    }

    console.log(`📧 Monthly reminder email delivered to ${to} (ID: ${res.data?.id})`);
    return { success: true, id: res.data?.id };
  } catch (err: any) {
    console.error('[Posts Reminder] Execution exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches 48-hour follow-up reminder email.
 */
export async function sendFollowupPostsReminderEmail(
  options: ReminderEmailOptions
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = options.recipient || process.env.ALERT_EMAIL || DEFAULT_RECIPIENT;

  if (!apiKey) return { success: false, error: 'RESEND_API_KEY not configured' };

  const resend = new Resend(apiKey);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Follow-up: LinkedIn Posts Sync</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #0b0f14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, monospace; color: #c9d1d9;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #121820; border: 1px solid #d29922; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.7);">
          
          <div style="background: linear-gradient(135deg, #2b220e 0%, #121820 100%); padding: 24px 28px; border-bottom: 1px solid #d29922;">
            <div style="display: inline-block; padding: 4px 10px; background-color: #d29922; color: #000; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase;">
              48h Follow-up Notice
            </div>
            <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 6px 0; font-family: monospace;">
              ⏳ Pending Action: LinkedIn Posts Resume Sync
            </h1>
          </div>

          <div style="padding: 28px;">
            <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #c9d1d9;">
              This is a friendly follow-up regarding your monthly LinkedIn posts sync. 
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #c9d1d9;">
              If you have new posts to add, you can paste them into your private upload portal. If not, click below to keep your current resume summary active.
            </p>

            <div style="margin: 24px 0; text-align: center;">
              <a href="${options.portalUrl}" style="display: inline-block; background-color: #00e5ff; color: #050b14; font-weight: 700; font-size: 14px; padding: 12px 26px; text-decoration: none; border-radius: 6px; margin-right: 12px;">
                🚀 Upload New Bulk Posts
              </a>
              <a href="${options.keepExistingUrl}" style="display: inline-block; background-color: transparent; border: 1px solid #58a6ff; color: #58a6ff; font-weight: 600; font-size: 13px; padding: 11px 22px; text-decoration: none; border-radius: 6px;">
                ⏩ Keep Old Summary
              </a>
            </div>

            <div style="background-color: #0d1117; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #8b949e;">
              ℹ️ <strong>Note:</strong> If no action is taken, the system will automatically maintain your current resume summary without interruption until next month.
            </div>
          </div>
        </div>
      </body>
    </html>
  `.trim();

  try {
    const res = await resend.emails.send({
      from: 'Portfolio Sync <onboarding@resend.dev>',
      to: [to],
      subject: `⏳ [Follow-up] LinkedIn Posts Resume Sync Pending (48h Notice)`,
      html,
    });

    if (res.error) return { success: false, error: res.error.message };
    console.log(`📧 Follow-up reminder email sent to ${to} (ID: ${res.data?.id})`);
    return { success: true, id: res.data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
