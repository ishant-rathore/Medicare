# Medicare — User Flows

## Voice Reminders for Senior Citizen Medications

**Version:** 1.0

---

# 1. Main Application Flow

```text
Launch
  ↓
Authentication / Onboarding
  ↓
Home
  ↓
View Medicines / Reminders
  ↓
Reminder Trigger
  ↓
Voice + Visual Alert
  ↓
Taken / Snooze / Skip
  ↓
Local Dose History
  ↓
Sync When Available
```

---

# 2. Authentication Flow

```text
Launch
  ↓
Authentication
  ↓
Firebase Authentication
  ↓
Authenticated?
 ┌───────┴────────┐
 NO               YES
 ↓                 ↓
Login / Signup    Home
```

The backend must verify Firebase ID tokens for protected API access.

---

# 3. New User Flow

```text
Welcome
  ↓
Create / Sign In
  ↓
Profile / Preferences
  ↓
Accessibility Preferences
  ↓
Add First Medicine
  ↓
Configure Reminder
  ↓
Save
  ↓
Home
```

---

# 4. Add Medicine Flow

```text
Home
  ↓
Add Medicine
  ↓
Enter Medicine Information
  ↓
Validate
  ↓
Save Locally
  ↓
Create / Update Cloud Data When Available
  ↓
Medicine List
```

Local persistence should occur before depending on network synchronization.

---

# 5. Edit Medicine Flow

```text
Medicine List
  ↓
Select Medicine
  ↓
Edit
  ↓
Update Information
  ↓
Validate
  ↓
Save Local Changes
  ↓
Queue Synchronization
```

---

# 6. Deactivate Medicine Flow

```text
Medicine
  ↓
Deactivate
  ↓
Confirmation
  ↓
User Confirms
  ↓
Update Local State
  ↓
Update Reminder Scheduling
  ↓
Queue Synchronization
```

Deactivation must not silently modify unrelated medication instructions.

---

# 7. Create Reminder Flow

```text
Medicine
  ↓
Add Reminder
  ↓
Select Time
  ↓
Select Schedule
  ↓
Validate
  ↓
Save Locally
  ↓
Schedule Android Alarm
  ↓
Confirmation
```

The Android local alarm must not depend on internet connectivity.

---

# 8. Supported Schedule Flow

```text
Create Reminder
      ↓
Choose Schedule
      |
      +--> Daily
      |
      +--> Weekly
      |
      +--> Alternate-day
      |
      +--> Custom
      |
      +--> Every-X-hours
      |
      ↓
Save
```

---

# 9. Reminder Trigger Flow

```text
Local Reminder Schedule
        ↓
Android Alarm
        ↓
Reminder Triggered
        ↓
Full-Screen Reminder
        ↓
Voice + Visual Alert
        ↓
User Action
```

---

# 10. Voice Reminder Flow

```text
Reminder Triggered
       ↓
Build Configured Reminder Text
       ↓
TTS
       ↓
Speak Reminder
       ↓
Show Actions
```

Voice output must use configured medication information.

---

# 11. Voice Command Flow

```text
User Activates Voice
       ↓
Listening State
       ↓
STT
       ↓
Recognize Command
       ↓
Validate
       |
       +--> Taken
       |
       +--> Snooze
       |
       +--> Skip
       |
       +--> Unknown
```

Unknown commands must not trigger medication state changes.

---

# 12. Taken Flow

```text
Reminder
  ↓
Taken
  ↓
Validate Action
  ↓
Create Local Dose Event
  ↓
Update Local History
  ↓
Add Sync Queue Entry
  ↓
Show Success
```

---

# 13. Snooze Flow

```text
Reminder
  ↓
Snooze
  ↓
Select Snooze Duration
  ↓
Save Local State
  ↓
Reschedule Local Alarm
  ↓
Update UI
  ↓
Sync When Available
```

---

# 14. Skip Flow

```text
Reminder
  ↓
Skip
  ↓
Confirmation
  ↓
Confirm
  ↓
Create Local Dose Event
  ↓
Update History
  ↓
Queue Synchronization
  ↓
Show Confirmation
```

---

# 15. Offline Flow

```text
Internet Available
       ↓
Device Goes Offline
       ↓
Local Data Remains Available
       ↓
Reminder Executes
       ↓
User Takes Action
       ↓
Dose Event Saved Locally
       ↓
Sync Status = Pending
       ↓
Device Reconnects
       ↓
Synchronization
```

---

# 16. Sync Flow

```text
Connectivity Available
       ↓
Read Pending Queue
       ↓
Authenticate
       ↓
Send Mutation
       ↓
Server Validates Identity
       ↓
Server Validates Authorization
       ↓
Server Validates Event
       ↓
Idempotency Check
       ↓
PostgreSQL Transaction
       ↓
Success
       ↓
Mark Local Event Synced
```

---

# 17. Failed Sync Flow

```text
Pending Event
      ↓
Sync Attempt
      ↓
Failed
      ↓
Temporary Failure?
   /          \
 YES           NO
 ↓              ↓
Retry Later    Mark Error/Conflict
```

Failed events must not simply disappear.

---

# 18. Duplicate Sync Flow

```text
Local Event
local_event_id = ABC123
       ↓
Send Event
       ↓
Server Creates Event
       ↓
Network Failure
       ↓
Client Retries ABC123
       ↓
Server Finds Existing Event
       ↓
Return Existing Result
       ↓
No Duplicate Created
```

---

# 19. Caregiver Authorization Flow

```text
User
  ↓
Caregiver Settings
  ↓
Add / Invite Caregiver
  ↓
Explicit Authorization
  ↓
Define Scope
  ↓
Caregiver Access
```

Access must be controlled by server-side authorization.

---

# 20. Revocation Flow

```text
Caregiver
   ↓
Manage Access
   ↓
Revoke
   ↓
Confirmation
   ↓
Authorization Removed
   ↓
Future Protected Requests Rejected
```

---

# 21. Refill Reminder Flow

```text
Medicine
   ↓
Configure Refill Rule
   ↓
Store Rule
   ↓
Monitor Local Medicine Data
   ↓
Threshold / Reminder Condition
   ↓
Show Refill Reminder
```

This is an organizational reminder, not medical advice.

---

# 22. Accessibility Flow

```text
Settings
   ↓
Accessibility
   |
   +--> Text Size
   |
   +--> High Contrast
   |
   +--> Voice
   |
   +--> Vibration
   |
   +--> Other Approved Options
```

---

# 23. Permission Flow

```text
Feature Requires Permission
       ↓
Explain Why
       ↓
Request Permission
       |
       +--> Granted
       |      ↓
       |   Feature Available
       |
       +--> Denied
              ↓
        Fallback Available
```

---

# 24. Error Recovery Flow

```text
Error
 ↓
Explain Problem
 ↓
Keep Local Data Safe
 ↓
Offer Recovery
 |
 +--> Retry
 |
 +--> Cancel
 |
 +--> Continue Offline
```

---

# 25. Voice Failure Flow

```text
Voice Requested
      ↓
STT / TTS Failure
      ↓
Show Clear Error
      ↓
Show Touch Controls
      ↓
Taken / Snooze / Skip
```

Voice failure must never break the reminder.

---

# 26. Application Restart Flow

```text
Application Closed
       ↓
Local SQLite Persists
       ↓
Application Reopened
       ↓
Load Local Data
       ↓
Load Pending Sync Queue
       ↓
Resume Normal Operation
```

---

# 27. Notification Flow

```text
Reminder Schedule
      ↓
Android Alarm
      ↓
Notification / Full-Screen Reminder
      ↓
Voice + Visual Feedback
      ↓
User Action
```

---

# 28. Main User Journey

```text
             +-------------+
             |    START    |
             +------+------+
                    |
                    v
             +-------------+
             |    HOME     |
             +------+------+
                    |
                    v
             +-------------+
             |  REMINDER   |
             +------+------+
                    |
           +--------+--------+
           |        |        |
           v        v        v
        TAKEN    SNOOZE    SKIP
           |        |        |
           +--------+--------+
                    |
                    v
             +-------------+
             | LOCAL EVENT |
             +------+------+
                    |
                    v
             +-------------+
             | SYNC QUEUE  |
             +------+------+
                    |
                    v
             +-------------+
             |  SYNC WHEN  |
             |  AVAILABLE  |
             +-------------+
```

---

# 29. Safety Flow

Medication instructions must follow:

```text
User / Caregiver Input
        ↓
Configured Medicine Data
        ↓
Reminder
        ↓
User Action
```

The application must not introduce:

```text
Diagnosis
Prescription
Dosage Change
Frequency Change
Treatment Recommendation
```

---

# 30. User Flow Acceptance Criteria

- [ ] User can authenticate.
- [ ] User can configure medicines.
- [ ] User can configure recurring reminders.
- [ ] Local reminders work offline.
- [ ] Voice reminder has visual fallback.
- [ ] Taken works.
- [ ] Snooze works.
- [ ] Skip works.
- [ ] Dose history is stored locally.
- [ ] Pending events survive offline operation.
- [ ] Synchronization is idempotent.
- [ ] Caregiver authorization is explicit.
- [ ] Revoked access is enforced.
- [ ] Accessibility options remain available.
- [ ] Errors have recovery paths.

---

# 31. Flow Principle

> **Every critical journey must have a reliable local path and a visible fallback.**
