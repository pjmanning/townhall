# Townhall

Small-town local government transparency — budgets, staff, debt, and a community
board residents can actually read.

Seeded from [pjmanning/web-template](https://github.com/pjmanning/web-template)
(**TanStack Start** · **Convex** · **Clerk** · **Cloudflare Workers** ·
**Tailwind + shadcn/ui**).

## Routes

| Path             | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `/`              | Home — brand, tagline, links into civic pages          |
| `/budget`        | Appropriations and year-to-date spend by department    |
| `/staff`         | Department directory with contacts                     |
| `/debt`          | Outstanding bond issues and annual debt service        |
| `/community`     | Public community board (read surface; posting stubbed) |
| `/admin`         | Staff admin stub                                       |
| `/app`, `/login` | Template product shell (needs Convex + Clerk)          |

Demo data lives in `src/lib/town-data.ts` (Millbrook / FY 2026).

## Quick start

```bash
pnpm install
cp .env.example .env.local

# Optional — product shell at /app
npx convex dev

pnpm dev
```

App: [http://127.0.0.1:43125](http://127.0.0.1:43125)

Marketing pages run with no keys. `/app` and posting on the community board need
Convex + Clerk — see `BOOTSTRAP.md` and `.env.example`.

## Scripts

| Command            | Does                                        |
| ------------------ | ------------------------------------------- |
| `pnpm dev`         | Dev server on :43125                        |
| `pnpm run dev:all` | App + Convex in parallel                    |
| `pnpm run check`   | Prettier + ESLint + `tsc`                   |
| `pnpm run build`   | Production build + prerender                |
| `pnpm run og`      | Rasterize `public/og.svg` → `public/og.png` |

## Repos

- GitHub: https://github.com/pjmanning/townhall
- Origin: use Cursor **Create repo** and name it `townhall`, then mirror with
  `origin repo create-mirrored pjmanning/townhall` (this cloud session’s Origin
  token can only push to the session remote).

## License

MIT. Replace legal pages before shipping to real residents.
