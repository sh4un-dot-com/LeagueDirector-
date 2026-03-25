# League Director

A proof-of-concept unified fantasy league platform for infinite sports, built with React frontend and Node.js + PostgreSQL backend.

## Goals

- Support sports: F1, UFC, IPSC, Soccer, etc.
- Dynamic, JSON-based scoring engine (no fixed stat columns)
- Commissioner sandbox rules builder
- Live match ingestion (API + manual override)
- Ledger and escrow style payout calculation
- Real-time draft/chat via Socket.io

## Architecture

### Frontend
- `LeagueDirectorApp.jsx` (React) includes:
  - Sidebar with sports categories and gender/region filters
  - Tabs: Command Center, Scoring Sandbox, League Ledger, Trash Talk
  - Scoring DSL UI with action keys, point values, condition JSON
  - Live event table showing computed scores from `match_data`

### Backend
- `server/index.js` (Express + Socket.io)
- API routes:
  - `POST /leagues/:id/rules` (create scoring rule)
  - `POST /matches/:id/results` (upsert match stats)
  - `POST /ledger/payouts` (compute and store payouts)
  - `GET /ledger/scores/:leagueId` (calculate scoring totals)

### DB schema
- `server/db/schema.sql`
  - `sports`, `entities`, `leagues`, `scoring_rules`, `match_data`, `payouts`
  - Uses JSONB for `stat_schema`, `payout_rules`, `condition`, `raw_stats`

### Scoring Service
- `server/services/scoringService.js`
  - `evaluateRule`, `calculateEntityScore`, `calculateLeagueScores`

### Worker
- `server/worker/liveIngestion.js` (in-memory queue) and periodic flush.

## Setup

1. Copy `.env.example` to `.env` and fill in: `DATABASE_URL`, `PORT`, `STRIPE_SECRET_KEY`.
2. Create PostgreSQL database:
   - `createdb league_director`
3. Run schema migration:
   - `npm run db:migrate`
4. Install dependencies:
   - `npm install`
5. Start server:
   - `npm start` (or `npm run dev`)
6. Start frontend (if using existing React app flow).

## API examples

### Add scoring rule

```bash
curl -X POST http://localhost:4000/leagues/<leagueId>/rules \
  -H "Content-Type: application/json" \
  -d '{"action_key":"fastest_lap", "point_value":10, "condition":{"multiplier":1}}'
```

### Upsert match results

```bash
curl -X POST http://localhost:4000/matches/<matchId>/results \
  -H "Content-Type: application/json" \
  -d '{"entity_id":"<eid>", "sport_id":"<sid>", "raw_stats":{"pit_stops":2,"laps_led":51}}'
```

### Payout calculation

```bash
curl -X POST http://localhost:4000/ledger/payouts \
  -H "Content-Type: application/json" \
  -d '{"league_id":"<leagueId>", "results":[{"entity_id":"<id>","score":120}]}'}
```

## Real-time features

- Websockets in `server/index.js`:
  - `draft:join`, `draft:pick`, `chat:message`

## Next enhancements

1. Add auth + roles (commissioner/team member)
2. Move worker to Redis/BullMQ for robust ingestion
3. Build dedicated admin UI for stat ingestion
4. Integrate Stripe Connect real transfers + webhook handling
5. Add persistent drafts, teams, and user profile tables
6. Add test suite for service & route logic (Jest/Supertest)

## Notes

- This repo currently has limited local state in JS.
- Production should never trust raw `condition` or `raw_stats` as text; these are validated server-side.

