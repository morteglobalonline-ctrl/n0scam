import UIKit
import UniformTypeIdentifiers

private let protectionAppGroup = "group.com.morteglobalonline.n0scam.protection"
private let lastShareEvaluationKey = "share.lastEvaluationAt"

final class ShareViewController: UIViewController {
    private let previewLabel = UILabel()
    private let resultLabel = UILabel()
    private let analyzeButton = UIButton(type: .system)
    private var sharedValue = ""

    override func viewDidLoad() {
        super.viewDidLoad()
        configureInterface()
        loadSharedValue()
    }

    private func configureInterface() {
        view.backgroundColor = .black
        preferredContentSize = CGSize(width: 360, height: 520)

        let brand = UILabel()
        brand.text = "n0scam"
        brand.textColor = UIColor(red: 0, green: 1, blue: 0.54, alpha: 1)
        brand.font = .systemFont(ofSize: 30, weight: .bold)

        let title = UILabel()
        title.text = "Paylaşılan İçeriği İncele"
        title.textColor = .white
        title.font = .systemFont(ofSize: 20, weight: .semibold)

        previewLabel.text = "İçerik hazırlanıyor…"
        previewLabel.textColor = UIColor(white: 0.72, alpha: 1)
        previewLabel.font = .systemFont(ofSize: 14)
        previewLabel.numberOfLines = 5
        previewLabel.accessibilityLabel = "Paylaşılan içerik önizlemesi"

        resultLabel.text = "Analiz yalnızca siz başlattığınızda cihazda yapılır."
        resultLabel.textColor = UIColor(white: 0.72, alpha: 1)
        resultLabel.font = .systemFont(ofSize: 14, weight: .medium)
        resultLabel.numberOfLines = 0

        analyzeButton.setTitle("Analiz Et", for: .normal)
        analyzeButton.titleLabel?.font = .systemFont(ofSize: 17, weight: .semibold)
        analyzeButton.backgroundColor = UIColor(red: 0, green: 1, blue: 0.54, alpha: 1)
        analyzeButton.setTitleColor(.black, for: .normal)
        analyzeButton.layer.cornerRadius = 14
        analyzeButton.heightAnchor.constraint(equalToConstant: 52).isActive = true
        analyzeButton.isEnabled = false
        analyzeButton.addTarget(self, action: #selector(analyze), for: .touchUpInside)

        let closeButton = UIButton(type: .system)
        closeButton.setTitle("Kapat", for: .normal)
        closeButton.setTitleColor(.white, for: .normal)
        closeButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        closeButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        closeButton.addTarget(self, action: #selector(close), for: .touchUpInside)

        let disclaimer = UILabel()
        disclaimer.text = "Sonuç analitiktir, tavsiye değildir. İçerik loglanmaz, saklanmaz veya yüklenmez."
        disclaimer.textColor = UIColor(white: 0.55, alpha: 1)
        disclaimer.font = .systemFont(ofSize: 11)
        disclaimer.textAlignment = .center
        disclaimer.numberOfLines = 0

        let stack = UIStackView(arrangedSubviews: [brand, title, previewLabel, resultLabel, analyzeButton, closeButton, disclaimer])
        stack.axis = .vertical
        stack.spacing = 16
        stack.translatesAutoresizingMaskIntoConstraints = false

        let scrollView = UIScrollView()
        scrollView.alwaysBounceVertical = false
        scrollView.keyboardDismissMode = .interactive
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(stack)

        NSLayoutConstraint.activate([
            scrollView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor),
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            stack.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor, constant: 22),
            stack.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor, constant: -22),
            stack.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor, constant: 24),
            stack.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor, constant: -18),
            stack.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor, constant: -44),
        ])
    }

    private func loadSharedValue() {
        let items = extensionContext?.inputItems.compactMap { $0 as? NSExtensionItem } ?? []
        let providers = items.flatMap { $0.attachments ?? [] }

        if let provider = providers.first(where: { $0.hasItemConformingToTypeIdentifier(UTType.url.identifier) }) {
            load(provider, type: .url)
        } else if let provider = providers.first(where: { $0.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) }) {
            load(provider, type: .plainText)
        } else if let text = items.compactMap(\.attributedContentText).first?.string {
            present(text)
        } else {
            showUnsupportedContent()
        }
    }

    private func load(_ provider: NSItemProvider, type: UTType) {
        provider.loadItem(forTypeIdentifier: type.identifier, options: nil) { [weak self] item, _ in
            let value: String?
            if let url = item as? URL {
                value = url.absoluteString
            } else if let url = item as? NSURL {
                value = url.absoluteString
            } else {
                value = item as? String
            }

            DispatchQueue.main.async {
                if let value { self?.present(value) } else { self?.showUnsupportedContent() }
            }
        }
    }

    private func present(_ rawValue: String) {
        let bounded = String(rawValue.replacingOccurrences(of: "\0", with: "").trimmingCharacters(in: .whitespacesAndNewlines).prefix(5_000))
        guard !bounded.isEmpty else {
            showUnsupportedContent()
            return
        }

        sharedValue = bounded
        previewLabel.text = bounded.count > 260 ? "\(bounded.prefix(260))…" : bounded
        resultLabel.text = "Hazır. Analiz Et’e dokunduğunuzda yerel işaretler değerlendirilecek."
        analyzeButton.isEnabled = true
        analyzeButton.alpha = 1
    }

    private func showUnsupportedContent() {
        previewLabel.text = "Bu paylaşımda desteklenen bir web bağlantısı veya düz metin bulunamadı."
        resultLabel.text = "Fotoğraf ve dosyalar bu uzantıda okunmaz."
        analyzeButton.isEnabled = false
        analyzeButton.alpha = 0.45
    }

    @objc private func analyze() {
        let assessment = SharedRiskClassifier.classify(sharedValue)
        // Persist only an execution heartbeat. The shared URL or text, result,
        // signal count, and destination app are never written to shared storage.
        let timestamp = Int(Date().timeIntervalSince1970 * 1_000)
        UserDefaults(suiteName: protectionAppGroup)?.set(timestamp, forKey: lastShareEvaluationKey)
        switch assessment.level {
        case .elevated:
            resultLabel.textColor = UIColor(red: 1, green: 0.23, blue: 0.27, alpha: 1)
            resultLabel.text = "Yüksek riskli işaretler bulundu (\(assessment.signalCount)). İçeriği açmadan kaynağı bağımsız doğrulayın."
        case .caution:
            resultLabel.textColor = UIColor(red: 1, green: 0.62, blue: 0.11, alpha: 1)
            resultLabel.text = "Dikkat gerektiren işaretler bulundu (\(assessment.signalCount)). Bağlantıyı veya talebi bağımsız doğrulayın."
        case .unknown:
            resultLabel.textColor = UIColor(white: 0.78, alpha: 1)
            resultLabel.text = "Belirgin yerel işaret bulunmadı. Bu, içeriğin güvenli olduğu anlamına gelmez."
        }
    }

    @objc private func close() {
        extensionContext?.completeRequest(returningItems: nil)
    }
}
