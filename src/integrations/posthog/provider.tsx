import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { env, isPostHogConfigured } from '#/lib/env'

if (typeof window !== 'undefined' && isPostHogConfigured) {
  posthog.init(env.posthogKey!, {
    api_host: env.posthogHost,
    person_profiles: 'identified_only',
    // Pageviews are captured from the router below so SPA navigations count.
    capture_pageview: false,
    defaults: '2025-11-30',
  })
}

function RouterPageviews() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname])

  return null
}

/** No-op passthrough when VITE_POSTHOG_KEY is unset. */
export function PostHogAnalytics({ children }: { children: ReactNode }) {
  if (!isPostHogConfigured) return <>{children}</>

  return (
    <PostHogProvider client={posthog}>
      <RouterPageviews />
      {children}
    </PostHogProvider>
  )
}
