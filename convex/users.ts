import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { subscriptionStatus } from './schema'
import { getCurrentUser, requireCurrentUser } from './lib/auth'
import type { Doc } from './_generated/dataModel'

/** Shape returned to the client. Never expose raw Stripe ids. */
const publicUser = v.object({
  _id: v.id('users'),
  subject: v.string(),
  email: v.optional(v.string()),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  plan: v.string(),
  subscriptionStatus: subscriptionStatus,
  currentPeriodEnd: v.optional(v.number()),
  cancelAtPeriodEnd: v.boolean(),
  hasBillingAccount: v.boolean(),
})

function toPublicUser(user: Doc<'users'>) {
  return {
    _id: user._id,
    subject: user.subject,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    plan: user.plan ?? 'free',
    subscriptionStatus: user.subscriptionStatus ?? ('none' as const),
    currentPeriodEnd: user.currentPeriodEnd,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
    hasBillingAccount: Boolean(user.stripeCustomerId),
  }
}

/**
 * Idempotently mirror the Clerk identity into `users`. Called once on the first
 * authenticated render of the app shell; safe to call on every load.
 */
export const sync = mutation({
  args: {},
  returns: v.union(publicUser, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const profile = {
      email: identity.email,
      name: identity.name ?? identity.nickname,
      imageUrl: identity.pictureUrl,
      lastSeenAt: Date.now(),
    }

    const existing = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, profile)
      return toPublicUser({ ...existing, ...profile })
    }

    const userId = await ctx.db.insert('users', {
      subject: identity.subject,
      ...profile,
      plan: 'free',
      subscriptionStatus: 'none',
      cancelAtPeriodEnd: false,
    })

    const created = await ctx.db.get(userId)
    if (!created) throw new Error('Failed to create user')
    return toPublicUser(created)
  },
})

export const current = query({
  args: {},
  returns: v.union(publicUser, v.null()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    return user ? toPublicUser(user) : null
  },
})

/**
 * Stub: wipes the app-side record. A real implementation also deletes the Clerk
 * user (Clerk Backend API) and cancels any live Stripe subscription — do both
 * from a `"use node"` action before calling this.
 */
export const deleteAccount = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx)
    await ctx.db.delete(user._id)
    return null
  },
})
