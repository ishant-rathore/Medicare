<<<<<<< HEAD
# FAQ

=======
# Medicare — FAQ

## What is Medicare?

Medicare is an Android-first, senior-friendly medication reminder and organization application. It combines local alarms, voice reminders, high-contrast visuals and simple dose actions.

## Does Medicare need the internet for reminders?

No. Core reminders are designed to execute locally on the Android device using locally stored medication and schedule data. Internet connectivity is used for authentication, synchronization, caregiver visibility and other cloud-supported functions.

## What happens when I miss a reminder?

A reminder can become **Missed** after the configured acknowledgement window. Where caregiver support is explicitly enabled, a caregiver alert can be generated.

## What do Taken, Snooze and Skip mean?

**Taken** records that the user acknowledged the dose as taken. **Snooze** postpones the reminder and creates another local trigger according to the configured behavior. **Skip** explicitly records that the dose was skipped.

## Can a caregiver see my medicines automatically?

No. Caregiver access requires explicit authorization, scoped permissions and an active relationship. Access can be revoked.

## Can Medicare change my dosage or medication schedule automatically?

No. Medicare does not diagnose, prescribe, recommend stopping medication, change dosage/frequency or silently modify medication instructions.

## Does Medicare continuously listen to the microphone?

No. Voice input is active only during an explicitly approved voice-command or recording flow. Visible fallback controls remain available.

## Can I use voice reminders in my regional language?

Medicare supports configurable regional-language voice output subject to the languages and voices available through the device's TTS capabilities.

## What if voice recognition does not work?

The reminder should remain usable through the visible interface. Taken, Snooze and Skip controls are not dependent on voice recognition.

## Are family voice recordings required?

No. Family voice recordings are an optional feature and should be enabled only with appropriate authorization.

## Are medicine photos required?

No. Medicine photos are optional identification aids.

## Is Medicare a clinical or diagnostic app?

No. It is a medication reminder and organization tool, not a diagnostic, prescribing or clinical decision-support system.

## Where is my data stored?

SQLite stores the operational local data required for offline behavior. PostgreSQL is the canonical cloud database for synchronized application data. Firebase services support authentication, remote messaging and optional private media where enabled.

## How is synchronization protected?

Offline dose events use stable local event identifiers and server-side validation. Retrying an already accepted event must not create a duplicate. The server re-checks identity, ownership and valid state transitions.

## What should I do if reminders stop working?

Check Android notification/alarm permissions, sound/vibration settings, TTS availability and device battery/background restrictions. Then test a short future reminder with the network disabled to confirm the local reminder path.

## What information does Medicare collect?

The product follows data minimization: it should collect only information needed for medication reminders, organization, history and explicitly enabled support features. CEP reporting should use anonymous or aggregated observations where practical.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
