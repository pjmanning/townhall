/**
 * Display data for the pricing page. Stripe price ids deliberately live only in
 * Convex env vars — the client sends a plan slug + interval and the server
 * resolves the price, so the amount can never be chosen by the browser.
 */
export type PlanSlug = 'free' | 'pro' | 'scale'
export type BillingInterval = 'month' | 'year'

export interface Plan {
  slug: PlanSlug
  name: string
  blurb: string
  price: Record<BillingInterval, number>
  features: ReadonlyArray<string>
  cta: string
  featured?: boolean
}

export const plans: ReadonlyArray<Plan> = [
  {
    slug: 'free',
    name: 'Solo',
    blurb: 'Everything you need to get the first version in front of people.',
    price: { month: 0, year: 0 },
    features: [
      '1 project',
      'Up to 1,000 monthly actives',
      'Community support',
      'All core features',
    ],
    cta: 'Start free',
  },
  {
    slug: 'pro',
    name: 'Pro',
    blurb: 'For products with paying customers and a real support burden.',
    price: { month: 24, year: 240 },
    features: [
      'Unlimited projects',
      'Up to 25,000 monthly actives',
      'Email support, 1 business day',
      'Custom domain + branded email',
      'Audit log',
    ],
    cta: 'Upgrade to Pro',
    featured: true,
  },
  {
    slug: 'scale',
    name: 'Scale',
    blurb: 'Volume pricing, security review, and a human on the other end.',
    price: { month: 96, year: 960 },
    features: [
      'Everything in Pro',
      'Unlimited monthly actives',
      'Priority support, 4 hour response',
      'SSO and SCIM',
      'Uptime SLA',
    ],
    cta: 'Upgrade to Scale',
  },
]

export const paidPlans = plans.filter(
  (plan): plan is Plan & { slug: 'pro' | 'scale' } => plan.slug !== 'free',
)

export const formatPrice = (amount: number, interval: BillingInterval) =>
  amount === 0 ? 'Free' : `$${interval === 'year' ? Math.round(amount / 12) : amount}`
