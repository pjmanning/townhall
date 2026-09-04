import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const subscriptionStatus = v.union(
  v.literal('none'),
  v.literal('trialing'),
  v.literal('active'),
  v.literal('past_due'),
  v.literal('canceled'),
  v.literal('incomplete'),
)

export default defineSchema({
  /**
   * Mirror of the Clerk identity, created on the first authenticated load.
   * `subject` is Clerk's user id and is the only trusted join key.
   */
  users: defineTable({
    subject: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastSeenAt: v.number(),

    // Billing state, owned exclusively by the Stripe webhook.
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.optional(v.string()),
    subscriptionStatus: v.optional(subscriptionStatus),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  })
    .index('by_subject', ['subject'])
    .index('by_stripe_customer', ['stripeCustomerId']),

  /** Public contact form submissions. Rate limited before insert. */
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    delivered: v.boolean(),
    error: v.optional(v.string()),
  }).index('by_creation_and_email', ['email']),
})
