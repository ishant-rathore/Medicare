# Medicare — Offline & Synchronization Architecture

## Voice Reminders for Senior Citizen Medications

> **Local reminder execution first. Cloud synchronization second.**

---

# 1. Purpose

This document defines Medicare's offline-first and synchronization architecture.

The architecture ensures that critical medication reminder functionality continues to operate when:

- Internet connectivity is unavailable.
- Backend services are temporarily unavailable.
- Firebase services are unavailable.
- Synchronization fails.
- The device temporarily loses connectivity.

---

# 2. Core Principle

## The Reminder Must Work Without Internet

The most important technical requirement is:

> **Cloud services must never be required to execute an already-configured local reminder.**

Therefore:

```text
                INTERNET AVAILABLE
                       |
                       v
                Cloud Synchronization
                       ^
                       |
Local Data → Reminder Engine → Android Alarm
                       |
                       v
                Reminder UI
                       |
                       v
               Dose Event
                       |
                       v
                  SQLite
```

The reminder path does not depend on the cloud.

---

# 3. Local-First Architecture

```text
+--------------------------+
| Flutter Application      |
+------------+-------------+
             |
             v
+--------------------------+
| Application / Use Cases  |
+------------+-------------+
             |
             v
+--------------------------+
| Repository Layer         |
+------------+-------------+
             |
             v
+--------------------------+
| SQLite                   |
| Local Operational Data   |
+------------+-------------+
             |
       +-----+------+
       |            |
       v            v
 Reminder Engine  Sync Queue
       |
       v
Android Alarm
       |
       v
Voice + Visual Reminder
```

---

# 4. Data Ownership

## SQLite

SQLite is the local operational database.

It is responsible for:

- Local medicine data.
- Local reminder configuration.
- Local dose events.
- Pending synchronization.
- Offline application state.

## PostgreSQL

PostgreSQL is the canonical cloud database.

It is responsible for:

- Canonical synchronized data.
- Cross-device synchronization.
- Authorized caregiver access.
- Cloud history.
- Backend-managed resources.

---

# 5. Critical Reminder Path

The critical path shall be:

```text
SQLite Medicine Data
        ↓
Local Reminder Schedule
        ↓
Android Alarm
        ↓
Full-Screen Reminder
        ↓
Voice + Visual Reminder
        ↓
Taken / Snooze / Skip
        ↓
Local Dose History
```

No network request is required in this path.

---

# 6. Offline User Flow

When the device is offline:

```text
User
 ↓
Open Medicare
 ↓
Read Local Medicine Data
 ↓
Read Local Reminder Schedule
 ↓
Reminder Executes
 ↓
User Selects Action
 ↓
Dose Event Stored Locally
 ↓
Sync Status = Pending
```

The user should be informed when synchronization is pending.

---

# 7. Local Database Requirements

SQLite shall contain operational data required for offline functionality.

Example logical data:

```text
medicines
reminders
dose_events
sync_queue
user_preferences
```

Local data must be sufficient to execute configured reminders.

---

# 8. Local Dose Event

When a user selects:

```text
Taken
Snooze
Skip
```

the application shall first persist the result locally.

Example logical event:

```text
{
  local_event_id: "stable-unique-id",
  reminder_id: "reminder-id",
  medicine_id: "medicine-id",
  action: "TAKEN",
  occurred_at: "UTC timestamp",
  sync_status: "PENDING"
}
```

The exact API payload shall follow the approved API contract.

---

# 9. Stable Local Event ID

Every offline dose event must have a stable:

```text
local_event_id
```

The identifier must remain unchanged across retries.

Example:

```text
Dose Event
    |
    +-- local_event_id = ABC123
    |
    +-- Attempt 1
    +-- Attempt 2
    +-- Attempt 3
```

All attempts refer to the same logical event.

---

# 10. Why Idempotency Is Required

Without idempotency:

```text
Offline Event
    ↓
Retry
    ↓
Retry
    ↓
Retry
```

could create:

```text
Dose Event 1
Dose Event 2
Dose Event 3
```

This would incorrectly duplicate medication history.

With idempotency:

```text
ABC123
  ↓
First request → Create
  ↓
Retry → Existing Event
  ↓
Retry → Existing Event
```

Only one logical event exists.

---

# 11. Synchronization Queue

The synchronization queue stores mutations that have not yet been accepted by the backend.

Example states:

| State | Meaning |
|---|---|
| `PENDING` | Waiting for synchronization |
| `SYNCING` | Currently being submitted |
| `SYNCED` | Accepted by backend |
| `FAILED` | Submission failed and requires retry |
| `CONFLICT` | Server rejected due to conflict or invalid state |

The exact state model shall remain consistent with the implementation and approved API contract.

---

# 12. Local Write Pattern

All critical local user actions should follow:

```text
User Action
    ↓
Validate
    ↓
SQLite Transaction
    ↓
Save Local State
    ↓
Create Sync Queue Entry
    ↓
Update UI
```

The local result should not wait for a network request.

---

# 13. Sync Trigger Conditions

Synchronization may be triggered when:

- Internet connectivity becomes available.
- Application starts.
- Application resumes.
- Background synchronization is permitted.
- User manually requests synchronization.

The synchronization mechanism must not interfere with local reminder execution.

---

# 14. Synchronization Flow

```text
Connectivity Available
        ↓
Read Pending Queue
        ↓
Authenticate
        ↓
Submit Mutation
        ↓
Server Authentication
        ↓
Resource Authorization
        ↓
Validate Payload
        ↓
Check Idempotency
        ↓
Validate State Transition
        ↓
PostgreSQL Transaction
        ↓
Return Result
        ↓
Update Local Sync State
```

---

# 15. Backend Validation

The server must never blindly accept offline events.

For each mutation the backend shall verify:

```text
Authenticated User
        ↓
Resource Ownership
        ↓
Event Identity
        ↓
Payload Validity
        ↓
Allowed State Transition
        ↓
Idempotency
        ↓
Database Transaction
```

---

# 16. Identity Validation

The server shall obtain the authenticated identity from the verified Firebase ID token.

The server shall not trust:

```text
client user_id
client role
client ownership
client permissions
```

The server must derive authorization from trusted authentication context and server-side resource relationships.

---

# 17. Resource Authorization

Before accepting a synchronized event, the backend shall verify that the authenticated user is authorized to modify the relevant resource.

Example:

```text
Authenticated User
       |
       v
Owns / is authorized for Medicine?
       |
       +---- NO → Reject
       |
       +---- YES
              |
              v
          Continue
```

---

# 18. Idempotent Server Processing

The server shall use the stable local event identifier to detect duplicate submissions.

Logical behavior:

```text
Receive local_event_id
        |
        v
Does event exist?
   /            \
 YES             NO
 |                |
Return existing   Validate
result            |
                  v
              Create Event
```

Repeated requests must not create duplicate dose events.

---

# 19. Transaction Requirements

Multi-record synchronization operations shall use database transactions where required.

Example:

```text
BEGIN TRANSACTION

Validate Event
      ↓
Check Idempotency
      ↓
Create / Update Dose Event
      ↓
Update Sync Metadata

COMMIT
```

If the transaction fails:

```text
ROLLBACK
```

The client retains the mutation for retry unless the server has explicitly accepted it.

---

# 20. Retry Strategy

Temporary failures should be retried.

Potential temporary failures include:

- No network.
- Connection timeout.
- Server unavailable.
- Temporary Firebase failure.
- HTTP 5xx response.

Permanent validation failures should not be retried indefinitely.

Examples:

- Unauthorized request.
- Invalid resource.
- Invalid state transition.
- Malformed payload.

Such events should be surfaced through appropriate sync/error handling.

---

# 21. Pending Mutation Guarantee

Pending mutations must not disappear because synchronization failed.

```text
PENDING
   ↓
Sync Attempt
   ↓
Failure
   ↓
PENDING / FAILED
   ↓
Retry
```

The application must preserve the event until:

- Accepted by the server, or
- Explicitly resolved as invalid/conflicting.

---

# 22. Offline Read Behavior

When offline, the application should read from SQLite.

Examples:

```text
Medicine List → SQLite
Reminder List → SQLite
Medication History → SQLite
Preferences → SQLite
```

The UI should not require an API call to display already-cached operational information.

---

# 23. Offline UI

The UI should clearly communicate offline state without blocking critical functionality.

Example:

```text
┌─────────────────────────────┐
│ Offline                     │
│ Your reminders still work. │
└─────────────────────────────┘
```

For synchronization:

```text
┌─────────────────────────────┐
│ Sync pending                │
│ Your medication records     │
│ will sync when online.      │
└─────────────────────────────┘
```

---

# 24. Sync Status

The user may see statuses such as:

```text
Synced
Sync pending
Syncing
Sync failed
```

Important status information shall not rely on color alone.

---

# 25. Conflict Handling

Conflicts shall be handled explicitly.

The system shall not silently overwrite medication information or dose history.

Potential conflict cases include:

- Resource deleted remotely.
- Resource deactivated remotely.
- Invalid state transition.
- Unauthorized caregiver mutation.
- Event already exists.
- Server-side validation failure.

The application shall preserve enough information to resolve or communicate the issue safely.

---

# 26. Caregiver Synchronization

Caregiver functionality follows the same security model.

```text
Caregiver Request
      ↓
Firebase Authentication
      ↓
Server Authorization
      ↓
Scoped Permission Check
      ↓
Resource Access
```

If caregiver authorization is revoked:

```text
Revoked
   ↓
Server rejects protected request
```

The client must not override server authorization.

---

# 27. FCM and Synchronization

Firebase Cloud Messaging may support remote notifications.

However:

> **FCM must not replace the local reminder engine.**

The local reminder system remains responsible for already-configured medication reminders.

---

# 28. Offline Security

Offline capability does not remove security requirements.

The application shall:

- Protect local data appropriately.
- Avoid exposing sensitive information unnecessarily.
- Avoid storing authentication secrets insecurely.
- Use secure authentication when synchronizing.
- Validate server authorization.
- Protect private media.

---

# 29. Offline Privacy

The application shall follow data minimization.

Only information necessary for offline functionality should be stored locally.

The system should avoid unnecessary:

- Speech transcripts.
- Personal information.
- Sensitive logs.
- Temporary sensitive files.

---

# 30. Sync Architecture

```text
                 +----------------+
                 |    SQLite      |
                 +-------+--------+
                         |
              +----------+----------+
              |                     |
              v                     v
       Reminder Engine         Sync Queue
              |                     |
              v                     |
       Android Alarm                |
              |                     |
              v                     |
       Voice + Visual               |
              |                     |
              v                     |
       Taken/Snooze/Skip            |
              |                     |
              +----------+----------+
                         |
                         | HTTPS
                         v
                 +---------------+
                 | REST API      |
                 | /api/v1       |
                 +-------+-------+
                         |
                         v
                 +---------------+
                 | Node/Express   |
                 +-------+-------+
                         |
                         v
                 +---------------+
                 | PostgreSQL     |
                 +---------------+
```

---

# 31. Repository Responsibility

The Flutter application shall use repositories to abstract data sources.

Example:

```text
MedicineRepository
ReminderRepository
DoseEventRepository
SyncRepository
```

Repositories may coordinate:

```text
SQLite
API
Sync Queue
```

The UI must not directly access either SQLite or the REST API.

---

# 32. Application Use Cases

Recommended use cases include:

```text
CreateMedicine
UpdateMedicine
CreateReminder
TriggerReminder
RecordDoseAction
GetMedicationHistory
QueueOfflineMutation
SynchronizePendingChanges
```

---

# 33. Sync Service

The Sync Service shall coordinate synchronization.

Responsibilities:

- Detect pending mutations.
- Authenticate requests.
- Submit mutations.
- Process server responses.
- Retry temporary failures.
- Mark successful mutations as synchronized.
- Preserve failed mutations.
- Handle conflicts.
- Avoid duplicates.

---

# 34. API Request Requirements

Synchronization requests shall use:

```text
HTTPS
REST
JSON
/api/v1
Firebase Bearer ID Token
UTC timestamps
X-Request-Id
```

Dose-event writes must support idempotent behavior.

---

# 35. Server Response Handling

The client shall distinguish between:

### Success

```text
Mutation accepted
→ Mark synchronized
```

### Already Accepted / Idempotent Retry

```text
Event already exists
→ Treat as successfully synchronized
```

### Temporary Failure

```text
Retry later
→ Keep pending
```

### Authorization Failure

```text
Do not blindly retry
→ Surface error
```

### Validation Failure

```text
Do not blindly retry
→ Mark unresolved / conflict
```

---

# 36. Application Restart

If the application closes while events are pending:

```text
SQLite
   ↓
Pending Sync Queue remains
   ↓
Application restarts
   ↓
Sync Service resumes
```

Pending mutations must survive application restart.

---

# 37. Network Failure During Sync

If the network fails during synchronization:

```text
Syncing
   ↓
Network Failure
   ↓
Preserve Event
   ↓
Retry Later
```

A network failure must not delete the local dose event.

---

# 38. Reminder Reliability During Sync

Synchronization must never block:

- Reminder scheduling.
- Android alarms.
- Notification delivery.
- TTS.
- STT.
- Taken/Snooze/Skip.
- Local history.

The reminder subsystem and synchronization subsystem must remain logically independent.

---

# 39. Testing Requirements

## Offline Tests

Verify:

- Application opens without internet.
- Medicines remain available locally.
- Reminders remain available.
- Local alarms execute.
- TTS/visual reminder works where device services permit.
- Taken works offline.
- Snooze works offline.
- Skip works offline.
- Dose history updates offline.

## Synchronization Tests

Verify:

- Pending events are synchronized.
- Failed events remain pending.
- Retry works.
- Application restart preserves pending events.
- Duplicate requests do not create duplicates.
- Server validates ownership.
- Server validates state transitions.

## Network Recovery

Test:

```text
Online
 ↓
Offline
 ↓
Create Dose Event
 ↓
Reconnect
 ↓
Synchronize
 ↓
Verify PostgreSQL
```

---

# 40. Security Tests

Verify that:

- Unauthenticated requests are rejected.
- Invalid Firebase tokens are rejected.
- Client-supplied user IDs are not trusted.
- Unauthorized resources are rejected.
- Revoked caregivers are rejected.
- Duplicate events are not created.
- Invalid state transitions are rejected.
- Sensitive data is not exposed in errors or logs.

---

# 41. Acceptance Criteria

The offline-sync architecture is acceptable when:

- Configured reminders work without internet.
- SQLite stores required operational data.
- Dose actions work offline.
- Offline dose events have stable `local_event_id` values.
- Pending mutations survive app restart.
- Synchronization retries safely.
- Duplicate events are prevented.
- Server-side identity is verified.
- Server-side authorization is enforced.
- State transitions are validated.
- PostgreSQL remains the cloud canonical database.
- FCM is not required for local reminder execution.
- Network failure does not break local reminders.
- Sync failure does not delete local dose events.

---

# 42. Final Principle

```text
LOCAL FIRST
     ↓
REMINDER RELIABILITY
     ↓
LOCAL DOSE HISTORY
     ↓
SYNC WHEN AVAILABLE
     ↓
SERVER VALIDATION
     ↓
POSTGRESQL CANONICAL DATA
```

