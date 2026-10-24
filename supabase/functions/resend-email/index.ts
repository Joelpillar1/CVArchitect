// Supabase Edge Function: resend-email
// Sends transactional emails (welcome + follow-ups) via Resend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'CVArchitect <support@support.cvarchitect.app>'

const resend = resendApiKey ? new Resend(resendApiKey) : null

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
      status: 200,
    })
  }

  try {
    if (!resend) {
      console.error('Resend not configured. Missing RESEND_API_KEY.')
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email service not configured (RESEND_API_KEY missing)',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const body = await req.json()

    // Support both direct client invocations and Supabase Database Webhooks (INSERT on auth.users)
    let email = body.email
    let name = body.name || ''
    let type = body.type || 'welcome'
    let customSubject = body.subject
    let customHtml = body.html

    // If payload came from a Supabase Database Webhook on auth.users
    if (!email && body.record) {
      email = body.record.email
      name = body.record.raw_user_meta_data?.full_name ||
             body.record.raw_user_meta_data?.name ||
             body.record.user_metadata?.full_name ||
             ''
      type = 'welcome'
    }

    if (!email) {
      throw new Error('Email is required')
    }

    const firstName = (name || 'there').trim().split(' ')[0] || 'there'

    // Branded welcome email template matching CVArchitect design
    let subject = `Welcome to CVArchitect, ${firstName}! 🎉`
    let html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#333c4d;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">CVArchitect</span>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:#ffffff;padding:48px 40px 32px;text-align:center;">
            <div style="width:72px;height:72px;background:#70e098;border-radius:50%;margin:0 auto 24px;font-size:32px;line-height:72px;text-align:center;">🎉</div>
            <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#333c4d;line-height:1.2;">Welcome aboard, ${firstName}!</h1>
            <p style="margin:0;font-size:16px;color:#6b7280;line-height:1.6;">Your CVArchitect account is ready. Let's build a resume that gets you hired.</p>
          </td>
        </tr>

        <!-- Steps -->
        <tr>
          <td style="background:#ffffff;padding:0 40px 40px;">
            <p style="font-size:14px;font-weight:700;color:#333c4d;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Get started in 3 steps</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top"><div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">1</div></td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Choose a template</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Pick from our ATS-friendly designs: modern, classic or minimal.</p>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td width="40" valign="top"><div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">2</div></td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Paste a job description</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Our AI rewrites your resume to match keywords and beat the ATS.</p>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="40" valign="top"><div style="width:32px;height:32px;background:#70e098;border-radius:50%;text-align:center;line-height:32px;font-weight:800;font-size:14px;color:#333c4d;">3</div></td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-weight:700;color:#333c4d;font-size:15px;">Download your PDF</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Export a polished, recruiter-ready resume in one click.</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://cvarchitect.app/dashboard" style="display:inline-block;background:#70e098;color:#333c4d;font-weight:800;font-size:16px;text-decoration:none;padding:16px 40px;border-radius:50px;">
                    Build My Resume →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Credits Banner -->
        <tr>
          <td style="background:#f0fdf4;border:1px solid #bbf7d0;padding:20px 40px;">
            <p style="margin:0;font-weight:700;color:#15803d;font-size:15px;">🎁 Your free credits are ready</p>
            <p style="margin:6px 0 0;color:#166534;font-size:14px;line-height:1.5;">You have free AI credits waiting, enough to rewrite your resume and generate a cover letter. No credit card needed.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px 40px;">
            <p style="font-size:13px;color:#9ca3af;margin:0 0 8px;">Need help? Visit our <a href="https://cvarchitect.app/support" style="color:#70e098;text-decoration:none;font-weight:600;">Support Centre</a> or reply to this email.</p>
            <p style="font-size:13px;color:#9ca3af;margin:0;">© ${new Date().getFullYear()} CVArchitect &nbsp;·&nbsp; <a href="https://cvarchitect.app" style="color:#9ca3af;">cvarchitect.app</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    if (type === 'followup-1') {
      subject = 'How is your CV coming along?'
      html = `<p>Quick check-in${name ? `, ${name}` : ''} – here are a few tips to improve your CV.</p>`
    } else if (type === 'followup-2') {
      subject = 'Ready to take your CV to the next level?'
      html = `<p>${name ? `${name}, ` : ''}here are advanced strategies to help your CV stand out.</p>`
    }

    // Allow overriding subject/html from caller if desired
    if (customSubject) subject = customSubject
    if (customHtml) html = customHtml

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    } as any)

    if (error) {
      console.error('Resend error:', error)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to send email',
          error,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Welcome email sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Resend Edge Function Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: error?.message || 'An error occurred while sending email',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})
