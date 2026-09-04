import { HeadContent, Link, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import type { ConvexReactClient } from 'convex/react'
import type { ConvexQueryClient } from '@convex-dev/react-query'

import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'
import { AppProviders } from '#/integrations/providers'
import { MarketingShell } from '#/components/marketing-shell'
import { Button } from '#/components/ui/button'
import { Toaster } from '#/components/ui/sonner'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { themeScript } from '#/lib/theme'

import appCss from '#/styles.css?url'

export interface RouterContext {
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => {
    const seo = seoHead({ title: site.name, path: '/' })
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#eef2f5' },
        ...seo.meta,
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Source+Sans+3:wght@300..700&family=IBM+Plex+Mono:wght@400;500&display=swap',
        },
      ],
      scripts: [{ children: themeScript }],
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { convexClient } = Route.useRouteContext()

  // `themeScript` rewrites the theme class before paint, so the class rendered
  // here is a no-JS default rather than something hydration should match.
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Motion writes its hidden initial state as an inline style, which the
            prerendered HTML keeps. Without JS nothing would ever reveal it. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <div className="nj-atmosphere" aria-hidden />
        <AppProviders convexClient={convexClient}>
          {children}
          <Toaster position="bottom-right" />
          {import.meta.env.DEV ? (
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
                TanStackQueryDevtools,
              ]}
            />
          ) : null}
        </AppProviders>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <MarketingShell>
      <div className="nj-shell flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
        <p className="nj-kicker">Error 404</p>
        <h1 className="mt-4 text-5xl font-semibold md:text-7xl">That page is not on the agenda.</h1>
        <p className="mt-5 max-w-md text-muted-foreground text-pretty">
          The page you were after has moved or never existed. Try the budget, staff directory, or
          community board.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/budget">View budget</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/community">Community board</Link>
          </Button>
        </div>
      </div>
    </MarketingShell>
  )
}
