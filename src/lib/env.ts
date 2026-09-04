/**
 * Client-visible environment, resolved once.
 *
 * Rule for this template: a missing key must degrade, never crash. Convex and
 * Clerk are the only "required to be useful" keys, and even those fall back to
 * a disabled state so `pnpm build` works on a fresh clone.
 */

/**
 * `.env.local` declares optional keys with no value, so an unset key arrives as
 * `''`, not `undefined`. Everything reads through here so `??` fallbacks and
 * `Boolean()` checks behave the way they look like they do.
 */
export const read = (value: unknown) => {
  const str = typeof value === 'string' ? value.trim() : ''
  return str.length > 0 ? str : undefined
}

export const env = {
  convexUrl: read(import.meta.env.VITE_CONVEX_URL),
  clerkPublishableKey: read(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
  posthogKey: read(import.meta.env.VITE_POSTHOG_KEY),
  posthogHost: read(import.meta.env.VITE_POSTHOG_HOST) ?? 'https://us.i.posthog.com',
  sentryDsn: read(import.meta.env.VITE_SENTRY_DSN),
  siteUrl: read(import.meta.env.VITE_SITE_URL),
}

export const isConvexConfigured = Boolean(env.convexUrl)
export const isClerkConfigured = Boolean(env.clerkPublishableKey)
export const isPostHogConfigured = Boolean(env.posthogKey)
export const isSentryConfigured = Boolean(env.sentryDsn)

/** Everything that must be set before the product (as opposed to marketing) works. */
export const missingRequiredKeys = [
  isConvexConfigured ? null : 'VITE_CONVEX_URL',
  isClerkConfigured ? null : 'VITE_CLERK_PUBLISHABLE_KEY',
].filter((key): key is string => key !== null)
