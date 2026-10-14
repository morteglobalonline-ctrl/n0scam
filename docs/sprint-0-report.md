# Sprint 0 report - iOS foundation

Date: 2026-10-14

## Delivered

- Expo SDK 57 iOS-first application shell with native tabs and stack navigation.
- n0scam brand system: n0 Green, black/white palette, Sora typography, real source logo, and project app icon.
- Home, Scan, Protection, History, Settings, Privacy, Module Detail, Link Analysis, Message Analysis, QR Scanner, and Risk Result screens.
- Working on-device preliminary URL and message heuristics with explicit uncertainty and missing-data disclosure.
- Camera and photo-library QR flows that never auto-open decoded content.
- Shared contracts for risk, protection, integrations, and incidents.
- Feasibility, architecture, data-flow, privacy, threat-model, and acceptance-test documents.

## Verification

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: 5/5 pass.
- `npx expo-doctor@latest`: 21/21 pass.
- `npx expo export --platform ios`: pass.
- Expo Go on iPhone 17 Pro simulator: home, link input, validation, risk result, new-analysis navigation, and QR permission fallback exercised.

## Known limitations and blockers

- Safari, Network Extension, Message Filter, Gmail, Outlook, notifications, remote Risk API, and account deletion are not implemented or presented as active.
- Physical-device camera and accessibility passes remain required.
- Apple extension entitlements and provisioning remain feasibility gates.
- `npm audit` reports transitive Expo/Metro toolchain advisories. Suggested forced fixes downgrade or break the SDK, so no unsafe automatic fix was applied; reassess with the next compatible Expo patch.

## Next sprint

1. Persist user-approved local history securely.
2. Add image-based QR import and share-extension intake.
3. Define the typed Risk API adapter and offline/error state machine.
4. Create the Safari Web Extension proof of concept in a development build.
5. Validate VoiceOver, Dynamic Type, camera behavior, and performance on a physical iPhone.
