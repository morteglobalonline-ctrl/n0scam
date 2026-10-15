import Foundation

private struct TestCase {
    let name: String
    let body: String
    let expected: Bool
}

private let cases = [
    TestCase(
        name: "high-confidence phishing message",
        body: "ACİL: PayPal hesabınız askıya alınacak. Şifrenizle hemen giriş yapın: http://paypal-login-account-check.top",
        expected: true
    ),
    TestCase(
        name: "legitimate transaction notification",
        body: "Amazon.com.tr siparişiniz gönderildi. Kartınızdan 420 TL tahsil edildi.",
        expected: false
    ),
    TestCase(
        name: "pressure language without a suspicious destination",
        body: "Acil ödeme bildirimi: kart ve şifre bilgilerinizi kimseyle paylaşmayın.",
        expected: false
    ),
    TestCase(
        name: "ordinary personal message",
        body: "Akşam saat yedide görüşelim mi?",
        expected: false
    ),
]

var failures = 0

for test in cases {
    let assessment = MessageRiskClassifier.classify(test.body)
    if assessment.shouldFilterAsJunk == test.expected {
        print("PASS: \(test.name)")
    } else {
        failures += 1
        print("FAIL: \(test.name) expected \(test.expected), received \(assessment.shouldFilterAsJunk)")
    }
}

if failures > 0 {
    exit(EXIT_FAILURE)
}

print("All \(cases.count) message-filter tests passed.")
