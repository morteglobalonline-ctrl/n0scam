import ExpoModulesCore
import ImageIO
import PDFKit
import UIKit
import Vision

private let maximumExtractedCharacters = 5_000
private let maximumTextFileBytes = 512_000
private let maximumPDFBytes = 10_000_000
private let maximumPDFPages = 20
private let supportedTextExtensions = Set(["txt", "text", "md", "eml", "csv", "json"])

private func boundedResult(_ raw: String, pageCount: Int? = nil, forceTruncated: Bool = false) -> [String: Any] {
  let cleaned = raw.replacingOccurrences(of: "\0", with: "").trimmingCharacters(in: .whitespacesAndNewlines)
  let truncated = forceTruncated || cleaned.count > maximumExtractedCharacters
  var result: [String: Any] = [
    "text": String(cleaned.prefix(maximumExtractedCharacters)),
    "truncated": truncated,
  ]
  if let pageCount { result["pageCount"] = pageCount }
  return result
}

private func localFileURL(from uri: String) -> URL? {
  guard let url = URL(string: uri), url.isFileURL else { return nil }
  return url.standardizedFileURL
}

private func imageOrientation(_ orientation: UIImage.Orientation) -> CGImagePropertyOrientation {
  switch orientation {
  case .up: return .up
  case .down: return .down
  case .left: return .left
  case .right: return .right
  case .upMirrored: return .upMirrored
  case .downMirrored: return .downMirrored
  case .leftMirrored: return .leftMirrored
  case .rightMirrored: return .rightMirrored
  @unknown default: return .up
  }
}

private func fileSize(of url: URL) -> Int? {
  try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize
}

public final class DocumentTextExtractorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DocumentTextExtractor")

    AsyncFunction("recognizeImage") { (uri: String, promise: Promise) in
      guard let url = localFileURL(from: uri) else {
        promise.reject("INVALID_IMAGE_URI", "Yalnızca cihazdan seçilen yerel görseller okunabilir.")
        return
      }

      DispatchQueue.global(qos: .userInitiated).async {
        guard let image = UIImage(contentsOfFile: url.path), let cgImage = image.cgImage else {
          promise.reject("INVALID_IMAGE", "Seçilen görsel okunamadı.")
          return
        }

        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        request.recognitionLanguages = ["tr-TR", "en-US"]

        do {
          let handler = VNImageRequestHandler(cgImage: cgImage, orientation: imageOrientation(image.imageOrientation), options: [:])
          try handler.perform([request])
          let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
          promise.resolve(boundedResult(lines.joined(separator: "\n")))
        } catch {
          promise.reject("IMAGE_RECOGNITION_FAILED", "Görseldeki metin okunamadı.")
        }
      }
    }

    AsyncFunction("extractFile") { (uri: String, promise: Promise) in
      guard let url = localFileURL(from: uri) else {
        promise.reject("INVALID_FILE_URI", "Yalnızca cihazdan seçilen yerel dosyalar okunabilir.")
        return
      }

      DispatchQueue.global(qos: .userInitiated).async {
        let didAccess = url.startAccessingSecurityScopedResource()
        defer { if didAccess { url.stopAccessingSecurityScopedResource() } }

        let fileExtension = url.pathExtension.lowercased()
        if fileExtension == "pdf" {
          guard let size = fileSize(of: url), size <= maximumPDFBytes else {
            promise.reject("FILE_TOO_LARGE", "PDF dosyası en fazla 10 MB olabilir.")
            return
          }
          guard let document = PDFDocument(url: url) else {
            promise.reject("INVALID_PDF", "Seçilen PDF okunamadı.")
            return
          }
          let pagesToRead = min(document.pageCount, maximumPDFPages)
          let text = (0..<pagesToRead).compactMap { document.page(at: $0)?.string }.joined(separator: "\n")
          promise.resolve(boundedResult(text, pageCount: document.pageCount, forceTruncated: document.pageCount > pagesToRead))
          return
        }

        guard supportedTextExtensions.contains(fileExtension) else {
          promise.reject("UNSUPPORTED_FILE", "Yalnızca PDF, TXT, MD, EML, CSV ve JSON dosyaları desteklenir.")
          return
        }
        guard let size = fileSize(of: url), size <= maximumTextFileBytes else {
          promise.reject("FILE_TOO_LARGE", "Metin dosyası en fazla 500 KB olabilir.")
          return
        }
        do {
          let data = try Data(contentsOf: url, options: .mappedIfSafe)
          guard let text = String(data: data, encoding: .utf8) ?? String(data: data, encoding: .utf16) else {
            promise.reject("INVALID_TEXT_ENCODING", "Dosya metni UTF-8 veya UTF-16 olarak okunamadı.")
            return
          }
          promise.resolve(boundedResult(text))
        } catch {
          promise.reject("FILE_READ_FAILED", "Seçilen dosya okunamadı.")
        }
      }
    }
  }
}
