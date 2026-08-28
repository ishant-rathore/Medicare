# Medicare — Viva Questions & Answers

## 1. What problem does Medicare solve?

Medicare helps senior citizens manage routine medication reminders through a senior-first, voice-first and offline-first experience.

## 2. Why is the project Android-first?

The approved project baseline targets an Android mobile application so the reminder/alarm experience can execute directly on the user's phone.

## 3. What is the most important architectural decision?

The reminder path is local-first. SQLite stores the operational medication/schedule state, Android schedules the local alarm, and the reminder can execute without continuous internet connectivity.

## 4. Why use SQLite and PostgreSQL?

SQLite is the local operational store required for offline reminder execution. PostgreSQL is the canonical cloud database for synchronized application data.

## 5. Why is the backend not responsible for triggering reminders?

A backend would introduce network dependency into a time-critical reminder. The local Android alarm should continue even when the API/cloud is unavailable.

## 6. What happens when the user is offline?

The configured local reminder still triggers. Taken/Snooze/Skip events are stored locally and placed into the pending synchronization queue. They are synchronized when connectivity returns.

## 7. How do you prevent duplicate synchronization?

Offline dose events use stable local event identifiers such as `local_event_id`. The server treats event identity idempotently and returns an existing canonical result for an already-accepted event rather than inserting a duplicate.

## 8. How is caregiver access protected?

Caregiver access is explicit, scoped and revocable. The backend verifies the authenticated actor, active caregiver relationship and permission scope for every protected resource request.

## 9. Why is client-side user ID not trusted?

The client is untrusted. The backend derives identity from the verified Firebase token and performs resource-level ownership/permission checks.

## 10. What does voice-first mean?

Voice is a primary communication channel for reminders, but it is not the only interaction method. Visible controls such as Taken, Snooze and Skip remain available.

## 11. What if TTS or STT fails?

The reminder still provides visible information and visible actions. STT shows a listening state and must provide a clear fallback when recognition fails.

## 12. Does the app continuously listen to the microphone?

No. Microphone access is limited to an explicitly active, approved voice-command or recording flow.

## 13. Is Medicare a medical/diagnostic application?

No. Medicare is a medication reminder and organization tool. It does not diagnose, prescribe, recommend stopping medication, modify dosage/frequency or provide clinical advice.

## 14. How is accessibility handled?

The UI uses large scalable typography, high contrast, oversized controls, shallow navigation, semantic labels, vibration/visual redundancy and visible voice fallbacks. Status is not communicated through color alone.

## 15. What technologies are used?

Flutter/Dart for the Android client, SQLite for local storage, Node.js/Express/TypeScript for the backend, PostgreSQL for canonical cloud persistence, Firebase Authentication for identity, FCM for configured remote messaging and Firebase Storage for optional private media.

## 16. What is the backend architecture?

A modular monolith using route → middleware → controller → service → repository → PostgreSQL. Controllers stay thin; domain logic lives in services; repositories own database access.

## 17. How are API requests secured?

Protected requests use Firebase Bearer ID tokens over HTTPS/TLS. The server verifies identity, validates payloads, checks authorization and uses safe database access.

## 18. How do you handle medical safety?

Reminder content is based on trusted information entered by the user/caregiver. No AI or backend logic is allowed to autonomously alter clinical instructions.

## 19. What is tested before release?

The project requires formatting/linting/static analysis, unit tests, API/integration tests, database migration tests, authentication/authorization, offline/sync, reminder scheduling, Taken/Snooze/Skip, TTS/STT, accessibility, notification and Android device tests.

## 20. How does the project satisfy the CEP requirement?

The project follows problem identification, requirement gathering, technology development, community engagement and evaluation, including the required elderly-user interaction/deployment evidence. Actual field and trial results must be documented from real evidence.

## 21. What is the project's North Star?

Reliable local reminder execution + senior-first accessibility + secure synchronization + explicit caregiver authorization + strict medical-safety boundaries.
