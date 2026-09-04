import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

/**
 * Canonical host for the generated sitemap. Set VITE_SITE_URL in CI before the
 * production build, or every canonical URL ships as localhost. The empty-string
 * check matters because `.env.local` declares the key with no value.
 */
const host = process.env.VITE_SITE_URL?.trim() || 'http://localhost:43125'

/** Routes behind auth are never prerendered or listed in the sitemap. */
const isPrivatePath = (path: string) =>
  path.startsWith('/app') || path.startsWith('/login') || path.startsWith('/admin')

/**
 * The crawler adds every link it finds to the sitemap, so private paths have to
 * be declared up front with `sitemap.exclude`. Declared pages are registered
 * before crawling begins, which also stops the crawler re-adding them.
 */
const privatePages = [
  '/app',
  '/app/',
  '/app/settings',
  '/login',
  '/login?mode=sign-up',
  '/admin',
].map((path) => ({
  path,
  prerender: { enabled: false },
  sitemap: { exclude: true },
}))

/**
 * Index routes are discovered with a trailing slash and also crawled without
 * one. Both render the same file, so only the canonical form is listed.
 */
const duplicateIndexPages = ['/blog/'].map((path) => ({
  path,
  sitemap: { exclude: true },
}))

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    // MDX must run before the React plugin so JSX output is still transformed.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
        rehypePlugins: [rehypeSlug],
      }),
    },
    tanstackStart({
      // Marketing + blog become static HTML; crawlLinks picks up /blog/$slug.
      prerender: {
        enabled: true,
        crawlLinks: true,
        concurrency: 8,
        retryCount: 1,
        failOnError: false,
        filter: ({ path }) => !isPrivatePath(path),
      },
      sitemap: {
        enabled: true,
        host,
      },
      pages: [...privatePages, ...duplicateIndexPages],
    }),
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
})

export default config
