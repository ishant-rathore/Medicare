<<<<<<< HEAD
# Offline Testing

=======
# Medicare — Offline Testing

## Objective

Prove that the critical Medicare reminder path continues to work when the network is unavailable. The approved architecture makes local reminder execution a primary path and cloud synchronization a secondary path. fileciteturn0file16

## Critical Offline Path

```text
SQLite medication data
→ local reminder schedule
→ Android alarm/notification
→ full-screen reminder
→ voice + visual reminder
→ Taken / Snooze / Skip
→ local dose event
→ pending sync queue
→ reconnect
→ authenticated sync
→ PostgreSQL canonical record
```

## Test Environment

Record for each run:

- Device model.
- Android version.
- App version/build/commit.
- Test date/time.
- Network state.
- Relevant notification/alarm/TTS permissions.

## Test Scenarios

### OFF-01 — Schedule While Offline

**Steps**
1. Launch Medicare.
2. Disable network connectivity.
3. Create or edit a medicine.
4. Configure a reminder.
5. Save.

**Expected**

- Local medicine and schedule are persisted.
- Android alarm is scheduled locally.
- UI does not claim that the reminder cannot work offline.

### OFF-02 — Reminder Fires Offline

**Steps**
1. Configure a reminder.
2. Disable network connectivity.
3. Wait for the scheduled time.

**Expected**

- Local alarm triggers.
- Full-screen reminder appears.
- Voice/TTS and visual reminder operate according to settings.
- Taken/Snooze/Skip remain available.

### OFF-03 — Taken Offline

**Steps**
1. Fire a reminder while offline.
2. Select **Taken**.

**Expected**

- Dose event is written locally.
- Event receives a stable `local_event_id`.
- History updates locally.
- Mutation becomes pending sync.

### OFF-04 — Snooze Offline

**Steps**
1. Fire a reminder while offline.
2. Select **Snooze**.

**Expected**

- Snooze event is recorded locally.
- Next local reminder trigger is created.
- No network call is required for the immediate reminder behavior.

### OFF-05 — Skip Offline

**Steps**
1. Fire a reminder while offline.
2. Select **Skip**.

**Expected**

- Skip event is recorded locally.
- Reminder closes correctly.
- Event is queued for synchronization.

### OFF-06 — Missed Dose Offline

**Steps**
1. Let the configured acknowledgement window expire without action.

**Expected**

- Dose transitions to Missed locally according to the reminder policy.
- Local history records the missed event.
- Caregiver remote delivery may wait for connectivity, but local reminder state is preserved.

### OFF-07 — Reconnect and Sync

**Steps**
1. Generate one or more offline dose events.
2. Restore network connectivity.
3. Run synchronization.

**Expected**

- Pending mutations are authenticated and sent.
- Server revalidates identity, ownership and event validity.
- Accepted events become canonical in PostgreSQL.
- Local queue entries are marked accepted.

### OFF-08 — Retry/Idempotency

**Steps**
1. Sync a local dose event.
2. Simulate a retry using the same `local_event_id`.

**Expected**

- Server returns the existing canonical result.
- No duplicate dose event is inserted.

### OFF-09 — API Down After Local Setup

**Steps**
1. Configure reminder successfully.
2. Make the API unavailable.
3. Keep network state irrelevant to the local alarm path.
4. Wait for reminder.

**Expected**

- Reminder still executes locally.
- App surfaces offline/pending-sync state.
- No cloud failure causes local reminder failure.

### OFF-10 — Offline to Online Data Integrity

**Steps**
1. Create multiple offline actions.
2. Reconnect.
3. Synchronize.
4. Repeat synchronization.

**Expected**

- No missing accepted events.
- No duplicate accepted events.
- History is consistent with canonical server state.

## Pass/Fail Rules

A release candidate fails offline validation if:

- an already-configured local reminder requires internet access;
- a dose action cannot be stored locally;
- reconnecting creates duplicate dose events;
- synchronization accepts unauthorized resource mutations;
- local data is associated with the wrong signed-in user;
- a cloud outage blocks the critical reminder path.

## Evidence Template

| Scenario | Device | Build | Result | Evidence | Defect |
|---|---|---|---|---|---|
| OFF-01 | [actual] | [actual] | [PASS/FAIL] | [log/screenshot] | [ID/None] |
| OFF-02 | [actual] | [actual] | [PASS/FAIL] | [log/screenshot] | [ID/None] |
| OFF-03 | [actual] | [actual] | [PASS/FAIL] | [log/screenshot] | [ID/None] |
| OFF-07 | [actual] | [actual] | [PASS/FAIL] | [sync evidence] | [ID/None] |
| OFF-08 | [actual] | [actual] | [PASS/FAIL] | [API evidence] | [ID/None] |

Only actual test observations should be entered in the evidence columns.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
