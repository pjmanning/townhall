import * as Sentry from '@sentry/tanstackstart-react'
import { env, isSentryConfigured } from '#/lib/env'

/**
 * Browser-side Sentry. Imported for its side effect by the provider stack.
 * With VITE_SENTRY_DSN unset this does nothing at all.
 */
if (typeof window !== 'undefined' && isSentryConfigured) {
  Sentry.init({
    dsn: env.sentryDsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    // Opt in explicitly rather than shipping user data by default.
    dataCollection: {
      userInfo: false,
      httpBodies: [],
    },
  })
}

export { Sentry }
