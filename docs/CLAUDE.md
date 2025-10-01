# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start Vite + Express dev server with hot reload on single port
- `npm run build` - Build both client and server bundles (`npm run build:client && npm run build:server`)
- `npm run start` - Run production server from `dist/`
- `npm test` - Run Vitest unit tests
- `npm run typecheck` - TypeScript validation (required for commits)
- `npm run format.fix` - Format code with Prettier

### Single Test Execution

Run individual tests with: `npm test -- path/to/test.spec.ts`

### Pre-commit Hooks

Husky runs `lint-staged` (Prettier formatting) + `npm run typecheck` on commit. Both must pass.

### Additional Commands

- `npm run audit:routes` - Crawl and audit application routes
- `npm run audit:links` - Check for broken links using linkinator
- `npm run audit:lighthouse` - Run Lighthouse CI performance audits
- `npm run audit:a11y` - Run accessibility tests with pa11y-ci
- `npm run audit:zap` - Run OWASP ZAP security baseline scan
- `npm run audit:all` - Run all audit commands sequentially

## Architecture Overview

This is a **Fusion Starter** - a full-stack React + Express application with Vite build system.

### Project Structure

```
client/               # React SPA frontend
├── pages/           # Route components (Index.tsx = home route)
├── components/ui/   # Radix UI + Tailwind component library
├── lib/            # Utilities (utils.ts with cn() helper)
└── App.tsx         # React Router 6 SPA routing setup

server/              # Express API backend
├── index.ts        # Server setup with CORS, middleware
└── routes/         # API handlers

shared/             # TypeScript interfaces for client/server
└── api.ts          # Shared types (e.g., DemoResponse, SmartReplyRequest)
```

### Key Architectural Patterns

#### Routing System

- **Client routing**: React Router 6 SPA mode in `client/App.tsx`
- **API routing**: Express routes in `server/index.ts` under `/api/*` prefix
- **Route convention**: All custom routes must be added ABOVE the catch-all `*` route in App.tsx

#### Path Aliases

- `@/*` maps to `client/*` (e.g., `import { Button } from "@/components/ui/button"`)
- `@shared/*` maps to `shared/*` (e.g., `import { DemoResponse } from "@shared/api"`)

#### Shared Type System

All API interfaces defined in `shared/api.ts` for type safety between client/server:

```typescript
// Define in shared/api.ts
export interface MyApiResponse {
  message: string;
}

// Use in server/routes/
const response: MyApiResponse = { message: "hello" };

// Use in client code
const data: MyApiResponse = await fetch("/api/endpoint").then((r) => r.json());
```

#### UI Component System

- **Base library**: Radix UI components in `client/components/ui/`
- **Styling**: TailwindCSS with custom theme in `client/global.css`
- **Utility**: `cn()` function from `client/lib/utils.ts` combines clsx + tailwind-merge

### Technology Stack

- **Frontend**: React 18, React Router 6, TailwindCSS, Radix UI, Lucide React
- **Backend**: Express with CORS, dotenv for environment variables, Stripe payments
- **Database**: PostgreSQL 15 with Prisma ORM for data persistence and type-safe database access
- **Authentication**: Custom JWT-based authentication with role-based access (CREATOR/FAN/ADMIN)
- **Build**: Vite with SWC, dual client/server builds
- **Testing**: Vitest + React Testing Library + jsdom
- **State**: TanStack React Query for server state
- **Dev Tools**: TypeScript, Prettier, Husky + lint-staged
- **Additional Libraries**: Zod for validation, Framer Motion, React Hook Form

### Development Workflow

1. **Development**: Single-port dev server proxies `/api/*` to Express backend
2. **Testing**: Tests located alongside source files (`.test.ts(x)` or `.spec.ts(x)`)
3. **Type Checking**: Always run `npm run typecheck` before commits (enforced by Husky)
4. **Production**: Separate client/server bundles deployed together

### Environment Configuration

- Environment variables in `.env` (see `.env.example` for reference)
- Server accesses via `process.env.VARIABLE_NAME`
- Client environment variables must be prefixed with `VITE_`

### Database Setup & Migration

**Database Migration Complete**: This project has been migrated from Supabase to a local PostgreSQL + Prisma setup.

#### Quick Setup

1. **Start Database**: `docker-compose up -d` (requires Docker)
2. **Database Schema**: `npx prisma db push` (creates tables)
3. **Optional Seed Data**: `npx prisma db seed` (adds sample data)
4. **Database Studio**: `npx prisma studio` (visual database browser)

#### Architecture Details

- **Database**: PostgreSQL 15 running in Docker container
- **ORM**: Prisma with comprehensive schema at `prisma/schema.prisma`
- **Service Layer**: Complete service classes in `server/services/`
  - `UserService` - User management and profile operations
  - `SubscriptionService` - Stripe subscription handling with Prisma
  - `TransactionService` - Payment transaction tracking
- **Database Health**: `/api/db/health` endpoint for connection monitoring
- **Revenue Model**: 20% platform commission preserved from original design
- **Stripe Integration**: Maintained with Stripe Connect for creator payouts

#### Key Migration Changes

- All snake_case fields converted to camelCase (e.g., `user_id` → `userId`)
- Enum values updated to UPPER_CASE (`"creator"` → `"CREATOR"`)
- Service layer handles all database operations with proper error handling
- Prisma relationships ensure referential integrity
- Connection pooling and transaction management built-in

## Application-Specific Architecture

### Creator Platform Features

This application implements a creator monetization platform with:

- **User Roles**: Three-tier system with `CREATOR`, `FAN`, and `ADMIN` roles via custom JWT authentication
- **Content Management**: Media upload/sharing system with premium content support
- **Payment System**: Stripe integration for subscriptions, tips, and content purchases
- **Messaging**: Direct messaging between creators and fans
- **Authentication Flow**: Protected routes with role-based access control

### Key Components & Routes

- **Authentication**: Login/Signup pages with role selection (`client/pages/Login.tsx`, `client/pages/Signup.tsx`)
- **Creator Features**: Upload content (`client/pages/Upload.tsx`), messaging (`client/pages/Messages.tsx`)
- **Protected Routing**: `ProtectedRoute`, `GuestOnlyRoute`, `CreatorOnlyRoute` components
- **Payment Integration**: Subscription cards, tip modals, payout management

### API Architecture

The server implements several specialized route modules:

- `/api/creators` - Creator profile and content management
- `/api/subscriptions` - Stripe subscription handling
- `/api/payouts` - Creator payment processing
- `/api/webhooks` - Stripe webhook processing for payment events
- Authentication context integration with Prisma and JWT tokens

### Database Schema (PostgreSQL + Prisma)

The database schema is defined in `prisma/schema.prisma` with corresponding TypeScript types in `shared/api.ts`:

#### Core Models

- **User**: Base user authentication and Stripe customer data
- **Profile**: Extended user profiles with role-specific fields (CREATOR/FAN/ADMIN)
  - Creator fields: `subscriptionPrice`, `tipEnabled`, `stripeAccountId`, `mediaCount`, `subscriberCount`, `totalEarnings`
  - Fan fields: `subscriptionCount`, `totalSpent`
- **Media**: Creator content with premium/pricing support
  - Supports IMAGE, VIDEO, AUDIO types
  - Premium content with individual pricing
- **Subscription**: Creator subscription management with Stripe integration
  - Active/canceled status tracking
  - Automatic renewal handling via webhooks
- **Message**: Direct messaging between creators and fans
  - Read status tracking
  - Content moderation ready
- **Transaction**: Complete payment tracking
  - Supports SUBSCRIPTION, TIP, and MEDIA_PURCHASE types
  - Stripe Payment Intent integration
  - PENDING/COMPLETED/FAILED/REFUNDED status tracking
- **CreatorEarning**: Daily analytics and revenue tracking
  - Platform fee calculation (20% commission)
  - Stripe fee tracking
  - Net earnings calculation

#### Service Layer Integration

All database operations go through service classes that provide:

- Prisma transaction management
- Error handling and logging
- Type-safe operations
- Business logic enforcement
