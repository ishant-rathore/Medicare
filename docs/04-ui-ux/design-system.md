# Medicare — Design System

## Voice Reminders for Senior Citizen Medications

**Version:** 1.0  
**Platform:** Android / Flutter  
**Design Priority:** Accessibility, clarity, reliability, simplicity

---

## 1. Design Philosophy

Medicare is designed primarily for senior citizens.

The interface must prioritize:

- Simplicity
- Readability
- Accessibility
- Clear actions
- Large touch targets
- High contrast
- Voice + visual redundancy
- Minimal navigation
- Forgiving interactions
- Clear system feedback

The user should understand what is happening without needing technical knowledge.

---

# 2. Senior-First Principles

### Large and readable

Text must remain comfortably readable.

### Simple wording

Use familiar words instead of technical terminology.

### One clear decision

Important screens should focus on one primary task.

### Voice + visual redundancy

Voice must be supported by visual controls.

### Never rely on color alone

Status must also be communicated through:

- Text
- Icons
- Labels
- Shape
- Position

### Forgiving interaction

Users should have opportunities to:

- Cancel
- Go back
- Correct mistakes
- Confirm destructive actions

---

# 3. Typography

Typography should prioritize readability over visual decoration.

Recommended hierarchy:

| Level | Purpose |
|---|---|
| Display | Important reminder information |
| H1 | Main screen title |
| H2 | Section heading |
| H3 | Subsection heading |
| Body Large | Primary readable content |
| Body | Normal content |
| Label | Buttons and controls |
| Caption | Supporting information |

Avoid unnecessarily small text.

Important medication information should use larger typography.

---

# 4. Text Rules

Use:

```text
Take Medicine
```

instead of:

```text
Execute Medication Event
```

Use:

```text
Reminder due
```

instead of:

```text
Scheduled medication execution state
```

Use short, direct instructions.

---

# 5. Color Principles

Color must support comprehension rather than become the only source of meaning.

Important states should include text and/or icons.

Example:

```text
✓ Taken
⏰ Snoozed
○ Skipped
⚠ Sync pending
```

Color may reinforce the state but must not be the only indicator.

---

# 6. Contrast

The interface must maintain strong contrast between:

- Text and background
- Buttons and background
- Icons and background
- Important status indicators

Accessibility should be considered for every screen.

---

# 7. Buttons

Primary buttons should:

- Be large.
- Have clear labels.
- Have sufficient spacing.
- Be easy to tap.
- Use familiar wording.

Examples:

```text
TAKEN
SNOOZE
SKIP
SAVE
CANCEL
```

Avoid small icon-only controls for important actions.

---

# 8. Touch Targets

Interactive controls must have large touch areas suitable for senior users.

Important actions should be easy to activate without precise finger movement.

Avoid:

```text
Tiny icon
Tiny text link
Closely packed controls
```

Prefer:

```text
+---------------------------+
|                           |
|          TAKEN            |
|                           |
+---------------------------+
```

---

# 9. Icons

Icons should reinforce text.

Important actions should not depend on icons alone.

Example:

```text
✓  Taken
⏰  Snooze
→  Skip
```

The text label remains visible.

---

# 10. Cards

Cards may be used to group related information.

Example:

```text
+--------------------------------+
| Morning Medicine               |
|                                |
| 8:00 AM                        |
|                                |
| [ Taken ]                      |
+--------------------------------+
```

Cards should avoid excessive visual complexity.

---

# 11. Forms

Medication forms should be divided into understandable sections.

Example:

```text
Medicine Name
[_____________________]

Dose Information
[_____________________]

Reminder Time
[_____________________]

Schedule
[ Daily ▼ ]

[ SAVE MEDICINE ]
```

Use clear validation messages.

---

# 12. Error Messages

Errors should explain:

1. What happened.
2. What the user can do.

Example:

```text
Could not save medicine.

Please check the information
and try again.

[ TRY AGAIN ]
```

Avoid technical error messages.

---

# 13. Empty States

Empty screens should explain the next useful action.

Example:

```text
No medicines added yet.

Add your first medicine
to create reminders.

[ ADD MEDICINE ]
```

---

# 14. Loading States

Loading screens should communicate progress.

Example:

```text
Loading...
Please wait.
```

Do not leave the user staring at an unexplained blank screen.

---

# 15. Offline State

Offline status should be clear.

Example:

```text
OFFLINE

Your reminders will continue
to work on this device.
```

Synchronization status should be separately communicated.

---

# 16. Voice UI

Voice interaction must always show a visible state.

Example:

```text
Listening...

Say:

"Taken"
"Snooze"
"Skip"

[ CANCEL ]
```

Voice must never be the only interaction method.

---

# 17. Reminder Screen

The reminder screen should prioritize:

1. Medicine name.
2. Reminder information.
3. Voice feedback.
4. Primary actions.

Example:

```text
+--------------------------------+
|        MEDICATION REMINDER     |
|                                |
|        Blood Pressure          |
|                                |
|        8:00 AM                 |
|                                |
|   Your medicine reminder is    |
|   due now.                     |
|                                |
|       [ TAKEN ]                |
|                                |
|       [ SNOOZE ]               |
|                                |
|       [ SKIP ]                 |
+--------------------------------+
```

---

# 18. Navigation

Navigation should remain minimal.

Primary areas may include:

```text
Home
Medicines
History
Caregiver
Settings
```

The exact navigation must remain consistent with approved application flows.

---

# 19. Accessibility

The design system supports:

- Large text
- High contrast
- Large touch targets
- Screen readers
- Voice feedback
- Vibration
- Clear focus states
- Simple language
- Visible alternatives

---

# 20. Accessibility Settings

The application may expose settings for:

```text
Text Size
High Contrast
Voice Reminders
Vibration
Voice Commands
```

Settings must not remove essential fallback interaction.

---

# 21. Confirmation

Destructive operations require confirmation.

Example:

```text
Delete this medicine?

This action cannot be undone.

[ CANCEL ]   [ DELETE ]
```

---

# 22. Status Patterns

Recommended status pattern:

```text
Success:
✓ Completed

Pending:
⏳ Sync pending

Error:
⚠ Something went wrong

Offline:
○ Offline
```

Use multiple visual cues rather than color alone.

---

# 23. Consistency Rules

The following must remain consistent throughout Medicare:

- Button terminology
- Typography hierarchy
- Spacing
- Navigation
- Icons
- Status patterns
- Error patterns
- Confirmation dialogs
- Accessibility behavior
- Voice interaction behavior

---

# 24. Design Quality Checklist

Before approving a screen:

- [ ] Text is readable.
- [ ] Important information is obvious.
- [ ] Touch targets are large.
- [ ] Contrast is sufficient.
- [ ] Color is not the only status indicator.
- [ ] Voice has visible fallback.
- [ ] Errors are understandable.
- [ ] Loading state exists.
- [ ] Empty state exists where applicable.
- [ ] Offline state is clear.
- [ ] Destructive actions require confirmation.
- [ ] Screen-reader behavior is considered.

---

# 25. Design Principle

> **Make every important action easy to see, easy to understand, and easy to perform.**
