import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from 'convex/react'
import { CheckCircle2Icon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '#convex/_generated/api'
import { MarketingShell, PageHeader } from '#/components/marketing-shell'
import { Reveal } from '#/components/motion/reveal'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { seoHead } from '#/lib/seo'
import { site } from '#/lib/site'

export const Route = createFileRoute('/contact')({
  head: () =>
    seoHead({
      title: 'Contact',
      path: '/contact',
      description: `Get in touch with the ${site.name} team.`,
    }),
  component: ContactPage,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FieldError({ errors }: { errors: Array<unknown> }) {
  const message = errors.find((error): error is string => typeof error === 'string')
  if (!message) return null
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const submit = useMutation(api.contact.submit)

  const form = useForm({
    defaultValues: { name: '', email: '', message: '' },
    onSubmit: async ({ value }) => {
      try {
        await submit(value)
        setSent(true)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message.replace(/^\[.*?]\s*/, '')
            : 'Could not send your message',
        )
      }
    },
  })

  return (
    <MarketingShell>
      <PageHeader
        kicker="Contact"
        title="Tell us what you are building."
        description="Support, sales or a bug report — it all lands in the same inbox and a human reads it."
      />

      <div className="nj-shell grid gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          {sent ? (
            <div className="flex flex-col items-start rounded-xl border border-primary/40 bg-card/60 p-8">
              <CheckCircle2Icon className="size-7 text-primary" />
              <h2 className="mt-5 text-2xl font-semibold">Message sent.</h2>
              <p className="mt-2 text-muted-foreground">
                We reply to everything within one business day.
              </p>
              <Button
                variant="outline"
                className="mt-7"
                onClick={() => {
                  form.reset()
                  setSent(false)
                }}
              >
                Send another
              </Button>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    value.trim().length < 2 ? 'Please enter your name' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Ada Lovelace"
                      className="mt-2"
                      autoComplete="name"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) =>
                    EMAIL_RE.test(value.trim()) ? undefined : 'Enter a valid email address',
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="ada@example.com"
                      className="mt-2"
                      autoComplete="email"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="message"
                validators={{
                  onBlur: ({ value }) =>
                    value.trim().length < 10 ? 'Give us at least a sentence' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Message</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={7}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="What are you working on?"
                      className="mt-2 resize-none"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" size="lg" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
                    Send message
                  </Button>
                )}
              </form.Subscribe>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.08} className="h-fit rounded-xl border border-border bg-card/60 p-7">
          <p className="nj-kicker">Other ways in</p>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Response time</dt>
              <dd className="mt-1">One business day on every plan.</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Security reports</dt>
              <dd className="mt-1">
                Prefix the subject with <code className="font-mono text-xs">[security]</code> and we
                escalate immediately.
              </dd>
            </div>
          </dl>
          <p className="mt-7 text-xs leading-relaxed text-muted-foreground">
            Submissions are rate limited per sender. Delivery uses Resend; with no API key set the
            message is still stored in Convex so nothing is lost while you are setting up.
          </p>
        </Reveal>
      </div>
    </MarketingShell>
  )
}
