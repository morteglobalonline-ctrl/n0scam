# n0scam Safari Web Extension

This directory is the CNG source of the signed `n0scamSafari` iOS target. `@bacons/apple-targets` links it into the generated Xcode project and declares `com.morteglobalonline.n0scam.safari` to EAS before credentials are prepared.

Privacy and behavior constraints:

- The only browser permission is `activeTab`.
- The active URL is read only after the user opens the extension popup.
- Classification is deterministic and runs locally.
- URLs are not logged, persisted, uploaded, redirected, or opened automatically.
- An ordinary URL is never labeled safe; the neutral state is `DOĞRULANAMADI`.
- Every result is described as analytical, not advice.

Run `npx expo prebuild --platform ios --clean --no-install` after target configuration changes. A successful simulator build validates compilation, but final enablement and permission behavior must still be tested on a signed physical iPhone.
