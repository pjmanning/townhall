import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import type { ReactNode } from 'react'

/** Chrome shared by every public page, including the 404. */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

/** Standard heading block for interior marketing pages. */
export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker?: string
  title: string
  description?: string
}) {
  return (
    <div className="nj-shell pt-16 pb-10 md:pt-24">
      {kicker ? <p className="nj-kicker">{kicker}</p> : null}
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-balance md:text-6xl">{title}</h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
      <div className="nj-rule mt-10" />
    </div>
  )
}
