#!/bin/bash
cd "$(dirname "$0")/backend"
source ../.venv/bin/activate
poetry run uvicorn main:app --reload
