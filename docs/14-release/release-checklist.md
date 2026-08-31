<<<<<<< HEAD
# Release Checklist

=======
# Medicare — Release Checklist

## Release Information

| Field | Value |
|---|---|
| Release version | [actual] |
| Source commit/tag | [actual] |
| Build artifact | [actual] |
| Environment | [Staging / Production-Demo] |
| Release owner | [actual] |
| Approval date | [actual] |

## 1. Source and Quality

- [ ] Changes reviewed.
- [ ] Formatting/linting completed.
- [ ] Static analysis/type checks passed.
- [ ] Unit tests passed.
- [ ] API/integration tests passed.
- [ ] Database migrations tested.
- [ ] No known P0/P1 defect blocks release.

## 2. Security and Privacy

- [ ] No secrets/tokens/credentials committed.
- [ ] Firebase privileged credentials remain server-side.
- [ ] HTTPS/TLS configured for protected API traffic.
- [ ] Authentication verification tested.
- [ ] Resource-level authorization tested.
- [ ] Caregiver scope/revocation tested.
- [ ] Private voice/photo media access tested.
- [ ] Sensitive data is not unnecessarily logged.
- [ ] Required Android permissions only are requested.

## 3. Reminder and Offline Gate

- [ ] Medicine can be stored locally.
- [ ] Reminder schedule is persisted locally before setup success.
- [ ] Android local alarm/notification works.
- [ ] Full-screen reminder appears.
- [ ] Voice/TTS works on target device or limitation is documented.
- [ ] Taken/Snooze/Skip work.
- [ ] Local dose history is recorded.
- [ ] Reminder works with network disabled.
- [ ] Offline dose event gets stable `local_event_id`.
- [ ] Pending sync queue works.
- [ ] Reconnect sync works.
- [ ] Retrying the same event does not create duplicates.

## 4. Accessibility Gate

- [ ] Large/scalable text verified.
- [ ] High contrast verified.
- [ ] Dark mode verified where enabled.
- [ ] Large critical touch targets verified.
- [ ] Screen-reader semantics checked.
- [ ] Status is not communicated by color alone.
- [ ] Visible voice fallbacks remain available.

## 5. Backend/Database Gate

- [ ] Backend health/readiness verified.
- [ ] PostgreSQL connection verified.
- [ ] Migration status verified.
- [ ] API authorization verified.
- [ ] Sync/idempotency verified.
- [ ] Backup/recovery path known for the target environment.

## 6. Android Device Gate

- [ ] Release APK installed on representative device(s).
- [ ] Notification permissions verified.
- [ ] Alarm behavior verified.
- [ ] Battery/background restrictions reviewed.
- [ ] TTS language/voice verified.
- [ ] App restart/lifecycle behavior verified.

## 7. CEP Demo/Trial Gate

- [ ] Community deployment artifact is the validated release.
- [ ] Consent process is ready/complete as applicable.
- [ ] Data collection is minimized.
- [ ] Trial observations are recorded from actual evidence only.
- [ ] No fabricated participants, locations, feedback or outcomes.

## 8. Rollback Readiness

- [ ] Previous-good APK/artifact retained.
- [ ] Previous-good backend revision identified.
- [ ] Database recovery procedure available.
- [ ] Release commit/tag recorded.
- [ ] Rollback owner identified.

## Final Decision

**Release status:** [READY / BLOCKED / APPROVED]

**Approver:** [actual]

**Evidence links:** [actual]
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
