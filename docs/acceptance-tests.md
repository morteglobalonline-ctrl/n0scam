# Acceptance tests

## Implemented MVP gates

- App starts to a real route and all five tabs are reachable.
- No module is labelled `ACTIVE` without verification.
- Empty history is not populated with fake incidents.
- Invalid or blank URL input is rejected.
- QR permission denial retains manual alternatives.
- A scanned QR payload does not automatically open an external app or browser.
- Result views show evidence and missing data, and say “Analitiktir, tavsiye değildir.”
- Brand colors and typography come from the shared theme.
- Generated iOS builds embed and register the Safari Web Extension, IdentityLookup Message Filter Extension, and Share Extension with their expected bundle identifiers.
- iOS does not declare microphone usage; Android explicitly blocks microphone permission.
- TypeScript and lint checks pass.

## Required before production

- Physical-device permission, offline, malformed payload, large Dynamic Type, and VoiceOver passes.
- Safari/Network/SMS extensions tested with real entitlements and provisioning.
- OAuth revoke, expiry, webhook replay, reconciliation, and deletion workflows.
- Calibrated labelled-data measurement for precision, recall, false positives, and language cohorts.
- Secrets scan, dependency review, pentest, App Privacy labels, and rollback runbook.
