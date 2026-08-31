# Backend Documentation

This directory contains implementation-facing backend documentation and machine-readable API material when added.

The approved backend contract remains:

- Node.js + Express + TypeScript
- PostgreSQL as canonical cloud persistence
- Firebase Authentication token verification
- Firebase Cloud Messaging for eligible notifications
- Firebase Storage for optional private media
- REST/JSON over HTTPS under `/api/v1`
- Modular-monolith architecture
- Server-side authorization and validation
- Idempotent synchronization/dose-event ingestion
