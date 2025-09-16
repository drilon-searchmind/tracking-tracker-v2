"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomerModal from "@/app/components/Dashboard/CustomerModal.jsx";
import { FaMoon, FaHome, FaChartLine, FaUserCog, FaUserCircle } from "react-icons/fa";
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
                            <a href="/home" className="hover:text-black flex items-center gap-2 m-0 p-0 text-zinc-700">
                                <FaHome /> Home
                            </a>
                            <button onClick={() => setShowModal(true)} className="text-zinc-700 cursor-pointer hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaChartLine /> Performance Dashboard
                            </button>
                            <a href="/admin" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaUserCog /> Admin
                            </a>
                            <a href="/my-profile" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaUserCircle /> My Profile
                            </a>
                            <a href="#" className="hover:text-black line-through hidden">Tracking Tracker</a>
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