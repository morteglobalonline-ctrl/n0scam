# Platform feasibility

Status: initial technical assessment. No entitlement or store approval is assumed.

| Channel | iOS path | Required capability | Current repo status | Honest product state |
| --- | --- | --- | --- | --- |
| QR | `expo-camera` barcode scanning | Camera permission | MVP implemented | Available after permission |
| Manual URL | On-device normalization + future Risk API | Network only for remote analysis | Local preliminary analyzer implemented | Preliminary analysis |
| Manual message | Paste/share text + future content API | Share extension for local cross-app analysis | UI plus local native Share Extension implemented; physical-device acceptance pending | Not configured until verified on device |
| Shared URL/text | Native Share Extension | App extension, provisioning, share-sheet acceptance | Bounded local analyzer implemented; no file/image/movie access | Not configured until verified on device |
| Safari | Safari Web Extension | App extension, provisioning, review | CNG/EAS target implemented; physical-device acceptance pending | Not configured until verified on device |
| URL filtering | Network Extension URL Filter investigation | Apple entitlement | Not validated | Not supported yet |
| Unknown-sender SMS/MMS | IdentityLookup Message Filter Extension | App extension, provisioning, Settings enablement, false-positive review | Conservative local CNG/EAS target implemented; physical-device acceptance pending | Not configured until verified on device |
| Gmail | OAuth PKCE + Gmail API watch backend | Restricted-scope verification | Not connected | Connection required |
| Outlook | OAuth PKCE + Graph subscriptions backend | Azure app + webhook backend | Not connected | Connection required |
| Notifications | APNs through Expo Notifications | User permission + backend | Not configured | Off |

## iOS-first proof gates

1. Run the QR flow on a physical iPhone and verify that a scanned payload never opens automatically.
2. Validate the Safari Web Extension and Message Filter Extension on a signed physical iPhone; record supported inputs, latency, enablement prompts, false-positive behavior, and App Review requirements.
3. Request or rule out the Network Extension entitlement before promising cross-app link coverage.
4. Complete signed physical-device fixtures and false-positive review before presenting SMS protection as available.
5. Connect a real OAuth backend and health check before any email module may enter `ACTIVE`.

Android remains a later milestone; none of its platform capabilities are represented as complete.
