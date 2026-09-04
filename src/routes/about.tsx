import { createFileRoute } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/about')({
  head: () =>
    seoHead({
      title: 'About',
      description: `What ${site.name} is for — open local data for ${site.town}.`,
      path: '/about',
    }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="About"
        title={`Built for ${site.town}.`}
        description={site.description}
      />

      <section className="nj-shell max-w-3xl space-y-8 pb-24 text-base leading-relaxed text-muted-foreground">
        <p>
          Townhall started from a simple frustration: budget PDFs, debt schedules, and staff
          directories live in different places, update on different calendars, and rarely talk to
          each other. Residents should not need a FOIA request to follow the money.
        </p>
        <p>
          This site is the public surface — budget, debt, staff, and a community board — sitting
          on the same TanStack Start + Convex template we use for product work. Demo numbers are
          labeled as such until live feeds are wired.
        </p>
        <p>
          Questions or corrections:{' '}
          <a href={`mailto:${site.contactEmail}`} className="text-primary">
            {site.contactEmail}
          </a>
          .
        </p>
      </section>
    </MarketingShell>
  )
}
