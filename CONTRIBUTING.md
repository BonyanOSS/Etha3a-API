# Contributing to Bonyan-API

Thank you for helping build reliable open-source Islamic software.

## Development

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm lint:check
pnpm build
pnpm test
```

Use `pnpm lint` only when you intentionally want ESLint and Prettier to apply fixes.

## Pull Requests

- Keep changes focused.
- Add or update tests for behavior changes.
- Update `README.md` and `openapi.yaml` when public endpoints or response shapes change.
- Do not introduce a new upstream source without documenting its license, stability, timeout, and canonical mapping.
- Avoid breaking response shapes unless the change is clearly versioned.

## Adding an Upstream Source

Every upstream source should:

- Use `fetchWithTimeout`.
- Map to the canonical types in `src/types/Items.ts`.
- Preserve the same public response shape as other sources.
- Set `apiName` to the actual source used.
- Have a focused test for fallback behavior.

## Commit Style

Prefer conventional commits:

```text
feat(prayer): add new fallback source
fix(qibla): report local fallback source correctly
docs(openapi): document metrics endpoint
```
