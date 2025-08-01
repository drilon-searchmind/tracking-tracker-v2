"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function ShareCustomerModal({ closeModal, customerId }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const [email, setEmail] = useState("");
    const [sharedWith, setSharedWith] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleShareReport = async () => {
        if (!email || !sharedWith) {
            alert("Please fill in both fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}/api/customer-sharings/${customerId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, sharedWith }),
            });

            if (response.ok) {
                alert("Report shared successfully!");
                setEmail("");
                setSharedWith("");
                closeModal();
            } else {
                const errorData = await response.json();
                alert(`Failed to share report: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error sharing report:", error);
            alert("An error occurred while sharing the report.");
        } finally {
            setLoading(false);
        }
    };

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                />
                <input
                    type="text"
                    placeholder="Shared With (Name)"
                    value={sharedWith}
                    onChange={(e) => setSharedWith(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                />
                <p className="text-xs mb-5">
                    Notice: Email will be sent a login that they can use to view the customer's performance dashboard.
                </p>
                <button
                    onClick={handleShareReport}
                    disabled={loading}
                    className={`hover:cursor-pointer bg-[var(--color-primary-searchmind)] py-3 px-8 rounded-full text-black w-full ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Sharing..." : "Share Customer Report"}
                </button>
            </div>
        </div>
    );
}