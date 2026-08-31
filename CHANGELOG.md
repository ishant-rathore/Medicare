# Changelog

All notable changes to Medicare will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Complete Flutter Android application with offline-first architecture
- Node.js + Express + TypeScript modular backend
- SQLite local database with full CRUD
- PostgreSQL cloud database with Prisma ORM
- 14 feature modules (onboarding, auth, dashboard, medicines, reminders, voice, history, caregiver, refill, accessibility, settings, profile, support, notifications)
- Reminder engine with alarm scheduling, snooze, skip, missed dose handling
- Text-to-Speech (TTS) medication announcements
- Speech-to-Text (STT) voice command support
- Offline sync queue with idempotency and conflict resolution
- Firebase Authentication integration
- Firebase Cloud Messaging push notifications
- Caregiver access management
- Refill tracking and low-stock alerts
- Accessibility features (large fonts, high contrast, semantic labels)
- REST API with 12 modules and consistent response format
- GitHub Actions CI/CD pipelines
- Comprehensive test suite (unit, widget, integration, E2E)
- Complete documentation (PRD, SRS, TRD, API, database, security, deployment)
- AI-powered prescription scanner (Gemini API)
- Voice assistant companion (Gemini API)

---

## [0.1.0] - 2026-08-28

### Added
- Initial React/Vite web prototype (AI Studio demo)
- Prescription scanner with Gemini AI
- Voice assistant with Gemini AI
- LocalStorage-based data persistence
- Basic medicine management UI
- Basic reminder scheduling UI
- Dashboard with today's dose overview
- Emergency SOS modal
- Caregiver view (read-only)
- Medication history view
- Analytics dashboard
- Profile settings

---

[Unreleased]: https://github.com/your-org/medicare/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/medicare/releases/tag/v0.1.0
