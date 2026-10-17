Pod::Spec.new do |s|
  s.name = 'DocumentTextExtractor'
  s.version = '1.0.0'
  s.summary = 'Extracts bounded text from user-selected images and documents on device.'
  s.description = 'A private local Expo module backed by Vision and PDFKit. Selected content never leaves the device.'
  s.author = 'n0scam'
  s.homepage = 'https://github.com/morteglobalonline-ctrl/n0scam'
  s.platform = :ios, '16.4'
  s.swift_version = '5.9'
  s.source = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'Vision', 'PDFKit', 'UIKit', 'ImageIO'
  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
