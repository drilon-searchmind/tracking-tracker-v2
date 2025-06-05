"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";

export default function DashboardLayout({ children }) {
    const segments = useSelectedLayoutSegments()
    const customerId = segments[0] || null;

    return (
        <section id="DashboardLayout" className="relative">
            <nav className="flex justify-between items-center pt-6 pb-3 border-t border-gray-200 mb-5 bg-white sticky top-0 z-50">
                <ul className="flex gap-5 relative items-baseline">
                    <li>
                        <a href={`/dashboard/${customerId}`} className="hover:text-blue-500 text-sm">
                            Overview
                        </a>
                    </li>

                    <li>
                        <a href={`/dashboard/${customerId}/performance-dashboard`} className="hover:text-blue-500 text-sm">
                            Performance Dashboard
                        </a>
                    </li>

                    <li className="relative group">
                        <div className="flex items-center gap-2 cursor-pointer text-sm hover:text-blue-500">
                            <a href={`#`}>Service Dashboard</a>
                            <PiCaretDownThin />
                        </div>
                        <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {["seo", "ppc", "em", "ps"].map((slug) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/service-dashboard/${slug}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        {slug.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="relative group">
                        <div className="flex items-center gap-2 cursor-pointer text-sm hover:text-blue-500">
                            <a href={`#`}>Tools</a>
                            <PiCaretDownThin />
                        </div>
                        <ul className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-top z-20">
                            {[
                                { slug: "pnl", label: "P&L" },
                                { slug: "kampagneplan", label: "Kampagneplan" },
                                { slug: "aarshjul", label: "Årshjul" },
                                { slug: "spendshare", label: "Spendshare" },
                                { slug: "share-of-search", label: "Share of Search" },
                            ].map(({ slug, label }) => (
                                <li key={slug}>
                                    <a
                                        href={`/dashboard/${customerId}/tools/${slug}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <a href={`/dashboard/${customerId}/config`} className="hover:text-blue-500 text-sm">
                            Config
                        </a>
                    </li>
                </ul>

                <span>
                    <button className="text-center text-xs bg-zinc-700 py-2 px-4 rounded-full text-white hover:bg-zinc-800">
                        Share Report
                    </button>
                </span>
            </nav>
            {children}
        </section>
    )
}