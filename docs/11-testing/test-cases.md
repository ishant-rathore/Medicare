# Medicare — Test Cases

This file defines executable test cases for the Medicare baseline. Results belong in `test-report.md` after execution.

| ID | Area | Test | Expected Result | Priority |
|---|---|---|---|---|
| TC-001 | Auth | Sign in with valid Firebase account | User reaches authorized app state | P0 |
| TC-002 | Auth | Use expired/invalid token against protected API | Request rejected safely | P0 |
| TC-003 | Authorization | Request another user's medicine by ID | Access rejected | P0 |
| TC-004 | Caregiver | Grant scoped caregiver access | Only configured permissions are available | P0 |
| TC-005 | Caregiver | Revoke caregiver then retry access | Access rejected | P0 |
| TC-006 | Medicine | Create medicine with required fields | Medicine saved locally and available to user | P0 |
| TC-007 | Medicine | Edit/deactivate medicine | State updates without corrupting historical dose events | P0 |
| TC-008 | Reminder | Create daily reminder | Local schedule and Android alarm are created | P0 |
| TC-009 | Reminder | Create weekly reminder | Correct recurrence is scheduled | P0 |
| TC-010 | Reminder | Create alternate-day/custom/every-X-hours reminder | Recurrence validates and schedules correctly | P0 |
| TC-011 | Reminder | Fire due reminder | Full-screen alarm, voice/visual reminder and controls appear | P0 |
| TC-012 | Reminder | Network disabled when reminder is due | Reminder still triggers locally | P0 |
| TC-013 | Dose | Select Taken | Local dose event is recorded with timestamp | P0 |
| TC-014 | Dose | Select Snooze | Next local trigger is created and event recorded | P0 |
| TC-015 | Dose | Select Skip | Skip event is recorded and reminder closes correctly | P0 |
| TC-016 | Dose | Let acknowledgement window expire | Dose becomes Missed; caregiver event created if enabled | P0 |
| TC-017 | Sync | Sync one offline dose event after reconnect | Event accepted and becomes canonical | P0 |
| TC-018 | Sync | Retry same local dose event | No duplicate event is created | P0 |
| TC-019 | Sync | Submit offline event for unauthorized resource | Server rejects mutation | P0 |
| TC-020 | Voice | TTS enabled with supported language | Configured medicine/time/dosage is spoken | P0 |
| TC-021 | Voice | TTS unavailable/fails | Visible fallback controls remain available | P0 |
| TC-022 | Voice | Start STT command | Listening state is visible and command path works | P1 |
| TC-023 | Voice | Verify no continuous microphone listening | Microphone activates only during approved flow | P0 |
| TC-024 | Accessibility | Increase Android text size | Critical content remains readable without clipping | P0 |
| TC-025 | Accessibility | Enable high contrast/dark mode | Text and controls remain legible | P0 |
| TC-026 | Accessibility | Use screen reader on critical reminder | Labels and actions are understandable | P0 |
| TC-027 | Accessibility | Tap Taken/Snooze/Skip with reduced precision | Oversized controls are usable | P0 |
| TC-028 | Notification | Configure vibration/sound | Reminder follows saved settings | P1 |
| TC-029 | Notification | Caregiver missed-dose alert enabled | Remote alert sent through configured FCM path | P1 |
| TC-030 | Security | Send SQL injection payload | Input safely rejected/handled; no unauthorized query behavior | P0 |
| TC-031 | Security | Attempt mass assignment of protected fields | Protected fields cannot be overwritten | P0 |
| TC-032 | Security | Try to access private media without permission | Access denied | P0 |
| TC-033 | Privacy | Inspect application logs during medication operation | Tokens/secrets/unnecessary medication data are not logged | P0 |
| TC-034 | Lifecycle | Restart app after scheduling reminder | Local schedule remains available and reminder remains valid | P0 |
| TC-035 | Error | API unavailable during normal use | Local reminder path remains functional; offline state is clear | P0 |
| TC-036 | Refill | Set low-stock threshold | Refill state appears when threshold is reached | P1 |
| TC-037 | History | Review daily/weekly/monthly history | Recorded events appear with correct status/timestamps | P0 |
| TC-038 | Data Integrity | Deactivate medicine with existing history | Historical dose events remain available per retention rules | P0 |
| TC-039 | Medical Safety | Submit misleading medication text | System does not generate clinical advice or change instructions | P0 |
| TC-040 | Release | Run end-to-end critical path on release candidate | All P0 critical checks pass | P0 |

## End-to-End Critical Test

```text
Create medicine
→ Schedule reminder
→ Disable network
→ Alarm triggers
→ Voice + visual reminder
→ Taken/Snooze/Skip
→ Local history
→ Re-enable network
→ Synchronize
→ Retry same event
→ Confirm no duplicate
```

## Evidence Requirement

Record device model, Android version, app build/commit, environment, test data, timestamps, observed result, defect reference and tester/date for actual execution. Do not fill expected results as actual results without evidence.
