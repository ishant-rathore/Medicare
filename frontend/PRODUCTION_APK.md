# Production APK Release Gate

A production APK is releasable only when the real Flutter Android project is present, release signing is configured outside source control, CI passes, and the APK has been smoke-tested on a physical Android device.

Required checks:

1. `flutter pub get`
2. `dart format --output=none --set-exit-if-changed .`
3. `flutter analyze`
4. `flutter test`
5. `flutter build apk --release`
6. Verify Android notification/alarm behavior.
7. Verify TTS/STT fallback controls.
8. Verify Taken/Snooze/Skip.
9. Disable network and verify an already-configured reminder still executes.
10. Verify offline dose event queues and later synchronizes idempotently.
11. Verify no secrets or signing files are committed.
12. Archive the tested APK together with version and commit SHA.

Do not call an unsigned or untested debug build a production APK.
