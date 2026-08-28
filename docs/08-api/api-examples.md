# Medicare — API Examples

## Purpose

Practical examples for the approved Medicare REST API. The API uses REST/JSON over HTTPS under `/api/v1`, with Firebase ID-token authentication for protected operations. fileciteturn0file19

## Common Request Headers

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
Accept: application/json
X-Request-Id: <request-id>
Idempotency-Key: <stable-key>
```

## 1. Get Current User Profile

```http
GET /api/v1/users/me
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "Ramesh Kumar",
    "language": "hi-IN",
    "preferences": {
      "font_scale": 1.15,
      "high_contrast": true,
      "dark_mode": false,
      "vibration": true
    }
  },
  "request_id": "req-123"
}
```

## 2. Create or Update Profile

```http
POST /api/v1/users/profile
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "name": "Ramesh Kumar",
  "language": "hi-IN",
  "preferences": {
    "font_scale": 1.15,
    "high_contrast": true,
    "dark_mode": false,
    "vibration": true
  }
}
```

The API maps the authenticated Firebase identity to the application user. Client-supplied `user_id` is not treated as proof of ownership.

## 3. Create Medicine

```http
POST /api/v1/medicines
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "name": "Metformin",
  "dosage": "1 tablet",
  "type": "tablet",
  "color": "blue",
  "shape": "round",
  "notes": "Use the reminder information entered by the user/caregiver."
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": "medicine-uuid",
    "name": "Metformin",
    "dosage": "1 tablet",
    "type": "tablet",
    "color": "blue",
    "shape": "round"
  },
  "request_id": "req-124"
}
```

Medicine identification fields are aids only; the API does not clinically interpret them.

## 4. Create Reminder Schedule

```http
POST /api/v1/reminders
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "medicine_id": "medicine-uuid",
  "time": "14:00:00",
  "timezone": "Asia/Kolkata",
  "frequency": "daily",
  "acknowledgement_window_minutes": 30,
  "snooze_minutes": 10,
  "voice": {
    "language": "hi-IN",
    "enabled": true,
    "repeat_count": 2
  }
}
```

The local client must persist the reminder configuration and schedule the Android alarm locally before reporting successful setup. Network availability is not required for an already-configured reminder.

## 5. Record a Taken Dose

```http
POST /api/v1/dose-events
Authorization: Bearer <FIREBASE_ID_TOKEN>
Idempotency-Key: local-event-7b3e
Content-Type: application/json
```

```json
{
  "local_event_id": "local-event-7b3e",
  "reminder_id": "reminder-uuid",
  "status": "taken",
  "scheduled_at": "2026-08-28T08:30:00+05:30",
  "action_at": "2026-08-28T08:31:12+05:30"
}
```

A retry with the same `local_event_id` must return the existing canonical event rather than create a duplicate.

## 6. Snooze a Dose

```http
POST /api/v1/dose-events
Authorization: Bearer <FIREBASE_ID_TOKEN>
Idempotency-Key: local-event-7b3f
```

```json
{
  "local_event_id": "local-event-7b3f",
  "reminder_id": "reminder-uuid",
  "status": "snoozed",
  "scheduled_at": "2026-08-28T14:00:00+05:30",
  "action_at": "2026-08-28T14:01:05+05:30",
  "snooze_until": "2026-08-28T14:11:05+05:30"
}
```

The mobile reminder engine should also create the next local trigger immediately.

## 7. Skip a Dose

```http
POST /api/v1/dose-events
Authorization: Bearer <FIREBASE_ID_TOKEN>
Idempotency-Key: local-event-7b40
```

```json
{
  "local_event_id": "local-event-7b40",
  "reminder_id": "reminder-uuid",
  "status": "skipped",
  "scheduled_at": "2026-08-28T14:00:00+05:30",
  "action_at": "2026-08-28T14:03:21+05:30"
}
```

The API validates the event state transition and ownership server-side.

## 8. Sync Offline Events

```http
POST /api/v1/sync
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "mutations": [
    {
      "mutation_id": "mutation-001",
      "entity": "dose_event",
      "operation": "create",
      "local_event_id": "local-event-7b3e",
      "payload": {
        "reminder_id": "reminder-uuid",
        "status": "taken",
        "scheduled_at": "2026-08-28T08:30:00+05:30",
        "action_at": "2026-08-28T08:31:12+05:30"
      }
    }
  ]
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "accepted": [
      {
        "local_event_id": "local-event-7b3e",
        "server_id": "dose-event-uuid",
        "status": "accepted"
      }
    ],
    "rejected": [],
    "conflicts": []
  },
  "request_id": "req-125"
}
```

The server revalidates identity, ownership, event identity and allowed state transitions before accepting a mutation.

## 9. List Medication History

```http
GET /api/v1/dose-events?from=2026-08-01T00:00:00Z&to=2026-08-28T23:59:59Z&page=1
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "dose-event-uuid",
        "reminder_id": "reminder-uuid",
        "status": "taken",
        "scheduled_at": "2026-08-28T08:30:00Z",
        "action_at": "2026-08-28T03:01:12Z"
      }
    ],
    "pagination": {
      "page": 1,
      "has_next": false
    }
  },
  "request_id": "req-126"
}
```

## 10. Caregiver Authorization

Caregiver access is explicit, scoped and revocable.

```http
POST /api/v1/caregivers
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "caregiver_auth_uid": "firebase-caregiver-uid",
  "permissions": {
    "view_medication_status": true,
    "view_history": true,
    "receive_missed_dose_alerts": true
  }
}
```

The backend must derive the senior owner from the authenticated actor and validate the caregiver relationship rather than trusting a client-supplied owner ID.

## 11. Register FCM Device Token

```http
POST /api/v1/device-tokens
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

```json
{
  "token": "<FCM_DEVICE_TOKEN>",
  "platform": "android",
  "app_version": "1.0.0"
}
```

## 12. Error Response

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not authorized to access this resource."
  },
  "request_id": "req-127"
}
```

Do not return tokens, database credentials, unnecessary medicine details or internal stack traces.

## 13. End-to-End Offline Flow

```text
User configures reminder
        ↓
Persist locally in SQLite
        ↓
Schedule Android alarm
        ↓
Network unavailable
        ↓
Alarm still triggers
        ↓
Voice + visual reminder
        ↓
Taken / Snooze / Skip
        ↓
Create stable local_event_id
        ↓
Queue pending sync
        ↓
Network returns
        ↓
Authenticate + POST /sync
        ↓
Server validates + deduplicates
        ↓
PostgreSQL canonical event
        ↓
Client marks mutation accepted
```

This sequence preserves the project's local-first reminder architecture and idempotent synchronization model. fileciteturn0file19
