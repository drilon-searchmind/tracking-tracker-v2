"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerSharings({ customerId, baseUrl }) {
    const [sharingsData, setSharingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removeLoading, setRemoveLoading] = useState(false);

    const fetchSharings = async () => {
        try {
            setLoading(true);
            console.log(`Fetching from: ${baseUrl}/api/customer-sharings/${customerId}`);
            const response = await fetch(`${baseUrl}/api/customer-sharings/${customerId}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API error (${response.status}):`, errorText);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const text = await response.text();
            console.log("Raw API response:", text);

            // Only try to parse if there's content
            if (text && text.trim()) {
                const result = JSON.parse(text);
                console.log("Parsed API result:", result);

                if (result.data) {
                    setSharingsData(result.data);
                } else {
                    setSharingsData([]);
                }
            } else {
                console.warn("Empty response from API");
                setSharingsData([]);
            }
        } catch (error) {
            console.error("Error fetching customer sharings:", error);
            setSharingsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchSharings();
        }
    }, [customerId, baseUrl]);

    const handleRemoveSharing = async (sharingId) => {
        if (window.confirm("Are you sure you want to remove this sharing?")) {
            try {
                setRemoveLoading(true);
                const response = await fetch(`${baseUrl}/api/customer-sharings/${customerId}?sharingId=${sharingId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                await fetchSharings();
            } catch (error) {
                console.error("Error removing sharing:", error);
                alert("Failed to remove sharing. Please try again.");
            } finally {
                setRemoveLoading(false);
            }
        }
    };

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
                    {sharingsData.length > 0 ? (
                        sharingsData.map((sharing) => (
                            <tr key={sharing._id} className="border-b border-zinc-200">
                                <td className="px-4 py-3">{sharing.sharedWith}</td>
                                <td className="px-4 py-3">{sharing.email}</td>
                                <td className="px-4 py-3">
                                    <button
                                        className="text-red-700 hover:text-red-800 text-xs"
                                        onClick={() => handleRemoveSharing(sharing._id)}
                                        disabled={removeLoading}
                                    >
                                        {removeLoading ? "Removing..." : "Remove"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                                No sharings found for this customer
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}