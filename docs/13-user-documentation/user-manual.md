# Medicare — User Manual

## Welcome to Medicare

Medicare is a senior-friendly medication reminder and organization app built around one simple goal: when a medicine is due, make the reminder **loud, visible, understandable and easy to acknowledge**.

## 1. Start Medicare

Open the app and complete onboarding. Sign in or register, then complete the profile setup.

Choose your preferred language and accessibility settings during setup. You can change supported voice, text and accessibility preferences later in Settings.

## 2. Add a Medicine

1. Open **Medicines**.
2. Select **Add Medicine**.
3. Enter the medicine name and reminder dosage information.
4. Optionally add type, color, shape, photo, stock quantity and notes.
5. Save the medicine.

The medicine information is reminder/organization data entered by the user or caregiver. Medicare does not clinically verify or change it.

## 3. Schedule a Reminder

1. Open the medicine.
2. Choose **Schedule Reminder**.
3. Select time and recurrence.
4. Configure supported reminder/voice settings.
5. Save the schedule.

Supported recurrence includes daily, weekly, alternate-day and custom/every-X-hours patterns according to the configured implementation.

The reminder configuration is stored locally so that an already-configured reminder can execute without continuous internet connectivity.

## 4. When a Reminder Rings

At the scheduled time, the Android device can present a full-screen reminder with voice, visual information, sound and vibration according to configuration.

The screen provides three clear actions:

### TAKEN
Records the dose as taken.

### SNOOZE
Postpones the reminder and creates the next local trigger according to the configured snooze behavior.

### SKIP
Records that the dose was skipped.

The result is saved locally and can later synchronize with the cloud service.

## 5. Missed Dose

When there is no acknowledgement within the configured acknowledgement window, the dose may become **Missed**. If caregiver monitoring is enabled and authorized, a caregiver alert may be generated after the missed-dose condition is reached.

Medicare does not decide whether a user should take, stop or change medication beyond the reminder information configured by the user/caregiver.

## 6. View History

Open **History** to review medication activity such as Taken, Snoozed, Skipped and Missed events. Adherence summaries provide organizational information based on recorded events.

## 7. Caregiver Support

Caregiver features are optional.

A senior user explicitly authorizes a caregiver and can define permitted access. Authorization can be revoked. Caregiver access does not replace the senior user's own local reminder experience.

## 8. Voice Settings

Open **Settings → Voice** to configure supported:

- language/voice;
- speech speed;
- reminder volume;
- repeat count;
- family-recorded voice where enabled.

Voice is important but never the only way to act on a critical reminder. Visible Taken/Snooze/Skip controls remain available.

## 9. Accessibility

Medicare is designed for senior-first accessibility. Available settings may include:

- larger text;
- high contrast;
- dark mode;
- larger buttons;
- vibration;
- flashlight/visual alert support where enabled;
- screen-reader semantics.

Important status should not depend on color alone.

## 10. Offline Mode

Medicare is offline-first for the critical reminder path.

When there is no internet connection:

- local medicine data remains available;
- configured schedules remain available;
- Android local alarms can still trigger;
- voice/visual reminder behavior can continue according to device capabilities;
- Taken/Snooze/Skip actions are stored locally;
- changes wait in the pending sync queue.

When connectivity returns, the app can synchronize pending changes.

## 11. Refill Reminders

Where refill tracking is configured, remaining quantity and the configured threshold can be used to surface refill reminders.

## 12. Safety and Privacy

Medicare is not a diagnostic or clinical decision-support app. It does not diagnose, prescribe, recommend stopping medication, change dosage/frequency or silently modify medication instructions.

Only the information needed for enabled features should be collected. Caregiver monitoring, family voice recording and medicine photos are optional and should be used with appropriate authorization/consent.

## 13. Basic Troubleshooting

**Reminder did not appear:** Check Android notification/alarm settings, sound/vibration, battery/background restrictions and the local reminder schedule.

**Voice did not play:** Check device volume and TTS language/voice availability.

**Cloud data did not sync:** Check connectivity and authentication. Pending local actions should remain queued until successful synchronization.

**Caregiver cannot see status:** Verify the caregiver is authenticated and still has an active, authorized permission scope.

## 14. Quick Daily Flow

```text
Open Medicare
→ Review today's medicines
→ Wait for reminder
→ Hear/see reminder
→ TAKEN / SNOOZE / SKIP
→ Continue your day
→ Review history when needed
```

