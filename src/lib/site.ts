import { env, read } from './env'

/**
 * Single place to rebrand the template. Everything user-visible reads from here.
 */
export const site = {
  name: 'Townhall',
  tagline: 'See where the money goes.',
  description:
    'Townhall is small-town local government transparency — budgets, staff, debt, and a community board in one place residents can actually use.',
  /** Canonical origin, no trailing slash. Set VITE_SITE_URL before shipping. */
  url: (env.siteUrl ?? 'http://localhost:43125').replace(/\/+$/, ''),
  ogImage: '/og.png',
  twitter: '@townhall',
  contactEmail: 'clerk@townhall.example',
  town: 'Millbrook',
} as const

const featurebaseOrg = read(import.meta.env.VITE_FEATUREBASE_ORG)

/**
 * Optional integrations. The app must run with every one of these unset, so
 * always branch on `enabled` rather than assuming a value exists. Setting the
 * organization derives all three URLs; the explicit vars override it.
 */
export const featurebase = {
  organization: featurebaseOrg,
  feedbackUrl:
    read(import.meta.env.VITE_FEATUREBASE_FEEDBACK_URL) ??
    (featurebaseOrg ? `https://${featurebaseOrg}.featurebase.app` : undefined),
  changelogUrl:
    read(import.meta.env.VITE_FEATUREBASE_CHANGELOG_URL) ??
    (featurebaseOrg ? `https://${featurebaseOrg}.featurebase.app/changelog` : undefined),
  helpUrl:
    read(import.meta.env.VITE_FEATUREBASE_HELP_URL) ??
    (featurebaseOrg ? `https://${featurebaseOrg}.featurebase.app/help` : undefined),
  get enabled() {
    return Boolean(this.feedbackUrl ?? this.changelogUrl ?? this.helpUrl)
  },
}

export const nav = {
  marketing: [
    { label: 'Budget', to: '/budget' },
    { label: 'Staff', to: '/staff' },
    { label: 'Debt', to: '/debt' },
    { label: 'Community', to: '/community' },
  ],
  legal: [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Contact', to: '/contact' },
    { label: 'Admin', to: '/admin' },
  ],
} as const
