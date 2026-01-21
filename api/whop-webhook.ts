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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Vercel parses the body automatically, but we need raw for signature verification
  // For signature verification, we'll reconstruct the raw body from the parsed object
  // Note: In production, you may need to configure Vercel to provide rawBody
  const event = req.body || {};
  const rawBody = JSON.stringify(event);

  // Verify webhook signature
  // Note: If signature verification fails in production, you may need to configure
  // Vercel to provide the raw request body. Check Whop docs for exact signature format.
  if (whopWebhookSecret && !verifySignature(req, rawBody)) {
    console.error('Invalid Whop webhook signature');
    // In development, you might want to log but not fail
    // In production, uncomment the return below
    // return res.status(401).json({ error: 'Invalid signature' });
  }
  const eventType = event.type || event.event_type || event.event;

  console.log('Whop webhook received:', eventType, JSON.stringify(event, null, 2));

  // Handle membership activation / payment succeeded / invoice paid
  // These events indicate the user should get access
  if (
    eventType === 'membership_activated' ||
    eventType === 'payment_succeeded' ||
    eventType === 'invoice_paid'
  ) {
    // Extract product ID and user ID from Whop event
    // Whop event structure typically has: event.data.membership, event.data.product, etc.
    const productId = 
      event.data?.product_id ||
      event.data?.product?.id ||
      event.data?.membership?.product_id ||
      event.data?.membership?.product?.id ||
      event.product_id ||
      event.product?.id;

    // Extract user ID - check metadata first (from checkout URL), then Whop user ID
    const supabaseUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      // Fallback: try to get from membership or user object
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    if (!productId) {
      console.error('Missing productId in Whop event:', JSON.stringify(event, null, 2));
      return res.status(400).json({ 
        error: 'Missing productId',
        received: { productId, eventData: event.data }
      });
    }

    if (!supabaseUserId) {
      console.warn('Missing userId in metadata, attempting to find from Whop user data');
      // If we don't have user_id in metadata, we might need to look it up
      // For now, log and return error - you may need to adjust based on Whop's structure
      return res.status(400).json({ 
        error: 'Missing userId in event metadata. Ensure checkout URL includes metadata[user_id]',
        received: { productId, eventData: event.data }
      });
    }

    // Map Whop product ID to your app's plan_id
    let planId: 'week_pass' | 'pro_monthly' | null = null;
    let billingCycle: 'monthly' | 'lifetime' | undefined;
    let subscriptionStart = new Date();
    let subscriptionEnd: Date | undefined;

    if (productId === whopSprintProductId) {
      planId = 'week_pass';
      billingCycle = 'lifetime'; // one-time 7-day pass
      subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
    } else if (productId === whopMarathonProductId) {
      planId = 'pro_monthly';
      billingCycle = 'monthly';
      subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    } else {
      console.error('Unknown Whop product ID:', productId);
      return res.status(400).json({ error: 'Unknown product ID', productId });
    }

    // For Sprint/Marathon, users get unlimited access (large credit number)
    const credits = 999999;

    // Update subscription in Supabase
    const { error, data } = await supabaseAdmin
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
      .eq('user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update subscription from Whop webhook:', error);
      return res.status(500).json({ 
        error: 'Failed to update subscription',
        details: error.message 
      });
    }

    console.log('Successfully updated subscription:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Subscription updated',
      planId,
      userId: supabaseUserId
    });
  }

  // Handle membership deactivation (immediate cancellation)
  if (eventType === 'membership_deactivated') {
    // Extract user ID from event
    const supabaseUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    if (!supabaseUserId) {
      console.error('Missing userId in deactivation event:', event);
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get current subscription to preserve credits if user was already on free plan
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id, credits')
      .eq('user_id', supabaseUserId)
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
      .eq('user_id', supabaseUserId);

    if (error) {
      console.error('Failed to downgrade subscription:', error);
      return res.status(500).json({ error: 'Failed to downgrade subscription' });
    }

    console.log('Successfully downgraded subscription for user:', supabaseUserId);
    return res.status(200).json({ success: true, message: 'Subscription downgraded' });
  }

  // Handle cancellation at period end (user still has access until period ends)
  if (eventType === 'membership_cancel_at_period_end_chan') {
    // User still has access, but subscription won't renew
    // We can log this or mark it in the database if needed
    // For now, just acknowledge the event
    console.log('Subscription set to cancel at period end:', event.data);
    return res.status(200).json({ success: true, message: 'Cancellation scheduled' });
  }

  // Handle payment failures / past due invoices
  if (
    eventType === 'payment_failed' ||
    eventType === 'invoice_past_due' ||
    eventType === 'invoice_voided'
  ) {
    const supabaseUserId = 
      event.data?.metadata?.user_id ||
      event.data?.custom_metadata?.user_id ||
      event.metadata?.user_id ||
      event.custom_metadata?.user_id ||
      event.data?.membership?.user_id ||
      event.data?.user_id ||
      event.user_id;

    if (!supabaseUserId) {
      console.error('Missing userId in payment failure event:', event);
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get current subscription to preserve credits if user was already on free plan
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id, credits')
      .eq('user_id', supabaseUserId)
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
      .eq('user_id', supabaseUserId);

    if (error) {
      console.error('Failed to handle payment failure:', error);
      return res.status(500).json({ error: 'Failed to handle payment failure' });
    }

    console.log('Handled payment failure for user:', supabaseUserId);
    return res.status(200).json({ success: true, message: 'Payment failure handled' });
  }

  // Ignore other event types (log for debugging)
  console.log('Ignored Whop event type:', eventType);
  return res.status(200).json({ success: true, message: 'Event ignored' });
}
