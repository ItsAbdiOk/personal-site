// Paste into the browser console / javascript_tool on /zakiya/<slug>. Evaluates to a JSON string.
// Expands worked examples + steps, scans Notes then Exam practice tabs for inline <svg> text problems:
//   text-text overlap, text-clipped (crosses viewBox edge), text-on-stroke (stroke-width >= 2 path/line/polyline).
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const txt = (b) => (b.innerText || '').trim();
  async function expandAll() {
    for (let pass = 0; pass < 12; pass++) {
      let n = 0;
      for (const b of document.querySelectorAll('button')) {
        const t = txt(b);
        if (/WORKED EXAMPLE/i.test(t) && b.getAttribute('aria-expanded') === 'false') { b.click(); n++; }
        else if (/^(show all|show step|reveal|show answer|show mark|show solution|show hint|mark scheme|show working)/i.test(t)) { b.click(); n++; }
      }
      if (!n) break;
      await sleep(250);
    }
  }
  const results = [];
  const seen = new Set();
  function scanSvgs(area) {
    const svgs = [...document.querySelectorAll('svg')].filter((s) => {
      const vb = s.viewBox && s.viewBox.baseVal;
      return vb && vb.width > 100 && s.querySelector('text') && s.getClientRects().length;
    });
    svgs.forEach((svg) => {
      if (seen.has(svg)) return; seen.add(svg);
      const idx = seen.size - 1;
      const alt = (svg.getAttribute('aria-label') || (svg.querySelector('title') || {}).textContent ||
        (svg.closest('figure') || {innerText: ''}).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      const vb = svg.viewBox.baseVal;
      const toRoot = (el, bb) => {
        const m = el.getCTM(), r = svg.getCTM();
        if (!m || !r) return null;
        const M = r.inverse().multiply(m);
        const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(M));
        const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
        return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
      };
      const items = [];
      svg.querySelectorAll('text, tspan').forEach((el) => {
        let own;
        if (el.tagName.toLowerCase() === 'text') own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        else own = !!el.textContent.trim() && ![...el.children].some((c) => c.tagName.toLowerCase() === 'tspan');
        if (!own) return;
        if (el.getClientRects().length === 0 && !el.getBBox().width) return;
        const bb = el.getBBox();
        if (!bb.width) return;
        const b = toRoot(el, bb); if (!b) return;
        items.push({ el, b, s: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) });
      });
      const rec = (type, a, b, extra) => results.push({ area, figure: idx, alt, type, a: a, b: b || null, ...extra });
      const inset = (b) => ({ x0: b.x0 + 1, y0: b.y0 + 1, x1: b.x1 - 1, y1: b.y1 - 1 });
      // text-text
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
        const A = items[i], B = items[j];
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const a = inset(A.b), b = inset(B.b);
        const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (w > 0 && h > 0 && w * h > 2) rec('text-overlap', A.s, B.s, { area_px2: Math.round(w * h) });
      }
      // clipped
      items.forEach((it) => {
        const t = 0.5, b = it.b;
        const sides = [];
        if (b.x0 < vb.x - t) sides.push('left'); if (b.y0 < vb.y - t) sides.push('top');
        if (b.x1 > vb.x + vb.width + t) sides.push('right'); if (b.y1 > vb.y + vb.height + t) sides.push('bottom');
        if (sides.length) rec('text-clipped', it.s, null, { sides: sides.join(',') });
      });
      // text on stroke
      const strokes = [...svg.querySelectorAll('line, path, polyline, polygon')].filter((e) => {
        const cs = getComputedStyle(e);
        return cs.stroke !== 'none' && parseFloat(cs.strokeWidth) >= 2 && e.getTotalLength;
      });
      strokes.forEach((e) => {
        let L; try { L = e.getTotalLength(); } catch (x) { return; }
        if (!L) return;
        const bb = e.getBBox(), eb = toRoot(e, bb);
        const sw = parseFloat(getComputedStyle(e).strokeWidth);
        const pts = [];
        const N = Math.min(400, Math.max(20, Math.ceil(L / 1.5)));
        const M = svg.getCTM().inverse().multiply(e.getCTM());
        for (let k = 0; k <= N; k++) { const p = e.getPointAtLength(L * k / N); pts.push(new DOMPoint(p.x, p.y).matrixTransform(M)); }
        items.forEach((it) => {
          const b = inset(it.b);
          if (eb.x1 < b.x0 || eb.x0 > b.x1 || eb.y1 < b.y0 || eb.y0 > b.y1) return;
          if (pts.some((p) => p.x > b.x0 && p.x < b.x1 && p.y > b.y0 && p.y < b.y1))
            rec('text-on-stroke', it.s, (e.tagName + (e.getAttribute('d') || e.getAttribute('points') || [e.getAttribute('x1'), e.getAttribute('y1'), e.getAttribute('x2'), e.getAttribute('y2')].join(',')).slice(0, 40)), { strokeWidth: sw });
        });
      });
    });
  }
  const tabs = [...document.querySelectorAll('[role=tab]')];
  const tabBy = (re) => tabs.find((t) => re.test(txt(t)));
  const order = [['Notes', tabBy(/^Notes/i)], ['Exam', tabBy(/^Exam/i)]];
  for (const [name, tab] of order) {
    if (tab) { tab.click(); await sleep(500); }
    await expandAll();
    await sleep(300);
    scanSvgs(name);
  }
  // dedupe
  const key = (r) => [r.figure, r.type, r.a, r.b].join('|');
  const uniq = [...new Map(results.map((r) => [key(r), r])).values()];
  return JSON.stringify({ svgs: seen.size, issues: uniq }, null, 1);
})()
