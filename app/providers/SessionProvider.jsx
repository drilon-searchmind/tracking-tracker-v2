"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children, session }) {
    return (
        <NextAuthSessionProvider 
            session={session}
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true} // Refresh when window gets focus
        >
            {children}
        </NextAuthSessionProvider>
    );
}