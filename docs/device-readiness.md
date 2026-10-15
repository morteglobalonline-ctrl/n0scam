# Device readiness

## Current installable scope

The Expo client can be packaged as an iOS or Android development or preview build. QR camera scanning, photo import, manual URL analysis, and manual message analysis are suitable for device testing. The Safari Web Extension, IdentityLookup Message Filter Extension, and local Share Extension now compile as native targets, but remain physical-device acceptance candidates rather than active protection modules.

No screen may describe Safari, SMS, email, or network protection as active until its native extension or backend connector has passed a fresh health check on the device.

## Build ownership

The repository is linked to the existing Expo project `@haqd/n0scam` with project ID `d1bc6795-2b01-4b79-b766-cf9257efb4b9`, as explicitly authorized by the product owner. From `apps/mobile`:

1. Run `npx eas-cli@latest whoami` and verify the authorized account before changing project ownership or credentials.
2. Run `npx eas-cli@latest build --platform ios --profile development` for a registered iPhone.
3. Run `npx eas-cli@latest build --platform android --profile development` for an Android test device.
4. Keep `preview` for internal testers and `production` for store-signed builds only.

`preview-simulator` embeds the JavaScript bundle for isolated simulator acceptance testing without exposing a Metro development server on the local network.

## Physical-device acceptance gate

- Camera permission grant, denial, and Settings recovery.
- QR payloads containing HTTPS, HTTP, custom schemes, Wi-Fi data, contacts, and malformed text.
- Confirmation that no decoded payload opens automatically.
- Photo-library denial and QR import from screenshots.
- Offline startup and offline local analysis.
- Large Dynamic Type, VoiceOver/TalkBack, Reduce Motion, and dark appearance.
- Background/foreground camera lifecycle and battery/thermal behavior.
- Small and large phones on supported OS versions.

## Native protection roadmap

1. Safari Web Extension signed physical-device validation and enablement onboarding. The CNG/EAS target exists with only `activeTab` permission.
2. IdentityLookup Message Filter Extension signed physical-device validation and enablement onboarding. The local-only, conservative target exists for unknown-sender SMS/MMS; it does not cover iMessage or contacts.
3. URL Filter / Network Extension proof of concept with the required Apple capability and privacy-preserving rule service.
4. Share Extension signed physical-device validation for user-invoked, local analysis of URLs and plain text. The target exists and deliberately does not advertise file, image, or movie access.
5. Gmail and Outlook OAuth PKCE connectors backed by a server-side token vault, webhook reconciliation, revoke, and deletion flows.
6. Versioned live Risk API with threat feeds, redirect isolation, rate limiting, evidence provenance, and offline fallback.
7. APNs/FCM notifications, secure local history, account export/deletion, privacy labels, and store review evidence.

Expo Go is not an acceptance environment for the native-extension work. Those targets require a development build, signing/provisioning, and physical-device tests.

## Recorded device evidence — 2026-10-15

- EAS iOS simulator build `0d0b1563-192c-4271-b0a9-2a87f0d21a1b` finished from commit `0b41c7a`.
- The built app contains `n0scamSafari.appex` with extension point `com.apple.Safari.web-extension` and `n0scamMessageFilter.appex` with extension point `com.apple.identitylookup.message-filter`.
- Both extension bundles registered under the containing app on an iPhone 17 Pro simulator, and the containing app launched successfully.
- The iOS app declares camera and photo-library usage descriptions and does not declare microphone usage.
- Android preview build `9fa147a9-bb3e-4b57-bc44-4e3a9b64fe40` installed and launched on a Pixel 7 emulator without a sampled fatal exception or ANR. The device pass exposed missing Android icon fallbacks; commit `a9bb8bb` adds Material counterparts and its replacement EAS build is the acceptance candidate.

Simulator registration proves packaging and target discovery, not real protection. Signed physical-iPhone enablement, unknown-sender message fixtures, Safari permission prompts, and false-positive review remain required.
