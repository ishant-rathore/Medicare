# Medicare — Software Requirements Specification

## Voice Reminders for Senior Citizen Medications

> **“Your Trusted Voice Medication Companion”**

| Document Item | Value |
|---|---|
| Document Type | Software Requirements Specification |
| Product | Medicare |
| Project | Voice Reminders for Senior Citizen Medications |
| Project Type | Community Engagement Project (CEP) / Academic Software Project |
| Platform | Android-first mobile application |
| Primary Users | Senior citizens and caregivers |
| Version | 1.0 |
| Status | Baseline / Development Ready |
| Requirement Principle | Senior-first, voice-first, accessible, reliable and offline-capable |

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the functional, non-functional, interface, data, security, accessibility, reliability and operational requirements for Medicare.

It converts product-level requirements into implementation-ready software requirements for the Android-first application and supporting backend services.

### 1.2 Scope

Medicare shall:

- Store medication information.
- Store medication schedules.
- Execute local reminders.
- Provide voice reminders.
- Provide visual reminders.
- Record Taken/Snooze/Skip outcomes.
- Maintain medication history.
- Provide adherence summaries.
- Support refill reminders.
- Support authorized caregivers.
- Support offline-first operation.
- Synchronize local changes with the backend.

### 1.3 Non-Goals

Medicare shall not provide:

- Diagnosis.
- Prescription generation.
- Clinical decision support.
- Autonomous medication changes.
- Hospital/EHR integration in the MVP.
- Pharmacy ordering or delivery.

---

## 2. Overall Description

### 2.1 Product Perspective

Medicare is an Android-first mobile system with a local operational database and a cloud backend.

```text
Flutter Android App
        |
        +---- SQLite
        |
        +---- Android Alarm / Notification
        |
        +---- TTS / STT
        |
        +---- REST API
                  |
                  +---- Node.js / Express
                  |
                  +---- PostgreSQL
                  |
                  +---- Firebase Services
```

### 2.2 Local-First Principle

The critical reminder path shall operate independently of cloud availability.

```text
SQLite
 ↓
Local Schedule
 ↓
Android Alarm
 ↓
Reminder UI
 ↓
TTS + Visual Alert
 ↓
Taken / Snooze / Skip
 ↓
Local History
 ↓
Sync Queue
 ↓
API
 ↓
PostgreSQL
```

---

# 3. Functional Requirements

## FR-001 Authentication

The system shall authenticate users using Firebase Authentication.

The backend shall verify Firebase ID tokens server-side.

The client shall not be trusted to provide authoritative:

- User identity.
- Role.
- Ownership.
- Permissions.

---

## FR-002 User Profile

Authenticated users shall be able to maintain supported profile and preference information.

Preferences may include:

- Voice settings.
- Accessibility settings.
- Notification settings.
- Vibration settings.

---

## FR-003 Medicine CRUD

The system shall support:

- Create medicine.
- Read medicine.
- Update medicine.
- Deactivate medicine.

The system shall use allow-listed writable fields.

---

## FR-004 Medicine Identification

The application may provide medicine identification aids supported by the approved product baseline.

Optional medicine photos shall be treated as private media.

---

## FR-005 Reminder Creation

The system shall support recurring reminder schedules.

Supported schedule categories include:

- Daily.
- Weekly.
- Alternate-day.
- Custom.
- Every-X-hours.

---

## FR-006 Local Scheduling

Configured reminders shall be scheduled locally on Android.

Cloud connectivity shall not be required for an already-configured reminder.

---

## FR-007 Reminder Trigger

When a reminder becomes due, the system shall provide:

- Android alarm/notification.
- Visual reminder.
- Voice reminder.
- Clear action controls.

---

## FR-008 Dose Actions

The reminder interface shall provide:

```text
Taken
Snooze
Skip
```

Each action shall produce an appropriate dose-event state.

---

## FR-009 Dose States

The supported reminder lifecycle includes:

| State | Description |
|---|---|
| Scheduled | Dose is waiting for configured time |
| Triggered | Reminder is active |
| Snoozed | User postponed the reminder |
| Taken | Dose acknowledged |
| Skipped | Dose explicitly skipped |
| Missed | No acknowledgement within configured window |

---

## FR-010 Dose History

Dose events shall be stored locally and synchronized to the backend when possible.

Offline events shall contain a stable `local_event_id`.

---

## FR-011 Adherence

The system shall provide medication adherence summaries derived from recorded dose events.

Adherence summaries shall not be presented as clinical advice.

---

## FR-012 Refill Reminders

The system shall support configured refill and low-stock reminders.

---

## FR-013 Caregiver Authorization

Caregiver access shall require explicit authorization.

Permissions shall be:

- Scoped.
- Verified server-side.
- Revocable.

Revoked caregivers shall lose access.

---

## FR-014 Voice TTS

The system shall use device Text-to-Speech to read configured reminder information.

---

## FR-015 Voice STT

The system shall support defined speech commands.

The system shall:

- Show listening state.
- Provide visible alternatives.
- Avoid continuous microphone listening.
- Avoid unnecessary speech transcript retention.

---

## FR-016 Accessibility

The system shall support:

- Large text.
- High contrast.
- Large touch targets.
- Screen readers.
- Voice.
- Vibration.
- Clear status indicators.
- Visible fallback controls.

Color shall not be the only status indicator.

---

## FR-017 Offline Operation

The application shall continue to support critical reminder behavior without internet.

Offline functionality shall include:

- Local medicine data.
- Local schedules.
- Local alarms.
- Reminder actions.
- Local history.
- Sync queue.

---

## FR-018 Synchronization

The synchronization system shall:

- Retry failed mutations.
- Preserve pending mutations.
- Use stable local event IDs.
- Be idempotent.
- Validate ownership.
- Validate event identity.
- Validate state transitions.
- Avoid duplicate dose events.

---

## FR-019 Notifications

The application shall support Android local notification/alarm behavior.

Remote messaging may use Firebase Cloud Messaging where required.

Remote messaging shall not replace local reminder execution.

---

# 4. External Interface Requirements

## 4.1 Mobile Interface

The Flutter UI shall communicate with application/domain layers rather than directly accessing SQLite or raw HTTP APIs.

---

## 4.2 API Interface

The API shall use:

```text
REST / JSON over HTTPS
/api/v1
```

Requests shall use Firebase Bearer ID tokens.

The API shall use UTC timestamps.

---

## 4.3 Database Interface

### Local

```text
SQLite
```

### Cloud

```text
PostgreSQL
```

PostgreSQL is the canonical cloud database.

SQLite is the local operational database.

---

## 4.4 Firebase Interface

Firebase services include:

- Firebase Authentication.
- Firebase Cloud Messaging.
- Firebase Storage for optional private media.

---

# 5. Non-Functional Requirements

## NFR-001 Reliability

Already-configured reminders shall remain operational during network failure.

---

## NFR-002 Accessibility

Critical workflows shall be usable by senior citizens with accessibility needs.

---

## NFR-003 Security

The system shall implement:

- Authentication.
- Resource-level authorization.
- Input validation.
- Secure transport.
- Least privilege.
- Data minimization.

---

## NFR-004 Privacy

The system shall avoid collecting or retaining unnecessary personal or medication information.

---

## NFR-005 Performance

The critical local reminder path shall not depend on a network round trip.

---

## NFR-006 Maintainability

The application shall use modular separation between:

```text
Presentation
    ↓
Application / Use Cases
    ↓
Domain
    ↓
Data / Repositories
    ↓
Platform Services
```

The backend shall use:

```text
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
PostgreSQL
```

---

# 6. Security Requirements

The system shall:

- Verify Firebase tokens server-side.
- Never trust client-supplied `user_id`.
- Never trust client-supplied role.
- Verify resource ownership.
- Verify caregiver permissions.
- Validate state transitions.
- Use parameterized SQL or safe ORM access.
- Protect private media.
- Never expose secrets in the APK.
- Never log tokens or passwords.
- Avoid unnecessary sensitive logging.
- Use HTTPS/TLS.

---

# 7. Medical Safety Requirements

The software shall never autonomously:

- Change dose.
- Change frequency.
- Stop medication.
- Recommend medication.
- Diagnose conditions.
- Generate clinical advice.

Medication instructions shall come from the user or authorized caregiver.

---

# 8. Data Requirements

Core entities include:

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

Offline dose events shall have stable local identifiers.

---

# 9. Error Handling

The system shall provide clear states for:

- Loading.
- Empty data.
- Success.
- Error.
- Offline.
- Synchronizing.
- Authentication failure.
- Authorization failure.
- Invalid input.
- Reminder scheduling failure.
- Voice unavailable.

Errors shall not expose secrets or unnecessary sensitive information.

---

# 10. Offline and Synchronization Requirements

## Local Mutation

```text
User Action
 ↓
Validate
 ↓
Write SQLite
 ↓
Update UI
 ↓
Add Sync Queue Entry
```

## Synchronization

```text
Connectivity Available
 ↓
Read Pending Mutations
 ↓
Authenticate
 ↓
Send Mutation
 ↓
Server Validation
 ↓
Idempotency Check
 ↓
PostgreSQL Transaction
 ↓
Accept / Reject
 ↓
Update Local Sync State
```

Pending mutations shall remain queued until accepted or explicitly resolved.

---

# 11. Acceptance Requirements

The software shall not be considered complete unless the following are verified:

- Authentication works.
- Authorization works.
- Medicine CRUD works.
- Reminder scheduling works.
- Local reminder execution works.
- Voice reminder works.
- Visual reminder works.
- Taken works.
- Snooze works.
- Skip works.
- Dose history works.
- Offline operation works.
- Synchronization works.
- Idempotency works.
- Caregiver authorization works.
- Revocation works.
- Accessibility works.
- Notifications work.
- Security validation works.

---

# 12. Testing Requirements

Testing shall include:

- Unit tests.
- API/integration tests.
- Database migration tests.
- Authentication tests.
- Authorization tests.
- Offline tests.
- Synchronization tests.
- Idempotency tests.
- Reminder scheduling tests.
- Taken/Snooze/Skip tests.
- TTS tests.
- STT tests.
- Accessibility tests.
- Notification tests.
- Security tests.
- Android device testing.

---

# 13. Requirement Traceability

| Area | Source |
|---|---|
| Product | PRD |
| Software | SRS |
| Technical | TRD |
| UI/UX | UI/UX Design |
| Wireframes | 41-Wireframe Master |
| Architecture | Architecture & Engineering |
| Security | Security & Privacy |
| API | API Document |
| Database | Database Design |
| Frontend | Frontend Document |
| Backend | Backend Document |
| Deployment | Deployment & Operations |

---

# 14. Version

| Version | Date | Status |
|---|---|---|
| 1.0 | 27 Aug 2026 | Baseline / Development Ready |

---

## 15. Software Requirement Principle

> **The critical reminder path MUST work without internet.**
