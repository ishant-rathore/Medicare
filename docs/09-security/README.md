# 09 — Security

Security, privacy and medical-safety documentation for Medicare.

## Documents

- [Security & Privacy](security-and-privacy.md)

## Core Controls

- Firebase ID tokens verified server-side.
- Resource-level authorization on every protected operation.
- Explicit, scoped and revocable caregiver access.
- HTTPS/TLS for protected API traffic.
- Parameterized SQL / safe ORM/query access.
- Allow-listed writable fields.
- Private optional voice/photo media.
- Minimal sensitive logging.
- No privileged credentials or database secrets in the APK.
- No diagnosis, prescribing, autonomous dose changes or clinical advice.

Security must preserve the local-first reminder path rather than making cloud availability a prerequisite.
