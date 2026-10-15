import Foundation

enum SharedRiskLevel: Equatable {
    case elevated
    case caution
    case unknown
}

struct SharedRiskAssessment: Equatable {
    let level: SharedRiskLevel
    let signalCount: Int
}

enum SharedRiskClassifier {
    private static let urgencyTerms = ["acil", "hemen", "son sans", "askiya", "urgent", "act now", "suspended"]
    private static let credentialTerms = ["sifre", "parola", "dogrulama kodu", "otp", "password", "login", "giris yap"]
    private static let paymentTerms = ["odeme", "kart", "iban", "havale", "borc", "ceza", "payment", "credit card", "gift card", "crypto"]
    private static let prizeTerms = ["kazandiniz", "hediye", "odul", "prize", "winner"]
    private static let suspiciousTLDs = Set(["zip", "top", "click", "support", "live", "cam", "xyz"])
    private static let shortenerHosts = Set(["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy"])

    static func classify(_ rawValue: String) -> SharedRiskAssessment {
        let bounded = String(rawValue.prefix(5_000))
        guard !bounded.isEmpty else { return SharedRiskAssessment(level: .unknown, signalCount: 0) }

        if let url = URL(string: bounded), ["http", "https"].contains(url.scheme?.lowercased() ?? ""), url.host != nil {
            return classifyURL(url)
        }

        let body = normalized(bounded)
        let categories = [
            containsAny(body, urgencyTerms),
            containsAny(body, credentialTerms),
            containsAny(body, paymentTerms),
            containsAny(body, prizeTerms),
        ].filter { $0 }.count

        return SharedRiskAssessment(
            level: categories >= 3 ? .elevated : categories >= 2 ? .caution : .unknown,
            signalCount: categories
        )
    }

    private static func classifyURL(_ url: URL) -> SharedRiskAssessment {
        let host = url.host?.lowercased() ?? ""
        var score = 0
        var signals = 0

        func add(_ points: Int) {
            score += points
            signals += 1
        }

        if url.scheme?.lowercased() == "http" { add(2) }
        if url.user != nil || url.password != nil { add(3) }
        if host.contains("xn--") { add(2) }
        if host.range(of: #"^\d{1,3}(\.\d{1,3}){3}$"#, options: .regularExpression) != nil { add(2) }
        if suspiciousTLDs.contains(host.split(separator: ".").last.map(String.init) ?? "") { add(1) }
        if host.filter({ $0 == "-" }).count >= 3 { add(1) }
        if shortenerHosts.contains(host) { add(2) }

        let brands = ["apple": "apple.com", "paypal": "paypal.com", "amazon": "amazon.com", "netflix": "netflix.com", "instagram": "instagram.com"]
        for (brand, officialHost) in brands where host.contains(brand) {
            if host != officialHost && !host.hasSuffix(".\(officialHost)") { add(2) }
        }

        return SharedRiskAssessment(
            level: score >= 4 ? .elevated : score >= 2 ? .caution : .unknown,
            signalCount: signals
        )
    }

    private static func normalized(_ value: String) -> String {
        value
            .folding(options: [.caseInsensitive, .diacriticInsensitive], locale: Locale(identifier: "tr_TR"))
            .lowercased()
    }

    private static func containsAny(_ body: String, _ terms: [String]) -> Bool {
        terms.contains { body.contains($0) }
    }
}
