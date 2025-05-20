# Makefile for Ōura Dashboard Monorepo

.PHONY: run run-backend run-frontend install install-backend install-frontend

# Run both backend and frontend (in background)
run: run-backend run-frontend

run-backend:
	cd oura-ai/backend && \
	if [ ! -d ".venv" ]; then poetry install; fi && \
	poetry run uvicorn main:app --reload &

run-frontend:
	cd oura-ai/frontend && pnpm dev &

# Install all dependencies
install: install-backend install-frontend

install-backend:
	cd oura-ai/backend && $${POETRY:-poetry} install

install-frontend:
	cd oura-ai/frontend && pnpm install
