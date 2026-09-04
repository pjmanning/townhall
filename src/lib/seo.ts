import { site } from './site'

type JsonLd = Record<string, unknown>

export interface SeoHeadOptions {
  title: string
  description?: string
  /** Absolute or root-relative path, e.g. `/pricing`. */
  path?: string
  image?: string
  type?: 'website' | 'article'
  /** Set on routes that should not be indexed (auth shell, thank-you pages). */
  noindex?: boolean
  jsonLd?: JsonLd | Array<JsonLd>
  publishedTime?: string
  authorName?: string
}

const absolute = (pathOrUrl: string) =>
  pathOrUrl.startsWith('http') ? pathOrUrl : `${site.url.replace(/\/$/, '')}${pathOrUrl}`

/**
 * Shared `head` builder so every route emits the same shape of title, OG,
 * Twitter, canonical and (optionally) JSON-LD tags.
 *
 * Spread the result into a route's `head`:
 *   head: () => seoHead({ title: 'Pricing', path: '/pricing' })
 */
export function seoHead({
  title,
  description = site.description,
  path = '/',
  image = site.ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
  publishedTime,
  authorName,
}: SeoHeadOptions) {
  const fullTitle =
    title === site.name ? `${site.name} — ${site.tagline}` : `${title} · ${site.name}`
  const canonical = absolute(path)
  const imageUrl = absolute(image)

  const meta = [
    { title: fullTitle },
    { name: 'description', content: description },

    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: imageUrl },
    { property: 'og:site_name', content: site.name },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: site.twitter },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  if (noindex) meta.push({ name: 'robots', content: 'noindex, nofollow' })
  if (publishedTime) meta.push({ property: 'article:published_time', content: publishedTime })
  if (authorName) meta.push({ property: 'article:author', content: authorName })

  const scripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((entry) => ({
        type: 'application/ld+json',
        children: JSON.stringify(entry),
      }))
    : undefined

  return {
    meta,
    links: [{ rel: 'canonical', href: canonical }],
    ...(scripts ? { scripts } : {}),
  }
}

export const organizationJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: absolute('/favicon.svg'),
  sameAs: [`https://twitter.com/${site.twitter.replace('@', '')}`],
})

export const articleJsonLd = (post: {
  title: string
  description: string
  slug: string
  date: string
  author: string
}): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  author: { '@type': 'Person', name: post.author },
  publisher: { '@type': 'Organization', name: site.name },
  mainEntityOfPage: absolute(`/blog/${post.slug}`),
})

export const faqJsonLd = (items: ReadonlyArray<{ question: string; answer: string }>): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export const productJsonLd = (
  plans: ReadonlyArray<{ name: string; price: number; period: string }>,
): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: site.name,
  description: site.description,
  offers: plans.map((plan) => ({
    '@type': 'Offer',
    name: plan.name,
    price: plan.price,
    priceCurrency: 'USD',
    url: absolute('/pricing'),
  })),
})
