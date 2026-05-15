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
| Font | **Inter** (via Google Fonts) | Modern SaaS dashboard standard |
| Routing | **React Router v7** | Standard for SPA |
| Server state | **TanStack Query v5** | Caching, mutations, devtools |
| i18n | **i18next + react-i18next** | EN/TH support with browser language detection |
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

Backend lives in `task-dashboard-backend` (sibling repo). The Vite dev server proxies `/api/*` to it.

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
│   ├── ui/                   # Primitives — no domain (Button, Input, Dialog, Dropdown, Combobox, ...)
│   ├── shared/               # Composite, cross-feature, no domain
│   │   └── layout/           #   AppLayout, Sidebar, Header
│   └── features/             # Business slices — domain-aware
│       ├── tasks/            #   Task board feature
│       │   ├── api/          #     Query/mutation hooks + raw API calls
│       │   ├── components/   #     Feature-scoped components
│       │   ├── hooks/        #     Feature-scoped hooks
│       │   └── utils/
│       └── preferences/      #   Theme + language preferences
│           ├── components/   #     ProfileMenu
│           └── hooks/        #     useTheme, useLanguage
├── pages/                    # Route components (thin — compose features only)
├── hooks/                    # Cross-feature shared hooks (useDebounce, useDisclosure, useLocalStorage, useMediaQuery)
├── lib/                      # Framework-agnostic utilities (cn, apiFetch)
├── constants/                # Routes, query keys, enum metadata
├── types/                    # Shared TypeScript types
├── i18n/                     # i18next config + locales/{en,th}.json
├── index.css                 # Tailwind import + design tokens (@theme + CSS vars)
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
- **Shared things move up** — used by 2+ features → `hooks/`, `lib/`, `components/shared/`.
- **Constants over magic strings** — routes in `constants/routes.ts`, query keys in `constants/query-keys.ts`.
- **Hierarchical query keys** — `queryKeys.tasks.list(params)` so `invalidateQueries({ queryKey: queryKeys.tasks.all })` wipes everything related.
- **Server state → TanStack Query. URL state → search params. UI state → local `useState`. Persistent UI prefs → `useLocalStorage`.** No Redux/Zustand unless absolutely needed.
- **Forms** — Native form + controlled inputs (no `react-hook-form` yet). Validate inline.
- **Class names** — compose with `cn()` from `@/lib/utils`.
- **All user-facing text** must go through `useTranslation()` from react-i18next. Keys live in `src/i18n/locales/{en,th}.json`.

### Naming

- Components: PascalCase files (`TaskCard.tsx`), default to named exports.
- Hooks: `useX.ts`.
- Constants files: kebab-case (`query-keys.ts`).
- Tests: `*.test.ts(x)` co-located (when added).

### Git flow

**GitHub Flow** — `main` is always deployable, work happens on short-lived `feat/<scope>` branches.

```
main → feat/<scope> → PR → merge commit → main
```

- One feature = one branch = one PR. Keep diffs small (~< 400 lines).
- Never commit directly to `main`.
- Branch naming: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` + kebab-case scope.
- Merge strategy: **merge commit** (preserves branch history).
- PRs via `gh pr create --fill` after pushing.

### Commits

- **Conventional Commits**: `chore:`, `feat:`, `fix:`, `refactor:`, `docs:`, `build:`.
- Each commit has one clear scope (e.g. `feat: add task board with filters and pagination`).
- See `CONTRIBUTING.md` for the full workflow.

---

## Design System

Tokens defined in [src/index.css](src/index.css) using Tailwind v4 `@theme` directive + CSS custom properties. Light theme on `:root`, dark theme on `html.dark`.

### Semantic tokens (use these, NOT raw Tailwind colors)

| Token | Purpose | Utility class |
|---|---|---|
| `--surface-canvas` | Page background | `surface-canvas` |
| `--surface-sunken` | Sunken panels (column wrappers) | `surface-sunken` |
| `--surface-base` | Cards, dialogs, dropdowns | `surface-base` |
| `--surface-raised` | (Reserved) tooltips, popovers | `surface-raised` |
| `--surface-muted` | Filter bar, subtle blocks, hover bg | `bg-[var(--surface-muted)]` |
| `--border-subtle` | Hairline borders | `border-subtle` |
| `--border-default` | Stronger borders | `border-default` |
| `--text-primary` | Headings, important text | `text-primary` |
| `--text-secondary` | Body text | `text-secondary` |
| `--text-muted` | Labels, meta | `text-muted` |
| `--text-subtle` | Placeholders, disabled | `text-subtle` |
| `--track` | Progress/slider tracks | `bg-track` |
| `--ring-brand` | Focus glow | `ring-brand` |

### Scale tokens (Tailwind v4 `@theme`)

- `bg-brand-{50..900}`, `text-brand-*`, `border-brand-*`
- `bg-success-*`, `bg-warning-*`, `bg-danger-*`, `bg-info-*`
- `rounded-{sm,md,lg,xl,2xl}` (custom radii)
- `shadow-{xs,sm,md,lg,xl}` (custom soft shadows)
- `font-sans` (Inter)

### Rules

- **Never use raw `slate-*`, `indigo-*`, `rose-*` in components.** Use semantic tokens.
- **Status colors** (status badges, priority indicators) live in `components/features/tasks/utils/tone.ts` — keep all tone mapping there.
- **Glass effect** (`glass`, `glass-strong` utilities) is reserved for Sidebar and Header. Dialogs and Dropdowns use solid `surface-base`.
- **Focus**: buttons/cards/dropdowns use `focus-visible:ring-brand`. Inputs use `focus:border-brand-500` only (no ring) — Inter's caret + border is enough.

---

## i18n

- Library: `react-i18next` + `i18next-browser-languagedetector`
- Supported languages: `en` (default), `th`
- Detection order: `localStorage` → `navigator`
- Storage key: `taskflow:language`
- Locale files: `src/i18n/locales/{en,th}.json` — keep keys in **kebab grouping**: `nav.dashboard`, `task.errors.titleRequired`
- Interpolation: `{{count}}`, `<strong>{{title}}</strong>` (with `dangerouslySetInnerHTML` when HTML is in the string)
- Component access: `const { t } = useTranslation()` then `t('key')`
- Class components: import `i18n` from `@/i18n` and call `i18n.t('key')` (used in `ErrorBoundary`)

---

## Theme

- Hook: `useTheme()` from `@/components/features/preferences/hooks`
- Values: `'light' | 'dark' | 'system'` (persisted to `taskflow:theme` in localStorage)
- Applies `dark` class to `<html>` and listens to OS `prefers-color-scheme` changes when `system`
- UI primitives MUST include `dark:` variants where colors are not already token-driven

---

## Env

Defined in `.env.example`. Only the Vite dev server reads these — no runtime env in client code.

| Var | Default | Use |
|---|---|---|
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Vite dev server proxies `/api/*` to this host |

The API base path `/api` is hardcoded in `src/lib/api-client.ts`.

### Backend integration

The dev server proxies `/api/*` → `task-dashboard-backend` (default `localhost:3000`).
The frontend `apiFetch` always talks to `/api/...` — same-origin from the
browser's perspective.

To run end-to-end:
1. Start the backend (`docker compose up -d && npm run dev` in the sibling repo).
2. `npm run dev` here.

### Persisted user prefs (localStorage)

| Key | Purpose |
|---|---|
| `taskflow:sidebar-collapsed` | Sidebar collapse state |
| `taskflow:theme` | `light` / `dark` / `system` |
| `taskflow:language` | `en` / `th` |

---

## How Agents Should Work in This Repo

1. **Read this file first** every session — it's the source of truth for stack and conventions.
2. **Don't introduce a new library** without checking the table above and asking the user.
3. **Stay inside the feature folder** when building feature-scoped code.
4. **Update `AGENTS.md`** when stack, conventions, or API contract changes.
5. **Verify with `npm run typecheck`** after non-trivial changes.
6. **Prefer editing** existing files over creating new ones.
