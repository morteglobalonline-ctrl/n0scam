import ExpoModulesCore
import SafariServices

private let safariExtensionIdentifier = "com.morteglobalonline.n0scam.safari"

public final class SafariExtensionStateModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SafariExtensionState")

    AsyncFunction("getState") { (promise: Promise) in
      guard #available(iOS 26.2, *) else {
        promise.resolve(["available": false, "enabled": false])
        return
      }

      SFSafariExtensionManager.getStateOfExtension(withIdentifier: safariExtensionIdentifier) { state, error in
        if error != nil {
          promise.reject("SAFARI_STATE_UNAVAILABLE", "Safari uzantı durumu okunamadı.")
          return
        }
        guard let state else {
          promise.resolve(["available": false, "enabled": false])
          return
        }
        promise.resolve(["available": true, "enabled": state.isEnabled])
      }
    }
  }
}
