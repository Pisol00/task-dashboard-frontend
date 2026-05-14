# Contributing

## Git Workflow — GitHub Flow

```
main (protected, always deployable)
 └── feat/<scope>   ← work happens here
        ↓ open PR
        ↓ review + checks
        ↓ merge commit
       main
```

### Steps

1. **Sync main**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feat/<scope>
   ```

3. **Commit using Conventional Commits**

   ```
   feat: add task filter bar
   fix: handle empty assignees in TaskCard
   refactor: extract pagination hook
   chore: bump tailwind to 4.4
   docs: document task API contract
   ```

4. **Push and open PR**

   ```bash
   git push -u origin feat/<scope>
   gh pr create --fill
   ```

5. **Merge**

   - Strategy: **Merge commit** (preserves branch history)
   - Delete the branch after merge

### Branch naming

| Prefix | Use |
|---|---|
| `feat/` | new feature or scoped chunk of work |
| `fix/` | bug fix |
| `refactor/` | restructure without behavior change |
| `chore/` | tooling, deps, config |
| `docs/` | documentation only |

Use kebab-case after the prefix: `feat/task-filters`, `fix/dialog-focus-trap`.

### Rules

- **One feature = one branch = one PR.** If a branch grows beyond ~400 lines of diff, split it.
- **Never commit directly to `main`.**
- **Rebase only on your own branch** — never rebase `main`.
- **All checks must pass** (typecheck, lint, format) before merge.
- **Branches are short-lived.** Open early, merge within a day or two.

## Code Standards

See [AGENTS.md](./AGENTS.md) for conventions, folder structure, and tech stack.

### Required scripts before pushing

```bash
npm run typecheck
npm run lint
npm run format:check
```

If `format:check` fails, run `npm run format` and commit the result.
