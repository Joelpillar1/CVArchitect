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
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')

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
    if (!resend || !fromEmail) {
      console.error('Resend not configured. Missing RESEND_API_KEY or RESEND_FROM_EMAIL.')
      // Fail softly so we never break sign-up or other flows
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email service not configured',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const { type, email, name, subject: customSubject, html: customHtml } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Default templates
    let subject = 'Welcome to CVArchitect'
    let html = `<p>Welcome${name ? ` ${name}` : ''}, glad you joined CVArchitect!</p>`

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
        message: 'Email sent',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Resend Edge Function Error:', error)

    // Return 200 to avoid breaking client flows even if email fails
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

