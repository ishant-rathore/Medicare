<<<<<<< HEAD
# Frontend Architecture

=======
# Medicare — Frontend Architecture

## Voice Reminders for Senior Citizen Medications

**Document:** Frontend Architecture  
**Version:** 1.0  
**Platform:** Android-first  
**Framework:** Flutter  
**Language:** Dart  
**Local Database:** SQLite  
**Backend API:** REST/JSON over HTTPS  
**Authentication:** Firebase Authentication  
**Push Notifications:** Firebase Cloud Messaging (FCM)

---

# 1. Purpose

This document defines the frontend architecture of Medicare.

Medicare is an Android-first medication reminder application designed for senior citizens.

The frontend architecture prioritizes:

- Local-first reminder execution
- Accessibility
- Reliability
- Voice + visual interaction
- Offline operation
- Secure synchronization
- Clear separation of responsibilities
- Testability
- Maintainability

---

# 2. Frontend Architecture Principles

The Medicare frontend follows this layered architecture:

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

The architecture ensures that UI components do not directly access databases, HTTP APIs, or Android alarm APIs.

---

# 3. High-Level Architecture

```text
+--------------------------------------------------+
|                  PRESENTATION                    |
|                                                  |
| Screens / Widgets / Controllers / View Models    |
+-------------------------+------------------------+
                          |
                          v
+--------------------------------------------------+
|             APPLICATION / USE CASES              |
|                                                  |
| Add Medicine                                     |
| Configure Reminder                               |
| Record Dose                                      |
| Snooze Reminder                                  |
| Skip Reminder                                    |
| Sync Data                                        |
+-------------------------+------------------------+
                          |
                          v
+--------------------------------------------------+
|                     DOMAIN                       |
|                                                  |
| Medicine                                         |
| Reminder                                         |
| DoseEvent                                        |
| Caregiver                                        |
| RefillRule                                       |
| SyncOperation                                    |
+-------------------------+------------------------+
                          |
                          v
+--------------------------------------------------+
|                DATA / REPOSITORIES               |
|                                                  |
| Medicine Repository                              |
| Reminder Repository                             |
| Dose Repository                                  |
| Sync Repository                                  |
+-------------------------+------------------------+
                          |
              +-----------+-----------+
              |                       |
              v                       v
+----------------------+   +----------------------+
|      SQLite          |   |      REST API        |
|  Local Operational   |   |  HTTPS / JSON        |
|       Storage        |   |    /api/v1           |
+----------------------+   +----------------------+
              |
              v
+--------------------------------------------------+
|                 PLATFORM SERVICES                |
|                                                  |
| Android Alarm / Notification                     |
| TTS                                              |
| STT                                              |
| Connectivity                                     |
| Secure Storage                                   |
| Firebase Services                                |
+--------------------------------------------------+
```

---

# 4. Technology Stack

| Layer | Technology |
|---|---|
| UI | Flutter |
| Language | Dart |
| Local database | SQLite |
| Authentication | Firebase Authentication |
| Cloud messaging | Firebase Cloud Messaging |
| Backend | Node.js + Express + TypeScript |
| API | REST/JSON |
| Cloud database | PostgreSQL |
| Media | Firebase Storage |
| Platform | Android-first |

---

# 5. Project Structure

Recommended frontend structure:

```text
frontend/
├── lib/
│   ├── main.dart
│   │
│   ├── app/
│   │   ├── app.dart
│   │   ├── router.dart
│   │   └── theme.dart
│   │
│   ├── core/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── extensions/
│   │   ├── logging/
│   │   ├── network/
│   │   ├── storage/
│   │   └── utils/
│   │
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value_objects/
│   │
│   ├── application/
│   │   ├── auth/
│   │   ├── medicines/
│   │   ├── reminders/
│   │   ├── dose_events/
│   │   ├── caregivers/
│   │   ├── refills/
│   │   └── synchronization/
│   │
│   ├── data/
│   │   ├── local/
│   │   │   ├── database/
│   │   │   ├── dao/
│   │   │   └── models/
│   │   │
│   │   ├── remote/
│   │   │   ├── api/
│   │   │   ├── dto/
│   │   │   └── clients/
│   │   │
│   │   └── repositories/
│   │
│   ├── presentation/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── controllers/
│   │   └── view_models/
│   │
│   └── platform/
│       ├── alarms/
│       ├── notifications/
│       ├── tts/
│       ├── stt/
│       ├── connectivity/
│       └── permissions/
│
└── test/
    ├── unit/
    ├── widget/
    └── integration/
```

---

# 6. Presentation Layer

The Presentation layer is responsible for displaying information and collecting user interaction.

Responsibilities:

- Render screens.
- Display application state.
- Handle user gestures.
- Display errors.
- Display loading states.
- Display offline states.
- Display voice states.
- Provide accessibility support.

Examples:

```text
HomeScreen
MedicineListScreen
MedicineDetailsScreen
ReminderScreen
MedicationHistoryScreen
CaregiverScreen
SettingsScreen
AccessibilityScreen
```

---

# 7. Presentation Rules

UI code must NOT:

```text
Directly access SQLite
Directly execute SQL
Directly call REST APIs
Directly modify PostgreSQL
Directly schedule business operations
```

Instead:

```text
UI
 ↓
Controller / ViewModel
 ↓
Use Case
 ↓
Repository
```

---

# 8. Application / Use Case Layer

The Application layer coordinates user actions and business workflows.

Example use cases:

```text
SignIn
AddMedicine
UpdateMedicine
DeactivateMedicine
CreateReminder
UpdateReminder
RecordDose
TakeDose
SnoozeReminder
SkipReminder
GetMedicationHistory
ConfigureRefillRule
AuthorizeCaregiver
RevokeCaregiver
SynchronizePendingEvents
```

---

# 9. Use Case Example

Taking a medicine:

```text
ReminderScreen
      ↓
TakeDoseUseCase
      ↓
DoseRepository
      ↓
SQLite
      ↓
SyncQueue
```

The UI does not directly manipulate the database.

---

# 10. Domain Layer

The Domain layer represents Medicare's core concepts.

Primary entities include:

```text
User
Medicine
Reminder
DoseEvent
Caregiver
RefillRule
DeviceToken
MediaAsset
SyncOperation
```

Domain logic should remain independent of Flutter widgets and Android-specific implementation details.

---

# 11. Medicine Entity

Conceptual structure:

```text
Medicine
├── id
├── name
├── dose information
├── notes
├── active status
├── created timestamp
└── updated timestamp
```

Only information entered or configured by the user/caregiver should be represented.

---

# 12. Reminder Entity

Conceptual structure:

```text
Reminder
├── id
├── medicine ID
├── reminder time
├── schedule type
├── schedule configuration
├── enabled status
├── created timestamp
└── updated timestamp
```

Supported scheduling includes:

- Daily
- Weekly
- Alternate-day
- Custom
- Every-X-hours

---

# 13. Dose Event

A dose event records a user's action associated with a reminder.

Example states:

```text
TAKEN
SNOOZED
SKIPPED
```

Offline-created dose events must contain a stable:

```text
local_event_id
```

This identifier supports synchronization idempotency.

---

# 14. Repository Layer

Repositories provide an abstraction between application logic and data sources.

Examples:

```text
MedicineRepository
ReminderRepository
DoseEventRepository
CaregiverRepository
RefillRepository
SyncRepository
```

A repository may coordinate:

```text
SQLite
+
REST API
+
Sync Queue
```

---

# 15. Local-First Repository Strategy

Critical reminder operations prioritize local data.

Example:

```text
MedicineRepository
       |
       +--> SQLite
       |
       +--> Remote API
```

The application must not require the remote API to execute an already-configured local reminder.

---

# 16. SQLite

SQLite is the local operational database.

It stores information required for local operation, including:

- Medicines
- Reminders
- Dose events
- Sync queue
- Local application state

The exact database schema must remain consistent with the approved Database Design Document.

---

# 17. Remote API

The frontend communicates with the backend through:

```text
REST/JSON
HTTPS
/api/v1
```

Protected requests use Firebase Bearer ID tokens.

Conceptual request:

```text
Authorization: Bearer <Firebase ID Token>
```

Tokens must not be logged.

---

# 18. Authentication

Authentication uses Firebase Authentication.

Flow:

```text
User
 ↓
Flutter Authentication UI
 ↓
Firebase Authentication
 ↓
Authenticated User
 ↓
Firebase ID Token
 ↓
Backend API
 ↓
Server-side Token Verification
```

The frontend must not assume that authentication alone grants resource access.

The backend remains responsible for authorization.

---

# 19. Authorization

Frontend controls may hide unavailable actions, but security cannot depend on the frontend.

The backend must verify:

- User identity.
- Resource ownership.
- Caregiver authorization.
- Permission scope.
- Revocation state.

---

# 20. Local Reminder Architecture

The critical reminder path is:

```text
SQLite
  ↓
Local Reminder Schedule
  ↓
Android Alarm
  ↓
Notification / Full-Screen Reminder
  ↓
TTS Voice Reminder
  ↓
Taken / Snooze / Skip
  ↓
Local Dose Event
  ↓
Sync Queue
```

This path must work without internet connectivity.

---

# 21. Android Alarm Service

The Android alarm layer is responsible for triggering configured local reminders.

The service should:

- Read locally configured reminder data.
- Schedule alarms.
- Reschedule alarms when configuration changes.
- Handle required Android lifecycle behavior.
- Trigger the reminder experience.

Cloud connectivity must not be a prerequisite for an existing local reminder.

---

# 22. Notification Service

The notification layer handles Android reminder notifications.

It should support:

- Medication reminder notifications.
- Required reminder presentation.
- Full-screen reminder behavior where approved.
- Notification actions where supported.
- Accessibility-compatible notification content.

---

# 23. TTS Architecture

Text-to-Speech provides voice reminders.

Flow:

```text
Reminder Trigger
      ↓
Load Local Reminder
      ↓
Build Reminder Message
      ↓
TTS Service
      ↓
Voice Output
```

Example:

```text
"Your medication reminder is due."
```

The spoken information must come from configured application data.

---

# 24. STT Architecture

Speech-to-Text supports defined commands.

Example commands:

```text
Taken
Snooze
Skip
```

Flow:

```text
User activates voice
       ↓
Listening state
       ↓
STT
       ↓
Command recognition
       ↓
Command validation
       ↓
Use Case
```

Unknown speech must not cause unintended medication state changes.

---

# 25. Voice Safety

Voice is primary but never the only interaction method.

The interface must always provide visible alternatives:

```text
Voice
 +
Touch Controls
```

The application must clearly show when it is listening.

Continuous microphone listening is not required unless explicitly approved.

Speech transcripts should not be retained unless required.

---

# 26. Offline-First Architecture

Offline behavior:

```text
                    INTERNET
                       |
             +---------+---------+
             |                   |
             v                   v
          ONLINE              OFFLINE
             |                   |
             v                   v
       Remote API          SQLite Local
             |                   |
             +---------+---------+
                       |
                       v
                  Application
```

The local database remains operational when network connectivity is unavailable.

---

# 27. Synchronization

Offline mutations are placed into a local sync queue.

Example:

```text
User Action
    ↓
SQLite Transaction
    ↓
Dose Event Saved
    ↓
Sync Queue Entry
    ↓
Internet Available
    ↓
API Request
    ↓
Server Validation
    ↓
PostgreSQL Transaction
    ↓
Accepted
    ↓
Queue Entry Completed
```

---

# 28. Idempotent Synchronization

Synchronization must prevent duplicate events.

Example:

```text
local_event_id = ABC-123
```

If the same event is submitted again:

```text
ABC-123
     ↓
Server
     ↓
Existing Event?
     ↓
YES
     ↓
Return Existing Result
```

The retry must not create a second dose event.

---

# 29. Connectivity Service

The connectivity service detects changes in network availability.

Example:

```text
ONLINE
  ↓
OFFLINE
  ↓
Local-only operation
  ↓
ONLINE
  ↓
Trigger synchronization
```

Connectivity status must not disable local reminders.

---

# 30. Secure Storage

Sensitive local credentials or tokens must use secure platform storage where required.

Never:

```text
Hard-code secrets
Store privileged credentials in APK
Log authentication tokens
Log passwords
```

---

# 31. Media Handling

Optional private media may include:

- Medicine photographs.
- Family voice recordings.

Private media must be:

- Access-controlled.
- Associated with authorized resources.
- Uploaded only when required.
- Stored using approved Firebase Storage architecture.

---

# 32. Accessibility Architecture

Accessibility is a core frontend requirement.

The application should support:

- Large text.
- High contrast.
- Large touch targets.
- Screen readers.
- Voice reminders.
- Vibration.
- Clear focus states.
- Simple wording.

Important information must not depend on color alone.

---

# 33. State Management

Frontend state should represent clear application states.

Example:

```text
Initial
Loading
Loaded
Empty
Error
Offline
SyncPending
Syncing
Success
```

Reminder state may include:

```text
Upcoming
Due
Taken
Snoozed
Skipped
```

---

# 34. Error Handling

Errors should be handled at the appropriate layer.

Example:

```text
Repository
    ↓
Domain/Application Error
    ↓
Controller/ViewModel
    ↓
User-Friendly UI
```

Technical errors should not be exposed directly to senior users.

Example:

```text
Unable to synchronize.

Your local information is safe.

[ TRY AGAIN ]
```

---

# 35. Loading States

Every network-dependent screen should define a loading state.

Example:

```text
Loading...
Please wait.
```

The UI should not appear frozen.

---

# 36. Empty States

Empty states must provide a useful next action.

Example:

```text
No medicines added yet.

Add your first medicine
to create reminders.

[ ADD MEDICINE ]
```

---

# 37. Offline State

The user should be able to understand when the device is offline.

Example:

```text
OFFLINE

Your reminders still work
on this device.

Pending actions will sync
when connection is available.
```

---

# 38. Navigation Architecture

Navigation should remain simple.

Conceptual navigation:

```text
Home
 ├── Medicines
 │    ├── Medicine Details
 │    ├── Edit Medicine
 │    └── Add Reminder
 │
 ├── History
 │
 ├── Caregiver
 │
 └── Settings
      ├── Accessibility
      ├── Voice
      ├── Notifications
      ├── Privacy
      └── Help
```

---

# 39. Dependency Direction

Dependencies should move toward stable abstractions.

```text
Presentation
      ↓
Application
      ↓
Domain
      ↑
Data
      ↑
Platform
```

Presentation should not become coupled directly to infrastructure.

---

# 40. Frontend Security Rules

The frontend must:

- Use HTTPS.
- Use Firebase Authentication correctly.
- Avoid storing secrets in source code.
- Avoid logging tokens.
- Validate user input.
- Handle authentication failures.
- Protect private UI data.
- Request only required permissions.
- Respect caregiver access state.

Frontend validation is for usability.

Backend validation is authoritative for security.

---

# 41. Medical Safety Boundaries

Medicare is not a clinical decision-support system.

The frontend must never provide functionality that:

```text
Diagnoses a condition
Changes dosage
Changes medication frequency
Prescribes medicine
Recommends stopping medication
Generates clinical advice
```

The application should display medication information entered by the user/caregiver.

---

# 42. Permission Strategy

Request only necessary Android permissions.

Permission requests should explain:

```text
What permission is needed
Why it is needed
What feature uses it
```

If a permission is denied, the application should provide an appropriate fallback wherever possible.

---

# 43. Testing Architecture

Frontend testing should include:

### Unit tests

Test:

- Use cases.
- Domain logic.
- Schedule calculations.
- Synchronization logic.
- Validation.

### Widget tests

Test:

- Screens.
- Buttons.
- Accessibility labels.
- Error states.
- Loading states.
- Offline states.

### Integration tests

Test:

```text
Reminder
 ↓
User Action
 ↓
SQLite
 ↓
Sync Queue
 ↓
API
```

---

# 44. Critical Reminder Test

The following scenario must pass:

```text
Configure Reminder
       ↓
Disable Internet
       ↓
Wait for Reminder
       ↓
Android Alarm Fires
       ↓
Reminder Screen Opens
       ↓
TTS Plays
       ↓
User Selects TAKEN
       ↓
Dose Event Saved Locally
```

Failure of the internet must not break this flow.

---

# 45. Frontend QA Checklist

### Architecture

- [ ] Presentation does not directly access SQLite.
- [ ] Presentation does not directly call REST APIs.
- [ ] Business logic is in use cases/services.
- [ ] Repository abstractions are used.
- [ ] Platform services are isolated.

### Reminder

- [ ] Local reminder scheduling works.
- [ ] Android alarm works.
- [ ] Notification works.
- [ ] Full-screen reminder works where required.
- [ ] TTS works.
- [ ] Touch fallback works.

### Dose Actions

- [ ] Taken works.
- [ ] Snooze works.
- [ ] Skip works.
- [ ] Dose history is updated.
- [ ] Local events have stable IDs.

### Offline

- [ ] Reminder works without internet.
- [ ] Dose event is saved locally.
- [ ] Sync queue persists.
- [ ] Retry works.
- [ ] Duplicate events are prevented.

### Accessibility

- [ ] Large text supported.
- [ ] High contrast supported.
- [ ] Large touch targets used.
- [ ] Screen readers supported.
- [ ] Color is not the only status indicator.
- [ ] Voice fallback exists.

### Security

- [ ] No secrets in APK.
- [ ] Tokens are not logged.
- [ ] HTTPS is enforced.
- [ ] Permissions are minimized.
- [ ] Private media is protected.

---

# 46. Frontend Non-Functional Requirements

The frontend should prioritize:

| Requirement | Goal |
|---|---|
| Reliability | Local reminders remain operational |
| Accessibility | Senior-first interaction |
| Security | Least privilege and secure defaults |
| Privacy | Data minimization |
| Offline support | Core reminder path works offline |
| Maintainability | Layered architecture |
| Testability | Isolated business logic |
| Usability | Simple and forgiving interaction |

---

# 47. Architecture Decision Summary

Medicare uses:

```text
Flutter + Dart
        ↓
Layered Frontend Architecture
        ↓
Presentation
        ↓
Application / Use Cases
        ↓
Domain
        ↓
Repositories
        ↓
SQLite + REST API
        ↓
Android / Firebase Platform Services
```

The most important architectural rule is:

```text
LOCAL-FIRST
```

The application must be capable of executing already-configured medication reminders without depending on cloud connectivity.

---

# 48. Final Frontend Principle

> **The frontend must make medication reminders reliable, accessible, understandable, and usable even when the internet is unavailable.**
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
