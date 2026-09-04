import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { MarketingShell } from '#/components/marketing-shell'
import { Badge } from '#/components/ui/badge'
import { formatPostDate, getPost } from '#/content/blog'
import { articleJsonLd, seoHead } from '#/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPost(params.slug)
    if (!post) throw notFound()

    // Only serialisable data belongs in loader output; the component looks the
    // MDX module up again by slug.
    return {
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      tags: post.tags ?? [],
      readingMinutes: post.readingMinutes,
    }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return seoHead({ title: 'Post', path: `/blog/${params.slug}` })

    return seoHead({
      title: loaderData.title,
      description: loaderData.description,
      path: `/blog/${params.slug}`,
      type: 'article',
      publishedTime: loaderData.date,
      authorName: loaderData.author,
      jsonLd: articleJsonLd({
        title: loaderData.title,
        description: loaderData.description,
        slug: params.slug,
        date: loaderData.date,
        author: loaderData.author,
      }),
    })
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const meta = Route.useLoaderData()
  const post = getPost(slug)

  if (!post) return null
  const { Content } = post

  return (
    <MarketingShell>
      <article className="nj-shell max-w-3xl pt-16 pb-24 md:pt-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          All posts
        </Link>

        <h1 className="mt-8 text-4xl font-semibold text-balance md:text-6xl">{meta.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
          <span aria-hidden className="text-primary">
            /
          </span>
          <span>{meta.author}</span>
          {meta.readingMinutes ? (
            <>
              <span aria-hidden className="text-primary">
                /
              </span>
              <span>{meta.readingMinutes} min read</span>
            </>
          ) : null}
        </div>

        {meta.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="nj-rule mt-10 mb-12" />

        <div className="prose dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:mt-14 prose-h2:text-2xl prose-a:decoration-primary/40 prose-a:underline-offset-4">
          <Content />
        </div>
      </article>
    </MarketingShell>
  )
}
