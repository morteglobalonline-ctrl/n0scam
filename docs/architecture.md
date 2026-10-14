# Architecture

## Repository

```text
apps/mobile                 Expo Router iOS-first client
packages/contracts          Shared domain and API contracts
docs                        Feasibility, privacy, threat model, data flow, tests
native/ios-extensions       Future extension source and provisioning notes
services                    Future API/risk-engine boundaries
```

## Mobile layers

- `src/app`: routes only.
- `src/screens`: screen composition and route-level behavior.
- `src/components`: reusable branded primitives.
- `src/theme`: the only source for color, spacing, type, radius, shadow, and motion tokens.
- `src/domain`: pure local analysis/state logic. This layer must never claim remote or platform protection.

## State rule

A protection module can be `ACTIVE` only when permission exists, the integration is live, the health check is fresh, and a test event succeeded. UI defaults to `NOT_CONFIGURED` and uses `DEGRADED`, `EXPIRED`, or `ERROR` whenever verification is stale or failed.

## Backend boundary

The mobile client will eventually call versioned endpoints through a typed adapter. OAuth refresh tokens, feed credentials, model keys, and service secrets remain server-side. No placeholder secret is embedded in the app.
