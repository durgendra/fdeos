# FDE OS Backend

Express + TypeScript + MongoDB backend for FDE OS. The frontend is not connected yet.

## Install

```bash
cd backend
npm install
cp .env.example .env
```

Set `MONGODB_URI` to a MongoDB Atlas connection string and `JWT_SECRET` to a long random value.

## MongoDB Atlas

1. Create an Atlas cluster.
2. Add a database user.
3. Allow your IP address in Network Access.
4. Copy the connection string into `.env` as `MONGODB_URI`.

## Commands

```bash
npm run dev
npm run build
npm start
npm run seed
npm run lint
```

Seed users:

- `admin@example.com`
- `manager@example.com`
- `fde@example.com`
- password: `Password123!`

## API Overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/effective-session`
- Roles: `GET /api/roles`, `PATCH /api/roles/:id`, `POST /api/roles/:id/reset-defaults`
- Permissions: `GET /api/permissions/catalog`
- Users: `GET /api/users`, `POST /api/users`, `PATCH /api/users/:id`, `PATCH /api/users/:id/role`, `PATCH /api/users/:id/disable`
- Engagements: `GET/POST /api/engagements`, `GET/PATCH/DELETE /api/engagements/:id`
- Notes: `GET/POST /api/engagements/:engagementId/notes`, `GET/PATCH/DELETE /api/notes/:id`
- AI: `POST /api/ai/extract-notes`, `POST /api/ai/apply-extraction`, `POST /api/ai/generate-status-update`
- Dashboard: `GET /api/dashboard/summary`, `GET /api/dashboard/product-intelligence`

## Auth Example

```bash
curl -X POST http://localhost:5055/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'
```

Use the returned token:

```bash
curl http://localhost:5055/api/auth/effective-session \
  -H "Authorization: Bearer TOKEN"
```

Admin role simulation:

```bash
curl http://localhost:5055/api/auth/effective-session \
  -H "Authorization: Bearer TOKEN" \
  -H "X-Simulated-Role: fde"
```

Mock extraction works without `OPENAI_API_KEY`:

```bash
curl -X POST http://localhost:5055/api/ai/extract-notes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"engagementId":"ENGAGEMENT_ID","rawText":"Security review is blocked until Snowflake access is approved.","sourceType":"Meeting Notes","title":"Discovery call notes"}'
```
