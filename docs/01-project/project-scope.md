<<<<<<< HEAD
# Project Scope – Medicare

## In Scope (Version 1.0)

### Mobile Application (Android)
- Offline-first Android application (Flutter)
- Medicine management (CRUD)
- Reminder scheduling (one-time, daily, recurring)
- Local alarm-based notifications
- Text-to-speech medication announcements
- Speech-to-text voice commands
- Dose tracking (taken, snoozed, skipped, missed)
- Dose history and adherence statistics
- Caregiver management (add, remove, access control)
- Refill tracking (stock count, low-stock alerts)
- Profile management
- Accessibility features (large fonts, high contrast, screen reader)
- Firebase Authentication (email/phone)
- Offline sync with backend when connected

### Backend API (Node.js)
- REST API for all mobile data operations
- Firebase token authentication
- PostgreSQL cloud database
- Rate limiting and security middleware
- Push notification dispatch (FCM)
- Media/image upload (Firebase Storage)
- Sync endpoint with idempotency

### AI Features (Gemini API)
- Prescription image scanner
- Voice assistant command interpretation

## Out of Scope (Version 1.0)

- iOS application
- Web-based patient portal
- Doctor/pharmacist portal
- Telemedicine/video consultation
- Medicine interaction checking
- Electronic health record (EHR) integration
- Insurance/billing integration
- Real-time caregiver video monitoring
- Smartwatch/wearable integration
- Offline AI (on-device ML)
- Multi-tenant SaaS administration
- Automated pharmacy ordering

## Assumptions

1. Users have an Android smartphone (API 21+)
2. Caregivers have internet access to receive alerts
3. Firebase project is provisioned by the project team
4. PostgreSQL database is hosted externally (Neon/Supabase/Railway)
5. TTS uses device's built-in speech engine as fallback
6. Medicine names and dosages are entered manually or via prescription scanner

## Constraints

1. **Offline-first:** All critical reminder functions must work without internet
2. **Accessibility:** Must meet WCAG AA for text contrast and touch targets
3. **Languages:** MVP supports English + Hindi (regional languages in v1.1)
4. **Android:** Minimum API 21 (Android 5.0 Lollipop) support
5. **Battery:** Alarm scheduling must handle Android battery optimization
6. **Privacy:** No PHI (Protected Health Information) stored unencrypted
7. **Open source:** MIT licensed, no proprietary dependencies for core functions

## Success Criteria

| Criterion | Target |
|-----------|--------|
| Alarm reliability | 99% of scheduled alarms fire within 2 minutes of scheduled time |
| Offline functionality | 100% of reminder actions work without internet |
| Accessibility rating | WCAG AA compliance |
| Sync reliability | Zero duplicate dose events from sync |
| App size | < 30 MB APK |
| Battery impact | < 2% additional battery drain per day |
| User task completion | Senior citizen completes "mark dose taken" in < 3 taps |
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
