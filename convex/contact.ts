import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery, mutation } from './_generated/server'
import { rateLimiter } from './rateLimits'
import { renderContactEmail } from './lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Public contact form. Rate limited per sender and globally before anything is
 * written, then hands delivery off to a scheduled action.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, args) => {
    const name = args.name.trim()
    const email = args.email.trim().toLowerCase()
    const message = args.message.trim()

    if (name.length < 2) throw new Error('Please enter your name')
    if (!EMAIL_RE.test(email)) throw new Error('Please enter a valid email address')
    if (message.length < 10) throw new Error('Message must be at least 10 characters')
    if (message.length > 5000) throw new Error('Message must be under 5000 characters')

    await rateLimiter.limit(ctx, 'contactGlobal', { throws: true })
    await rateLimiter.limit(ctx, 'contactPerEmail', { key: email, throws: true })

    const messageId = await ctx.db.insert('contactMessages', {
      name,
      email,
      message,
      delivered: false,
    })

    await ctx.scheduler.runAfter(0, internal.contact.deliver, { messageId })

    return { ok: true }
  },
})

export const get = internalQuery({
  args: { messageId: v.id('contactMessages') },
  returns: v.union(
    v.object({
      name: v.string(),
      email: v.string(),
      message: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.messageId)
    if (!doc) return null
    return { name: doc.name, email: doc.email, message: doc.message }
  },
})

export const markDelivered = internalMutation({
  args: {
    messageId: v.id('contactMessages'),
    delivered: v.boolean(),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      delivered: args.delivered,
      error: args.error,
    })
    return null
  },
})

/**
 * Sends the notification through Resend. With RESEND_API_KEY unset the row is
 * still stored and the send is skipped, so the form works in a fresh clone.
 */
export const deliver = internalAction({
  args: { messageId: v.id('contactMessages') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const message = await ctx.runQuery(internal.contact.get, { messageId: args.messageId })
    if (!message) return null

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      console.warn(
        '[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — email skipped.',
      )
      await ctx.runMutation(internal.contact.markDelivered, {
        messageId: args.messageId,
        delivered: false,
        error: 'Resend not configured',
      })
      return null
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: message.email,
        subject: `New contact form message from ${message.name}`,
        html: renderContactEmail(message),
      }),
    })

    if (!response.ok) {
      console.error('[contact] Resend rejected the message:', await response.text())
      await ctx.runMutation(internal.contact.markDelivered, {
        messageId: args.messageId,
        delivered: false,
        error: `Resend ${response.status}`,
      })
      return null
    }

    await ctx.runMutation(internal.contact.markDelivered, {
      messageId: args.messageId,
      delivered: true,
    })
    return null
  },
})
