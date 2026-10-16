# guess-game

A "20 questions"-style guessing game about Chinese historical figures.

```
.
├── backend/    # LangGraph game + FastAPI server (Python, uv)
└── frontend/   # Next.js web client that talks to the backend API (bun)
```

## Run locally

```bash
make install   # uv sync + bun install
make dev       # backend on :8000 and frontend on :3000, Ctrl+C stops both
```

`make backend` or `make frontend` runs just one.

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for details.
