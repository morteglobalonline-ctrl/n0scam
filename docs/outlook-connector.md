# Outlook connector contract

The mobile Outlook OAuth client is implemented against the common Microsoft
identity v2 authorization endpoint. It remains disabled until the connector
service and Microsoft Entra app registration are configured.

## Mobile security boundary

- Authorization Code + PKCE (`S256`) runs in the system authentication session.
- The app accepts only
  `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` and verifies
  that `response_type`, redirect URI, state, code challenge, and challenge
  method match the transaction it created.
- The app validates callback origin, callback path, and state before forwarding
  a single-use code and PKCE verifier to the connector API.
- Client credentials, access tokens, and refresh tokens never ship in the app.
  Provider tokens are encrypted and access-controlled in the connector service.
- Microsoft account and work/school account coverage must be tested before the
  `common` tenant is released. A future tenant-policy change requires a matching
  mobile allowlist change; the app must not silently accept arbitrary tenant
  paths.

## API

The status and request/response shapes match `docs/gmail-connector.md`, with
these endpoints:

- `GET /v1/connectors/outlook/status`
- `POST /v1/connectors/outlook/authorize`
- `POST /v1/connectors/outlook/complete`
- `DELETE /v1/connectors/outlook`

The service must bind the OAuth transaction and mailbox to the authenticated
n0scam user, use short-lived single-use transaction state, perform a Microsoft
Graph health check, and mask `accountLabel`.

Disconnect must revoke/delete provider token material and remove Graph
subscription/watch state. `CONNECTED` requires a recent successful token and
provider health check; expired subscriptions or rejected tokens are `DEGRADED`.
The mobile client independently downgrades any missing or older-than-24-hours
health-check timestamp instead of displaying the connector as verified.

## Microsoft release gates

- Register the exact iOS redirect URI for bundle identifier
  `com.morteglobalonline.n0scam` in Microsoft Entra.
- Use delegated permissions only. Do not use application-wide mailbox
  permissions for the consumer app.
- Request the minimum Graph scope required by the implemented behavior. If
  message content is truly required, delegated `Mail.Read` reads the signed-in
  user's mailbox and must be clearly disclosed; do not request it before the
  analysis, retention, and deletion paths exist.
- Validate personal Microsoft accounts and organizational accounts, including
  administrator consent and Conditional Access failure states.
- Complete publisher verification, privacy policy, revoke, export, and account
  deletion tests before public release.

