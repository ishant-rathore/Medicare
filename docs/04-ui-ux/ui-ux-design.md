# Medicare — UI/UX Design

## Voice Reminders for Senior Citizen Medications

**Version:** 1.0

---

# 1. UX Goal

The primary UX goal is to help senior citizens manage medication reminders with minimal effort and confusion.

The experience should be:

- Simple
- Accessible
- Predictable
- Voice-enabled
- Visually clear
- Offline-capable
- Forgiving

---

# 2. Primary User Experience

The core experience is:

```text
Configure Medicine
       ↓
Configure Reminder
       ↓
Wait for Reminder
       ↓
Reminder Appears
       ↓
Voice + Visual Alert
       ↓
Taken / Snooze / Skip
       ↓
Dose History
       ↓
Sync When Available
```

---

# 3. Onboarding

Onboarding should introduce the application without overwhelming the user.

Suggested flow:

```text
Welcome
   ↓
Permissions / Preferences
   ↓
Accessibility Preferences
   ↓
Add Medicine
   ↓
Create Reminder
   ↓
Home
```

The user should understand that Medicare is a reminder and organization tool.

---

# 4. Home Screen

The home screen should immediately communicate the user's upcoming medication activity.

Suggested structure:

```text
+--------------------------------+
| Medicare                       |
|                                |
| Good Morning                   |
|                                |
| NEXT REMINDER                  |
|                                |
| Blood Pressure Medicine       |
| 8:00 AM                        |
|                                |
| [ VIEW REMINDER ]              |
|                                |
| TODAY                          |
|                                |
| ✓ 7:00 AM  Taken               |
| ⏰ 8:00 AM  Upcoming            |
|                                |
| [ + ADD MEDICINE ]             |
+--------------------------------+
```

---

# 5. Medicine Management

The medicine section allows users to:

- Add medicine.
- View medicine.
- Edit medicine.
- Deactivate medicine.
- View identification aids where supported.

Example:

```text
Medicines

+-----------------------------+
| Blood Pressure Medicine    |
| Morning                    |
| 8:00 AM                    |
+-----------------------------+

+-----------------------------+
| Vitamin                    |
| Evening                    |
| 8:00 PM                    |
+-----------------------------+

[ + ADD MEDICINE ]
```

---

# 6. Add Medicine

The add-medicine experience should use a simple form.

```text
Add Medicine

Medicine Name
[________________]

Dose Information
[________________]

Notes
[________________]

[ SAVE ]
```

Only information supported by the product requirements should be requested.

---

# 7. Reminder Configuration

Reminder creation should support approved schedule types.

Examples include:

- Daily
- Weekly
- Alternate-day
- Custom
- Every-X-hours

Example:

```text
Reminder

Time
[ 08:00 AM ]

Schedule
[ Daily ▼ ]

[ SAVE REMINDER ]
```

---

# 8. Reminder Experience

When a reminder triggers:

```text
+--------------------------------+
|                                |
|      MEDICATION REMINDER       |
|                                |
|      Blood Pressure Medicine   |
|                                |
|      8:00 AM                   |
|                                |
|      Voice reminder active     |
|                                |
|       [ TAKEN ]                |
|                                |
|       [ SNOOZE ]               |
|                                |
|       [ SKIP ]                 |
|                                |
+--------------------------------+
```

The screen should make the available actions immediately obvious.

---

# 9. Taken Action

When the user selects Taken:

```text
Reminder
   ↓
TAKEN
   ↓
Save Dose Event Locally
   ↓
Update History
   ↓
Queue Sync if required
   ↓
Success Feedback
```

Example:

```text
✓ Medicine marked as taken.

[ DONE ]
```

---

# 10. Snooze Action

Snooze should provide a clear next reminder time.

Example:

```text
Snooze Reminder

Remind me again in:

[ 10 minutes ]

[ 30 minutes ]

[ CUSTOM ]

[ CANCEL ]
```

The selected snooze operation must update the local reminder state.

---

# 11. Skip Action

Skip is an explicit user action.

Example:

```text
Skip this reminder?

Your medication history will record
this reminder as skipped.

[ CANCEL ]   [ SKIP ]
```

The application must not provide medical advice about whether skipping medication is medically appropriate.

---

# 12. Medication History

History should provide an understandable record.

Example:

```text
Medication History

Today

✓ 8:00 AM
Blood Pressure Medicine
Taken

⏰ 1:00 PM
Vitamin
Snoozed

○ 8:00 PM
Other Medicine
Skipped
```

---

# 13. Adherence Summary

The application may provide organizational adherence summaries.

Examples:

```text
Today's Reminders
8 total

Taken
6

Snoozed
1

Skipped
1
```

The application must not interpret these statistics as a clinical diagnosis.

---

# 14. Refill Reminders

Where configured, refill functionality can show:

```text
Refill Reminder

Blood Pressure Medicine

Remaining:
5 doses

Refill reminder:
Tomorrow

[ VIEW MEDICINE ]
```

The feature is organizational and must not provide clinical recommendations.

---

# 15. Caregiver UX

Caregiver access requires explicit authorization.

Example:

```text
Caregiver

Family Member
Status: Authorized

Permissions:
✓ View reminders
✓ View history

[ MANAGE ACCESS ]
```

The interface should make authorization status clear.

---

# 16. Settings

Settings may include:

```text
Accessibility
Voice
Vibration
Notifications
Profile
Caregiver Access
Privacy
Terms
Help
Feedback
About
```

---

# 17. Voice Interaction

Voice should be available as an interaction method.

Example:

```text
Listening...

You can say:

"Taken"
"Snooze"
"Skip"

[ TAKEN ]
[ SNOOZE ]
[ SKIP ]

[ CANCEL ]
```

The touch controls remain available.

---

# 18. Visual + Voice Redundancy

The reminder experience should combine:

```text
Sound / Voice
      +
Visual Information
      +
Vibration
      +
Large Touch Controls
```

Not every user will use every modality.

---

# 19. Offline UX

When offline:

```text
OFFLINE

Your local reminders continue to work.

Medication actions will sync
when connection is available.
```

Critical reminder actions remain usable.

---

# 20. Sync UX

Example:

```text
Sync pending

2 medication actions are waiting
to synchronize.

They will sync automatically
when you are online.
```

---

# 21. Error UX

Errors should be simple and actionable.

Example:

```text
Unable to synchronize.

Your local medication information
is still saved.

[ TRY AGAIN ]
```

---

# 22. Permission UX

Permission requests should explain why access is needed.

Example:

```text
Microphone Access

Medicare uses the microphone only
when you use voice commands.

[ ALLOW ]
[ NOT NOW ]
```

If permission is denied, touch interaction remains available.

---

# 23. Accessibility UX

Users should be able to configure:

- Text size.
- Contrast.
- Voice reminders.
- Vibration.
- Other approved accessibility options.

Accessibility settings should not make critical actions inaccessible.

---

# 24. Navigation UX

Navigation should avoid unnecessary depth.

Preferred:

```text
Home
 ├── Medicines
 ├── History
 ├── Caregiver
 └── Settings
```

Avoid long chains of nested screens.

---

# 25. Safety UX

The interface must never imply that Medicare is a doctor or clinical decision system.

Avoid:

```text
Recommended dosage
Medical diagnosis
Treatment recommendation
```

Use configured user/caregiver medication information only.

---

# 26. UX Acceptance Criteria

The UX is acceptable when:

- A senior user can identify the next reminder.
- Medication actions are clearly visible.
- Voice has visible fallback controls.
- Offline status is understandable.
- Errors explain what to do next.
- Destructive actions require confirmation.
- Accessibility settings are available.
- Important information does not rely on color alone.
- Navigation remains simple.
- No clinical advice is generated.

---

# 27. UX Principle

> **The user should never have to guess what Medicare wants them to do next.**
