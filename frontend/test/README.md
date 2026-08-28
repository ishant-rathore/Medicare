# Frontend Test Structure

```text
test/
├── unit/          # Domain, use-case, repository/service unit tests
├── widget/        # Senior-first UI/widget tests
└── integration/   # Application-layer integration tests
```

Device-level Flutter integration tests live under `integration_test/`. Tests must cover offline-first behavior, reminder scheduling, Taken/Snooze/Skip, synchronization/idempotency, voice flows, notifications, accessibility, and security-sensitive authorization boundaries where applicable.