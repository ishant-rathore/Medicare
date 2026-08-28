# Medicare — Accessibility Testing

## Objective

Verify that Medicare remains usable for senior citizens with reduced vision, hearing, memory, motor precision or digital familiarity. Accessibility is a core reliability requirement, not a cosmetic enhancement. The approved design baseline uses large typography, high contrast, oversized touch targets, simple navigation, voice plus visual redundancy and visible fallbacks. fileciteturn0file12

## Accessibility Test Matrix

| ID | Area | Test | Expected Result |
|---|---|---|---|
| A11Y-01 | Typography | Increase Android system font size | Critical content remains readable without clipping or overlap |
| A11Y-02 | Contrast | Enable high-contrast presentation | Text and controls remain clearly distinguishable |
| A11Y-03 | Dark mode | Enable dark mode | Semantic meaning and contrast remain clear |
| A11Y-04 | Touch | Tap critical actions with reduced precision | Taken/Snooze/Skip can be selected confidently |
| A11Y-05 | Labels | Inspect icon-only actions | Critical controls have visible text labels where practical |
| A11Y-06 | Screen reader | Navigate reminder screen with TalkBack/screen reader | Medicine, time, dosage and actions are announced meaningfully |
| A11Y-07 | Status | Review Taken/Pending/Missed/Skipped | Status is communicated with text and/or icon, not color alone |
| A11Y-08 | Voice fallback | Disable/fail TTS or STT | Visible reminder and actions remain available |
| A11Y-09 | Hearing support | Reduce device auditory attention | Vibration/visual/full-screen cues remain available as configured |
| A11Y-10 | Navigation | Complete core task from Home | Core medication tasks require minimal navigation |
| A11Y-11 | Form usability | Add medicine with enlarged text | Fields remain usable and entered data is not lost |
| A11Y-12 | Error states | Trigger validation/network errors | Clear plain-language recovery guidance is shown |
| A11Y-13 | Reminder | Receive due reminder | Reminder is loud, visible, understandable and easy to acknowledge |
| A11Y-14 | Offline | Disable network | Already-configured reminder continues to operate locally |

## Senior-First Acceptance Criteria

A critical screen passes when:

- the next action is obvious without technical knowledge;
- critical medicine information is readable at enlarged text sizes;
- important status is not communicated by color alone;
- primary actions have generous touch targets;
- voice is useful but not mandatory for completing safety-critical actions;
- navigation remains shallow and predictable;
- error/recovery states are understandable;
- the reminder remains functional without internet connectivity.

## Test Evidence Template

| Test ID | Device / Android | Font Scale | Result | Evidence | Defect |
|---|---|---|---|---|---|
| A11Y-01 | [actual] | [actual] | [PASS/FAIL] | [screenshot/video] | [ID/None] |
| A11Y-04 | [actual] | [actual] | [PASS/FAIL] | [observation] | [ID/None] |
| A11Y-06 | [actual] | [actual] | [PASS/FAIL] | [TalkBack evidence] | [ID/None] |
| A11Y-13 | [actual] | [actual] | [PASS/FAIL] | [device evidence] | [ID/None] |

Do not enter PASS results without actual execution evidence.
