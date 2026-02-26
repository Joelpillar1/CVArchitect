/**
 * Welcome Email API Route
 *
 * Called after a new user signs up to send a branded welcome email.
 * Can be called from:
 *  - The SignUp component after successful signup
 *  - A Supabase Auth webhook (user.created)
 *
 * Environment variables required:
 * - RESEND_API_KEY
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Architect <support@support.cvarchitect.app>';

async function sendEmail(payload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
}) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Resend error: ${res.status} — ${error}`);
    }
    return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { name, email } = req.body || {};

    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const firstName = (name || 'there').split(' ')[0];

    try {
        await sendEmail({
            from: FROM_EMAIL,
            to: [email],
            subject: `Welcome to CV Architect, ${firstName}! 🎉`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#333c4d;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <div style="display:inline-flex;align-items:center;gap:10px;">
                    <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">CV Architect</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:#ffffff;padding:48px 40px 32px;text-align:center;">
            <div style="width:72px;height:72px;background:#70e098;border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:32px;line-height:72px;">🎉</div>
            <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#333c4d;line-height:1.2;">Welcome aboard, ${firstName}!</h1>
            <p style="margin:0;font-size:16px;color:#6b7280;line-height:1.6;">Your CV Architect account is ready. Let's build a resume that gets you hired.</p>
          </td>
        </tr>

        <!-- Steps -->
        <tr>
          <td style="background:#ffffff;padding:0 40px 40px;">
            <p style="font-size:14px;font-weight:700;color:#333c4d;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Get started in 3 steps</p>

            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top">
                  <div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">1</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Choose a template</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Pick from our ATS-friendly designs — modern, classic or minimal.</p>
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top">
                  <div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">2</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Paste a job description</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Our AI rewrites your resume to match keywords and beat the ATS.</p>
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="40" valign="top">
                  <div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">3</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Download your PDF</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Export a polished, recruiter-ready resume in one click.</p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://cvarchitect.app/dashboard"
                     style="display:inline-block;background:#70e098;color:#333c4d;font-weight:800;font-size:16px;text-decoration:none;padding:16px 40px;border-radius:50px;letter-spacing:-0.2px;">
                    Build My Resume →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Free Credits Banner -->
        <tr>
          <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 40px;margin:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-weight:700;color:#15803d;font-size:15px;">🎁 Your free credits are ready</p>
                  <p style="margin:6px 0 0;color:#166534;font-size:14px;line-height:1.5;">You have free AI credits waiting in your account — enough to rewrite your resume and generate a cover letter. No credit card needed.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="background:#ffffff;padding:0 40px;"><div style="height:1px;background:#eaeaea;margin:28px 0;"></div></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 40px 40px;">
            <p style="font-size:13px;color:#9ca3af;margin:0 0 8px;">Need help? Visit our <a href="https://cvarchitect.app/support" style="color:#70e098;text-decoration:none;font-weight:600;">Support Centre</a> or reply to this email.</p>
            <p style="font-size:13px;color:#9ca3af;margin:0;">© ${new Date().getFullYear()} CV Architect &nbsp;·&nbsp; <a href="https://cvarchitect.app" style="color:#9ca3af;">cvarchitect.app</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
            `,
        });

        console.log(`Welcome email sent to ${email}`);
        return res.status(200).json({ success: true });
    } catch (err: any) {
        console.error('Failed to send welcome email:', err?.message || err);
        return res.status(500).json({ error: err?.message || 'Failed to send welcome email' });
    }
}
