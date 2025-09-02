"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-[var(--color-primary-searchmind)] py-3 px-8 rounded text-white hover:cursor"
        >
            Sign Out
        </button>
    );
}