# Threat model

## Assets

User-submitted URLs and messages, connector tokens, protection state, risk evidence, incident history, and allow/block intelligence.

## Trust boundaries

Mobile app to OS extensions; mobile app to API; API to OAuth providers; API to threat feeds; API to isolated URL inspection; operator access to incident metadata.

## Priority abuse paths

| Threat | Control |
| --- | --- |
| Malicious payload triggers a deep link | Decode and preview; never auto-open |
| SSRF through URL inspection | Isolated fetcher, IP/redirect validation, size and time limits |
| Prompt injection in scam content | Treat submitted content strictly as data |
| Feed poisoning causes false blocks | Source weighting, TTL, analyst gate, appeal path |
| Stale connector shown as active | Shared state machine + fresh health-check requirement |
| Token theft from mobile bundle | PKCE and server-side encrypted token vault |
| Sensitive content leaks into logs | Structured redaction and payload-free telemetry |
| False confidence harms the user | Evidence, missing data, uncertainty, and “analytical, not advice” copy |
