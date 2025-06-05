"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";

export default function DashboardLayout({ children }) {
    const segments = useSelectedLayoutSegments()
    const customerId = segments[0] || null;

    return (
        <section id="DashboardLayout" className="">
            <nav className="flex justify-between items-center pt-6 pb-3 border-t border-gray-200 mb-5 bg-white">
                <ul className="flex gap-5">
                    <li><a href={`/dashboard/${customerId}`} className="hover:text-blue-500 text-sm">Overview</a></li>
                    <li><a href={`/dashboard/${customerId}/performance-dashboard`} className="hover:text-blue-500 text-sm">Performance Dashboard </a></li>
                    <li className="flex items-center gap-2"><a href={`/dashboard/${customerId}/service-dashboard`} className="hover:text-blue-500 text-sm">Service Dashboard</a><PiCaretDownThin /></li>
                    <li className="flex items-center gap-2"><a href={`/dashboard/${customerId}/tools`} className="hover:text-blue-500 text-sm">Tools</a><PiCaretDownThin /></li>
                    <li><a href={`/dashboard/${customerId}/config`} className="hover:text-blue-500 text-sm">Config</a></li>
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