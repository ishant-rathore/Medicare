# 08 — API

REST/JSON API documentation for the Medicare Node.js/Express backend and Flutter client.

## Documents

- [API Document](api-document.md)
- [API Examples](api-examples.md)
- [OpenAPI Specification](openapi.yaml)

## Contract

- Base version: `/api/v1`
- Transport: HTTPS/TLS
- Authentication: Firebase Bearer ID token
- IDs: opaque UUIDs recommended
- Timestamps: ISO 8601 UTC in API payloads
- `X-Request-Id`: correlation/troubleshooting header
- `Idempotency-Key` / `local_event_id`: retry-safe writes

The cloud API supports authenticated persistence, synchronization and caregiver functions. It must never be a prerequisite for an already-configured local medication reminder.
