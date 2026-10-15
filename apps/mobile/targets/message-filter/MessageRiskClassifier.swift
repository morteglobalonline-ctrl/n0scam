import Foundation

struct MessageRiskAssessment: Equatable {
    let shouldFilterAsJunk: Bool
    let signalCount: Int
}

enum MessageRiskClassifier {
    private static let urgencyTerms = [
        "acil", "hemen", "son sans", "askiya", "kapatilacak", "urgent", "act now", "suspended"
    ]
    private static let credentialTerms = [
        "sifre", "parola", "dogrulama kodu", "kodunuzu", "otp", "password", "login", "giris yap"
    ]
    private static let paymentTerms = [
        "odeme", "kart", "iban", "havale", "borc", "ceza", "ucret", "payment", "credit card", "gift card", "crypto"
    ]
    private static let prizeTerms = [
        "kazandiniz", "hediye", "odul", "prize", "winner"
    ]
    private static let suspiciousTLDs = Set(["zip", "top", "click", "support", "live", "cam", "xyz"])
    private static let shortenerHosts = Set(["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy"])
    private static let officialBrandHosts = [
        "apple": ["apple.com"],
        "paypal": ["paypal.com"],
        "amazon": ["amazon.com", "amazon.com.tr"],
        "netflix": ["netflix.com"],
        "instagram": ["instagram.com"]
    ]

    static func classify(_ rawBody: String) -> MessageRiskAssessment {
        let body = normalized(rawBody.prefix(8_000))
        guard !body.isEmpty else {
            return MessageRiskAssessment(shouldFilterAsJunk: false, signalCount: 0)
        }

        let hasUrgency = containsAny(body, urgencyTerms)
        let hasCredentialRequest = containsAny(body, credentialTerms)
        let hasPaymentPressure = containsAny(body, paymentTerms)
        let hasPrizeBait = containsAny(body, prizeTerms)
        let linkRisk = highestLinkRisk(in: String(rawBody.prefix(8_000)))

        let categoryCount = [hasUrgency, hasCredentialRequest, hasPaymentPressure, hasPrizeBait]
            .filter { $0 }
            .count
        var score = linkRisk
        if hasUrgency { score += 1 }
        if hasCredentialRequest { score += 2 }
        if hasPaymentPressure { score += 2 }
        if hasPrizeBait { score += 2 }

        // Do not move a message out of the inbox based on copy alone. A suspicious
        // web destination plus at least two independent pressure categories are
        // required to minimize false positives.
        let shouldFilter = linkRisk >= 2 && categoryCount >= 2 && score >= 5
        return MessageRiskAssessment(shouldFilterAsJunk: shouldFilter, signalCount: categoryCount + (linkRisk > 0 ? 1 : 0))
    }

    private static func normalized<S: StringProtocol>(_ value: S) -> String {
        String(value)
            .folding(options: [.caseInsensitive, .diacriticInsensitive], locale: Locale(identifier: "tr_TR"))
            .lowercased()
    }

    private static func containsAny(_ body: String, _ terms: [String]) -> Bool {
        terms.contains { body.contains($0) }
    }

    private static func highestLinkRisk(in body: String) -> Int {
        guard let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue) else {
            return 0
        }

        let range = NSRange(body.startIndex..<body.endIndex, in: body)
        return detector.matches(in: body, options: [], range: range)
            .compactMap(\.url)
            .map(linkRisk)
            .max() ?? 0
    }

    private static func linkRisk(_ url: URL) -> Int {
        guard let hostValue = url.host else { return 0 }
        let host = hostValue.lowercased()
        var score = 0

        if url.scheme?.lowercased() == "http" { score += 2 }
        if url.user != nil || url.password != nil { score += 3 }
        if host.contains("xn--") { score += 2 }
        if host.range(of: #"^\d{1,3}(\.\d{1,3}){3}$"#, options: .regularExpression) != nil { score += 2 }
        if suspiciousTLDs.contains(host.split(separator: ".").last.map(String.init) ?? "") { score += 1 }
        if host.filter({ $0 == "-" }).count >= 3 { score += 1 }
        if shortenerHosts.contains(host) { score += 2 }

        for (brand, officialHosts) in officialBrandHosts where host.contains(brand) {
            let isOfficial = officialHosts.contains { host == $0 || host.hasSuffix(".\($0)") }
            if !isOfficial { score += 2 }
        }

        return score
    }
}
