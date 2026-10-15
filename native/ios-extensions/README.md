# iOS extensions

Reserved for Swift Safari Web Extension, Message Filter Extension, and any entitlement-backed Network Extension proof of concept. These capabilities require a development build, Apple provisioning, and physical-device validation; they are intentionally not simulated in Expo Go.

The containing app now accepts bounded, non-executing handoff routes for future native targets:

- `n0scam://link-analysis?source=safari-extension&value=<percent-encoded-url>`
- `n0scam://message-analysis?source=share-extension&value=<percent-encoded-text>`

Receiving either route only pre-fills the relevant form. It never opens a URL or starts a remote analysis without a user action.
