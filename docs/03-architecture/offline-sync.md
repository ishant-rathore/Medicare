<<<<<<< HEAD
# Offline Sync Architecture

=======
# Medicare — Voice Architecture

## Voice Reminders for Senior Citizen Medications

> **Voice is primary, but never the only interaction method.**

---

## 1. Purpose

This document defines the voice architecture for Medicare.

The voice system provides:

- Text-to-Speech (TTS) medication reminders.
- Speech-to-Text (STT) reminder commands.
- Voice configuration.
- Listening-state feedback.
- Visible fallback controls.
- Accessibility support.

The voice subsystem must integrate with the local-first reminder architecture.

---

# 2. Voice Architecture Principle

The voice system must never become a dependency for executing a medication reminder.

The reminder must remain usable when:

- Internet is unavailable.
- Speech recognition fails.
- TTS is unavailable.
- Microphone permission is unavailable.
- The user does not want to use voice.

Therefore:

```text
Local Reminder
      ↓
Visual Reminder
      +
Voice Reminder
      ↓
User Action
   /       \
Voice     Touch
```

Voice and visual interaction provide redundancy.

---

# 3. High-Level Architecture

```text
                    +----------------------+
                    |   Reminder Engine    |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Reminder Presentation |
                    +----------+-----------+
                               |
                +--------------+--------------+
                |                             |
                v                             v
        +---------------+              +---------------+
        | Visual Alert  |              | Voice Engine  |
        +---------------+              +-------+-------+
                                                |
                                     +----------+----------+
                                     |                     |
                                     v                     v
                                  TTS Engine            STT Engine
                                     |                     |
                                     v                     v
                                Spoken Text          Voice Command
                                     |                     |
                                     +----------+----------+
                                                |
                                                v
                                      +-------------------+
                                      | Reminder Actions  |
                                      +-------------------+
                                      | Taken             |
                                      | Snooze            |
                                      | Skip              |
                                      +-------------------+
```

---

# 4. Voice Components

## 4.1 Voice Controller

The Voice Controller coordinates voice operations.

Responsibilities:

- Start TTS.
- Stop TTS.
- Start STT.
- Stop STT.
- Track voice state.
- Process recognized commands.
- Report errors.
- Provide fallback interaction.

The controller must not directly manipulate SQLite or raw HTTP APIs.

---

## 4.2 TTS Service

The Text-to-Speech service converts configured reminder information into spoken output.

Example:

```text
"Medication reminder. It is time for your Blood Pressure medicine."
```

The exact spoken content must be generated only from configured medication/reminder information.

The TTS service must not generate clinical advice.

---

## 4.3 STT Service

The Speech-to-Text service converts user speech into recognized commands.

STT shall be used only when the user explicitly activates or accepts voice interaction.

The system must not continuously listen.

---

# 5. Voice State Machine

```text
IDLE
  |
  v
PREPARING
  |
  v
SPEAKING
  |
  v
WAITING_FOR_ACTION
  |
  +-----------> COMPLETED
  |
  +-----------> LISTENING
                   |
             +-----+-----+
             |           |
             v           v
         COMMAND      FAILURE
             |
             v
          ACTION
```

Possible states:

| State | Description |
|---|---|
| `IDLE` | Voice subsystem inactive |
| `PREPARING` | Preparing voice output |
| `SPEAKING` | TTS is speaking |
| `WAITING_FOR_ACTION` | Waiting for user action |
| `LISTENING` | STT is actively listening |
| `PROCESSING` | Recognized command is being processed |
| `COMPLETED` | Voice interaction completed |
| `ERROR` | Voice interaction failed |

---

# 6. TTS Flow

```text
Reminder Triggered
       ↓
Load Local Reminder Data
       ↓
Build Reminder Text
       ↓
Validate Reminder Text
       ↓
TTS Service
       ↓
Speak Reminder
       ↓
Show Visual Reminder
```

The reminder text should contain only information required to identify and acknowledge the configured reminder.

---

# 7. Reminder Voice Content

The TTS system may communicate:

- Medication name.
- Configured reminder time.
- Configured dose information where supported by the product requirements.
- Available actions.

Example:

```text
"Your medication reminder is due.
Please take your configured medicine.
You can say Taken, Snooze, or Skip."
```

The system must not add:

- Diagnosis.
- Medical recommendations.
- Dosage changes.
- Clinical warnings not provided by the configured data.
- Prescription instructions.

---

# 8. STT Command Architecture

STT shall recognize only defined reminder commands.

Example command mapping:

| Voice Command | Application Action |
|---|---|
| `Taken` | Mark dose as Taken |
| `Snooze` | Snooze reminder |
| `Skip` | Mark dose as Skipped |

The command vocabulary must remain controlled.

Unknown commands shall not trigger medication changes.

---

# 9. STT Flow

```text
User Activates Voice
        ↓
Show Listening State
        ↓
Start STT
        ↓
Capture Short Interaction
        ↓
Recognize Command
        ↓
Validate Command
        ↓
Confirm Allowed Action
        ↓
Execute Use Case
        ↓
Store Local Result
        ↓
Update UI
```

---

# 10. Listening State

When STT is active, the UI must clearly indicate:

```text
Listening...
```

The interface should provide:

- Visible listening indicator.
- Stop/cancel option.
- Touch alternatives.
- Error/failure feedback.

Voice must never be the only way to complete a reminder action.

---

# 11. Voice Fallback

If voice fails:

```text
STT Failure
    ↓
Show Error
    ↓
Show Touch Controls
    ↓
Taken | Snooze | Skip
```

If TTS fails:

```text
TTS Failure
    ↓
Show Visual Reminder
    ↓
Use Notification / Vibration
```

The medication reminder must continue.

---

# 12. Permissions

The application shall request only necessary Android permissions.

Microphone access shall be requested only when required for STT.

The application shall not request microphone access for continuous monitoring.

If microphone permission is denied:

```text
Voice unavailable
      ↓
Visual controls remain available
```

---

# 13. Privacy

Voice interaction shall follow data minimization.

The system shall:

- Avoid continuous listening.
- Avoid unnecessary recording.
- Avoid unnecessary transcript retention.
- Avoid sending speech data to the backend unless explicitly required.
- Avoid storing sensitive voice information unnecessarily.

Optional family voice recordings are separate private media and must be access-controlled.

---

# 14. Voice and Offline Operation

The voice reminder architecture must support the local-first model.

```text
SQLite
  ↓
Local Reminder
  ↓
Android Alarm
  ↓
Voice + Visual Reminder
```

Cloud services are not required to execute the reminder.

If an online service is unavailable, local reminder functionality must continue.

---

# 15. Layer Integration

The Flutter architecture shall follow:

```text
Presentation
      ↓
Application / Use Cases
      ↓
Domain
      ↓
Data / Repositories
      ↓
Platform Services
```

Voice functionality belongs primarily to the platform-service/application boundary.

The UI must not directly invoke low-level platform APIs.

---

# 16. Voice Use Cases

Recommended application use cases:

```text
SpeakReminder
ListenForReminderCommand
ProcessReminderCommand
StopVoiceInteraction
```

Example:

```text
Reminder Triggered
       ↓
SpeakReminder
       ↓
WaitForAction
       ↓
ListenForReminderCommand
       ↓
ProcessReminderCommand
       ↓
Taken / Snooze / Skip
```

---

# 17. Error Handling

Voice errors must be explicit and recoverable.

Possible errors:

- TTS unavailable.
- STT unavailable.
- Microphone permission denied.
- No speech detected.
- Unknown command.
- Speech recognition failure.
- Platform voice service failure.

The application shall never silently change a medication state because of an uncertain voice recognition result.

---

# 18. Medical Safety

Voice recognition must not interpret arbitrary speech as medication instructions.

The voice subsystem shall not:

- Change dosage.
- Change medication frequency.
- Stop medication.
- Prescribe medication.
- Diagnose medical conditions.
- Generate clinical advice.

Only approved reminder actions may be executed.

---

# 19. Security

The voice subsystem shall:

- Follow least privilege.
- Request minimal permissions.
- Avoid unnecessary data retention.
- Avoid unnecessary network transmission.
- Never store authentication tokens in voice data.
- Protect optional family recordings.

---

# 20. Accessibility

Voice shall complement accessibility features.

The system shall support:

- Large text.
- High contrast.
- Large touch targets.
- Screen readers.
- Vibration.
- Visual feedback.
- Voice feedback.
- Visible alternatives.

---

# 21. Testing Requirements

Voice testing shall include:

### TTS

- Reminder text is spoken.
- Correct medication information is used.
- TTS failure is handled.
- Visual fallback works.

### STT

- `Taken` is recognized.
- `Snooze` is recognized.
- `Skip` is recognized.
- Unknown commands are rejected.
- Listening state is visible.
- Permission denial is handled.
- Recognition failure is handled.

### Offline

- TTS reminder works without internet where device capabilities permit.
- Local reminder execution does not depend on cloud services.

### Accessibility

- Voice and touch controls work together.
- Screen-reader behavior is verified.
- Large controls remain available.

---

# 22. Voice Acceptance Criteria

The voice subsystem is acceptable when:

- TTS reads configured reminder information.
- STT supports defined commands.
- Listening state is visible.
- Voice is not continuously listening.
- Touch alternatives are always available.
- Voice failure does not break reminders.
- Offline reminder execution remains functional.
- No clinical advice is generated.
- No medication instruction is autonomously changed.
- Unrecognized speech cannot trigger unsafe actions.

---

# 23. Final Voice Principle

> **Voice should make medication reminders easier to hear, understand and acknowledge — never harder, and never less safe.**
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
