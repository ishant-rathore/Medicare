# Medicare — Deployment & Operations

## Purpose

Operational runbook for maintaining Medicare across Development, Staging/Test and Production/Demo. The primary operational rule is that the local reminder path remains reliable even when cloud services are unavailable. fileciteturn0file18

## 1. Environments

| Environment | Purpose | Data Policy |
|---|---|---|
| Development | Feature development and debugging | Synthetic/test data preferred |
| Staging / Test | Integration, device, sync and CEP rehearsal | Isolated test/consented rehearsal data |
| Production / Demo | Controlled academic demonstration/community trial | Minimum necessary controlled data |

Keep Firebase, API, database and storage configurations isolated by environment.

## 2. Promotion Workflow

```text
Feature Work
→ Review
→ Format/Lint/Static Analysis
→ Automated Tests
→ Release Build
→ Database Migration Checks
→ Staging Deployment
→ Android Device Smoke Tests
→ Integration/Offline/Voice/Accessibility/Security Tests
→ Explicit Approval
→ Production/Demo
```

Promote the tested artifact; do not rebuild differently between environments.

## 3. Critical Smoke Tests

After every release candidate installation:

- Configure a medicine and recurring reminder.
- Confirm configuration is saved locally before success is shown.
- Disable network connectivity.
- Verify the Android alarm still triggers.
- Verify full-screen visual reminder and voice output.
- Verify Taken/Snooze/Skip.
- Verify local dose history.
- Restore connectivity and verify synchronization.
- Confirm no duplicate dose event is created after retry.

## 4. Backend Operations

Monitor:

- API health/readiness.
- Authentication verification failures.
- Authorization failures.
- PostgreSQL availability.
- Synchronization success/failure rate.
- FCM delivery failures where enabled.
- Storage failures where enabled.
- Error rates and latency.

Use structured logs with request IDs. Do not log tokens, passwords, secrets or unnecessary medication information.

## 5. Database Operations

- Version every schema change through migrations.
- Test migrations before promotion.
- Back up production/demo data according to the environment policy.
- Periodically verify that backups can be restored.
- Restrict PostgreSQL access to the backend/service layer.

## 6. Firebase Operations

### Authentication

Verify that the backend can validate Firebase ID tokens and map them to application users.

### FCM

Use FCM for configured caregiver/device messaging only. Remote messaging is secondary to the local reminder path.

### Storage

Keep family voice and medicine-photo assets private and authorized.

## 7. Android Reliability Operations

Check target devices for:

- Notification permissions.
- Alarm permissions/behavior required by the platform.
- Battery optimization/background restrictions.
- TTS availability and selected voice.
- Vibration/audio behavior.
- Accessibility settings.

A device-specific restriction must not be mistaken for a successful reminder test; document the device/Android version used.

## 8. Incident Priorities

### P0 — Reminder/Data Integrity

Examples:

- configured reminders fail;
- Taken/Snooze/Skip cannot be persisted;
- duplicate dose events are created;
- unauthorized medication data is exposed.

Action: stop release/promotion, preserve evidence, restore the previous-good artifact when appropriate, and investigate before resuming promotion.

### P1 — Major Cloud/Sync Degradation

Examples:

- API unavailable;
- sync repeatedly failing;
- FCM caregiver messages delayed.

Action: preserve local reminder behavior, surface clear offline/pending-sync state, repair cloud path.

### P2 — Non-Critical Feature Issue

Examples:

- optional media unavailable;
- secondary UI issue.

Action: triage and fix without compromising the reminder path.

## 9. Rollback Procedure

1. Identify the affected release/tag/commit.
2. Confirm impact and protect local reminder behavior.
3. Select the previous-good application/backend artifact.
4. Verify database compatibility before rollback.
5. Restore the previous-good deployment.
6. Run smoke tests, including offline reminder execution.
7. Record incident details and corrective action.

## 10. Community Trial Operations

Before a community deployment:

- Use the validated release artifact.
- Confirm alarm, voice, accessibility and offline behavior.
- Obtain voluntary consent.
- Minimize collected participant information.
- Provide simple onboarding/training.
- Record only actual observations and outcomes.
- Keep trial evidence anonymized/aggregated where practical.

Never fabricate participant counts, locations, feedback, outcomes or usability results.

## 11. Release Checklist

- [ ] Code review completed.
- [ ] Static checks completed.
- [ ] Automated tests passed.
- [ ] Migration checks passed.
- [ ] Security checks passed.
- [ ] Android release candidate built.
- [ ] Reminder trigger tested.
- [ ] Offline reminder tested.
- [ ] Voice/TTS tested.
- [ ] Taken/Snooze/Skip tested.
- [ ] Sync/idempotency tested.
- [ ] Accessibility tested.
- [ ] Previous-good artifact retained.
- [ ] Explicit release approval recorded.

