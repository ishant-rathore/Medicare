# 05 — Frontend

Flutter/Dart implementation guidance for the Medicare Android-first client.

## Documents

- [Frontend Document](frontend-document.md)

## Core Boundary

UI must not directly manipulate SQLite, call raw HTTP endpoints or schedule Android alarms. Screens communicate through controllers/view-models/use cases, repositories and platform services.

## Critical Frontend Path

```text
Local medication data → local schedule → Android alarm/notification → full-screen reminder → voice + visual → Taken/Snooze/Skip → local dose event → pending sync → authenticated API
```
