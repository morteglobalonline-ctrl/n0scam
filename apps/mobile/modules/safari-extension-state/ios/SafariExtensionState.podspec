Pod::Spec.new do |s|
  s.name = 'SafariExtensionState'
  s.version = '1.0.0'
  s.summary = 'Reads the state of the bundled n0scam Safari Web Extension.'
  s.description = 'A private local Expo module that exposes only whether the bundled Safari Web Extension is available and enabled.'
  s.author = 'n0scam'
  s.homepage = 'https://github.com/morteglobalonline-ctrl/n0scam'
  s.platform = :ios, '16.4'
  s.swift_version = '5.9'
  s.source = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
