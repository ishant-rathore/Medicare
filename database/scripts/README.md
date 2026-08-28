# Database Deployment Scripts

Deployment scripts belong here when they are required by the repository's supported environments.

Expected capabilities:

- Apply PostgreSQL migrations safely.
- Validate PostgreSQL migration ordering/schema.
- Initialize and validate SQLite migrations.
- Support deployment verification without hard-coded credentials.
- Fail fast on missing required environment configuration.

Prefer the existing backend/Prisma migration commands for PostgreSQL when available rather than maintaining a second runtime migration engine. Infrastructure-specific backup commands should remain in deployment documentation unless they are implemented and tested for the target provider.

Never commit database passwords, tokens, Firebase service credentials, or production connection strings.
