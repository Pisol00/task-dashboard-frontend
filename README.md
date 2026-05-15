# TaskFlow — Frontend

Task management dashboard with a kanban board and a daily multi-axis chart.

Backend lives in a sibling repo: [`task-dashboard-backend`](../task-dashboard-backend).
The Vite dev server proxies `/api/*` to it, so the browser sees one origin.

---

## Features

### 1. Task Board (`/`)

Kanban board with three columns: **To Do** · **In Progress** · **Done**.

| Sub-feature | Notes |
|---|---|
| Filter bar | Search title, Priority dropdown, Status dropdown, Clear-all button |
| Pagination | Each status shows up to 3 cards per page; `totalPages` follows the busiest status |
| Card preview | Click a card → detail dialog (tag, due date, status, progress, assignees) |
| Create / Update | `+ New Task` and detail-dialog `Update` open a form dialog with validation |
| Delete | From the detail dialog with a confirm step |
| URL-backed state | `?q=&priority=&status=&tag=&page=` — sharable, survives refresh |
| Search debounce | 300 ms before hitting the API |
| Empty state | Different message when filters are active vs. no tasks at all |
| Fetch fade | Board fades during refetch instead of flashing blank |

### 2. Daily Graph (`/chart`)

Hourly multi-axis line chart (24 points per day).

| Sub-feature | Notes |
|---|---|
| 3 series | Green (0–100), Orange (-100…100), Blue (0–10) — each on its own Y-axis |
| Custom tooltip | Single grid showing all three values |
| Legend toggle | Click a series pill to hide/show its line |
| Date picker | Prev/Next day buttons, custom calendar, Today shortcut, URL-backed |
| Export PDF | A4 capture via `html2canvas-pro` + `jsPDF` (auto orientation, title + timestamp) |

### 3. App shell

| Sub-feature | Notes |
|---|---|
| Sidebar | Collapsible (persisted via `localStorage`), Dashboard / My Tasks / Daily Graph / Team / Settings |
| Header | Global search (auto-detects priority / status / tag keywords in EN+TH), notification bell, profile menu |
| Profile menu | Theme switch (Light / Dark / System), Language switch (EN / TH), Log out |
| Header vs Dashboard search | Separated via `?navSearch=1` flag — touching Dashboard filters clears nav search; emptying nav search clears all |
| Theme | Tailwind v4 dark mode class strategy + design tokens |
| i18n | `react-i18next`, EN + TH, browser detection + persisted choice |
| Accessibility | Keyboard-navigable, `:focus-visible` rings, dialogs trap Escape |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build / dev | Vite 8 |
| Framework | React 19 + TypeScript (ESM, `verbatimModuleSyntax`) |
| Styling | Tailwind CSS v4 with custom `@theme` tokens (no UI library) |
| Font | Inter (Google Fonts) |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| i18n | i18next + react-i18next |
| Charts | Recharts |
| PDF | jsPDF + html2canvas-pro (CSS custom properties support) |
| Icons | lucide-react |
| Classnames | clsx + tailwind-merge (`cn()`) |

---

## Getting Started

```bash
# 1. Install
npm install

# 2. Copy env (only one var: where to proxy /api)
cp .env.example .env

# 3. Start the backend separately
#    See task-dashboard-backend/README.md
#    Default: http://localhost:3000

# 4. Run the dev server
npm run dev
```

Vite proxies `/api/*` to `VITE_API_PROXY_TARGET` (default `http://localhost:3000`).

### Scripts

```bash
npm run dev         # Vite dev server with /api proxy
npm run build       # Type-check + production build
npm run typecheck   # tsc -b
npm run lint        # eslint
npm run format      # prettier --write
```

### Environment

| Variable | Default | Use |
|---|---|---|
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Where Vite proxies `/api/*` |

The API base path `/api` is hardcoded in `src/lib/api-client.ts`.

---

## Architecture

### Folder structure

```
src/
├── app/                # Providers + router (app-level wiring)
├── components/
│   ├── ui/             # Primitives — Button, Input, Dialog, Combobox, DatePicker, ...
│   ├── shared/         # Composite, cross-feature — Pagination, ErrorBoundary, layout/
│   └── features/       # Business slices (self-contained)
│       ├── tasks/      #   api/, components/, hooks/, utils/
│       ├── metrics/    #   api/, components/, hooks/, utils/
│       └── preferences/#   ProfileMenu, useTheme, useLanguage
├── pages/              # Route components (thin — compose features)
├── hooks/              # Cross-feature shared hooks
├── lib/                # api-client, cn()
├── constants/          # Routes, query keys, enum metadata
├── types/              # Shared TypeScript types
├── i18n/               # i18next config + locales/{en,th}.json
├── index.css           # Tailwind import + design tokens (@theme + CSS vars)
└── main.tsx
```

### Component layering

| Layer | Domain-aware? | Imports |
|---|---|---|
| `components/ui/` | ❌ | `lib/`, `hooks/` |
| `components/shared/` | ❌ | `ui/`, `lib/`, `hooks/`, `constants/` |
| `components/features/<x>/` | ✅ (one feature) | All above + `types/` |

**Cross-feature imports are forbidden.** Anything shared between features moves to `shared/`, `hooks/`, or `lib/`.

### Design tokens

Defined in [src/index.css](src/index.css):

- Tailwind v4 `@theme` scales: `brand-*`, `success-*`, `warning-*`, `danger-*`, `info-*`, custom radii / shadows / font
- Semantic CSS vars: `--surface-*`, `--border-*`, `--text-*`, `--track`, `--ring-brand`
- Dark theme overrides on `html.dark`
- Utility classes built on tokens: `surface-base`, `surface-sunken`, `border-subtle`, `text-primary`, …

**Rule:** components never use raw `slate-*`/`indigo-*`. Always go through tokens.

### State strategy

| Concern | Solution |
|---|---|
| Server data | TanStack Query (with hierarchical query keys in `constants/query-keys.ts`) |
| URL state (filters, page, search, date) | React Router search params |
| Local UI state (dialogs, hover) | `useState` / `useDisclosure` |
| Persistent UI prefs | `useLocalStorage` (sidebar, theme, language) |

---

## Screenshots

> _Add screenshots/GIFs here before submission_

- `docs/screenshots/board-light.png`
- `docs/screenshots/board-dark.png`
- `docs/screenshots/chart-light.png`
- `docs/screenshots/profile-menu.png`

---

## Conventions for contributors

- **`@/*` alias** for `src/*` — no `../../..` paths.
- **`import type`** for type-only imports (required by `verbatimModuleSyntax`).
- **No enums** (banned by `erasableSyntaxOnly`); use union string literals.
- **Pages stay thin** — they compose features, not implement them.
- **All user text** goes through `useTranslation()` and locale files.
- **Git flow**: GitHub Flow on `main` with short-lived `feat/<scope>` branches → PR → merge commit. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Agent context** for AI assistants lives in [AGENTS.md](AGENTS.md).
