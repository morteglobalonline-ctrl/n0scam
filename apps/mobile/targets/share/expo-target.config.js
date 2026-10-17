/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'share',
  name: 'n0scamShare',
  displayName: 'n0scam ile İncele',
  bundleIdentifier: '.share',
  deploymentTarget: '16.4',
  frameworks: ['UniformTypeIdentifiers'],
  entitlements: {
    'com.apple.security.application-groups': config.ios.entitlements['com.apple.security.application-groups'],
  },
});
