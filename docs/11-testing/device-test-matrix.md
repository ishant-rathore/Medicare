<<<<<<< HEAD
# Device Test Matrix

=======
# Medicare — Android Device Test Matrix

## Purpose

Use this matrix to validate the Android-first Medicare release candidate across representative supported devices and Android versions. Device results must be populated from actual execution; placeholders are intentional until testing occurs.

## Matrix

| ID | Device / Model | Android Version | Screen / Font | Alarm | Voice/TTS | Notifications | Offline | Sync | Accessibility | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| DEV-01 | [actual device] | [actual] | [actual] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [actual] |
| DEV-02 | [actual device] | [actual] | [actual] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [actual] |
| DEV-03 | [actual device] | [actual] | [actual] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [PASS/FAIL] | [actual] |

## Per-Device Checks

### Core Reminder

- [ ] Install release candidate.
- [ ] Authenticate successfully.
- [ ] Add medicine.
- [ ] Configure a recurring reminder.
- [ ] Confirm local persistence.
- [ ] Fire reminder at the configured time.
- [ ] Verify full-screen visual reminder.
- [ ] Verify TTS/voice output.
- [ ] Verify Taken/Snooze/Skip.
- [ ] Verify local history.

### Offline

- [ ] Disable network before reminder.
- [ ] Reminder still fires.
- [ ] Dose action still records locally.
- [ ] Pending sync is visible.
- [ ] Restore connectivity.
- [ ] Sync succeeds.
- [ ] Retried event does not duplicate.

### Android Lifecycle

- [ ] Reminder survives application backgrounding where supported.
- [ ] Reminder behavior is checked after device restart if supported by implementation.
- [ ] Battery/background restrictions are documented.
- [ ] Notification permissions are configured correctly.

### Accessibility

- [ ] Increased Android font scale.
- [ ] High-contrast mode.
- [ ] Dark mode.
- [ ] Screen-reader labels.
- [ ] Large critical buttons.
- [ ] No color-only status communication.

## Evidence

For each device record:

- Device model.
- Android version/build.
- App version and commit SHA.
- Date/time of test.
- Screenshots/video/logs where appropriate.
- Known device-specific limitations.
- Defect/issue ID for failures.

Do not mark a device as passing from assumption or code inspection alone.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
