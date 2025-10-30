"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";
import { CiShare2, CiUser } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import ShareCustomerModal from "@/app/components/Dashboard/ShareCustomerModal";
import { useState, useEffect } from "react";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function DashboardLayout({ children }) {
    const segments = useSelectedLayoutSegments()
    const customerId = segments[0] || null;
    const [showModalShare, setShowModalShare] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname()
    const { isAnyModalOpen } = useModalContext();
    const [customerName, setCustomerName] = useState("");

    const isActive = (path) => {
        const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

        return cleanPathname === cleanPath;
    };

    const isServiceActive = pathname.startsWith(`/dashboard/${customerId}/service-dashboard`);
    const isToolsActive = pathname.startsWith(`/dashboard/${customerId}/tools`) && !pathname.includes("kampagneplan");
    const isConfigActive = pathname.startsWith(`/dashboard/${customerId}/config`);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (customerId) {
            const fetchCustomerName = async () => {
                try {
                    const response = await fetch(`/api/customers/${customerId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCustomerName(data.name || "Customer");
                    } else {
                        console.error("Failed to fetch customer details");
                        setCustomerName("Customer");
                    }
                } catch (error) {
                    console.error("Error fetching customer details:", error);
                    setCustomerName("Customer");
                }
            };

            fetchCustomerName();
        }
    }, [customerId]);

    return (
        <section id="DashboardLayout" className="relative">
            <nav
                className="flex justify-between items-center pt-6 pb-3 border-t border-gray-200 mb-5 bg-white sticky top-0 px-4 md:px-0"
                style={{ zIndex: isAnyModalOpen ? 1 : 10 }}
            >
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700 text-xl flex items-center"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-5 relative items-baseline">
                    <li>
                        <a
                            href={`/dashboard/${customerId}`}
                            className={`hover:text-blue-500 text-sm ${isActive(`/dashboard/${customerId}`) ? "text-black font-bold" : ""}`}
                        >
                            Overview
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/performance-dashboard`}
                            className={`hover:text-blue-500 text-sm ${isActive(`/dashboard/${customerId}/performance-dashboard`) ? "text-black font-bold" : ""}`}
                        >
                            Performance Dashboard
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/tools/kampagneplan`}
                            className={`hover:text-blue-500 text-sm ${isActive(`/dashboard/${customerId}/tools/kampagneplan`) ? "text-black font-bold" : ""}`}
                        >
                            Campaign Planner
                        </a>
                    </li>

                    <li className="relative group">
                        <div className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-500 ${isServiceActive ? "text-black font-bold" : ""}`}>
                            <a href={`#`}>Service Dashboard</a>
                            <PiCaretDownThin />
                        </div>
                        <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {["seo", "ppc", "ps"].map((slug) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/service-dashboard/${slug}`}
                                        className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${pathname === `/dashboard/${customerId}/service-dashboard/${slug}`
                                            ? "text-black font-bold bg-blue-50"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        {slug.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="relative group">
                        <div className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-500 ${isToolsActive ? "text-black font-bold" : ""}`}>
                            <a href={`#`}>Tools</a>
                            <PiCaretDownThin />
                        </div>
                        <ul className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {[
                                { slug: "pnl", label: "P&L" },
                                { slug: "pace-report", label: "Pace Report" },
                                // { slug: "aarshjul", label: "Year Wheel" },
                                // { slug: "share-of-search", label: "Share of Search" },
                            ].map(({ slug, label }) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/tools/${slug}`}
                                        className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${pathname === `/dashboard/${customerId}/tools/${slug}` && !pathname.includes("kampagneplan")
                                                ? "text-black font-bold bg-blue-50"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/config`}
                            className={`hover:text-blue-500 text-sm ${pathname === `/dashboard/${customerId}/config` ? "text-black font-bold" : ""
                                }`}
                        >
                            Config
                        </a>
                    </li>
                </ul>

                {/* Customer info and share button */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-center text-xs border border-zinc-200 rounded px-2 md:px-4 py-2 bg-zinc-50 text-zinc-700 flex items-center gap-1 md:gap-2">
                        <span className="hidden sm:inline">{customerName}</span>
                        <span className="sm:hidden">{customerName.substring(0, 10)}{customerName.length > 10 ? "..." : ""}</span>
                        <CiUser />
                    </div>
                    <button onClick={() => setShowModalShare(true)} className="text-center text-xs bg-zinc-700 py-2 px-2 md:px-4 rounded text-white hover:bg-zinc-800 flex items-center gap-1 md:gap-2 hover:cursor-pointer">
                        <span className="hidden sm:inline">Share Report</span>
                        <span className="sm:hidden">Share</span>
                        <CiShare2 />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden fixed top-[150px] left-0 right-0 bg-white border-b border-gray-200 shadow-md z-40 transition-all duration-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}`}>

                <ul className="flex flex-col px-4 py-2">
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}`}
                            className={`block text-sm ${isActive(`/dashboard/${customerId}`) ? "text-black font-bold" : "text-gray-700"}`}
                        >
                            Overview
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}/performance-dashboard`}
                            className={`block text-sm ${isActive(`/dashboard/${customerId}/performance-dashboard`) ? "text-black font-bold" : "text-gray-700"}`}
                        >
                            Performance Dashboard
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <div className={`flex justify-between items-center text-sm ${isServiceActive ? "text-black font-bold" : "text-gray-700"}`}>
                            <span>Service Dashboard</span>
                            <PiCaretDownThin className="text-lg" />
                        </div>
                        <ul className="ml-4 mt-2">
                            {["seo", "ppc", "em", "ps"].map((slug) => (
                                <li key={slug} className="py-2">
                                    <a
                                        href={`/dashboard/${customerId}/service-dashboard/${slug}`}
                                        className={`block text-sm ${pathname === `/dashboard/${customerId}/service-dashboard/${slug}` ? "text-blue-600 font-bold" : "text-gray-600"}`}
                                    >
                                        {slug.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <div className={`flex justify-between items-center text-sm ${isToolsActive ? "text-black font-bold" : "text-gray-700"}`}>
                            <span>Tools</span>
                            <PiCaretDownThin className="text-lg" />
                        </div>
                        <ul className="ml-4 mt-2">
                            {[
                                { slug: "pnl", label: "P&L" },
                                { slug: "pace-report", label: "Pace Report" },
                                { slug: "kampagneplan", label: "Campaign Planner" },
                                // { slug: "aarshjul", label: "Year Wheel" },
                                // { slug: "share-of-search", label: "Share of Search" },
                            ].map(({ slug, label }) => (
                                <li key={slug} className="py-2">
                                    <a
                                        href={`/dashboard/${customerId}/tools/${slug}`}
                                        className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${pathname === `/dashboard/${customerId}/tools/${slug}` && !pathname.includes("kampagneplan")
                                                ? "text-black font-bold bg-blue-50"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="py-3">
                        <a
                            href={`/dashboard/${customerId}/config`}
                            className={`block text-sm ${isConfigActive ? "text-black font-bold" : "text-gray-700"}`}
                        >
                            Config
                        </a>
                    </li>
                </ul>
            </div>

            {children}

            {showModalShare && <ShareCustomerModal customerId={customerId} closeModal={() => setShowModalShare(false)} />}
        </section>
    );
}