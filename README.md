# n0scam

iOS-first scam prevention app based on the Plan B product specification.

## Current milestone

- Expo SDK 57 + React Native 0.86 + Expo Router
- Brand system using n0 Green (`#00FF8A`), black, white, and Sora
- Honest protection-state model: no module is marked active without live verification
- URL, QR, message, protection-center, history, and settings foundations
- iOS/Android application identifiers, least-privilege permissions, and EAS development/preview/production profiles
- Shared typed contracts and product/security documentation

## Run

```bash
npm install
npm run ios
```

The app is currently an early local MVP. Any local analysis result is explicitly marked as an on-device preliminary assessment, not live protection or advice.

See [`docs/device-readiness.md`](docs/device-readiness.md) before creating a signed build. A build can be installed on a phone today, but Safari, SMS, network, and email protection still require native extensions or verified backend connectors.
