"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerSharings({ customerId, baseUrl }) {
    const [sharings, setSharings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            console.log("Fetching sharings data for customer ID:", customerId);
            
            try {
                const response = await fetch(`/api/customer-sharings/${customerId}`);
                
                console.log("Sharings response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const sharingsData = await response.json();
                console.log("Fetched sharings data:", sharingsData);
                
                setSharings(sharingsData.data || sharingsData || []);
            } catch (error) {
                console.error("Error fetching sharings data:", error);
                setSharings([]);
            } finally {
                setLoading(false);
            }
        }
        
        if (customerId) {
            fetchData();
        }
    }, [customerId]);

    const handleRemoveAccess = async (sharingId) => {
        try {
            console.log("Removing access for sharing ID:", sharingId);
            
            const response = await fetch(`/api/customer-sharings/${customerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sharingId }),
            });

            console.log("Remove access response status:", response.status);

            if (response.ok) {
                setSharings(sharings.filter(sharing => sharing._id !== sharingId));
                alert("User access removed successfully!");
            } else {
                const errorText = await response.text();
                console.error("Remove access error:", errorText);
                alert("Failed to remove user access.");
            }
        } catch (error) {
            console.error("Error removing access:", error);
            alert("An error occurred while removing user access.");
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 bg-[var(--color-light-natural)] rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-3">Shared Access</label>
            {sharings.length === 0 ? (
                <p className="text-[var(--color-green)] text-sm italic">No users have access to this customer.</p>
            ) : (
                <div className="space-y-2">
                    {sharings.map(sharing => (
                        <div key={sharing._id} className="flex items-center justify-between p-3 bg-white border border-[var(--color-light-natural)] rounded-lg">
                            <div>
                                <p className="font-medium text-sm text-[var(--color-dark-green)]">
                                    {sharing.sharedWith || "Unknown User"}
                                </p>
                                <p className="text-xs text-[var(--color-green)]">
                                    {sharing.email || "No email"}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemoveAccess(sharing._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-2 py-1"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}