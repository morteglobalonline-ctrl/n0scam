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

## Message screenshots and documents

1. The user explicitly selects an image or a supported document.
2. iOS Vision recognizes screenshot text on device. PDFKit extracts text from
   at most 20 pages; plain-text inputs are limited to 500 KB.
3. The native bridge removes null bytes and returns at most 5,000 characters.
   Images are not uploaded and document contents are not logged or persisted.
4. Extracted text is shown in an editable field. Analysis begins only after the
   user taps `Analiz Et`.
5. History remains opt-in and stores only a generic message label, never the
   extracted body.

## User-approved local history

1. Analysis is transient by default.
2. A record is created only after the user taps `Geçmişe Kaydet` on the detailed result.
3. URL records retain only the hostname. Message records use a generic label; message bodies and non-URL QR payloads are not stored.
4. Risk state, evidence count, type, and timestamp remain in the app sandboxed SQLite database.
5. The store keeps at most 200 records and each record can be removed through an explicit destructive confirmation.
6. The user can clear every local summary through a second destructive
   confirmation. A shared history summary is generated only on request and uses
   the already-redacted labels; the system share sheet controls its destination.

## Local protection reminder

1. The user explicitly enables a weekly reminder in Notification Settings.
2. The operating system schedules one local notification for Monday at 10:00.
3. Its payload contains only a fixed internal reminder kind. It never contains a
   URL, message, mailbox item, risk result, account identifier, or device token.
4. Disabling the setting cancels every matching scheduled reminder. No push
   registration or notification backend is used for this feature.

## Privacy-safe report sharing

1. The user explicitly opens the system share sheet from an analysis result.
2. The generated summary contains the risk label, signal titles, and suggested
   next steps. For web links it includes only the normalized hostname.
3. Raw messages, full URL paths and query parameters, and non-web QR payloads
   are never placed in the shared report.
4. The destination is selected and controlled by the operating-system share
   sheet; n0scam does not silently send or persist the report.

## Links discovered in messages

1. Message, e-mail, OCR, and document text is scanned locally for at most five
   unique HTTP(S) links. Other schemes and malformed or oversized candidates are
   discarded.
2. Only hostnames are shown in the message result. A full address is passed to
   the existing link analyzer only after the user explicitly taps Analyze.
3. A discovered link is never opened automatically and is not added to history
   unless the user separately chooses to save its resulting summary.

## Local account and support controls

1. Account and Data reads only the on-device history count and local reminder
   state. A confirmed reset deletes those two local data sets without claiming
   to delete a server account that does not exist.
2. Connected Accounts displays Gmail and Outlook as connected only when the
   connector API returns a valid, fresh health state.
3. The incident-help summary contains a fixed emergency checklist and no user
   message, URL, account number, device identifier, or analysis payload.

## Future email connector

OAuth PKCE starts from mobile, tokens terminate at the backend vault, provider webhooks enqueue a minimal event, and the backend retrieves only the fields required for analysis. Raw content is deleted according to the approved retention policy.
