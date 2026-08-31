<<<<<<< HEAD
# Technical Requirements Document

=======
# Medicare — Technical Requirements Document

## Voice Reminders for Senior Citizen Medications

> **“Your Trusted Voice Medication Companion”**

| Document Item | Value |
|---|---|
| Document Type | Technical Requirements Document |
| Product | Medicare |
| Project | Voice Reminders for Senior Citizen Medications |
| Project Type | Community Engagement Project (CEP) / Academic Software Project |
| Platform | Android-first mobile application |
| Primary Users | Senior citizens and caregivers |
| Version | 1.0 |
| Status | Baseline / Development Ready |
| Technical Principle | Senior-first, voice-first, offline-capable, secure and modular |

---

# 1. Purpose and Technical Objectives

This TRD defines how Medicare shall be engineered, integrated, tested and deployed.

It specifies:

- Architecture.
- Technology stack.
- Mobile requirements.
- Reminder engine.
- Voice engine.
- Backend.
- REST API.
- Database.
- Synchronization.
- Security.
- Accessibility.
- Media storage.
- Performance.
- Testing.
- Deployment.
- Technical acceptance.

---

# 2. Technical North Star

> **Keep the local reminder path reliable even when cloud services are unavailable.**

The cloud must never become a prerequisite for an already-configured medication reminder.

---

# 3. Approved Technology Stack

| Layer | Technology |
|---|---|
| Mobile Framework | Flutter |
| Mobile Language | Dart |
| Local Database | SQLite |
| Backend Runtime | Node.js |
| Backend Framework | Express |
| Backend Language | TypeScript |
| Cloud Database | PostgreSQL |
| Authentication | Firebase Authentication |
| Messaging | Firebase Cloud Messaging |
| Optional Media | Firebase Storage |
| API | REST / JSON |
| Transport | HTTPS |
| API Version | `/api/v1` |
| Platform | Android-first |

No technology that contradicts this approved baseline shall be introduced without an explicit architectural decision.

---

# 4. System Architecture

## 4.1 High-Level Architecture

```text
+-----------------------------+
|      Flutter Android App    |
+-------------+---------------+
              |
      +-------+-------+
      |               |
      v               v
   SQLite       Android Platform
      |          Alarm / TTS / STT
      |
      v
  Sync Queue
      |
      | HTTPS
      v
+-----------------------------+
| Node.js + Express + TS      |
+-------------+---------------+
              |
              v
        PostgreSQL
              
Firebase:
- Authentication
- FCM
- Storage
```

---

# 5. Local-First Reminder Architecture

The reminder path shall be:

```text
SQLite Medicine Data
        ↓
Local Reminder Schedule
        ↓
Android Alarm
        ↓
Notification / Full-Screen Reminder
        ↓
TTS + Visual Reminder
        ↓
Taken / Snooze / Skip
        ↓
SQLite Dose History
        ↓
Sync Queue
        ↓
REST API
        ↓
PostgreSQL
```

Network failure shall not break this path.

---

# 6. Mobile Application Architecture

The Flutter application shall follow:

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

### Presentation

Responsible for:

- Screens.
- Widgets.
- UI state.
- Accessibility presentation.

### Application

Responsible for:

- Use cases.
- Workflow orchestration.
- Application state.

### Domain

Responsible for:

- Entities.
- Value objects.
- Business rules.

### Data

Responsible for:

- Repositories.
- SQLite access.
- API clients.
- Synchronization.

### Platform Services

Responsible for:

- Android alarms.
- Notifications.
- TTS.
- STT.
- Device capabilities.

UI must not directly:

- Manipulate SQLite.
- Call raw HTTP APIs.
- Schedule Android alarms.

---

# 7. Backend Architecture

The backend shall use a modular monolith.

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

### Routes

Define HTTP endpoints.

### Middleware

Handle:

- Authentication.
- Authorization.
- Request metadata.
- Validation middleware.

### Controllers

Controllers shall remain thin.

### Services

Services contain business logic.

### Repositories

Repositories contain database access.

---

# 8. Authentication

Firebase Authentication shall provide user identity.

The backend shall:

1. Receive Firebase Bearer ID token.
2. Verify token server-side.
3. Extract trusted identity.
4. Authorize requested resource.
5. Execute permitted operation.

The backend shall never trust client-supplied:

```text
user_id
role
ownership
permissions
```

---

# 9. Authorization

Authorization shall be performed at resource level.

For every protected resource the backend shall verify:

```text
Authenticated?
    ↓
Correct owner?
    ↓
Authorized caregiver?
    ↓
Required permission?
    ↓
Allowed operation?
```

Revoked caregiver permissions shall immediately prevent protected access.

---

# 10. Medicine Technical Requirements

The medicine module shall support:

- Create.
- Read.
- Update.
- Deactivate.

Writable fields shall be allow-listed.

The server shall validate:

- Authentication.
- Ownership.
- Input fields.
- State transitions.

---

# 11. Reminder Engine

The reminder engine shall support:

- Daily.
- Weekly.
- Alternate-day.
- Custom.
- Every-X-hours schedules.

Reminder scheduling shall be local.

Cloud synchronization may update configuration but shall not be required to trigger an already-configured reminder.

---

# 12. Reminder State Machine

```text
SCHEDULED
    ↓
TRIGGERED
   / | \
  /  |  \
Taken Snooze Skip
 |     |     |
 v     v     v
TAKEN SNOOZED SKIPPED
          |
          v
       TRIGGERED
```

If the configured acknowledgement window expires:

```text
TRIGGERED
    ↓
MISSED
    ↓
Caregiver Alert (if enabled)
```

Server-side state transitions shall be validated.

---

# 13. Android Alarm Requirements

The Android layer shall provide local reminder execution.

The reminder system shall:

- Schedule configured reminders.
- Trigger reminders at configured times.
- Provide notification behavior.
- Support the full-screen reminder experience where required.
- Remain independent of network availability.

---

# 14. Voice Engine

## TTS

TTS shall:

- Read configured medication reminder information.
- Use device speech capabilities.
- Respect user voice settings.
- Provide visual alternatives.

## STT

STT shall:

- Recognize defined commands.
- Clearly display listening state.
- Provide fallback controls.
- Avoid continuous listening.

Speech transcripts shall not be retained unless required.

---

# 15. Accessibility Engineering

The UI shall implement:

- Large typography.
- High contrast.
- Large touch targets.
- Screen-reader support.
- Voice feedback.
- Vibration.
- Clear focus.
- Simple wording.
- Forgiving interaction.

Important state shall not rely on color alone.

---

# 16. SQLite Requirements

SQLite is the operational local database.

It shall support:

```text
Users / profile data
Medicines
Reminders
Dose events
Sync queue
Local preferences
```

The local database must support operation without internet connectivity.

---

# 17. PostgreSQL Requirements

PostgreSQL is the canonical cloud database.

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

Database operations shall use:

- Parameterized SQL or safe ORM.
- Transactions for multi-record changes.
- Constraints.
- Appropriate indexes.
- Resource ownership validation.

---

# 18. Dose Event Requirements

Every offline dose event shall contain a stable:

```text
local_event_id
```

This identifier is used to provide idempotent synchronization.

The server shall validate:

- User identity.
- Resource ownership.
- Event identity.
- State transition.
- Payload validity.

---

# 19. Synchronization Architecture

## Local Write

```text
User Action
 ↓
Validate
 ↓
SQLite Transaction
 ↓
Create local_event_id
 ↓
Add Pending Sync Record
```

## Cloud Sync

```text
Pending Event
 ↓
Authenticate
 ↓
Send HTTPS Request
 ↓
Server Authentication
 ↓
Authorization
 ↓
Idempotency Check
 ↓
Validate State
 ↓
PostgreSQL Transaction
 ↓
Accept
 ↓
Mark Local Event Synced
```

---

# 20. Idempotency

Synchronization must be idempotent.

If the same event is submitted multiple times:

```text
Request 1 → Accepted
Request 2 → Existing Event Detected
Request 3 → Existing Event Detected
```

The system must not create duplicate dose events.

---

# 21. API Requirements

The API shall use:

```text
REST / JSON
HTTPS
/api/v1
```

Requests shall include Firebase authentication.

API requirements include:

- UTC timestamps.
- UUID or opaque resource identifiers.
- Pagination/filtering where applicable.
- `X-Request-Id`.
- Consistent success responses.
- Consistent error responses.
- Idempotent dose-event synchronization.

---

# 22. API Resource Areas

The API shall support resources for:

```text
User / Profile
Medicines
Reminders
Dose Events
History
Adherence
Caregivers
Synchronization
Device Tokens
Media
Health / Readiness
```

---

# 23. Security Requirements

The technical implementation shall follow:

- Zero trust.
- Least privilege.
- Data minimization.
- Secure defaults.
- Privacy by design.

The system shall:

- Verify Firebase tokens server-side.
- Validate all inputs.
- Validate authorization.
- Protect private media.
- Use HTTPS/TLS.
- Avoid secrets in source code.
- Avoid secrets in the APK.
- Never log tokens/passwords.
- Avoid unnecessary sensitive logging.

---

# 24. Media and Voice Storage

Optional media may include:

- Medicine photos.
- Family voice recordings.

Private media shall use controlled access.

Firebase Storage may be used for optional private media.

The system shall not expose private media publicly.

---

# 25. Notification Architecture

Local Android notifications/alarm mechanisms are responsible for the critical reminder path.

Firebase Cloud Messaging may be used for remote messaging such as caregiver notifications where required.

FCM shall not be used as the sole mechanism for already-configured medication reminders.

---

# 26. Performance Requirements

The application shall prioritize:

1. Local reminder reliability.
2. Fast reminder presentation.
3. Responsive senior-first UI.
4. Offline operation.
5. Reliable synchronization.

The reminder path shall not depend on cloud latency.

---

# 27. Reliability Requirements

The system shall tolerate:

- No internet.
- Temporary API failure.
- Temporary Firebase failure.
- Synchronization failure.
- Duplicate synchronization requests.
- Application restart.
- Recoverable notification failures.

Pending mutations shall remain queued until accepted.

---

# 28. Error Handling

Errors shall be:

- Explicit.
- Safe.
- Understandable.
- Recoverable where possible.

The UI shall support:

```text
Loading
Empty
Success
Error
Offline
Syncing
Authentication failure
Authorization failure
```

Technical errors shall not expose secrets or internal database information.

---

# 29. Observability

Backend logging shall use structured logs.

Logs shall contain appropriate technical information such as:

- Request ID.
- Endpoint.
- Operation result.
- Error category.
- Timing information.

Logs shall avoid:

- Passwords.
- Tokens.
- Secrets.
- Unnecessary medication details.
- Unnecessary personal information.

---

# 30. Deployment Architecture

The environment strategy shall be:

```text
Development
    ↓
Staging / Test
    ↓
Production / Demo
```

Release flow:

```text
Git
 ↓
CI
 ↓
Build
 ↓
Staging
 ↓
Smoke Tests
 ↓
Approval
 ↓
Release
```

---

# 31. Secret Management

Secrets shall never be hard-coded into:

- Flutter source.
- Android APK.
- Git repository.
- Public configuration.

Sensitive credentials shall be managed through appropriate environment/configuration mechanisms.

---

# 32. Testing Requirements

Technical validation shall include:

### Frontend

- Unit tests.
- Widget tests.
- Accessibility tests.
- Reminder UI tests.

### Backend

- Unit tests.
- API integration tests.
- Authorization tests.
- Validation tests.

### Database

- Migration tests.
- Constraint tests.
- Transaction tests.

### Synchronization

- Offline tests.
- Retry tests.
- Duplicate-event tests.
- Idempotency tests.

### Android

- Alarm tests.
- Notification tests.
- TTS tests.
- STT tests.
- Device tests.

### Security

- Authentication tests.
- Authorization tests.
- Input validation tests.
- Secret exposure checks.
- Access-control tests.

---

# 33. Technical Acceptance Criteria

The technical implementation is acceptable when:

- Flutter application builds successfully.
- Backend TypeScript compiles successfully.
- PostgreSQL schema is valid.
- SQLite local storage works.
- Authentication is verified server-side.
- Authorization is resource-level.
- Local reminders work without internet.
- Android alarms work.
- Notifications work.
- TTS works.
- STT works.
- Taken/Snooze/Skip work.
- Dose events are stored locally.
- Synchronization works.
- Synchronization is idempotent.
- Caregiver authorization works.
- Revocation works.
- Accessibility requirements are verified.
- Security tests pass.

---

# 34. Technical Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Network failure | Local-first reminder execution |
| Duplicate sync | Stable local event ID + idempotency |
| Unauthorized access | Server-side resource authorization |
| Database corruption | Transactions and migration testing |
| Voice failure | Visible fallback controls |
| Notification failure | Android reminder testing |
| Accessibility issues | Accessibility QA |
| Secret exposure | Secure configuration |
| Unsafe medication behavior | Strict medical-safety constraints |

---

# 35. Coding Standards

The implementation shall prefer:

- Strong typing.
- Clear naming.
- Reusable components.
- Separation of concerns.
- Defensive validation.
- Explicit errors.
- Testable services.
- Secure defaults.
- Minimal dependencies.

Unrelated code shall not be rewritten without reason.

---

# 36. Repository Architecture

Recommended repository organization:

```text
docs/
├── 01-project/
├── 02-requirements/
│   ├── PRD.md
│   ├── SRS.md
│   └── TRD.md
├── 03-architecture/
├── 04-ui-ux/
├── 05-database/
├── 06-api/
├── 07-backend/
├── 08-frontend/
├── 09-security/
├── 10-deployment/
└── 11-testing/
```

---

# 37. Technical Traceability

| Requirement | Technical Baseline |
|---|---|
| Product requirements | PRD |
| Software requirements | SRS |
| Architecture | Architecture & Engineering |
| UI/UX | UI/UX Design |
| Wireframes | 41-Wireframe Master |
| Database | Database Design |
| API | API Document |
| Backend | Backend Document |
| Frontend | Frontend Document |
| Security | Security & Privacy |
| Deployment | Deployment & Operations |

---

# 38. Version Control

| Version | Date | Status |
|---|---|---|
| 1.0 | 27 Aug 2026 | Baseline / Development Ready |

---

# 39. Final Technical Principle

> **Local reminders first. Cloud synchronization second. Security and accessibility throughout.**
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
