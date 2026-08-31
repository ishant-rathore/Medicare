# Medicare Backend

Production-oriented modular-monolith backend for Medicare.

## Architecture

`Route → Middleware → Controller → Service → Repository → PostgreSQL`

The backend is a secondary cloud path. Local Android reminders remain operational without network access.

## Structure

- `src/app.ts` — Express application composition
- `src/server.ts` — process/bootstrap entrypoint
- `src/config/` — environment, Firebase, database and logging configuration
- `src/middleware/` — authentication, authorization, validation, request IDs, rate limiting and errors
- `src/modules/` — feature-bounded modules
- `src/db/prisma/` — Prisma schema and migrations
- `src/shared/` — cross-cutting errors, response helpers and shared utilities/types as introduced
- `src/docs/` — backend implementation documentation
- `src/tests/` — unit, integration and fixture test suites
- `seeds/` — explicitly non-production seed entrypoints

## Security boundaries

- Verify Firebase ID tokens server-side.
- Never trust client-supplied identity, role, ownership or permissions.
- Enforce resource-level authorization.
- Validate all inputs and state transitions.
- Keep secrets and database credentials outside the application bundle and source control.
- Do not log tokens, credentials or unnecessary medication data.

## Data and synchronization

PostgreSQL is canonical cloud persistence. Offline mutations use stable event identity and must be processed idempotently.

## Production rule

Do not add clinical decision support, autonomous dose changes, or cloud dependencies to the local reminder critical path.
