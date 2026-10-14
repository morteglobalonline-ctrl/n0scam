# Platform feasibility

Status: initial technical assessment. No entitlement or store approval is assumed.

| Channel | iOS path | Required capability | Current repo status | Honest product state |
| --- | --- | --- | --- | --- |
| QR | `expo-camera` barcode scanning | Camera permission | MVP implemented | Available after permission |
| Manual URL | On-device normalization + future Risk API | Network only for remote analysis | Local preliminary analyzer implemented | Preliminary analysis |
| Manual message | Paste/share text + future content API | Share extension for cross-app handoff | UI foundation only | Not configured |
| Safari | Safari Web Extension | App extension, provisioning, review | Feasibility backlog | Not configured |
| URL filtering | Network Extension URL Filter investigation | Apple entitlement | Not validated | Not supported yet |
| SMS filtering | IdentityLookup Message Filter Extension | Extension + policy review | Not validated | Not configured |
| Gmail | OAuth PKCE + Gmail API watch backend | Restricted-scope verification | Not connected | Connection required |
| Outlook | OAuth PKCE + Graph subscriptions backend | Azure app + webhook backend | Not connected | Connection required |
| Notifications | APNs through Expo Notifications | User permission + backend | Not configured | Off |

## iOS-first proof gates

1. Run the QR flow on a physical iPhone and verify that a scanned payload never opens automatically.
2. Build a Safari Web Extension proof of concept and record supported URLs, latency, and App Review requirements.
3. Request or rule out the Network Extension entitlement before promising cross-app link coverage.
4. Build the Message Filter Extension with test fixtures before presenting SMS protection as available.
5. Connect a real OAuth backend and health check before any email module may enter `ACTIVE`.

Android remains a later milestone; none of its platform capabilities are represented as complete.
