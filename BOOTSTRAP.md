# BOOTSTRAP.md

Day-0 playbook for turning this template into a **new product**.

Agents: complete this before writing product features, marketing copy for a
different brand, or new Convex domain tables. Humans: same order.

If you are only fixing or extending Nightjar itself, skip to
[`AGENTS.md`](./AGENTS.md).

---

## Goal

End state of Day 0:

- Repo is named for the product (not `web-template` / Nightjar leftovers)
- Brand, tokens, and OG assets match the new product
- Local Convex + Clerk unlock `/login` and `/app`
- Marketing site boots with zero optional keys
- `pnpm run check` passes

Do **not** add Stripe, Resend, Sentry, PostHog, or Featurebase until the product
shell works. Do **not** invent Next.js patterns, a second database, or Worker
application routes — see [`AGENTS.md`](./AGENTS.md).

---

## 0. Confirm you are in the right tree

```bash
pwd   # …/Projects/<product-name>
test -f AGENTS.md && test -f DESIGN.md && test -f package.json
```

If this folder is still a clone of the template with Nightjar branding, treat
everything below as required. If the user already rebranded, verify steps 2–4
and jump to step 5.

---

## 1. Install and env skeleton

```bash
pnpm install
cp -n .env.example .env.local   # do not overwrite an existing .env.local
```

Only `VITE_CONVEX_URL` and `VITE_CLERK_PUBLISHABLE_KEY` are required for `/app`.
Leave Stripe / Resend / Sentry / PostHog / Featurebase blank.

---

## 2. Rename the host package

| File                      | Change                                               |
| ------------------------- | ---------------------------------------------------- |
| `package.json` → `name`   | Product slug (e.g. `acme`)                           |
| `wrangler.jsonc` → `name` | Same slug — becomes `<name>.<subdomain>.workers.dev` |

Do not rename the git remote unless the user asks.

---

## 3. Rebrand (four files, then assets)

Order matters. Keep tokens and prose in sync.

1. **`DESIGN.md`** — new name in front matter; update colors/type only if the
   product identity changes. If keeping Nightjar’s look, still rename the
   product in Overview.
2. **`src/styles.css`** — mirror any token or font changes from `DESIGN.md`.
3. **`src/lib/site.ts`** — `name`, `tagline`, `description`, `contactEmail`,
   `twitter`, and later `VITE_SITE_URL`.
4. **`src/components/brand.tsx`** — `BrandMark` + `Wordmark`.

Then:

5. **`public/favicon.svg`** and **`public/og.svg`**
6. `pnpm run og` → regenerates `public/og.png`
7. Grep for leftover `Nightjar` / `nightjar` in user-facing strings and replace
   (routes, MDX demo post title/body, legal placeholders, theme storage key in
   `src/lib/theme.tsx` if you want a clean localStorage namespace).

Read [`DESIGN.md`](./DESIGN.md) before any UI beyond this rename.

---

## 4. Convex (required)

```bash
npx convex dev
```

- Creates/links a **dev** deployment and writes `CONVEX_*` / `VITE_CONVEX_*`
  into `.env.local`.
- Leave it running while developing; it pushes `convex/` on save.
- **Never** run `npx convex deploy` during bootstrap — that is production.

Use a real Convex account for the new product. Do not reuse another project’s
deployment URLs.

---

## 5. Clerk (required for `/app`)

1. Create a Clerk application (same app can serve Expo/native later).
2. `.env.local`:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_…
   CLERK_SECRET_KEY=sk_test_…
   ```

3. Clerk Dashboard → **JWT Templates** → **New** → **Convex**. Template name
   must be exactly `convex`.
4. Copy the Issuer URL into Convex:

   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev
   ```

5. Restart `pnpm dev`. Sign up at `/login`. Confirm a row appears in the Convex
   `users` table and `/app` loads.

Without Clerk, `/login` and `/app` must show the existing setup stubs — do not
bypass them with fake auth.

---

## 6. Boot and smoke

```bash
pnpm run dev:all    # or: npx convex dev  +  pnpm dev
```

Open http://localhost:3000 and verify:

| Route           | Expect                                         |
| --------------- | ---------------------------------------------- |
| `/`             | New brand in header + hero                     |
| `/pricing`      | Plans render (checkout may error until Stripe) |
| `/blog`         | Demo post or replaced content                  |
| `/login`        | Clerk widgets (not the setup notice)           |
| `/app`          | Authenticated shell, not “setup required”      |
| `/app/settings` | Profile stub + billing empty state             |

```bash
pnpm run check
```

---

## 7. Optional integrations (later)

Wire only when needed. Each degrades when unset — see `.env.example` and the
README clone checklist.

| Integration                         | When                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| `VITE_SITE_URL` + Convex `SITE_URL` | Before production build / Stripe redirects                |
| Stripe price IDs + webhook          | Real checkout                                             |
| Resend                              | Deliver contact form email (Convex still stores messages) |
| Sentry / PostHog                    | Observability                                             |
| Featurebase                         | Footer feedback / changelog / help links                  |

---

## 8. First product work (only after 1–6)

Allowed next steps, in typical order:

1. Replace marketing copy and the demo MDX post with product-real content.
2. Add Convex tables + functions for the product domain (`schema` + indexes
   first).
3. Build UI under `/app/**` using existing shell / shadcn / tokens.
4. Then billing, email, and analytics if the user asked for them.

Still forbidden without an explicit ask: i18n, cookie CMP, waitlist, Stripe
Connect, `app.` subdomain, RevenueCat on web, Clerk Organizations, third-party
SEO tools. Full list in [`AGENTS.md`](./AGENTS.md).

---

## Agent checklist (paste into the PR / session notes)

- [ ] `package.json` + `wrangler.jsonc` renamed
- [ ] `site.ts`, `brand.tsx`, `DESIGN.md`, `styles.css` updated; OG regenerated
- [ ] No stray user-facing “Nightjar” (unless intentionally keeping the brand)
- [ ] `npx convex dev` linked; `VITE_CONVEX_URL` set
- [ ] Clerk keys + `CLERK_JWT_ISSUER_DOMAIN` set; `/app` works signed-in
- [ ] `pnpm run check` clean
- [ ] Read `AGENTS.md` + `DESIGN.md` before feature code
