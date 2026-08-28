# 10 — Deployment

Deployment and operations documentation for the Medicare Android-first application and Node.js/Express backend.

## Documents

- [Deployment Guide](deployment-guide.md)
- [Deployment & Operations](deployment-operations.md)
- [Troubleshooting](troubleshooting.md)

## Release Flow

```text
Git → CI checks → Build → Staging/Test → Device & Integration Smoke Tests → Approval → Production/Demo
```

Every release must preserve local reminder execution, offline behavior, accessibility, security and dose-event integrity. Keep a previous-good artifact and rollback path.
