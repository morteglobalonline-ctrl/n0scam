# Device readiness

## Current installable scope

The Expo client can be packaged as an iOS or Android development build. QR camera scanning, photo import, manual URL analysis, and manual message analysis are the only protection paths currently suitable for device testing.

No screen may describe Safari, SMS, email, or network protection as active until its native extension or backend connector has passed a fresh health check on the device.

## Build ownership gate

The EAS project must be created under the Morte-controlled Expo account. Do not initialize or build this repository while the CLI is authenticated as another organization or owner. After authenticating the correct account from `apps/mobile`:

1. Run `npx eas-cli@latest init` and review the generated `extra.eas.projectId`.
2. Run `npx eas-cli@latest build --platform ios --profile development` for a registered iPhone.
3. Run `npx eas-cli@latest build --platform android --profile development` for an Android test device.
4. Keep `preview` for internal testers and `production` for store-signed builds only.

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

1. Safari Web Extension target and enablement onboarding.
2. IdentityLookup Message Filter Extension for unknown-sender SMS/MMS; it does not cover iMessage or contacts.
3. URL Filter / Network Extension proof of concept with the required Apple capability and privacy-preserving rule service.
4. Share extension for links and message text handed off from other apps.
5. Gmail and Outlook OAuth PKCE connectors backed by a server-side token vault, webhook reconciliation, revoke, and deletion flows.
6. Versioned live Risk API with threat feeds, redirect isolation, rate limiting, evidence provenance, and offline fallback.
7. APNs/FCM notifications, secure local history, account export/deletion, privacy labels, and store review evidence.

Expo Go is not an acceptance environment for the native-extension work. Those targets require a development build, signing/provisioning, and physical-device tests.
