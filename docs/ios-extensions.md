# iOS protection extensions

The Expo app contains three generated native targets under `apps/mobile/targets`.
All three targets are intentionally conservative and remain unavailable in the UI
until signed physical-device acceptance has been completed.

## Safari Web Extension

- Target: `n0scamSafari`
- Bundle identifier: `com.morteglobalonline.n0scam.safari`
- Permission: `activeTab` only
- Reads the active tab URL only after the user opens the extension popup.
- Performs a deterministic local pre-check without fetching, storing, logging,
  redirecting, or automatically opening the URL.
- Unknown or low-signal URLs are never described as safe.
- On iOS 26.2 and later, the containing app reads the current enablement state
  through `SFSafariExtensionManager`. Only the `available` and `enabled`
  booleans cross the native bridge; browsing data never does.
- On earlier iOS versions the system API is unavailable, so the app keeps the
  module in an honest setup/unknown state instead of claiming protection.

## Message Filter Extension

- Target: `n0scamMessageFilter`
- Bundle identifier: `com.morteglobalonline.n0scam.message-filter`
- Extension point: Apple IdentityLookup message filter
- Runs only for messages that iOS presents from unknown senders.
- Keeps the message body on device and does not log, persist, or upload it.
- Writes only `sms.lastEvaluationAt`, a millisecond timestamp, to the shared App
  Group after iOS invokes the extension. The containing app uses this as evidence
  of recent execution, not as proof that the Settings toggle remains enabled.
- Returns `.junk` only when a suspicious destination and at least two
  independent pressure categories cross the high-confidence threshold.
- Returns `.none` for ordinary, ambiguous, or copy-only messages.

## Share Extension

- Target: `n0scamShare`
- Bundle identifier: `com.morteglobalonline.n0scam.share`
- Extension point: `com.apple.share-services`
- Accepts one shared web URL or plain text; it does not advertise image, movie,
  file, or broad attachment support.
- Shows a bounded preview and waits for the user to tap `Analiz Et`.
- Performs a deterministic local pre-check inside the extension without
  logging, persisting, uploading, or automatically opening the content.
- Unknown or low-signal content is never described as safe.

The containing app accepts bounded, non-executing handoff routes:

- `n0scam://link-analysis?source=safari-extension&value=<percent-encoded-url>`
- `n0scam://message-analysis?source=share-extension&value=<percent-encoded-text>`

Receiving either route only pre-fills the relevant form. It never opens a URL
or starts remote analysis without an explicit user action.

## Local verification

Regenerate the iOS project and compile all extension targets:

```sh
cd apps/mobile
npx expo prebuild --platform ios --clean --no-install
xcodebuild -project ios/n0scam.xcodeproj -target n0scamSafari -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
xcodebuild -project ios/n0scam.xcodeproj -target n0scamMessageFilter -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
xcodebuild -project ios/n0scam.xcodeproj -target n0scamShare -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
xcodebuild -workspace ios/n0scam.xcworkspace -scheme SafariExtensionState -configuration Release -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
```

Run the deterministic message-filter test fixture on macOS:

```sh
swiftc apps/mobile/targets/message-filter/MessageRiskClassifier.swift tests/ios/message-filter/main.swift -o /tmp/n0scam-message-filter-tests
/tmp/n0scam-message-filter-tests
swiftc apps/mobile/targets/share/SharedRiskClassifier.swift tests/ios/share/main.swift -o /tmp/n0scam-share-tests
/tmp/n0scam-share-tests
```

Compilation and simulator embedding do not replace signed physical-iPhone
validation, Settings enablement, false-positive review, and App Review evidence.
