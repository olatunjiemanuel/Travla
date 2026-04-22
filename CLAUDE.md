# Travla

## Purpose
AI-powered travel companion that combines real weather data (OpenWeatherMap) with Claude-generated recommendations for any destination and travel date range.

## Stack
- **Frontend:** Vite + React 19 + TypeScript, CSS Modules, `src/styles/variables.css` for design tokens
- **Backend:** ASP.NET Core 9 (C#)
- **HTTP:** Native `fetch` on the frontend — no Axios
- **State:** Discriminated union `AppState` in `App.tsx` — no external state library
- **Routing:** None currently (single-page, view-based state machine)

## Component Conventions
- All components live in `src/Components/ComponentName/index.tsx` (PascalCase folder)
- Colocated styles: `src/Components/ComponentName/index.module.css`
- Pattern: `const Name: React.FC<NameProps> = () => {}` with `import React from 'react'`
- Logic and API calls go in `src/services/`, not inline in components
- TypeScript interfaces in `src/types/travel.ts`

## Layout
- Page centering (`max-width`, `margin: 0 auto`, `padding`) lives in `.contentLayer` in `App.module.css` — not on `#root` in `index.css`
- `InteractiveBackground` (canvas) is rendered once in `App.tsx` at `z-index: 0`; `.contentLayer` sits above it at `z-index: 1`
- Cards use frosted-glass tokens (`--color-glass-bg`, `--color-glass-border`) with `backdrop-filter: blur(12px)` so the background shows through

## CSS Conventions
- CSS Modules only — no Tailwind, no inline styles
- `variables.css` is imported once globally in `index.css` — do not `@import` it in individual modules
- All colours, spacing, radii via `var(--token-name)` — no hardcoded values
- Class names: camelCase (`.weatherCard`, `.summaryTitle`)
- All UI must be responsive — media queries at minimum for ≤ 480px

## Environment Variables
| Variable | Purpose | Used in |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `src/services/travelApi.ts` |

- `.env.local` for local values (gitignored via `*.local`)
- `.env.example` committed with placeholder values

## API / Backend
- Backend runs on `http://localhost:5077` locally
- Single endpoint: `POST /api/travel/summary` — accepts `{ city, startDate, endDate }` (ISO dates), returns weather + AI recommendations
- Weather lookup uses `startDate`; AI prompt receives the full date range
- Claude API key and OpenWeatherMap API key configured in `appsettings.Development.json` (not committed)

## Tests
None yet.

## Deployment
Not yet configured.
