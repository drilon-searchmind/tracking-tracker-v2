"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomerModal from "@/app/components/Dashboard/CustomerModal.jsx";
import { FaMoon } from "react-icons/fa";
import LogoutButton from "../Auth/LogoutButton";
import LoginButton from "../Auth/LoginButton";

export default function Nav() {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log({ session })
    }, session)

    return (
        <section id="componentNav">
            <nav className="flex justify-between items-center container mx-auto">
                <div className="flex items-center gap-4 py-8">
                    <Image
                        src="/images/searchmind/apex-icon.svg"
                        alt="logo"
                        width={20}
                        height={30}
                        className="w-full max-w-[30px] object-contain filter brightness-0"
                    />
                    <a href="/" className="">
                        <span className="text-lg text-black font-extrabold fontFamilyFustatHeading">Searchmind Apex</span>
                        {session ? (
                            <span className="flex items-center gap-2 text-xs text-gray-500">
                                <p className="m-0 text-xs">{session.user.email}</p>
                            </span>
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
                            <a href="/admin" className="hover:text-black">Admin</a>
                            <a href="#" className="hover:text-black line-through hidden">Tracking Tracker</a>
                            <a href="#" className="hover:text-black line-through">Clients</a>
                            <div className=""><FaMoon /></div>
                            <LogoutButton />
                        </>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </nav>

            {showModal && <CustomerModal closeModal={() => setShowModal(false)} />}

        </section>
    )
}