# Privacy baseline

- Collect the minimum data required for the selected action.
- Never store secrets, OAuth refresh tokens, OTPs, or credentials in logs.
- Keep raw scan content transient by default.
- Redact IBANs, email bodies, identifiers, and authentication values before telemetry or model calls.
- Keep every connector separately revocable.
- Provide data export and account/data deletion before public release.
- Do not send content to a third party until the user has received a purpose-specific disclosure.
- The SMS Message Filter App Group may contain only a last-execution timestamp.
  It must never contain sender data, message text, classifier signals, or the
  filtering outcome.
- Google OAuth authorization codes are transient. Provider access and refresh
  tokens must remain in an encrypted connector-service vault and must never be
  stored in the mobile app. Gmail disconnect revokes and deletes that material.
- Gmail message content must not be collected merely because a mailbox is
  connected. Scope, data access, retention, and deletion must match a separately
  reviewed, disclosed feature purpose.
- The same mailbox rules apply to Outlook/Microsoft Graph. Use delegated
  permissions and never request application-wide mailbox access for the mobile
  consumer product.
- Screenshot OCR and PDF/text extraction run locally through iOS Vision and
  PDFKit. Selected images, documents, and extracted message bodies remain
  transient and are not uploaded or written to app history.
- The optional weekly protection reminder is scheduled locally by the operating
  system. It does not register a push token or include user content in its
  notification payload.
- Shared analysis summaries are generated only after an explicit tap. They omit
  raw message bodies, full URL paths and query parameters, and non-web QR
  payloads; the operating-system share sheet controls the destination.
- History can be cleared in one confirmed action. Shared history summaries use
  only the redacted records already stored on-device and never recover raw input.
- Account and Data can clear all current local summaries and scheduled reminders
  together. It does not pretend to delete a remote account when none exists.
- The incident-help checklist is fixed, content-free text. Sharing it never adds
  a message, URL, mailbox item, account number, or device identifier.
- The iOS Share Extension writes only its last successful analysis timestamp to
  App Group storage. Shared text, URLs, source-app identity, signal count, and
  result are never persisted there.
- Links discovered in message, OCR, or document text are extracted locally and
  never opened automatically. The result UI reveals only their hostname until
  the user explicitly starts a separate link analysis.

The current MVP performs its preliminary URL heuristics on device and does not include production analytics or a remote risk service.
