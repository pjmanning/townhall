import type { Doc } from '../_generated/dataModel'
import type { MutationCtx, QueryCtx } from '../_generated/server'

/**
 * Returns the signed-in user's row, or null when the caller is anonymous or has
 * not been synced yet. Prefer this over reading `ctx.auth` directly.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<Doc<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  return await ctx.db
    .query('users')
    .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
    .unique()
}

/** Same as {@link getCurrentUser} but throws — use it in anything that mutates user data. */
export async function requireCurrentUser(ctx: QueryCtx | MutationCtx): Promise<Doc<'users'>> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Not authenticated')

  const user = await ctx.db
    .query('users')
    .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
    .unique()

  if (!user) throw new Error('User not synced yet. Call users.sync first.')
  return user
}
