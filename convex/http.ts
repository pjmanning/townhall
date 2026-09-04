import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

/**
 * Stripe webhook endpoint: https://<your-deployment>.convex.site/stripe/webhook
 *
 * The route stays thin — signature verification and the Stripe SDK live in the
 * Node action so this handler runs in the default runtime.
 */
http.route({
  path: '/stripe/webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get('stripe-signature')
    if (!signature) return new Response('Missing stripe-signature header', { status: 400 })

    const payload = await request.text()

    try {
      const result = await ctx.runAction(internal.stripe.handleWebhook, { payload, signature })
      return Response.json(result, { status: 200 })
    } catch (error) {
      console.error('[stripe] webhook failed:', error)
      return new Response('Webhook error', { status: 400 })
    }
  }),
})

export default http
