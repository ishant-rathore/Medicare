# Medicare — Release Notes

## Current Documentation Baseline

**Date:** 28 Aug 2026  
**Status:** Documentation baseline updated

### Documentation Improvements

- Completed the project proposal documentation.
- Added API request/response examples and offline synchronization examples.
- Completed security and privacy guidance.
- Added deployment guide, operations runbook and troubleshooting guidance.
- Added testing plan, test cases, offline testing, voice testing, accessibility testing and Android device matrix.
- Added an evidence-aware test report template.
- Added caregiver guide, FAQ, installation guide and user manual.
- Added release checklist.

### Quality Boundaries

The documentation preserves the approved Medicare architecture:

```text
Flutter + Dart
SQLite local-first storage
Node.js + Express + TypeScript
PostgreSQL
Firebase Authentication
Firebase Cloud Messaging
Firebase Storage for optional private media
REST/JSON over HTTPS
```

The critical reminder path remains local:

```text
Local medicine data
→ local reminder schedule
→ Android alarm/notification
→ full-screen voice + visual reminder
→ Taken / Snooze / Skip
→ local dose history
→ synchronization when available
```

### Evidence Policy

Documentation now distinguishes planned verification from actual execution evidence. Community participants, locations, test results, usability scores and trial outcomes must be recorded only from real evidence.

### Not Included

This release does not claim that Firebase, PostgreSQL, SQLite or community trial evidence has been completed merely because documentation exists. Those implementation/integration results must be validated independently.
