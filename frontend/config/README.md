# Frontend Configuration

Environment-specific, non-secret configuration templates belong here.

```text
config/
├── development/
├── staging/
└── production/
```

Never commit Firebase service credentials, signing keys, API tokens, passwords, or other secrets. Production values must be supplied by the deployment environment/secret manager.