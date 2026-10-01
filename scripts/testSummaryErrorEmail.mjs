import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { Resend } from 'resend';

console.log('🧪 Testing Summarization Error Email Notification...');

const apiKey = process.env.RESEND_API_KEY;
const recipient = process.env.ALERT_EMAIL || 'srijankulal1010@gmail.com';

if (!apiKey) {
  console.error('❌ RESEND_API_KEY is not defined in .env.local');
  process.exit(1);
}

const resend = new Resend(apiKey);

// Simulate an actual error context that occurs when Gemini API or JSON parsing fails
const simulatedError = {
  stage: 'profile_summary',
  targetFile: 'src/lib/geminiSummarizer.ts',
  errorMessage: 'Gemini API HTTP 503 Service Unavailable: High demand spikes detected on model gemini-3.1-flash-lite.',
  model: 'gemini-3.1-flash-lite',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=REDACTED',
  profileName: 'Srijan Kulal',
  errorStack: 'Error: Gemini API HTTP 503 Service Unavailable\n    at summarizeProfileWithGemini (src/lib/geminiSummarizer.ts:133:15)\n    at syncLinkedInToSanity (src/lib/linkedinSync.ts:378:32)\n    at handleSync (src/app/api/cron/sync-linkedin/route.ts:42:27)'
};

const readableTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio Summarizer Alert</title>
  </head>
  <body style="margin: 0; padding: 24px 12px; background-color: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, monospace; color: #c9d1d9;">
    <div style="max-width: 680px; margin: 0 auto; background-color: #161b22; border: 1px solid #da3633; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
      
      <!-- Banner Header -->
      <div style="background: linear-gradient(135deg, #3d1217 0%, #161b22 100%); padding: 22px 28px; border-bottom: 1px solid #da3633;">
        <div style="display: inline-block; padding: 4px 10px; background-color: #da3633; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
          Action Required: Code Check
        </div>
        <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 6px 0; font-family: monospace; font-weight: 700;">
          🚨 Gemini Summarization Pipeline Error
        </h1>
        <p style="color: #8b949e; font-size: 13px; margin: 0; font-family: monospace;">
          portfolio: srijan-k.me • stage: <span style="color: #f85149; font-weight: bold;">${simulatedError.stage}</span>
        </p>
      </div>

      <!-- Body Content -->
      <div style="padding: 26px 28px;">
        <p style="margin-top: 0; font-size: 14px; line-height: 1.6; color: #c9d1d9;">
          An error occurred while generating or saving the automated AI summary for <strong>${simulatedError.profileName}</strong>. Please inspect the code file indicated below to resolve the issue.
        </p>

        <!-- Primary Target File Box -->
        <div style="background-color: #21262d; border: 1px solid #30363d; border-left: 4px solid #da3633; border-radius: 6px; padding: 14px 18px; margin: 18px 0;">
          <div style="font-size: 11px; font-weight: 700; color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            📂 File to Check:
          </div>
          <div style="font-family: monospace; font-size: 15px; font-weight: bold; color: #58a6ff;">
            ${simulatedError.targetFile}
          </div>
        </div>

        <!-- Error Message Box -->
        <div style="background-color: #220f13; border: 1px solid #67171d; border-radius: 6px; padding: 16px; margin: 18px 0;">
          <div style="color: #ff7b72; font-weight: 700; font-size: 12px; text-transform: uppercase; font-family: monospace; margin-bottom: 8px;">
            ⚠️ Error Details
          </div>
          <div style="color: #ffffff; font-family: monospace; font-size: 13px; line-height: 1.5; word-break: break-word; background: #13080b; padding: 10px 12px; border-radius: 4px; border: 1px solid #491317;">
            ${simulatedError.errorMessage}
          </div>
        </div>

        <!-- Diagnostics Metadata Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; font-family: monospace;">
          <tr style="border-bottom: 1px solid #21262d;">
            <td style="padding: 8px 0; color: #8b949e; width: 150px;">Stage:</td>
            <td style="padding: 8px 0; color: #f85149; font-weight: bold;">${simulatedError.stage}</td>
          </tr>
          <tr style="border-bottom: 1px solid #21262d;">
            <td style="padding: 8px 0; color: #8b949e;">Target Script / File:</td>
            <td style="padding: 8px 0; color: #58a6ff;">${simulatedError.targetFile}</td>
          </tr>
          <tr style="border-bottom: 1px solid #21262d;">
            <td style="padding: 8px 0; color: #8b949e;">AI Model:</td>
            <td style="padding: 8px 0; color: #e6edf3;">${simulatedError.model}</td>
          </tr>
          <tr style="border-bottom: 1px solid #21262d;">
            <td style="padding: 8px 0; color: #8b949e;">Time (IST):</td>
            <td style="padding: 8px 0; color: #e6edf3;">${readableTime}</td>
          </tr>
        </table>

        <!-- Stack Trace -->
        <div style="margin-top: 18px;">
          <div style="color: #8b949e; font-size: 12px; font-family: monospace; margin-bottom: 6px;">
            Stack Trace:
          </div>
          <pre style="background-color: #0d1117; border: 1px solid #30363d; padding: 12px 14px; border-radius: 6px; font-size: 11px; color: #ff7b72; overflow-x: auto; white-space: pre-wrap; line-height: 1.5;">${simulatedError.errorStack}</pre>
        </div>

        <!-- Suggested Actions -->
        <div style="margin-top: 24px; padding: 18px; background-color: #0d1117; border: 1px solid #30363d; border-radius: 6px;">
          <div style="color: #7ee787; font-weight: 700; font-size: 13px; font-family: monospace; margin-bottom: 10px;">
            🛠️ Action Checklist to Resolve:
          </div>
          <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #c9d1d9; line-height: 1.7;">
            <li>Open <code style="color: #58a6ff; font-weight: bold;">${simulatedError.targetFile}</code> in your code editor.</li>
            <li>Verify your <code style="color: #7ee787;">GEMINI_API_KEY</code> and Google AI Studio quota limits in <code style="color: #58a6ff;">.env.local</code>.</li>
            <li>If the prompt response format changed, inspect the JSON extraction regex in <code style="color: #58a6ff;">${simulatedError.targetFile}</code>.</li>
            <li>To test summarization locally and reproduce the error, run:
              <div style="margin: 8px 0;">
                <code style="background: #161b22; border: 1px solid #30363d; padding: 4px 8px; color: #7ee787; border-radius: 4px; display: inline-block;">node scripts/generateSummaryNow.mjs</code>
              </div>
            </li>
            <li>If needed, you can manually inspect or edit the summary anytime directly in Sanity Studio at <a href="https://srijan-k.me/studio" style="color: #58a6ff; text-decoration: underline;">/studio</a>.</li>
          </ol>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #0d1117; padding: 14px 28px; text-align: center; border-top: 1px solid #21262d; font-size: 11px; color: #8b949e; font-family: monospace;">
        Automated Alert from Portfolio Background Engine • srijan-k.me
      </div>
    </div>
  </body>
</html>
`.trim();

async function runTest() {
  console.log(`📡 Dispatching simulated error alert email to ${recipient}...`);
  const response = await resend.emails.send({
    from: 'Portfolio Alerts <onboarding@resend.dev>',
    to: [recipient],
    subject: `🚨 [Portfolio Action Required] Check Summarization Code: ${simulatedError.errorMessage.slice(0, 50)}`,
    html,
  });

  if (response.error) {
    console.error('❌ Failed to dispatch error email:', response.error);
    process.exit(1);
  }

  console.log(`✅ SUCCESS! Error email delivered to ${recipient}`);
  console.log('📧 Message ID:', response.data?.id);
  console.log('📬 Check your inbox at', recipient, 'to see the full alert with code inspection details!');
}

runTest();
