import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/index.html.md", "")
  return NextResponse.rewrite(
    new URL(`/md-content${path.replace("/index.html.md", "")}`, request.url)
  )
}

export const config = {
  matcher: "/((?!resources|api|ui|user-guide).*)index.html.md",
}
