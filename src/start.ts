import { createCsrfMiddleware, createStart } from '@tanstack/react-start'
import { clerkMiddleware } from '@clerk/tanstack-react-start/server'

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === 'serverFn',
})

/**
 * Clerk's request middleware is only registered when keys are present, so a
 * fresh clone can still boot and prerender the marketing site.
 */
const clerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY ?? process.env.VITE_CLERK_PUBLISHABLE_KEY,
)

export const startInstance = createStart(() => ({
  requestMiddleware: clerkConfigured ? [csrfMiddleware, clerkMiddleware()] : [csrfMiddleware],
}))
