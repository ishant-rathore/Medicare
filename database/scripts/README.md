# Database Deployment Scripts

This directory is reserved for deployment-safe database tooling.

The current backend already exposes Prisma migration commands from `backend/package.json`, including `db:migrate:deploy`. Prefer the existing Prisma workflow for PostgreSQL rather than introducing a second migration engine.

Required operational capabilities:

- Apply PostgreSQL migrations using Prisma in deployment environments.
- Validate schema/migration state before release.
- Initialize and validate SQLite for local/offline operation through the Flutter `sqflite` implementation.
- Keep backup and restore procedures provider-specific and credential-free.
- Never embed database passwords, Firebase service credentials or production URLs in scripts.

Any executable script added here must fail fast on errors, document required environment variables, avoid destructive defaults, and remain safe for CI/non-interactive execution where practical.
