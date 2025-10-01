# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server (Vite + Express) on port 8080
- `npm run build` - Build both client and server for production (`npm run build:client && npm run build:server`)
- `npm run start` - Run production server from `dist/server/node-build.mjs`
- `npm test` - Run Vitest test suite with jsdom environment
- `npm run typecheck` - TypeScript validation (required by pre-commit hooks)
- `npm run format.fix` - Format code with Prettier

### Individual Test Execution

Run specific tests: `npm test -- path/to/test.spec.ts` or `npm test -- --grep "test name"`

### Documentation

- `npm run docs:refresh` - Regenerate PROJECT_OVERVIEW.md, ROUTES.md, and README.md overview

## Architecture Overview

This is **Fusion Starter** - a production-ready full-stack React + Express starter template built with Vite, TypeScript, TailwindCSS, and Vitest.

### Project Structure

```
client/                 # React SPA frontend
├── components/
│   └── ui/            # shadcn/ui component library (Radix + Tailwind)
├── pages/             # Route components
│   ├── Index.tsx      # Home page
│   ├── Services.tsx
│   ├── Shop.tsx
│   ├── Community.tsx
│   ├── Calendar.tsx
│   └── NotFound.tsx   # 404 page
├── lib/
│   └── utils.ts       # cn() utility (clsx + tailwind-merge)
├── global.css         # Tailwind directives and global styles
└── App.tsx            # React Router 6 routing and providers

server/                # Express API backend
├── index.ts           # Server setup (createServer export)
└── routes/            # API route handlers
    └── demo.ts        # Example route handler

shared/                # TypeScript interfaces shared between client/server
└── api.ts             # Type definitions for API contracts
```

### Key Architectural Patterns

#### Dual Build System

- **Client build**: Vite SPA build to `dist/spa/` with code splitting
- **Server build**: Vite Node.js build to `dist/server/` with ES modules
- **Development**: Single-port dev server (8080) with Express middleware integration via Vite plugin

#### Path Aliases

- `@/*` → `client/*` (components, pages, utilities)
- `@client/*` → `client/*`
- `@server/*` → `server/*`
- `@shared/*` → `shared/*` (shared types between client/server)

All aliases configured in both `tsconfig.json` and `vitest.config.ts`

#### Express Integration in Development

The `vite.config.ts` includes an `expressPlugin()` that mounts the Express app as Vite middleware during development. This allows API routes at `/api/*` to work alongside the Vite dev server without separate ports.

### Technology Stack

**Frontend:**

- React 18
- React Router 6 (BrowserRouter)
- TailwindCSS with custom theme
- shadcn/ui component library (Radix UI primitives + Tailwind)
- TanStack React Query for server state
- Framer Motion for animations
- Lucide React for icons

**Backend:**

- Express.js with CORS and JSON middleware
- Zod for validation

**Build & Testing:**

- Vite with SWC compilation (fast React refresh)
- Vitest + React Testing Library + jsdom
- TypeScript (non-strict mode currently)
- Husky + lint-staged for pre-commit hooks

**Development Tools:**

- Prettier for code formatting
- pnpm as package manager (see packageManager field in package.json)

### Development Workflow

#### Environment Configuration

- `.env` for environment variables loaded via dotenv
- Client variables must be prefixed with `VITE_`
- Server variables loaded in `server/index.ts` via `dotenv/config`

#### Testing Strategy

- Tests located alongside source files (`.test.ts(x)`, `.spec.ts(x)`)
- Vitest configured with jsdom environment and globals enabled
- React Testing Library for component testing
- Path aliases supported in test environment
- Single-threaded test execution configured for stability

#### Pre-commit Requirements

- Husky runs lint-staged (Prettier) and `npm run typecheck` on commit
- Both formatting and TypeScript validation must pass
- Hook configuration in `.husky/pre-commit`

#### Production Deployment

- Client bundle → `dist/spa/`
- Server bundle → `dist/server/node-build.mjs`
- Server serves static files from `dist/spa/`
- Netlify functions available in `netlify/functions/`
- `netlify.toml` and `api/index.ts` configured for serverless deployment

## Critical Implementation Notes

### Route Management

- All custom routes MUST be added ABOVE the catch-all `*` route in `client/App.tsx`
- Comment at line 30 reminds: `{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`
- NotFound component handles 404s via the catch-all route

### File System Access Control

The Vite dev server has strict file system access controls in `vite.config.ts`:

- **Allow**: `./client`, `./shared`
- **Deny**: `.env`, `.env.*`, `*.{crt,pem}`, `**/.git/**`, `server/**`

This prevents the client from importing server code during development.

### Shared Types Pattern

Use `shared/api.ts` for TypeScript interfaces that both client and server need. This ensures type safety across the full stack without duplicating definitions.

### Component Library Usage

shadcn/ui components are in `client/components/ui/`. These are copied into your project (not installed as npm packages) and can be customized. Configuration in `components.json`.

### Repository Guidelines

See `AGENTS.md` for detailed contributor guidelines including:

- Module organization patterns
- Coding style and naming conventions
- Testing requirements
- Commit message format
- Security and configuration best practices
