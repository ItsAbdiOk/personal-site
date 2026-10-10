// pdflines: dump per-page text lines with bounding boxes (PDF points, origin bottom-left) as JSON.
// usage: pdflines <pdf> <out.json>      or:  pdflines --batch  (stdin lines: "pdf<TAB>out.json")
import PDFKit
import Foundation

func esc(_ s: String) -> String {
    var o = ""
    for u in s.unicodeScalars {
        switch u {
        case "\"": o += "\\\""
        case "\\": o += "\\\\"
        case "\n": o += " "
        case "\r", "\t": o += " "
        default:
            if u.value < 0x20 { o += " " } else { o.unicodeScalars.append(u) }
        }
    }
    return o
}

func dump(_ path: String, _ out: String) {
    guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else { FileHandle.standardError.write("cannot open \(path)\n".data(using: .utf8)!); return }
    var s = "{\"pages\":["
    for i in 0..<doc.pageCount {
        guard let page = doc.page(at: i) else { continue }
        let b = page.bounds(for: .mediaBox)
        if i > 0 { s += "," }
        s += "{\"w\":\(Int(b.width)),\"h\":\(Int(b.height)),\"lines\":["
        var first = true
        if let sel = page.selection(for: b) {
            for l in sel.selectionsByLine() {
                let r = l.bounds(for: page)
                let t = (l.string ?? "").trimmingCharacters(in: .whitespaces)
                if t.isEmpty { continue }
                if !first { s += "," }
                first = false
                s += String(format: "[%.1f,%.1f,%.1f,%.1f,\"", r.minX, r.minY, r.maxX, r.maxY) + esc(t) + "\"]"
            }
        }
        s += "]}"
    }
    s += "]}"
    try? s.write(toFile: out, atomically: true, encoding: .utf8)
}

let a = CommandLine.arguments
if a.count >= 2 && a[1] == "--batch" {
    while let line = readLine() {
        let p = line.components(separatedBy: "\t")
        if p.count == 2 { dump(p[0], p[1]) }
    }
} else if a.count >= 3 {
    dump(a[1], a[2])
} else { print("usage: pdflines <pdf> <out.json> | --batch") }
