<<<<<<< HEAD
# Troubleshooting
=======
# Medicare — Troubleshooting

This guide helps diagnose common Medicare deployment and runtime issues without weakening the local-first reminder path.

## 1. Reminder Does Not Trigger

Check:

- Medicine and reminder are stored locally.
- Android alarm/notification permission is available.
- The local reminder was scheduled successfully.
- Battery/background restrictions are not blocking the app.
- Device date, time and timezone are correct.
- Notification channel and sound settings are enabled.

Then test with a short future reminder while the network is disabled. Cloud/API availability must not be required for an already-configured reminder. fileciteturn0file18

## 2. Voice Reminder Is Silent

Check:

- Device media/alarm volume.
- TTS service is installed and enabled.
- Selected language/voice is supported by the device.
- Voice/repeat settings are enabled.
- The reminder has visible fallback actions.

Do not treat voice failure as a reason to remove Taken/Snooze/Skip controls.

## 3. App Works Online but Not Offline

Verify:

1. Medicine records exist in SQLite.
2. Reminder schedules exist locally.
3. Android alarms are scheduled independently of the API.
4. Dose actions write to the local database.
5. Pending mutations enter the sync queue.
6. The UI clearly shows offline/pending-sync state.

A network outage should degrade synchronization, not local reminder execution.

## 4. Sync Does Not Complete

Check:

- Network connectivity.
- Firebase authentication token validity.
- API base URL/environment configuration.
- Server availability.
- Request validation errors.
- Queue retry state.
- Stable `local_event_id` values.

For a retried event, verify that the server returns the existing canonical result rather than creating a duplicate.

## 5. Unauthorized Access Error

Check the authenticated actor and resource relationship. The backend must verify ownership or an active, explicitly authorized caregiver relationship. Do not bypass the error by trusting a client-supplied `user_id`.

## 6. Database Connection Failure

Check:

- PostgreSQL availability.
- Backend connection configuration.
- Network/security rules.
- Migration status.
- Connection pool health.

The application should continue local reminder operation while cloud persistence is unavailable.

## 7. FCM Notification Failure

FCM is a secondary remote messaging path. Check:

- Device token registration.
- Firebase project/environment.
- Notification permission.
- FCM configuration.
- Caregiver authorization.

A failed caregiver notification must not disable the local reminder.

## 8. Private Media Cannot Be Loaded

Check:

- Storage object exists.
- Access is private and authorized.
- The authenticated user/caregiver has permitted access.
- The media reference is valid.

Core text/voice reminder behavior should remain usable if an optional photo or family voice asset is unavailable.

## 9. App Shows the Wrong User's Local Data

Immediately stop normal use and investigate session isolation. Verify that:

- authenticated identity changed correctly;
- local database state is scoped to the active account;
- cached records are not reused across identities;
- sync queue items are associated with the correct authenticated user.

This is a security issue, not a cosmetic bug.

## 10. Logs Reveal Sensitive Data

Remove logging of:

- Firebase tokens;
- passwords;
- secrets;
- database credentials;
- unnecessary medicine names/dosages;
- full sensitive request payloads.

Prefer request IDs, error categories, timing and safe technical identifiers.

## 11. Release Candidate Smoke Test

Before promoting a fix:

```text
Create reminder
→ Disable network
→ Alarm triggers
→ Voice + visual reminder
→ Taken/Snooze/Skip
→ Local history updated
→ Re-enable network
→ Sync succeeds
→ Retry same event
→ No duplicate event
```

Also verify accessibility and senior-first interaction on a representative Android device.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

