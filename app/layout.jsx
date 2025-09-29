import { ToastProvider } from "./contexts/ToastContext";
import Nav from "./components/UI/Nav";
import SessionProvider from './providers/SessionProvider';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleTagManager } from '@next/third-parties/google';

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
    const gtmId = "GTM-MWM37VKJ"

    return (
        <html lang="en">
            <head>
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
                <GoogleTagManager
                    gtmId={gtmId}
                />
            </body>
        </html>
    );
}