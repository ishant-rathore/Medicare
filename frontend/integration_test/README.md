# Frontend Integration Tests

Flutter integration/device tests for release-critical behavior.

Minimum release coverage:

- local reminder scheduling and alarm delivery
- full-screen/notification reminder flow
- TTS and defined STT commands with visible fallbacks
- Taken/Snooze/Skip state transitions
- SQLite persistence and dose history
- offline operation with network unavailable
- sync queue retry and idempotency
- authentication/session behavior
- accessibility and large-touch-target flows
- Android notification/permission behavior

Run these tests on supported Android devices/emulators before release sign-off.