import { createFileRoute, Link } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Button } from '#/components/ui/button'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/admin')({
  head: () =>
    seoHead({
      title: 'Admin',
      description: `Staff admin stub for ${site.name}.`,
      path: '/admin',
      noindex: true,
    }),
  component: AdminStubPage,
})

function AdminStubPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Staff only · Stub"
        title="Admin"
        description="Publishing tools for budget rows, staff contacts, debt issues, and community moderation will land here. This route is a placeholder so the product map is complete."
      />

      <section className="nj-shell pb-24">
        <div className="nj-panel max-w-2xl rounded-xl p-8">
          <p className="nj-kicker">Not wired yet</p>
          <h2 className="mt-3 font-display text-2xl font-semibold">Coming next</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Clerk-gated staff roles</li>
            <li>Convex mutations for budget, staff, and debt tables</li>
            <li>Community board moderation queue</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/app">Product shell (/app)</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login" search={{ mode: 'sign-in' }}>
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
