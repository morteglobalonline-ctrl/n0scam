import IdentityLookup

final class MessageFilterExtension: ILMessageFilterExtension {}

extension MessageFilterExtension: ILMessageFilterQueryHandling {
    func handle(_ queryRequest: ILMessageFilterQueryRequest, context: ILMessageFilterExtensionContext, completion: @escaping (ILMessageFilterQueryResponse) -> Void) {
        // IdentityLookup invokes this target only for an unknown sender. Keep the
        // decision local and never log, persist, or upload the message body.
        let assessment = MessageRiskClassifier.classify(queryRequest.messageBody ?? "")
        let response = ILMessageFilterQueryResponse()
        response.action = assessment.shouldFilterAsJunk ? .junk : .none
        completion(response)
    }
}
