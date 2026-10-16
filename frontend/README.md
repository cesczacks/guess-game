# guess-game frontend

Next.js web client for the guess-game. It talks to the FastAPI backend in [`../backend`](../backend).

## Features

- Start a game, then ask yes/no questions or guess a name (up to 10 tries)
- Each turn shows a 是/否 badge; progress dots track questions used
- When the game ends, the secret figure is revealed with the evidence (依据) for every answer
- The current game is saved in `localStorage`, so a page reload resumes it

## Getting started

The backend must be running on port 8000 (see the [root README](../README.md)).

```bash
bun install
bun dev        # http://localhost:3000
```

Or run both apps from the repo root with `make dev`.

## Scripts

| Script | What it does |
| --- | --- |
| `bun dev` | Dev server with hot reload |
| `bun run build` / `bun start` | Production build / serve |
| `bun run lint` | Biome lint + format check |
| `bun run format` | Biome format (writes files) |

Formatting is enforced by Biome (2-space indent, double quotes). Set Biome as your editor's formatter to avoid lint failures.

## Backend connection

`next.config.ts` rewrites `/api/*` to the backend:

| Env var | Default | Purpose |
| --- | --- | --- |
| `BACKEND_URL` | `http://localhost:8000` | Where `/api/*` requests are proxied |

The proxy timeout is raised to 120s because LLM-backed endpoints can be slow.

## Project layout

```
src/
├── app/
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── page.tsx              # Renders <GuessGame />
│   └── globals.css           # Tailwind + theme colours (paper, ink, seal, jade)
├── components/game/
│   ├── index.tsx             # GuessGame: switches start / game screen
│   ├── use-game.ts           # Game state + actions (start, ask, giveUp, reset)
│   ├── start-screen.tsx      # Title, rules, start button
│   ├── game-screen.tsx       # Header, progress, result banner, turn list
│   ├── question-form.tsx     # Question input + give up
│   └── turn-card.tsx         # One question/answer row
└── lib/
    └── api.ts                # Typed client for the backend API
```

This project uses a recent Next.js with breaking changes; see [AGENTS.md](AGENTS.md) before changing framework code.
