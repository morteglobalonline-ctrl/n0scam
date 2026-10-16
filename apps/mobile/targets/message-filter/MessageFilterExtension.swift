import IdentityLookup
import Foundation

private let protectionAppGroup = "group.com.morteglobalonline.n0scam.protection"
private let lastEvaluationKey = "sms.lastEvaluationAt"

final class MessageFilterExtension: ILMessageFilterExtension {}

extension MessageFilterExtension: ILMessageFilterQueryHandling {
    func handle(_ queryRequest: ILMessageFilterQueryRequest, context: ILMessageFilterExtensionContext, completion: @escaping (ILMessageFilterQueryResponse) -> Void) {
        // IdentityLookup invokes this target only for an unknown sender. Keep the
        // decision local and never log, persist, or upload the message body.
        let assessment = MessageRiskClassifier.classify(queryRequest.messageBody ?? "")
        let response = ILMessageFilterQueryResponse()
        response.action = assessment.shouldFilterAsJunk ? .junk : .none
        // Persist only a heartbeat timestamp. Never persist the sender, body,
        // classifier signals, or disposition.
        let timestamp = Int(Date().timeIntervalSince1970 * 1_000)
        UserDefaults(suiteName: protectionAppGroup)?.set(timestamp, forKey: lastEvaluationKey)
        completion(response)
    }
}
