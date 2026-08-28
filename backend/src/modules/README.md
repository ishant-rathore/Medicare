# Backend Modules

Each feature is isolated as a bounded module. The preferred implementation pattern is:

```text
<feature>/
├── <feature>.routes.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.repository.ts
├── <feature>.schema.ts
├── <feature>.types.ts
└── <feature>.mapper.ts
```

Not every module needs every file immediately; add a layer when that responsibility exists rather than creating speculative code.

Current feature boundaries include users, medicines, reminders, dose-events, history/adherence, caregivers, refills, sync, device-tokens and notifications.
