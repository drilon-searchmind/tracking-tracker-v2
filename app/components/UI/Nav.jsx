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
        <section id="componentNav" className="dark:bg-gray-800">
            <nav className="flex justify-between items-center container mx-auto">
                <div className="flex items-center gap-4 py-6">
                    <Image
                        src="/images/searchmind/apex-icon.svg"
                        alt="logo"
                        width={20}
                        height={30}
                        className="w-full max-w-[30px] object-contain filter brightness-0"
                    />
                    <a href="/" className="">
                        <span className="text-lg text-black font-extrabold fontFamilyFustatHeading">
                            Searchmind Apex
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md font-medium">
                                🚧 Under Construction
                            </span>
                        </span>
                        {session ? (
                            <span className="flex items-center gap-2 text-xs text-gray-500">
                                <p className="m-0 text-xs">{session.user.email}</p>
                            </span>
                        ) : null}
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-2xl z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
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
                            <a href="/my-profile?tab=campaigns" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaChartBar /> My Campaigns
                            </a>

                            <a href="/whats-new" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaBell /> What's New
                            </a>
                            <a href="#" className="hover:text-black line-through hidden">Tracking Tracker</a>
                            <div className="hidden">
                                <button
                                    onClick={toggleTheme}
                                    className="text-zinc-700 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer"
                                    aria-label="Toggle dark mode"
                                >
                                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                                </button>
                            </div>
                            <LogoutButton />
                        </>
                    ) : (
                        <LoginButton />
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col pt-24 px-6`}>
                    {session ? (
                        <>
                            <a href="/home" className="hover:text-black flex items-center gap-2 m-0 py-4 text-zinc-700 border-b border-gray-100">
                                <FaHome /> Home
                            </a>
                            <button onClick={() => {
                                setShowModal(true);
                                setIsMenuOpen(false);
                            }} className="text-zinc-700 cursor-pointer hover:text-black flex items-center gap-2 m-0 py-4 border-b border-gray-100">
                                <FaChartLine /> Performance Dashboard
                            </button>
                            <a href="/admin" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 py-4 border-b border-gray-100">
                                <FaUserCog /> Admin
                            </a>
                            <a href="/my-profile" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 py-4 border-b border-gray-100">
                                <FaUserCircle /> My Profile
                            </a>
                            <a href="/my-profile?tab=campaigns" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 p-0">
                                <FaChartBar /> My Campaigns
                            </a>

                            <a href="/whats-new" className="text-zinc-700 hover:text-black flex items-center gap-2 m-0 py-4 border-b border-gray-100">
                                <FaBell /> What's New
                            </a>
                            <div className="hidden">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 py-4 border-b border-gray-100 dark:border-gray-700 text-zinc-700 dark:text-gray-300"
                                >
                                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>
                            <div className="mt-4">
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <div className="mt-4">
                            <LoginButton />
                        </div>
                    )}
                </div>

                {/* Overlay when mobile menu is open */}
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