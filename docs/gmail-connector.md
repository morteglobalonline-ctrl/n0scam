# Gmail connector contract

The mobile OAuth client exists, but Gmail protection must remain unavailable
until a separately deployed connector service and Google OAuth client are
configured. The app reads that service from `EXPO_PUBLIC_CONNECTOR_API_URL`.

## Security boundary

- The app starts OAuth with Authorization Code + PKCE (`S256`) in the system
  authentication session. Embedded web views are not used.
- The connector service creates the Google authorization URL. The app rejects
  returned authorization URLs unless their exact host is
  `accounts.google.com` over HTTPS.
- The redirect URI, authorization code, PKCE verifier, and state are sent to
  the connector service only after the app validates the callback origin,
  callback path, and state.
- Google client secrets, access tokens, and refresh tokens never ship in the
  app or enter JavaScript storage. Refresh tokens belong in an encrypted,
  access-controlled server-side vault.
- The connector service must bind OAuth transactions and mailbox ownership to
  an authenticated n0scam user. It must not trust a user identifier supplied in
  a request body.
- Disconnect must revoke the Google grant where possible and permanently
  remove token material, webhook/watch state, and mailbox-derived data.
- Logs must exclude authorization codes, tokens, message bodies, headers,
  recipient lists, and raw provider errors.

## API

All endpoints are authenticated, HTTPS-only in production, return JSON, and
must reject bodies larger than their declared limits.

### `GET /v1/connectors/gmail/status`

Disconnected:

```json
{ "state": "DISCONNECTED" }
```

Connected or degraded:

```json
{
  "state": "CONNECTED",
  "accountLabel": "a***@example.com",
  "connectedAt": "2026-10-16T12:00:00.000Z",
  "lastHealthCheckAt": "2026-10-16T12:05:00.000Z"
}
```

`accountLabel` should be masked. `CONNECTED` requires a recent successful token
and provider health check; an expired watch, rejected token, or provider error
must produce `DEGRADED` rather than a false healthy state.

### `POST /v1/connectors/gmail/authorize`

Request:

```json
{
  "redirectUri": "n0scam://oauth/gmail",
  "codeChallenge": "base64url-sha256-value",
  "state": "random-correlation-value",
  "locale": "tr-TR"
}
```

Response:

```json
{ "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?..." }
```

The service must allowlist the exact redirect URI, persist an expiring,
single-use OAuth transaction, require PKCE S256, and request only the minimum
scope needed by the implemented product behavior.

### `POST /v1/connectors/gmail/complete`

Request:

```json
{
  "redirectUri": "n0scam://oauth/gmail",
  "code": "single-use-google-code",
  "codeVerifier": "original-pkce-verifier",
  "state": "original-correlation-value"
}
```

The service atomically consumes the OAuth transaction, exchanges the code,
stores encrypted token material, performs a provider health check, and returns
the same shape as the status endpoint. A replayed state or code must fail.

### `DELETE /v1/connectors/gmail`

Revokes and deletes the connector. A successful response may be `204` or any
successful JSON response; the mobile client ignores the response body.

## Google release gates

- Create the correct iOS OAuth client for bundle identifier
  `com.morteglobalonline.n0scam` and configure the exact redirect URI.
- Complete OAuth consent-screen configuration, test-user validation, privacy
  policy, and domain verification.
- Gmail scopes such as `gmail.metadata` and `gmail.readonly` are restricted.
  Public release requires Google's restricted-scope verification. If restricted
  data is transmitted to or stored on the connector service, Google may also
  require a security assessment.
- Do not request Gmail scopes until the exact minimum-data product flow and its
  retention/deletion behavior are implemented and reviewed.

