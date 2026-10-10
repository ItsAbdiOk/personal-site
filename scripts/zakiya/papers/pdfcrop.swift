// pdfcrop: render vertical bands of PDF pages to JPEG(s), stacked top-to-bottom.
// usage: pdfcrop <pdf> <outBase> <widthPx> <quality> <rot 0|1> <maxStackHeightPx> <page,yTop,yBot>...
//  page is 1-based; yTop/yBot are in *reading* coordinates (PDF points, origin bottom-left of the reading page);
//  yTop < 0 means whole page. rot=1: page content is sideways (reading coords mapped to real page by x = W - y).
import PDFKit
import AppKit

let a = CommandLine.arguments
guard a.count >= 8, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { print("bad args"); exit(1) }
let outBase = a[2]
let outW = Double(a[3])!, quality = Double(a[4])!, rot = a[5] == "1", maxH = Double(a[6])!

struct Piece { let img: CGImage }
var pieces: [CGImage] = []
for spec in a[7...] {
    let f = spec.split(separator: ",").map { String($0) }
    guard f.count == 3, let pn = Int(f[0]), let yT = Double(f[1]), let yB = Double(f[2]),
          let page = doc.page(at: pn - 1), let pg = page.pageRef else { continue }
    let mb = page.bounds(for: .mediaBox)
    var crop = mb
    if rot {
        // reading page is (mb.height x mb.width); reading y -> real x = mb.width - y
        if yT >= 0 {
            let t = min(mb.width, yT), b = max(0, yB)
            crop = CGRect(x: mb.minX + (mb.width - t), y: mb.minY, width: max(20, t - b), height: mb.height)
        }
    } else if yT >= 0 {
        let t = min(mb.maxY, yT), b = max(mb.minY, yB)
        crop = CGRect(x: mb.minX, y: b, width: mb.width, height: max(20, t - b))
    }
    let readW = rot ? Double(crop.height) : Double(crop.width)      // width of reading image in points
    let scale = outW / readW
    let pxW = Int(outW), pxH = Int((rot ? Double(crop.width) : Double(crop.height)) * scale)
    guard let ctx = CGContext(data: nil, width: pxW, height: pxH, bitsPerComponent: 8, bytesPerRow: 0,
            space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { continue }
    ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: pxW, height: pxH))
    if rot {
        ctx.translateBy(x: 0, y: Double(pxH))
        ctx.rotate(by: -Double.pi / 2)
    }
    ctx.scaleBy(x: scale, y: scale)
    ctx.translateBy(x: -crop.minX, y: -crop.minY)
    ctx.clip(to: crop)
    ctx.drawPDFPage(pg)
    if let im = ctx.makeImage() { pieces.append(im) }
}
// group pieces into stacks no taller than maxH
var groups: [[CGImage]] = []
var cur: [CGImage] = [], h = 0.0
for p in pieces {
    if !cur.isEmpty && h + Double(p.height) > maxH { groups.append(cur); cur = []; h = 0 }
    cur.append(p); h += Double(p.height) + 6
}
if !cur.isEmpty { groups.append(cur) }
for (gi, g) in groups.enumerated() {
    let totalH = g.reduce(0) { $0 + $1.height } + 6 * (g.count - 1)
    let ctx = CGContext(data: nil, width: Int(outW), height: totalH, bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    ctx.setFillColor(CGColor(red: 0.8, green: 0.8, blue: 0.8, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: Int(outW), height: totalH))
    var y = totalH
    for im in g { y -= im.height; ctx.draw(im, in: CGRect(x: 0, y: y, width: Int(outW), height: im.height)); y -= 6 }
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    let data = rep.representation(using: .jpeg, properties: [.compressionFactor: quality])!
    let path = groups.count == 1 ? outBase + ".jpg" : outBase + "-\(gi + 1).jpg"
    try! data.write(to: URL(fileURLWithPath: path))
    print(path)
}
