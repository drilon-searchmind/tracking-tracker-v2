"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";
import { CiShare2, CiUser } from "react-icons/ci";
import ShareCustomerModal from "@/app/components/Dashboard/ShareCustomerModal";
import { useState } from "react";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function DashboardLayout({ children }) {
    const segments = useSelectedLayoutSegments()
    const customerId = segments[0] || null;
    const [showModalShare, setShowModalShare] = useState(false);
    const pathname = usePathname()
    const { isAnyModalOpen } = useModalContext();

    const isActive = (path) => {
        const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

        return cleanPathname === cleanPath;
    };

    const isServiceActive = pathname.startsWith(`/dashboard/${customerId}/service-dashboard`);
    const isToolsActive = pathname.startsWith(`/dashboard/${customerId}/tools`);
    const isConfigActive = pathname.startsWith(`/dashboard/${customerId}/config`);

    return (
        <section id="DashboardLayout" className="relative">
            <nav 
                className="flex justify-between items-center pt-6 pb-3 border-t border-gray-200 mb-5 bg-white sticky top-0"
                style={{ zIndex: isAnyModalOpen ? 1 : 50 }}
            >
                <ul className="flex gap-5 relative items-baseline">
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

                    <li className="relative group">
                        <div className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-500 ${isServiceActive ? "text-black font-bold" : ""}`}>
                            <a href={`#`}>Service Dashboard</a>
                            <PiCaretDownThin />
                        </div>
                        <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {["seo", "ppc", "em", "ps"].map((slug) => (
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
                                { slug: "kampagneplan", label: "Campaign Planner" },
                                { slug: "aarshjul", label: "Year Wheel" },
                                // { slug: "spendshare", label: "Spendshare" },
                                { slug: "share-of-search", label: "Share of Search" },
                            ].map(({ slug, label }) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/tools/${slug}`}
                                        className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${pathname === `/dashboard/${customerId}/tools/${slug}`
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

                <span className="flex items-center gap-4">
                    <div className="text-center text-xs border border-zinc-200 rounded px-4 py-2 bg-zinc-50 text-zinc-700 flex items-center gap-2">
                        HUMDAKIN DK <CiUser />
                    </div>
                    <button onClick={() => setShowModalShare(true)} className="text-center text-xs bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 flex items-center gap-2 hover:cursor-pointer">
                        Share Report <CiShare2 />
                    </button>
                </span>
            </nav>
            {children}

            {showModalShare && <ShareCustomerModal customerId={customerId} closeModal={() => setShowModalShare(false)} />}
        </section>
    );
}