# PostgreSQL Migrations

This directory contains the versioned SQL baseline for the Medicare PostgreSQL database.

- Apply migrations in numeric order.
- Review migrations before production deployment.
- Do not embed credentials or environment-specific secrets.
- Prefer transactional DDL where supported.
- Back up production data before applying schema changes.

The backend uses Prisma for runtime database access. If Prisma migrations are present, keep them as the authoritative runtime migration mechanism and keep this SQL baseline consistent with the approved database design.

Before release, verify a fresh database can be initialized from the migration set and that backend repositories/tests pass against the resulting schema.
