import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { BookOpenIcon, PlusIcon, SettingsIcon, SparklesIcon } from 'lucide-react'

import { api } from '#convex/_generated/api'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { seoHead } from '#/lib/seo'

export const Route = createFileRoute('/app/')({
  head: () => seoHead({ title: 'Overview', path: '/app', noindex: true }),
  component: AppOverview,
})

const nextSteps = [
  {
    icon: SparklesIcon,
    title: 'Define your first object',
    body: 'Add a table to convex/schema.ts with an index on the owning user, then a query and a mutation beside it.',
  },
  {
    icon: BookOpenIcon,
    title: 'Read the house rules',
    body: 'AGENTS.md covers the TanStack-first rule and where each concern belongs. DESIGN.md covers the visual system.',
  },
  {
    icon: SettingsIcon,
    title: 'Turn on billing',
    body: 'Add your Stripe keys and price ids to the Convex environment, then test the upgrade flow from the pricing page.',
  },
]

function AppOverview() {
  const user = useQuery(api.users.current)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="nj-kicker">Overview</p>
          {user === undefined ? (
            <Skeleton className="mt-3 h-10 w-72" />
          ) : (
            <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
              {user?.name ? `Evening, ${user.name.split(' ')[0]}.` : 'Your workspace is ready.'}
            </h1>
          )}
          <p className="mt-2 text-muted-foreground">
            Nothing here yet — this is the empty state you get to replace.
          </p>
        </div>
        <Button disabled>
          <PlusIcon className="size-4" />
          New project
        </Button>
      </div>

      <div className="nj-rule mt-10" />

      <div className="mt-14 flex flex-col items-center rounded-xl border border-dashed border-border py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-card">
          <SparklesIcon className="size-5 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No projects yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">
          Wire the button above to a Convex mutation and this becomes your product. The plumbing
          around it is already done.
        </p>
      </div>

      <div className="mt-16">
        <p className="nj-kicker">Next steps</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {nextSteps.map((step) => (
            <article key={step.title} className="bg-background p-6">
              <step.icon className="size-4 text-primary" />
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Manage your plan and profile in <Link to="/app/settings">Settings</Link>.
      </p>
    </div>
  )
}
