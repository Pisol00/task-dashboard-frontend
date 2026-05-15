# TaskFlow — Task Dashboard Frontend

Dashboard for tracking tasks with kanban board, filters, pagination, and a multi-axis hourly chart.

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data**: TanStack Query
- **i18n**: i18next (EN/TH)
- **Icons**: lucide-react

## Getting Started

```bash
# 1. Install deps
npm install

# 2. Copy env
cp .env.example .env

# 3. Start the backend (in the sibling repo task-dashboard-backend)
#    See its README for docker compose + db:migrate + db:seed + npm run dev

# 4. Run the frontend dev server
npm run dev
```

Vite proxies `/api/*` to the backend (default `http://localhost:3000`), so the
frontend and backend share an origin from the browser's perspective.

### Scripts

```bash
npm run dev         # Vite dev server with /api proxy
npm run typecheck   # tsc -b
npm run lint        # eslint
npm run format      # prettier --write
```

## Environment

Copy `.env.example` to `.env` and adjust values:

| Variable | Default | Use |
|---|---|---|
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Where Vite proxies `/api/*` |

## Project Structure

```
src/
├── app/                      # App-level setup (router, providers)
├── components/
│   ├── ui/                   # Primitives — Button, Input, Dialog, Badge (no domain logic)
│   ├── shared/               # Composite/cross-feature — ErrorBoundary, Pagination, layout/
│   │   └── layout/           #   AppLayout, Sidebar, Header
│   └── features/             # Business slices — each self-contained
│       └── <feature>/
│           ├── api/          #     Query/mutation hooks + API calls
│           ├── components/   #     Feature-scoped UI
│           ├── hooks/        #     Feature-scoped hooks
│           └── utils/
├── pages/                    # Route components (thin — compose features)
├── hooks/                    # Shared hooks (useDebounce, useDisclosure, ...)
├── lib/                      # Framework-agnostic utilities (api-client, cn)
├── constants/                # Query keys, route paths, enum metadata
├── types/                    # Shared TypeScript types
├── index.css                 # Tailwind entry + global styles
└── main.tsx
```

### Component layers

| Layer | Knows about domain? | Examples |
|---|---|---|
| `components/ui/` | ❌ | Button, Input, Select, Dialog, Badge |
| `components/shared/` | ❌ (but composite) | ErrorBoundary, Pagination, EmptyState, AppLayout, Sidebar |
| `components/features/<name>/` | ✅ | TaskCard, TaskBoard, TaskFilters, DailyChart |

### Conventions

- **Imports** use the `@/*` alias for `src/*`.
- **Pages stay thin** — orchestrate features, no business logic.
- **Features are self-contained** — UI, hooks, and API calls live together.
- **Shared things go up** — anything used by 2+ features moves to `hooks/`, `lib/`, or `components/common/`.
- **Constants over magic strings** — query keys, routes, and enum metadata centralized in `constants/`.
- **Types are explicit** — `import type` for type-only imports (required by `verbatimModuleSyntax`).
