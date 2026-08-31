<<<<<<< HEAD
# Final Project Report

=======
# Medicare — Final Project Report Guide

## Project

**Medicare — Voice Reminders for Senior Citizen Medications**  
Community Engagement Project (CEP)  
Android-first mobile application  
> *Your Trusted Voice Medication Companion*

## 1. Executive Summary

Medicare is an accessibility-first medication reminder and organization application for senior citizens. It combines local Android reminders, loud alarms, voice guidance, high-contrast visuals, large touch targets, simple dose actions, medication history, optional caregiver support and offline-first synchronization.

The project is intentionally not a diagnostic, prescribing or clinical decision-support system. Medication instructions are entered by the user/caregiver and are not silently changed by the system.

## 2. Community Problem

The project addresses the practical difficulty of remembering medicines when users face multiple schedules, small notification text, memory challenges, limited digital familiarity, hearing/vision limitations or language barriers.

**Evidence placeholder:** Insert actual fieldwork location, date, participant count and observation summary only after the community study is completed.

## 3. Objectives

- Deliver reliable scheduled reminders.
- Provide regional-language voice output where supported.
- Use senior-first accessible UI.
- Support Taken/Snooze/Skip and history.
- Provide optional authorized caregiver support.
- Preserve reminder functionality offline.
- Evaluate usability and reminder behavior through actual CEP evidence.

## 4. System Architecture

```text
Senior / Caregiver
       ↓
Flutter Android App
       ↓
Local Services + SQLite
   ↙           ↘
Alarm/Voice      Sync
       ↓           ↓
Local History → Authenticated REST API
                     ↓
              PostgreSQL / Firebase
```

The critical reminder path is local; cloud services are a secondary synchronization/caregiver path.

## 5. Implementation

### Frontend

Flutter + Dart, with clear separation between presentation, use cases, domain, repositories and platform services.

### Backend

Node.js + Express + TypeScript modular monolith using route → middleware → controller → service → repository boundaries.

### Data

PostgreSQL is the canonical synchronized cloud database; SQLite is the local operational store for offline reminder execution and pending mutations.

### Firebase

Firebase Authentication provides identity; FCM supports configured remote messaging; Firebase Storage supports optional private media.

## 6. Reminder Lifecycle

```text
Scheduled
 ↓
Triggered
 ├→ Taken
 ├→ Snoozed → Triggered
 ├→ Skipped
 └→ Missed → Caregiver Alert (if enabled)
```

## 7. Offline Synchronization

Offline dose events receive stable `local_event_id` values. On reconnect, the authenticated API revalidates identity, ownership, event identity and valid state transitions. Retries must be idempotent and must not create duplicate dose events.

## 8. UI/UX

The approved 41-wireframe baseline defines the senior-first screen inventory. Design priorities include large typography, high contrast, oversized controls, minimal clutter, visible labels, voice + visual redundancy and clear offline feedback.

## 9. Security, Privacy and Safety

- Server-side Firebase token verification.
- Resource-level authorization.
- Explicit/scoped/revocable caregiver access.
- Private optional voice/photo media.
- Data minimization.
- Redacted structured logging.
- No privileged secrets in APK/source control.
- No diagnosis, prescribing or autonomous medication changes.

## 10. Testing

The final report should document actual results for unit, API/integration, database migration, authentication/authorization, offline/sync, reminder scheduling, TTS/STT, accessibility, notification and Android device testing.

Do not label planned test cases as passed without evidence.

## 11. Community Engagement and Trial

The project follows the five CEP phases:

1. Problem Identification
2. Requirement Gathering
3. Technology Development
4. Community Engagement
5. Evaluation

**Evidence placeholders:** Insert only actual consent records, field notes, participant count, deployment dates, observations, feedback and three-day trial results.

## 12. Results and Evaluation

Use actual measured data for:

- reminder trigger success;
- acknowledgement behavior;
- usability observations;
- accessibility findings;
- offline reliability;
- synchronization integrity;
- caregiver workflow feedback.

Do not fabricate results, percentages, scores or participant statements.

## 13. Limitations

Document actual limitations such as Android device-specific alarm/background restrictions, TTS voice availability, network-dependent cloud synchronization and prototype/community-trial scope.

## 14. Future Scope

Potential future work must remain separately approved and consistent with the project's medical-safety boundary. Examples include wearable support and advanced assistive features; autonomous diagnosis or medication changes are outside the product boundary.

## 15. Conclusion

Medicare demonstrates a local-first, senior-first approach to medication reminders. Its central engineering requirement is reliable local execution of the configured reminder, reinforced by voice, visual accessibility, secure synchronization and explicit caregiver authorization.

## Submission Evidence Checklist

- [ ] Final architecture diagram.
- [ ] Approved wireframe references.
- [ ] API/database implementation evidence.
- [ ] Security validation evidence.
- [ ] Android device screenshots/video.
- [ ] Offline reminder evidence.
- [ ] Test report with actual results.
- [ ] CEP fieldwork evidence.
- [ ] Three-day trial evidence.
- [ ] Final APK/build metadata.
- [ ] Final bibliography/references.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
