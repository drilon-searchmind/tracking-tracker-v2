"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
    return (
        <Link href="/login" className="bg-[var(--color-primary-searchmind)] py-3 px-8 rounded text-white hover:cursor">
            Log In
        </Link>
    );
}