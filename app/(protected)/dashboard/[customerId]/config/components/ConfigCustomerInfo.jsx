"use client";

import { useState, useEffect } from "react";

export default function CustomerInfo({ customerId, baseUrl }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCustomerInfo() {
            try {
                const response = await fetch(`${baseUrl}/api/customers/${customerId}`);
                const result = await response.json();

                if (result.name) {
                    setCustomer({
                        name: result.name,
                        bigQueryCustomerId: result.bigQueryCustomerId,
                        bigQueryProjectId: result.bigQueryProjectId,
                    });
                } else {
                    setCustomer({
                        name: "",
                        bigQueryCustomerId: "",
                        bigQueryProjectId: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching customer info:", error);
                setCustomer({
                    name: "",
                    bigQueryCustomerId: "",
                    bigQueryProjectId: "",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchCustomerInfo();
    }, [customerId, baseUrl]);

    const handleInputChange = (key, value) => {
        setCustomer((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/customers/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                alert("Customer info updated successfully!");
            } else {
                const errorData = await response.json();
                alert(`Failed to update customer info: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error saving customer info:", error);
            alert("An error occurred while saving customer info.");
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
                        <th className="px-4 py-3 font-medium">Field</th>
                        <th className="px-4 py-3 font-medium">Value</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-700">
                    {Object.entries(customer)
                        .filter(([key]) =>
                            ["name", "bigQueryCustomerId", "bigQueryProjectId"].includes(key)
                        )
                        .map(([key, value]) => (
                            <tr key={key} className="border-b border-zinc-100">
                                <td className="px-4 py-3 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="flex justify-end p-4">
                <button
                    onClick={handleSave}
                    className="text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}