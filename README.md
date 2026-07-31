# CrowdfundX — Client

Frontend for **CrowdfundX**, a modern crowdfunding platform. Built with Next.js 16 (App Router) and React 19.

> **Status:** MVP in development. Phases 1–9 (project init, Better Auth, UI Foundation, Landing Page, Dashboard, Campaign Module, Contributions, Admin, State Management) are done. See `PLAN.md` for the full roadmap.

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
- `src/components/ui` — reusable components: `Button`, `Card`, `Input`, `Modal`, `Avatar`, `Table`, `Dropdown`, `Drawer`, `Breadcrumbs` (re-exported from HeroUI v3) and a hand-built compound `Navbar` (`Navbar.Brand`/`Navbar.Content`/`Navbar.Item`) since HeroUI v3 doesn't ship one
- Icon convention wired up: React Icons for brand/social icons (e.g. the Google button), `@gravity-ui/icons` for dashboard/navigation icons (e.g. the dashboard header)
- `(public)` route group layout — real `SiteNavbar` (Logo, Campaigns link, Login/Register when signed out, Dashboard link + avatar/dropdown menu when signed in)
- Landing page (`/`): Hero (headline + CTAs), Featured Campaigns (now a real fetch to `crowdfunding-server`, see below), How It Works, Categories, Why Choose Us, Footer — see `src/components/landing/`
- Dashboard shell (`(dashboard)/layout.tsx`): desktop sidebar + mobile drawer nav (`src/components/dashboard/`), header with breadcrumb + user menu, role-based nav items (Supporter/Creator/Admin — see `nav-items.ts`) driven by `session.user.role`
- Shared `UserMenu` (`src/components/user-menu.tsx`) — avatar + dropdown with name/email/Log out, used in both the site navbar and the dashboard header
- Campaign UI: public `/campaigns` (list) and `/campaigns/[id]` (details) — Server Components fetching straight from the API, no client-side loading state needed; `/dashboard/campaigns` (my campaigns, client-rendered, `?creator=<id>` filtered) with Create/Edit/Delete; shared `CampaignCard` (`src/components/campaign-card.tsx`) used by all three list views; shared `CampaignForm` (`src/components/dashboard/campaign-form.tsx`) used by both create and edit pages. Forms use plain `useState` (React Hook Form + Zod is Phase 10, not yet adopted) with HeroUI's `Input`/`TextArea`/`Button`.
- `src/lib/api.ts` — thin `apiFetch()` wrapper (base URL + `credentials: "include"`) used for all campaign and contribution API calls; the reusable Axios client is still Phase 12
- Contribution UI: `ContributeForm` (`src/components/contribute-form.tsx`) embedded in the campaign details page — prompts login if signed out, validates the amount, shows a success state, and calls `router.refresh()` so the campaign's raised-amount progress bar updates immediately without a full reload. `/dashboard/contributions` lists the current user's contributions (campaign title/category/amount/date, via the server's `$lookup`-joined response) with a link back to each campaign.
- Admin UI: `/dashboard/admin/users` (list + change role via a native `<select>`) and `/dashboard/admin/campaigns` (list all + delete, reusing `CampaignCard`) — both gated by a shared `(dashboard)/dashboard/admin/layout.tsx` that shows "You don't have access to this page" for non-admins. **No new server endpoints were needed**: users list/role-change call Better Auth's own admin plugin endpoints directly (`/api/auth/admin/list-users`, `/api/auth/admin/set-role`, already mounted and permission-checked by Better Auth itself), and campaign management reuses the existing public `GET /campaigns` and `DELETE /campaigns/:id` (which already allowed admin overrides since Phase 6).
- TanStack Query: `QueryClient` + `QueryClientProvider` (`src/components/providers.tsx`, wrapped around the whole app in the root layout). Every dashboard list that used to be a manual `useEffect` + `.then()` + `ignore`-flag fetch — My Campaigns, My Contributions, Admin Users, Admin Campaigns — is now a `useQuery`. Their mutations (delete campaign in two places, set-role) use `useMutation` with real optimistic updates: `onMutate` snapshots the cache and writes the expected result immediately (e.g. the row disappears / the role dropdown updates before the server responds), `onError` rolls back to the snapshot, `onSettled` invalidates to resync with the server.

**Planned:**

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
      campaigns/
        page.tsx          # public campaign list (Server Component)
        [id]/page.tsx      # public campaign details (Server Component)
    (dashboard)/
      layout.tsx         # sidebar + header shell, redirects if no session
      dashboard/
        page.tsx          # overview page
        campaigns/
          page.tsx          # my campaigns (client, ?creator=<id>)
          new/page.tsx       # create campaign
          [id]/edit/page.tsx  # edit campaign
        contributions/page.tsx # my contributions (client)
        admin/
          layout.tsx          # guards role === "admin"
          users/page.tsx       # list + change role
          campaigns/page.tsx   # list all + delete
  components/
    providers.tsx          # QueryClientProvider, wraps the whole app
    ui/
      index.ts           # re-exports HeroUI primitives + our Navbar
      navbar.tsx          # compound Navbar (Root/Brand/Content/Item)
    site-navbar.tsx       # the real, auth-aware navbar used in (public)/layout.tsx
    user-menu.tsx         # shared avatar/dropdown (site navbar + dashboard header)
    campaign-card.tsx     # shared campaign card (also exports formatCurrency)
    contribute-form.tsx    # embedded in campaign details — login prompt / form / success state
    landing/
      hero.tsx
      featured-campaigns.tsx  # real fetch to crowdfunding-server (Server Component)
      how-it-works.tsx
      categories.tsx
      why-choose-us.tsx
      footer.tsx
    dashboard/
      nav-items.ts        # role -> nav items (Supporter/Creator/Admin)
      sidebar.tsx          # desktop sidebar
      sidebar-nav.tsx      # shared nav list (desktop sidebar + mobile drawer)
      mobile-nav.tsx       # HeroUI Drawer-based mobile nav
      header.tsx           # mobile nav trigger + breadcrumb + user menu
      breadcrumb.tsx        # derives breadcrumb segments from the pathname
      campaign-form.tsx      # shared create/edit form
  lib/
    auth-client.ts        # Better Auth React client
    api.ts                 # apiFetch() — base URL + credentials wrapper
  types/
    campaign.ts            # Campaign type, mirrors the server's shape
    contribution.ts         # Contribution type (includes the joined campaign)
    user.ts                 # AdminUser type (Better Auth's admin list-users response)
  proxy.ts                 # Next.js 16 proxy (replaces middleware.ts) — protects /dashboard
```

Route groups `(public)`/`(dashboard)` don't affect URLs — `/`, `/login`, `/register`, `/dashboard` are unchanged.

**Styling a `<Link>` as a button:** use `buttonVariants({ variant, size })` from `@heroui/styles` on a Next `<Link>` (see `hero.tsx`) — `@heroui/react`'s `Button` doesn't support `href`. Note `globals.css` has a small override for this: `@heroui/styles` ships an unlayered `a { background-color: transparent }` reset that otherwise wins over the (layered) `.button` styles on any anchor, per CSS Cascade Layers rules.

**Trigger components already render a `<button>`:** `Drawer.Trigger`, `Dropdown.Trigger`, `Modal.Trigger` etc. are themselves pressable buttons — don't wrap a `<Button>` inside one (invalid nested `<button>`s, causes a hydration error). Style the trigger directly instead, e.g. `<Drawer.Trigger className={buttonVariants({ variant: "ghost", isIconOnly: true })}>` (see `mobile-nav.tsx`).

**Fetching in a `useEffect`:** ESLint's `react-hooks/set-state-in-effect` rule (part of React 19.2's React Compiler lint rules) flags calling a `useCallback`-wrapped async helper that itself calls `setState` directly from an effect body. All the dashboard list pages that used to hit this have been migrated to `useQuery` (Phase 9) and no longer have the problem — if you add a new client-side fetch, reach for `useQuery`/`useMutation` first rather than a manual effect.

Further feature-based structure (`components/`, `features/`, shared `types/`) will grow as later phases add more UI.

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
