# Frontend Deployment

```text
deployment/
├── android/      # Android release-specific documentation/configuration notes
├── ci/           # CI/CD release pipeline documentation
└── release/      # Release checklist, evidence, and rollback guidance
```

The actual Android Gradle project must remain the standard Flutter-generated platform project. Do not replace it with a custom build system.