# Travla — AI-Powered Travel Companion

A fullstack web application that combines real-time weather data with AI-generated travel recommendations. Enter any destination and travel date, and Travla returns a weather forecast alongside personalised suggestions for what to pack, what to do, and what to expect.

**Live demo:** [travel-companion-eight-theta.vercel.app](https://travel-companion-eight-theta.vercel.app)

---

## Why This Project Exists

Travla started as a deliberate exercise in building a complete, production-shaped application across two very different stacks — a React/TypeScript frontend and a C#/.NET backend — connected through a clean REST API. The goal was to demonstrate end-to-end ownership: from UI design and state management through to API integration, external service orchestration, and deployment.

---

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, CSS Modules  
**Backend** — ASP.NET Core 9 (C#)  
**APIs** — OpenWeatherMap (weather data), Anthropic Claude API (travel recommendations)  
**CI/CD** — GitHub Actions  
**Hosting** — Vercel (frontend), Railway (backend)

---

## Architecture Overview

The app follows a straightforward client-server pattern with a single, focused API endpoint.

```
┌──────────────────────┐       POST /api/travel/summary       ┌──────────────────────────┐
│                      │  ──────────────────────────────────►  │                          │
│   React + TypeScript │       { city, travelDate }            │   ASP.NET Core 9 (C#)    │
│   (Vite / Vercel)    │                                       │                          │
│                      │  ◄──────────────────────────────────  │   ┌──────────────────┐   │
└──────────────────────┘    weather + AI recommendations       │   │ OpenWeatherMap   │   │
                                                               │   │ Claude API       │   │
                                                               │   └──────────────────┘   │
                                                               └──────────────────────────┘
```

The backend receives a city and date, fetches a weather forecast from OpenWeatherMap, feeds that context into Claude to generate tailored travel advice, and returns the combined result to the frontend. This keeps the frontend thin and the API key management server-side where it belongs.

---

## Key Technical Decisions

**Discriminated union state machine** — `App.tsx` models the UI as explicit states (`idle`, `loading`, `success`, `error`) using a TypeScript discriminated union rather than a handful of loosely coupled booleans. This eliminates impossible states at the type level and makes the component logic easier to reason about.

**CSS Modules with design tokens** — All styling uses CSS Modules scoped to each component, with a shared `variables.css` file providing colour, spacing, and radius tokens. No Tailwind, no CSS-in-JS — just standard, maintainable CSS with zero runtime cost.

**Service layer separation** — API calls live in `src/services/`, not inline in components. This keeps components focused on rendering and makes the data layer independently testable.

**No unnecessary dependencies** — HTTP is handled via native `fetch`, state via React's built-in hooks, and routing isn't needed yet so it isn't installed. The dependency footprint is intentionally small.

---

## Project Structure

```
Travla/
├── travel-companion-frontend/
│   ├── src/
│   │   ├── Components/          # PascalCase folders, each with index.tsx + index.module.css
│   │   ├── services/            # API call logic (travelApi.ts)
│   │   ├── types/               # TypeScript interfaces (travel.ts)
│   │   └── styles/              # Design tokens (variables.css)
│   ├── .env.example             # Environment variable template
│   └── package.json
├── travel-companion-backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   └── Program.cs
├── .github/workflows/           # CI/CD pipeline
└── CLAUDE.md                    # Project conventions for AI-assisted development
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- .NET 9 SDK
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)
- An [Anthropic API key](https://console.anthropic.com/)

### Backend

```bash
cd travel-companion-backend
# Add your API keys to appsettings.Development.json
dotnet run
# Runs on http://localhost:5077
```

### Frontend

```bash
cd travel-companion-frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:5077
npm install
npm run dev
```

---

## Built With AI — Here's How

This project was built with significant assistance from AI tools, and I want to be transparent about that because I think it reflects how modern software is increasingly developed.

**Claude Code (Anthropic)** was used as the primary development partner throughout the project. The `CLAUDE.md` file in the repo root served as a living conventions document — a set of architectural rules, naming patterns, and project constraints that guided Claude's code generation to stay consistent with the decisions I'd made. This is an emerging pattern in AI-assisted development where the developer acts as architect and reviewer while the AI accelerates implementation.

### Custom Claude Skills Used

I built and maintained a suite of custom Claude skills — reusable prompt-driven workflows that enforce project conventions automatically. These aren't generic AI prompts; they encode my specific architectural decisions so the AI stays consistent across sessions. Five skills were used directly in this project's development:

| Skill | What it does |
|---|---|
| **`new-project`** | Scaffolds a full Vite + React + TypeScript project with my conventions baked in — folder structure, Prettier config, design tokens, `CLAUDE.md`, and Git/GitHub setup. This is how Travla was initialised. |
| **`frontend-design`** | Runs a structured design conversation (layout, colour palette, typography, spacing) before any code is written, then generates the `variables.css` design token file. Ensures design decisions are made upfront, not ad hoc. |
| **`new-component`** | Scaffolds a new React component following project conventions — PascalCase folder, `index.tsx`, colocated CSS Module, typed props interface. Every component in Travla was created through this workflow. |
| **`review`** | Audits code against the project's own conventions: naming, CSS Modules usage, design token compliance, component structure, error handling, responsiveness. Acts as an automated consistency checker between the `CLAUDE.md` rules and the actual codebase. |
| **`security-review`** | Performs a security-focused PR review covering secrets exposure, XSS, injection, auth gaps, CORS, input validation, rate limiting, and dependency vulnerabilities. Runs against the diff, not the full codebase, so it catches regressions at the PR level. |

These skills are themselves versioned and iterable — they include a self-correction mechanism where any new class of issue found during a review gets added back into the skill's checklist, so coverage improves over time.

### What I did vs. what the AI did

- I made all architectural decisions — the stack choice, the state management pattern, the CSS strategy, the API design
- I designed and wrote the custom skills that governed how the AI operated within my conventions
- I wrote and maintained the `CLAUDE.md` conventions file that constrained how the AI wrote code
- I reviewed, tested, and iterated on every piece of generated code
- Claude Code accelerated the implementation of boilerplate, component scaffolding, and API integration logic
- The AI was a tool I directed, not a replacement for understanding the code

---

## What I'd Do Next

- Add unit and integration tests (Jest + React Testing Library for the frontend, xUnit for the backend)
- Containerise with Docker for consistent local development
- Add a loading skeleton UI for better perceived performance
- Expand the API to support multi-day itineraries
- Add user accounts and saved trips

---

## Contact

**Emmanuel Adenuga**  
[LinkedIn](https://linkedin.com/in/olatunjiadenuga) · [GitHub](https://github.com/olatunjiemanuel) · [olatunjiemanuel15@gmail.com](mailto:olatunjiemanuel15@gmail.com)
