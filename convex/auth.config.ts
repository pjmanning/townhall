/**
 * Clerk is the identity provider for every client (web today, native later).
 *
 * CLERK_JWT_ISSUER_DOMAIN must be set in the Convex deployment before
 * `npx convex dev` will push — it is the Issuer URL of the Clerk JWT template
 * named "convex":
 *
 *   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
}
