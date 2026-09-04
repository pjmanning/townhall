import { createFileRoute, Link } from '@tanstack/react-router'

import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Button } from '#/components/ui/button'
import { faqJsonLd, seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

const faqs = [
  {
    question: 'What do I need before the app will run?',
    answer:
      'A Convex deployment and a Clerk application. Everything else — Stripe, Resend, Sentry, PostHog, Featurebase — is optional and no-ops until you add a key.',
  },
  {
    question: 'Why Cloudflare Workers instead of a Node host?',
    answer:
      'TanStack Start ships an official Cloudflare Workers target, so you get global cold starts measured in milliseconds without a container. Workers only serves the app; all data access goes to Convex.',
  },
  {
    question: 'Can I use this for a mobile app too?',
    answer:
      'Yes. Clerk issues the identity and Convex holds the data, so a native client authenticates against the same Clerk application and reads the same Convex functions. Only the web billing flow is Stripe-specific.',
  },
  {
    question: 'How is billing wired up?',
    answer:
      'Stripe Checkout creates the subscription, the Customer Portal handles upgrades and cancellation, and a signed webhook hits a Convex HTTP endpoint that writes the plan and status back onto the user record.',
  },
  {
    question: 'Where does the design system live?',
    answer:
      'DESIGN.md at the repository root holds the tokens and rules, and src/styles.css is the machine-readable version of the same thing. Change the tokens there and the whole surface follows.',
  },
  {
    question: 'Is the blog going to scale past a few posts?',
    answer:
      'The blog reads MDX files from src/content/blog and prerenders each one at build time. For a large content operation you would move the source to a CMS, but the route contract stays identical.',
  },
  {
    question: 'How do I rename it?',
    answer:
      'Change the constant in src/lib/site.ts, swap the token block at the top of src/styles.css, and replace the mark in src/components/brand.tsx. Nothing else hardcodes the brand.',
  },
] as const

export const Route = createFileRoute('/faq')({
  head: () =>
    seoHead({
      title: 'FAQ',
      path: '/faq',
      description: `Common questions about running, extending and deploying ${site.name}.`,
      jsonLd: faqJsonLd(faqs),
    }),
  component: FaqPage,
})

function FaqPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="FAQ"
        title="Questions we actually get asked."
        description="If something is missing here, the contact form goes straight to a human."
      />

      <div className="nj-shell max-w-3xl pb-16">
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <div className="mt-14 flex flex-col items-start gap-4 rounded-xl border border-border bg-card/60 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-pretty">Still stuck? Send us the details.</p>
          <Button asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </MarketingShell>
  )
}
