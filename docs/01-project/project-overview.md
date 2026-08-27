# Project Overview – Medicare

## Vision

To make daily medication management simple, reliable, and accessible for every senior citizen in India — ensuring they never miss a critical dose, even without internet connectivity.

## Mission

Build an offline-first, voice-enabled Android application that senior citizens can use independently, with support from caregivers and healthcare providers.

## Problem Statement

Senior citizens, especially those managing multiple chronic conditions, face significant challenges in medication adherence:

- **Forgetting doses** — The most common cause of non-adherence
- **Complex schedules** — Multiple medicines, multiple times per day, varying with meals
- **Visual difficulties** — Small text on pill bottles and apps
- **Technology barriers** — Complex smartphone interfaces
- **Isolation** — No immediate support when confused about medications
- **Connectivity gaps** — Rural areas with unreliable internet

### Statistics (India)

- 10+ crore senior citizens (60+) in India
- 75% of seniors manage at least one chronic condition
- 50%+ medication non-adherence rate in elderly population
- Medication errors cause 1.5 million preventable injuries annually

## Solution

Medicare provides:

1. **Alarm-based reminders** that work without internet
2. **Voice announcements** in the user's language (Hindi, English, regional languages)
3. **Large, senior-friendly UI** with minimal complexity
4. **Caregiver dashboard** for family monitoring
5. **Prescription scanner** using AI for easy medicine entry
6. **Dose history and adherence reports** for doctors

## Target Users

### Primary User: Senior Citizen (60+)
- Living alone or with family
- Managing 2–10 medications daily
- Limited technology literacy
- May have visual or hearing impairments
- Primarily Android smartphone user

### Secondary User: Family Caregiver
- Son/daughter monitoring an elderly parent remotely
- Wants real-time adherence notifications
- May manage medicine schedules on behalf of the senior

### Tertiary User: Healthcare Provider
- Doctor wanting to review patient adherence history
- Pharmacist managing refill requests

## Key Differentiators

| Feature | Medicare | Generic Reminder Apps |
|---------|----------|----------------------|
| Works offline | ✅ | ❌ Most require internet |
| Voice in regional languages | ✅ | ❌ English only |
| Senior-specific UI | ✅ | ❌ Generic |
| Caregiver integration | ✅ | ❌ Limited |
| AI prescription scanner | ✅ | ❌ Manual entry only |
| Dose history & analytics | ✅ | ❌ Basic |

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Mobile App | Flutter 3.x (Android) |
| State Management | Riverpod |
| Local Database | SQLite (sqflite) |
| Cloud Backend | Node.js + Express + TypeScript |
| Cloud Database | PostgreSQL (Prisma) |
| Authentication | Firebase Auth |
| Push Notifications | Firebase Cloud Messaging |
| Storage | Firebase Storage |
| TTS | flutter_tts |
| STT | speech_to_text |
| Alarms | android_alarm_manager_plus |
| AI | Google Gemini API |

## Project Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Requirements & Design | 2 weeks | ✅ Complete |
| Core Architecture & Setup | 1 week | ✅ Complete |
| Medicine Management | 1 week | ✅ Complete |
| Reminder Engine | 2 weeks | 🔄 In Progress |
| Voice System | 1 week | 🔄 In Progress |
| Backend API | 2 weeks | 🔄 In Progress |
| Caregiver & Sync | 1 week | 📋 Planned |
| Testing & QA | 2 weeks | 📋 Planned |
| Community Trial | 2 weeks | 📋 Planned |
| Evaluation & Report | 1 week | 📋 Planned |
