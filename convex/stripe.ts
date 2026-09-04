'use node'

import Stripe from 'stripe'
import { v } from 'convex/values'
import { action, internalAction } from './_generated/server'
import { internal } from './_generated/api'
import type { ActionCtx } from './_generated/server'
import { rateLimiter } from './rateLimits'

/**
 * Stripe lives entirely in Convex actions so Cloudflare stays a host, not a
 * second backend. Every function degrades to a clear error when STRIPE_SECRET_KEY
 * is unset, which keeps a fresh clone runnable without billing configured.
 */

const STRIPE_NOT_CONFIGURED = 'Billing is not configured. Set STRIPE_SECRET_KEY in Convex.'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key, { apiVersion: '2026-07-29.dahlia' })
}

const siteUrl = () => process.env.SITE_URL ?? 'http://localhost:3000'

/** Maps a Stripe price id back to a plan slug the app understands. */
function planForPrice(priceId: string | undefined): string {
  if (!priceId) return 'free'
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_SCALE_MONTHLY) return 'scale'
  if (priceId === process.env.STRIPE_PRICE_SCALE_YEARLY) return 'scale'
  return 'pro'
}

type PaidPlan = 'pro' | 'scale'
type Interval = 'month' | 'year'

function resolvePriceId(plan: PaidPlan, interval: Interval): string | undefined {
  const table: Record<PaidPlan, Record<Interval, string | undefined>> = {
    pro: {
      month: process.env.STRIPE_PRICE_PRO_MONTHLY,
      year: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
    scale: {
      month: process.env.STRIPE_PRICE_SCALE_MONTHLY,
      year: process.env.STRIPE_PRICE_SCALE_YEARLY,
    },
  }
  return table[plan][interval]
}

/** Returns false when Stripe keys are missing so the UI can show a stub state. */
export const isConfigured = action({
  args: {},
  returns: v.boolean(),
  handler: async () => Boolean(process.env.STRIPE_SECRET_KEY),
})

export const createCheckoutSession = action({
  args: {
    plan: v.union(v.literal('pro'), v.literal('scale')),
    interval: v.union(v.literal('month'), v.literal('year')),
  },
  returns: v.object({ url: v.string() }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const stripe = getStripe()
    if (!stripe) throw new Error(STRIPE_NOT_CONFIGURED)

    await rateLimiter.limit(ctx, 'checkoutPerUser', { key: identity.subject, throws: true })

    const priceId = resolvePriceId(args.plan, args.interval)
    if (!priceId) throw new Error(`No Stripe price configured for ${args.plan}/${args.interval}`)

    const user = await ctx.runQuery(internal.billing.getUserBySubject, {
      subject: identity.subject,
    })
    if (!user) throw new Error('User not synced yet')

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { convexUserId: user._id, clerkSubject: identity.subject },
      })
      customerId = customer.id
      await ctx.runMutation(internal.billing.setStripeCustomerId, {
        userId: user._id,
        stripeCustomerId: customerId,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${siteUrl()}/app/settings?checkout=success`,
      cancel_url: `${siteUrl()}/pricing?checkout=cancelled`,
      subscription_data: {
        metadata: { convexUserId: user._id, clerkSubject: identity.subject },
      },
    })

    if (!session.url) throw new Error('Stripe did not return a checkout URL')
    return { url: session.url }
  },
})

export const createPortalSession = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const stripe = getStripe()
    if (!stripe) throw new Error(STRIPE_NOT_CONFIGURED)

    const user = await ctx.runQuery(internal.billing.getUserBySubject, {
      subject: identity.subject,
    })
    if (!user?.stripeCustomerId) {
      throw new Error('No billing account yet. Start a subscription first.')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${siteUrl()}/app/settings`,
    })

    return { url: session.url }
  },
})

/**
 * Verifies the signature and folds the event into `users`. Called from
 * `convex/http.ts`, which keeps the HTTP route itself dependency-free.
 */
export const handleWebhook = internalAction({
  args: { payload: v.string(), signature: v.string() },
  returns: v.object({ handled: v.boolean() }),
  handler: async (ctx, args) => {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!stripe || !webhookSecret) throw new Error(STRIPE_NOT_CONFIGURED)

    const event = await stripe.webhooks.constructEventAsync(
      args.payload,
      args.signature,
      webhookSecret,
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.mode !== 'subscription' || !session.subscription) break
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription))
        await applySubscription(ctx, subscription)
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await applySubscription(ctx, event.data.object)
        break
      }
      default:
        return { handled: false }
    }

    return { handled: true }
  },
})

async function applySubscription(ctx: ActionCtx, subscription: Stripe.Subscription) {
  // `.at()` rather than `[0]` so the empty-subscription case stays typed.
  const item = subscription.items.data.at(0)
  const status = normalizeStatus(subscription.status)

  await ctx.runMutation(internal.billing.applySubscriptionState, {
    stripeCustomerId: String(subscription.customer),
    stripeSubscriptionId: subscription.id,
    plan: status === 'active' || status === 'trialing' ? planForPrice(item?.price.id) : 'free',
    status,
    currentPeriodEnd: item?.current_period_end ? item.current_period_end * 1000 : undefined,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
}

/** Collapses Stripe's status set onto the values stored in `users`. */
type AppSubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'

// Stripe types the status as a union widened with an arbitrary string, so map
// through an explicit table rather than relying on switch narrowing.
const statusMap: Partial<Record<string, AppSubscriptionStatus>> = {
  active: 'active',
  trialing: 'trialing',
  past_due: 'past_due',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'canceled',
  unpaid: 'canceled',
  paused: 'canceled',
}

function normalizeStatus(status: Stripe.Subscription.Status): AppSubscriptionStatus {
  return statusMap[status] ?? 'none'
}
