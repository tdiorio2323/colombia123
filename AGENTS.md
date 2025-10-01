# Repository Guidelines

## Project Structure & Module Organization
- `client/` holds the React SPA; routes live in `client/pages/`, shared UI primitives in `client/components/ui/`, and global styling in `client/global.css`.
- `server/` exposes the Express API entry point in `server/index.ts`; add route handlers under `server/routes/` when logic must run on the server.
- `shared/` stores TypeScript contracts (for example `shared/api.ts`) that keep client and server responses in sync.
- Production bundles are emitted to `dist/`, and configuration for tooling sits alongside the root (for example `vite.config.ts`, `tailwind.config.ts`, `vitest.config.ts`).

## Build, Test, and Development Commands
- `npm run dev` starts the Vite + Express dev server on one port with hot reloading.
- `npm run build` runs both `build:client` and `build:server`, producing production assets in `dist/`.
- `npm run start` launches the compiled server (`dist/server/node-build.mjs`).
- `npm run typecheck` invokes `tsc` to validate types without emitting files.
- `npm test` runs Vitest in CI mode; add `--watch` locally if you need live feedback.
- `npm run format.fix` applies Prettier across the repo; run it before pushing format-only changes.

## Coding Style & Naming Conventions
- Code is TypeScript-first with 2-space indentation and semi-colons enforced by Prettier.
- Name React components and files that export components in `PascalCase`; utility modules and hooks stay in `camelCase` or `kebab-case` to match existing files.
- Prefer functional components with explicit prop interfaces, Tailwind utility classes for styling, and the `cn()` helper for conditional classnames.
- Keep imports ordered: external packages, aliases (`@/`, `@shared/`), then relative paths.

## Testing Guidelines
- Vitest and Testing Library are configured via `vitest.config.ts` and `vitest.setup.ts`; place tests next to the code as `*.test.ts` or `*.test.tsx`.
- Mock network calls and time-sensitive logic to keep tests deterministic; use `msw` if you introduce API-heavy features.
- Ensure new routes or data flows include unit or integration coverage, and run `npm test` + `npm run typecheck` before opening a PR.

## Commit & Pull Request Guidelines
- Follow the existing `<type>: <summary>` convention (e.g., `feat: add calendar filters`, `chore: update deps`). Keep subject lines under ~60 characters.
- Each PR should include a concise summary, linked issue or task ID, screenshots/GIFs for UI-facing changes, and notes on relevant tests.
- Rebase onto the latest main before requesting review and confirm that `npm run build` and `npm test` succeed in your branch.

## Security & Configuration Tips
- Load secrets through environment variables consumed by `dotenv`; never commit `.env` files. When adding a new variable, document it in `docs/` and update deployment configs (`netlify/`, `vercel.json`).
- Review third-party integrations (Stripe, auth providers) with the team before enabling endpoints, and keep private keys server-side in `server/routes/` handlers.
