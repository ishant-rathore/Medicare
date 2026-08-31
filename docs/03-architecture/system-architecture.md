# System Architecture – Medicare

## Architecture Overview

Medicare uses a **layered monolith** architecture on the backend and **clean architecture** on the Flutter client, with an offline-first data strategy.

```
┌─────────────────────────────────────────────────────────┐
│                    FLUTTER ANDROID APP                   │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Presentation│  │   Domain     │  │     Data      │  │
│  │  (Riverpod) │→ │ (Use Cases)  │→ │  (Repos)      │  │
│  │  Pages      │  │  Entities    │  │  SQLite DAO   │  │
│  │  Widgets    │  │  Interfaces  │  │  REST Client  │  │
│  └─────────────┘  └──────────────┘  └───────┬───────┘  │
│                                              │          │
│  ┌───────────────────────────────────────────┘          │
│  │              SERVICES LAYER                          │
│  │  ┌──────────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  │Reminder Engine│ │TTS / STT │ │ Sync Coordinator│  │
│  │  │AlarmScheduler │ │Voice Svc │ │ SyncQueue       │  │
│  │  │AlarmReceiver  │ │          │ │ SyncWorker      │  │
│  │  └──────────────┘ └──────────┘ └────────────────┘  │
│  └──────────────────────────────────────────────────── │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              LOCAL STORAGE (SQLite)               │  │
│  │  medicines | reminders | dose_events | sync_queue │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │  REST API (when online)
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   NODE.JS BACKEND API                    │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  users   │ │medicines │ │reminders │ │dose-events│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │caregiver │ │  sync    │ │  media   │ │notif'ns  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │               POSTGRESQL DATABASE                 │  │
│  │  users | medicines | reminders | dose_events      │  │
│  │  caregivers | refills | device_tokens | sync_log  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      FIREBASE                            │
│  Authentication │ Cloud Messaging │ Storage              │
└─────────────────────────────────────────────────────────┘
```

## Flutter Clean Architecture Layers

### Presentation Layer
- **Pages**: Full-screen views navigated by GoRouter
- **Widgets**: Reusable UI components
- **Controllers**: Riverpod StateNotifier/AsyncNotifier for state
- **No direct data access** — delegates to use cases only

### Domain Layer (Pure Dart, no Flutter dependencies)
- **Entities**: Core business objects (Medicine, Reminder, DoseEvent)
- **Repository Interfaces**: Abstract contracts (IMedicineRepository)
- **Use Cases**: Single-responsibility business operations
- **Enums**: DoseStatus, MedicineType, RecurrenceType

### Data Layer
- **Repository Implementations**: Concrete classes implementing domain interfaces
- **Local DAOs**: SQLite data access objects
- **Remote APIs**: Dio-based HTTP clients
- **DTOs**: Data Transfer Objects for API serialization
- **Mappers**: Convert between entities, DTOs, and local entities

### Services Layer
- **ReminderEngine**: Orchestrates alarm scheduling
- **AlarmScheduler**: Schedules Android alarms via android_alarm_manager_plus
- **AlarmReceiver**: Handles alarm callbacks, triggers notifications
- **TTSService**: Text-to-Speech with language support
- **STTService**: Speech-to-Text with permission handling
- **SyncCoordinator**: Manages offline sync lifecycle
- **SyncQueue**: SQLite-backed queue of pending sync operations
- **SyncWorker**: Processes queue items via REST API

## Backend Modular Monolith

### Request Flow
```
HTTP Request
    ↓
Express Router
    ↓
Auth Middleware (Firebase token verification)
    ↓
Rate Limit Middleware
    ↓
Request ID Middleware
    ↓
Validation Middleware (Zod schema)
    ↓
Controller (thin — just orchestrates)
    ↓
Service (business logic)
    ↓
Repository (Prisma queries)
    ↓
PostgreSQL
```

### Module Structure
Each backend module follows a consistent pattern:
```
module.routes.ts      — Express router registration
module.controller.ts  — HTTP request/response handling (thin)
module.service.ts     — Business logic
module.repository.ts  — Prisma database queries
module.schema.ts      — Zod validation schemas
module.types.ts       — TypeScript interfaces/types
module.mapper.ts      — Convert between DB models and API responses
```

## Offline-First Data Strategy

### Write Path (Offline)
```
User Action → Repository → SQLite (immediate) → Sync Queue (enqueue)
```

### Sync Path (When Online)
```
ConnectivityService (online detected)
    → SyncCoordinator.startSync()
    → SyncWorker.processQueue()
    → For each pending item: REST API call
    → On success: mark queue item 'completed'
    → On failure: increment retry count, apply backoff
```

### Conflict Resolution
- **Last-write-wins** for user profile fields
- **Additive** for dose events (never delete server records)
- **Server-authoritative** for caregiver permissions
- **Idempotency keys** (local_event_id) prevent duplicate server records

## Security Architecture

```
Client Request
    ↓
Firebase Auth Token (in Authorization header)
    ↓
auth.middleware.ts (verify token with Firebase Admin SDK)
    ↓
Extract userId (from verified token — NEVER from request body)
    ↓
Controller: attach userId to request context
    ↓
Service: all queries scoped to userId
    ↓
Resource ownership check: verify requested resource belongs to userId
    ↓
Business rule check: additional constraints
    ↓
Execute operation
```

## Deployment Architecture

```
GitHub
    ↓
GitHub Actions CI/CD
    ↓
Docker Build (backend)
    ↓
Cloud Run / Railway / Render (backend)
    ↓
Neon PostgreSQL (database)
    ↓
Firebase (auth, FCM, storage)
    ↓
Google Play Store (Flutter APK)
```
