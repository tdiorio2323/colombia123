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

### Security & Audit Commands

- `npm run audit:routes` - Crawl application routes using `crawl.js`
- `npm run audit:links` - Check for broken links with linkinator
- `npm run audit:lighthouse` - Run Lighthouse CI performance audits
- `npm run audit:lighthouse:local` - Run local Lighthouse audit with detailed reporting
- `npm run audit:a11y` - Accessibility testing with pa11y-ci
- `npm run audit:zap` - OWASP ZAP security baseline scan
- `npm run audit:all` - Run all audit commands sequentially

### Build Analysis

- `npm run build:analyze` - Generate bundle analysis with rollup-plugin-visualizer

### Database Commands

- `npm run db:up` - Start PostgreSQL database via Docker Compose
- `npm run db:push` - Push schema changes to database without migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Launch Prisma Studio for database management
- `npm run db:seed` - Seed database with initial data

### Deployment Commands

- `npm run deploy:netlify` - Deploy to Netlify (production build)
- `npm run deploy:vercel` - Deploy to Vercel (production build)

## Architecture Overview

This is a **Colombian Creator Platform** - a full-stack monetization platform for content creators built with React + Express, leveraging Stripe Connect for payments and Prisma + PostgreSQL for data persistence.

### Project Structure

```
client/                 # React SPA frontend with lazy-loaded routes
├── components/
│   ├── ui/            # shadcn/ui component library (Radix + Tailwind)
│   ├── ProtectedRoute.tsx  # Route guards (Protected/Guest/Creator-only)
│   ├── SubscriptionCard.tsx # Stripe subscription management
│   ├── TipModal.tsx   # One-time payment processing
│   └── StripeProvider.tsx   # Stripe Elements context
├── contexts/
│   └── AuthContext.tsx    # Supabase authentication
├── pages/             # Route components with lazy loading
│   ├── Index.tsx      # Home page (eagerly loaded)
│   ├── Login.tsx      # Authentication
│   ├── Upload.tsx     # Creator content upload
│   └── Messages.tsx   # Creator messaging
├── lib/
│   ├── utils.ts       # cn() utility (clsx + tailwind-merge)
│   └── stripe.ts      # Stripe client configuration
└── App.tsx           # React Router 6 SPA routing

server/                # Express API backend
├── index.ts          # Server setup with security middleware
├── routes/           # API route handlers
│   ├── creators.ts   # Creator management & analytics
│   ├── subscriptions.ts # Stripe subscription processing
│   ├── payouts.ts    # Creator payout handling
│   └── webhooks.ts   # Stripe webhook processing
├── services/
│   ├── stripeService.ts  # Complete Stripe Connect integration
│   └── paymentService.ts # Legacy payment utilities
├── middleware/
│   ├── security.ts   # Rate limiting, CORS, security headers
│   ├── webhook.ts    # Raw body parsing for Stripe webhooks
│   └── validation.ts # Request validation middleware
└── lib/
    └── logger.ts     # Winston logging configuration

prisma/               # Database schema and migrations
├── schema.prisma     # Prisma database schema
├── migrations/       # Database migration files
└── seed.ts          # Database seeding script

shared/               # TypeScript interfaces for type safety
└── api.ts           # Complete data models (Profile, Creator, Fan, Media, etc.)
```

### Key Architectural Patterns

#### Dual Build System

- **Client build**: Vite SPA build to `dist/spa/` with code splitting
- **Server build**: Vite Node.js build to `dist/server/` with ES modules
- **Development**: Single-port dev server with Express middleware integration

#### Path Aliases & Type System

- `@/*` → `client/*` (components, pages, utilities)
- `@shared/*` → `shared/*` (shared types between client/server)
- All API interfaces in `shared/api.ts` ensure type safety across the stack

#### Security Architecture

- **Rate Limiting**: Tiered rate limits (general/auth/payment specific)
- **CORS**: Environment-specific origins with credentials support
- **Headers**: Helmet.js security headers + CSP
- **Validation**: Zod schemas for request validation
- **Trust Proxy**: Configurable proxy hops for accurate IP detection

#### Route Protection System

- **GuestOnlyRoute**: Redirects authenticated users (login/signup)
- **ProtectedRoute**: Requires authentication
- **CreatorOnlyRoute**: Requires creator role
- Routes must be added ABOVE the catch-all `*` route in App.tsx

#### Payment Architecture (Stripe Connect)

- **Creator Onboarding**: Automatic Stripe Express account creation
- **Revenue Model**: 20% platform commission on all transactions
- **Subscription System**: Monthly recurring payments with cancellation
- **Tip System**: One-time payments with optional messages
- **Webhook Handling**: Secure signature verification for payment events
- **Payout Management**: Automated payouts with minimum thresholds

### Technology Stack

**Frontend:**

- React 18 with Suspense and lazy loading
- React Router 6 (SPA mode)
- TailwindCSS with custom theme
- shadcn/ui component library (Radix UI + Tailwind)
- TanStack React Query for server state
- Framer Motion for animations
- React Hook Form with Zod validation

**Backend:**

- Express.js with comprehensive security middleware
- Stripe Connect for payment processing
- Winston logging with daily rotate files
- Zod for request validation
- Express Rate Limit with multiple tiers

**Database & Auth:**

- Prisma ORM with PostgreSQL for data persistence
- Authentication with role-based access (creator/fan)
- Complete schema for users, creators, subscriptions, transactions

**Build & Testing:**

- Vite with SWC compilation
- Vitest + React Testing Library + jsdom
- TypeScript with strict configuration
- Husky + lint-staged for pre-commit hooks

**Development Tools:**

- Prettier for code formatting
- Lighthouse CI for performance auditing
- pa11y-ci for accessibility testing
- OWASP ZAP for security scanning
- Bundle analyzer for build optimization

### Development Workflow

#### Environment Configuration

- `.env` for environment variables (see existing .env files)
- Client variables must be prefixed with `VITE_`
- Stripe keys required for payment functionality
- Database URL required for Prisma connection

#### Testing Strategy

- Tests located alongside source files (`.test.ts(x)`, `.spec.ts(x)`)
- Vitest configured with jsdom environment
- React Testing Library for component testing
- Path aliases supported in test environment

#### Pre-commit Requirements

- Husky enforces TypeScript validation (`npm run typecheck`)
- Prettier formatting applied automatically via lint-staged
- Both checks must pass for commits to succeed

#### Production Deployment

- Separate client/server bundles deployed together
- Static files served from `dist/spa/`
- Server runs from `dist/server/node-build.mjs`
- Environment-specific configuration for trust proxy and CORS
- Netlify and Vercel deployment support via npm scripts

## Business Model & Revenue

### Creator Monetization Platform

This platform enables Colombian content creators to monetize their audience through:

**Revenue Streams:**

- Monthly subscriptions with creator-set pricing
- One-time tips/donations with custom messages
- Premium content access (future feature)

**Commission Structure:**

- Platform automatically retains 20% of all transactions
- Stripe processing fees (~2.9% + $0.30) deducted
- Creators receive ~77% of gross revenue
- Automated payout processing with minimum thresholds

**Scaling Projections:**

- 100 creators × $50/month avg = $1,000 monthly platform revenue
- 1,000 creators × $50/month avg = $10,000 monthly platform revenue
- Built to scale to thousands of creators and millions in transactions

### Database Schema

The `shared/api.ts` defines complete data models:

**Core Entities:**

- `Profile` - Base user profile with role-based extensions
- `Creator`/`Fan` - Role-specific user types with earnings/spending tracking
- `Media` - Content with premium pricing support
- `Subscription` - Monthly recurring payment relationships
- `Transaction` - Complete payment history and analytics
- `Message` - Direct creator-fan communication

**Key Features:**

- Stripe customer/account ID integration
- Comprehensive earnings and analytics tracking
- Premium content and pricing flexibility
- Transaction history for all payment types

## Critical Implementation Notes

### Route Management

- All custom routes MUST be added above the catch-all `*` route in `client/App.tsx`
- Lazy loading implemented for non-critical pages
- Protected routes require proper authentication context

### Payment Processing

- Never handle sensitive payment data directly
- All transactions processed through Stripe Connect
- Webhook signature verification mandatory for production
- Test mode supported with Stripe test keys

### Security Requirements

- Rate limiting applied to all API routes
- Payment endpoints have stricter rate limits
- Webhooks excluded from rate limiting
- CORS configured for specific origins only
- All user inputs validated with Zod schemas

### Performance Considerations

- Code splitting implemented for optimal loading
- Manual chunks defined for major dependencies (vendor, ui, stripe, supabase)
- Performance dashboard available in development mode
- Bundle analysis available via `npm run build:analyze`

### Testing Requirements

- TypeScript validation required for all commits
- Tests should cover payment flows and authentication
- Accessibility and security audits available
- Use Stripe test environment for development
- Database migrations must be run before starting development (`npm run db:migrate`)
- Use `npm run db:studio` for visual database management
