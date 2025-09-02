import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Handle admin page routes
    if (pathname.startsWith("/admin")) {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

            if (decoded.role !== "admin") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        } catch (err) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Handle admin API routes
    if (pathname.startsWith("/api/admin")) {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

            if (decoded.role !== "admin") {
                return NextResponse.json(
                    { error: "Admin access required" },
                    { status: 403 }
                );
            }
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*']
};