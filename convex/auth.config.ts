export default {
  providers: [
    {
      // Must match the Clerk JWT template named "convex".
      // Set via: npx convex env set CLERK_JWT_ISSUER_DOMAIN https://…clerk.accounts.dev
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
}
