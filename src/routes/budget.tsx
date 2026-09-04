import { createFileRoute } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { budgetDepartments, budgetSummary, formatPct, formatUsd } from '#/lib/town-data'

export const Route = createFileRoute('/budget')({
  head: () =>
    seoHead({
      title: 'Budget',
      description: `${site.town} ${budgetSummary.fiscalYear} budget — appropriations and year-to-date spend by department.`,
      path: '/budget',
    }),
  component: BudgetPage,
})

function BudgetPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker={`${site.town} · ${budgetSummary.fiscalYear}`}
        title="Budget"
        description="Department appropriations, year-to-date spend, and how much of local revenue comes from property tax. Demo figures for Millbrook — wire to live ledgers next."
      />

      <section className="nj-shell pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <Reveal className="rounded-xl border border-border bg-card p-6">
            <p className="nj-kicker">Appropriations</p>
            <p className="mt-3 font-display text-3xl font-semibold">
              {formatUsd(budgetSummary.totalAppropriations)}
            </p>
          </Reveal>
          <Reveal delay={0.05} className="rounded-xl border border-border bg-card p-6">
            <p className="nj-kicker">Projected revenue</p>
            <p className="mt-3 font-display text-3xl font-semibold">
              {formatUsd(budgetSummary.totalRevenue)}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-xl border border-border bg-card p-6">
            <p className="nj-kicker">From property tax</p>
            <p className="mt-3 font-display text-3xl font-semibold">
              {formatPct(budgetSummary.propertyTaxShare)}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Appropriation</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">YTD spent</th>
                <th className="px-5 py-3 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {budgetDepartments.map((dept) => {
                const progress = dept.spent / dept.appropriation
                return (
                  <tr key={dept.name} className="border-t border-border bg-background">
                    <td className="px-5 py-4">
                      <p className="font-medium">{dept.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                        {formatUsd(dept.appropriation)} · {formatUsd(dept.spent)} spent
                      </p>
                      <p className="mt-1 max-w-md text-xs text-muted-foreground">{dept.notes}</p>
                    </td>
                    <td className="hidden px-5 py-4 tabular-nums sm:table-cell">
                      {formatUsd(dept.appropriation)}
                    </td>
                    <td className="hidden px-5 py-4 tabular-nums md:table-cell">
                      {formatUsd(dept.spent)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(progress * 100, 100)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {formatPct(progress)}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Last updated {budgetSummary.lastUpdated}. Figures are illustrative until connected to the
          finance system.
        </p>
      </section>
    </MarketingShell>
  )
}
