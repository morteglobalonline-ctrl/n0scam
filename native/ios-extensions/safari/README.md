# Safari Web Extension proof of concept

This directory contains the minimum-permission WebExtension surface for the future signed iOS Safari extension target.

- It requests `activeTab`, not persistent access to every website.
- It reads only the active tab URL after the user opens the extension popup.
- It performs a deterministic local pre-check and never describes an unknown URL as safe.
- It does not fetch, store, log, redirect, or automatically open the page URL.

The web assets are not yet embedded in an Xcode extension target. That target must be generated through a reviewed Expo config plugin, declared in `extra.eas.build.experimental.ios.appExtensions`, signed by the selected Apple team, and tested on a physical iPhone before the Safari module can be marked configured.
