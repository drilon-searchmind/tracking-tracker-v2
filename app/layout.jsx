import { ToastProvider } from "./contexts/ToastContext";
import Nav from "./components/UI/Nav";
import SessionProvider from './providers/SessionProvider';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { Geist, Geist_Mono } from "next/font/google";
import { Fustat } from "next/font/google";
import "./globals.css"

const fustat = Fustat({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-fustat',
});

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <head>
                {/* Add a meta tag to help with caching issues */}
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
            </head>
            <body
                className={`${fustat.variable} ${fustat.variable} antialiased`}
            >
                <SessionProvider session={session}>
                    <ToastProvider>
                        <Nav />
                        {children}
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}