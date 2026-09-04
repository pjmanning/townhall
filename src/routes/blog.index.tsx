import { createFileRoute, Link } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { seoHead } from '#/lib/seo'
import { formatPostDate, posts } from '#/content/blog'

export const Route = createFileRoute('/blog/')({
  head: () =>
    seoHead({
      title: 'Blog',
      description: 'Notes on building and shipping with Townhall.',
      path: '/blog',
    }),
  component: BlogIndex,
})

function BlogIndex() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Writing"
        title="Notes from the town."
        description="How we publish civic data, and what we learn when we do."
      />

      <section className="nj-shell pb-24">
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 0.05}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col gap-2 py-8 no-underline transition-colors hover:bg-muted/40 md:flex-row md:items-baseline md:gap-10 md:px-4"
              >
                <time className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase md:w-36">
                  {formatPostDate(post.date)}
                </time>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {post.description}
                  </p>
                </div>
                {post.readingMinutes ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {post.readingMinutes} min
                  </span>
                ) : null}
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </MarketingShell>
  )
}
