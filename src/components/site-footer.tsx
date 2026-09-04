import { Link } from '@tanstack/react-router'
import { BrandMark } from './brand'
import { featurebase, nav, site } from '#/lib/site'

/** Featurebase links only render when the matching env vars are present. */
function communityLinks() {
  const org = featurebase.organization
  const links = [
    {
      label: 'Feedback',
      href: featurebase.feedbackUrl ?? (org ? `https://${org}.featurebase.app` : undefined),
    },
    {
      label: 'Changelog',
      href:
        featurebase.changelogUrl ?? (org ? `https://${org}.featurebase.app/changelog` : undefined),
    },
    {
      label: 'Help center',
      href: featurebase.helpUrl ?? (org ? `https://${org}.featurebase.app/help` : undefined),
    },
  ]
  return links.filter((link): link is { label: string; href: string } => Boolean(link.href))
}

export function SiteFooter() {
  const community = communityLinks()

  return (
    <footer className="mt-32 border-t border-border/70">
      <div className="nj-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <BrandMark className="text-primary" />
            <span className="font-display text-lg font-semibold">{site.name}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{site.tagline}</p>
        </div>

        <FooterColumn title="Town" links={nav.marketing} />
        <FooterColumn title="More" links={nav.legal} />

        <div>
          <p className="nj-kicker">{community.length > 0 ? 'Community' : 'Contact'}</p>
          <ul className="mt-4 space-y-2.5">
            {community.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {site.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="nj-shell flex flex-col gap-2 border-t border-border/70 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="font-mono">TanStack Start · Convex · Cloudflare Workers</p>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: ReadonlyArray<{ label: string; to: string }>
}) {
  return (
    <div>
      <p className="nj-kicker">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
