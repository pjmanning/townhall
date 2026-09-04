import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start'
import { ConvexProvider } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import type { ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

import { PostHogAnalytics } from './posthog/provider'
import { ThemeProvider } from '#/lib/theme'
import { env, isClerkConfigured } from '#/lib/env'

// Side effect: initialises the browser Sentry client when a DSN is present.
import './sentry'

/**
 * Provider stack for the whole app.
 *
 * Clerk is optional at the wiring level on purpose: without a publishable key
 * the marketing site still renders (and prerenders) and only the product shell
 * shows a "finish setup" state.
 */
export function AppProviders({
  children,
  convexClient,
}: {
  children: ReactNode
  convexClient: ConvexReactClient
}) {
  const tree = (
    <ThemeProvider>
      <PostHogAnalytics>{children}</PostHogAnalytics>
    </ThemeProvider>
  )

  if (!isClerkConfigured) {
    return <ConvexProvider client={convexClient}>{tree}</ConvexProvider>
  }

  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey}>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        {tree}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
