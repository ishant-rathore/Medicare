# 06 — Backend

Node.js + Express + TypeScript backend documentation for Medicare.

## Documents

- [Backend Document](backend-document.md)

## Architecture

The backend is a modular monolith:

```text
Route → Middleware → Controller → Service → Repository → PostgreSQL
```

Authentication and resource-level authorization are server-side responsibilities. The API supports authenticated persistence, synchronization, caregiver operations, device-token registration and private media references. It does not trigger the senior user's local medication alarm.
