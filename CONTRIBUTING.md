# Contributing to Medicare

Thank you for your interest in contributing to **Medicare – Voice Reminders for Senior Citizens**!

---

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## How to Contribute

### Reporting Bugs

1. Search existing [issues](https://github.com/your-org/medicare/issues) first
2. Use the Bug Report template
3. Include reproduction steps, expected vs actual behavior, and device/OS info
4. For accessibility-related bugs, include assistive technology details

### Suggesting Features

1. Check the [roadmap](docs/01-project/development-roadmap.md) first
2. Use the Feature Request template
3. Describe the problem it solves and who benefits

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Follow the coding standards below
4. Write or update tests
5. Ensure CI passes
6. Submit a PR with a clear description

---

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/medicare.git
cd medicare

# Install backend dependencies
cd backend && npm install

# Install Flutter dependencies
cd ../frontend && flutter pub get

# Run backend
cd ../backend && npm run dev

# Run Flutter app
cd ../frontend && flutter run
```

---

## Coding Standards

### TypeScript (Backend)

- Use strong typing — avoid `any`
- Follow the module structure: `routes → controller → service → repository`
- All business logic goes in **services**, not controllers
- Use Zod for validation
- Write JSDoc for public functions
- Run `npm run lint` before committing

### Dart/Flutter (Frontend)

- Follow Effective Dart style guide
- Use Riverpod for state management
- Keep widgets small and focused (< 200 lines)
- Use `const` constructors where possible
- Run `flutter analyze` before committing
- All UI must support large font sizes and high contrast

### Commit Messages

Use Conventional Commits format:

```
feat: add caregiver notification feature
fix: prevent duplicate dose events during sync
docs: update API documentation for reminders
test: add unit tests for recurrence calculator
chore: update Flutter dependencies
refactor: extract snooze logic to SnoozeManager
```

### Branch Naming

```
feat/feature-name
fix/bug-description
docs/documentation-update
test/test-description
chore/maintenance-task
refactor/refactor-description
```

---

## Testing Requirements

Before submitting a PR:

- [ ] All existing tests pass
- [ ] New code has tests
- [ ] Backend: `cd backend && npm test` passes
- [ ] Flutter: `cd frontend && flutter test` passes
- [ ] TypeScript: `cd backend && npm run build` compiles without errors
- [ ] Flutter: `flutter analyze` produces no errors

---

## Accessibility Requirements

Since this app targets senior citizens, all UI contributions must:

- Support minimum font size of 18sp
- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Include Semantics widgets for screen readers
- Have touch targets of at least 48×48dp
- Never rely on color alone to convey information
- Provide text alternatives for all icons

---

## Priority Issues

Check issues labeled `good first issue` or `help wanted` for contribution opportunities.

---

*Questions? Open a discussion on GitHub or reach out to the maintainers.*
