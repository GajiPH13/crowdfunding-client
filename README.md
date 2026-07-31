# CrowdfundX — Client

Frontend for **CrowdfundX**, a modern crowdfunding platform. Built with Next.js 16 (App Router) and React 19.

> **Status:** MVP in development. Phases 1–4 (project init, Better Auth, UI Foundation, Landing Page) are done. See `PLAN.md` for the full roadmap.

Related repo: [crowdfunding-server](https://github.com/GajiPH13/crowdfunding-server) (Express.js + MongoDB API)

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- HeroUI v3 (`@heroui/react` + `@heroui/styles`, React Aria–based, no Provider needed)
- React Icons (brands/social icons)
- Gravity UI Icons (dashboard/navigation icons)
- TanStack Query
- React Hook Form
- Zod
- Axios

---

## Features

**Done:**

- Login (`/login`) and register (`/register`) pages using Better Auth's email/password + Google OAuth
- `src/lib/auth-client.ts` — Better Auth React client (`useSession`, `signIn`, `signUp`, `signOut`); no context provider needed, since Better Auth's hook isn't Context-based
- Protected routes via `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`): optimistic cookie-presence redirect for `/dashboard`, redirects logged-in users away from `/login`/`/register`
- Placeholder `/dashboard` page proving the auth flow end-to-end (the real dashboard shell is Phase 5)
- `src/components/ui` — reusable components: `Button`, `Card`, `Input`, `Modal`, `Avatar`, `Table`, `Dropdown` (re-exported from HeroUI v3) and a hand-built compound `Navbar` (`Navbar.Brand`/`Navbar.Content`/`Navbar.Item`) since HeroUI v3 doesn't ship one
- Icon convention wired up: React Icons for brand/social icons (e.g. the Google button), `@gravity-ui/icons` for dashboard/navigation icons (e.g. the dashboard header)
- `(public)` route group layout — real `SiteNavbar` (Logo, Campaigns link, Login/Register when signed out, Dashboard link + avatar/dropdown menu when signed in)
- `(dashboard)` route group layout — minimal header (full sidebar shell is Phase 5)
- Landing page (`/`): Hero (headline + CTAs), Featured Campaigns (mock data — real API is Phase 6), How It Works, Categories, Why Choose Us, Footer — see `src/components/landing/`

**Planned:**

- Role-based navigation (Supporter / Creator / Admin)
- Campaign pages: list, details, create, edit
- Contribution form with validation and success state
- Admin UI: user list + role management, campaign list + delete
- Global error/loading pages, toast notifications, empty states
- Reusable Axios client with auth interceptors

Full task-by-task breakdown lives in [`PLAN.md`](../PLAN.md).

---

## Project Structure

```text
src/
  app/
    (public)/
      layout.tsx         # SiteNavbar wrapper
      page.tsx           # landing page — composes the sections below
      login/page.tsx
      register/page.tsx
    (dashboard)/
      layout.tsx         # minimal header (Phase 5 replaces with full shell)
      dashboard/page.tsx # placeholder protected page
  components/
    ui/
      index.ts           # re-exports HeroUI primitives + our Navbar
      navbar.tsx          # compound Navbar (Root/Brand/Content/Item)
    site-navbar.tsx       # the real, auth-aware navbar used in (public)/layout.tsx
    landing/
      hero.tsx
      featured-campaigns.tsx  # mock campaign data — Phase 6 replaces with a real fetch
      how-it-works.tsx
      categories.tsx
      why-choose-us.tsx
      footer.tsx
  lib/
    auth-client.ts        # Better Auth React client
  proxy.ts                 # Next.js 16 proxy (replaces middleware.ts) — protects /dashboard
```

Route groups `(public)`/`(dashboard)` don't affect URLs — `/`, `/login`, `/register`, `/dashboard` are unchanged.

**Styling a `<Link>` as a button:** use `buttonVariants({ variant, size })` from `@heroui/styles` on a Next `<Link>` (see `hero.tsx`) — `@heroui/react`'s `Button` doesn't support `href`. Note `globals.css` has a small override for this: `@heroui/styles` ships an unlayered `a { background-color: transparent }` reset that otherwise wins over the (layered) `.button` styles on any anchor, per CSS Cascade Layers rules.

Further feature-based structure (`components/`, `features/`, shared `types/`) will grow as later phases add campaigns, contributions, and admin UI.

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # then point these at your running crowdfunding-server
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npm run format
```

---

## Environment Variables

| Variable                      | Description                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`         | Base URL of the `crowdfunding-server` API                                                                                    |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Base URL of the `crowdfunding-server` API (Better Auth is mounted there — same value as `NEXT_PUBLIC_API_URL` in this setup) |

Google OAuth doesn't need any client-side env var — `signIn.social({ provider: "google" })` just redirects to the server, which holds the Google client ID/secret.

---

## Roadmap

Frontend-relevant phases from `PLAN.md`:

1. Project Initialization — Next.js app setup (TypeScript, Tailwind v4, ESLint, Prettier)
2. Better Auth — login/register pages, session provider, protected routes
3. UI Foundation — HeroUI components, icon libraries, public/dashboard layouts
4. Landing Page — Navbar, Hero, Featured Campaigns, extra sections
5. Dashboard — shell, role-based navigation
6. Campaign Module — campaign UI (list/details/create/edit)
7. Contributions — contribution form UI
8. Admin — users page, campaign management UI
9. State Management — TanStack Query setup
10. Forms — React Hook Form + Zod
11. Error Handling — error/loading pages, toasts, empty states
12. API Layer — reusable Axios client
13. Deployment — Vercel

**Future (Phase 2, not in MVP):** Stripe payments, credits system, notifications, image uploads, email notifications, pagination.

---

## Development Conventions

- TypeScript everywhere, strict mode.
- Prefer server components; use client components only when necessary.
- Reuse existing components before creating new ones.
- Validate all inputs with Zod.
- Handle loading, empty, and error states for every page.
- One task at a time, no TODOs left in completed work.
- Ensure the app builds and lints cleanly before moving to the next task.

See [`PLAN.md`](../PLAN.md) for the full AI coding guidelines and definition of done.
