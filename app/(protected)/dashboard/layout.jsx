"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";
import { CiShare2, CiUser } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import ShareCustomerModal from "@/app/components/Dashboard/ShareCustomerModal";
import { useState, useEffect } from "react";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function DashboardLayout({ children }) {
    const segments = useSelectedLayoutSegments();
    const customerId = segments[0] || null;
    const [showModalShare, setShowModalShare] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
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
                data-dashboard-nav
                className="flex justify-between items-center pt-6 pb-3 border-t border-gray-100 mb-5 bg-white sticky top-0 px-4 md:px-0"
                style={{ zIndex: isAnyModalOpen ? 1 : 10 }}
            >
                <button
                    className="md:hidden text-[var(--color-dark-green)] text-xl flex items-center p-2 hover:bg-[var(--color-natural)] rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <ul className="hidden md:flex gap-2 relative items-center">
                    <li>
                        <a
                            href={`/dashboard/${customerId}/performance-dashboard`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                isActive(`/dashboard/${customerId}/performance-dashboard`) 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            Performance Dashboard
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                isActive(`/dashboard/${customerId}`) 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            Daily Overview
                        </a>
                    </li>

                    <li className="relative group">
                        <div className={`flex items-center gap-1 cursor-pointer text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                            isServiceActive 
                                ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                        }`}>
                            Service Dashboards
                            <PiCaretDownThin className="text-xs" />
                        </div>
                        <ul className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-solid-11 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {["seo", "ppc", "ps"].map((slug) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/service-dashboard/${slug}`}
                                        className={`block px-4 py-3 text-xs hover:bg-[var(--color-natural)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                            pathname === `/dashboard/${customerId}/service-dashboard/${slug}`
                                                ? "text-[var(--color-dark-green)] font-semibold bg-[var(--color-natural)]"
                                                : "text-[var(--color-green)]"
                                        }`}
                                    >
                                        {slug.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/tools/pace-report`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                isActive(`/dashboard/${customerId}/tools/pace-report`) 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            Pace Report
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/tools/pnl`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                isActive(`/dashboard/${customerId}/tools/pnl`) 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            P&L
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/tools/kampagneplan`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                isActive(`/dashboard/${customerId}/tools/kampagneplan`) 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            Campaign Planner
                        </a>
                    </li>

                    <li>
                        <a
                            href={`/dashboard/${customerId}/config`}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                pathname === `/dashboard/${customerId}/config` 
                                    ? "bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] border border-[var(--color-lime)]" 
                                    : "text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-natural)]"
                            }`}
                        >
                            Config
                        </a>
                    </li>
                </ul>

                <div className="flex items-center gap-3">
                    <div className="text-xs border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 bg-[var(--color-natural)] text-[var(--color-dark-green)] flex items-center gap-2 font-medium">
                        <span className="hidden sm:inline">{customerName}</span>
                        <span className="sm:hidden">{customerName.substring(0, 10)}{customerName.length > 10 ? "..." : ""}</span>
                        <CiUser className="text-sm" />
                    </div>
                    <button 
                        onClick={() => setShowModalShare(true)} 
                        className="text-xs bg-[var(--color-dark-green)] py-2 px-3 rounded-lg text-white hover:bg-[var(--color-green)] flex items-center gap-2 transition-colors font-medium"
                    >
                        <span className="hidden sm:inline">Share Report</span>
                        <span className="sm:hidden">Share</span>
                        <CiShare2 className="text-sm" />
                    </button>
                </div>
            </nav>

            <div className={`md:hidden fixed top-[150px] left-0 right-0 bg-white border-b border-gray-100 shadow-solid-11 z-40 transition-all duration-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}`}>
                <ul className="flex flex-col px-4 py-2">
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}/performance-dashboard`}
                            className={`block text-sm font-medium ${
                                isActive(`/dashboard/${customerId}/performance-dashboard`) 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}
                        >
                            Performance Dashboard
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}`}
                            className={`block text-sm font-medium ${
                                isActive(`/dashboard/${customerId}`) 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}
                        >
                            Daily Overview
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <div className={`flex justify-between items-center text-sm font-medium ${
                            isServiceActive 
                                ? "text-[var(--color-dark-green)]" 
                                : "text-[var(--color-green)]"
                        }`}>
                            <span>Service Dashboards</span>
                            <PiCaretDownThin className="text-lg" />
                        </div>
                        <ul className="ml-4 mt-2">
                            {["seo", "ppc", "em", "ps"].map((slug) => (
                                <li key={slug} className="py-2">
                                    <a
                                        href={`/dashboard/${customerId}/service-dashboard/${slug}`}
                                        className={`block text-sm ${
                                            pathname === `/dashboard/${customerId}/service-dashboard/${slug}` 
                                                ? "text-[var(--color-dark-green)] font-semibold" 
                                                : "text-[var(--color-green)]"
                                        }`}
                                    >
                                        {slug.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}/tools/pace-report`}
                            className={`block text-sm font-medium ${
                                isActive(`/dashboard/${customerId}/tools/pace-report`) 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}
                        >
                            Pace Report
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}/tools/pnl`}
                            className={`block text-sm font-medium ${
                                isActive(`/dashboard/${customerId}/tools/pnl`) 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}
                        >
                            P&L
                        </a>
                    </li>
                    <li className="py-3 border-b border-gray-100">
                        <a
                            href={`/dashboard/${customerId}/tools/kampagneplan`}
                            className={`block text-sm font-medium ${
                                isActive(`/dashboard/${customerId}/tools/kampagneplan`) 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}
                        >
                            Campaign Planner
                        </a>
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