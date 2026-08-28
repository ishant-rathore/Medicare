# Medicare Frontend Deployment Structure

This document defines the deployment-oriented structure for the Flutter frontend.

## Principles

- Android-first release target.
- Local-first reminder execution must not depend on network availability.
- Keep presentation, application/use cases, domain, data/repositories, and platform services separated.
- Keep environment configuration outside source-controlled secrets.
- Release builds must be validated before distribution.
- Do not store Firebase credentials, signing keys, tokens, or other secrets in the repository.

## Deployment layout

```text
frontend/
├── lib/                         # Production Dart application
├── test/                        # Unit and widget tests
│   ├── unit/
│   ├── widget/
│   └── integration/
├── integration_test/            # Flutter integration/device tests
├── assets/                      # Bundled application assets
├── config/                      # Non-secret environment/configuration templates
│   ├── development/
│   ├── staging/
│   └── production/
├── tool/                        # Developer and release automation
│   ├── ci/
│   └── release/
├── deployment/                 # Frontend deployment/release documentation
│   ├── android/
│   ├── ci/
│   └── release/
├── pubspec.yaml
├── pubspec.lock
└── DEPLOYMENT.md
```

## Required Flutter platform project

A deployable Android build also requires the standard Flutter-generated `android/` project and its Gradle/manifest/signing configuration. Those files must be generated and validated with the approved Flutter toolchain rather than hand-invented.

## Release gate

Before declaring a release ready, validate formatting, static analysis, unit/widget/integration tests, Android build output, notification/alarm behavior, TTS/STT behavior, accessibility, offline reminder execution, synchronization/idempotency, and release security controls.
