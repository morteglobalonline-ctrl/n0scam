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

The current MVP performs its preliminary URL heuristics on device and does not include production analytics or a remote risk service.
