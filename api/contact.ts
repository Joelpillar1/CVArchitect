/**
 * Contact Form API Route
 * 
 * Receives form submissions from /contact and sends emails via Resend.
 * - Sends a notification email to support@cvarchitect.app
 * - Sends a confirmation email to the user
 * 
 * Environment variables required:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL (optional, defaults to support@cvarchitect.app)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'CV Architect <support@cvarchitect.app>';
const SUPPORT_EMAIL = 'support@cvarchitect.app';

interface ResendPayload {
    from: string;
    to: string[];
    reply_to?: string;
    subject: string;
    html: string;
}

async function sendEmail(payload: ResendPayload) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Resend API error: ${res.status} — ${error}`);
    }

    return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://cvarchitect.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { name, email, subject, message } = req.body || {};

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    const subjectLabels: Record<string, string> = {
        general: 'General Inquiry',
        support: 'Technical Support',
        billing: 'Billing Question',
        feature: 'Feature Request',
        bug: 'Bug Report',
        other: 'Other',
    };
    const subjectLabel = subjectLabels[subject] || subject;

    try {
        // 1️⃣ Notify the support inbox
        await sendEmail({
            from: FROM_EMAIL,
            to: [SUPPORT_EMAIL],
            reply_to: email,
            subject: `[${subjectLabel}] New message from ${name}`,
            html: `
                <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333c4d;">
                    <div style="background: #70e098; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0; font-size: 22px; color: #333c4d;">New Support Request</h1>
                    </div>
                    <div style="background: #ffffff; padding: 32px; border: 1px solid #eaeaea; border-top: none; border-radius: 0 0 12px 12px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 100px;">From</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Email</td>
                                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #70e098;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Category</td>
                                <td style="padding: 8px 0; font-size: 14px;">${subjectLabel}</td>
                            </tr>
                        </table>
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                        <h2 style="font-size: 15px; color: #333c4d; margin: 0 0 12px;">Message</h2>
                        <p style="font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #9ca3af; margin: 0;">Reply directly to this email to respond to ${name}.</p>
                    </div>
                </div>
            `,
        });

        // 2️⃣ Send confirmation to the user
        await sendEmail({
            from: FROM_EMAIL,
            to: [email],
            subject: `We received your message, ${name.split(' ')[0]} 👋`,
            html: `
                <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333c4d;">
                    <div style="background: #333c4d; padding: 24px 32px; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 12px;">
                        <h1 style="margin: 0; font-size: 22px; color: #ffffff;">CV Architect Support</h1>
                    </div>
                    <div style="background: #ffffff; padding: 32px; border: 1px solid #eaeaea; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi ${name.split(' ')[0]},</p>
                        <p style="font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 0 16px;">
                            Thanks for reaching out! We've received your message and our team will get back to you within <strong>24 hours</strong>.
                        </p>
                        <div style="background: #f8f8f8; border-left: 4px solid #70e098; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                            <p style="font-size: 13px; color: #6b7280; margin: 0 0 6px;">Your message (${subjectLabel})</p>
                            <p style="font-size: 14px; color: #333c4d; margin: 0; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        </div>
                        <p style="font-size: 15px; line-height: 1.7; color: #4b5563; margin: 16px 0 0;">
                            While you wait, you might find an answer in our <a href="https://cvarchitect.app/support" style="color: #70e098; font-weight: 600;">Support Centre</a>.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 28px 0;" />
                        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
                            CV Architect &nbsp;·&nbsp; <a href="https://cvarchitect.app" style="color: #9ca3af;">cvarchitect.app</a>
                        </p>
                    </div>
                </div>
            `,
        });

        console.log(`Contact form submitted by ${name} <${email}> — ${subjectLabel}`);
        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Failed to send contact email:', err);
        return res.status(500).json({ error: 'Failed to send message. Please try again or email us directly at support@cvarchitect.app' });
    }
}
