"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Nav() {
    const { data: session } = useSession()

    return (
        <section id="componentNav">
            <nav className="flex justify-between items-center container mx-auto">
                <div className="flex items-center gap-4 py-8">
                    <Image
                        src="/images/searchmind/662bb267ab2bf43bace3bdc7_searchmind-logo.svg"
                        alt="logo"
                        width={20}
                        height={30}
                        className="w-full max-w-[50px] object-contain"
                    />
                    <a href="/" className="">
                        <span className="text-lg">Searchmind Hub</span>
                        {session ? (
                            <p className="m-0 text-xs">{session.user.email}</p>
                        ) : null}
                    </a>

                </div>
                <div className="flex items-center gap-8">
                    {session ? (
                        <>
                            <a href="/home" className="hover:text-black">Home</a>
                            <a href="/dashboard" className="hover:text-black">Performance Dashboard</a>
                            <a href="#" className="hover:text-black line-through">Tracking Tracker</a>
                            <a href="#" className="hover:text-black line-through">Clients</a>
                            <button className="bg-[var(--color-primary-searchmind)] py-3 px-8 rounded-full text-black hover:cursor" onClick={() => signOut()}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button className="bg-[var(--color-primary-searchmind)] py-3 px-8 rounded-full text-black" onClick={() => signIn("google")}>
                            Sign In
                        </button>
                    )}
                </div>
            </nav>
        </section>
    )
}