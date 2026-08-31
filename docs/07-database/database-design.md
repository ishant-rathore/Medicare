<<<<<<< HEAD
# Database Design

=======
# Medicare — Database Design

## Voice Reminders for Senior Citizen Medications

**Document:** Database Design  
**Version:** 1.0  
**Cloud Database:** PostgreSQL  
**Local Database:** SQLite  
**Data Model:** Relational  
**API:** REST/JSON  
**API Version:** `/api/v1`

---

# 1. Purpose

This document defines the database architecture and data model for Medicare.

Medicare uses a dual-database architecture:

```text
SQLite
   ↓
Local Operational Database
   ↓
Offline-First Application
```

and:

```text
PostgreSQL
   ↓
Canonical Cloud Database
   ↓
Secure Synchronization
```

The database design supports:

- Users
- Medicines
- Reminders
- Dose events
- Caregivers
- Refill rules
- Device tokens
- Private media
- Synchronization
- Offline operation
- Medication history
- Adherence information

---

# 2. Database Architecture

```text
                    MEDICARE
                       |
          +------------+------------+
          |                         |
          v                         v
       SQLite                  PostgreSQL
     Local Store              Cloud Store
          |                         |
          |                         |
          v                         v
   Local Reminders             Canonical Data
   Offline Actions             Synchronization
   Pending Queue                Caregiver Access
          |
          |
          +-------- Sync --------->
```

---

# 3. Database Responsibilities

## SQLite

SQLite is the local operational database.

It is responsible for:

- Local medicine data
- Local reminder schedules
- Local dose events
- Pending synchronization operations
- Offline application operation

SQLite must remain functional without internet connectivity.

---

## PostgreSQL

PostgreSQL is the canonical cloud database.

It is responsible for:

- Cloud persistence
- Synchronization
- Cross-device data
- Authorized caregiver access
- Cloud medication history
- Server-side consistency
- Canonical records

---

# 4. Local-First Principle

The critical reminder path must not depend on PostgreSQL.

```text
SQLite
  ↓
Local Reminder Schedule
  ↓
Android Alarm
  ↓
Reminder Screen
  ↓
TTS + Visual Reminder
  ↓
Taken / Snooze / Skip
  ↓
Local Dose Event
  ↓
Sync Queue
  ↓
PostgreSQL
```

If internet connectivity is unavailable:

```text
Reminder → MUST continue working
```

---

# 5. Core Entities

The Medicare database contains the following core entities:

```text
users
medicines
reminders
dose_events
caregivers
refill_rules
device_tokens
media_assets
sync_log
```

---

# 6. Entity Relationship Overview

```text
                    +-------------+
                    |    users    |
                    +------+------+
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       +-----------+ +-----------+ +-------------+
       | medicines | |caregivers | |device_tokens|
       +-----+-----+ +-----------+ +-------------+
             |
             +----------------+
             |                |
             v                v
      +-------------+   +-------------+
      |  reminders  |   |refill_rules |
      +------+------+   +-------------+
             |
             v
       +-------------+
       | dose_events |
       +------+------+
              |
              v
       +-------------+
       |  sync_log   |
       +-------------+

       +-------------+
       | media_assets|
       +-------------+
```

---

# 7. Users

The `users` entity represents a Medicare application user.

Conceptual fields:

| Field | Purpose |
|---|---|
| `id` | Application user identifier |
| `firebase_uid` | Firebase Authentication identity |
| `name` | User display name |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

The exact physical schema must remain consistent with the approved database implementation.

---

# 8. User Identity

Firebase Authentication provides the authentication identity.

The backend must associate the authenticated Firebase identity with the corresponding application user.

The client must not be trusted to define another user's identity.

```text
Firebase Identity
       ↓
Verified Backend Identity
       ↓
Application User
```

---

# 9. Medicines

The `medicines` entity stores medication information entered by the user or authorized caregiver.

Conceptual fields include:

| Field | Purpose |
|---|---|
| `id` | Medicine identifier |
| `user_id` | Owner |
| `name` | Medicine name |
| `dose` | Configured dose information |
| `notes` | Optional notes |
| `is_active` | Active/deactivated state |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

Only approved and user-provided medication information should be stored.

---

# 10. Medicine Ownership

Every medicine must be associated with an authorized owner.

Conceptually:

```text
users.id
    |
    +---- medicines.user_id
```

Server-side authorization must verify ownership before allowing protected operations.

---

# 11. Medicine Deactivation

Medicine records should support deactivation.

Conceptual state:

```text
Active
  ↓
Deactivated
```

Deactivation should not silently alter historical dose records.

Historical data should remain available according to the approved retention and privacy requirements.

---

# 12. Reminders

The `reminders` entity stores medication reminder schedules.

Conceptual fields:

| Field | Purpose |
|---|---|
| `id` | Reminder identifier |
| `medicine_id` | Related medicine |
| `schedule_type` | Schedule category |
| `schedule_data` | Schedule configuration |
| `enabled` | Reminder enabled state |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

---

# 13. Supported Reminder Schedules

Medicare supports the approved scheduling requirements:

```text
Daily
Weekly
Alternate-day
Custom
Every-X-hours
```

The schedule representation must be validated by the application and backend.

---

# 14. Reminder Relationship

A reminder belongs to a medicine.

```text
Medicine
   |
   +---- Reminder
```

Conceptually:

```text
medicines.id
      ↓
reminders.medicine_id
```

The backend must verify that the authenticated user is authorized to access the related medicine.

---

# 15. Dose Events

The `dose_events` entity records medication reminder actions.

Supported actions include:

```text
TAKEN
SNOOZED
SKIPPED
```

Dose events are important for:

- Medication history
- Adherence summaries
- Missed-dose monitoring
- Synchronization

---

# 16. Dose Event Identity

Every offline-created dose event must contain a stable:

```text
local_event_id
```

Example:

```text
local_event_id = 8f1c... 
```

The identifier must remain unchanged during retries.

This enables the backend to detect duplicate synchronization requests.

---

# 17. Dose Event Conceptual Fields

| Field | Purpose |
|---|---|
| `id` | Server-side event identifier |
| `local_event_id` | Stable client event identifier |
| `user_id` | Event owner |
| `medicine_id` | Related medicine |
| `reminder_id` | Related reminder |
| `status` | Taken/Snoozed/Skipped |
| `event_time` | Event timestamp |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

The final schema must follow the approved Database Design Document.

---

# 18. Dose Event Idempotency

Synchronization must be idempotent.

Example:

```text
Client
  |
  | local_event_id = ABC123
  v
Server
  |
  | Create event
  v
PostgreSQL
```

If the client retries:

```text
local_event_id = ABC123
        ↓
Server
        ↓
Existing event?
        ↓
YES
        ↓
Return existing result
```

A duplicate dose event must not be created.

---

# 19. Dose Event Validation

The server must validate:

```text
Authenticated identity
        ↓
Resource ownership
        ↓
Event identity
        ↓
Medicine relationship
        ↓
Reminder relationship
        ↓
Valid state transition
        ↓
Idempotency
```

Client-side validation is not sufficient.

---

# 20. Caregivers

The `caregivers` entity represents explicit caregiver authorization.

Caregiver access must never be implicit.

Conceptually:

```text
User / Owner
      |
      | Explicit Authorization
      v
Caregiver
      |
      v
Scoped Access
```

---

# 21. Caregiver Permissions

Caregiver access must be limited to approved permissions.

Examples may include:

```text
View medication information
View medication history
Manage approved medication information
View adherence information
```

The actual permission set must follow the approved requirements.

---

# 22. Caregiver Revocation

Caregiver authorization can be revoked.

Conceptual flow:

```text
Authorized
    ↓
Revoked
    ↓
Access Denied
```

The backend must check the current authorization state for protected operations.

---

# 23. Refill Rules

The `refill_rules` entity supports refill and low-stock reminders.

Conceptual relationship:

```text
Medicine
   |
   +---- Refill Rule
```

Possible information includes:

```text
Medicine
Threshold
Reminder configuration
Enabled state
```

The exact fields must follow the approved database requirements.

---

# 24. Device Tokens

The `device_tokens` entity stores device registration information required for approved notification functionality.

Conceptually:

```text
User
  |
  +---- Device
          |
          +---- FCM Token
```

Device tokens must be treated as sensitive application data.

Expired or invalid tokens should be managed appropriately.

---

# 25. Media Assets

The `media_assets` entity represents optional private media.

Examples:

```text
Medicine Photos
Family Voice Recordings
```

Conceptually:

```text
User
  |
  +---- Media Asset
             |
             +---- Storage Reference
```

Media must be access-controlled.

---

# 26. Firebase Storage

Firebase Storage may be used for approved private media.

The database should store metadata/reference information rather than unnecessarily duplicating the media itself.

Conceptually:

```text
PostgreSQL
     |
     +---- media_assets
               |
               +---- storage reference
                         |
                         v
                 Firebase Storage
```

---

# 27. Synchronization Log

The `sync_log` entity supports synchronization tracking.

It may record information required to determine:

```text
Pending
Processing
Accepted
Failed
```

The exact state model must remain consistent with the approved synchronization implementation.

---

# 28. Sync Queue on SQLite

The local database should maintain pending mutations required for synchronization.

Conceptually:

```text
Local Action
    ↓
SQLite Transaction
    ↓
Dose Event
    ↓
Sync Queue
    ↓
Pending
```

The queue must survive:

- App restart
- Temporary network failure
- Retry
- Device connectivity changes

---

# 29. Synchronization Flow

```text
SQLite
  ↓
Pending Mutation
  ↓
Connectivity Available
  ↓
HTTPS Request
  ↓
Firebase Authentication
  ↓
Server Authorization
  ↓
Input Validation
  ↓
Idempotency Check
  ↓
PostgreSQL
  ↓
Accepted
  ↓
Local Queue Updated
```

---

# 30. Synchronization Failure

If synchronization fails:

```text
Local Event
    ↓
Sync Attempt
    ↓
Failure
    ↓
Keep Pending
    ↓
Retry Later
```

A failed network request must not delete the local event.

---

# 31. Database Integrity

The database should enforce appropriate:

- Primary keys
- Foreign keys
- Unique constraints
- Not-null constraints
- Check constraints
- Indexes

These controls help maintain data integrity.

---

# 32. Primary Keys

Database entities should use stable unique identifiers.

The approved architecture specifies UUID/opaque resource identifiers where applicable.

Example:

```text
users.id
medicines.id
reminders.id
dose_events.id
```

---

# 33. Foreign Keys

Relationships should be enforced through foreign keys where appropriate.

Example:

```text
medicines.user_id
        ↓
users.id
```

```text
reminders.medicine_id
        ↓
medicines.id
```

```text
dose_events.reminder_id
        ↓
reminders.id
```

Foreign-key behavior must preserve historical and synchronization requirements.

---

# 34. Unique Constraints

Uniqueness should be enforced where required.

A critical synchronization requirement is that a stable client event identity cannot result in multiple server-side dose events.

Conceptually:

```text
local_event_id
      ↓
UNIQUE
```

The exact constraint may be scoped according to the approved database design.

---

# 35. Indexing Strategy

Indexes should support common operations.

Potential indexing areas include:

```text
users.firebase_uid

medicines.user_id

reminders.medicine_id

dose_events.user_id

dose_events.medicine_id

dose_events.reminder_id

dose_events.local_event_id

caregivers.owner/user relationship

device_tokens.user_id

media_assets.user_id
```

Indexes must be created based on actual query patterns and the approved schema.

---

# 36. Timestamps

Server-side timestamps should be used where appropriate.

The system uses UTC timestamps for API communication and cloud data.

Conceptual fields:

```text
created_at
updated_at
event_time
```

The application must avoid ambiguous local-time storage for cloud synchronization.

---

# 37. Time and Reminder Scheduling

Reminder schedules may be configured using user-facing local time.

Synchronization and API communication should use the approved UTC timestamp convention.

The local Android reminder system remains responsible for executing configured local schedules.

---

# 38. Data Ownership

Data ownership must be enforced server-side.

The backend must never trust:

```text
user_id from request body
owner_id from request body
role from request body
permissions from request body
```

as authoritative security information.

The authenticated identity and database relationships determine authorization.

---

# 39. Data Minimization

Only required information should be stored.

Avoid unnecessary collection of:

```text
Speech transcripts
Sensitive logs
Unnecessary personal information
Unnecessary device information
```

Medication data should only be stored where required for Medicare functionality.

---

# 40. Privacy

Database design must follow:

- Data minimization
- Least privilege
- Secure defaults
- Privacy by design
- Access control

Private caregiver and media data must not be exposed to unauthorized users.

---

# 41. Sensitive Data Logging

Database contents must not be unnecessarily written to application logs.

Never log:

```text
Passwords
Authentication tokens
Private credentials
Full authorization headers
Unnecessary medication information
Private voice recordings
Private media contents
```

---

# 42. Database Transactions

Transactions must be used for operations requiring multiple related changes.

Example:

```text
BEGIN TRANSACTION
      ↓
Update Record
      ↓
Write Sync Information
      ↓
Commit
```

On failure:

```text
ROLLBACK
```

This prevents partially completed operations.

---

# 43. Concurrency

The backend must account for concurrent requests.

Examples:

```text
Two synchronization retries
Two device requests
Owner + caregiver update
```

Database constraints and transactions should protect consistency.

---

# 44. Offline Data Model

The local database should prioritize the information required for offline operation.

```text
SQLite
├── Medicines
├── Reminders
├── Dose Events
└── Sync Queue
```

The local schema should contain enough information to execute configured reminders without requiring the server.

---

# 45. Cloud Data Model

The PostgreSQL database provides the canonical cloud representation.

```text
PostgreSQL
├── Users
├── Medicines
├── Reminders
├── Dose Events
├── Caregivers
├── Refill Rules
├── Device Tokens
├── Media Assets
└── Sync Log
```

---

# 46. SQLite vs PostgreSQL

| Capability | SQLite | PostgreSQL |
|---|---|---|
| Local operation | Yes | No |
| Offline reminders | Yes | No |
| Local dose events | Yes | No |
| Sync queue | Yes | No |
| Cloud canonical data | No | Yes |
| Caregiver cloud access | No | Yes |
| Cross-device synchronization | No | Yes |
| Server-side authorization | No | Yes |
| Cloud history | No | Yes |

---

# 47. Database Security

The database layer must use:

```text
Least privilege
Parameterized queries
Secure credentials
Encrypted transport
Access control
Validated input
```

The backend must mediate access to PostgreSQL.

The Flutter application must not connect directly to PostgreSQL.

---

# 48. Architecture Boundary

The correct architecture is:

```text
Flutter
   ↓
REST API
   ↓
Node.js / Express
   ↓
Service Layer
   ↓
Repository Layer
   ↓
PostgreSQL
```

Incorrect:

```text
Flutter
   ↓
PostgreSQL
```

The mobile application must never directly access the cloud database.

---

# 49. Database Migration Strategy

Database schema changes must use controlled migrations.

Migration process:

```text
Migration File
      ↓
Test
      ↓
Staging
      ↓
Verification
      ↓
Production
```

Every migration should be reviewed and tested before production deployment.

---

# 50. Migration Requirements

Migration testing should verify:

- Schema creation
- Table relationships
- Constraints
- Indexes
- Existing data compatibility
- Application compatibility
- Rollback/recovery strategy where applicable

---

# 51. Backup and Recovery

Production PostgreSQL data should have an appropriate backup and recovery strategy.

Recovery planning should consider:

```text
Database failure
Data corruption
Deployment failure
Migration failure
Service outage
```

The exact backup retention and infrastructure configuration must follow the approved Deployment and Operations requirements.

---

# 52. Database Testing

Database testing should include:

### Schema Tests

- [ ] Tables exist.
- [ ] Primary keys are valid.
- [ ] Foreign keys are valid.
- [ ] Constraints work.
- [ ] Indexes exist where required.

### Data Tests

- [ ] Medicine ownership is preserved.
- [ ] Reminder relationships are valid.
- [ ] Dose events are consistent.
- [ ] Caregiver relationships are secure.

### Synchronization Tests

- [ ] Offline events synchronize.
- [ ] Retries are safe.
- [ ] Duplicate events are prevented.
- [ ] Failed events remain recoverable.

---

# 53. Security Testing

Database-related security tests should verify:

- Unauthorized users cannot access another user's data.
- Caregivers cannot exceed their permissions.
- Revoked caregivers lose access.
- Client-supplied ownership cannot bypass authorization.
- SQL injection is prevented.
- Arbitrary writable fields are rejected.
- Sensitive data is not exposed in errors or logs.

---

# 54. Example Data Flow

## Adding a Medicine

```text
User
 ↓
Flutter
 ↓
REST API
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Medicine Service
 ↓
Medicine Repository
 ↓
PostgreSQL
```

The local application should also maintain the required local representation for offline operation.

---

# 55. Example Dose Event Flow

```text
Reminder
 ↓
User taps TAKEN
 ↓
Flutter
 ↓
SQLite Transaction
 ↓
Dose Event Created
 ↓
local_event_id assigned
 ↓
Sync Queue
 ↓
Internet Available
 ↓
REST API
 ↓
Server Validation
 ↓
Idempotency Check
 ↓
PostgreSQL
```

---

# 56. Example Retry Flow

```text
Dose Event
    ↓
Sync Request
    ↓
Network Timeout
    ↓
Queue Remains Pending
    ↓
Retry
    ↓
Same local_event_id
    ↓
Server Detects Existing Event
    ↓
No Duplicate
```

---

# 57. Medical Safety Data Boundary

The database must not be used to create clinical recommendations.

Stored medication information represents user/caregiver-entered configuration.

The database must not automatically generate or modify:

```text
Dosage recommendations
Medication prescriptions
Treatment plans
Clinical diagnoses
Medication discontinuation advice
```

---

# 58. Database Acceptance Criteria

The database architecture is acceptable when:

- [ ] SQLite is used for local operational storage.
- [ ] PostgreSQL is the canonical cloud database.
- [ ] Core entities are implemented.
- [ ] Relationships are enforced.
- [ ] Resource ownership is protected.
- [ ] Stable `local_event_id` values are supported.
- [ ] Synchronization is idempotent.
- [ ] Transactions are used where required.
- [ ] Parameterized database access is used.
- [ ] Appropriate indexes exist.
- [ ] UTC timestamps are used for API/cloud communication.
- [ ] Secrets are not stored in source code.
- [ ] Sensitive data is minimized.
- [ ] Private media is access-controlled.
- [ ] Offline reminder operation does not depend on PostgreSQL.

---

# 59. Final Database Principle

> **SQLite keeps Medicare operational locally, while PostgreSQL provides canonical cloud persistence and secure synchronization.**

The database architecture must always preserve the project's most important requirement:

```text
NETWORK FAILURE
      ↓
MUST NOT
      ↓
BREAK AN ALREADY-CONFIGURED
MEDICATION REMINDER
```
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
