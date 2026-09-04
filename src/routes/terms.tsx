import { createFileRoute } from '@tanstack/react-router'

import { LegalDocument } from '#/components/legal-document'
import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/terms')({
  head: () =>
    seoHead({
      title: 'Terms of Service',
      path: '/terms',
      description: `The agreement between you and ${site.name}.`,
    }),
  component: TermsPage,
})

function TermsPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Legal"
        title="Terms of Service"
        description="Last updated: 1 January 2026"
      />
      <LegalDocument>
        <p>
          Starter copy — have a lawyer review this before you charge anyone. The structure below
          covers the obligations a subscription product typically needs.
        </p>

        <h2>1. Agreement</h2>
        <p>
          By creating an account you agree to these terms. If you are accepting on behalf of a
          company, you confirm you have the authority to bind it.
        </p>

        <h2>2. Your account</h2>
        <p>
          You are responsible for activity under your account and for keeping your credentials
          secure. Tell us promptly if you suspect unauthorised access.
        </p>

        <h2>3. Acceptable use</h2>
        <p>
          Do not use the service to break the law, infringe someone else&apos;s rights, send
          unsolicited email, or attempt to disrupt or reverse engineer the platform.
        </p>

        <h2>4. Subscriptions and billing</h2>
        <p>
          Paid plans renew automatically at the interval you selected until cancelled. Cancellation
          takes effect at the end of the current billing period, and you keep access until then.
          Payments are processed by Stripe and are subject to their terms.
        </p>

        <h2>5. Refunds</h2>
        <p>
          Charges are non-refundable except where required by law. If something went genuinely
          wrong, contact us and we will look at it.
        </p>

        <h2>6. Availability</h2>
        <p>
          We aim for high availability but do not guarantee uninterrupted service on plans without
          an explicit SLA. Planned maintenance is announced in advance where practical.
        </p>

        <h2>7. Your content</h2>
        <p>
          You keep ownership of everything you upload. You grant us the limited licence needed to
          host, process and display it in order to operate the service.
        </p>

        <h2>8. Termination</h2>
        <p>
          You may close your account at any time. We may suspend or terminate accounts that breach
          these terms, with notice where reasonable.
        </p>

        <h2>9. Liability</h2>
        <p>
          To the maximum extent permitted by law, our aggregate liability is limited to the amount
          you paid in the twelve months before the claim.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms go to{' '}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </LegalDocument>
    </MarketingShell>
  )
}
