import { createFileRoute } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'
import { communityPosts } from '#/lib/town-data'

export const Route = createFileRoute('/community')({
  head: () =>
    seoHead({
      title: 'Community board',
      description: `Public questions and notices for ${site.town} — the community board.`,
      path: '/community',
    }),
  component: CommunityPage,
})

const statusLabel = {
  open: 'Open',
  official: 'Official',
  answered: 'Answered',
} as const

function CommunityPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker={`${site.town} · Board`}
        title="Community board"
        description="Questions from neighbors and notices from the town. Posting requires a signed-in account once Clerk is wired; this page shows the public read surface."
      />

      <section className="nj-shell pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {communityPosts.length} recent threads · newest first
          </p>
          <Button type="button" disabled title="Signing in unlocks posting">
            New post (coming soon)
          </Button>
        </div>

        <ul className="mt-8 space-y-px overflow-hidden rounded-xl border border-border bg-border">
          {communityPosts.map((post, index) => (
            <Reveal key={post.id} as="li" delay={index * 0.05} className="bg-background p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{statusLabel[post.status]}</Badge>
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  {post.neighborhood}
                </span>
                <span className="text-xs text-muted-foreground">· {post.createdAt}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-balance">{post.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {post.body}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {post.author} · {post.replies} replies
              </p>
            </Reveal>
          ))}
        </ul>
      </section>
    </MarketingShell>
  )
}
