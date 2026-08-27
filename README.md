# Medicare – Voice Reminders for Senior Citizens

<div align="center">

![Medicare Logo](assets/branding/logo.png)

**Offline-first Android medication reminder application designed for senior citizens**

[![Flutter CI](https://github.com/your-org/medicare/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/your-org/medicare/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/your-org/medicare/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/your-org/medicare/actions/workflows/backend-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📋 Project Overview

**Medicare** is a voice-enabled, offline-first Android application that helps senior citizens manage their daily medication routines. Built with accessibility as a first-class concern, it provides:

- 🔔 **Reliable Alarm-Based Reminders** — Works entirely offline; no internet required for critical reminder path
- 🗣️ **Voice Announcements** — Speaks medicine name, dosage, and instructions using Text-to-Speech
- 🎤 **Voice Commands** — Optional speech-to-text for hands-free interaction
- 💊 **Medicine Management** — Complete CRUD for medicines with visual pill identification
- 📊 **Dose History & Adherence** — Track taken, snoozed, skipped, and missed doses
- 👨‍👩‍👧 **Caregiver Support** — Family members can monitor adherence remotely
- 📶 **Offline-First Sync** — SQLite locally, syncs to PostgreSQL when connected
- ♿ **Senior-Friendly UI** — Large fonts, high contrast, minimal navigation, large touch targets

---

## 🏗️ Repository Structure

```
medicare/
├── frontend/          # Flutter Android Application
├── backend/           # Node.js + Express + TypeScript API
├── database/          # PostgreSQL & SQLite schemas
├── firebase/          # Firebase configuration
├── deployment/        # Docker, CI/CD, deployment scripts
├── tests/             # E2E, API, security, accessibility tests
├── scripts/           # Development & build scripts
├── docs/              # Complete project documentation
├── assets/            # Branding, screenshots, diagrams
└── research/          # Research & competitor analysis
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| Flutter SDK | ≥ 3.22.0 | Mobile app |
| Dart SDK | ≥ 3.4.0 | Mobile app |
| Android SDK | API 21+ | Android target |
| Node.js | ≥ 20.0.0 | Backend API |
| PostgreSQL | ≥ 15 | Cloud database |
| Firebase CLI | ≥ 13 | Firebase deploy |

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/medicare.git
cd medicare
cp .env.example .env
# Fill in .env with your credentials
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL and FIREBASE credentials
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3. Flutter App Setup

```bash
cd frontend
flutter pub get
# Add google-services.json to android/app/
flutter run
```

### 4. Using Scripts

```bash
# Full setup (runs all installs)
./scripts/setup.sh

# Run all tests
./scripts/test.sh

# Build everything
./scripts/build.sh
```

---

## 📱 Flutter App Features

| Feature | Description |
|---------|-------------|
| **Onboarding** | Multi-step walkthrough for new users |
| **Authentication** | Firebase Auth (email/phone) |
| **Dashboard** | Today's doses, next reminder, quick actions |
| **Medicine Management** | Add/edit/delete medicines with photos |
| **Reminder Engine** | Local alarm scheduling, offline-first |
| **Voice Reminders** | TTS announcement of medicine details |
| **Voice Commands** | STT for hands-free dose marking |
| **Dose History** | Date-range history with adherence stats |
| **Caregiver Mode** | Read-only view for family caregivers |
| **Refill Alerts** | Low stock warnings and refill tracking |
| **Accessibility** | Font size, contrast, screen reader support |
| **Settings** | Voice, notification, and app preferences |

---

## 🔌 Backend API

Base URL: `http://localhost:3000/api/v1`

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/verify` |
| Users | `GET/PUT /users/me` |
| Medicines | `GET/POST/PUT/DELETE /medicines` |
| Reminders | `GET/POST/PUT/DELETE /reminders` |
| Dose Events | `GET/POST /dose-events` |
| History | `GET /history` |
| Adherence | `GET /adherence/score` |
| Caregivers | `GET/POST/DELETE /caregivers` |
| Refills | `GET/POST/PUT /refills` |
| Sync | `POST /sync/batch` |
| Notifications | `POST /notifications/send` |
| Media | `POST/DELETE /media/upload` |

Full API documentation: [`docs/05-api/API_DOCUMENT.md`](docs/05-api/API_DOCUMENT.md)

OpenAPI spec: [`docs/05-api/openapi.yaml`](docs/05-api/openapi.yaml)

---

## 🗄️ Database

- **SQLite** (local, on-device): All offline data including medicines, reminders, dose events, sync queue
- **PostgreSQL** (cloud): User accounts, synced data, adherence analytics, caregiver relationships

Schema documentation: [`docs/06-database/data-dictionary.md`](docs/06-database/data-dictionary.md)

---

## 🏛️ Architecture

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

Architecture documentation: [`docs/03-architecture/system-architecture.md`](docs/03-architecture/system-architecture.md)

---

## 🔒 Security

- Firebase Authentication — server-side token verification
- Resource ownership checks — users can only access their own data
- Caregiver authorization — explicit grant-based access
- Input validation — Zod schemas on all API inputs
- Rate limiting — Express rate limiter
- No secrets in Git — `.env.example` with placeholders
- HTTPS-ready — TLS termination via reverse proxy

---

## 📖 Documentation

| Document | Location |
|----------|----------|
| Project Overview | [`docs/01-project/project-overview.md`](docs/01-project/project-overview.md) |
| Requirements (PRD) | [`docs/02-requirements/PRD/`](docs/02-requirements/PRD/) |
| System Architecture | [`docs/03-architecture/system-architecture.md`](docs/03-architecture/system-architecture.md) |
| API Reference | [`docs/05-api/API_DOCUMENT.md`](docs/05-api/API_DOCUMENT.md) |
| Database Design | [`docs/06-database/data-dictionary.md`](docs/06-database/data-dictionary.md) |
| Security | [`docs/07-security/threat-model.md`](docs/07-security/threat-model.md) |
| Deployment Guide | [`docs/08-deployment/deployment-guide.md`](docs/08-deployment/deployment-guide.md) |

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Flutter unit tests
cd frontend && flutter test

# Flutter widget tests
cd frontend && flutter test test/widget/

# E2E API tests
cd tests/api && npm test
```

---

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

MIT License — see [`LICENSE`](LICENSE)

---

## 👥 Team

Built for **Smart India Hackathon 2026** — CEP Project: Medicare – Voice Reminders for Senior Citizens.

---

*Making medication management simple, reliable, and accessible for every senior citizen.*
