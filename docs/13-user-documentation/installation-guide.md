<<<<<<< HEAD
# Installation Guide

=======
# Medicare — Installation Guide

## 1. Overview

This guide covers installation of the Android-first Medicare application for development, testing and controlled demo/community use.

## 2. Prerequisites

- Supported Android smartphone.
- Release APK or development build.
- Required Android notification/alarm permissions.
- Device TTS support for spoken reminders where voice is enabled.
- Internet connectivity is useful for authentication and synchronization, but it is **not required for an already-configured local reminder**.

## 3. Install APK

1. Obtain the validated Medicare APK from the approved project artifact.
2. On the Android device, allow installation from the trusted source where required by Android.
3. Install the APK.
4. Open Medicare.
5. Complete onboarding/login and profile setup.
6. Grant only permissions required for the enabled features.

## 4. Initial Configuration

Configure:

- Preferred language.
- Accessibility preferences.
- Voice settings.
- Notification/alarm settings.
- Optional emergency/caregiver information.

Then add the required medicine and reminder schedule.

## 5. Verify Reminder Setup

After saving a reminder:

- confirm the medicine and schedule are stored locally;
- confirm local alarm/notification setup completed;
- test a near-future reminder;
- verify the reminder while the device has no network connectivity.

The app should make the reminder loud, visible, understandable and easy to acknowledge.

## 6. Troubleshooting Installation

### App cannot install

Check device storage, Android compatibility and whether the APK is valid/not corrupted.

### Notifications do not appear

Check Android notification permission and relevant notification channel settings.

### Alarm does not trigger

Check Android alarm permissions/behavior, battery optimization/background restrictions and device time settings.

### Voice does not play

Check media/alarm volume and installed TTS language/voice support.

### Cloud features fail

Check network connectivity, Firebase authentication/session state and configured API environment. Core local reminders must remain usable.

## 7. Security Notes

Do not install untrusted builds for a community trial. Never share credentials, Firebase privileged keys, database credentials or other secrets through the APK or screenshots.

## 8. Removal

To remove the application, use Android Settings → Apps → Medicare → Uninstall, according to the device's UI.

For prototype data removal requirements, follow the project's documented privacy/account removal process rather than relying only on uninstall behavior.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
