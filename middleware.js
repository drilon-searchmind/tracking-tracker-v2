import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;

            // More detailed logging
            console.log("Middleware executed for path:", path);
            console.log("Token exists:", !!token);
            if (token) {
                console.log("Token contains:", {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    isAdmin: token.isAdmin
                });
            }

            // Rest of your middleware
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.next();
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                console.log("Auth callback token exists:", !!token);
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/api/config-:path*", "/admin/:path*"],
};