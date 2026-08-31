<<<<<<< HEAD
# Project Overview – Medicare

## Vision

To make daily medication management simple, reliable, and accessible for every senior citizen in India — ensuring they never miss a critical dose, even without internet connectivity.

## Mission

Build an offline-first, voice-enabled Android application that senior citizens can use independently, with support from caregivers and healthcare providers.

## Problem Statement

Senior citizens, especially those managing multiple chronic conditions, face significant challenges in medication adherence:

- **Forgetting doses** — The most common cause of non-adherence
- **Complex schedules** — Multiple medicines, multiple times per day, varying with meals
- **Visual difficulties** — Small text on pill bottles and apps
- **Technology barriers** — Complex smartphone interfaces
- **Isolation** — No immediate support when confused about medications
- **Connectivity gaps** — Rural areas with unreliable internet

### Statistics (India)

- 10+ crore senior citizens (60+) in India
- 75% of seniors manage at least one chronic condition
- 50%+ medication non-adherence rate in elderly population
- Medication errors cause 1.5 million preventable injuries annually

## Solution

Medicare provides:

1. **Alarm-based reminders** that work without internet
2. **Voice announcements** in the user's language (Hindi, English, regional languages)
3. **Large, senior-friendly UI** with minimal complexity
4. **Caregiver dashboard** for family monitoring
5. **Prescription scanner** using AI for easy medicine entry
6. **Dose history and adherence reports** for doctors

## Target Users

### Primary User: Senior Citizen (60+)
- Living alone or with family
- Managing 2–10 medications daily
- Limited technology literacy
- May have visual or hearing impairments
- Primarily Android smartphone user

### Secondary User: Family Caregiver
- Son/daughter monitoring an elderly parent remotely
- Wants real-time adherence notifications
- May manage medicine schedules on behalf of the senior

### Tertiary User: Healthcare Provider
- Doctor wanting to review patient adherence history
- Pharmacist managing refill requests

## Key Differentiators

| Feature | Medicare | Generic Reminder Apps |
|---------|----------|----------------------|
| Works offline | ✅ | ❌ Most require internet |
| Voice in regional languages | ✅ | ❌ English only |
| Senior-specific UI | ✅ | ❌ Generic |
| Caregiver integration | ✅ | ❌ Limited |
| AI prescription scanner | ✅ | ❌ Manual entry only |
| Dose history & analytics | ✅ | ❌ Basic |

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Mobile App | Flutter 3.x (Android) |
| State Management | Riverpod |
| Local Database | SQLite (sqflite) |
| Cloud Backend | Node.js + Express + TypeScript |
| Cloud Database | PostgreSQL (Prisma) |
| Authentication | Firebase Auth |
| Push Notifications | Firebase Cloud Messaging |
| Storage | Firebase Storage |
| TTS | flutter_tts |
| STT | speech_to_text |
| Alarms | android_alarm_manager_plus |
| AI | Google Gemini API |

## Project Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Requirements & Design | 2 weeks | ✅ Complete |
| Core Architecture & Setup | 1 week | ✅ Complete |
| Medicine Management | 1 week | ✅ Complete |
| Reminder Engine | 2 weeks | 🔄 In Progress |
| Voice System | 1 week | 🔄 In Progress |
| Backend API | 2 weeks | 🔄 In Progress |
| Caregiver & Sync | 1 week | 📋 Planned |
| Testing & QA | 2 weeks | 📋 Planned |
| Community Trial | 2 weeks | 📋 Planned |
| Evaluation & Report | 1 week | 📋 Planned |
=======
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

>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
