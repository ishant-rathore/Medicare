# Medicare – Voice Reminders for Senior Citizens

<div align="center">

![Medicare Logo](assets/logos/logo.png)

**Offline-first Android medication reminder application designed for senior citizens**

[![Flutter CI](https://github.com/your-org/medicare/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/your-org/medicare/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/your-org/medicare/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/your-org/medicare/actions/workflows/backend-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 1. Project Title
**Medicare – Voice Reminders for Senior Citizens Medication**

## 2. Project Description
**Medicare** is a voice-enabled, offline-first Android application that helps senior citizens manage their daily medication routines. Built with accessibility as a first-class concern, it provides reliable alarm-based reminders, complete crud for medicines, and caregiver support.

## 3. Problem Statement
Senior citizens often struggle with complex digital interfaces and rely heavily on caregivers for medication management. Existing reminder applications are visually dense, rely heavily on internet connectivity, and lack intuitive voice interactions, leading to missed doses and medication non-adherence among the elderly.

## 4. Objectives
- Improve medication adherence among senior citizens through accessible technology.
- Provide reliable, offline-first reminders that work without an internet connection.
- Enable caregivers to remotely monitor and support medication schedules.
- Create an interface that accommodates visual and motor impairments common in the elderly demographic.

## 5. Key Features
- 🔔 **Reliable Alarm-Based Reminders** — Works entirely offline; no internet required for critical reminder path
- 💊 **Medicine Management** — Complete CRUD for medicines with visual pill identification
- 📊 **Dose History & Adherence** — Track taken, snoozed, skipped, and missed doses
- 👨‍👩‍👧 **Caregiver Support** — Family members can monitor adherence remotely

## 6. Senior-Citizen Accessibility Features
- ♿ **Senior-Friendly UI** — Large fonts, high contrast, minimal navigation, large touch targets
- Screen reader support integrated across all screens

## 7. Voice Reminder Functionality
- 🗣️ **Voice Announcements** — Speaks medicine name, dosage, and instructions using Text-to-Speech
- 🎤 **Voice Commands** — Optional speech-to-text for hands-free interaction

## 8. Offline-First Architecture
- 📶 **Offline-First Sync** — Uses local SQLite databases to ensure the reminder engine works offline. Synchronizes to a PostgreSQL cloud database when connectivity is restored.

## 9. Technology Stack
- **Frontend:** Flutter, Dart
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** SQLite (Local), PostgreSQL (Cloud)
- **Deployment:** Docker, CI/CD

## 10. Architecture Overview
```
Flutter App (Android)
  ↓
Presentation Layer (Riverpod + Pages + Widgets)
  ↓
Domain Layer (Entities + Use Cases + Repository Interfaces)
  ↓
Data Layer (Repository Implementations)
  ├── Local: SQLite (sqflite) ← Primary offline source of truth
  └── Remote: REST API (Dio)
  ↓
Services Layer
  ├── Reminder Engine (android_alarm_manager_plus)
  ├── TTS Service (flutter_tts)
  ├── STT Service (speech_to_text)
  └── Sync Service (background worker)
```

## 11. Repository Structure
```
medicare/
├── .github/           # GitHub Actions, Issue Templates, PR Templates
├── assets/            # Icons, Images, Logos, Wireframes, Screenshots
├── backend/           # Node.js + Express + TypeScript API
├── database/          # Migrations, Seeds, Schema Definitions
├── diagrams/          # Architecture, DB, API, Flow Diagrams
├── docs/              # Complete Project Documentation (01 to 15)
├── evidence/          # CEP Fieldwork, Feedback, Test Results
├── frontend/          # Flutter Android Application
├── scripts/           # Setup, Database, Deployment Scripts
└── tests/             # Frontend, Backend, Integration, Accessibility Tests
```

## 12. Setup Instructions
### Prerequisites
- Flutter SDK ≥ 3.22.0
- Node.js ≥ 20.0.0
- PostgreSQL ≥ 15

### Cloning & Setup
```bash
git clone https://github.com/your-org/medicare.git
cd medicare
```

## 13. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure that variables for the database URL and API keys are populated. Never commit the actual `.env` file.

## 14. Development Commands
### Backend
```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
flutter pub get
flutter run
```

## 15. Testing Commands
```bash
# Backend tests
cd backend && npm test

# Frontend widget and unit tests
cd frontend && flutter test
```

## 16. Build Instructions
Use the provided build scripts for complete system compilation.
```bash
./scripts/deployment/build.sh
```

## 17. Deployment Information
Refer to `docs/10-deployment/deployment-guide.md` for instructions on deploying the application using Docker and CI/CD pipelines.

## 18. Security/Privacy Notes
- Firebase Authentication — server-side token verification
- Resource ownership checks — users can only access their own data
- See `docs/09-security/security-and-privacy.md` for more details.

## 19. CEP/Community Engagement
This project serves as a comprehensive Community Engagement Project (CEP). Documentation regarding study plans, interview questionnaires, consent forms, and evaluation results are tracked in the `docs/12-community-engagement/` and `evidence/` directories. Note that real user data remains strictly protected and anonymized.

## 20. Documentation Index
Refer to the complete [Documentation Index](./docs/README.md) for navigation through all 15 documentation modules.

## 21. Current Project Status
- Ready for active development and field testing. Baseline MVP functionalities are implemented.

## 22. Limitations
- Offline Sync is limited to eventual consistency when returning online.
- Voice recognition depends heavily on Google Speech Services which may not accurately detect heavy accents or dialects without internet.

## 23. Future Scope
- Integration with smart pillboxes.
- Expansion to iOS ecosystem.
- Machine learning insights for caregiver anomaly detection.

## 24. Contributors
- [Your Name] / [Team Name] - Core Developers and Researchers

## 25. License
MIT License — see [`LICENSE`](LICENSE)

---
*Making medication management simple, reliable, and accessible for every senior citizen.*
