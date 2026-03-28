# Travla

## Purpose
AI-powered travel companion that combines real weather data (OpenWeatherMap) with Claude-generated recommendations for any destination and date.

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
- Single endpoint: `POST /api/travel/summary` — accepts `{ city, travelDate }`, returns weather + AI recommendations
- Claude API key and OpenWeatherMap API key configured in `appsettings.Development.json` (not committed)

## Tests
None yet.

## Deployment
Not yet configured.
