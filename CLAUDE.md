# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Havana** is a creator monetization platform built with React, Express, TypeScript, and Vite. The platform enables content creators to connect with fans through subscriptions, direct messaging, and content sharing, with integrated Stripe payments and Supabase authentication.

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

### Quality Audits

- `npm run audit:routes` - Crawl and verify all application routes
- `npm run audit:links` - Check for broken links using linkinator
- `npm run audit:lighthouse` - Run Lighthouse performance audit
- `npm run audit:a11y` - Run pa11y accessibility tests
- `npm run audit:zap` - Security scan using OWASP ZAP
- `npm run audit:all` - Run all audits sequentially

### Documentation

- `npm run docs:refresh` - Regenerate PROJECT_OVERVIEW.md, ROUTES.md, and README.md overview

## Architecture Overview

### Project Structure

```
client/                 # React SPA frontend
├── components/
│   └── ui/            # shadcn/ui component library (Radix + Tailwind)
├── pages/             # Route components
│   ├── Index.tsx      # Home page
│   ├── Login.tsx      # Authentication
│   ├── Signup.tsx
│   ├── Profile.tsx    # User profile
│   ├── Messages.tsx   # Direct messaging
│   ├── Leaderboard.tsx
│   ├── Upload.tsx     # Media upload
│   ├── Showcase.tsx   # Creator showcase
│   ├── SmartReply.tsx # AI-powered replies
│   ├── Services.tsx
│   ├── Shop.tsx
│   ├── Community.tsx
│   ├── Calendar.tsx
│   └── NotFound.tsx   # 404 page
├── contexts/          # React contexts (auth, theme, etc.)
├── hooks/             # Custom React hooks
└── lib/
    └── utils.ts       # cn() utility (clsx + tailwind-merge)

server/                # Express API backend
├── index.ts           # Server setup (createServer export)
├── routes/            # API route handlers
│   ├── auth.ts        # Authentication endpoints
│   ├── creators.ts    # Creator management
│   ├── subscriptions.ts # Stripe subscription handling
│   ├── payouts.ts     # Payment distribution
│   ├── messages.ts    # Messaging system
│   ├── profiles.ts    # User profiles
│   ├── upload.ts      # File upload
│   ├── media.ts       # Media management
│   ├── smart-reply.ts # AI reply generation
│   ├── users.ts       # User management
│   ├── webhooks.ts    # Stripe webhooks
│   └── db.ts          # Database utilities
├── middleware/        # Express middleware
├── services/          # Business logic layer
└── lib/               # Server utilities

shared/                # TypeScript interfaces shared between client/server
└── api.ts             # Type definitions for API contracts

prisma/                # Database schema and migrations
├── schema.prisma      # Prisma schema definition
├── migrations/        # Database migrations
└── seed.ts            # Database seeding script
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
- Three.js with React Three Fiber for 3D graphics

**Backend:**

- Express.js with CORS and JSON middleware
- Zod for validation
- Supabase for authentication and real-time database
- Stripe for payment processing
- Prisma as database ORM
- Gemini AI for smart reply generation

**Build & Testing:**

- Vite with SWC compilation (fast React refresh)
- Vitest + React Testing Library + jsdom
- TypeScript (non-strict mode currently)
- Husky + lint-staged for pre-commit hooks

**Development Tools:**

- Prettier for code formatting
- pnpm as package manager (see packageManager field in package.json)
- Docker & Docker Compose for containerization

### Development Workflow

#### Environment Configuration

- `.env` for environment variables loaded via dotenv
- Client variables must be prefixed with `VITE_`
- Server variables loaded in `server/index.ts` via `dotenv/config`

**Required Environment Variables** (see `.env.example`):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase config
- `GEMINI_API_KEY` - AI integration
- `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe payment integration

#### Database Setup

The project uses Prisma with Supabase. Database schema is defined in `prisma/schema.prisma`. For database setup:

1. Configure Supabase URL and keys in `.env`
2. Run migrations: `npx prisma migrate dev`
3. Seed database: `npx prisma db seed`

See `DATABASE_MIGRATION_COMPLETE.md` for migration details.

#### Payment Integration

Stripe is integrated for subscription payments. See `STRIPE_SETUP.md` and `PAYMENT_SYSTEM_COMPLETE.md` for detailed setup instructions. Webhook endpoints are handled in `server/routes/webhooks.ts`.

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
- Docker Compose configuration available for containerized deployment
- See `RUNBOOK.md` for operations procedures

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

### Security Considerations

- Never commit secrets or API keys (check `.gitignore`)
- Validate all inputs with Zod on the server
- Use Supabase Row Level Security (RLS) for database access control
- Stripe webhook signatures are verified in webhook handlers
- See `SECURITY.md` for comprehensive security guidelines

### AI Integration

Smart reply features use Gemini AI. The `server/routes/smart-reply.ts` endpoint requires `GEMINI_API_KEY` to be configured. See `GEMINI.md` for integration details.

## Additional Documentation

- **AGENTS.md** - Repository guidelines for contributors (coding style, testing, commit format)
- **RUNBOOK.md** - Operations guide (deployment, monitoring, maintenance, incident response)
- **SECURITY.md** - Security best practices and policies
- **STRIPE_SETUP.md** - Payment integration setup guide
- **PAYMENT_SYSTEM_COMPLETE.md** - Payment system implementation details
- **DATABASE_MIGRATION_COMPLETE.md** - Database migration notes
