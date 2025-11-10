"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomerModal from "@/app/components/Dashboard/CustomerModal.jsx";
import { FaMoon, FaSun, FaHome, FaChartLine, FaUserCog, FaUserCircle, FaBars, FaTimes, FaBell, FaChartBar } from "react-icons/fa";
import LogoutButton from "../Auth/LogoutButton";
import LoginButton from "../Auth/LoginButton";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Nav() {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (session?.user) {
            console.log({ session })
        }
    }, [session, router]);

    return (
        <section id="componentNav" className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <nav className="flex justify-between items-center container mx-auto px-4 md:px-0">
                <div className="flex items-center gap-3 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <Image
                                src="/images/searchmind/apex-icon.svg"
                                alt="logo"
                                width={20}
                                height={30}
                                className="w-full max-w-[30px] object-contain filter brightness-0"
                            />
                        </div>
                        <div>
                            <span className="text-lg text-[var(--color-dark-green)] font-bold">
                                Searchmind Apex
                            </span>
                            <span className="ml-2 text-xs bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] px-2 py-1 rounded-full font-medium">
                                v 0.2.3
                            </span>
                            {session && (
                                <div className="text-xs text-[var(--color-green)] mt-0.5">
                                    {session.user.email}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    className="md:hidden text-[var(--color-dark-green)] text-xl z-50 p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className="hidden md:flex items-center gap-1">
                    {session ? (
                        <>
                            <a href="/home" className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                <FaHome className="text-xs" /> Home
                            </a>
                            <button onClick={() => setShowModal(true)} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                <FaChartLine className="text-xs" /> Dashboard
                            </button>
                            <a href="/admin" className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                <FaUserCog className="text-xs" /> Admin
                            </a>
                            <a href="/my-profile" className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                <FaUserCircle className="text-xs" /> Profile
                            </a>
                            <a href="/my-profile?tab=campaigns" className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                <FaChartBar className="text-xs" /> Campaigns
                            </a>
                            <a href="/whats-new" className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium hidden">
                                <FaBell className="text-xs" /> Updates
                            </a>
                            
                            <div className="ml-2 pl-2 border-l border-gray-200">
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <LoginButton />
                    )}
                </div>

                <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[var(--color-lime)] rounded-lg flex items-center justify-center">
                                        <span className="text-[var(--color-dark-green)] font-bold">SA</span>
                                    </div>
                                    <div>
                                        <div className="text-lg text-[var(--color-dark-green)] font-bold">Searchmind Apex</div>
                                        {session && (
                                            <div className="text-xs text-[var(--color-green)]">{session.user.email}</div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] p-2"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 px-6 py-4">
                            {session ? (
                                <>
                                    <a href="/home" 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium">
                                        <FaHome /> Home
                                    </a>
                                    <button onClick={() => {
                                        setShowModal(true);
                                        setIsMenuOpen(false);
                                    }} className="w-full flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium">
                                        <FaChartLine /> Dashboard
                                    </button>
                                    <a href="/admin" 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium">
                                        <FaUserCog /> Admin
                                    </a>
                                    <a href="/my-profile" 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium">
                                        <FaUserCircle /> Profile
                                    </a>
                                    <a href="/my-profile?tab=campaigns" 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium">
                                        <FaChartBar /> Campaigns
                                    </a>
                                    <a href="/whats-new" 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="flex items-center gap-3 py-3 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-3 rounded-lg transition-colors font-medium hidden">
                                        <FaBell /> Updates
                                    </a>
                                </>
                            ) : null}
                        </div>

                        {session && (
                            <div className="p-6 border-t border-gray-100">
                                <LogoutButton />
                            </div>
                        )}

                        {!session && (
                            <div className="p-6">
                                <LoginButton />
                            </div>
                        )}
                    </div>
                </div>

                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </nav>

            {showModal && <CustomerModal closeModal={() => setShowModal(false)} />}
        </section>
    )
}