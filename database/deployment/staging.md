# Staging/Test Database Deployment

1. Provision the staging PostgreSQL instance through the approved environment configuration.
2. Back up any existing staging data when required.
3. Validate the Prisma schema.
4. Apply pending Prisma migrations with the deployment workflow.
5. Run database verification checks.
6. Run backend integration tests and application smoke tests.
7. Verify synchronization/idempotency behavior, especially `local_event_id`.
8. Record application and migration versions.

Flutter SQLite validation must include fresh initialization, supported upgrades, offline reminder execution, dose history, and sync queue persistence.

Do not use production data in staging unless an approved privacy-preserving process explicitly allows it.
