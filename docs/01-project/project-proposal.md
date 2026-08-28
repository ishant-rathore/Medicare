# Medicare — Project Proposal

## Voice Reminders for Senior Citizen Medications

> **Your Trusted Voice Medication Companion**

### Project Profile

| Item | Value |
|---|---|
| Project Type | Community Engagement Project (CEP) / Academic Software Project |
| Platform | Android-first mobile application |
| Primary Users | Senior citizens and caregivers |
| Core Principle | Senior-first, voice-first, accessible and offline-first |
| Status | Baseline / Development Ready |

## 1. Executive Summary

Medicare is an Android-first medication reminder and organization application designed around the practical needs of senior citizens. The product combines loud alarms, spoken medication reminders, high-contrast visuals, large touch targets and simple Taken/Snooze/Skip actions so that the critical moment—when a medicine is due—is easy to notice and acknowledge.

The application stores medicine details and recurring schedules locally, executes configured reminders on the Android device, records dose outcomes locally, and synchronizes with the authenticated backend when connectivity returns. Optional caregiver support provides authorized visibility into missed doses.

The project follows the CEP methodology of problem identification, requirement gathering, technology development, community engagement and evaluation. Fieldwork and the required short community trial must be documented using actual evidence; participant, location and outcome data must not be fabricated.

## 2. Background and Problem

Senior citizens may manage multiple medicines at different times and can face difficulties caused by memory limitations, poor eyesight, hearing limitations, language preferences, low digital literacy or small notification text. Medicare treats accessibility as a reliability requirement rather than a cosmetic enhancement.

The official CEP Topic 24 requires a high-contrast medication reminder solution with a loud audio alarm and regional-language spoken guidance, followed by interaction with elderly participants and a short real-world deployment trial. Medicare preserves that core requirement while implementing the current approved Android-first product baseline.

## 3. Aim and Objectives

**Aim:** Develop and evaluate an accessible voice-enabled medication reminder system that helps senior citizens manage prescribed medication schedules with less dependence on memory, small text and complex smartphone navigation.

Objectives:

1. Provide loud scheduled medication reminders.
2. Support supported regional-language voice output and configurable speech settings.
3. Use large typography, high contrast, oversized controls and minimal navigation.
4. Allow user/caregiver entry of medicine name, dosage, type, color, shape, photo and notes.
5. Support daily, weekly, alternate-day and custom/every-X-hours schedules.
6. Record Taken, Snooze and Skip actions for history and adherence visibility.
7. Provide optional caregiver monitoring and missed-dose alerts with explicit authorization.
8. Keep core reminder execution functional without internet connectivity.
9. Conduct community fieldwork and the required short trial using consent and privacy safeguards.
10. Measure usability, reminder reliability and community feedback from actual evidence.

## 4. Proposed Solution

### Core User Journey

```text
Onboarding / Login
        ↓
Profile Setup
        ↓
Add Medicine
        ↓
Configure Schedule
        ↓
Save Reminder Locally
        ↓
Android Alarm / Notification
        ↓
Full-Screen Voice + Visual Reminder
        ↓
Taken / Snooze / Skip
        ↓
Local Dose History
        ↓
Synchronize When Connectivity Returns
```

### Major Capabilities

- Authentication and onboarding
- Profile and accessibility preferences
- Medicine CRUD and identification aids
- Recurring reminder scheduling
- Local alarms and full-screen medication alarm
- TTS voice reminders and defined STT commands
- Taken/Snooze/Skip dose actions
- History and adherence summaries
- Refill reminders
- Explicit caregiver authorization and missed-dose support
- Offline-first storage and synchronization
- Optional family voice recordings and private medicine photos
- Help, privacy, terms, feedback and About

## 5. Technical Approach

The approved technical stack is:

| Layer | Technology |
|---|---|
| Mobile | Flutter + Dart |
| Local database | SQLite |
| Backend | Node.js + Express + TypeScript |
| Cloud database | PostgreSQL |
| Authentication | Firebase Authentication |
| Remote messaging | Firebase Cloud Messaging (FCM) |
| Optional media | Firebase Storage |
| API | REST / JSON over HTTPS |
| Device services | Android alarms, notifications, TTS, STT, vibration |

The critical path is local. Cloud services support identity, synchronization, canonical persistence and caregiver messaging but must never be required to execute an already-configured reminder.

## 6. Community Engagement Plan

The project will use five CEP phases:

| Phase | Planned Activity |
|---|---|
| Problem Identification | Engage an old age home or elderly participants and document reminder difficulties. |
| Requirement Gathering | Conduct short interviews/observations focused on medication routines and accessibility needs. |
| Technology Development | Implement and test the senior-first reminder workflow. |
| Community Engagement | Deploy the prototype for an elderly participant and provide basic guidance. |
| Evaluation | Review reminder reliability, usability, acknowledgement behavior and feedback. |

Participation must be voluntary and documented with appropriate consent. Reports should use anonymous or aggregated observations where practical.

## 7. Medical Safety and Privacy

Medicare is a medication reminder and organization tool, not a diagnostic, prescribing or clinical decision-support system. It must not diagnose, prescribe, alter dosage/frequency, recommend stopping medication or silently modify medication instructions.

Security and privacy are built into the architecture through Firebase token verification, resource-level authorization, least privilege, data minimization, secure transport, private media access and redacted logging.

## 8. Expected Outcome

The expected outcome is an accessible Android-first medication reminder application that delivers reliable local reminders, clear voice and visual guidance, simple dose acknowledgement and secure synchronization while preserving the senior user's agency and the project's strict medical-safety boundaries.

## 9. Evidence Policy

Implementation documentation may describe intended fieldwork, tests and evaluation plans. Actual community locations, participant counts, observations, trial outcomes and usability results must be inserted only after the corresponding activity is completed and evidenced.

## 10. Related Documents

- Product Requirements Document (PRD)
- Software Requirements Specification (SRS)
- Technical Requirements Document (TRD)
- Architecture & Engineering Document
- UI/UX & Design Document
- Design System
- User Flow Document
- API Document
- Database Design Document
- Security & Privacy Document
- Deployment & Operations Document
- Frontend Document
- Backend Document
