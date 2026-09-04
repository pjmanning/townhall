import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAction, useMutation, useQuery } from 'convex/react'
import { CreditCardIcon, ExternalLinkIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '#convex/_generated/api'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Skeleton } from '#/components/ui/skeleton'
import { seoHead } from '#/lib/seo'
import { useAppUser, useSignOut } from '#/lib/use-auth'

export const Route = createFileRoute('/app/settings')({
  head: () => seoHead({ title: 'Settings', path: '/app/settings', noindex: true }),
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <p className="nj-kicker">Settings</p>
      <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Account</h1>
      <p className="mt-2 text-muted-foreground">
        Profile, subscription and account deletion. Two of the three are stubs — they are marked.
      </p>

      <div className="nj-rule mt-10" />

      <div className="mt-12 space-y-6">
        <ProfileSection />
        <BillingSection />
        <DangerSection />
      </div>
    </div>
  )
}

function SettingsCard({
  title,
  description,
  badge,
  children,
  footer,
  tone = 'default',
}: {
  title: string
  description: string
  badge?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  tone?: 'default' | 'danger'
}) {
  return (
    <section
      className={`rounded-xl border bg-card/60 ${tone === 'danger' ? 'border-destructive/40' : 'border-border'}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </div>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

/**
 * Stub: Clerk owns the profile record, so a real implementation opens
 * `<UserProfile />` or calls `user.update()` rather than writing to Convex.
 */
function ProfileSection() {
  const { fullName, primaryEmail, imageUrl } = useAppUser()

  return (
    <SettingsCard
      title="Profile"
      description="Your identity comes from Clerk. This form is read-only in the starter."
      badge="Stub"
      footer={
        <>
          <p className="text-xs text-muted-foreground">
            Wire this to Clerk&apos;s <code className="font-mono">UserProfile</code> component or
            the Clerk API.
          </p>
          <Button variant="outline" size="sm" disabled>
            Edit profile
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {imageUrl ? <AvatarImage src={imageUrl} alt="" /> : null}
          <AvatarFallback>{(fullName ?? 'You').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" value={fullName ?? ''} readOnly className="mt-2" />
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={primaryEmail ?? ''} readOnly className="mt-2" />
          </div>
        </div>
      </div>
    </SettingsCard>
  )
}

const statusLabels: Record<string, string> = {
  none: 'No subscription',
  trialing: 'Trialing',
  active: 'Active',
  past_due: 'Payment failed',
  canceled: 'Canceled',
  incomplete: 'Incomplete',
}

function BillingSection() {
  const user = useQuery(api.users.current)
  const createPortalSession = useAction(api.stripe.createPortalSession)
  const [pending, setPending] = useState(false)

  async function openPortal() {
    setPending(true)
    try {
      const { url } = await createPortalSession({})
      window.location.href = url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not open the billing portal')
    } finally {
      setPending(false)
    }
  }

  const plan = user?.plan ?? 'free'
  const status = user?.subscriptionStatus ?? 'none'

  return (
    <SettingsCard
      title="Subscription"
      description="Upgrades, payment methods and invoices are handled by the Stripe Customer Portal."
      badge={user === undefined ? undefined : plan === 'free' ? 'Free' : plan.toUpperCase()}
      footer={
        <>
          <p className="text-xs text-muted-foreground">
            {user?.hasBillingAccount
              ? 'Opens Stripe in this tab and returns you here.'
              : 'A Stripe customer is created the first time you check out.'}
          </p>
          <Button size="sm" disabled={pending} onClick={() => void openPortal()}>
            {pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <CreditCardIcon className="size-4" />
            )}
            Manage billing
            <ExternalLinkIcon className="size-3.5 opacity-60" />
          </Button>
        </>
      }
    >
      {user === undefined ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Plan</dt>
            <dd className="mt-1 font-medium capitalize">{plan}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium">{statusLabels[status] ?? status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">
              {user?.cancelAtPeriodEnd ? 'Access until' : 'Renews'}
            </dt>
            <dd className="mt-1 font-medium">
              {user?.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString() : '—'}
            </dd>
          </div>
        </dl>
      )}
    </SettingsCard>
  )
}

/**
 * Stub: deletes the Convex row only. A real implementation cancels the Stripe
 * subscription and deletes the Clerk user from a `"use node"` action first.
 */
function DangerSection() {
  const deleteAccount = useMutation(api.users.deleteAccount)
  const signOut = useSignOut()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  async function confirmDelete() {
    setPending(true)
    try {
      await deleteAccount({})
      toast.success('Account data deleted')
      await signOut('/')
      await navigate({ to: '/' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete the account')
    } finally {
      setPending(false)
    }
  }

  return (
    <SettingsCard
      title="Delete account"
      description="Removes your application data. This cannot be undone."
      badge="Stub"
      tone="danger"
      footer={
        <>
          <p className="text-xs text-muted-foreground">
            The starter deletes the Convex record only — extend it to cancel Stripe and delete the
            Clerk user.
          </p>
          {confirming ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() => void confirmDelete()}
              >
                {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Yes, delete everything
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
              Delete account
            </Button>
          )}
        </>
      }
    />
  )
}
