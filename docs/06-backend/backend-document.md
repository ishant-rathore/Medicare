# Medicare — Backend Architecture

## Voice Reminders for Senior Citizen Medications

**Document:** Backend Architecture  
**Version:** 1.0  
**Backend:** Node.js + Express + TypeScript  
**Database:** PostgreSQL  
**API:** REST/JSON  
**API Version:** `/api/v1`  
**Authentication:** Firebase Authentication  
**Cloud Storage:** Firebase Storage  
**Architecture:** Modular Monolith

---

# 1. Purpose

This document defines the backend architecture for Medicare.

Medicare is an Android-first medication reminder and organization application for senior citizens.

The backend is responsible for:

- Authentication verification
- Authorization
- User and resource ownership
- Medicine data
- Reminder data
- Dose events
- Caregiver authorization
- Refill rules
- Device tokens
- Media metadata
- Synchronization
- Idempotency
- PostgreSQL persistence
- Secure API communication

The backend must support the application's **LOCAL-FIRST** operating model.

---

# 2. Backend Architecture Principles

The backend follows these principles:

- Secure by default
- Least privilege
- Zero trust
- Server-side authorization
- Strong input validation
- Resource-level authorization
- Parameterized database access
- Idempotent synchronization
- Transactional multi-record operations
- Thin controllers
- Business logic in services
- Database access in repositories
- Structured logging
- Data minimization
- Privacy by design

---

# 3. Architecture Style

Medicare uses a **Modular Monolith**.

The backend is organized as:

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

Supporting services handle:

```text
Authentication
Authorization
Synchronization
Validation
Logging
Firebase Services
```

---

# 4. High-Level Architecture

```text
+------------------------------------------------------+
|                    Flutter App                      |
+---------------------------+--------------------------+
                            |
                            | HTTPS / REST / JSON
                            |
                            v
+------------------------------------------------------+
|                  Express API Server                 |
|                                                      |
|  /api/v1                                             |
+---------------------------+--------------------------+
                            |
                            v
+------------------------------------------------------+
|                    Middleware                        |
|                                                      |
| Authentication                                       |
| Authorization                                        |
| Validation                                           |
| Request ID                                           |
| Error Handling                                       |
+---------------------------+--------------------------+
                            |
                            v
+------------------------------------------------------+
|                    Controllers                       |
|                                                      |
| Auth / Users / Medicines / Reminders                |
| Dose Events / Caregivers / Refills / Sync           |
+---------------------------+--------------------------+
                            |
                            v
+------------------------------------------------------+
|                      Services                        |
|                                                      |
| Business Rules                                       |
| Ownership                                            |
| State Transitions                                    |
| Synchronization                                      |
| Idempotency                                          |
+---------------------------+--------------------------+
                            |
                            v
+------------------------------------------------------+
|                    Repositories                      |
|                                                      |
| PostgreSQL Data Access                               |
+---------------------------+--------------------------+
                            |
                            v
+------------------------------------------------------+
|                    PostgreSQL                        |
+------------------------------------------------------+
```

---

# 5. Technology Stack

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| API | REST/JSON |
| API version | `/api/v1` |
| Database | PostgreSQL |
| Authentication | Firebase Authentication |
| Storage | Firebase Storage |
| Transport | HTTPS/TLS |
| Architecture | Modular Monolith |

---

# 6. Recommended Backend Structure

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── environment.ts
│   │   └── firebase.ts
│   │
│   ├── middleware/
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   ├── validation.ts
│   │   ├── request-id.ts
│   │   └── error-handler.ts
│   │
│   ├── routes/
│   │   └── v1/
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── domain/
│   │   ├── users/
│   │   ├── medicines/
│   │   ├── reminders/
│   │   ├── dose-events/
│   │   ├── caregivers/
│   │   ├── refill-rules/
│   │   ├── device-tokens/
│   │   ├── media-assets/
│   │   └── sync/
│   │
│   ├── validation/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── connection.ts
│   │
│   ├── integrations/
│   │   ├── firebase/
│   │   └── storage/
│   │
│   ├── logging/
│   │
│   └── utils/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── authorization/
│   └── synchronization/
│
└── package.json
```

---

# 7. API Architecture

All application APIs are versioned under:

```text
/api/v1
```

Example:

```text
/api/v1/users
/api/v1/medicines
/api/v1/reminders
/api/v1/dose-events
/api/v1/caregivers
/api/v1/refill-rules
/api/v1/sync
```

The API uses:

```text
REST
+
JSON
+
HTTPS
```

---

# 8. Request Flow

A protected request follows:

```text
Flutter
   ↓
HTTPS Request
   ↓
Express Router
   ↓
Request ID Middleware
   ↓
Firebase Authentication Middleware
   ↓
Authorization Middleware
   ↓
Input Validation
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
   ↓
Service
   ↓
Controller
   ↓
JSON Response
```

---

# 9. Authentication

Medicare uses Firebase Authentication.

The client obtains a Firebase ID token.

The token is sent to the backend using:

```text
Authorization: Bearer <Firebase-ID-Token>
```

The backend must verify the token server-side.

The backend must not trust:

```text
user_id
role
permissions
ownership
```

when supplied by the client.

---

# 10. Authentication Flow

```text
User
 ↓
Firebase Authentication
 ↓
Firebase ID Token
 ↓
Flutter
 ↓
Authorization Header
 ↓
Backend
 ↓
Verify Firebase ID Token
 ↓
Authenticated Identity
```

Only verified identity information should be used for authorization decisions.

---

# 11. Authorization

Authentication answers:

```text
Who is this user?
```

Authorization answers:

```text
Is this user allowed to perform this operation
on this resource?
```

Authorization must be enforced server-side.

---

# 12. Resource-Level Authorization

For every protected resource, the backend should verify:

```text
Authenticated User
        ↓
Resource Exists
        ↓
Resource Belongs to User?
        ↓
Caregiver Authorization?
        ↓
Permission Scope?
        ↓
Action Allowed?
```

A valid Firebase token alone does not grant access to another user's data.

---

# 13. Caregiver Authorization

Caregiver access requires explicit authorization.

Conceptual flow:

```text
Owner
  ↓
Authorize Caregiver
  ↓
Define Permission Scope
  ↓
Caregiver Access
```

The backend must verify caregiver permissions for every protected request.

---

# 14. Caregiver Revocation

When caregiver access is revoked:

```text
Owner
  ↓
Revoke Authorization
  ↓
Database Updated
  ↓
Future Requests
  ↓
Authorization Check
  ↓
Access Denied
```

Revocation must be enforced server-side.

---

# 15. Controller Layer

Controllers should remain thin.

Responsibilities:

- Receive validated request.
- Extract authenticated identity.
- Call service.
- Return response.
- Map known errors to HTTP responses.

Controllers should not contain:

```text
Complex business rules
Raw SQL
Database transaction logic
Authorization decisions
Synchronization algorithms
```

---

# 16. Service Layer

Services contain business logic.

Examples:

```text
MedicineService
ReminderService
DoseEventService
CaregiverService
RefillService
SyncService
UserService
```

Responsibilities include:

- Business validation
- State transitions
- Ownership checks
- Authorization coordination
- Transaction coordination
- Idempotency
- Synchronization logic

---

# 17. Repository Layer

Repositories handle PostgreSQL access.

Examples:

```text
UserRepository
MedicineRepository
ReminderRepository
DoseEventRepository
CaregiverRepository
RefillRuleRepository
DeviceTokenRepository
MediaAssetRepository
SyncRepository
```

Repositories should:

- Use parameterized queries or safe ORM/database abstractions.
- Keep SQL/database details out of controllers.
- Return typed data.
- Support transactions where required.

---

# 18. Database

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

SQLite remains the local operational database on the Android device.

---

# 19. PostgreSQL Responsibility

PostgreSQL provides:

- Canonical cloud persistence
- Cross-device synchronization
- Authorized caregiver data access
- Cloud medication history
- Server-side consistency
- Synchronization state

The cloud database must not be required for already-configured local reminders to execute.

---

# 20. Medicine API

Conceptual endpoints:

```text
GET    /api/v1/medicines
POST   /api/v1/medicines
GET    /api/v1/medicines/:id
PATCH  /api/v1/medicines/:id
DELETE /api/v1/medicines/:id
```

Actual endpoint behavior must remain consistent with the approved API specification.

---

# 21. Reminder API

Conceptual endpoints:

```text
GET    /api/v1/reminders
POST   /api/v1/reminders
GET    /api/v1/reminders/:id
PATCH  /api/v1/reminders/:id
DELETE /api/v1/reminders/:id
```

Reminder configuration must support the approved schedule types.

---

# 22. Dose Event API

Dose events represent user actions such as:

```text
TAKEN
SNOOZED
SKIPPED
```

Offline events must include a stable:

```text
local_event_id
```

This identifier is used to provide idempotent synchronization.

---

# 23. Dose Event Synchronization

Conceptual request:

```text
POST /api/v1/dose-events
```

The server should validate:

```text
Authentication
        ↓
Ownership
        ↓
Event Identity
        ↓
Reminder Relationship
        ↓
Valid State Transition
        ↓
Idempotency
        ↓
Persist
```

---

# 24. Idempotency

Synchronization requests may be retried because of:

- Network failure
- Timeout
- Application restart
- Connectivity changes

The backend must prevent duplicate records.

Example:

```text
Client Event

local_event_id = 12345
        ↓
POST
        ↓
Server creates event
        ↓
Response lost
        ↓
Client retries
        ↓
Server receives 12345
        ↓
Existing event found
        ↓
Return existing result
```

No duplicate dose event should be created.

---

# 25. Sync Validation

For each synchronization mutation, the server must revalidate:

```text
Identity
Ownership
Event identity
Resource relationship
Valid state transition
Payload
Idempotency
```

Client-side validation is not sufficient.

---

# 26. Synchronization Flow

```text
Flutter Local Queue
       ↓
HTTPS
       ↓
Authentication
       ↓
Authorization
       ↓
Validation
       ↓
Sync Service
       ↓
Idempotency Check
       ↓
Repository
       ↓
PostgreSQL Transaction
       ↓
Success
       ↓
Response
       ↓
Client Marks Event Accepted
```

---

# 27. Transaction Management

Transactions must be used when multiple related database records must change together.

Example:

```text
BEGIN
   ↓
Update Medicine
   ↓
Update Related Reminder
   ↓
Write Synchronization Record
   ↓
COMMIT
```

If an operation fails:

```text
ROLLBACK
```

Partial state must be avoided.

---

# 28. Input Validation

All externally supplied input must be validated.

Validate:

- Required fields
- Data types
- String lengths
- UUID/resource identifiers
- Dates
- Times
- Schedule configuration
- Enumerated states
- Pagination parameters
- Filter parameters

Unexpected fields should not be blindly written to the database.

---

# 29. Allow-Listed Writable Fields

The backend should explicitly define writable fields.

Do not accept arbitrary objects such as:

```json
{
  "user_id": "...",
  "role": "admin",
  "permissions": ["all"]
}
```

unless those fields are explicitly supported and authorized.

Client-supplied authorization fields must never override server-side authorization.

---

# 30. State Validation

Medication-related state changes must be validated server-side.

For example:

```text
Pending
   ↓
Taken
```

is different from blindly accepting arbitrary state transitions.

The backend should reject invalid or unauthorized transitions.

---

# 31. Pagination

List endpoints should support pagination where applicable.

Example conceptual parameters:

```text
?page=1&page_size=20
```

The implementation must follow the approved API specification.

---

# 32. Filtering

Where applicable, collection endpoints may support controlled filtering.

Example:

```text
GET /api/v1/medicines?active=true
```

Only approved filter fields should be accepted.

---

# 33. Request ID

Requests should support:

```text
X-Request-Id
```

The request identifier helps with:

- Debugging
- Traceability
- Structured logging
- Support investigation

Request IDs must not contain sensitive information.

---

# 34. Error Response

API errors should use a consistent structure.

Conceptual example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "request_id": "..."
  }
}
```

Do not expose:

```text
Database credentials
SQL statements
Stack traces
Secrets
Internal infrastructure details
```

---

# 35. Success Response

Conceptual response:

```json
{
  "success": true,
  "data": {}
}
```

The exact response contract must follow the approved API document.

---

# 36. HTTP Status Codes

Use appropriate HTTP status codes.

Examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

The final API implementation must remain consistent with the approved API specification.

---

# 37. Security Middleware

The backend should provide middleware for:

```text
Authentication
Authorization
Validation
Request ID
Error handling
```

Security checks should occur before protected business operations.

---

# 38. SQL Security

Database access must use:

```text
Parameterized SQL
```

or an approved safe ORM/database abstraction.

Never construct SQL using unsafe string concatenation with user input.

---

# 39. Secrets Management

Never hard-code:

```text
Database passwords
Firebase privileged credentials
API secrets
Private keys
Access tokens
```

Secrets must be supplied through secure deployment configuration.

Secrets must never be committed to GitHub.

---

# 40. Logging

Use safe structured logging.

Logs may contain:

```text
Request ID
Operation
Status
Duration
Non-sensitive error codes
```

Do not log:

```text
Passwords
Firebase tokens
Authorization headers
Secrets
Unnecessary medication information
Private media
Sensitive personal information
```

---

# 41. Firebase Integration

Firebase services may support:

```text
Firebase Authentication
Firebase Cloud Messaging
Firebase Storage
```

The backend must securely integrate with Firebase.

Privileged Firebase credentials must remain server-side.

They must never be bundled into the Android application.

---

# 42. Firebase Authentication Verification

Conceptual flow:

```text
Request
  ↓
Authorization Header
  ↓
Extract Bearer Token
  ↓
Firebase Token Verification
  ↓
Verified Identity
  ↓
Attach Authenticated Context
  ↓
Authorization
```

Invalid or expired tokens must be rejected.

---

# 43. Firebase Cloud Messaging

FCM may be used for approved cloud notification functionality.

However:

```text
FCM
  ≠
Critical local reminder dependency
```

Already-configured reminders must continue to work using the local Android reminder path.

---

# 44. Firebase Storage

Optional private media may include:

```text
Medicine Photos
Family Voice Recordings
```

Media must be access-controlled.

The backend/application must ensure that private media is available only to authorized users.

---

# 45. Medical Safety

Medicare is a medication reminder and organization system.

The backend must never:

```text
Diagnose
Prescribe
Recommend dosage changes
Change medication frequency
Recommend stopping medication
Generate clinical advice
```

Medication instructions must originate from user/caregiver configuration.

---

# 46. Backend and Local-First Principle

The backend must never become a dependency for:

```text
Already-configured reminder
        ↓
Android alarm
        ↓
Reminder screen
        ↓
Voice reminder
        ↓
Taken / Snooze / Skip
```

This critical path executes locally.

The backend is responsible for secure persistence and synchronization.

---

# 47. Offline Synchronization Boundary

```text
                  DEVICE
+----------------------------------------+
| SQLite                                 |
|                                        |
| Medicines                              |
| Reminders                              |
| Dose Events                            |
| Sync Queue                             |
+-------------------+--------------------+
                    |
                    | When online
                    v
+----------------------------------------+
| HTTPS / REST API                      |
+-------------------+--------------------+
                    |
                    v
+----------------------------------------+
| Backend                               |
|                                        |
| Auth → Authorization → Validation      |
| → Service → Repository                 |
+-------------------+--------------------+
                    |
                    v
+----------------------------------------+
| PostgreSQL                             |
+----------------------------------------+
```

---

# 48. Backend Modules

Recommended modules:

```text
Authentication
Users
Medicines
Reminders
Dose Events
Caregivers
Refill Rules
Device Tokens
Media Assets
Synchronization
```

Each module should have clear responsibility boundaries.

---

# 49. Module Example

Medicine module:

```text
medicines/
├── medicine.routes.ts
├── medicine.controller.ts
├── medicine.service.ts
├── medicine.repository.ts
├── medicine.validation.ts
└── medicine.types.ts
```

Reminder module:

```text
reminders/
├── reminder.routes.ts
├── reminder.controller.ts
├── reminder.service.ts
├── reminder.repository.ts
├── reminder.validation.ts
└── reminder.types.ts
```

---

# 50. Backend Dependency Direction

Preferred dependency direction:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

Cross-cutting infrastructure:

```text
Authentication
Authorization
Validation
Logging
Configuration
Error Handling
```

should remain separated from business logic.

---

# 51. Configuration

Environment-specific configuration should be externalized.

Examples:

```text
NODE_ENV
PORT
DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

Actual secret values must never be committed.

---

# 52. Health Check

The backend should expose an appropriate health-check mechanism for deployment and operations.

Example:

```text
GET /health
```

The implementation must not expose sensitive infrastructure information.

---

# 53. Testing Strategy

Backend testing should include:

### Unit Tests

Test:

- Services
- Validation
- Business rules
- State transitions
- Synchronization logic
- Idempotency

### Integration Tests

Test:

- Routes
- Middleware
- PostgreSQL
- Authentication
- Authorization
- Transactions

### Security Tests

Test:

- Invalid tokens
- Expired tokens
- Unauthorized resources
- Caregiver access
- Revoked caregiver access
- Input validation
- Mass assignment
- SQL injection protection

---

# 54. Synchronization Tests

Required cases include:

```text
First submission
Retry
Duplicate submission
Network timeout
Application restart
Invalid event
Unauthorized event
Wrong resource owner
Invalid state transition
Server failure
```

Expected behavior:

```text
No duplicate dose events
No unauthorized writes
Pending events remain recoverable
Valid events eventually synchronize
```

---

# 55. Database Migration Testing

Every database migration should be tested for:

- Successful application.
- Correct schema.
- Constraints.
- Indexes.
- Rollback strategy where supported.
- Compatibility with application code.

Migration verification is part of deployment validation.

---

# 56. Performance Considerations

Backend performance should prioritize:

- Efficient PostgreSQL queries.
- Proper indexes.
- Pagination.
- Limited payload sizes.
- Avoidance of unnecessary database calls.
- Efficient synchronization batches where supported.

Performance optimizations must not weaken security or data integrity.

---

# 57. Reliability Requirements

The backend should provide:

- Transactional writes.
- Idempotent synchronization.
- Recoverable failures.
- Consistent error handling.
- Safe retries.
- Structured logging.
- Database migration controls.

---

# 58. Backend QA Checklist

### API

- [ ] `/api/v1` is used.
- [ ] HTTPS is used.
- [ ] JSON contracts are consistent.
- [ ] Request IDs are supported.
- [ ] Errors are consistent.

### Authentication

- [ ] Firebase tokens are verified server-side.
- [ ] Invalid tokens are rejected.
- [ ] Expired tokens are rejected.
- [ ] Client-supplied user identity is not trusted.

### Authorization

- [ ] Resource ownership is checked.
- [ ] Caregiver permissions are checked.
- [ ] Revoked caregivers lose access.
- [ ] Role/permission fields cannot be spoofed.

### Database

- [ ] PostgreSQL is canonical cloud storage.
- [ ] Parameterized queries are used.
- [ ] Transactions are used where required.
- [ ] Migrations are tested.

### Synchronization

- [ ] Stable `local_event_id` is supported.
- [ ] Duplicate events are prevented.
- [ ] Retried events are safe.
- [ ] Invalid state transitions are rejected.
- [ ] Offline events can synchronize later.

### Security

- [ ] No secrets are committed.
- [ ] Tokens are not logged.
- [ ] Passwords are not logged.
- [ ] Sensitive medication data is minimized in logs.
- [ ] Private media is protected.
- [ ] Input validation is enforced.

---

# 59. Deployment Architecture

Conceptually:

```text
Git Repository
      ↓
CI Pipeline
      ↓
Build
      ↓
Automated Tests
      ↓
Staging
      ↓
Smoke Tests
      ↓
Approval
      ↓
Production / Demo
```

The deployment process should maintain:

- Version/tag
- Tested artifact
- Migration verification
- Rollback path
- Previous-good build
- Security validation
- Reminder/offline smoke-test evidence

---

# 60. Backend Critical Path

The backend supports the cloud side of the following complete architecture:

```text
SQLite
   ↓
Local Reminder
   ↓
Android Alarm
   ↓
Voice + Visual Reminder
   ↓
Taken / Snooze / Skip
   ↓
Local Dose Event
   ↓
Sync Queue
   ↓
HTTPS
   ↓
Firebase Authentication Verification
   ↓
Authorization
   ↓
Validation
   ↓
Idempotency
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

---

# 61. Architectural Constraints

The backend must NOT:

- Become required for local reminder execution.
- Trust client-supplied ownership.
- Trust client-supplied roles.
- Trust client-supplied permissions.
- Store secrets in source code.
- Expose privileged Firebase credentials.
- Accept arbitrary writable fields.
- Create duplicate synchronized dose events.
- Generate clinical advice.
- Silently modify medication instructions.

---

# 62. Backend Acceptance Criteria

The backend architecture is acceptable when:

- [ ] Node.js + Express + TypeScript is used.
- [ ] PostgreSQL is used as canonical cloud storage.
- [ ] REST/JSON API uses `/api/v1`.
- [ ] Firebase ID tokens are verified server-side.
- [ ] Resource-level authorization is enforced.
- [ ] Caregiver access is explicitly authorized.
- [ ] Revocation is enforced.
- [ ] Controllers remain thin.
- [ ] Business logic resides in services.
- [ ] Database access resides in repositories.
- [ ] Input validation is enforced.
- [ ] SQL access is safe.
- [ ] Transactions are used where required.
- [ ] Synchronization is idempotent.
- [ ] Stable `local_event_id` values are supported.
- [ ] Secrets are not exposed.
- [ ] Sensitive information is not unnecessarily logged.
- [ ] Private media is access-controlled.
- [ ] Backend failure does not break already-configured local reminders.

---

# 63. Final Architecture Principle

> **The backend provides secure, authorized, consistent cloud persistence and synchronization while never becoming a dependency for the critical local medication reminder path.**
