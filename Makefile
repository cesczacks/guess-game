.PHONY: dev backend frontend install

dev:
	@$(MAKE) -j2 backend frontend

backend:
	cd backend && uv run fastapi dev

frontend:
	cd frontend && bun dev

install:
	cd backend && uv sync
	cd frontend && bun install
