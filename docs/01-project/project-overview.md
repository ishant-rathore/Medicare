# Medicare — Project Overview

## Voice Reminders for Senior Citizen Medications

> **Your Trusted Voice Medication Companion**

Medicare is an Android-first Community Engagement Project (CEP) focused on senior citizens who need a simpler and more reliable way to manage routine medication reminders.

## 1. Product Summary

Medicare combines:

- local medication/reminder storage;
- Android alarm and notification execution;
- full-screen visual reminders;
- TTS voice reminders in supported languages;
- Taken / Snooze / Skip actions;
- local dose history and adherence visibility;
- refill reminders;
- explicitly authorized caregiver support;
- offline-first synchronization;
- senior-first accessibility.

The official CEP topic requires a high-contrast reminder solution with a loud audio alarm and regional-language spoken guidance, followed by elderly-user engagement and a short real-world deployment trial. The current project baseline implements this as an Android-first application. fileciteturn0file1

## 2. Core Product Principle

> **Reliable local reminder execution + senior-first accessibility + secure synchronization + explicit caregiver authorization + strict medical-safety boundaries.**

## 3. Critical Runtime Path

```text
SQLite/local medicine data
        ↓
local reminder schedule
        ↓
Android alarm/notification
        ↓
full-screen reminder
        ↓
voice + visual reminder
        ↓
Taken / Snooze / Skip
        ↓
local dose history
        ↓
sync queue
        ↓
authenticated API
        ↓
PostgreSQL canonical data
```

The reminder path must work without continuous internet connectivity.

## 4. Approved Technology Stack

| Area | Technology |
|---|---|
| Mobile | Flutter + Dart |
| Local storage | SQLite |
| Backend | Node.js + Express + TypeScript |
| Cloud database | PostgreSQL |
| Authentication | Firebase Authentication |
| Messaging | Firebase Cloud Messaging (FCM) |
| Optional media | Firebase Storage |
| API | REST/JSON over HTTPS |
| Device capabilities | Android alarms/notifications, TTS, STT, vibration |

## 5. Primary Users

### Senior Citizen

Primary beneficiary who configures or uses reminders, acknowledges doses and reviews history.

### Authorized Caregiver

Family member/support person who receives only explicitly permitted status/history/alert access.

### Project Team / Evaluators

Responsible for development, testing, deployment and CEP evidence.

## 6. Main Functional Areas

- Authentication and onboarding
- Profile and preferences
- Medicine management
- Recurring reminder scheduling
- Voice and visual reminder experience
- Taken/Snooze/Skip
- Medication history and adherence
- Refill/low-stock reminders
- Caregiver authorization and missed-dose support
- Offline mode and synchronization
- Accessibility settings
- Optional family voice and medicine photos
- Help, Privacy, Terms, Feedback and About

## 7. UX Baseline

The approved 41-wireframe baseline defines the senior-facing screen inventory and interaction direction. Design priorities are large typography, high contrast, oversized controls, minimal clutter, visible labels, voice + visual redundancy and clear offline feedback. fileciteturn0file7

## 8. Security and Medical Safety

Medicare must:

- verify Firebase ID tokens server-side;
- perform resource-level authorization;
- keep caregiver access explicit, scoped and revocable;
- protect private voice/photo media;
- minimize sensitive data collection and logging;
- never expose privileged secrets in the APK;
- never diagnose, prescribe, change dosage/frequency or silently modify medication instructions.

## 9. Community Evidence Policy

The project documentation includes plans for community study and evaluation. Actual participant counts, locations, interviews, observations, usability scores and three-day trial outcomes must be inserted only from real evidence.

## 10. Documentation Map

| Section | Purpose |
|---|---|
| `01-project` | Product overview, scope, stakeholders, proposal and roadmap |
| `02-requirements` | PRD, SRS, TRD |
| `03-architecture` | System, voice and offline-sync architecture |
| `04-ui-ux` | UX, design system, wireframes and flows |
| `05-frontend` | Flutter frontend implementation |
| `06-backend` | Node.js/Express backend implementation |
| `07-database` | PostgreSQL/SQLite data design |
| `08-api` | REST API contract and examples |
| `09-security` | Security, privacy and safety |
| `10-deployment` | Deployment and operations |
| `11-testing` | Test strategy and evidence |
| `12-community-engagement` | CEP study, consent, feedback and trial |
| `13-user-documentation` | User/caregiver guides and FAQ |
| `14-release` | Release management |
| `15-final-submission` | Demo, report, presentation and viva |

