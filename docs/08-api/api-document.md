<<<<<<< HEAD
# API Documentation

=======
# Medicare — API Documentation

## Voice Reminders for Senior Citizen Medications

**Document:** API Documentation  
**Version:** 1.0  
**API Style:** REST/JSON  
**Base Path:** `/api/v1`  
**Transport:** HTTPS/TLS  
**Authentication:** Firebase Authentication  
**Cloud Database:** PostgreSQL

---

# 1. Purpose

This document defines the API architecture and communication contract for Medicare.

The Medicare API provides secure communication between the Flutter application and the Node.js + Express + TypeScript backend.

The API supports:

- Authentication context
- User data
- Medicines
- Reminders
- Dose events
- Medication history
- Caregivers
- Refill rules
- Device tokens
- Media metadata
- Synchronization

---

# 2. API Architecture

```text
Flutter Application
        |
        | HTTPS / JSON
        v
/api/v1
        |
        v
Express Router
        |
        v
Authentication
        |
        v
Authorization
        |
        v
Validation
        |
        v
Controller
        |
        v
Service
        |
        v
Repository
        |
        v
PostgreSQL
```

---

# 3. Base URL

All versioned application endpoints use:

```text
/api/v1
```

Example:

```text
https://<server>/api/v1
```

The production hostname must be supplied through deployment configuration.

URLs and environment-specific server addresses must not be hard-coded into the application source.

---

# 4. Transport Security

All production API communication must use:

```text
HTTPS
TLS
```

Plain HTTP must not be used for protected production API traffic.

---

# 5. Content Type

Requests containing JSON data use:

```http
Content-Type: application/json
```

Responses use:

```http
Content-Type: application/json
```

---

# 6. Authentication

Protected endpoints use Firebase Authentication.

The client sends a Firebase ID token using:

```http
Authorization: Bearer <Firebase-ID-Token>
```

The backend verifies the token server-side.

---

# 7. Authentication Flow

```text
User
 ↓
Firebase Authentication
 ↓
Firebase ID Token
 ↓
Flutter Application
 ↓
Authorization Header
 ↓
Medicare API
 ↓
Firebase Token Verification
 ↓
Authenticated User
```

---

# 8. Authentication Security

The backend must never trust client-supplied:

```text
user_id
role
permissions
ownership
```

as authoritative security information.

The authenticated Firebase identity must be used to establish the requesting user.

---

# 9. Authorization

Authentication establishes identity.

Authorization determines whether the authenticated user can access a resource or perform an operation.

Every protected resource must be checked server-side.

Conceptually:

```text
Authenticated User
       ↓
Resource
       ↓
Ownership / Caregiver Relationship
       ↓
Permission Scope
       ↓
Allowed Action
```

---

# 10. Request ID

API requests should support:

```http
X-Request-Id: <request-id>
```

Request IDs are used for:

- Request tracing
- Debugging
- Structured logging
- Support investigation

Request IDs must not contain sensitive information.

---

# 11. Common HTTP Methods

Medicare uses standard REST methods.

| Method | Purpose |
|---|---|
| `GET` | Retrieve resource |
| `POST` | Create resource or submit operation |
| `PATCH` | Partially update resource |
| `DELETE` | Delete/deactivate resource where supported |

---

# 12. Common HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `204` | Successful request with no response body |
| `400` | Bad request |
| `401` | Authentication required/invalid |
| `403` | Access denied |
| `404` | Resource not found |
| `409` | Conflict |
| `422` | Validation/business rule failure |
| `500` | Internal server error |

---

# 13. Success Response

The API uses a consistent success structure.

Conceptual example:

```json
{
  "success": true,
  "data": {}
}
```

The exact response fields for individual endpoints must follow the implemented API contract.

---

# 14. Error Response

Errors should use a consistent structure.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "request_id": "request-123"
  }
}
```

Technical implementation details must not be exposed to clients.

---

# 15. Error Security

API responses must not expose:

```text
Database passwords
SQL statements
Firebase private credentials
Stack traces
Internal secrets
Authorization headers
Infrastructure credentials
```

---

# 16. User API

User-related operations are associated with the authenticated user.

Conceptual endpoint:

```text
GET /api/v1/users/me
```

Purpose:

```text
Retrieve authenticated user's application profile.
```

The server determines the user from the verified Firebase identity.

---

# 17. User Profile

A user profile may contain approved application information such as:

```text
Display name
Preferences
Accessibility settings
Voice settings
Notification preferences
```

Only approved fields should be writable.

---

# 18. Medicine API

Conceptual endpoints:

```text
GET    /api/v1/medicines
POST   /api/v1/medicines
GET    /api/v1/medicines/:id
PATCH  /api/v1/medicines/:id
DELETE /api/v1/medicines/:id
```

The final endpoint implementation must remain consistent with the approved backend implementation.

---

# 19. List Medicines

```http
GET /api/v1/medicines
```

Returns medicines accessible to the authenticated user.

The server must apply resource-level authorization.

Example:

```json
{
  "success": true,
  "data": {
    "items": []
  }
}
```

---

# 20. Create Medicine

```http
POST /api/v1/medicines
```

Creates a medicine record.

Example request:

```json
{
  "name": "Medicine Name",
  "dose": "Configured Dose",
  "notes": "Optional notes"
}
```

The server determines the owner from the authenticated identity.

The client must not be allowed to assign the medicine to another user.

---

# 21. Get Medicine

```http
GET /api/v1/medicines/:id
```

Returns one medicine.

Authorization must verify that the authenticated user has access to the medicine.

---

# 22. Update Medicine

```http
PATCH /api/v1/medicines/:id
```

Only explicitly allow-listed fields may be updated.

Example:

```json
{
  "name": "Updated Medicine Name",
  "notes": "Updated notes"
}
```

The backend must validate the request and authorization.

---

# 23. Deactivate Medicine

Medicine deactivation must preserve historical dose information.

Conceptually:

```text
Active
  ↓
Deactivated
```

Historical records must not be silently rewritten as a result of deactivation.

---

# 24. Reminder API

Conceptual endpoints:

```text
GET    /api/v1/reminders
POST   /api/v1/reminders
GET    /api/v1/reminders/:id
PATCH  /api/v1/reminders/:id
DELETE /api/v1/reminders/:id
```

Reminders are associated with medicines.

---

# 25. Create Reminder

```http
POST /api/v1/reminders
```

Conceptual request:

```json
{
  "medicine_id": "<medicine-id>",
  "schedule_type": "daily",
  "schedule_data": {},
  "enabled": true
}
```

The server must verify that the authenticated user is authorized to configure the referenced medicine.

---

# 26. Reminder Schedule Types

Medicare supports:

```text
Daily
Weekly
Alternate-day
Custom
Every-X-hours
```

Schedule values must be validated server-side.

Invalid schedule configurations must be rejected.

---

# 27. Update Reminder

```http
PATCH /api/v1/reminders/:id
```

Only approved reminder configuration fields may be changed.

The backend must verify:

```text
Reminder exists
        ↓
Medicine relationship
        ↓
User ownership/access
        ↓
Valid schedule
```

---

# 28. Dose Event API

Dose events represent actions taken for medication reminders.

Supported states include:

```text
TAKEN
SNOOZED
SKIPPED
```

Conceptual endpoint:

```text
POST /api/v1/dose-events
```

---

# 29. Create Dose Event

```http
POST /api/v1/dose-events
```

Conceptual request:

```json
{
  "local_event_id": "<stable-local-event-id>",
  "medicine_id": "<medicine-id>",
  "reminder_id": "<reminder-id>",
  "status": "TAKEN",
  "event_time": "2026-08-28T12:00:00Z"
}
```

The exact request contract must follow the implemented API specification.

---

# 30. Local Event ID

Offline-created dose events must contain:

```text
local_event_id
```

This identifier must remain stable during retries.

Example:

```text
Device creates:

local_event_id = ABC-123
```

Retry:

```text
local_event_id = ABC-123
```

The client must not generate a new event ID for every retry.

---

# 31. Dose Event Idempotency

The server must treat synchronization as idempotent.

Example:

```text
POST ABC-123
       ↓
Create Event
       ↓
Response Lost
       ↓
POST ABC-123 again
       ↓
Existing Event Found
       ↓
Return Existing Result
```

The retry must not create a duplicate dose event.

---

# 32. Dose Event Validation

Before accepting a dose event, the server should validate:

```text
Authentication
      ↓
Authorization
      ↓
local_event_id
      ↓
Medicine ownership
      ↓
Reminder relationship
      ↓
Valid state
      ↓
Event timestamp
      ↓
Idempotency
```

---

# 33. Valid State Transitions

Dose-event state changes must follow approved business rules.

The backend must not blindly accept arbitrary state transitions.

Conceptually:

```text
Reminder Due
     |
     +---- TAKEN
     |
     +---- SNOOZED
     |
     +---- SKIPPED
```

Invalid transitions should be rejected.

---

# 34. Medication History API

Medication history is derived from dose events.

Conceptual endpoint:

```text
GET /api/v1/dose-events
```

Possible controlled filters include:

```text
medicine
date range
status
```

Only approved query parameters should be accepted.

---

# 35. Adherence Data

Adherence summaries may be calculated from approved dose-event data.

Conceptually:

```text
Dose Events
     ↓
Adherence Calculation
     ↓
Summary
```

The API must not turn adherence information into medical diagnosis or clinical advice.

---

# 36. Caregiver API

Caregiver functionality requires explicit authorization.

Conceptual endpoints:

```text
GET    /api/v1/caregivers
POST   /api/v1/caregivers
PATCH  /api/v1/caregivers/:id
DELETE /api/v1/caregivers/:id
```

The exact implementation must follow the approved API contract.

---

# 37. Authorizing a Caregiver

Conceptual request:

```json
{
  "caregiver_id": "<user-id>",
  "permissions": []
}
```

The server must verify that the requesting user is authorized to grant access.

Client-supplied permission information must not bypass server-side authorization rules.

---

# 38. Caregiver Access

For caregiver requests:

```text
Firebase Identity
        ↓
Caregiver Relationship
        ↓
Authorization Status
        ↓
Permission Scope
        ↓
Requested Resource
        ↓
Allow / Deny
```

---

# 39. Caregiver Revocation

When caregiver access is revoked:

```text
Authorized
    ↓
Revoked
    ↓
Future Protected Requests
    ↓
403 Forbidden
```

Revocation must be checked server-side.

---

# 40. Refill Rules API

Refill functionality supports low-stock and refill reminders.

Conceptual endpoints:

```text
GET    /api/v1/refill-rules
POST   /api/v1/refill-rules
PATCH  /api/v1/refill-rules/:id
DELETE /api/v1/refill-rules/:id
```

Refill rules must be associated with authorized medicine records.

---

# 41. Device Token API

Approved notification functionality may require device-token registration.

Conceptual endpoint:

```text
POST /api/v1/device-tokens
```

The server must associate the token with the authenticated user/device context.

Device tokens must not be treated as authentication credentials.

---

# 42. Media API

Optional private media may include:

```text
Medicine photos
Family voice recordings
```

Media access must be restricted to authorized users.

The API should store or return approved media metadata/references rather than exposing private storage unnecessarily.

---

# 43. Synchronization API

The synchronization API handles offline mutations created on the device.

Conceptual endpoint:

```text
POST /api/v1/sync
```

The synchronization mechanism must support:

```text
Offline events
Retries
Idempotency
Validation
Authorization
Conflict handling
```

---

# 44. Synchronization Flow

```text
SQLite Sync Queue
       ↓
POST /api/v1/sync
       ↓
Authentication
       ↓
Authorization
       ↓
Validation
       ↓
Idempotency
       ↓
Service
       ↓
PostgreSQL
       ↓
Sync Result
       ↓
Client Updates Local Queue
```

---

# 45. Offline Synchronization

The API must support the local-first model.

When offline:

```text
No API request is required
        ↓
Local operation continues
```

When connectivity returns:

```text
Pending mutations
        ↓
API synchronization
```

---

# 46. Sync Failure

If a synchronization request fails:

```text
API Failure
    ↓
Client Keeps Local Mutation
    ↓
Retry Later
```

The server must not cause the client to lose locally stored events simply because a request failed.

---

# 47. Idempotency Requirements

The backend must protect against duplicate mutations caused by:

- Retries
- Timeouts
- Duplicate requests
- Application restarts
- Connectivity changes

Stable event identifiers must be used where required.

---

# 48. Validation

All API input must be validated.

Validation should cover:

```text
Required fields
Data types
String length
Identifiers
Dates
Times
Enums
Schedule configuration
Pagination
Filters
State transitions
```

---

# 49. Unknown Fields

The API should not blindly persist unknown client fields.

For writable resources:

```text
Allow-listed fields
        ↓
Validation
        ↓
Service
        ↓
Repository
```

This reduces mass-assignment and privilege-escalation risks.

---

# 50. Pagination

Collection endpoints should use pagination where applicable.

Conceptual request:

```http
GET /api/v1/medicines?page=1&page_size=20
```

The implementation must enforce reasonable limits.

Clients should not be allowed to request unlimited records.

---

# 51. Filtering

Filtering should be explicit and controlled.

Example:

```http
GET /api/v1/medicines?active=true
```

Only approved fields should be accepted as filters.

---

# 52. Date and Time

API timestamps use UTC.

Example:

```text
2026-08-28T12:00:00Z
```

The backend should validate timestamps and avoid ambiguous date/time formats.

Local reminder execution remains a device responsibility.

---

# 53. API Security Model

```text
Request
   ↓
TLS
   ↓
Firebase Authentication
   ↓
Token Verification
   ↓
Resource Authorization
   ↓
Input Validation
   ↓
Business Validation
   ↓
Database Transaction
```

Every protected request must pass the appropriate security controls.

---

# 54. Resource Ownership

The server must derive ownership from authenticated identity and database relationships.

Never trust:

```json
{
  "user_id": "another-user"
}
```

as permission to access another user's resource.

---

# 55. SQL Security

The backend must use:

```text
Parameterized SQL
```

or an approved safe database abstraction.

Never construct SQL from raw user input.

Unsafe example:

```text
SELECT * FROM medicines WHERE name = '<user-input>'
```

Safe database parameterization must be used instead.

---

# 56. Secrets

The API server must never expose:

```text
Database passwords
Firebase private keys
Service account credentials
API secrets
Access tokens
```

Secrets must be provided through secure environment/deployment configuration.

---

# 57. Logging

Structured logging may include:

```text
Request ID
HTTP method
Endpoint
Status
Duration
Non-sensitive error code
```

Do not log:

```text
Passwords
Firebase tokens
Authorization headers
Database credentials
Private keys
Unnecessary medication information
Private media
```

---

# 58. Rate and Resource Protection

API implementation should protect resources against unreasonable requests.

Controls may include:

```text
Request validation
Payload limits
Pagination limits
Timeouts
Controlled retries
```

The exact production configuration belongs to deployment/operations documentation.

---

# 59. API Layering

The backend follows:

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

Each layer has a clear responsibility.

---

# 60. Controller Rules

Controllers must be thin.

Controllers should:

```text
Receive request
Validate through middleware/schema
Read authenticated context
Call service
Return response
```

Controllers should not contain complex database or business logic.

---

# 61. Service Rules

Services contain:

```text
Business rules
Authorization coordination
State validation
Transactions
Synchronization logic
Idempotency
```

---

# 62. Repository Rules

Repositories contain:

```text
PostgreSQL access
Queries
Persistence operations
Database mapping
```

Repositories should not contain HTTP-specific behavior.

---

# 63. Transaction Example

For a multi-record operation:

```text
BEGIN
  ↓
Validate / prepare changes
  ↓
Update primary record
  ↓
Update related record
  ↓
Write synchronization information
  ↓
COMMIT
```

If an operation fails:

```text
ROLLBACK
```

---

# 64. API and Local-First Boundary

The API is not part of the critical local reminder execution path.

Correct:

```text
SQLite
 ↓
Android Alarm
 ↓
Reminder
 ↓
Dose Event
 ↓
Sync API
```

Incorrect:

```text
API
 ↓
Android Alarm
```

An API outage must not prevent an already-configured local reminder from executing.

---

# 65. Medical Safety

The Medicare API is not a clinical decision-support API.

The backend must never:

```text
Diagnose
Prescribe
Change dosage
Change medication frequency
Recommend stopping medication
Generate clinical advice
```

Medication instructions must originate from approved user/caregiver configuration.

---

# 66. API Testing

API testing should include:

### Authentication

- [ ] Valid Firebase token accepted.
- [ ] Missing token rejected.
- [ ] Invalid token rejected.
- [ ] Expired token rejected.

### Authorization

- [ ] Owner can access owned resources.
- [ ] Unauthorized users are denied.
- [ ] Caregiver scope is enforced.
- [ ] Revoked caregiver is denied.
- [ ] Client-supplied ownership cannot bypass authorization.

### Validation

- [ ] Invalid payload rejected.
- [ ] Unknown fields handled safely.
- [ ] Invalid identifiers rejected.
- [ ] Invalid schedule rejected.
- [ ] Invalid state transition rejected.

---

# 67. Synchronization Testing

Required synchronization tests:

```text
Create event
Retry event
Duplicate event
Network timeout
Application restart
Invalid event
Unauthorized event
Wrong owner
Invalid state
Server failure
```

Expected behavior:

```text
No duplicate events
No unauthorized writes
No lost pending events
Valid events eventually synchronize
```

---

# 68. Database Integration Testing

API integration tests should verify:

```text
API
 ↓
Service
 ↓
Repository
 ↓
PostgreSQL
```

Tests should verify:

- Transactions
- Constraints
- Ownership
- Relationships
- Idempotency
- Error handling

---

# 69. Example Complete Request

```http
POST /api/v1/dose-events
Authorization: Bearer <Firebase-ID-Token>
Content-Type: application/json
X-Request-Id: request-123
```

Body:

```json
{
  "local_event_id": "local-event-123",
  "medicine_id": "medicine-123",
  "reminder_id": "reminder-123",
  "status": "TAKEN",
  "event_time": "2026-08-28T12:00:00Z"
}
```

Processing:

```text
HTTPS
 ↓
Token Verification
 ↓
Authorization
 ↓
Validation
 ↓
Dose Event Service
 ↓
Idempotency Check
 ↓
PostgreSQL
 ↓
Response
```

---

# 70. Example Successful Response

```json
{
  "success": true,
  "data": {
    "id": "dose-event-123",
    "local_event_id": "local-event-123",
    "status": "TAKEN"
  }
}
```

---

# 71. Example Authorization Failure

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied.",
    "request_id": "request-123"
  }
}
```

---

# 72. Example Validation Failure

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "request_id": "request-123"
  }
}
```

---

# 73. API Documentation Checklist

### General

- [ ] REST/JSON is used.
- [ ] API uses `/api/v1`.
- [ ] HTTPS is enforced.
- [ ] UTC timestamps are used.
- [ ] Consistent success responses exist.
- [ ] Consistent error responses exist.
- [ ] `X-Request-Id` is supported.

### Authentication

- [ ] Firebase ID tokens are verified server-side.
- [ ] Invalid tokens are rejected.
- [ ] Client identity is not blindly trusted.

### Authorization

- [ ] Resource ownership is checked.
- [ ] Caregiver permissions are checked.
- [ ] Revocation is enforced.
- [ ] Client-supplied roles cannot bypass security.

### Data

- [ ] Medicine API is protected.
- [ ] Reminder API is protected.
- [ ] Dose events are protected.
- [ ] Refill rules are protected.
- [ ] Device tokens are protected.
- [ ] Private media is protected.

### Synchronization

- [ ] Offline mutations are supported.
- [ ] Stable `local_event_id` values are supported.
- [ ] Retries are safe.
- [ ] Duplicate events are prevented.
- [ ] Invalid events are rejected.
- [ ] Pending local events are not lost.

### Security

- [ ] Input validation is enforced.
- [ ] Writable fields are allow-listed.
- [ ] SQL injection is prevented.
- [ ] Secrets are not committed.
- [ ] Tokens are not logged.
- [ ] Sensitive data is minimized in logs.

---

# 74. API Acceptance Criteria

The API implementation is acceptable when:

- [ ] Node.js + Express + TypeScript is used.
- [ ] REST/JSON is implemented.
- [ ] `/api/v1` is used.
- [ ] HTTPS/TLS is used.
- [ ] Firebase ID tokens are verified server-side.
- [ ] Resource-level authorization is enforced.
- [ ] Caregiver access requires explicit authorization.
- [ ] Revoked caregivers lose access.
- [ ] Input validation is enforced.
- [ ] Database access is parameterized/safe.
- [ ] Transactions are used where required.
- [ ] Dose-event synchronization is idempotent.
- [ ] Stable `local_event_id` values are supported.
- [ ] Consistent error responses are provided.
- [ ] Sensitive information is not unnecessarily logged.
- [ ] Private media is access-controlled.
- [ ] API failure does not break local reminders.

---

# 75. Final API Principle

> **The Medicare API provides secure, authorized, validated, and idempotent cloud communication while preserving the LOCAL-FIRST principle of the application.**

The most important boundary is:

```text
LOCAL REMINDER
      ↓
MUST WORK
      ↓
WITHOUT API / INTERNET
```

The API exists to provide secure synchronization, cloud persistence, caregiver access, and other approved backend functionality — not to execute the critical local medication reminder path.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
