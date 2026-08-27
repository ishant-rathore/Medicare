# Reminder Lifecycle – Medicare

## Complete Reminder Flow

```
MEDICINE CREATED
      │
      ▼
REMINDER SCHEDULED
(User sets time + frequency)
      │
      ▼
SAVED TO SQLITE
(reminders table)
      │
      ▼
ALARM SCHEDULED
(android_alarm_manager_plus)
      │
      ▼
ALARM FIRES
(system calls AlarmReceiver)
      │
      ▼
NOTIFICATION TRIGGERED
(flutter_local_notifications)
      │
    ┌─┴──────────────────────────────────────────────┐
    │                                                │
    ▼                                                ▼
USER SEES NOTIFICATION                    USER MISSES NOTIFICATION
(foreground or background)                (app in background/killed)
    │                                                │
    ▼                                                ▼
FULL-SCREEN ALARM MODAL               MISSED DOSE TIMEOUT (15 min)
(TTS announcement plays)               (MissedDoseManager fires)
    │                                                │
    ├──────────────┬───────────────────┐             │
    ▼              ▼                   ▼             ▼
TAKEN          SNOOZED              SKIPPED        MISSED
    │              │                   │             │
    ▼              ▼                   ▼             ▼
DoseEvent      DoseEvent           DoseEvent     DoseEvent
(taken)        (snoozed)          (skipped)     (missed)
    │              │                   │             │
    ▼              ▼                   ▼             ▼
SQLITE         SNOOZE ALARM         SQLITE        SQLITE
(immediate)    RESCHEDULE           (immediate)   (immediate)
    │          (10 min default)          │             │
    ▼              │                   ▼             ▼
SYNC QUEUE     SQLITE             SYNC QUEUE    SYNC QUEUE
(enqueue)      (snoozed)          (enqueue)     (enqueue)
                   │
                   ▼
              RE-FIRE IN 10 MIN
              (full cycle repeats)
```

## Alarm Scheduling Details

### Daily Reminder
```
Schedule for today at HH:MM
    → AlarmScheduler.scheduleDaily(reminderId, hour, minute)
    → android_alarm_manager_plus.periodic(duration: 24h)
    → Each fire: AlarmReceiver.onAlarm(reminderId)
```

### One-Time Reminder
```
Schedule for specific date/time
    → AlarmScheduler.scheduleOneShot(reminderId, dateTime)
    → android_alarm_manager_plus.oneShot(at: dateTime)
    → On fire: AlarmReceiver.onAlarm(reminderId)
    → After action: alarm not rescheduled
```

### Recurring (Weekly/Alternate Days)
```
RecurrenceCalculator.nextOccurrence(reminder)
    → Calculate next valid date
    → AlarmScheduler.scheduleOneShot(reminderId, nextDateTime)
    → On fire: AlarmReceiver.onAlarm(reminderId)
    → After action: calculate next + reschedule
```

### Multiple Times Per Day
```
Medicine: [08:00 AM, 02:00 PM, 08:00 PM]
    → 3 separate reminders created
    → 3 separate alarms scheduled
    → Each has unique reminderId
```

## Snooze Flow

```
User taps SNOOZE (default 10 minutes)
    │
    ▼
SnoozeManager.snooze(doseEventId, snoozeMinutes)
    │
    ▼
Update DoseEvent.status = 'snoozed'
Update DoseEvent.snoozeUntil = now + snoozeMinutes
    │
    ▼
Save to SQLite
    │
    ▼
Cancel current notification
    │
    ▼
Schedule new one-shot alarm at snoozeUntil time
    │
    ▼
When alarm fires → same full reminder flow
```

## Missed Dose Handling

```
MissedDoseManager runs every 5 minutes (background isolate)
    │
    ▼
Query SQLite: reminders WHERE status = 'pending'
              AND scheduledTime < NOW - 15 minutes
    │
    ▼
For each: update status = 'missed'
    │
    ▼
Enqueue to sync queue
    │
    ▼
Notify caregiver (if caregiver notifications enabled)
    via FCM push notification to caregiver's device
```

## Device Reboot Recovery

```
Android BroadcastReceiver: BOOT_COMPLETED
    │
    ▼
Query SQLite: all active reminders
    │
    ▼
For each active reminder:
    ReminderStateManager.recoverAlarm(reminder)
    │
    ▼
AlarmScheduler.reschedule(reminder)
```

## State Machine

```
SCHEDULED → FIRED → TAKEN
SCHEDULED → FIRED → SNOOZED → RE-FIRED → TAKEN
SCHEDULED → FIRED → SNOOZED → RE-FIRED → MISSED
SCHEDULED → FIRED → SKIPPED
SCHEDULED → MISSED (timeout without user action)
SCHEDULED → CANCELLED (user deletes medicine/reminder)
```

## Voice Announcement

When alarm fires:
```
AlarmReceiver.onAlarm()
    │
    ▼
Build voice script:
  "Time to take your [Medicine Name].
   [Dosage] [Medicine Type].
   [Meal Timing instruction].
   [Any special notes]."
    │
    ▼
TTSService.speak(script, language: userLanguage)
    │
    ▼
If TTS fails → notification-only fallback
    │
    ▼
Vibration (if enabled in accessibility settings)
    │
    ▼
Screen wake lock (if full-screen alarm enabled)
```
