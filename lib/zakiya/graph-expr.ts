// Tiny, safe expression language for graph figures (no eval / Function).
// Grammar: numbers, + − * / ^ (right-assoc), parentheses, unary minus, one variable,
// pi, and functions sqrt, sin, cos, tan (degrees), exp, ln.
// The same strings are re-evaluated in Python by scripts/zakiya/check, so keep it to this subset.

export type Expr =
  | { k: "num"; v: number }
  | { k: "var" }
  | { k: "neg"; a: Expr }
  | { k: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Expr; b: Expr }
  | { k: "fn"; f: Fn; a: Expr };

type Fn = "sqrt" | "sin" | "cos" | "tan" | "exp" | "ln";
const FNS: readonly Fn[] = ["sqrt", "sin", "cos", "tan", "exp", "ln"];
const RAD = Math.PI / 180;

type Tok = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const s = src.replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const m = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(s.slice(i));
      if (!m) throw new Error(`Bad number at ${i} in "${src}"`);
      out.push({ t: "num", v: Number(m[0]) });
      i += m[0].length;
    } else if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i))!;
      out.push({ t: "id", v: m[0] });
      i += m[0].length;
    } else if ("+-*/^()".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
    } else throw new Error(`Unexpected "${c}" in "${src}"`);
  }
  return out;
}

/** Parses `src` with `variable` as the only free name. Throws on anything else. */
export function parseExpr(src: string, variable = "x"): Expr {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek()!.v === v;
  const expect = (v: string) => {
    if (!isOp(v)) throw new Error(`Expected "${v}" in "${src}"`);
    p++;
  };
  // sum := term (("+"|"-") term)*
  const sum = (): Expr => {
    let a = term();
    while (isOp("+") || isOp("-")) {
      const op = toks[p++].v as "+" | "-";
      a = { k: "bin", op, a, b: term() };
    }
    return a;
  };
  // term := unary (("*"|"/") unary | implicit-multiply)*
  const term = (): Expr => {
    let a = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = toks[p++].v as "*" | "/";
        a = { k: "bin", op, a, b: unary() };
      } else if (peek() && (peek()!.t === "id" || peek()!.t === "num" || isOp("("))) {
        a = { k: "bin", op: "*", a, b: unary() }; // 2t, 3(t+1)
      } else return a;
    }
  };
  // unary := "-" unary | power   (so -t^2 = -(t^2))
  const unary = (): Expr => {
    if (isOp("-")) {
      p++;
      return { k: "neg", a: unary() };
    }
    if (isOp("+")) {
      p++;
      return unary();
    }
    return power();
  };
  // power := atom ("^" unary)?   right-assoc
  const power = (): Expr => {
    const a = atom();
    if (isOp("^")) {
      p++;
      return { k: "bin", op: "^", a, b: unary() };
    }
    return a;
  };
  const atom = (): Expr => {
    const tk = peek();
    if (!tk) throw new Error(`Unexpected end of "${src}"`);
    if (tk.t === "num") {
      p++;
      return { k: "num", v: tk.v };
    }
    if (tk.t === "op" && tk.v === "(") {
      p++;
      const e = sum();
      expect(")");
      return e;
    }
    if (tk.t === "id") {
      p++;
      if (tk.v === variable) return { k: "var" };
      if (tk.v === "pi") return { k: "num", v: Math.PI };
      if ((FNS as readonly string[]).includes(tk.v)) {
        expect("(");
        const a = sum();
        expect(")");
        return { k: "fn", f: tk.v as Fn, a };
      }
      throw new Error(`Unknown name "${tk.v}" in "${src}" (variable is "${variable}")`);
    }
    throw new Error(`Unexpected "${tk.v}" in "${src}"`);
  };
  const e = sum();
  if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}" in "${src}"`);
  return e;
}

export function evalExpr(e: Expr, x: number): number {
  if (e.k === "num") return e.v;
  if (e.k === "var") return x;
  if (e.k === "neg") return -evalExpr(e.a, x);
  if (e.k === "fn") {
    const a = evalExpr(e.a, x);
    if (e.f === "sqrt") return Math.sqrt(a);
    if (e.f === "sin") return Math.sin(a * RAD);
    if (e.f === "cos") return Math.cos(a * RAD);
    if (e.f === "tan") return Math.tan(a * RAD);
    if (e.f === "exp") return Math.exp(a);
    return Math.log(a);
  }
  const a = evalExpr(e.a, x);
  const b = evalExpr(e.b, x);
  if (e.op === "+") return a + b;
  if (e.op === "-") return a - b;
  if (e.op === "*") return a * b;
  if (e.op === "/") return a / b;
  return Math.pow(a, b);
}

/** Compiles an expression string to f(x). */
export function compileExpr(src: string, variable = "x"): (x: number) => number {
  const e = parseExpr(src, variable);
  return (x) => evalExpr(e, x);
}

/** Central-difference derivative (h scaled to x). */
export function derivative(f: (x: number) => number, x: number, h = 1e-4 * Math.max(1, Math.abs(x))): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Composite Simpson's rule on [a, b] with n (even) intervals. */
export function integrate(f: (x: number) => number, a: number, b: number, n = 400): number {
  if (a === b) return 0;
  const m = n % 2 ? n + 1 : n;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/** y on a polyline of [x, y] points (sorted by x), or NaN outside it. At a vertical step
 *  (two points with the same x) returns the later point's y. */
export function polylineAt(pts: [number, number][], x: number): number {
  if (!pts.length || x < pts[0][0] || x > pts[pts.length - 1][0]) return NaN;
  for (let i = pts.length - 1; i > 0; i--) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (x >= x0 && x <= x1) return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[0][1];
}

/** Slope of the polyline segment containing x (the later segment at a vertex). */
export function polylineSlope(pts: [number, number][], x: number): number {
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (x1 === x0) continue;
    if (x >= x0 && (x < x1 || i === pts.length - 1)) return (y1 - y0) / (x1 - x0);
  }
  return NaN;
}

/** Exact signed area under a polyline between a and b (trapezia, vertical steps add nothing). */
export function polylineArea(pts: [number, number][], a: number, b: number): number {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const l = Math.max(x0, lo);
    const r = Math.min(x1, hi);
    if (r <= l || x1 === x0) continue;
    const yl = y0 + ((y1 - y0) * (l - x0)) / (x1 - x0);
    const yr = y0 + ((y1 - y0) * (r - x0)) / (x1 - x0);
    s += ((yl + yr) / 2) * (r - l);
  }
  return a <= b ? s : -s;
}
