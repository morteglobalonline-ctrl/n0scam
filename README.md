# n0scam

iOS-first scam prevention app based on the Plan B product specification.

## Current milestone

- Expo SDK 57 + React Native 0.86 + Expo Router
- Brand system using n0 Green (`#00FF8A`), black, white, and Sora
- Honest protection-state model: no module is marked active without live verification
- URL, QR, message, protection-center, history, and settings foundations
- iOS/Android application identifiers, least-privilege permissions, and EAS development/preview/production profiles
- Versioned live Risk API transport boundary with timeout, cancellation, response validation, and no-secret configuration
- Bounded deep-link intake plus minimum-permission Safari, Message Filter, and local Share Extension targets wired into Expo CNG/EAS
- Shared typed contracts and product/security documentation

## Run

```bash
npm install
npm run ios
```

The app is currently an early device-testable MVP. Any local analysis result is explicitly marked as an on-device preliminary assessment, not live protection or advice.

See [`docs/device-readiness.md`](docs/device-readiness.md) before creating a signed build. A build can be installed on a phone today. Safari, unknown-sender SMS/MMS, and share-sheet analysis now have generated native targets, but they must pass signed physical-iPhone tests before the app may call them available or active; network and email protection still require native extensions or verified backend connectors.
