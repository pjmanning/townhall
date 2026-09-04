import { HOUR, MINUTE, RateLimiter } from '@convex-dev/rate-limiter'
import { components } from './_generated/api'

/**
 * Shared limiter. Add new named limits here rather than hand-rolling counters.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Per-sender: one message every ~2 minutes, small burst allowed.
  contactPerEmail: { kind: 'token bucket', rate: 3, period: 30 * MINUTE, capacity: 2 },
  // Global backstop so a botnet cannot drain the Resend quota.
  contactGlobal: { kind: 'fixed window', rate: 60, period: HOUR },
  // Guards Stripe session creation against accidental double-clicks / abuse.
  checkoutPerUser: { kind: 'token bucket', rate: 5, period: 10 * MINUTE, capacity: 3 },
})
