"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function ShareCustomerModal({ closeModal }) {
    const [customers, setCustomers] = useState("")
    const router = useRouter();

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Share report</h4>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>
                <input
                    type="text"
                    placeholder="Insert email address"
                    value={customers}
                    onChange={(e) => setCustomers(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                />
                <p className="text-xs mb-5">Notice: Email will be sent a login that they can use to view the customer's performance dashboard.</p>
                <button className="hover:cursor-pointer bg-[var(--color-primary-searchmind)] py-3 px-8 rounded-full text-black w-full">Share Customer Report</button>
            </div>
        </div>
    );
}