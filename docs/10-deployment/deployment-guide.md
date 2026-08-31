<<<<<<< HEAD
# Deployment Guide
=======
# Medicare — Deployment Guide

## 1. Overview

This guide covers development, staging/test and production/demo deployment for the Android-first Medicare application. The release must preserve the validated critical path:

```text
Local medication data
→ local schedule
→ Android alarm/notification
→ voice + visual reminder
→ Taken / Snooze / Skip
→ local dose history
→ synchronization when available
```

Cloud/API failure must not invalidate an already-configured local reminder. fileciteturn0file18

## 2. Environment Strategy

| Environment | Purpose | Data |
|---|---|---|
| Development | Feature work, debugging and unit tests | Synthetic/test data preferred |
| Staging / Test | API, database, sync, Android and CEP rehearsal | Isolated test/consented rehearsal data |
| Production / Demo | Controlled academic demonstration/community trial | Minimum necessary controlled data |

Keep environment URLs, Firebase project IDs and secrets outside source code and inject them through environment-specific configuration.

## 3. Prerequisites

### Mobile

- Flutter SDK compatible with the repository's project configuration.
- Dart SDK provided by Flutter.
- Android SDK and a supported Android device/emulator.
- Device notification/alarm permissions configured as required by the app.

### Backend

- Node.js compatible with `backend/package.json`.
- npm.
- PostgreSQL instance.
- Firebase project for Authentication and any enabled FCM/Storage features.

## 4. Repository Setup

```bash
git clone https://github.com/ishant-rathore/Medicare.git
cd Medicare
```

Create environment configuration from the repository examples and supply values through secure environment configuration. Never commit secrets.

## 5. Backend Deployment

### Install

```bash
cd backend
npm ci
```

### Configure

Use the repository's `.env.example` as the template. Typical configuration includes:

- PostgreSQL connection details.
- Firebase verification configuration.
- Server port.
- API base/version settings.
- Environment identifier.
- Storage/FCM configuration where enabled.

Do not place service-account credentials in the Flutter application or commit them to Git.

### Database

Run the repository's approved migrations using the project's configured migration workflow. Verify migration success before starting the application against a new environment.

### Quality Checks

Run the backend checks defined by the repository, including formatting/linting, TypeScript compilation and automated tests.

### Start

Use the backend scripts in `backend/package.json` for development or the release/start command appropriate to the deployment environment.

## 6. Flutter / Android Deployment

From the project root, install dependencies:

```bash
flutter pub get
```

Run static analysis/tests according to the repository configuration:

```bash
flutter analyze
flutter test
```

Build the release candidate using the repository's configured Android build process. Keep signing material outside source control.

Before distribution, install the release candidate on representative Android devices and verify:

- local reminders with network enabled;
- local reminders with network disabled;
- voice/TTS output;
- vibration and notification behavior;
- Taken/Snooze/Skip;
- dose history;
- accessibility and large-text behavior;
- app restart and reminder recovery;
- battery/background behavior supported by the target Android version.

## 7. Firebase Setup

Configure Firebase Authentication for identity. Configure FCM only where remote caregiver/device notifications are enabled. Configure Firebase Storage only for optional private family-voice and medicine-photo assets.

Keep Firebase development/staging/production environments isolated where practical.

Never embed privileged Firebase service credentials in the APK.

## 8. Deployment Pipeline

```text
Git
 ↓
CI checks
 ↓
Build
 ↓
Staging / Test
 ↓
Device + Integration Smoke Tests
 ↓
Explicit Approval
 ↓
Production / Demo
```

Promote an already-tested artifact rather than rebuilding differently between environments.

## 9. Release Gates

A release is blocked when any of these fail:

- critical reminder execution;
- offline reminder behavior;
- dose-event data integrity;
- authentication/authorization;
- security checks;
- database migration verification;
- accessibility smoke tests;
- notification/alarm behavior.

## 10. Post-Deployment Verification

### Backend

- Health endpoint responds successfully.
- Database connectivity is healthy.
- Authentication verification works.
- API writes/reads obey ownership rules.
- FCM/storage integrations work only where configured.

### Android

- App launches successfully.
- User can authenticate and access profile.
- Medicine can be configured.
- Reminder is persisted locally before setup success is shown.
- Android alarm triggers with the network disabled.
- Voice + visual reminder appears.
- Taken/Snooze/Skip records a local dose event.
- Sync occurs after connectivity returns.

## 11. Rollback

Keep:

- the previous-good APK/artifact;
- the previous-good backend revision;
- database backup/recovery procedure;
- migration version information;
- release tag and commit SHA.

If a release breaks reminder execution or data integrity, stop promotion and restore the previous-good artifact/revision according to the operations runbook. Do not trade reminder reliability for cloud functionality.

## 12. CEP Community Deployment

Before a community trial:

1. Use a validated release candidate.
2. Confirm device alarm, voice, accessibility and offline behavior.
3. Obtain voluntary participant consent.
4. Minimize collected personal/medical information.
5. Provide basic training.
6. Record observations and trial outcomes as actual evidence only.
7. Use anonymous or aggregated information in reports where practical.

Do not invent participant names, locations, trial results or usability scores.

## 13. Security Checklist

- [ ] Secrets are externalized.
- [ ] No database credentials are in the APK.
- [ ] Firebase privileged credentials are server-side only.
- [ ] HTTPS/TLS is enabled for protected API traffic.
- [ ] Authentication and authorization are verified server-side.
- [ ] Private media remains access-controlled.
- [ ] Sensitive data is minimized in logs.
- [ ] Required Android permissions only are requested.

## 14. Operational North Star

A deployment is successful only when the validated build preserves:

**local schedule → Android alarm → voice/visual reminder → Taken/Snooze/Skip → local history → later synchronization.**
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

