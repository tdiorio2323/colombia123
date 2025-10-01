# Fusion Starter
# Repository Guidelines

This guide explains how to work effectively in this Fusion Starter repo (React + Express + Vite + Tailwind + Vitest).

## Project Structure & Module Organization
- Client SPA: `client/` (pages in `client/pages/`, UI in `client/components/`, utilities in `client/lib/`).
- Server API: `server/` (Express setup in `server/index.ts`, handlers in `server/routes/`). All endpoints under `/api/*`.
- Shared types: `shared/` (e.g., `shared/api.ts`) imported via `@shared/*`. Client alias `@/*` maps to `client/*`.
- Assets: `public/`. Build output: `dist/`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite + Express on one port with hot reload.
- `npm run build` — Build client and server bundles.
- `npm start` — Run the production server from `dist/`.
- `npm test` — Run Vitest unit tests.
- `npm run typecheck` — TypeScript checks.
- `npm run format.fix` — Format code with Prettier.

## Coding Style & Naming Conventions
- TypeScript everywhere; 2‑space indentation (see `.prettierrc`).
- React components/pages: PascalCase filenames (e.g., `Index.tsx`, `CreatorPage.tsx`).
- Non-React modules: kebab-case or lowerCamelCase filenames (e.g., `use-toast.ts`, `smart-reply.ts`).
- Prefer `@/` and `@shared/` path aliases. Use the `cn()` utility for conditional class names.
- Server endpoints: only add when logic must reside on the server (e.g., API keys, DB). Keep handlers small and typed via `@shared/api`.

## Testing Guidelines
- Framework: Vitest. Place tests near sources using `*.test.ts(x)` or `*.spec.ts(x)` (e.g., `client/pages/Calendar.test.tsx`).
- Test React components with React Testing Library patterns; mock network where applicable.
- Aim to cover key route logic, shared utilities, and server handlers.

## Commit & Pull Request Guidelines
- Commit messages: imperative, concise; prefer Conventional Commits when possible (e.g., `feat: add leaderboard route`).
- Pull Requests: include summary, linked issues, screenshots for UI, steps to test, and note any API or schema changes.
- Keep PRs focused and small; update docs and shared types when interfaces change.

## Security & Configuration Tips
- Configure secrets via environment variables (e.g., `GEMINI_API_KEY`); never commit secrets.
- Validate inputs with Zod and keep API responses typed via shared interfaces.
A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly neccesary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `npm run build` + `npm start`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces
