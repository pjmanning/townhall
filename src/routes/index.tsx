import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  LandmarkIcon,
  MessageSquareIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react'

import { MarketingShell } from '#/components/marketing-shell'
import { Hero } from '#/components/marketing/hero'
import { Reveal } from '#/components/motion/reveal'
import { Button } from '#/components/ui/button'
import { organizationJsonLd, seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/')({
  head: () =>
    seoHead({
      title: site.name,
      path: '/',
      jsonLd: organizationJsonLd(),
    }),
  component: LandingPage,
})

const pillars = [
  {
    icon: WalletIcon,
    title: 'Budget',
    body: 'Department appropriations, year-to-date spend, and where property tax dollars land.',
    to: '/budget' as const,
  },
  {
    icon: UsersIcon,
    title: 'Staff',
    body: 'Who runs which office, with direct contacts for the people who answer the phone.',
    to: '/staff' as const,
  },
  {
    icon: LandmarkIcon,
    title: 'Debt',
    body: 'Bond issues, rates, maturity, and annual debt service in plain language.',
    to: '/debt' as const,
  },
  {
    icon: MessageSquareIcon,
    title: 'Community',
    body: 'A public board for questions, notices, and neighborhood asks — not a buried Facebook thread.',
    to: '/community' as const,
  },
]

function LandingPage() {
  return (
    <MarketingShell>
      <Hero />

      <section className="nj-shell py-24">
        <Reveal>
          <p className="nj-kicker">What you can see</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-balance md:text-5xl">
            Four places residents actually look.
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground text-pretty">
            Townhall keeps the civic record readable: one town, one site, no scavenger hunt through
            agenda packets.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {pillars.map((item, index) => (
            <Reveal
              key={item.title}
              as="article"
              delay={index * 0.05}
              className="group bg-background p-7 transition-colors hover:bg-card"
            >
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <Link
                to={item.to}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline"
              >
                Open
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="nj-shell pb-8">
        <Reveal className="nj-panel nj-glow relative overflow-hidden rounded-2xl px-8 py-16 text-center md:px-16 md:py-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_50%_0%,var(--nj-aurora-a),transparent_70%)]"
          />
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold text-balance md:text-6xl">
            Ask the town. Get it on the record.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground text-pretty">
            Use the community board for questions that deserve a public answer — not a private
            inbox.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/community">Go to the board</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/contact">Contact the clerk</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </MarketingShell>
  )
}
