"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerSharings({ customerId, baseUrl }) {
    const [sharingsData, setSharingsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSharings() {
            try {
                const response = await fetch(`${baseUrl}/api/customer-sharings/${customerId}`);
                const result = await response.json();

                if (result.data) {
                    setSharingsData(result.data);
                } else {
                    setSharingsData([]);
                }
            } catch (error) {
                console.error("Error fetching customer sharings:", error);
                setSharingsData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSharings();
    }, [customerId, baseUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-auto border border-zinc-200 rounded bg-white shadow-solid-l">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                    <tr className="text-zinc-600">
                        <th className="px-4 py-3 font-medium">Shared With</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sharingsData.map((sharing) => (
                        <tr key={sharing._id} className="border-b border-zinc-200">
                            <td className="px-4 py-3">{sharing.sharedWith}</td>
                            <td className="px-4 py-3">{sharing.email}</td>
                            <td className="px-4 py-3">
                                <button
                                    className="text-red-700 hover:text-red-800 text-xs"
                                    onClick={() => handleRemoveSharing(sharing._id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}