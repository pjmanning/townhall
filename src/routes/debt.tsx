import { createFileRoute } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { debtIssues, formatPct, formatUsd } from '#/lib/town-data'

export const Route = createFileRoute('/debt')({
  head: () =>
    seoHead({
      title: 'Debt',
      description: `${site.town} outstanding debt — bond issues, rates, and annual debt service.`,
      path: '/debt',
    }),
  component: DebtPage,
})

function DebtPage() {
  const totalPrincipal = debtIssues.reduce((sum, issue) => sum + issue.principal, 0)
  const totalService = debtIssues.reduce((sum, issue) => sum + issue.annualService, 0)

  return (
    <MarketingShell>
      <PageHeader
        kicker={`${site.town} · Outstanding`}
        title="Debt"
        description="Bond issues the town is still paying. Principal, rate, maturity, and what that costs each year."
      />

      <section className="nj-shell pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="rounded-xl border border-border bg-card p-6">
            <p className="nj-kicker">Principal outstanding</p>
            <p className="mt-3 font-display text-3xl font-semibold">{formatUsd(totalPrincipal)}</p>
          </Reveal>
          <Reveal delay={0.05} className="rounded-xl border border-border bg-card p-6">
            <p className="nj-kicker">Annual debt service</p>
            <p className="mt-3 font-display text-3xl font-semibold">{formatUsd(totalService)}</p>
          </Reveal>
        </div>

        <ul className="mt-12 space-y-px overflow-hidden rounded-xl border border-border bg-border">
          {debtIssues.map((issue, index) => (
            <Reveal
              key={issue.name}
              as="li"
              delay={index * 0.05}
              className="bg-background p-7 md:grid md:grid-cols-[1.4fr_1fr] md:gap-8"
            >
              <div>
                <h2 className="font-display text-xl font-semibold">{issue.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{issue.purpose}</p>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm md:mt-0">
                <div>
                  <dt className="text-muted-foreground">Principal</dt>
                  <dd className="mt-1 font-medium tabular-nums">{formatUsd(issue.principal)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Rate</dt>
                  <dd className="mt-1 font-medium tabular-nums">{formatPct(issue.rate)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Matures</dt>
                  <dd className="mt-1 font-medium tabular-nums">{issue.maturity}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Annual service</dt>
                  <dd className="mt-1 font-medium tabular-nums">
                    {formatUsd(issue.annualService)}
                  </dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>
      </section>
    </MarketingShell>
  )
}
