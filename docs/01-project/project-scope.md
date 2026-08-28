# Medicare — Project Scope

## 1. Scope Statement

Medicare is an Android-first senior-friendly medication reminder and organization application for the Community Engagement Project (CEP). The initial scope focuses on making scheduled medication reminders loud, visible, understandable and easy to acknowledge.

## 2. In Scope

### Product

- Onboarding and authentication.
- User profile and preferences.
- Medicine CRUD/deactivation.
- Medicine name, dosage, type and optional color/shape/photo/notes.
- Daily, weekly, alternate-day and custom/every-X-hours reminder schedules.
- Local Android alarms/notifications.
- Full-screen medication reminder.
- TTS voice reminders and supported STT command flows.
- Taken, Snooze and Skip actions.
- Medication history and adherence visibility.
- Refill threshold reminders.
- Explicit caregiver authorization and missed-dose alerts.
- Offline-first reminder execution and later synchronization.
- Accessibility settings including scalable text, high contrast, dark mode, vibration and screen-reader support.
- Optional family voice recordings and private medicine photos.
- Help, privacy, terms, feedback and About.

### Technical

- Flutter + Dart mobile client.
- SQLite operational local database.
- Node.js + Express + TypeScript backend.
- PostgreSQL canonical cloud database.
- Firebase Authentication.
- Firebase Cloud Messaging where remote messaging is required.
- Firebase Storage for optional private media.
- REST/JSON over HTTPS under `/api/v1`.

## 3. Out of Scope for Initial Release

- Diagnosis or clinical decision support.
- Prescription generation.
- Autonomous dosage/frequency changes.
- Hospital/EHR integration.
- Pharmacy ordering or medicine delivery.
- Smartwatch/wearable integration.
- Bluetooth automatic pill dispenser.
- Clinical-scale predictive adherence analytics.
- Continuous microphone listening.

## 4. Architecture Boundary

The core reminder path is local-first:

```text
SQLite/local medicine data
→ local reminder schedule
→ Android alarm/notification
→ full-screen reminder
→ voice + visual reminder
→ Taken / Snooze / Skip
→ local dose history
```

Cloud synchronization, caregiver messaging and optional media are secondary paths.

## 5. Scope Guardrails

- Medication instructions are entered by the user/caregiver and must not be silently modified.
- Caregiver access requires explicit authorization and scoped permissions.
- Client-supplied identity/ownership claims are never authoritative.
- Offline dose events use stable local identifiers and idempotent server writes.
- Actual CEP fieldwork and trial outcomes must be based on real evidence.
