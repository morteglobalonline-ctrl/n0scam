/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = () => ({
  type: "message-filter",
  name: "n0scamMessageFilter",
  displayName: "n0scam Mesaj Koruması",
  bundleIdentifier: ".message-filter",
  deploymentTarget: "16.4",
});
