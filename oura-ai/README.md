# Oura AI Dashboard

A modern dashboard for visualizing and analyzing Oura Ring data using AI-powered insights.

## Features
- FastAPI backend for data processing and API
- React + Vite frontend for interactive dashboards
- TypeScript for type safety
- Poetry for Python dependency management
- Pre-configured CI workflow

## Project Structure
```
oura-ai/
  backend/        # FastAPI backend
  frontend/       # React frontend
  run_backend.sh  # Script to run backend
  README.md       # Project documentation
```

## Getting Started

### Backend (Python/FastAPI)
1. Install dependencies:
   ```bash
   cd oura-ai/backend
   poetry install
   ```
2. Run the backend:
   ```bash
   poetry run uvicorn main:app --reload
   ```

### Frontend (React/Vite)
1. Install dependencies:
   ```bash
   cd oura-ai/frontend
   npm install # or pnpm install
   ```
2. Run the frontend:
   ```bash
   npm run dev
   ```

## Development
- Backend: Python 3.9+, FastAPI
- Frontend: React, TypeScript, Vite
- Linting and formatting pre-configured
