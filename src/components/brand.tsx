import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { site } from '#/lib/site'

/**
 * Townhall mark — a simple cupola / meeting-house silhouette.
 * One glyph carries the brand rather than a logo stack.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-7', className)}>
      <path d="M16 3.5 27 11v3.5H5V11L16 3.5Z" fill="currentColor" opacity="0.92" />
      <rect x="8" y="14.5" width="16" height="12" rx="1.2" fill="currentColor" opacity="0.78" />
      <rect x="14.2" y="19" width="3.6" height="7.5" rx="0.6" fill="var(--background)" />
      <circle cx="16" cy="7.2" r="1.35" fill="var(--background)" />
    </svg>
  )
}

export function Wordmark({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-2.5 text-foreground no-underline',
        className,
      )}
    >
      <BrandMark className="text-primary transition-transform duration-300 group-hover:-rotate-3" />
      <span className="font-display text-xl font-semibold tracking-tight">{site.name}</span>
    </Link>
  )
}
