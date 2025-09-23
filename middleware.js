import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        try {
            const path = req.nextUrl.pathname;
            const token = req.nextauth?.token;
            
            if (!token) return NextResponse.next();
            
            const isRedirecting = req.nextUrl.searchParams.has('redirecting');
            if (isRedirecting) {
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
    matcher: ["/dashboard/:path*", "/api/config-:path*", "/admin/:path*"],
};