import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;
            
            // Skip middleware for login and auth API routes
            if (path.includes('/login') || path.includes('/api/auth')) {
                return NextResponse.next();
            }
            
            // If no token, let NextAuth handle it
            if (!token) return NextResponse.next();
            
            // Handle redirection flags
            const searchParams = req.nextUrl.searchParams;
            if (searchParams.has('noRedirect')) {
                const url = new URL(req.url);
                url.searchParams.delete('noRedirect');
                return NextResponse.rewrite(url);
            }
            
            // Check for customer access - match dashboard/[customerId] pattern
            const customerMatch = path.match(/\/dashboard\/([^\/]+)/);
            if (customerMatch) {
                const customerId = customerMatch[1];
                
                // Skip access check for admin users
                if (!token.isAdmin) {
                    // Check if the user has the customer in their accessible customers list
                    const accessibleCustomers = token.accessibleCustomers || [];
                    const hasAccess = accessibleCustomers.includes(customerId);
                    
                    if (!hasAccess) {
                        console.log(`Access denied: User ${token.email} attempted to access unauthorized customer ${customerId}`);
                        return NextResponse.redirect(new URL("/unauthorized", req.url));
                    }
                }
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
        "/my-profile/:path*"
    ],
};