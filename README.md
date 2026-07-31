# CrowdfundX — Client

Frontend for **CrowdfundX**, a modern crowdfunding platform. Built with Next.js 15 (App Router) and React 19.

> **Status:** MVP in development. This repo is currently pre-scaffold — no code has been generated yet. This README describes the planned architecture and setup from the project roadmap (`PLAN.md`) so it's ready to follow once implementation starts.

Related repo: [crowdfunding-server](https://github.com/GajiPH13/crowdfunding-server) (Express.js + MongoDB API)

---

## Tech Stack

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* HeroUI
* React Icons (brands/social icons)
* Gravity UI Icons (dashboard/navigation icons)
* TanStack Query
* React Hook Form
* Zod
* Axios

---

## Planned Features

* Login / register pages, session provider, protected routes (Better Auth session cookies)
* Public layout + Dashboard layout, with role-based navigation (Supporter / Creator / Admin)
* Landing page: Navbar, Hero, Featured Campaigns grid, How It Works, Categories, Why Choose Us, Footer
* Campaign pages: list, details, create, edit
* Contribution form with validation and success state
* Admin UI: user list + role management, campaign list + delete
* Reusable component library (HeroUI-based): Button, Card, Input, Modal, Avatar, Table, Navbar, Dropdown
* Global error/loading pages, toast notifications, empty states
* Reusable Axios client with auth interceptors

Full task-by-task breakdown lives in [`PLAN.md`](../PLAN.md).

---

## Project Structure (planned)

Feature-based architecture under the Next.js App Router. Exact folder layout will be finalized during scaffolding (`PLAN.md` Task 2); expect roughly:

```text
src/
  app/            # routes (App Router)
  components/     # reusable UI components
  features/       # feature-scoped logic (auth, campaigns, contributions, admin)
  lib/            # axios client, query client, utils
  types/          # shared TypeScript types
```

---

## Getting Started

> Setup commands below are the standard commands for this stack; they will apply once the project is scaffolded (`PLAN.md` Phase 1, Task 2).

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the `crowdfunding-server` API |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth base URL used by the client |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (for Google login button) |

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

* TypeScript everywhere, strict mode.
* Prefer server components; use client components only when necessary.
* Reuse existing components before creating new ones.
* Validate all inputs with Zod.
* Handle loading, empty, and error states for every page.
* One task at a time, no TODOs left in completed work.
* Ensure the app builds and lints cleanly before moving to the next task.

See [`PLAN.md`](../PLAN.md) for the full AI coding guidelines and definition of done.
