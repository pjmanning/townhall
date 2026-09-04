import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { Badge } from '#/components/ui/badge'
import { formatPostDate, posts } from '#/content/blog'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/blog/')({
  head: () =>
    seoHead({
      title: 'Blog',
      path: '/blog',
      description: `Notes on building and shipping with the ${site.name} stack.`,
    }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Writing"
        title="Notes from the build."
        description="Short, specific posts about the decisions inside this stack — and the ones we got wrong first."
      />

      <div className="nj-shell pb-20">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Drop an <code className="font-mono text-sm">.mdx</code> file into{' '}
            <code className="font-mono text-sm">src/content/blog/</code> to publish one.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 0.05}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group grid gap-4 py-8 no-underline md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase"
                  >
                    {formatPostDate(post.date)}
                  </time>

                  <div>
                    <h2 className="text-2xl font-semibold text-balance transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
                      {post.description}
                    </p>
                    {post.tags?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <ArrowUpRightIcon className="hidden size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-primary md:block" />
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </MarketingShell>
  )
}
