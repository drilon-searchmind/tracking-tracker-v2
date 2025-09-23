"use client";

import { useState, useEffect } from "react";

export default function StaticExpenses({ customerId }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const [expenses, setExpenses] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function fetchStaticExpenses() {
            try {
                const apiUrl = `/api/config-static-expenses/${customerId}`;

                const response = await fetch(apiUrl);
                const text = await response.text();

                if (!text || !text.trim()) {
                    setExpenses({
                        cogs_percentage: 0,
                        shipping_cost_per_order: 0,
                        transaction_cost_percentage: 0,
                        marketing_bureau_cost: 0,
                        marketing_tooling_cost: 0,
                        fixed_expenses: 0,
                    });
                    return;
                }

                let result = null;
                try {
                    result = JSON.parse(text);
                } catch (parseErr) {
                    console.error("Error parsing static expenses JSON:", parseErr, "raw:", text);
                    setExpenses({
                        cogs_percentage: 0,
                        shipping_cost_per_order: 0,
                        transaction_cost_percentage: 0,
                        marketing_bureau_cost: 0,
                        marketing_tooling_cost: 0,
                        fixed_expenses: 0,
                    });
                    return;
                }

                if (result?.data) {
                    setExpenses(result.data);
                } else {
                    setExpenses({
                        cogs_percentage: 0,
                        shipping_cost_per_order: 0,
                        transaction_cost_percentage: 0,
                        marketing_bureau_cost: 0,
                        marketing_tooling_cost: 0,
                        fixed_expenses: 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching static expenses:", error);
                setExpenses({
                    cogs_percentage: 0,
                    shipping_cost_per_order: 0,
                    transaction_cost_percentage: 0,
                    marketing_bureau_cost: 0,
                    marketing_tooling_cost: 0,
                    fixed_expenses: 0,
                });
            } finally {
                setLoading(false);
            }
        }

        fetchStaticExpenses();
    }, [customerId, baseUrl]);

    const handleInputChange = (key, value) => {
        setExpenses((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const apiUrl = baseUrl
                ? `${baseUrl}/api/config-static-expenses/${customerId}`
                : `/api/config-static-expenses/${customerId}`;

            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenses),
            });

            if (response.ok) {
                alert("Static expenses updated successfully!");
            } else {
                const text = await response.text();
                console.error("Failed to update static expenses:", response.status, text);
                alert("Failed to update static expenses.");
            }
        } catch (error) {
            console.error("Error saving static expenses:", error);
            alert("An error occurred while saving static expenses.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-auto border border-zinc-200 rounded bg-white">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                    <tr className="text-zinc-600">
                        <th className="px-4 py-3 font-medium">Expense</th>
                        <th className="px-4 py-3 font-medium">Value</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-700">
                    {Object.entries(expenses)
                        .filter(([key]) =>
                            [
                                "cogs_percentage",
                                "shipping_cost_per_order",
                                "transaction_cost_percentage",
                                "marketing_bureau_cost",
                                "marketing_tooling_cost",
                                "fixed_expenses",
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                            <tr key={key} className="border-b border-zinc-100">
                                <td className="px-4 py-3 capitalize">{key.replace(/_/g, " ")}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
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