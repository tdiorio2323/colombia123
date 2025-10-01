# Project Overview

Repo: `colombia`
Name: `fusion-starter`
Version: ``

## Structure
    .
    ├── AGENTS.md
    ├── api
    │   └── index.ts
    ├── bundle-analysis.html
    ├── caloc
    ├── CLAUDE.md
    ├── client
    │   ├── App.tsx
    │   ├── components
    │   ├── contexts
    │   ├── data
    │   ├── global.css
    │   ├── global.css.test.ts
    │   ├── hooks
    │   ├── lib
    │   ├── MinimalApp.tsx
    │   ├── pages
    │   ├── SimpleApp.tsx
    │   └── vite-env.d.ts
    ├── components.json
    ├── crawl.js
    ├── DATABASE_MIGRATION_COMPLETE.md
    ├── dev.log
    ├── docker-compose.override.yml
    ├── docker-compose.yml
    ├── Dockerfile
    ├── docs
    │   ├── CLAUDE.md
    │   ├── SECURITY.md
    │   └── STRIPE_TEST_PLAN.md
    ├── fix-types.cjs
    ├── GEMINI.md
    ├── index.html
    ├── logs
    │   ├── combined-2025-09-16.log
    │   ├── error-2025-09-14.log
    │   ├── error-2025-09-15.log
    │   ├── error-2025-09-16.log
    │   ├── exceptions-2025-09-14.log
    │   ├── exceptions-2025-09-15.log
    │   ├── exceptions-2025-09-16.log.gz
    │   ├── exceptions-2025-09-17.log
    │   ├── rejections-2025-09-14.log
    │   ├── rejections-2025-09-15.log
    │   ├── rejections-2025-09-16.log
    │   └── requests-2025-09-16.log
    ├── luiciana-links
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   ├── src
    │   ├── tsconfig.json
    │   └── vite.config.ts
    ├── medellin-platform
    │   ├── apps
    │   ├── docs
    │   ├── infra
    │   ├── medellin-platform
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── packages
    │   └── turbo.json
    ├── minimal.html
    ├── Navbar.tsx
    ├── netlify
    │   └── functions
    ├── netlify.toml
    ├── pa11y-ci.json
    ├── package-lock.json
    ├── package.json
    ├── PAYMENT_INTEGRATION_STATUS.md
    ├── PAYMENT_SYSTEM_COMPLETE.md
    ├── pnpm-lock.yaml
    ├── postcss.config.js
    ├── prisma
    │   ├── migrations
    │   ├── schema.prisma
    │   └── seed.ts
    ├── PROJECT_OVERVIEW.md
    ├── public
    │   ├── favicon.ico
    │   ├── generate-sitemap.js
    │   ├── placeholder.svg
    │   └── robots.txt
    ├── README.md
    ├── request.json
    ├── ROUTES.md
    ├── RUNBOOK.md
    ├── scripts
    │   ├── project_overview.sh
    │   ├── readme_overview.sh
    │   └── routes_report.sh
    ├── SECURITY.md
    ├── server
    │   ├── index.ts
    │   ├── lib
    │   ├── middleware
    │   ├── node-build.ts
    │   ├── routes
    │   ├── services
    │   └── types
    ├── server.out.log
    ├── setup-database.sh
    ├── shared
    │   └── api.ts
    ├── STRIPE_SETUP.md
    ├── tailwind.config.ts
    ├── test.html
    ├── tsconfig.json
    ├── uploads
    ├── vercel.json
    ├── vite.config.server.ts
    ├── vite.config.ts
    ├── vitest.config.ts
    ├── vitest.setup.ts
    ├── zap-baseline.sh
    └── zap-baseline.test.sh
    
    35 directories, 83 files

### Key Directories
- `client/`: React SPA (pages, components, global styles).
- `server/`: Express API (index.ts, routes/).
- `shared/`: TS contracts and cross-layer utilities.
- `dist/`: Production build outputs.

## Scripts

- dev
-  build
-  build:client
-  build:server
-  start
-  test
-  format.fix
-  typecheck
-  docs:refresh

## Dependencies
- deps: dotenv, express, zod
- devDeps: @hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-label, @radix-ui/react-menubar, @radix-ui/react-navigation-menu, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-select, @radix-ui/react-separator, @radix-ui/react-slider, @radix-ui/react-slot, @radix-ui/react-switch, @radix-ui/react-tabs, @radix-ui/react-toast, @radix-ui/react-toggle, @radix-ui/react-toggle-group, @radix-ui/react-tooltip, @react-three/drei, @react-three/fiber, @swc/core, @tailwindcss/typography, @tanstack/react-query, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/cors, @types/express, @types/node, @types/react, @types/react-dom, @types/three, @vitejs/plugin-react-swc, autoprefixer, class-variance-authority, clsx, cmdk, cors, date-fns, embla-carousel-react, framer-motion, globals, input-otp, jsdom, lucide-react, next-themes, postcss, prettier, react, react-day-picker, react-dom, react-hook-form, react-resizable-panels, react-router-dom, recharts, serverless-http, sonner, tailwind-merge, tailwindcss, tailwindcss-animate, three, tsx, typescript, vaul, vite, vitest

## Environment Variables
From .env.example:
- ``# Client/Server shared environment variables
- ``
- ``
- ``
- ``# Stripe Configuration
- ``STRIPE_SECRET_KEY=****
- ``VITE_STRIPE_PUBLISHABLE_KEY=****
- ``STRIPE_WEBHOOK_SECRET=****
- ``STRIPE_CLIENT_ID=****
- ``
- ``# Application URLs
- ``CLIENT_URL=****
- ``SERVER_URL=****
- ``PRODUCTION_URL=****
- ``
- ``# Security Configuration
- ``TRUST_PROXY_HOPS=****
- ``NODE_ENV=****
- ``
- ``# Server-side only
- ``GEMINI_API_KEY=****
- ``
- ``# Optional: used by link audits
- ``# BASE_URL=****
- ``
- ``# Development/Testing
- ``PING_MESSAGE=****
- ``

## Client Routes
- *
- /
- /about
- /calendar
- /community
- /contact
- /services
- /shop

## Server Routes
- Uget *
- Uget /api/demo
- Uget /api/ping

## Testing
- Vitest present. Run `npm test`.

## Build & Run
- Dev: `npm run dev`
- Prod build: `npm run build` then `npm start`
