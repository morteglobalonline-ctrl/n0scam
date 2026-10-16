/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "message-filter",
  name: "n0scamMessageFilter",
  displayName: "n0scam Mesaj Koruması",
  bundleIdentifier: ".message-filter",
  deploymentTarget: "16.4",
  entitlements: {
    "com.apple.security.application-groups": config.ios.entitlements["com.apple.security.application-groups"],
  },
});
