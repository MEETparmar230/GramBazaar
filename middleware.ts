import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    return handleAuth(req, "admin", "/login");
  }

  // Protect admin APIs
  if (pathname.startsWith("/api/admin")) {
    return handleAuth(req, "admin");
  }

  // Protect user APIs (logged-in users only)
  if (pathname.startsWith("/api/users")) {
    return handleAuth(req, "user"); // ✅ role "user" or higher
  }

  return NextResponse.next();
}

function handleAuth(req: NextRequest, requiredRole: "admin" | "user", redirectUrl?: string) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return redirectUrl
      ? NextResponse.redirect(new URL(redirectUrl, req.url))
      : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Role check for admin
    if (requiredRole === "admin" && decoded.role !== "admin") {
      return redirectUrl
        ? NextResponse.redirect(new URL("/", req.url))
        : NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // 🔥 Attach user info to request headers
    const res = NextResponse.next();
    res.headers.set("x-user-id", decoded.id);
    res.headers.set("x-user-role", decoded.role);
    return res;
  } catch (err) {
    return redirectUrl
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/users/:path*"], 
};
