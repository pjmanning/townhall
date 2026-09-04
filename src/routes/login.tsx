import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SignIn, SignUp } from '@clerk/tanstack-react-start'

import { Wordmark } from '#/components/brand'
import { Reveal } from '#/components/motion/reveal'
import { ThemeToggle } from '#/components/theme-toggle'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { isClerkConfigured } from '#/lib/env'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { useAppAuth } from '#/lib/use-auth'

type AuthMode = 'sign-in' | 'sign-up'

interface LoginSearch {
  /** Optional so plain `<Link to="/login" />` stays valid. */
  mode?: AuthMode
  redirect?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    mode: search.mode === 'sign-up' ? 'sign-up' : undefined,
    // Only same-origin paths, so `?redirect=` can never become an open redirect.
    redirect:
      typeof search.redirect === 'string' && search.redirect.startsWith('/')
        ? search.redirect
        : undefined,
  }),
  head: () =>
    seoHead({
      title: 'Sign in',
      path: '/login',
      description: `Sign in to ${site.name} or create an account.`,
      noindex: true,
    }),
  component: LoginPage,
})

/** Clerk's widgets inherit the app tokens rather than shipping their own palette. */
const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--primary)',
    colorBackground: 'transparent',
    colorText: 'var(--foreground)',
    colorTextSecondary: 'var(--muted-foreground)',
    colorInputBackground: 'var(--background)',
    colorInputText: 'var(--foreground)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-sans)',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none border-0',
    card: 'bg-transparent shadow-none p-0',
    header: 'hidden',
    footer: 'bg-transparent',
  },
} as const

function LoginPage() {
  const { mode = 'sign-in', redirect } = Route.useSearch()
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useAppAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void navigate({ to: redirect ?? '/app', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate, redirect])

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="nj-shell flex h-16 items-center justify-between">
        <Wordmark />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <Reveal className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">
              {mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === 'sign-up'
                ? 'One account works across web and any native client you add later.'
                : `Sign in to your ${site.name} workspace.`}
            </p>
          </div>

          <Tabs
            value={mode}
            onValueChange={(value) =>
              void navigate({
                to: '/login',
                search: { mode: value as AuthMode, redirect },
                replace: true,
              })
            }
            className="mt-8"
          >
            <TabsList className="w-full">
              <TabsTrigger value="sign-in" className="flex-1">
                Sign in
              </TabsTrigger>
              <TabsTrigger value="sign-up" className="flex-1">
                Sign up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-8 rounded-xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {isClerkConfigured ? (
              mode === 'sign-up' ? (
                <SignUp
                  routing="hash"
                  appearance={clerkAppearance}
                  forceRedirectUrl={redirect ?? '/app'}
                />
              ) : (
                <SignIn
                  routing="hash"
                  appearance={clerkAppearance}
                  forceRedirectUrl={redirect ?? '/app'}
                />
              )
            ) : (
              <ClerkSetupNotice />
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our{' '}
            <Link to="/terms" className="text-foreground underline-offset-4">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-foreground underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </Reveal>
      </main>
    </div>
  )
}

function ClerkSetupNotice() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Authentication is not configured yet.</p>
      <p className="text-muted-foreground">
        Add <code className="font-mono text-xs">VITE_CLERK_PUBLISHABLE_KEY</code> and{' '}
        <code className="font-mono text-xs">CLERK_SECRET_KEY</code> to{' '}
        <code className="font-mono text-xs">.env.local</code>, then set{' '}
        <code className="font-mono text-xs">CLERK_JWT_ISSUER_DOMAIN</code> in your Convex
        deployment. The README has the full checklist.
      </p>
    </div>
  )
}
