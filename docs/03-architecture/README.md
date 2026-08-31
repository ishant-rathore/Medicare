# 03 — Architecture

This section documents the Medicare system architecture, reminder lifecycle, voice architecture and offline synchronization model.

## Documents

- [System Architecture](system-architecture.md)
- [Reminder Lifecycle](reminder-lifecycle.md)
- [Voice Architecture](voice-architecture.md)
- [Offline Sync](offline-sync.md)

## Architecture Principle

The critical reminder path remains local: local medication data → local schedule → Android alarm/notification → full-screen voice + visual reminder → Taken/Snooze/Skip → local history. Cloud synchronization is secondary.
