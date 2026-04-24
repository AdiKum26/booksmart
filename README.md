# BookSmart

A full-stack, multi-tenant textbook marketplace with real-time buyer-seller chat and a streaming AI assistant.

![React 18](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite 5](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Edge%20Functions-3ecf8e?logo=supabase&logoColor=white)
![Tailwind CSS 3](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-2ead33?logo=playwright&logoColor=white)

---

## Overview

BookSmart is a two-sided textbook marketplace. Students browse and search listings, message sellers directly, and ask a built-in AI assistant for academic help or site navigation. Anyone can become a vendor by creating a store in their account, after which they get a dashboard for managing listings, images, and an inbox for incoming messages. The backend is Supabase (Postgres + Auth + Storage + Edge Functions) with Row-Level Security as the primary authorization layer — there is no custom API server.

## Features

**Buyers**
- Keyword search across title and description with 300 ms debounce
- Filter by category; sort by price or title
- One-click "Message Seller" opens a live chat threaded per product
- Floating AI assistant for academic questions and site navigation

**Vendors**
- Self-serve store creation on first login
- Product CRUD with image upload to Supabase Storage
- Live inbox with unread badges; clicking a conversation opens the same chat the buyer sees
- Optimistic message sending — replies land instantly, then reconcile with the server

## Technical highlights

- **Real-time messaging** via Supabase Postgres change subscriptions (`postgres_changes` on `INSERT`). New messages stream into the open dialog without polling, and read receipts are written as the recipient views them. See [src/components/MessageDialog.tsx](src/components/MessageDialog.tsx) and [src/components/MessagesInbox.tsx](src/components/MessagesInbox.tsx).
- **Optimistic UI for outgoing messages.** A client-generated UUID renders the message immediately, then swaps with the server record on insert confirmation, with a de-duplication check to avoid echoing from the realtime channel. [src/components/MessageDialog.tsx:160-171](src/components/MessageDialog.tsx#L160-L171).
- **Streaming AI assistant.** A Deno edge function proxies Google Gemini's OpenAI-compatible endpoint and pipes the Server-Sent Events stream straight back to the browser. The client parses SSE with a hand-rolled line buffer — no external library — and renders the assistant's reply token-by-token. [src/components/AiAssistant.tsx](src/components/AiAssistant.tsx), [supabase/functions/ai-assistant/index.ts](supabase/functions/ai-assistant/index.ts).
- **Failure-mode design.** Dual `AbortController` timeouts (30 s client, 25 s edge) prevent infinite waits. A `quota_exhausted` sentinel turns 429/402 responses into a user-facing message explaining when service resumes — important because the Gemini key runs on a $0 spending cap. Stream reader is wrapped in try/catch so mid-response network drops don't hang the UI.
- **Row-Level Security as the authorization boundary.** Vendors can only mutate their own stores and products; conversation rows are only readable by the two participants; message inserts are restricted to the sender's own `auth.uid()`. The SPA talks to Postgres directly — there is no API server to re-enforce permissions. [supabase/migrations/](supabase/migrations/).
- **End-to-end tests in Playwright.** Two multi-context test files exercise the full buyer-and-vendor flow for messaging, and the AI widget including edge-function cold-start warm-up. Response-count-based wait helpers avoid stale-response false positives. [test-messaging.cjs](test-messaging.cjs), [test-ai-assistant.cjs](test-ai-assistant.cjs).

## Architecture

```
  Browser (React SPA)  ────────────►  Supabase Postgres
       │      ▲                        (RLS, realtime)
       │      │ postgres_changes INSERT/UPDATE
       │      └────────────────────────┤
       │                               │
       ├────►  Supabase Storage  ──────┘
       │         product-images
       │
       └────►  Edge Function (Deno)  ────►  Google Gemini
               ai-assistant                  (SSE stream)
```

**Request path — sending a chat message:** client inserts a row into `messages` → RLS checks the sender matches `auth.uid()` and they're a conversation participant → a trigger bumps `conversations.updated_at` → the recipient's open channel fires `postgres_changes` → their UI prepends the new message.

**Request path — AI reply:** client POSTs the conversation history to the edge function → Deno forwards it to Gemini with the system prompt → Gemini streams SSE tokens → Deno pipes the body straight back without buffering → the browser parses `data:` lines and appends deltas to the last assistant message.

## Tech stack

| Layer         | Choice                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| UI            | React 18, TypeScript 5, Vite 5 (SWC)                                   |
| Styling       | Tailwind CSS 3, shadcn/ui (Radix primitives), DM Serif Display / Lora / Inter |
| State / data  | TanStack React Query v5, React Hook Form + Zod                         |
| Routing       | React Router v6 (SPA, no SSR)                                          |
| Backend       | Supabase — Postgres, Auth, Storage, Edge Functions                     |
| AI            | Google Gemini 2.0 Flash via the OpenAI-compatible endpoint             |
| Testing       | Playwright (E2E)                                                       |

## Data model

Five tables, all under Row-Level Security:

- **`categories`** — textbook subjects. Publicly readable, admin-writable.
- **`stores`** — one per vendor. Owner is `user_id`; only the owner can update or delete.
- **`products`** — belong to a store and a category. Only the owning vendor can mutate; everyone can read.
- **`conversations`** — one per `(product_id, buyer_id)` pair; references both buyer and seller. Only the two participants can select.
- **`messages`** — belong to a conversation. Inserts require `sender_id = auth.uid()`; reads require participation. A trigger (`update_conversation_timestamp`) bumps the parent conversation's `updated_at` on every insert so inboxes sort correctly.

Product images live in the public `product-images` Storage bucket.

## Project structure

```
booksmart/
├── src/
│   ├── pages/              # One component per route
│   ├── components/         # Feature components (MessageDialog, AiAssistant, VendorDashboard, ...)
│   ├── components/ui/      # shadcn/ui primitives (generated; do not hand-edit)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/supabase/  # Supabase client + generated types
│   └── lib/                # cn() and other small utilities
├── supabase/
│   ├── migrations/         # Checked-in SQL for schema + RLS
│   └── functions/ai-assistant/  # Deno edge function
├── test-messaging.cjs      # Playwright E2E: buyer/vendor messaging
├── test-ai-assistant.cjs   # Playwright E2E: AI widget
└── CLAUDE.md               # Project conventions and testing requirements
```

## Getting started

```bash
git clone https://github.com/<you>/booksmart.git
cd booksmart
npm install
```

Create a `.env` at the repo root with your Supabase project keys:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<your-project-ref>
```

The edge function additionally needs a `GOOGLE_AI_KEY` set as a **Supabase secret** (not a `.env` var — the edge function runs on Supabase, not locally):

```bash
npx supabase secrets set GOOGLE_AI_KEY=<google-ai-studio-key> --project-ref <your-project-ref>
npx supabase functions deploy ai-assistant --project-ref <your-project-ref>
```

Start the dev server:

```bash
npm run dev     # http://localhost:8080
```

## Testing

The project uses Playwright for end-to-end coverage. Tests are plain Node scripts at the repo root with the `.cjs` extension — the package is ESM (`"type": "module"`), so CommonJS tests need the explicit extension. Each test spins up independent buyer and vendor browser contexts to exercise multi-user flows.

```bash
npx playwright install chromium    # first time only
npm run dev                        # in one terminal
node test-messaging.cjs            # in another
node test-ai-assistant.cjs
```

`test-messaging.cjs` covers the full buyer-sends-message → vendor-reads → vendor-replies → buyer-sees-reply flow across two browser contexts, and documents a bug fix in the conversation lookup logic (see engineering notes below).

`test-ai-assistant.cjs` covers widget lifecycle, streaming response rendering, multi-turn context retention, and edge-function cold-start behavior.

## Deployment

- **Frontend** is a static SPA — `npm run build` emits to `dist/` and deploys anywhere that serves static files (the repo is currently wired to Lovable).
- **Edge function** deploys through the Supabase CLI:
  ```bash
  npx supabase functions deploy ai-assistant --project-ref <ref>
  ```
- **Migrations** check in under `supabase/migrations/` and apply via the Supabase dashboard or CLI. After any schema change, regenerate types with `supabase gen types typescript`.

## Engineering notes

A few deliberate trade-offs worth calling out:

- **No custom backend API.** RLS is the authorization boundary. This keeps the system small and avoids a duplicated permission layer, at the cost of pushing more logic into SQL policies.
- **Stateless AI edge function.** Full conversation history is re-sent with every request instead of held server-side. Simpler to reason about and cheaper to operate; the bet is that Gemini's context handles the cost and student replies are short.
- **Optimistic UI for outgoing messages.** Users never see a spinner for their own sends. The realtime subscription can deliver the real row fractionally later; a membership check in the reducer prevents a duplicate render.
- **`.cjs` for Playwright tests.** The project is ESM, Playwright examples are CJS; keeping tests as `.cjs` avoids touching the package config and keeps the test harness boring.
- **TanStack Query is installed but not used for the realtime-backed views.** Inbox and message dialog use Supabase subscriptions directly — caching wouldn't add value when every state change is already pushed over a WebSocket.
- **Bug fix documented in test:** the message dialog originally looked up conversations by `buyer_id = currentUser`, which returned nothing when a vendor opened a conversation (they're the seller, not the buyer, of that row). Fix: `MessagesInbox` now passes the already-known `conversationId` to `MessageDialog`, bypassing the lookup. `test-messaging.cjs` guards against regression.

## Credits

Scaffolded with [Lovable](https://lovable.dev); all application code, schema, edge function, and tests are authored in this repository.
