"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomerModal from "@/app/components/Dashboard/CustomerModal.jsx";

export default function Nav() {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false);

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
                        <span className="text-lg">Searchmind Core</span>
                        {session ? (
                            <p className="m-0 text-xs">{session.user.email}</p>
                        ) : null}
                    </a>

                </div>
                <div className="flex items-center gap-8">
                    {session ? (
                        <>
                            <a href="/home" className="hover:text-black">Home</a>
                            <button onClick={() => setShowModal(true)} className="hover:text-black">
                                Performance Dashboard
                            </button>
                            <a href="#" className="hover:text-black line-through">Tracking Tracker</a>
                            <a href="#" className="hover:text-black line-through">Clients</a>
                            <button className="border border-[var(--color-primary-searchmind)] bg-white py-3 px-8 rounded-full text-zinc-800 hover:cursor hover:bg-[var(--color-primary-searchmind)] hover:cursor-pointer transition-all duration-150" onClick={() => signOut()}>
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

            {showModal && <CustomerModal closeModal={() => setShowModal(false)} />}
        </section>
    )
}