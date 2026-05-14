# AGENTS.md — Project Context for AI Coding Agents

> This file gives AI assistants the project's full context so they don't have to re-derive it every session.
> When tech choices or conventions change, update this file.

---

## Project Overview

**Name:** TaskFlow
**Type:** Fullstack take-home test (DEVDEVA — Fullstack Developer)
**Scope:**

1. **Task Dashboard** — Kanban board (To Do / In Progress / Done) with search, filters, pagination, detail/edit dialogs, collapsible sidebar.
2. **Daily Graph** — 24-hour multi-axis line chart (3 series with different scales), tooltip, legend toggle, export to PDF.

Both features must be backed by a real API.

---

## Repositories

| Repo | Purpose |
|---|---|
| `task-dashboard-frontend` (this repo) | UI |
| `task-dashboard-backend` (separate, not yet created) | REST API |

Two-repo layout (not monorepo). Types are duplicated where needed; shared via copy-paste of `src/types/*.ts` until contracts stabilize.

---

## Tech Stack

### Frontend (this repo)

| Layer | Choice | Why |
|---|---|---|
| Build | **Vite 8** | Fast HMR, native ESM |
| Framework | **React 19 + TypeScript** | Required by spec |
| Styling | **Tailwind CSS v4** (no UI library) | Spec said Tailwind only |
| Routing | **React Router v7** | Standard for SPA |
| Server state | **TanStack Query v5** | Caching, mutations, devtools |
| Mock API (dev) | **MSW v2** | Same code path as production fetch |
| Icons | **lucide-react** | Lightweight, tree-shakeable |
| Class merging | **clsx + tailwind-merge** (`cn()` helper) | Standard pattern |
| Linting | ESLint 10 + typescript-eslint | Out of the box |
| Formatting | **Prettier** (no semis, single quotes, trailing comma all) | Consistency |

**Important TS flags** (in `tsconfig.app.json`):
- `verbatimModuleSyntax: true` → must use `import type` for type-only imports
- `erasableSyntaxOnly: true` → no parameter properties in classes, no enums; use union string literals instead
- `noUnusedLocals` / `noUnusedParameters` → strict

### Backend (planned)

| Layer | Choice |
|---|---|
| Runtime | **Node.js (LTS)** |
| Framework | **Express** |
| ORM | **Prisma** |
| Database | **PostgreSQL** (Docker for local dev) |
| Validation | **Zod** (request schemas) |
| Language | **TypeScript** |
| Structure | Feature-modular (`src/modules/{tasks,users,metrics}` each with `routes/controller/service/schema`) |

Backend will live in a separate repo. Until it exists, MSW handlers in this repo simulate the contract.

---

## API Contract (FE expects, BE must implement)

Base path: `/api`

### Tasks

```
GET    /api/tasks?q=&priority=&status=&page=&limit=
  → { data: Task[], page, limit, total, totalPages }

GET    /api/tasks/:id        → Task
POST   /api/tasks            → Task (201)
PATCH  /api/tasks/:id        → Task
DELETE /api/tasks/:id        → 204
```

Search behavior: `q` matches title case-insensitively. `priority` and `status` accept `"All"` to skip filtering. All filters AND-combined.

### Users

```
GET    /api/users            → User[]   (for assignee dropdown)
```

### Metrics (data for ข้อ 2)

```
GET    /api/metrics?date=YYYY-MM-DD  → { date, points: MetricPoint[] }
```

`points` has 24 entries (hour 0–23) with `green` (0–100), `orange` (-100 to 100), `blue` (0–10).

---

## Frontend Conventions

### Folder structure

```
src/
├── app/                      # Providers, router (app-level wiring)
├── components/
│   ├── ui/                   # Primitives — no domain knowledge (Button, Input, Dialog, ...)
│   ├── shared/               # Composite, cross-feature, no domain knowledge
│   │   └── layout/           #   AppLayout, Sidebar, Header
│   └── features/             # Business slices — domain-aware
│       └── <name>/
│           ├── api/          #     Query/mutation hooks + raw API calls
│           ├── components/   #     Feature-scoped components
│           ├── hooks/        #     Feature-scoped hooks
│           └── utils/
├── pages/                    # Route components (thin — compose features only)
├── hooks/                    # Cross-feature shared hooks
├── lib/                      # Framework-agnostic utilities
├── config/                   # Validated env, runtime config
├── constants/                # Routes, query keys, enum metadata
├── types/                    # Shared TypeScript types
├── mocks/                    # MSW handlers + fixtures
└── main.tsx
```

### Component layer rules

| Layer | Domain knowledge? | Imports from |
|---|---|---|
| `components/ui/` | None | `lib/`, `hooks/` only |
| `components/shared/` | None (composite/layout) | `ui/`, `lib/`, `hooks/`, `constants/` |
| `components/features/<x>/` | Yes (one feature) | `ui/`, `shared/`, `lib/`, `hooks/`, `constants/`, `types/` |

**Cross-feature imports are forbidden.** If `features/a` needs something from `features/b`, that something belongs in `shared/` (or `hooks/`/`lib/`).

### Rules

- **Import alias**: `@/*` → `src/*`. Always use `@/...`, never relative paths beyond the same folder.
- **Type-only imports**: required by `verbatimModuleSyntax` → `import type { Foo } from '...'`.
- **No enums, no parameter properties** (TS `erasableSyntaxOnly`).
- **Pages stay thin** — orchestrate features, no business logic, no fetching.
- **Features are self-contained** — UI + hooks + API calls live together.
- **Shared things move up** — used by 2+ features → `hooks/`, `lib/`, `components/common/`.
- **Constants over magic strings** — routes in `constants/routes.ts`, query keys in `constants/query-keys.ts`.
- **Hierarchical query keys** — `queryKeys.tasks.list(params)` so `invalidateQueries({ queryKey: queryKeys.tasks.all })` wipes everything related.
- **Server state → TanStack Query. URL state → search params. UI state → local `useState`.** No Redux/Zustand unless absolutely needed.
- **Forms** — `react-hook-form` + Zod when added (not yet installed).
- **Class names** — compose with `cn()` from `@/lib/utils`.

### Naming

- Components: PascalCase files (`TaskCard.tsx`), default to named exports.
- Hooks: `useX.ts`.
- Constants files: kebab-case (`query-keys.ts`).
- Tests: `*.test.ts(x)` co-located (when added).

### Commits

- Conventional Commits: `chore:`, `feat:`, `fix:`, `refactor:`, `docs:`, `build:`.
- Each commit has one clear scope (e.g. `feat: add task board with filters and pagination`).

---

## Env

Defined in `.env.example`. Loaded type-safely via `src/config/env.ts` (throws if missing).

| Var | Default | Use |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Prefix for `apiFetch` |
| `VITE_ENABLE_MOCKS` | `true` (dev) | Toggle MSW worker |
| `VITE_APP_NAME` | `TaskFlow` | Display name |

---

## How Agents Should Work in This Repo

1. **Read this file first** every session — it's the source of truth for stack and conventions.
2. **Don't introduce a new library** without checking the table above and asking the user.
3. **Stay inside the feature folder** when building feature-scoped code.
4. **Update `AGENTS.md`** when stack, conventions, or API contract changes.
5. **Verify with `npm run typecheck`** after non-trivial changes.
6. **Prefer editing** existing files over creating new ones.
