import type { ComponentType } from 'react'

/**
 * Filesystem-backed blog. Every `.mdx` file in this folder becomes a post, and
 * `crawlLinks` prerendering turns each one into static HTML at build time.
 *
 * Frontmatter is exported by `remark-mdx-frontmatter` (see vite.config.ts).
 */

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tags?: Array<string>
  readingMinutes?: number
}

export interface Post extends PostFrontmatter {
  slug: string
  Content: ComponentType
}

interface MdxModule {
  default: ComponentType
  frontmatter?: PostFrontmatter
}

const modules = import.meta.glob<MdxModule>('./blog/*.mdx', { eager: true })

export const posts: Array<Post> = Object.entries(modules)
  .map(([path, module]) => {
    const slug = path.replace('./blog/', '').replace(/\.mdx$/, '')
    const frontmatter = module.frontmatter

    if (!frontmatter?.title) {
      throw new Error(`Blog post ${path} is missing frontmatter with a title.`)
    }

    return { ...frontmatter, slug, Content: module.default }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug: string) => posts.find((post) => post.slug === slug)

export const formatPostDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
