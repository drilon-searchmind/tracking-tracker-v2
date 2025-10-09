import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            if (
                path.startsWith('/_next') ||
                path.startsWith('/api') ||
                path.startsWith('/api/auth') ||
                path.startsWith('/favicon.ico') ||
                path.includes('/images/')
            ) {
                return NextResponse.next();
            }
            
            const token = req.nextauth?.token;
            
            if (!token) {
                return NextResponse.next();
            }
            
            const customerMatch = path.match(/\/dashboard\/([^\/]+)/);
            if (customerMatch) {
                const customerId = customerMatch[1];
                
                if (!token.isAdmin) {
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
        "/admin/:path*",
        "/home",
        "/my-profile/:path*"
    ],
};