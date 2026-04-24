# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev       # Start dev server at http://localhost:8080
npm run build     # Production build
npm run build:dev # Development build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There is no test suite configured — no test runner or test files exist in the project.

## Environment Variables

Copy `.env.example` or set these before running:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

The Supabase edge function (`supabase/functions/ai-assistant/`) additionally requires `LOVABLE_API_KEY`.

## Architecture

**Booksmart** is a single-page React + TypeScript app — a multi-tenant textbook marketplace where users can browse/buy books and vendors can manage stores and listings.

### Stack
- **React 18 + Vite + TypeScript** — SPA, no SSR
- **Supabase** — PostgreSQL database with Row-Level Security; no custom backend API; the client talks directly to Supabase
- **TanStack React Query** — data fetching and caching
- **React Router v6** — client-side routing
- **shadcn/ui + Radix UI** — component primitives in `src/components/ui/`
- **Tailwind CSS** — styling with custom fonts (DM Serif Display, Lora, Inter) and color tokens defined in `tailwind.config.ts`
- **React Hook Form + Zod** — form handling and validation

### Key Source Directories

| Path | Purpose |
|------|---------|
| `src/pages/` | Top-level page components (one per route) |
| `src/components/` | Shared feature components |
| `src/components/ui/` | shadcn/ui primitives (auto-generated, avoid editing directly) |
| `src/integrations/supabase/` | Supabase client + generated TypeScript types |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utilities (`cn()` for Tailwind class merging) |
| `supabase/migrations/` | Database schema (PostgreSQL) |
| `supabase/functions/ai-assistant/` | Deno edge function powering the AI chat widget |

### Routing

Defined in `src/App.tsx` via React Router `<BrowserRouter>`:

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/shop` | Product catalog with filtering/sorting |
| `/store-list` | Vendor directory |
| `/my-account` | Auth + vendor dashboard |
| `/about-us`, `/contact-us`, `/join-us` | Static pages |
| `/reset-password` | Password reset |
| `/terms` | Terms of service |

### Data Models

Three core Supabase tables (see `supabase/migrations/`):
- **categories** — textbook subjects
- **stores** — vendor stores, owned by an auth user
- **products** — textbook listings linked to a store and category; images stored in the `product-images` Supabase Storage bucket

RLS policies enforce that vendors can only modify their own stores/products; public reads are open.

### AI Assistant

`src/components/AiAssistant.tsx` is a floating chat widget present on every page. It calls the `ai-assistant` Supabase edge function (Deno), which proxies to the Lovable AI Gateway (Gemini Flash). The edge function streams responses via Server-Sent Events.

### Auth & Vendor Flow

Supabase Auth handles registration/login. On the `/my-account` page, authenticated users can create a store, becoming a vendor. `VendorDashboard.tsx` and related components handle store management and product CRUD.

## Important Conventions

- Use the `cn()` utility from `src/lib/utils.ts` for conditional Tailwind classes.
- Supabase types in `src/integrations/supabase/types.ts` are generated — regenerate with `supabase gen types typescript` after schema changes, don't edit manually.
- Path alias `@` maps to `./src` — use `@/components/...` style imports.
- This project was scaffolded with Lovable; the `lovable-tagger` Vite plugin is active in dev mode.

## Testing Requirements

**Every new feature must be tested end-to-end before it is considered complete.**

### Process

1. **Write a Playwright test** in a `.cjs` file at the repo root (e.g. `test-<feature-name>.cjs`). The project uses `"type": "module"` in `package.json`, so test files must use the `.cjs` extension and CommonJS `require()`.

2. **Cover the full user flow** — not just the happy path. Tests must include:
   - All user roles that interact with the feature (e.g. buyer and vendor)
   - The complete sequence of actions a real user would take
   - Assertions that the feature works correctly from each role's perspective
   - Assertions that error/empty states are handled correctly

3. **Run the tests and confirm all pass** (`node test-<feature-name>.cjs`). Do not mark a feature done until the output shows 0 failures.

4. **Capture screenshots** at key steps using `page.screenshot()` for visual confirmation. Save to `/tmp/booksmart-test/`.

### Playwright setup

```bash
# Install (already in devDependencies after first use)
npm install --save-dev playwright
npx playwright install chromium
```

Run tests against the local dev server (`http://localhost:8080`) — ensure `npm run dev` is running first.

### Test accounts

- **Vendor**: fikstathebastard@gmail.com / Joburgjan@2017
- **Buyer**: adideeavi01@gmail.com / Joburgjan@2017

### Selector conventions

- Use `#login-email` / `#login-password` for the login form (avoids ambiguity with the register form on the same page).
- Use `.first()` on any locator that may match multiple elements to avoid strict-mode violations.
- Use chained locators for dialog-scoped checks: `page.locator('[role="dialog"]').locator('text=...')`.
- Use `.catch(() => false)` on `.isVisible()` calls so a strict-mode error doesn't crash the test.
