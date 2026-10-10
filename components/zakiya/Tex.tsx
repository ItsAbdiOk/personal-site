"use client";

import katex from "katex";
import { memo, useMemo } from "react";

/** KaTeX-typeset maths. Inline by default; `display` renders a block that scrolls
 *  horizontally on narrow screens instead of overflowing the page. Colour inherits. */
export const Tex = memo(function Tex({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "htmlAndMathml", strict: "ignore" }),
    [tex, display],
  );
  if (display)
    return (
      <div
        className={["zk-tex zk-tex-display", className].filter(Boolean).join(" ")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  return <span className={["zk-tex", className].filter(Boolean).join(" ")} dangerouslySetInnerHTML={{ __html: html }} />;
});
