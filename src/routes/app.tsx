import { useEffect, useRef } from 'react'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'

import { api } from '#convex/_generated/api'
import { Wordmark } from '#/components/brand'
import { ThemeToggle } from '#/components/theme-toggle'
import { UserMenu } from '#/components/app/user-menu'
import { Button } from '#/components/ui/button'
import { isClerkConfigured, isConvexConfigured, missingRequiredKeys } from '#/lib/env'
import { seoHead } from '#/lib/seo'
import { useAppAuth } from '#/lib/use-auth'

/**
 * Product shell. Path-based at `/app` — there is no `app.` subdomain in v1.
 *
 * `ssr: false` because everything behind it is per-user and gated on Clerk; the
 * marketing routes keep SSR and prerendering.
 */
export const Route = createFileRoute('/app')({
  ssr: false,
  head: () => seoHead({ title: 'Dashboard', path: '/app', noindex: true }),
  component: AppLayout,
})

const appNav = [
  { label: 'Overview', to: '/app' as const },
  { label: 'Settings', to: '/app/settings' as const },
]

function AppLayout() {
  if (missingRequiredKeys.length > 0) return <SetupRequired />

  return <AuthenticatedShell />
}

function AuthenticatedShell() {
  const { isLoaded, isSignedIn } = useAppAuth()
  const navigate = useNavigate()
  const syncUser = useMutation(api.users.sync)
  const synced = useRef(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      void navigate({ to: '/login', search: { mode: 'sign-in', redirect: '/app' }, replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  // Mirror the Clerk identity into Convex once per session.
  useEffect(() => {
    if (!isSignedIn || synced.current) return
    synced.current = true
    void syncUser({}).catch((error: unknown) => {
      synced.current = false
      console.error('[users] sync failed', error)
    })
  }, [isSignedIn, syncUser])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/72 backdrop-blur-xl">
        <div className="nj-shell flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Wordmark to="/app" />
            <nav className="flex items-center gap-1">
              {appNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === '/app' }}
                  activeProps={{ className: 'bg-accent text-foreground' }}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="nj-shell flex-1 py-12">
        <Outlet />
      </main>
    </div>
  )
}

/** Shown instead of the shell when the required keys are missing. */
function SetupRequired() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="nj-shell flex h-16 items-center justify-between">
        <Wordmark />
        <ThemeToggle />
      </header>
      <main className="nj-shell flex flex-1 items-center justify-center py-16">
        <div className="nj-panel w-full max-w-xl rounded-xl p-8 sm:p-10">
          <p className="nj-kicker">Setup required</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {missingRequiredKeys.length === 1 ? 'One key away' : 'Two keys away'} from a working
            product.
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            The marketing site runs without configuration, but the product shell needs a database
            and an identity provider.
          </p>
          <ul className="mt-8 space-y-3">
            {missingRequiredKeys.map((key) => (
              <li key={key} className="flex items-center gap-3 text-sm">
                <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
                <code className="font-mono">{key}</code>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            {isConvexConfigured ? null : (
              <>
                Run <code className="font-mono">npx convex dev</code> to provision Convex.{' '}
              </>
            )}
            {isClerkConfigured ? null : (
              <>
                Paste your Clerk publishable key into <code className="font-mono">.env.local</code>
                .{' '}
              </>
            )}
            The README has the full checklist.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/">Back to the site</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
