# Privacy baseline

- Collect the minimum data required for the selected action.
- Never store secrets, OAuth refresh tokens, OTPs, or credentials in logs.
- Keep raw scan content transient by default.
- Redact IBANs, email bodies, identifiers, and authentication values before telemetry or model calls.
- Keep every connector separately revocable.
- Provide data export and account/data deletion before public release.
- Do not send content to a third party until the user has received a purpose-specific disclosure.

The current MVP performs its preliminary URL heuristics on device and does not include production analytics or a remote risk service.
