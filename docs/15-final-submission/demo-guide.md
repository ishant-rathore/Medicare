# Medicare — Final Demo Guide

## Demo Objective

Demonstrate the approved Medicare journey from medicine configuration to local reminder execution, dose acknowledgement, history and synchronization. The demo must emphasize senior-first accessibility, voice + visual redundancy and offline reliability.

## Recommended Demo Sequence

### 1. Introduce the Problem

Explain that Medicare is a medication reminder and organization tool for senior citizens, designed to make reminders loud, visible, understandable and easy to acknowledge.

### 2. Onboarding and Profile

- Launch Medicare.
- Show onboarding.
- Sign in/register.
- Select language and accessibility preferences.

### 3. Add Medicine

- Open **Medicines**.
- Add a representative medicine using non-sensitive demo data.
- Show dosage and optional identification fields.
- Save.

### 4. Schedule Reminder

- Configure a near-future reminder.
- Explain recurrence options.
- Confirm it is stored locally.

### 5. Demonstrate Reminder

At the scheduled time show:

- Android alarm/notification.
- Full-screen reminder.
- Medicine information.
- Voice/TTS reminder.
- Vibration/visual cues where enabled.
- Large **Taken / Snooze / Skip** actions.

### 6. Demonstrate Dose Action

Select **Taken** and show that the dose event is reflected in local history.

### 7. Demonstrate Offline Mode

- Disable network connectivity.
- Trigger another configured reminder.
- Show that local reminder execution continues.
- Use Taken/Snooze/Skip.
- Show pending synchronization state.

### 8. Demonstrate Synchronization

- Restore connectivity.
- Synchronize pending changes.
- Explain stable local event identity and duplicate prevention.

### 9. Demonstrate Caregiver Support

Where implemented in the build:

- Show explicit caregiver authorization.
- Show permitted status/alert behavior.
- Explain that access is scoped and revocable.

### 10. Accessibility

Briefly show:

- larger text;
- high contrast;
- large touch targets;
- voice settings;
- visible fallback controls.

## Safety Statement for Demo

Clearly state:

> Medicare does not diagnose, prescribe, change medication dosage/frequency or provide clinical advice. It reminds users using information entered by the user/caregiver.

## Demo Data Rule

Use synthetic/demo medication information for presentation unless actual participant data is explicitly authorized and appropriately protected. Never expose credentials, tokens, private participant data or production secrets.

## Evidence Rule

Do not claim community trial outcomes, usability scores, reminder success percentages or deployment results unless they have been actually measured and documented.
