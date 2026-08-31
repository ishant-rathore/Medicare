<<<<<<< HEAD
# Stakeholders

=======
# Medicare — Stakeholders

**Project:** Medicare – Voice Reminders for Senior Citizen Medications  
**Project Type:** Community Engagement Project (CEP) / Academic Software Project  
**Platform:** Android-first  
**Status:** Development / Documentation Baseline  
**Version:** 1.0

---

## 1. Purpose

This document identifies the primary stakeholders of Medicare, their interests,
responsibilities, expected benefits, access boundaries, and engagement with the
project.

Medicare is designed primarily for senior citizens and caregivers. The system
must remain senior-first, accessible, privacy-preserving, medically safe, and
usable without continuous internet connectivity.

---

## 2. Stakeholder Overview

| Stakeholder | Role | Primary Interest | Influence | Priority |
|---|---|---|---|---|
| Senior Citizen | Primary user | Reliable, understandable medication reminders | High | P0 |
| Family / Caregiver | Authorized supporting user | Setup assistance and permitted monitoring | High | P0 |
| Community / Old Age Home | Community stakeholder | Real-world usability and accessibility | Medium | P1 |
| Project Team | Product and engineering | Development, testing, deployment and evaluation | High | P0 |
| Academic / CEP Evaluator | Reviewer / evaluator | Technical quality and community impact | High | P0 |
| Project Guide | Academic guidance | Project quality, compliance and progress | High | P1 |
| Healthcare Professional | Informational boundary stakeholder | Medication information must not be altered | Medium | P1 |

> **Evidence rule:** Actual participants, community locations, interviews,
> observations and trial results must only be added from verified project
> evidence. No participant or fieldwork data should be fabricated.

---

## 3. Primary Stakeholders

### 3.1 Senior Citizens

**Role:** Primary end users of Medicare.

**Needs:**
- Large and readable text
- High-contrast interface
- Large touch targets
- Loud medication reminders
- Voice-based reminder information
- Regional-language voice support
- Simple Taken / Snooze / Skip actions
- Minimal navigation
- Clear visual and voice feedback
- Reliable reminders without internet
- Visible alternatives when voice interaction fails

**Expected Benefits:**
- Easier medication schedule management
- Reduced dependence on memory
- Reduced dependence on complex smartphone navigation
- Better understanding of reminder information
- Easier acknowledgement of medication events

**Accessibility Expectations:**
- Adjustable font size
- High contrast
- Screen-reader support
- Voice/TTS support
- Vibration
- Clear status indicators
- No reliance on color alone

**Critical Requirement:**

An already-configured reminder must continue working when the network is
unavailable.

---

### 3.2 Family Members / Caregivers

**Role:** Supporting stakeholders who may assist with setup and monitoring.

**Needs:**
- Assist with medication setup
- Configure reminders where authorized
- View permitted medication/reminder information
- Receive configured missed-dose or reminder alerts
- Help maintain refill information where applicable

**Access Boundary:**

Caregiver access is **not automatic**.

Access requires:
1. Explicit authorization by the senior user.
2. An identifiable caregiver relationship.
3. Defined permission scope.
4. Active authorization status.
5. Ability for the senior to revoke access.

A caregiver must not receive medication information before explicit
authorization.

**Security Requirement:**

The backend must verify caregiver authorization at the resource level.
A client-supplied user ID or role must never be treated as proof of access.

---

### 3.3 Community / Old Age Home

**Role:** Community stakeholder and potential context for CEP engagement,
deployment and evaluation.

**Potential Responsibilities:**
- Provide community context.
- Support appropriate participant engagement.
- Facilitate approved field evaluation.
- Provide usability feedback.
- Help identify accessibility challenges.

**Important:**

No specific community, old-age home, participant count, observation or result
should be recorded here unless supported by actual project evidence.

---

## 4. Project Stakeholders

### 4.1 Project Team

**Members:**
- Mritunjayakumar Dwivedi
- Ishant Rathore

**Responsibilities:**
- Requirement analysis
- Product planning
- Architecture
- UI/UX implementation
- Flutter development
- Backend development
- Database implementation
- API integration
- Firebase integration
- Offline-first implementation
- Reminder scheduling
- Voice/TTS/STT integration
- Security implementation
- Testing and QA
- Deployment
- Documentation
- CEP engagement and evaluation

The project team owns the technical implementation and is responsible for
maintaining consistency between approved project documents and the
implementation.

---

### 4.2 Project Guide

**Role:** Academic/project guidance and review.

**Responsibilities:**
- Provide academic guidance.
- Review project direction and progress.
- Support project quality and compliance.
- Review major project deliverables.
- Provide feedback on implementation and documentation.

**Current documented guide:**

Mr. Shinoj Mathew

---

### 4.3 Academic / CEP Evaluators

**Role:** Evaluate the technical and community-engagement outcomes of
Medicare.

**Evaluation Interests:**
- Problem relevance
- Requirement coverage
- Technical implementation
- Accessibility
- Security and privacy
- Offline-first reliability
- Testing evidence
- Community engagement
- Deployment evidence
- Evaluation results
- Documentation quality

Evaluators do not receive ordinary user medication data by default.

---

## 5. Supporting / Boundary Stakeholders

### 5.1 Healthcare Professionals

Healthcare professionals are considered a **safety-boundary stakeholder**,
not a direct system administrator or clinical data source.

Medicare must not:
- Diagnose medical conditions.
- Prescribe medication.
- Change medication dosage.
- Change medication frequency.
- Recommend stopping medication.
- Generate clinical advice.
- Silently modify medication instructions.

Reminder information must reflect information entered by the user or an
authorized caregiver.

Medicare is a medication reminder and organization tool, not a clinical
decision-support system.

---

## 6. Stakeholder Access Model

| Stakeholder | Own Account | Senior Medication Data | Caregiver Functions | System Administration |
|---|---:|---:|---:|---:|
| Senior Citizen | Yes | Full own data | Manage own authorization | No |
| Authorized Caregiver | Yes | Only explicitly permitted | Permitted functions | No |
| Unauthenticated User | No | No | No | No |
| Academic Evaluator | No ordinary access | No | No | No |
| Project Team | Project-controlled access only | Only when legitimately required | Project testing/support | Controlled |
| Healthcare Professional | No default access | No default access | No | No |

> Access to user data must always follow authentication, authorization,
> ownership and least-privilege rules.

---

## 7. Stakeholder Needs → System Response

| Stakeholder Need | Medicare Response |
|---|---|
| Senior needs clear reminders | Voice + visual reminders |
| Senior has difficulty reading small text | Large typography |
| Senior has difficulty with touch precision | Large touch targets |
| Senior prefers spoken guidance | TTS voice reminders |
| Senior prefers regional language | Configurable language/voice support |
| Voice interaction fails | Visible Taken/Snooze/Skip controls |
| Internet is unavailable | Local SQLite + Android alarm execution |
| Caregiver needs monitoring | Explicit caregiver authorization |
| Caregiver access must be limited | Scoped resource-level permissions |
| Medication stock becomes low | Refill/low-stock reminders |
| User needs history | Local dose history + synchronized history |
| Project requires community engagement | CEP fieldwork and evaluation process |
| Users need privacy | Data minimization + access control |
| Project requires secure synchronization | Authenticated API + idempotent sync |
| Medical information must remain safe | No diagnosis/prescription/autonomous dose changes |

---

## 8. Stakeholder Engagement

### Planned Engagement Areas

- Requirement understanding
- Accessibility feedback
- Reminder usability
- Voice interaction usability
- Language preference
- Medication reminder workflow
- Caregiver workflow
- Offline behavior
- Field deployment
- Short-term evaluation
- Final feedback analysis

### Evidence Requirements

The following must be recorded from actual project activity before final
submission:

- Community/location details
- Engagement dates
- Participant information
- Interview responses
- Observations
- Deployment evidence
- Trial logs
- Usability feedback
- Evaluation results

Do not replace missing evidence with assumptions or fabricated results.

---

## 9. Stakeholder Risks

| Risk | Affected Stakeholder | Mitigation |
|---|---|---|
| Reminder is difficult to understand | Senior | Voice + visual redundancy |
| Text is too small | Senior | Large typography + font scaling |
| Voice fails | Senior | Visible fallback controls |
| Internet outage | Senior | Local-first reminder execution |
| Unauthorized caregiver access | Senior | Explicit scoped authorization |
| Sensitive data exposure | All users | Least privilege + data minimization |
| Incorrect medication instruction | Senior | User-entered information only |
| Community evidence is incomplete | CEP team | Record actual evidence and mark missing items |
| Cloud synchronization failure | User | Local queue + retry/idempotency |
| Accessibility regression | Senior | Accessibility QA and device testing |

---

## 10. Privacy & Security Expectations

Medicare handles medication, reminder, dose-history, caregiver and optional
voice/media information as sensitive data.

Stakeholder-related security controls include:

- Authenticate protected operations.
- Verify Firebase ID tokens server-side.
- Never trust client-supplied ownership or role information.
- Perform resource-level authorization.
- Require explicit caregiver authorization.
- Make caregiver authorization revocable.
- Protect private voice recordings and medicine photos.
- Do not expose secrets or credentials in the Android application.
- Avoid unnecessary sensitive information in logs.
- Use HTTPS/TLS for protected API communication.
- Minimize stored and transmitted data.
- Preserve local reminder operation when cloud services fail.

---

## 11. Medical-Safety Boundary

Stakeholders must understand that Medicare is **not a clinical decision-support
system**.

The application only organizes and reminds users about medication information
entered by the user or authorized caregiver.

The system must never autonomously:
- Change dosage.
- Change frequency.
- Stop medication.
- Prescribe medication.
- Diagnose a condition.
- Infer a medical condition.
- Generate clinical recommendations.

Any future AI capability must be assistive, transparent, user-confirmed and
unable to autonomously modify medication instructions.

---

## 12. Stakeholder Communication Matrix

| Stakeholder | Communication | Frequency | Owner |
|---|---|---|---|
| Senior Citizens | Usability / reminder feedback | During approved engagement | Project Team |
| Caregivers | Setup and monitoring feedback | As required | Project Team |
| Community Stakeholders | Engagement / deployment coordination | During CEP activities | Project Team |
| Project Guide | Progress / review | As required by academic process | Project Team |
| CEP Evaluators | Demonstration / evidence | Evaluation milestones | Project Team |
| Healthcare Boundary Stakeholders | Safety clarification where applicable | As required | Project Team |

Actual communication dates and outcomes should be added only from project
records.

---

## 13. Stakeholder Priority

### P0 — Critical

- Senior citizens
- Family/caregivers
- Project team
- Academic/CEP evaluators

### P1 — Important

- Community / old-age-home stakeholders
- Project guide
- Healthcare professionals as safety-boundary stakeholders

---

## 14. Definition of Stakeholder Success

Medicare is successful from a stakeholder perspective when:

1. A senior can understand a due medication reminder.
2. The reminder is available through voice and visual channels.
3. The senior can complete Taken, Snooze or Skip easily.
4. The reminder continues working without internet connectivity.
5. Dose events are retained locally and synchronized safely later.
6. Caregiver access is explicitly authorized and scoped.
7. Accessibility requirements are maintained.
8. Sensitive information is protected.
9. Medication instructions are never autonomously modified.
10. CEP community engagement and evaluation are supported by real evidence.

---

## 15. Source Documents

This document is aligned with:

- PRD v1.0
- SRS v1.0
- TRD v1.0
- UI/UX Design Document v1.0
- Design System Document v1.0
- User Flow Document v1.0
- Architecture & Engineering Document v1.0
- Security & Privacy Document v1.0
- Deployment & Operations Document v1.0
- API Document v1.0
- Database Design Document v1.0
- Backend Document v1.0
- Frontend Document v1.0
- Final Project Submission Report

---

## 16. Document Status

**Status:** Baseline / Development Documentation

**Important:** Stakeholder categories and responsibilities are based on the
approved project documentation. Actual community participants, fieldwork
locations, interviews, observations and evaluation results must be added only
after verification from real project evidence.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
