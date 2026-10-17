# Device readiness

## Current installable scope

The Expo client can be packaged as an iOS or Android development or preview build. QR camera scanning, photo import, manual URL analysis, manual message analysis, on-device iOS screenshot OCR, and bounded PDF/text extraction are suitable for device testing. The Safari Web Extension, IdentityLookup Message Filter Extension, and local Share Extension now compile as native targets, but remain physical-device acceptance candidates rather than active protection modules. The Gmail mobile PKCE/status/revoke flow is also present, but stays disabled until its connector API is configured.

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

1. Safari Web Extension signed physical-device validation and enablement onboarding. The CNG/EAS target exists with only `activeTab` permission. On iOS 26.2+, the app now reads the current extension enablement through a private local Expo module; earlier iOS versions remain setup/unknown because Apple does not expose that API there.
2. IdentityLookup Message Filter Extension signed physical-device validation and enablement onboarding. The local-only, conservative target exists for unknown-sender SMS/MMS; it does not cover iMessage or contacts. Its App Group heartbeat stores only the most recent extension execution timestamp, never the sender, message body, risk signals, or filter disposition. Because iOS does not expose the current Settings toggle to the containing app, a heartbeat proves recent execution but is not presented as current enablement.
3. URL Filter / Network Extension proof of concept with the required Apple capability and privacy-preserving rule service.
4. Share Extension signed physical-device validation for user-invoked, local analysis of URLs and plain text. The target exists and deliberately does not advertise file, image, or movie access.
5. Deploy and validate the Gmail and Outlook contracts in `docs/gmail-connector.md` and `docs/outlook-connector.md` with server-side token-vault, health, revoke, and deletion guarantees.
6. Versioned live Risk API with threat feeds, redirect isolation, rate limiting, evidence provenance, and offline fallback.
7. APNs/FCM notifications, secure local history, account export/deletion, privacy labels, and store review evidence.

Expo Go is not an acceptance environment for the native-extension work. Those targets require a development build, signing/provisioning, and physical-device tests.

## Recorded device evidence — 2026-10-15

- EAS iOS simulator build `0d0b1563-192c-4271-b0a9-2a87f0d21a1b` finished from commit `0b41c7a`.
- The built app contains `n0scamSafari.appex` with extension point `com.apple.Safari.web-extension` and `n0scamMessageFilter.appex` with extension point `com.apple.identitylookup.message-filter`.
- Both extension bundles registered under the containing app on an iPhone 17 Pro simulator, and the containing app launched successfully.
- The iOS app declares camera and photo-library usage descriptions and does not declare microphone usage.
- Android preview build `9fa147a9-bb3e-4b57-bc44-4e3a9b64fe40` installed and launched on a Pixel 7 emulator without a sampled fatal exception or ANR. The device pass exposed missing Android icon fallbacks; commit `a9bb8bb` added Material counterparts.
- Replacement Android preview build `81e83b85-6404-4284-8ca3-0a7c5342cecc` finished from commit `a9bb8bb`, installed successfully on emulator `emulator-5554`, launched with a live app process, rendered the corrected dashboard/module icons, and produced no sampled AndroidRuntime or ReactNativeJS error. This build predates the later Gmail/Outlook connector commits and is not evidence for those features.
- EAS iOS simulator build `5bfa3892-6eb4-4124-bf4f-01e368e331a4` finished from commit `99ff847` with all three native targets: Safari, Message Filter, and Share.
- The three installed bundles registered in the iOS 26.2 simulator as `com.morteglobalonline.n0scam.safari`, `com.morteglobalonline.n0scam.message-filter`, and `com.morteglobalonline.n0scam.share`; the containing app still declares no microphone usage.
- Safari displayed the n0scam action in its system share sheet. The Share Extension opened the shared `https://example.com/` value, waited for an explicit `Analiz Et` action, and rendered its local uncertainty result with the analytical-not-advice disclosure.
- A local iOS 26.2 Release build linked `expo-sqlite` together with all three extensions and launched successfully. A high-risk URL result was explicitly saved, appeared in the Link/Tümü history as hostname-only metadata, and exposed a separate removal confirmation.

## Recorded connector evidence — 2026-10-16

- A clean iOS prebuild generated the App Group entitlement
  `group.com.morteglobalonline.n0scam.protection` for both the containing app and
  Message Filter target.
- The Message Filter target compiled successfully after adding the content-free
  `sms.lastEvaluationAt` heartbeat.
- A full iPhone 17 Pro simulator Release build completed with zero errors and
  linked `expo-crypto`, `expo-web-browser`, `ExtensionStorage`, `expo-sqlite`,
  and all three extension targets.
- The Gmail connection screen launched from the protection module in the
  installed Release build. With no connector API configured, it rendered the
  disabled connection state and did not fabricate an account or active status.
- The Outlook connection screen also launched from its protection module after
  the shared mail-connector refactor. It rendered the provider-specific Entra
  setup requirement and disabled OAuth action without a configured backend.
- App Group entitlement/packaging is proven in the simulator. A genuine
  IdentityLookup invocation and the resulting heartbeat still require a signed
  physical iPhone because the simulator cannot stand in for the Messages
  Settings and unknown-sender delivery path.
- A private `SafariExtensionState` Expo module autolinked into the iOS app and
  compiled in both its Release scheme and the full Release app. On an iOS 26.2
  iPhone 17 Pro simulator, the installed app queried the system state and kept
  Safari at `Yapılandır / Kurulum gerekli` while the extension was disabled.
  The check exposes no URL or browsing history and never infers enablement.
- The private `DocumentTextExtractor` Expo module and `expo-document-picker`
  autolinked successfully. The native module compiled independently and inside
  the full iOS Release app with Vision, PDFKit, local-file-only validation,
  bounded file/page sizes, and a 5,000-character output cap.
- The system photo picker opened its isolated child scene with a simulator
  screenshot fixture visible. A standalone Apple Vision acceptance harness then
  recognized the fixture's real Turkish UI and sample-message text. The desktop
  automation could not complete the final child-scene tap, so selecting that
  fixture through the app remains part of the physical-device acceptance pass.
- Notification Settings now exposes an opt-in weekly local reminder backed by
  the operating-system scheduler. It requests alert-only permission, stores no
  push token or user content, cancels duplicate schedules, and routes a reminder
  tap to the Protection screen. Physical-device delivery and denied-permission
  recovery remain acceptance checks.

Simulator registration proves packaging and target discovery, not real protection. Signed physical-iPhone enablement, unknown-sender message fixtures, Safari permission prompts, and false-positive review remain required.
