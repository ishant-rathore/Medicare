# Development Seed Data

This directory is reserved for synthetic PostgreSQL development/test seed data.

Requirements:

- Use only obviously synthetic records.
- Never include real patient/caregiver information.
- Never include CEP participant or fieldwork evidence.
- Never run automatically in production/demo.
- Never include credentials, tokens, API keys, or production URLs.
- Keep seeds deterministic where practical for repeatable integration tests.

The backend's existing seed mechanism should remain the runtime entry point when seed data is needed; this directory is an organized location for deployment-safe development seed artifacts.
