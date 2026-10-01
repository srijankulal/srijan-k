import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const recipient = process.env.ALERT_EMAIL || 'srijankulal1010@gmail.com';

async function testEmail() {
  console.log(`📧 Testing Resend alert email to ${recipient}...`);
  try {
    const res = await resend.emails.send({
      from: 'Portfolio Alerts <onboarding@resend.dev>',
      to: [recipient],
      subject: '🧪 [Test Alert] Portfolio Notification System Check',
      html: `
        <div style="font-family: monospace; background: #0d1117; color: #71fc7b; padding: 24px; border-radius: 8px;">
          <h2 style="color: #71fc7b; margin-top: 0;">⚡ Portfolio Alert System Online</h2>
          <p style="color: #c9d1d9;">This is a test confirmation that error alert emails are active for <strong>srijan-k.me</strong>.</p>
          <hr style="border: 1px solid #30363d;" />
          <p style="color: #8b949e; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    console.log('Result:', res);
  } catch (e) {
    console.error('Email error:', e);
  }
}

testEmail();
