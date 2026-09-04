# AGENTS.md

Instructions for AI agents and humans working in this repository. Read this file
and `DESIGN.md` before writing code.

**New product from this template?** Complete [`BOOTSTRAP.md`](./BOOTSTRAP.md)
first (rename, rebrand, Convex, Clerk, smoke). Do not skip ahead to feature work
while the repo still says Nightjar / `web-template`, or while `/app` is blocked
on missing keys.

---

## What this is

A reusable starter for web SaaS products. The stack is deliberately locked so
that every clone looks the same and decisions are not re-litigated per project.

| Concern       | Choice                                              |
| ------------- | --------------------------------------------------- |
| Framework     | TanStack Start (React) + Router + Query + Form      |
| Host          | Cloudflare Workers                                  |
| Database      | Convex                                              |
| Auth          | Clerk                                               |
| Billing       | Stripe Checkout + Customer Portal + Convex webhooks |
| Email         | Resend                                              |
| UI            | Tailwind v4 + shadcn/ui + Motion (`motion/react`)   |
| Observability | Sentry + PostHog                                    |
| Content       | MDX in-repo                                         |
| Feedback      | Featurebase (optional, env-gated)                   |

---

## Hard rules

### 1. TanStack-first

Prefer a TanStack API over a third-party or hand-rolled one. Reach outside the
ecosystem only when there is a real gap, and say why in a comment.

| Need                      | Use                                                | Not                              |
| ------------------------- | -------------------------------------------------- | -------------------------------- |
| Routing, layouts, 404     | TanStack Router file routes                        | a custom router, `<Switch>`      |
| Server data + cache       | TanStack Query (+ `@convex-dev/react-query`)       | `useEffect` + `fetch`, SWR       |
| Forms + validation        | TanStack Form (+ Zod on the schema)                | react-hook-form, Formik          |
| Server-side work          | Start server functions / `createServerFn`          | a Workers route, an API folder   |
| Meta tags, canonical, OG  | route `head` via `seoHead()` in `src/lib/seo.ts`   | next-seo, react-helmet           |
| Static HTML for marketing | `tanstackStart({ prerender })` in `vite.config.ts` | a separate SSG step              |
| Sitemap                   | `tanstackStart({ sitemap: { enabled, host } })`    | a sitemap package                |
| Search params as state    | Router `validateSearch` + `useSearch`              | `useState` + `history.pushState` |

### 2. Convex is the only database

Every read and write goes through `convex/`. Do not add D1, KV, Durable
Objects, Postgres, Prisma, or Drizzle. If data needs to be stored, it becomes a
Convex table with an index.

### 3. Cloudflare is a host, not a second backend

`wrangler.jsonc` exists to serve the Start server entry. Do not add Worker
routes, bindings, or queues that hold application logic. Server-side logic lives
in Convex functions or Start server functions.

### 4. Do not invent Next.js patterns

There is no `app/`, no `pages/`, no `next.config`, no `"use server"`, no
`next/image`, no `next/font`, no `next-themes`, no route handlers. If a snippet
you are copying mentions any of those, translate it to the TanStack equivalent
before using it. Theme handling already exists in `src/lib/theme.tsx`.

### 5. Read `DESIGN.md` before UI work

Colors, type scale, spacing, radii, elevation and component conventions are
specified there and implemented as CSS variables in `src/styles.css`. Use tokens
(`bg-card`, `text-muted-foreground`, `border-border`), never raw hex. Add new
tokens to both files if genuinely needed.

### 6. The product lives at `/app`

Path-based, not a subdomain. `app.` is explicitly out of scope for v1. Marketing
routes are SSR + prerendered; `/app/**` sets `ssr: false` because everything
inside it is per-user.

### 7. Optional integrations must degrade, never crash

Stripe, Resend, Sentry, PostHog and Featurebase are all optional. A fresh clone
with only Convex and Clerk keys must build, boot, prerender and pass typecheck.
Gate on the flags in `src/lib/env.ts` (client) or `process.env` presence
(Convex), and render a useful empty state instead of throwing.

Only `VITE_CONVEX_URL` and `VITE_CLERK_PUBLISHABLE_KEY` are required for the
product shell. The marketing site runs with nothing set at all.

### 8. Billing is Stripe on web

Stripe Checkout for purchase, Customer Portal for management, Convex HTTP
webhooks for state. No RevenueCat on web — that is for native clients if you add
them later.

---

## Convex conventions

Enforced by `@convex-dev/eslint-plugin`; the rules exist because the failures are
silent otherwise.

- **Validators on everything public.** Every `query`, `mutation` and `action`
  declares `args` _and_ `returns`.
- **`await` every promise.** `ctx.db.*`, `ctx.scheduler.*`, `ctx.runMutation`.
- **Auth check on any user data.** Use `requireUser(ctx)` from
  `convex/lib/auth.ts`; it throws when there is no identity.
- **Indexes, not `.filter()`.** Declare the index in `convex/schema.ts` and use
  `.withIndex()`. `.filter()` is a table scan.
- **Never `Date.now()` in a query.** It breaks caching and reactivity. Pass the
  time in as an argument, or use a mutation.
- **Schedule `internal.*`, never `api.*`.** Public functions expect a client
  identity that a scheduled call does not have.
- **Rate-limit public mutations.** Anything callable without auth (contact form)
  goes through `convex/rateLimits.ts`.
- **`"use node"` files hold actions only** — no queries or mutations in them.

Development uses `npx convex dev`. Do not run `npx convex deploy` during setup;
that targets production.

---

## Layout

```
convex/                 Database, auth, billing, email. The only backend.
  schema.ts             Tables + indexes
  lib/auth.ts           getCurrentUser / requireUser
  users.ts              Clerk → Convex identity sync
  contact.ts            Public contact mutation (rate limited) + Resend action
  stripe.ts             Checkout, Customer Portal, webhook processing
  billing.ts            Internal billing-state readers/writers
  http.ts               HTTP router — Stripe webhook endpoint
  rateLimits.ts         Rate limiter configuration

src/
  routes/               File-based routes. Marketing at root, product under app.*
  components/
    ui/                 shadcn primitives — regenerate, don't hand-edit
    marketing/          Landing sections
    app/                Product-shell pieces
    motion/             Shared Motion wrappers (Reveal)
  lib/
    site.ts             Brand, nav, optional integration config
    seo.ts              seoHead() + JSON-LD builders
    env.ts              Client env + isXConfigured flags
    theme.tsx           Theme provider + pre-paint script
    plans.ts            Pricing plan definitions
    use-auth.ts         Clerk hooks that survive Clerk being unconfigured
  content/blog/         MDX posts
  integrations/         Provider composition, PostHog, Sentry
```

---

## Adding things

**A marketing page.** Create `src/routes/<name>.tsx`, wrap in `MarketingShell`,
add a `head: () => seoHead({ title, path })`. It is prerendered and added to the
sitemap automatically. Add it to `nav` in `src/lib/site.ts` if it belongs there.

**A product page.** Create `src/routes/app.<name>.tsx`. It inherits the auth
guard and `ssr: false` from `src/routes/app.tsx`. Add it to `appNav` there.

**A blog post.** Drop an `.mdx` file in `src/content/blog/` with frontmatter
(`title`, `description`, `date`, `author`, `tags`, `readingTime`). The loader in
`src/content/blog.ts` picks it up; `crawlLinks` prerenders it.

**A shadcn component.** `pnpm dlx shadcn@latest add <name>`. It lands in
`src/components/ui/` already wired to the design tokens.

**A Convex table.** Add it to `convex/schema.ts` _with its indexes_, then write
functions in a new `convex/<domain>.ts`.

**A price.** Add the plan to `src/lib/plans.ts` and the Stripe price ID to the
Convex environment as `STRIPE_PRICE_<PLAN>_<INTERVAL>`.

---

## Before you finish

```bash
pnpm run check     # prettier + eslint + tsc (app and convex)
pnpm run build     # includes prerender and sitemap generation
```

Both must pass. If you touched UI, look at the page in a browser — the design
depends on motion and gradients that do not show up in a diff.

---

## Out of scope for v1

Do not add these without being asked: i18n, cookie consent management, a status
page, a waitlist, Stripe Connect, Mapbox, Mintlify, required Featurebase, an
`app.` subdomain, RevenueCat on web, Clerk Organizations, third-party SEO tools.
