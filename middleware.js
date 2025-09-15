import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;

            // Add logging for debugging in production
            console.log("Middleware path:", path);
            console.log("Middleware token exists:", !!token);
            
            if (path.startsWith('/admin') && token) {
                // Check if the user is an admin
                const isAdmin = token?.isAdmin === true;
                console.log("Is admin:", isAdmin);

                // If not admin, redirect to home page
                if (!isAdmin) {
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
            
            // For all other protected routes, proceed as before
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware error:", error);
            // In case of error, allow the request to continue 
            // NextAuth will handle unauthorized access appropriately
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