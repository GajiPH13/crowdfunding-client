import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasSession = Boolean(getSessionCookie(request));

  if (protectedRoutes.some((route) => path.startsWith(route)) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (publicOnlyRoutes.includes(path) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)"],
};
