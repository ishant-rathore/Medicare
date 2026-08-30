# Medicare App Implementation & Production Readiness Tasks

> **Status:** MVP implementation is substantially complete. The checklist below tracks the remaining work required to make Medicare production-ready.
>
> **Release principle:** Do not mark production-ready until the critical offline reminder path, security/authorization, data integrity, Android release build, and rollback requirements have been verified with real test evidence.

---

## Phase 1: Project Repository Setup

- [x] **Phase 1: Project Repository Setup**

## Phase 2: Project Architecture Documentation

- [x] **Phase 2: Project Architecture Documentation**

## Phase 3: Backend Infrastructure Setup

- [x] **Phase 3: Backend Infrastructure Setup**

## Phase 4: Backend Module Implementation

- [x] **Phase 4: Backend Module Implementation**
  - [x] Core Middleware & Database Setup
  - [x] CRUD Modules (Medicines, Dose Events, Sync)
  - [x] Idempotent batch processing logic

## Phase 5: Frontend Bootstrap

- [x] **Phase 5: Frontend Bootstrap**
  - [x] Core App initialization (`main.dart`, `app_theme.dart`)
  - [x] Router configuration (`router.dart`)

## Phase 6: Frontend Domain & Data Layer

- [x] **Phase 6: Frontend Domain & Data Layer**
  - [x] Domain entities (`Medicine`, `DoseEvent`) and enums (`MedicineType`, `MealTiming`, `RecurrenceType`, `DoseStatus`)
  - [x] Abstract repositories (`IMedicineRepository`)
  - [x] SQLite Database Service (WAL mode, offline schema)
  - [x] Data Access Objects (`MedicineDao`, `DoseEventDao`, `ReminderDao`)
  - [x] Repository Implementation (`MedicineRepositoryImpl`) wrapping SQLite + Sync Queue
  - [x] Offline Sync Service (Queue, batch upload, auto-retry)

## Phase 7: Frontend Services (Reminder Engine)

- [x] **Phase 7: Frontend Services (Reminder Engine)**
  - [x] Reminder Engine Orchestrator
  - [x] Alarm Scheduler (`android_alarm_manager_plus`)
  - [x] Alarm Receiver (Background Isolate Execution)
  - [x] Recurrence Calculator (Deterministic pure dart logic)
  - [x] TTS Service (`flutter_tts`) for spoken reminders
  - [x] Notification Service (`flutter_local_notifications` lock-screen intent)

## Phase 8: Frontend Presentation Layer

- [x] **Phase 8: Frontend Presentation Layer**
  - [x] API Client (Dio, Firebase Auth injection, offline retry)
  - [x] Main Dashboard Page (Senior-friendly design, Greeting, Adherence)
  - [x] Actionable Dose Card (TAKEN, SNOOZE, SKIP)
  - [x] Dashboard State Management (Riverpod)

## Phase 9: Frontend Medicine Workflows

- [x] **Phase 9: Frontend Medicine Workflows**
  - [x] Add/Edit Medicine Form
  - [x] Reminder Configuration
  - [x] Camera integration for pill photo

## Phase 10: Frontend Authentication & Onboarding

- [x] **Phase 10: Frontend Authentication & Onboarding**
  - [x] Auth Provider via Firebase Auth
  - [x] Splash routing page
  - [x] Senior-friendly Onboarding slides
  - [x] Login & Register pages
  - [x] Profile Setup logic

## Phase 11: Testing & CI/CD Foundation

- [x] **Phase 11: Testing & CI/CD Foundation**
  - [x] GitHub Actions YAML Pipeline for both Backend and Frontend
  - [x] Backend Jest unit tests (Auth Middleware)
  - [x] Frontend Flutter unit tests (Recurrence Calculator)

---

# Phase 12: Production Blockers — P0

> **Release blocker:** Every item in this phase must be complete before production release.

- [ ] **P0-01** Align CI Node.js version with the documented runtime requirement (Node 20+)
- [ ] **P0-02** Create isolated staging environment for PostgreSQL + Firebase
- [ ] **P0-03** Configure production secrets through secure environment/secret management
- [ ] **P0-04** Verify production Firebase Authentication configuration
- [ ] **P0-05** Verify every protected API endpoint performs server-side resource authorization
- [ ] **P0-06** Complete cross-user authorization tests for medicines, reminders, dose events, adherence, refills and profile data
- [ ] **P0-07** Complete caregiver permission, scope and revocation tests
- [ ] **P0-08** Make offline sync fully idempotent and replay-safe
- [ ] **P0-09** Verify duplicate `local_event_id` handling under retries and concurrent requests
- [ ] **P0-10** Add production Android release build to CI
- [ ] **P0-11** Configure Android release signing outside source control
- [ ] **P0-12** Build and install a real release APK/AAB
- [ ] **P0-13** Verify critical reminder path on a physical Android device with network enabled
- [ ] **P0-14** Verify critical reminder path on a physical Android device with network disabled
- [ ] **P0-15** Verify alarms after app restart and supported lifecycle/background conditions
- [ ] **P0-16** Verify notification, vibration, TTS and visible fallback controls on supported Android versions
- [ ] **P0-17** Verify no database/Firebase/API/signing secrets are present in source or release artifacts
- [ ] **P0-18** Perform production database backup and restore verification
- [ ] **P0-19** Create and rehearse rollback procedure for backend, mobile artifact and database recovery
- [ ] **P0-20** Record actual release evidence and approve the production release candidate

---

# Phase 13: Backend Production Hardening — P1

- [ ] **P1-01** Add separate liveness and readiness health checks
- [ ] **P1-02** Make readiness verify database connectivity
- [ ] **P1-03** Add request/route timeout protection
- [ ] **P1-04** Verify request body, path and query validation for every endpoint
- [ ] **P1-05** Audit writable fields for mass-assignment vulnerabilities
- [ ] **P1-06** Audit resource IDs and access patterns for enumeration vulnerabilities
- [ ] **P1-07** Apply endpoint-specific rate limits to abuse-prone operations
- [ ] **P1-08** Configure `trust proxy` correctly for the production ingress/load balancer
- [ ] **P1-09** Ensure production logs redact tokens, credentials and unnecessary medication data
- [ ] **P1-10** Add centralized error monitoring
- [ ] **P1-11** Add API latency and error-rate metrics
- [ ] **P1-12** Add automated dependency vulnerability scanning
- [ ] **P1-13** Establish dependency update policy and controlled upgrade process
- [ ] **P1-14** Verify production Prisma migration workflow
- [ ] **P1-15** Document and test migration recovery procedure
- [ ] **P1-16** Verify graceful shutdown and connection draining in the deployment platform

---

# Phase 14: Authentication & Authorization Security — P1

- [ ] **P1-17** Test valid Firebase token authentication
- [ ] **P1-18** Test expired Firebase token rejection
- [ ] **P1-19** Test malformed/missing Bearer token rejection
- [ ] **P1-20** Test disabled/deleted Firebase user behavior
- [ ] **P1-21** Test client-supplied `user_id` tampering
- [ ] **P1-22** Test cross-user medicine access rejection
- [ ] **P1-23** Test cross-user reminder access rejection
- [ ] **P1-24** Test cross-user dose-event access rejection
- [ ] **P1-25** Test cross-user adherence/refill/profile access rejection
- [ ] **P1-26** Test caregiver access after revocation
- [ ] **P1-27** Test caregiver scope escalation attempts
- [ ] **P1-28** Test role/permission tampering from the client
- [ ] **P1-29** Verify protected endpoints reject unauthorized mutation attempts before database writes

---

# Phase 15: Database & Data Integrity — P1

- [ ] **P1-30** Audit and add required PostgreSQL indexes
- [ ] **P1-31** Verify uniqueness constraints for sync/local event identities
- [ ] **P1-32** Verify foreign-key behavior for deleted/deactivated entities
- [ ] **P1-33** Add transaction tests for multi-step writes
- [ ] **P1-34** Test concurrent sync requests
- [ ] **P1-35** Test partial sync failures
- [ ] **P1-36** Test retry after API/network timeout
- [ ] **P1-37** Test database connection exhaustion behavior
- [ ] **P1-38** Define medication/dose-history retention policy
- [ ] **P1-39** Implement documented account/data deletion workflow
- [ ] **P1-40** Automate backup verification

---

# Phase 16: Offline-First & Reminder Reliability — P1

> **Critical product path:** local data → schedule → Android alarm → voice/visual reminder → Taken/Snooze/Skip → local dose event → sync.

- [ ] **P1-41** Test reminders with Wi-Fi disabled
- [ ] **P1-42** Test reminders with mobile data disabled
- [ ] **P1-43** Test reminders after force-closing the app
- [ ] **P1-44** Test reminders after device reboot
- [ ] **P1-45** Test reminders after app upgrade
- [ ] **P1-46** Test timezone changes
- [ ] **P1-47** Test recurring reminder edge cases
- [ ] **P1-48** Test reminder behavior for multiple doses scheduled close together
- [ ] **P1-49** Test duplicate alarm scheduling prevention
- [ ] **P1-50** Test reminder edit/cancel behavior
- [ ] **P1-51** Test battery optimization/background restrictions on supported devices
- [ ] **P1-52** Test local database recovery behavior
- [ ] **P1-53** Test long offline periods followed by synchronization
- [ ] **P1-54** Test sync queue ordering and retries
- [ ] **P1-55** Test duplicate event uploads
- [ ] **P1-56** Test local/cloud conflict resolution
- [ ] **P1-57** Verify missed-dose acknowledgement timeout
- [ ] **P1-58** Verify Taken/Snooze/Skip state transitions

---

# Phase 17: Android Production Hardening — P1

- [ ] **P1-59** Audit AndroidManifest permissions
- [ ] **P1-60** Remove unnecessary permissions
- [ ] **P1-61** Verify Android notification permission flow
- [ ] **P1-62** Verify exact-alarm requirements on supported Android versions
- [ ] **P1-63** Verify battery optimization guidance/behavior
- [ ] **P1-64** Verify background service behavior
- [ ] **P1-65** Verify boot/alarm recovery behavior
- [ ] **P1-66** Verify notification channels
- [ ] **P1-67** Verify full-screen reminder behavior
- [ ] **P1-68** Verify lock-screen privacy
- [ ] **P1-69** Verify behavior under Do Not Disturb/silent modes
- [ ] **P1-70** Verify audio and vibration edge cases
- [ ] **P1-71** Verify low-memory/background process killing scenarios
- [ ] **P1-72** Verify app upgrade preserves local data
- [ ] **P1-73** Document uninstall/reinstall data behavior

---

# Phase 18: Accessibility — P1

- [ ] **P1-74** Test standard Android font scale
- [ ] **P1-75** Test increased font scale (1.3×+)
- [ ] **P1-76** Test maximum practical font scale without content loss
- [ ] **P1-77** Perform screen-reader testing on a physical Android device
- [ ] **P1-78** Verify semantic labels for all interactive icons
- [ ] **P1-79** Verify touch target sizes
- [ ] **P1-80** Verify no information depends only on color
- [ ] **P1-81** Verify loading, error, empty and success states are understandable
- [ ] **P1-82** Test dark-mode semantic contrast
- [ ] **P1-83** Test small screens and orientation changes where supported
- [ ] **P1-84** Verify visible fallbacks when voice recognition/TTS fails

---

# Phase 19: Voice, STT/TTS & Medical Safety — P1

- [ ] **P1-85** Define and document supported voice commands
- [ ] **P1-86** Safely reject unsupported/ambiguous voice commands
- [ ] **P1-87** Test speech recognition failure paths
- [ ] **P1-88** Test microphone permission denial
- [ ] **P1-89** Display a clear microphone/listening state
- [ ] **P1-90** Verify no continuous microphone listening
- [ ] **P1-91** Test regional language/accent behavior relevant to the target users
- [ ] **P1-92** Verify TTS announces only configured medication/reminder data
- [ ] **P1-93** Test malicious medication text inputs
- [ ] **P1-94** If AI/Gemini features are enabled, enforce strict medical-safety guardrails
- [ ] **P1-95** Require explicit human confirmation for AI-assisted actions
- [ ] **P1-96** Prevent AI from autonomously modifying medication instructions

---

# Phase 20: Media & Privacy — P1

- [ ] **P1-97** Keep Firebase Storage media private
- [ ] **P1-98** Verify server-side authorization for voice/photo assets
- [ ] **P1-99** Prevent public/direct unauthenticated media URLs
- [ ] **P1-100** Validate upload MIME types and file sizes
- [ ] **P1-101** Defend upload endpoints against malicious files
- [ ] **P1-102** Define media retention and deletion policy
- [ ] **P1-103** Minimize sensitive medication information in logs
- [ ] **P1-104** Minimize medication information displayed on lock screen
- [ ] **P1-105** Provide plain-language privacy information in the app
- [ ] **P1-106** Provide explicit caregiver-monitoring consent
- [ ] **P1-107** Provide explicit family-voice consent
- [ ] **P1-108** Implement documented user data/account deletion

---

# Phase 21: CI/CD & Release Engineering — P2

- [ ] **P2-01** Update backend CI to Node 20+
- [ ] **P2-02** Add Flutter release build job
- [ ] **P2-03** Publish APK/AAB build artifacts
- [ ] **P2-04** Add dependency vulnerability scanning
- [ ] **P2-05** Add secret scanning
- [ ] **P2-06** Add static application security testing where practical
- [ ] **P2-07** Add license compliance checks
- [ ] **P2-08** Set minimum test coverage thresholds for critical backend modules
- [ ] **P2-09** Add integration test stage
- [ ] **P2-10** Add Android emulator smoke tests where practical
- [ ] **P2-11** Add staging deployment workflow
- [ ] **P2-12** Require explicit approval before production deployment
- [ ] **P2-13** Promote the already-tested artifact instead of rebuilding for production
- [ ] **P2-14** Tag production releases with version + commit SHA
- [ ] **P2-15** Generate release notes from changelog/commits
- [ ] **P2-16** Retain the previous production artifact for rollback

---

# Phase 22: Observability & Operations — P2

- [ ] **P2-17** Centralize backend logs
- [ ] **P2-18** Add production error tracking
- [ ] **P2-19** Add API latency metrics
- [ ] **P2-20** Add database performance monitoring
- [ ] **P2-21** Monitor synchronization failures and retry spikes
- [ ] **P2-22** Monitor FCM/notification failures
- [ ] **P2-23** Add deployment health verification
- [ ] **P2-24** Add alerting for elevated 5xx responses
- [ ] **P2-25** Add alerting for database availability problems
- [ ] **P2-26** Add alerting for sync failure spikes
- [ ] **P2-27** Create an incident response/runbook document
- [ ] **P2-28** Define operational ownership for releases and incidents

---

# Phase 23: Product & UX Completion — P2

- [ ] **P2-29** Complete offline/sync status UI
- [ ] **P2-30** Add retry UX for failed synchronization
- [ ] **P2-31** Complete empty/loading/error states across major screens
- [ ] **P2-32** Improve senior-friendly error messaging
- [ ] **P2-33** Complete account deletion UI
- [ ] **P2-34** Complete privacy policy/support screen
- [ ] **P2-35** Add clear notification-permission explanation
- [ ] **P2-36** Verify all primary flows with increased font size

---

# Phase 24: Documentation & Release Evidence — P2

- [ ] **P2-37** Replace placeholder organization/contributor/badge references
- [ ] **P2-38** Document real production backend/API URLs
- [ ] **P2-39** Document supported Android versions/devices
- [ ] **P2-40** Document production infrastructure and dependencies
- [ ] **P2-41** Document secrets management
- [ ] **P2-42** Document backup/restore procedure
- [ ] **P2-43** Document incident response procedure
- [ ] **P2-44** Document release and rollback procedure
- [ ] **P2-45** Document data retention and deletion policy
- [ ] **P2-46** Document privacy/consent behavior
- [ ] **P2-47** Update test report with actual executed results only
- [ ] **P2-48** Attach release evidence for critical reminder/offline/security/accessibility tests

---

# Production Release Gate

A Medicare release is **NOT production-ready** until all of the following are true:

- [ ] All **P0** tasks are complete.
- [ ] Critical reminder path passes on a physical Android device.
- [ ] Reminder execution works without network connectivity.
- [ ] Authentication and authorization security tests pass.
- [ ] Offline sync is authenticated, authorized, idempotent and retry-safe.
- [ ] Android release APK/AAB is signed securely and reproducibly.
- [ ] Database migration and backup/restore procedures are verified.
- [ ] Accessibility smoke tests pass.
- [ ] Voice/TTS/STT fallback behavior passes.
- [ ] No P0/P1 defect threatens reminder reliability, privacy/security or data integrity.
- [ ] Staging validation passes before production promotion.
- [ ] Rollback artifact and procedure are available.
- [ ] Actual release evidence is recorded.

## Definition of Done

A task can be checked off only when the implementation is merged and the required verification/evidence has been completed. Documentation-only statements do not count as proof of implementation or testing.
