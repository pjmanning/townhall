import { createFileRoute } from '@tanstack/react-router'

import { LegalDocument } from '#/components/legal-document'
import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/privacy')({
  head: () =>
    seoHead({
      title: 'Privacy Policy',
      path: '/privacy',
      description: `How ${site.name} collects, uses and stores personal data.`,
    }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Legal"
        title="Privacy Policy"
        description="Last updated: 1 January 2026"
      />
      <LegalDocument>
        <p>
          This is starter copy. Replace it with a policy reviewed by your own counsel before you
          take real customers. It is written to describe the data flows this template actually
          creates, so it is a useful starting outline rather than a blank page.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account data.</strong> Your name, email address and avatar, provided by Clerk
            when you sign in and mirrored into our Convex database.
          </li>
          <li>
            <strong>Billing data.</strong> Subscription status and plan. Card details are handled
            entirely by Stripe and never touch our servers.
          </li>
          <li>
            <strong>Product analytics.</strong> Page views and feature usage via PostHog, tied to
            your account only once you sign in.
          </li>
          <li>
            <strong>Diagnostics.</strong> Error reports via Sentry, with request bodies and user
            details excluded by default.
          </li>
          <li>
            <strong>Messages you send us.</strong> Anything submitted through the contact form,
            delivered by Resend and retained so we can reply.
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <p>
          To operate the service, bill you correctly, respond to support requests, and understand
          which parts of the product are used. We do not sell personal data.
        </p>

        <h2>Where it lives</h2>
        <p>
          Application data is stored in Convex. Authentication is handled by Clerk, payments by
          Stripe, email delivery by Resend, analytics by PostHog and error tracking by Sentry. Each
          of these processors has its own privacy commitments.
        </p>

        <h2>Retention</h2>
        <p>
          Account records are kept while your account is active. Deleting your account removes your
          application record; billing records are retained where required by law.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access, correction, export or deletion of your data at any time by writing
          to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies that are strictly necessary for authentication, plus analytics cookies from
          PostHog. This template does not ship a consent management platform — add one before
          serving users in jurisdictions that require it.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes materially we will notify account holders by email before the
          change takes effect.
        </p>
      </LegalDocument>
    </MarketingShell>
  )
}
