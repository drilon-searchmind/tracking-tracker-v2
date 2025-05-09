"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Nav() {
    const { data: session } = useSession()

    return (
        <section id="componentNav">
            <nav className="navbar bg-base-200 p-4 flex justify-between items-center ">
                <div className="flex items-baseline gap-4">
                    <a href="/" className="text-xl font-extrabold">Tracking Tracker</a>
                    {session ? (
                        <p className="m-0">{session.user.email}</p>
                    ) : null}
                </div>
                <div className="flex gap-2">
                    {session ? (
                        <>
                            <a href="/dashboard" className="btn btn-ghost">Dashboard</a>
                            <a href="/ga4-properties" className="btn btn-ghost">GA4 Properties</a>
                            <button className="btn btn-primary" onClick={() => signOut()}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={() => signIn("google")}>
                            Sign In
                        </button>
                    )}
                </div>
            </nav>
        </section>
    )
}