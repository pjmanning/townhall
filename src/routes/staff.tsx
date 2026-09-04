import { createFileRoute } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { staffDirectory } from '#/lib/town-data'

export const Route = createFileRoute('/staff')({
  head: () =>
    seoHead({
      title: 'Staff',
      description: `${site.town} staff directory — department leads and how to reach them.`,
      path: '/staff',
    }),
  component: StaffPage,
})

function StaffPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker={`${site.town} · Directory`}
        title="Staff"
        description="Department leads and direct contacts. For general requests, start with the clerk; for budgets and debt, finance."
      />

      <section className="nj-shell pb-20">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {staffDirectory.map((person, index) => (
            <Reveal
              key={person.email}
              as="article"
              delay={index * 0.04}
              className="bg-background p-7"
            >
              <p className="nj-kicker">{person.department}</p>
              <h2 className="mt-3 font-display text-xl font-semibold">{person.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{person.title}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${person.email}`} className="text-primary no-underline">
                      {person.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="tabular-nums">{person.phone}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>
      </section>
    </MarketingShell>
  )
}
