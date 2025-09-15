import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;

            console.log("Middleware executed for path:", path);
            console.log("Token exists:", !!token);
            
            if (token) {
                console.log("Token contains:", {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    isAdmin: token.isAdmin
                });
                
                // Remove the admin path redirect - let the layout handle showing the unauthorized component
                // Admin routes will be handled by the layout component showing UnauthorizedAccess
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
    matcher: ["/dashboard/:path*", "/api/config-:path*", "/admin/:path*"],
};