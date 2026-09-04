import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAction } from 'convex/react'
import { CheckIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '#convex/_generated/api'
import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { Button } from '#/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { productJsonLd, seoHead } from '#/lib/seo'
import { formatPrice, plans } from '#/lib/plans'
import type { BillingInterval, PlanSlug } from '#/lib/plans'
import { useAppAuth } from '#/lib/use-auth'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/pricing')({
  head: () =>
    seoHead({
      title: 'Pricing',
      path: '/pricing',
      description:
        'Simple per-workspace pricing. Start free, upgrade when you have paying customers.',
      jsonLd: productJsonLd(
        plans.map((plan) => ({ name: plan.name, price: plan.price.month, period: 'month' })),
      ),
    }),
  component: PricingPage,
})

function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>('month')
  const [pending, setPending] = useState<PlanSlug | null>(null)
  const { isSignedIn } = useAppAuth()
  const navigate = useNavigate()
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession)

  async function subscribe(plan: 'pro' | 'scale') {
    if (!isSignedIn) {
      await navigate({ to: '/login', search: { mode: 'sign-up', redirect: '/pricing' } })
      return
    }

    setPending(plan)
    try {
      const { url } = await createCheckoutSession({ plan, interval })
      window.location.href = url
    } catch (error) {
      // Stripe is optional in a fresh clone — surface the reason instead of failing silently.
      toast.error(error instanceof Error ? error.message : 'Could not start checkout')
    } finally {
      setPending(null)
    }
  }

  return (
    <MarketingShell>
      <PageHeader
        kicker="Pricing"
        title="Priced per workspace, not per seat."
        description="Every plan includes the full stack. You are paying for scale and support, never for features held hostage."
      />

      <div className="nj-shell">
        <Tabs value={interval} onValueChange={(value) => setInterval(value as BillingInterval)}>
          <TabsList>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">Yearly · 2 months free</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal
              key={plan.slug}
              as="article"
              delay={index * 0.06}
              className={cn(
                'relative flex flex-col rounded-xl border border-border bg-card/60 p-8',
                plan.featured && 'nj-glow border-primary/40',
              )}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-primary-foreground uppercase">
                  Most picked
                </span>
              ) : null}

              <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
                {plan.blurb}
              </p>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-semibold">
                  {formatPrice(plan.price[interval], interval)}
                </span>
                {plan.price[interval] > 0 ? (
                  <span className="text-sm text-muted-foreground">/ month</span>
                ) : null}
              </p>
              {interval === 'year' && plan.price.year > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  ${plan.price.year} billed annually
                </p>
              ) : null}

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.slug === 'free' ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" search={{ mode: 'sign-up' }}>
                      {plan.cta}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.featured ? 'default' : 'outline'}
                    disabled={pending !== null}
                    onClick={() => void subscribe(plan.slug as 'pro' | 'scale')}
                  >
                    {pending === plan.slug ? <Loader2Icon className="size-4 animate-spin" /> : null}
                    {plan.cta}
                  </Button>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Prices are illustrative. Wire real Stripe price ids into the Convex environment
          (`STRIPE_PRICE_PRO_MONTHLY` and friends) before launch — see the README.
        </p>

        <div className="nj-rule mt-16" />
        <div className="flex flex-col items-start gap-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-lg text-pretty">
            Not sure which plan fits? Tell us what you are building.
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact sales</Link>
          </Button>
        </div>
      </div>
    </MarketingShell>
  )
}
