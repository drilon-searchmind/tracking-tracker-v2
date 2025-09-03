"use client"

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./contexts/ToastContext";
import Nav from "./components/UI/Nav";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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