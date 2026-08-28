# Medicare — Wireframes

## Voice Reminders for Senior Citizen Medications

**Version:** 1.0  
**Wireframe Type:** Low-fidelity structural reference

---

# 1. Wireframe Purpose

These wireframes define the structural layout of major Medicare screens.

They focus on:

- Information hierarchy.
- Navigation.
- Accessibility.
- Primary actions.
- Voice interaction.
- Reminder interaction.
- Offline states.

They are not final visual designs.

---

# 2. Welcome Screen

```text
+--------------------------------------+
|                                      |
|             MEDICARE                 |
|                                      |
|     Voice Reminders for              |
|     Senior Citizen Medications       |
|                                      |
|     Simple medication reminders      |
|     with voice + visual support.     |
|                                      |
|                                      |
|          [ GET STARTED ]             |
|                                      |
|          [ SIGN IN ]                 |
|                                      |
+--------------------------------------+
```

---

# 3. Home Screen

```text
+--------------------------------------+
| Medicare                         ⚙   |
+--------------------------------------+
|                                      |
| Hello                                |
|                                      |
| NEXT REMINDER                        |
|                                      |
| +----------------------------------+ |
| | Blood Pressure Medicine          | |
| | 8:00 AM                          | |
| |                                  | |
| | [ VIEW REMINDER ]                | |
| +----------------------------------+ |
|                                      |
| TODAY                                |
|                                      |
| ✓ 7:00 AM  Medicine A — Taken        |
| ⏰ 8:00 AM  Medicine B — Upcoming     |
|                                      |
|                                      |
|       [ + ADD MEDICINE ]             |
|                                      |
+--------------------------------------+
| Home | Medicines | History | More    |
+--------------------------------------+
```

---

# 4. Medicine List

```text
+--------------------------------------+
| <  Medicines                         |
+--------------------------------------+
|                                      |
| +----------------------------------+ |
| | Blood Pressure Medicine          | |
| | Morning                          | |
| | 8:00 AM                          | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Vitamin                           | |
| | Evening                          | |
| | 8:00 PM                          | |
| +----------------------------------+ |
|                                      |
|                                      |
|       [ + ADD MEDICINE ]             |
|                                      |
+--------------------------------------+
```

---

# 5. Medicine Details

```text
+--------------------------------------+
| <  Medicine Details                  |
+--------------------------------------+
|                                      |
| Blood Pressure Medicine              |
|                                      |
| Dose Information                     |
| Configured information               |
|                                      |
| Reminder                             |
| 8:00 AM                              |
| Daily                                |
|                                      |
| Status                               |
| Active                               |
|                                      |
| [ EDIT ]                             |
|                                      |
| [ DEACTIVATE ]                       |
|                                      |
+--------------------------------------+
```

---

# 6. Add Medicine

```text
+--------------------------------------+
| <  Add Medicine                      |
+--------------------------------------+
|                                      |
| Medicine Name                        |
| +----------------------------------+ |
| |                                  | |
| +----------------------------------+ |
|                                      |
| Dose Information                     |
| +----------------------------------+ |
| |                                  | |
| +----------------------------------+ |
|                                      |
| Notes                                |
| +----------------------------------+ |
| |                                  | |
| |                                  | |
| +----------------------------------+ |
|                                      |
|            [ SAVE ]                  |
|                                      |
+--------------------------------------+
```

---

# 7. Add Reminder

```text
+--------------------------------------+
| <  Add Reminder                      |
+--------------------------------------+
|                                      |
| Medicine                             |
| Blood Pressure Medicine              |
|                                      |
| Time                                 |
| +----------------------------------+ |
| | 08:00 AM                         | |
| +----------------------------------+ |
|                                      |
| Schedule                             |
| +----------------------------------+ |
| | Daily                         ▼  | |
| +----------------------------------+ |
|                                      |
|              [ SAVE ]                |
|                                      |
+--------------------------------------+
```

---

# 8. Schedule Selection

```text
+--------------------------------------+
| <  Schedule                          |
+--------------------------------------+
|                                      |
| Choose schedule                      |
|                                      |
| ○ Daily                              |
|                                      |
| ○ Weekly                             |
|                                      |
| ○ Alternate-day                      |
|                                      |
| ○ Custom                             |
|                                      |
| ○ Every-X-hours                      |
|                                      |
|              [ SAVE ]                |
+--------------------------------------+
```

---

# 9. Medication Reminder

```text
+--------------------------------------+
|                                      |
|       MEDICATION REMINDER             |
|                                      |
|                                      |
|       Blood Pressure Medicine        |
|                                      |
|              8:00 AM                 |
|                                      |
|       Your reminder is due.          |
|                                      |
|                                      |
|        +--------------------+        |
|        |       TAKEN        |        |
|        +--------------------+        |
|                                      |
|        +--------------------+        |
|        |      SNOOZE        |        |
|        +--------------------+        |
|                                      |
|        +--------------------+        |
|        |       SKIP         |        |
|        +--------------------+        |
|                                      |
+--------------------------------------+
```

---

# 10. Voice Listening Screen

```text
+--------------------------------------+
|                                      |
|          LISTENING...                |
|                                      |
|              🎙                      |
|                                      |
|      Say one of these commands:      |
|                                      |
|            "Taken"                   |
|            "Snooze"                  |
|            "Skip"                    |
|                                      |
|        +--------------------+        |
|        |       TAKEN        |        |
|        +--------------------+        |
|                                      |
|        +--------------------+        |
|        |      SNOOZE        |        |
|        +--------------------+        |
|                                      |
|        +--------------------+        |
|        |       SKIP         |        |
|        +--------------------+        |
|                                      |
|            [ CANCEL ]                |
|                                      |
+--------------------------------------+
```

---

# 11. Snooze Selection

```text
+--------------------------------------+
|        SNOOZE REMINDER               |
+--------------------------------------+
|                                      |
| Remind me again in:                  |
|                                      |
| +----------------------------------+ |
| | 10 minutes                       | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | 30 minutes                       | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Custom                           | |
| +----------------------------------+ |
|                                      |
|            [ CANCEL ]                |
+--------------------------------------+
```

---

# 12. Skip Confirmation

```text
+--------------------------------------+
|                                      |
|       Skip this reminder?            |
|                                      |
|   This reminder will be recorded     |
|   as skipped.                        |
|                                      |
|                                      |
| [ CANCEL ]          [ SKIP ]         |
|                                      |
+--------------------------------------+
```

---

# 13. Taken Confirmation

```text
+--------------------------------------+
|                                      |
|               ✓                      |
|                                      |
|        Medicine marked               |
|        as taken.                     |
|                                      |
|             [ DONE ]                 |
|                                      |
+--------------------------------------+
```

---

# 14. Medication History

```text
+--------------------------------------+
| <  Medication History                |
+--------------------------------------+
|                                      |
| TODAY                                |
|                                      |
| ✓  8:00 AM                           |
|    Blood Pressure Medicine           |
|    Taken                             |
|                                      |
| ⏰  1:00 PM                           |
|    Vitamin                           |
|    Snoozed                           |
|                                      |
| ○  8:00 PM                           |
|    Medicine C                        |
|    Skipped                           |
|                                      |
+--------------------------------------+
```

---

# 15. Adherence Summary

```text
+--------------------------------------+
| Adherence Summary                    |
+--------------------------------------+
|                                      |
| TODAY                                |
|                                      |
| Total reminders          8           |
|                                      |
| Taken                    6           |
| Snoozed                  1           |
| Skipped                  1           |
|                                      |
|                                      |
| This information is a reminder      |
| summary, not medical advice.         |
|                                      |
+--------------------------------------+
```

---

# 16. Refill Reminder

```text
+--------------------------------------+
|          REFILL REMINDER             |
+--------------------------------------+
|                                      |
| Blood Pressure Medicine              |
|                                      |
| Remaining: 5 doses                   |
|                                      |
| Refill reminder: Tomorrow            |
|                                      |
|        [ VIEW MEDICINE ]             |
|                                      |
+--------------------------------------+
```

---

# 17. Caregiver Screen

```text
+--------------------------------------+
| <  Caregiver                         |
+--------------------------------------+
|                                      |
| Authorized Caregiver                 |
|                                      |
| Status: Authorized                   |
|                                      |
| Permissions                          |
| ✓ View reminders                     |
| ✓ View medication history            |
|                                      |
|                                      |
| [ MANAGE ACCESS ]                    |
|                                      |
+--------------------------------------+
```

---

# 18. Revoke Caregiver

```text
+--------------------------------------+
|                                      |
|      Revoke caregiver access?        |
|                                      |
| This will remove their authorized    |
| access to your Medicare data.        |
|                                      |
| [ CANCEL ]       [ REVOKE ]          |
|                                      |
+--------------------------------------+
```

---

# 19. Settings

```text
+--------------------------------------+
| Settings                             |
+--------------------------------------+
|                                      |
| Accessibility                    >   |
| Voice                             >   |
| Vibration                         >   |
| Notifications                     >   |
| Profile                           >   |
| Caregiver Access                  >   |
| Privacy                           >   |
| Help                              >   |
| Terms                             >   |
| Feedback                           >   |
| About                             >   |
|                                      |
+--------------------------------------+
```

---

# 20. Accessibility Settings

```text
+--------------------------------------+
| <  Accessibility                     |
+--------------------------------------+
|                                      |
| Text Size                            |
|                                      |
| ○ Standard                           |
| ○ Large                              |
| ○ Extra Large                        |
|                                      |
| High Contrast                        |
| [ ON / OFF ]                         |
|                                      |
| Voice Reminders                      |
| [ ON / OFF ]                         |
|                                      |
| Vibration                            |
| [ ON / OFF ]                         |
|                                      |
+--------------------------------------+
```

---

# 21. Offline State

```text
+--------------------------------------+
| OFFLINE                              |
+--------------------------------------+
|                                      |
| Your reminders still work            |
| on this device.                      |
|                                      |
| Medication actions will sync         |
| when you are online.                 |
|                                      |
| Sync pending: 2                      |
|                                      |
+--------------------------------------+
```

---

# 22. Sync Error

```text
+--------------------------------------+
| Sync Status                          |
+--------------------------------------+
|                                      |
| Unable to synchronize.               |
|                                      |
| Your local medication information    |
| is still saved.                      |
|                                      |
|          [ TRY AGAIN ]               |
|                                      |
+--------------------------------------+
```

---

# 23. Empty Medicine State

```text
+--------------------------------------+
| Medicines                            |
+--------------------------------------+
|                                      |
|                                      |
|        No medicines added yet.       |
|                                      |
|   Add your first medicine to         |
|   create medication reminders.       |
|                                      |
|        [ ADD MEDICINE ]              |
|                                      |
+--------------------------------------+
```

---

# 24. Loading State

```text
+--------------------------------------+
|                                      |
|                                      |
|              Loading...              |
|                                      |
|             Please wait.             |
|                                      |
+--------------------------------------+
```

---

# 25. Error State

```text
+--------------------------------------+
|                                      |
|        Something went wrong.        |
|                                      |
|   Please try again.                  |
|                                      |
|          [ TRY AGAIN ]               |
|                                      |
+--------------------------------------+
```

---

# 26. Permission Explanation

```text
+--------------------------------------+
| Microphone Access                    |
+--------------------------------------+
|                                      |
| Medicare uses the microphone only   |
| when you use voice commands.         |
|                                      |
|                                      |
| [ NOT NOW ]       [ ALLOW ]          |
|                                      |
+--------------------------------------+
```

---

# 27. Screen Design Rules

Every important screen should provide:

```text
Clear Title
     ↓
Important Information
     ↓
Primary Action
     ↓
Secondary Action
     ↓
Fallback / Navigation
```

---

# 28. Reminder Screen Priority

The reminder screen must prioritize:

```text
1. Medicine
2. Reminder status
3. Voice feedback
4. Taken
5. Snooze
6. Skip
```

Do not bury the primary actions in menus.

---

# 29. Accessibility Rules

Wireframes must support:

- Large readable text.
- High contrast.
- Large touch targets.
- Screen readers.
- Voice feedback.
- Vibration.
- Text labels with icons.
- Visible fallback controls.

---

# 30. Wireframe Acceptance Criteria

- [ ] Core screens are represented.
- [ ] Reminder interaction is clear.
- [ ] Taken/Snooze/Skip are visible.
- [ ] Voice interaction has touch fallback.
- [ ] Offline state is represented.
- [ ] Sync state is represented.
- [ ] Empty state is represented.
- [ ] Error state is represented.
- [ ] Loading state is represented.
- [ ] Caregiver authorization is represented.
- [ ] Accessibility settings are represented.
- [ ] Destructive actions use confirmation.

---

# 31. Wireframe Principle

> **Every screen should make the next action obvious to a senior user.**
