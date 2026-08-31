# CI/CD Deployment

Document the frontend validation and release pipeline here.

Minimum gates:

1. dependency installation
2. formatting check
3. static analysis
4. unit/widget tests
5. integration/device tests where configured
6. Android release build
7. artifact retention
8. staging smoke test
9. approval before production/demo release

Secrets must be supplied through the CI environment and never committed.