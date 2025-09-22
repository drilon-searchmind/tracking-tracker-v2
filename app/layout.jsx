"use client"

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./contexts/ToastContext";
import Nav from "./components/UI/Nav";

import { Geist, Geist_Mono } from "next/font/google";
import { Fustat } from "next/font/google";
import "./globals.css"

const fustat = Fustat({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-fustat',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${fustat.variable} ${fustat.variable} antialiased`}
            >
                <SessionProvider>
                    <ToastProvider>
                        <Nav />
                        {children}
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}