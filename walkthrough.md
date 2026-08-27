# Flutter Frontend Implementation Walkthrough

The Flutter frontend logic has been significantly scaffolded with the Domain, Data, and core Presentation layers complete for the MVP medication workflows. 

## 1. Domain Entities & Core Rules
We've established the pure Dart domain entities to run offline:
- [`Medicine`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/domain/entities/medicine.dart): Encapsulates logic for text-to-speech generation, low-stock evaluation, and deep copy capabilities.
- [`DoseEvent`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/domain/entities/dose_event.dart): Tracks status (`pending`, `taken`, `missed`, etc.) and calculates overdue thresholds locally. It utilizes a `localEventId` to maintain idempotency during the syncing processes.

## 2. Local Database & SQLite DAOs
The single source of truth for the mobile client is the `sqflite` database:
- [`DatabaseService`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/data/local/database_service.dart) runs with WAL mode for concurrency and enforces foreign key constraints. We perform a safe transaction scheme creation including `medicines`, `reminders`, `dose_events`, and a `sync_queue` table.
- [`MedicineDao`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/data/local/daos/medicine_dao.dart) and [`DoseEventDao`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/data/local/daos/dose_event_dao.dart) handle standard CRUD, mapping SQLite results back into Dart entities.

## 3. Offline-First Sync Architecture
Network conditions aren't reliable, especially for a senior app, so the architecture operates 100% offline-first:
- [`MedicineRepositoryImpl`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/data/repositories/medicine_repository_impl.dart): Intercepts `addMedicine`, `updateMedicine`, etc. and saves them locally *first*. It then enqueues the payload to the SQLite `sync_queue`.
- [`SyncService`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/services/sync/sync_service.dart): Iterates over the queue in batches. If the user is online, it uploads these batches via the `ApiClient` to the Node.js backend. If it succeeds, it updates the sync flag locally. If not, it leverages exponential retry.

## 4. Reminder Engine 
This is the core background processor that runs whether the app is open or not:
- [`ReminderEngine`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/services/reminder_engine/reminder_engine.dart) coordinates scheduling algorithms, firing off snooze delays, tracking missed doses via background timers, and triggering localized alarms.
- [`AlarmScheduler`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/services/reminder_engine/alarm_scheduler.dart) utilizes `android_alarm_manager_plus` ensuring alarms fire properly even during Android Doze Modes with `wakeup: true`.
- [`TtsService`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/services/voice/tts_service.dart) provides slower, audible spoken text for the reminders to cater specifically to our senior demographic.

## 5. Presentation Layer & Dashboard UI
We have initialized a highly visible, responsive, and robust UI leveraging Riverpod:
- [`DashboardPage`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/features/dashboard/presentation/pages/dashboard_page.dart): Central hub populated dynamically by `dashboard_provider.dart`. It pulls local medicines and displays progress directly off local storage.
- [`DoseCard`](file:///c:/Users/ishan/OneDrive/Documents/Desktop/Projects/Medicare%20-%20Voice%20Remainder%20For%20Senior%20Citizens/Medicare/frontend/lib/features/dashboard/presentation/widgets/dose_card.dart): Provides prominent, actionable buttons (Take, Snooze, Skip) and highlights late doses effectively.

> [!TIP]
> The Flutter application handles local storage beautifully. In the next stage, we will start wrapping the forms (like `AddMedicinePage`) allowing the user to start entering medicines which will automatically sync back to the Node.js database securely. 
