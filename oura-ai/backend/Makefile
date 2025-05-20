# Makefile for backend

.PHONY: install run lint test

install:
	/Users/martin/.local/bin/poetry install

run:
	/Users/martin/.local/bin/poetry run uvicorn backend.main:app --reload --reload-dir=.

lint:
	/Users/martin/.local/bin/poetry run flake8 .

test:
	/Users/martin/.local/bin/poetry run pytest
