# Medicare — Presentation Outline

## 1. Title

**Medicare — Voice Reminders for Senior Citizen Medications**  
*Your Trusted Voice Medication Companion*

Project Type: Community Engagement Project (CEP)  
Platform: Android-first mobile application

## 2. Problem

Senior citizens may face difficulty remembering multiple medicines, timings and instructions when reminders depend on small text, weak notification visibility, unfamiliar interfaces or uncomfortable language.

## 3. Proposed Solution

Medicare combines:

- loud local alarms;
- regional-language TTS where supported;
- high-contrast visual reminders;
- large touch targets;
- simple Taken/Snooze/Skip actions;
- medication history and adherence visibility;
- optional caregiver support;
- offline-first reminder execution.

## 4. North Star

> When a medicine is due, Medicare must make the reminder loud, visible, understandable and easy to acknowledge.

## 5. Core Architecture

```text
Flutter Android App
      ↓
Local Services + SQLite
      ↓
Android Alarm / Notification
      ↓
Voice + Visual Reminder
      ↓
Taken / Snooze / Skip
      ↓
Local Dose History
      ↓
Authenticated Sync API
      ↓
Node.js + Express + PostgreSQL
```

Firebase Authentication, FCM and optional Firebase Storage support the cloud path.

## 6. Offline-First USP

The local reminder path does not require continuous internet connectivity. Cloud services are secondary for synchronization, persistence, caregiver visibility and remote messaging.

## 7. Senior-First UX

- Large scalable typography.
- High contrast.
- Large controls.
- One clear decision per screen.
- Visible labels and status icons.
- Voice-first, not voice-only.
- Forgiving interaction.

## 8. Reminder Lifecycle

```text
Scheduled
  ↓
Triggered
  ├→ Taken
  ├→ Snoozed → Triggered
  ├→ Skipped
  └→ Missed → Caregiver Alert (if enabled)
```

## 9. Security and Privacy

- Firebase ID tokens verified server-side.
- Resource-level authorization.
- Explicit/scoped caregiver access.
- Private optional media.
- Data minimization.
- Redacted logging.
- No secrets in APK/source control.

## 10. Medical Safety

Medicare is a reminder and medication organization tool. It does not diagnose, prescribe, change dosage/frequency or generate clinical advice.

## 11. Testing

Show evidence for:

- reminder scheduling and local alarms;
- offline reminder execution;
- Taken/Snooze/Skip;
- sync/idempotency;
- TTS/STT;
- accessibility;
- authentication/authorization;
- Android device behavior.

Use actual test artifacts; do not present placeholders as completed results.

## 12. CEP Methodology

1. Problem Identification
2. Requirement Gathering
3. Technology Development
4. Community Engagement
5. Evaluation

Community trial results, participants and locations must come from actual project evidence.

## 13. Future Scope

Future extensions may include advanced media/voice experiences, wearable integrations and other capabilities only when separately approved and consistent with the medical-safety boundary.

## 14. Closing

**Medicare = Reliable local reminders + senior-first accessibility + secure synchronization + explicit caregiver authorization + strict medical-safety boundaries.**
