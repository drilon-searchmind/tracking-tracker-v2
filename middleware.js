import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const path = req.nextUrl.pathname;
        const token = req.nextauth?.token;
        
        if (path.startsWith('/admin')) {
            const isAdmin = token?.isAdmin === true;

            if (!isAdmin) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/api/config-:path*", "/admin/:path*"],
};