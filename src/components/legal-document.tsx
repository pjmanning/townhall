import type { ReactNode } from 'react'

/** Shared typography wrapper for the policy pages. */
export function LegalDocument({ children }: { children: ReactNode }) {
  return (
    <article className="nj-shell prose prose-sm dark:prose-invert max-w-3xl pb-20 prose-headings:font-display prose-headings:font-semibold prose-h2:mt-12 prose-h2:text-xl">
      {children}
    </article>
  )
}
