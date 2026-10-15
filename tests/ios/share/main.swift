import Foundation

private let cases: [(String, String, SharedRiskLevel)] = [
    ("lookalike URL", "http://paypal-login-account-check.top", .elevated),
    ("ordinary URL", "https://example.com", .unknown),
    ("pressure message", "ACİL: Şifrenizle hemen giriş yapın ve kart ödemenizi tamamlayın.", .elevated),
    ("ordinary message", "Akşam saat yedide görüşelim mi?", .unknown),
]

var failures = 0
for (name, value, expected) in cases {
    let actual = SharedRiskClassifier.classify(value).level
    if actual == expected {
        print("PASS: \(name)")
    } else {
        failures += 1
        print("FAIL: \(name) expected \(expected), received \(actual)")
    }
}

if failures > 0 { exit(EXIT_FAILURE) }
print("All \(cases.count) share-extension tests passed.")
