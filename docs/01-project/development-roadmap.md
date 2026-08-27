# Development Roadmap – Medicare

## Version 1.0 – MVP (Current)

### Sprint 1 – Foundation
- [x] Repository structure
- [x] Flutter project setup with clean architecture
- [x] SQLite local database
- [x] Medicine CRUD (add, edit, delete, view)
- [x] Domain entities and use cases
- [x] Basic UI theme (senior-friendly)

### Sprint 2 – Reminder Engine
- [x] Reminder scheduling (one-time, daily, recurring)
- [x] Android alarm manager integration
- [x] Local notification service
- [x] Full-screen reminder modal
- [x] Snooze, Skip, Taken actions
- [x] Dose event recording

### Sprint 3 – Voice System
- [x] Text-to-Speech medication announcements
- [x] Voice settings (language, speed, gender)
- [x] Speech-to-Text voice commands
- [x] Voice assistant integration (Gemini AI)

### Sprint 4 – Authentication & Backend
- [x] Firebase Authentication
- [x] Node.js + Express backend
- [x] PostgreSQL with Prisma
- [x] REST API (all 12 modules)
- [x] JWT/Firebase token middleware

### Sprint 5 – Sync & Caregiver
- [x] Offline sync queue
- [x] Sync coordinator and worker
- [x] Conflict resolution
- [x] Caregiver management
- [x] Caregiver access API

### Sprint 6 – Polish & Accessibility
- [x] Accessibility settings (font size, contrast, screen reader)
- [x] Refill tracking
- [x] Dose history and analytics
- [x] Prescription scanner (AI)
- [x] Emergency contacts and SOS

## Version 1.1 – Post-MVP

### Planned Features
- [ ] Apple iOS support
- [ ] Wearable integration (WearOS)
- [ ] Doctor/pharmacy portal (web dashboard)
- [ ] Medicine interaction checker
- [ ] WhatsApp caregiver notifications
- [ ] Multi-language full support (8 Indian languages)
- [ ] Offline AI voice assistant (on-device)
- [ ] Telemedicine integration

## Version 2.0 – Platform

### Long-term Vision
- [ ] Healthcare provider API
- [ ] Hospital system integration (HL7/FHIR)
- [ ] Automated prescription import from hospital systems
- [ ] Government ABDM (Ayushman Bharat Digital Mission) integration
- [ ] Community health worker dashboard
- [ ] Clinical trial participation tracking

---

## Release Schedule

| Version | Target Date | Focus |
|---------|------------|-------|
| 0.1.0 | 2026-08-28 | Web prototype (AI Studio demo) |
| 1.0.0-beta | 2026-09-15 | Core Android app |
| 1.0.0 | 2026-10-01 | Production release |
| 1.1.0 | 2026-12-01 | iOS + expanded features |
| 2.0.0 | 2027-06-01 | Platform expansion |
