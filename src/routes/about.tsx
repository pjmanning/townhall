import { createFileRoute, Link } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { Button } from '#/components/ui/button'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/about')({
  head: () =>
    seoHead({
      title: 'About',
      path: '/about',
      description: `Why ${site.name} exists, what is inside it, and the rules it follows.`,
    }),
  component: AboutPage,
})

const decisions = [
  {
    title: 'TanStack, not a framework grab bag',
    body: 'Routing, data fetching, forms and the server runtime all come from TanStack. When a problem looks like it needs a new dependency, the first question is whether TanStack already answers it.',
  },
  {
    title: 'Convex is the only database',
    body: 'There is no second store to keep in sync — no D1, no Redis, no ORM. Cloudflare Workers hosts the app; it is not a backend.',
  },
  {
    title: 'Every integration degrades',
    body: 'Stripe, Sentry, PostHog and Featurebase are all optional at runtime. A clone with only Convex and Clerk configured still builds, boots, and renders every page.',
  },
  {
    title: 'Cross-platform from the start',
    body: 'Clerk issues the identity and Convex holds the data, so a native client can join later against the same backend without a rewrite.',
  },
]

const stack = [
  ['Host', 'Cloudflare Workers'],
  ['Framework', 'TanStack Start + Router + Query + Form'],
  ['Database', 'Convex'],
  ['Auth', 'Clerk'],
  ['Billing', 'Stripe Checkout + Portal'],
  ['Email', 'Resend'],
  ['Analytics', 'PostHog'],
  ['Errors', 'Sentry'],
  ['UI', 'Tailwind + shadcn/ui + Motion'],
] as const

function AboutPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="About"
        title="A starter with opinions, written down."
        description={`${site.name} is the repository we kept rebuilding by hand. It encodes the decisions once, so the next project starts at the interesting part.`}
      />

      <div className="nj-shell grid gap-16 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-10">
          {decisions.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="h-fit rounded-xl border border-border bg-card/60 p-7">
          <p className="nj-kicker">The stack</p>
          <dl className="mt-6 space-y-4">
            {stack.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="outline" className="mt-8 w-full">
            <Link to="/contact">Ask a question</Link>
          </Button>
        </Reveal>
      </div>
    </MarketingShell>
  )
}
