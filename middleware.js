// filepath: c:\Users\Searchmind\Documents\DEV\INTERN\TRACKING_TRACKER_V2\tracking-tracker-v2-dbr-local_main\tracking-tracker-v2\middleware.js

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Add proper error handling to middleware
export default withAuth(
    function middleware(req) {
        try {
            // Skip processing for static assets, API routes, etc.
            const path = req.nextUrl.pathname;
            if (
                path.startsWith('/_next') ||
                path.startsWith('/api') ||           // <- skip all API routes
                path.startsWith('/api/auth') ||
                path.startsWith('/favicon.ico') ||
                path.includes('/images/')
            ) {
                return NextResponse.next();
            }
            
            const token = req.nextauth?.token;
            
            // If no token but on protected route, NextAuth will handle redirection
            if (!token) {
                return NextResponse.next();
            }
            
            // Customer access check logic
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
                        // Use absolute URL format for Vercel
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

// Specify exact paths to protect
export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/admin/:path*",
        "/home",
        "/my-profile/:path*"
    ],
};