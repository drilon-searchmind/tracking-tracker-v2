"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerInfo({ customerId, baseUrl }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchCustomer() {
            console.log("Fetching customer info for ID:", customerId);
            console.log("Base URL:", baseUrl);
            
            try {
                // Use relative URL for API calls in client components
                const apiUrl = `/api/customers/${customerId}`;
                console.log("Making request to:", apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                console.log("Response status:", response.status, response.statusText);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Fetched customer data:", data);
                
                setCustomer(data.data || data);
            } catch (error) {
                console.error("Error fetching customer:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (customerId) {
            fetchCustomer();
        }
    }, [customerId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const apiUrl = `/api/customers/${customerId}`;
            console.log("Saving customer data to:", apiUrl);
            console.log("Customer data to save:", customer);
            
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });

            console.log("Save response status:", response.status);

            if (response.ok) {
                alert("Customer information updated successfully!");
            } else {
                const errorText = await response.text();
                console.error("Save error:", errorText);
                alert("Failed to update customer information.");
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            alert("An error occurred while updating customer information.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i}>
                            <div className="h-4 bg-[var(--color-light-natural)] rounded w-1/3 mb-2"></div>
                            <div className="h-10 bg-[var(--color-light-natural)] rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Name</label>
                <input
                    type="text"
                    value={customer?.name || ""}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                    placeholder="Enter customer name"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">BigQuery Customer ID</label>
                <input
                    type="text"
                    value={customer?.bigQueryCustomerId || ""}
                    onChange={(e) => setCustomer({ ...customer, bigQueryCustomerId: e.target.value })}
                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                    placeholder="Enter BigQuery Customer ID"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">BigQuery Project ID</label>
                <input
                    type="text"
                    value={customer?.bigQueryProjectId || ""}
                    onChange={(e) => setCustomer({ ...customer, bigQueryProjectId: e.target.value })}
                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                    placeholder="Enter BigQuery Project ID"
                />
            </div>
            
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[var(--color-dark-green)] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}