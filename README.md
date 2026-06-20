# FDE OS

AI-native workspace demo for forward-deployed engineering and customer operations.

## About

FDE OS models the workflow of a customer-facing technical team: engagements, notes, risks, commitments, readiness tracking, product signals, and AI-assisted status updates. The repo ships with a React front end and a TypeScript backend, plus seeded demo users for local exploration.

## Key Features

- Demo and API-backed frontend modes
- Authentication and role simulation
- Engagement, notes, risk, commitment, and readiness workflows
- AI-assisted extraction and status update endpoints
- Seeded demo data for local walkthroughs

## Architecture

- `frontend/` is the Vite + React app
- `backend/` is the Express + TypeScript API
- `backend/src/services/ai/` contains the AI helper layer
- `backend/src/seed/seed.ts` loads demo data

## Tech Stack

- React 19
- Vite
- TypeScript
- Node.js + Express
- MongoDB + Mongoose
- Zod
- OpenAI-compatible AI client

## Prerequisites

- Node.js
- MongoDB

## Installation

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Configuration

- Backend: `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`, `CLIENT_URL`
- Frontend: `VITE_API_BASE_URL`

## How to Run

```bash
cd backend
npm run seed
npm run dev

cd ../frontend
npm run dev
```

## Example Usage

- Log in with one of the seeded demo users
- Switch between demo view and API view
- Open an engagement and inspect notes, risks, and status updates

## Project Structure

- `backend/src/routes/` - API surface
- `backend/src/services/` - dashboard and AI services
- `frontend/src/components/` - auth, sidebar, and workspace UI
- `frontend/src/hooks/` - data-loading hooks

## Current Status

Looks like a polished product demo and one of the stronger publish candidates in the workspace.

## Limitations

- No explicit repo-level license
- Backend still depends on a MongoDB instance for full behavior

## License

No explicit license file was found at the repository root.
