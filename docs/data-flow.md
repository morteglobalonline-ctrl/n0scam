# Data flow

## Manual URL

1. User submits text.
2. The app normalizes the URL and runs a small deterministic on-device prefilter.
3. The result is labelled as a local preliminary assessment.
4. A future Risk API may add verified intelligence and isolated redirect analysis.
5. The user sees evidence, missing data, and safe next actions before any external navigation.

## Live Risk API boundary

- `EXPO_PUBLIC_RISK_API_URL` contains only the public HTTPS service location; secrets never ship in the client bundle.
- Requests are versioned, size-limited, cancellable, and fail closed to an explicitly labelled local preliminary result.
- Server responses are treated as untrusted input and must match the typed `RiskAssessment` contract before rendering.
- Raw content is never written to logs. Message or email content must not use this transport until the product has a purpose-specific disclosure and user consent flow.

## QR

1. Camera permission is requested only when the QR screen is opened.
2. `expo-camera` decodes the payload locally.
3. The app stops scanning, displays the exact payload, and routes it through the same preliminary URL logic when appropriate.
4. No URL, deep link, Wi-Fi profile, payment request, or contact card is executed automatically.

## Future email connector

OAuth PKCE starts from mobile, tokens terminate at the backend vault, provider webhooks enqueue a minimal event, and the backend retrieves only the fields required for analysis. Raw content is deleted according to the approved retention policy.
