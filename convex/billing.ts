import { v } from 'convex/values'
import { internalMutation, internalQuery } from './_generated/server'
import { subscriptionStatus } from './schema'

/**
 * Billing state is written only from here, and only ever by the Stripe webhook
 * or the checkout action. Never let the client set plan/status directly.
 */

export const getUserBySubject = internalQuery({
  args: { subject: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      stripeCustomerId: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .unique()
    if (!user) return null
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      stripeCustomerId: user.stripeCustomerId,
    }
  },
})

export const setStripeCustomerId = internalMutation({
  args: { userId: v.id('users'), stripeCustomerId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { stripeCustomerId: args.stripeCustomerId })
    return null
  },
})

/**
 * Applied from the webhook. Looks the user up by Stripe customer id, so it
 * works for every subscription event without trusting client input.
 */
export const applySubscriptionState = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.string(),
    status: subscriptionStatus,
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_stripe_customer', (q) => q.eq('stripeCustomerId', args.stripeCustomerId))
      .unique()

    if (!user) {
      console.warn(`[billing] No user for Stripe customer ${args.stripeCustomerId}`)
      return null
    }

    await ctx.db.patch(user._id, {
      stripeSubscriptionId: args.stripeSubscriptionId,
      plan: args.plan,
      subscriptionStatus: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
    })
    return null
  },
})
