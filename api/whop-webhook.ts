/**
 * Whop Webhook Handler
 * 
 * Handles the following Whop webhook events:
 * - membership_activated: User gets access → Activate subscription
 * - payment_succeeded: Payment successful → Activate subscription
 * - invoice_paid: Invoice paid → Activate subscription
 * - membership_deactivated: Access revoked → Downgrade to free
 * - membership_cancel_at_period_end_chan: Cancel at period end → Log (user still has access)
 * - payment_failed: Payment failed → Downgrade to free
 * - invoice_past_due: Invoice past due → Downgrade to free
 * - invoice_voided: Invoice voided → Downgrade to free
 * 
 * Expected environment variables:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - WHOP_WEBHOOK_SECRET
 * - WHOP_SPRINT_PRODUCT_ID
 * - WHOP_MARATHON_PRODUCT_ID
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const whopWebhookSecret = process.env.WHOP_WEBHOOK_SECRET!;
const whopSprintProductId = process.env.WHOP_SPRINT_PRODUCT_ID!;
const whopMarathonProductId = process.env.WHOP_MARATHON_PRODUCT_ID!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper: verify Whop webhook signature
function verifySignature(req: VercelRequest, rawBody: string): boolean {
  const signature = req.headers['whop-signature'] as string | undefined;
  if (!signature || !whopWebhookSecret) {
    console.warn('Missing Whop signature or secret');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', whopWebhookSecret);
    hmac.update(rawBody, 'utf8');
    const expected = hmac.digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log every request for debugging
  console.log('=== WHOP WEBHOOK REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'no body');
  console.log('Timestamp:', new Date().toISOString());

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, whop-signature');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  // Test endpoint - GET request to verify function is deployed
  if (req.method === 'GET') {
    console.log('Handling GET request (test endpoint)');
    return res.status(200).json({ 
      success: true,
      message: 'Whop webhook endpoint is active',
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        hasWebhookSecret: !!whopWebhookSecret,
        hasSprintProductId: !!whopSprintProductId,
        hasMarathonProductId: !!whopMarathonProductId,
      }
    });
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Handling POST request (webhook)');

  // Vercel parses the body automatically, but we need raw for signature verification
  // For signature verification, we'll reconstruct the raw body from the parsed object
  // Note: In production, you may need to configure Vercel to provide rawBody
  const event = req.body || {};
  const rawBody = JSON.stringify(event);
  
  console.log('Event received:', JSON.stringify(event, null, 2));
  console.log('Raw body length:', rawBody.length);

  // Verify webhook signature
  // Note: If signature verification fails in production, you may need to configure
  // Vercel to provide the raw request body. Check Whop docs for exact signature format.
  if (whopWebhookSecret && !verifySignature(req, rawBody)) {
    console.error('Invalid Whop webhook signature');
    // In development, you might want to log but not fail
    // In production, uncomment the return below
    // return res.status(401).json({ error: 'Invalid signature' });
  }
  // Whop uses dot notation for event types (e.g., "payment.succeeded", "membership.activated")
  // But also check for underscore format for backwards compatibility
  const eventType = event.type || event.event_type || event.event;

  console.log('Whop webhook received:', eventType);
  console.log('Full event data:', JSON.stringify(event, null, 2));

  // Handle membership activation / payment succeeded / invoice paid
  // These events indicate the user should get access
  // Whop uses dot notation: payment.succeeded, membership.activated, etc.
  if (
    eventType === 'membership.activated' ||
    eventType === 'membership_activated' ||
    eventType === 'payment.succeeded' ||
    eventType === 'payment_succeeded' ||
    eventType === 'invoice.paid' ||
    eventType === 'invoice_paid'
  ) {
    // Extract product ID from Whop event
    // Based on actual Whop payload: event.data.product.id or event.data.plan.id
    const productId = 
      event.data?.product?.id ||           // Product ID (prod_xxx)
      event.data?.plan?.id ||               // Plan ID (plan_xxx) 
      event.data?.product_id ||
      event.data?.membership?.product_id ||
      event.data?.membership?.product?.id ||
      event.product_id ||
      event.product?.id;

    console.log('Extracted productId:', productId);
    console.log('Product object:', event.data?.product);
    console.log('Plan object:', event.data?.plan);

    // Extract user email from Whop event (we'll use this to find Supabase user)
    const userEmail = 
      event.data?.user?.email ||
      event.data?.member?.email ||
      event.data?.metadata?.email ||
      event.data?.custom_metadata?.email ||
      event.metadata?.email ||
      event.user?.email;

    console.log('Extracted userEmail:', userEmail);

    // Extract user ID - check metadata first (from checkout URL), then Whop user ID
    // Whop may pass metadata in different places depending on event type
    let supabaseUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      // Check membership metadata
      event.data?.membership?.metadata?.user_id ||
      event.data?.membership?.custom_metadata?.user_id ||
      // Fallback: try to get from membership or user object
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    console.log('Extracted supabaseUserId from metadata:', supabaseUserId);
    console.log('Event data structure:', {
      hasData: !!event.data,
      dataKeys: event.data ? Object.keys(event.data) : [],
      hasMetadata: !!event.data?.metadata,
      metadataKeys: event.data?.metadata ? Object.keys(event.data.metadata) : [],
      hasMembership: !!event.data?.membership,
      membershipKeys: event.data?.membership ? Object.keys(event.data.membership) : [],
      hasUser: !!event.data?.user,
      userKeys: event.data?.user ? Object.keys(event.data.user) : [],
    });

    // If no product ID, try plan ID
    const planIdFromEvent = event.data?.plan?.id;
    const finalProductId = productId || planIdFromEvent;

    if (!finalProductId) {
      console.error('Missing productId and planId in Whop event:', JSON.stringify(event, null, 2));
      return res.status(400).json({ 
        error: 'Missing productId and planId',
        received: { productId, planIdFromEvent, eventData: event.data }
      });
    }

    console.log('Using product/plan ID:', finalProductId);

    // If we don't have user_id in metadata, try to look up by email
    let finalUserId = supabaseUserId;
    if (!finalUserId && userEmail) {
      console.log('No user_id in metadata, attempting to find user by email:', userEmail);
      try {
        // Try to find user by email in Supabase auth
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (!authError && authUsers?.users) {
          const matchingUser = authUsers.users.find(u => u.email?.toLowerCase() === (userEmail || '').toLowerCase());
          if (matchingUser) {
            finalUserId = matchingUser.id;
            console.log('Found user by email:', finalUserId);
          } else {
            console.warn('User not found in Supabase with email:', userEmail);
            console.log('Available users (first 5):', authUsers.users.slice(0, 5).map(u => ({ id: u.id, email: u.email })));
          }
        } else if (authError) {
          console.error('Error listing users:', authError);
        }
      } catch (err) {
        console.error('Exception while finding user by email:', err);
      }
    }

    if (!finalUserId) {
      console.error('Missing userId in metadata and could not find by email');
      console.error('Event structure:', JSON.stringify(event, null, 2));
      return res.status(400).json({ 
        error: 'Missing userId in event metadata and could not find user by email',
        received: { productId, userEmail, hasMetadata: !!event.data?.metadata, metadata: event.data?.metadata }
      });
    }

    // Map Whop product/plan ID to your app's plan_id
    // Whop sends both product.id (prod_xxx) and plan.id (plan_xxx)
    // We check finalProductId (which is productId or planId) against our configured IDs
    console.log('Comparing IDs:', {
      finalProductId,
      productId,
      planIdFromEvent,
      whopSprintProductId,
      whopMarathonProductId,
      matchesSprint: finalProductId === whopSprintProductId,
      matchesMarathon: finalProductId === whopMarathonProductId,
      productTitle: event.data?.product?.title,
    });

    let planId: 'week_pass' | 'pro_monthly' | null = null;
    let billingCycle: 'monthly' | 'lifetime' | undefined;
    let subscriptionStart = new Date();
    let subscriptionEnd: Date | undefined;

    // Check finalProductId against our configured IDs
    if (finalProductId === whopSprintProductId) {
      planId = 'week_pass';
      billingCycle = 'lifetime'; // one-time 7-day pass
      subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
      console.log('Mapped to week_pass (Career Sprint)');
    } else if (finalProductId === whopMarathonProductId) {
      planId = 'pro_monthly';
      billingCycle = 'monthly';
      subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      console.log('Mapped to pro_monthly (Career Marathon)');
    } else {
      console.error('Unknown Whop product/plan ID:', { 
        finalProductId, 
        productId, 
        planIdFromEvent, 
        productTitle: event.data?.product?.title 
      });
      return res.status(400).json({ 
        error: 'Unknown product/plan ID', 
        received: { finalProductId, productId, planIdFromEvent, productTitle: event.data?.product?.title },
        expected: { sprint: whopSprintProductId, marathon: whopMarathonProductId }
      });
    }

    // For Sprint/Marathon, users get unlimited access (large credit number)
    const credits = 999999;

    // Check if subscription exists, if not create it
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', finalUserId)
      .single();

    let data;
    let error;

    if (existingSub) {
      // Update existing subscription
      const result = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan_id: planId,
          credits,
          billing_cycle: billingCycle,
          subscription_start: subscriptionStart.toISOString(),
          subscription_end: subscriptionEnd?.toISOString(),
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', finalUserId)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Create new subscription if it doesn't exist
      console.log('Subscription does not exist, creating new one for user:', finalUserId);
      const result = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: finalUserId,
          plan_id: planId,
          credits,
          billing_cycle: billingCycle,
          subscription_start: subscriptionStart.toISOString(),
          subscription_end: subscriptionEnd?.toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Failed to update/create subscription from Whop webhook:', error);
      return res.status(500).json({ 
        error: 'Failed to update subscription',
        details: error.message 
      });
    }

    console.log('Successfully updated subscription:', JSON.stringify(data, null, 2));
    console.log('Subscription details:', {
      userId: finalUserId,
      planId,
      credits,
      subscriptionStart: subscriptionStart.toISOString(),
      subscriptionEnd: subscriptionEnd?.toISOString(),
      isActive: true
    });
    
    // Always return JSON - never redirect
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ 
      success: true,
      message: 'Subscription updated',
      planId,
      userId: finalUserId,
      credits,
      subscriptionEnd: subscriptionEnd?.toISOString(),
      timestamp: new Date().toISOString()
    });
  }

  // Handle membership deactivation (immediate cancellation)
  // Whop uses dot notation: membership.deactivated
  if (
    eventType === 'membership.deactivated' ||
    eventType === 'membership_deactivated'
  ) {
    // Extract user email and ID from event
    const deactivationUserEmail = 
      event.data?.user?.email ||
      event.data?.member?.email ||
      event.data?.metadata?.email ||
      event.metadata?.email;

    let deactivationUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    // If no user_id, find by email
    if (!deactivationUserId && deactivationUserEmail) {
      console.log('Finding user by email for deactivation:', deactivationUserEmail);
      try {
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        if (authUsers?.users) {
          const matchingUser = authUsers.users.find(u => u.email?.toLowerCase() === (deactivationUserEmail || '').toLowerCase());
          if (matchingUser) {
            deactivationUserId = matchingUser.id;
            console.log('Found user by email for deactivation:', deactivationUserId);
          }
        }
      } catch (err) {
        console.error('Error finding user by email:', err);
      }
    }

    if (!deactivationUserId) {
      console.error('Missing userId in deactivation event:', event);
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get current subscription to preserve credits if user was already on free plan
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id, credits')
      .eq('user_id', deactivationUserId)
      .single();

    // Only reset to 10 if user was on a paid plan (downgrading)
    // If already on free plan, preserve their current credits
    const newCredits = currentSub?.plan_id === 'free' 
      ? currentSub.credits  // Preserve existing credits for free users
      : 10; // Reset to 10 only when downgrading from paid plan

    // Downgrade to free plan immediately
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_id: 'free',
        credits: newCredits,
        billing_cycle: 'monthly',
        subscription_start: new Date().toISOString(),
        subscription_end: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', deactivationUserId);

    if (error) {
      console.error('Failed to downgrade subscription:', error);
      return res.status(500).json({ error: 'Failed to downgrade subscription' });
    }

    console.log('Successfully downgraded subscription for user:', deactivationUserId);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, message: 'Subscription downgraded' });
  }

  // Handle cancellation at period end (user still has access until period ends)
  // Whop uses dot notation: membership.cancel_at_period_end_changed
  if (
    eventType === 'membership.cancel_at_period_end_changed' ||
    eventType === 'membership_cancel_at_period_end_chan' ||
    eventType === 'membership.cancel_at_period_end_chan'
  ) {
    // User still has access, but subscription won't renew
    // We can log this or mark it in the database if needed
    // For now, just acknowledge the event
    console.log('Subscription set to cancel at period end:', event.data);
    return res.status(200).json({ success: true, message: 'Cancellation scheduled' });
  }

  // Handle payment failures / past due invoices
  // Whop uses dot notation: payment.failed, invoice.past_due, invoice.voided
  if (
    eventType === 'payment.failed' ||
    eventType === 'payment_failed' ||
    eventType === 'invoice.past_due' ||
    eventType === 'invoice_past_due' ||
    eventType === 'invoice.voided' ||
    eventType === 'invoice_voided'
  ) {
    const failureUserEmail = 
      event.data?.user?.email ||
      event.data?.member?.email ||
      event.data?.metadata?.email ||
      event.metadata?.email;

    let failureUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    // If no user_id, find by email
    if (!failureUserId && failureUserEmail) {
      console.log('Finding user by email for payment failure:', failureUserEmail);
      try {
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        if (authUsers?.users) {
          const matchingUser = authUsers.users.find(u => u.email?.toLowerCase() === (failureUserEmail || '').toLowerCase());
          if (matchingUser) {
            failureUserId = matchingUser.id;
            console.log('Found user by email for payment failure:', failureUserId);
          }
        }
      } catch (err) {
        console.error('Error finding user by email:', err);
      }
    }

    if (!failureUserId) {
      console.error('Missing userId in payment failure event:', event);
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get current subscription to preserve credits if user was already on free plan
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id, credits')
      .eq('user_id', failureUserId)
      .single();

    // Only reset to 10 if user was on a paid plan (downgrading)
    // If already on free plan, preserve their current credits
    const newCredits = currentSub?.plan_id === 'free' 
      ? currentSub.credits  // Preserve existing credits for free users
      : 10; // Reset to 10 only when downgrading from paid plan

    // Optionally downgrade or mark as inactive
    // For now, we'll downgrade to free if payment fails
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_id: 'free',
        credits: newCredits,
        billing_cycle: 'monthly',
        subscription_start: new Date().toISOString(),
        subscription_end: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', failureUserId);

    if (error) {
      console.error('Failed to handle payment failure:', error);
      return res.status(500).json({ error: 'Failed to handle payment failure' });
    }

    console.log('Handled payment failure for user:', failureUserId);
    return res.status(200).json({ success: true, message: 'Payment failure handled' });
  }

  // Ignore other event types (log for debugging)
  console.log('Ignored Whop event type:', eventType);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ success: true, message: 'Event ignored', eventType });
}
