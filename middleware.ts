import { NextResponse, type NextRequest } from "next/server";

// /Zakiya → /zakiya. Done here, not in next.config redirects, because Vercel matches
// config redirects case-insensitively, which made /zakiya redirect to itself.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/Zakiya" || pathname.startsWith("/Zakiya/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/zakiya" + pathname.slice("/Zakiya".length);
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/Zakiya", "/Zakiya/:path*"] };
