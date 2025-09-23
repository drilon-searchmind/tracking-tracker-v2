import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;
            const searchParams = req.nextUrl.searchParams;
            
            if (path.includes('/login') || path.includes('/api/auth')) {
                return NextResponse.next();
            }
            
            if (!token) return NextResponse.next();
            
            if (searchParams.has('noRedirect')) {
                const url = new URL(req.url);
                url.searchParams.delete('noRedirect');
                return NextResponse.rewrite(url);
            }
            
            const customerMatch = path.match(/\/dashboard\/([^\/]+)/);
            if (customerMatch) {
            }

            return NextResponse.next();
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.next();
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/api/config-:path*", 
        "/admin/:path*",
        "/home",
        "/my-profile/:path*",
        "/((?!login|api/auth).)*"
    ],
};