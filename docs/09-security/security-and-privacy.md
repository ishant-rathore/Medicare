<<<<<<< HEAD
# Security and Privacy

=======
# Medicare — Security & Privacy

## Voice Reminders for Senior Citizen Medications

> **Security North Star:** Collect less. Expose less. Trust nothing by default. Keep reminders reliable.

## 1. Purpose

This document defines the security, privacy, authorization, secure-development and medical-safety controls for Medicare. It aligns the GitHub documentation with the approved project baselines: PRD, SRS, TRD, Architecture & Engineering, API, Database, Frontend and Deployment documents. The project is a senior-first, Android-first medication reminder and organization system. It is not a diagnostic, prescribing or clinical decision-support system. fileciteturn0file17

## 2. Security Principles

| Principle | Medicare Policy |
|---|---|
| Data minimization | Collect only data needed for reminders, organization and explicitly enabled support. |
| Least privilege | Restrict access by authenticated identity, role and scoped caregiver permissions. |
| Zero trust | Treat client input, IDs and permissions as untrusted until verified server-side. |
| Secure by default | Protect sensitive paths with authentication, authorization, HTTPS/TLS and safe storage. |
| Offline confidence | Security controls must not break already-configured local reminders. |
| Privacy by design | Privacy decisions are part of product, UI and architecture. |
| Medical safety | Never diagnose, prescribe, change dosage/frequency or silently modify instructions. |
| Observable without surveillance | Keep technical logs useful while minimizing sensitive medication content. |

## 3. Data Classification

| Category | Examples | Sensitivity | Controls |
|---|---|---|---|
| Identity | User ID, name, auth reference | High | Authentication + authorization |
| Medication | Name, dosage, type, notes | High | Ownership checks + protected storage |
| Reminder | Time, recurrence, acknowledgement window | High | Ownership + secure storage |
| Dose history | Taken/Snoozed/Skipped/Missed events | High | Authorization + minimized logging |
| Caregiver | Relationship, contact, permissions | High | Explicit consent + scoped access |
| Voice/media | Family voice, medicine photo | High | Private storage + controlled access |
| Preferences | Language, voice, accessibility | Medium | Authenticated access |
| Technical telemetry | Request IDs, error types, timing | Low–Medium | Redaction + limited retention |
| CEP research | Aggregated observations | Controlled | Consent + anonymization/aggregation |

## 4. Authentication

Firebase Authentication is the approved identity provider.

Required behavior:

1. Users authenticate through Firebase Authentication.
2. The client obtains a Firebase ID token.
3. Protected API calls send the token using `Authorization: Bearer <token>`.
4. The Node.js/Express backend verifies token authenticity, expiry and identity before domain logic.
5. The authenticated Firebase UID is mapped to the application `users` record.
6. Resource-level authorization runs before protected reads/writes.

Never create an ad-hoc password store in the Medicare API. Never store raw credentials or privileged long-lived secrets in ordinary application preferences.

## 5. Authorization and Caregiver Security

Authorization is enforced per resource, not just per screen.

### Senior Citizen

- Full access to the senior's own authorized profile, medicines, reminders and history.
- Manages caregiver authorization.

### Authorized Caregiver

- Access only to explicitly permitted senior data.
- Receives only configured missed-dose alerts.
- Access must remain revocable.

### Unauthenticated / Evaluator

- No ordinary access to user medication data.

Every protected operation must verify:

- authenticated actor identity;
- resource ownership or active caregiver relationship;
- permission scope;
- authorization status and revocation state.

Revocation must invalidate further resource access even when an old client screen is cached. Resource IDs must not be enumerable to discover other users' data.

## 6. Transport and Storage Security

### In Transit

- Use HTTPS/TLS for protected API traffic.
- Never send credentials over plaintext HTTP.

### PostgreSQL

- Database credentials remain on the backend.
- Do not expose unrestricted database access to the Android application.
- Use parameterized SQL or an approved safe ORM/query layer.

### SQLite

- Store only data required for operational offline behavior.
- Protect sensitive authentication material using Android secure platform mechanisms.
- Prevent local state from one signed-in user being reused or shown under another identity.

### Firebase Storage

- Voice recordings and medicine photos are private optional media.
- Access through authorized references and access controls.
- Do not expose public storage when private access is required.

### Secrets

Never commit or embed:

- database credentials;
- Firebase service-account credentials;
- private signing credentials;
- API secrets;
- authentication tokens.

Privileged credentials must never be included in the APK.

## 7. Privacy Requirements

- Collect only information needed for the enabled product features.
- Do not collect unnecessary diagnoses or prescription details for the prototype.
- Make caregiver monitoring opt-in.
- Make family voice recording opt-in.
- Make medicine photos opt-in.
- Provide accessible, plain-language privacy information in Settings/Support.
- Obtain voluntary consent for CEP fieldwork and the three-day community trial.
- Use anonymous or aggregated observations in CEP reporting wherever practical.
- Provide a documented prototype account/data removal process.
- Do not put unnecessary medication data, tokens or secrets in logs.

## 8. Android and Permission Controls

Request permissions only when the corresponding feature is active and necessary.

| Capability | Rule |
|---|---|
| Microphone | Use only during an explicitly active voice-command or recording flow. No continuous listening unless separately approved. |
| Camera/gallery | Request only for optional medicine-photo functionality. |
| Notifications | Required for reminder/notification behavior subject to Android platform controls. |
| Audio/vibration | Use for configured reminders and accessibility feedback. |
| Storage | Prefer platform-approved scoped access rather than broad storage permissions. |

Minimize sensitive medication information on lock-screen notifications where practical.

## 9. Voice, TTS/STT and Media Privacy

Voice is an accessibility feature but can expose medication information to nearby people.

### TTS

- Speak only configured reminder information such as medicine name, scheduled time and dosage.
- Do not invent clinical advice.

### STT

- Use defined commands.
- Show a clear listening state.
- Keep visible Taken/Snooze/Skip fallbacks available.
- Do not retain speech transcripts unless an explicitly approved feature requires them.

### Microphone

- No continuous microphone listening.
- Clearly communicate when the microphone is active.

### Family Voice

- Obtain authorization before recording.
- Store only the audio/reference required by the feature.
- Keep voice assets private and access-controlled.

## 10. Medical Safety and Content Integrity

Medicare is a medication reminder and organization tool.

The system must never:

- diagnose a medical condition;
- infer a condition from medication data;
- prescribe or recommend medication;
- recommend changing dosage or frequency;
- recommend stopping medication;
- generate clinical advice;
- silently change clinician-provided medication instructions.

Reminder content must reflect user/caregiver-entered information. Any future AI capability must be assistive, transparent and user-confirmed, and must not autonomously modify medication instructions.

Security tests should include malicious or misleading medication text inputs to confirm that the system does not turn them into unsafe medical guidance.

## 11. API Security Controls

For every protected endpoint:

1. Verify Firebase identity.
2. Validate path, query and body data.
3. Check resource ownership or explicit caregiver permission.
4. Apply allow-listed writable fields.
5. Validate allowed state transitions.
6. Use parameterized database access.
7. Rate-limit abuse-prone operations.
8. Return safe error messages without internal secrets or stack traces.
9. Correlate requests using `X-Request-Id`.
10. Use idempotency for sync/dose-event writes where required.

Never trust client-supplied `user_id`, role, ownership or permissions as authoritative.

## 12. Logging and Observability

Safe structured logging should favor:

- request/correlation IDs;
- operation names;
- error categories;
- status codes;
- timing and availability metrics;
- non-sensitive technical identifiers.

Do not log:

- Firebase tokens;
- passwords;
- database credentials;
- API secrets;
- unnecessary medicine names or dosage data;
- full sensitive request payloads.

## 13. Offline-First Security Boundary

The cloud must never become a security dependency that disables an already-configured local reminder.

The protected local flow is:

```text
SQLite medication data
        ↓
Local schedule
        ↓
Android alarm
        ↓
Voice + visual reminder
        ↓
Taken / Snooze / Skip
        ↓
Local dose event
        ↓
Pending sync queue
```

When connectivity returns, the API revalidates identity, ownership, event identity and allowed state transitions before accepting synchronization.

## 14. Secure Synchronization

Offline dose events receive stable `local_event_id` values.

The server must:

- reject events belonging to another user;
- reject unauthorized caregiver mutations;
- reject invalid state transitions;
- deduplicate retries by stable event identity;
- return the existing canonical result for an already-accepted event;
- keep synchronization idempotent and retry-safe.

This prevents duplicate dose history and protects against forged offline mutations.

## 15. Threat Areas and Controls

| Threat | Primary Control |
|---|---|
| Token theft | Provider-secure token handling; never log tokens |
| Unauthorized resource access | Server-side resource-level authorization |
| Caregiver overreach | Explicit scoped authorization + revocation |
| SQL injection | Parameterized SQL / safe ORM |
| Mass assignment | Writable-field allow-list |
| ID enumeration | Opaque IDs + authorization before resource disclosure |
| Replay / duplicate sync | Stable local event identity + idempotency |
| Sensitive media exposure | Private storage + authorization |
| Accidental privacy disclosure | Data minimization + notification minimization |
| Unsafe generated instruction | Strict medical-safety boundary + human confirmation |
| Offline corruption | Local validation, recovery strategy and sync verification |
| Excessive data collection | Feature-gated permissions + minimization |

## 16. Security Testing Checklist

- [ ] Firebase token verification succeeds for valid tokens.
- [ ] Expired/invalid tokens are rejected.
- [ ] Client-supplied `user_id` cannot bypass ownership checks.
- [ ] Cross-user medicine access is rejected.
- [ ] Revoked caregiver access is rejected.
- [ ] Caregiver scope cannot be expanded by the client.
- [ ] SQL injection payloads are rejected or safely handled.
- [ ] Mass-assignment attempts cannot update protected fields.
- [ ] Replayed dose events do not create duplicates.
- [ ] Malicious medication text cannot trigger clinical advice.
- [ ] Logs do not expose tokens, secrets or unnecessary medication data.
- [ ] Private voice/photo assets cannot be fetched without authorization.
- [ ] Offline reminders continue when the API/network is unavailable.
- [ ] Sync resumes safely after reconnection.

## 17. Privacy and Medical-Safety Acceptance Criteria

The security baseline is accepted when:

- protected APIs verify identity server-side;
- every protected resource checks ownership or explicit caregiver permission;
- secrets are excluded from source control and APK builds;
- sensitive media is private;
- core reminders continue offline;
- offline synchronization is idempotent and authorized;
- voice interaction has visible fallbacks;
- no continuous microphone listening is introduced without approval;
- no clinical advice or autonomous medication changes are produced;
- CEP evidence is consented and reported without fabricated participant data.

## 18. References

- PRD v1.0
- SRS v1.0
- TRD v1.0
- Architecture & Engineering Document v1.0
- API Document v1.0
- Database Design Document v1.0
- Frontend Document v1.0
- Deployment & Operations Document v1.0
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
