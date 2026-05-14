# TaskFlow — Task Dashboard Frontend

Dashboard for tracking tasks with kanban board, filters, pagination, and a multi-axis hourly chart.

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data**: TanStack Query
- **Mocks**: MSW (Mock Service Worker)
- **Icons**: lucide-react

## Getting Started

```bash
# Install
npm install

# Run dev server (with MSW mocks)
npm run dev

# Type check
npm run typecheck

# Lint & format
npm run lint
npm run format
```

## Environment

Copy `.env.example` to `.env` and adjust values:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base path for API calls (default `/api`) |
| `VITE_ENABLE_MOCKS` | Set `true` to start MSW worker in browser |
| `VITE_APP_NAME` | Display name in UI |

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
├── config/                   # Validated env, runtime configuration
├── constants/                # Query keys, route paths, enum metadata
├── types/                    # Shared TypeScript types
├── mocks/                    # MSW handlers + fixtures
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
