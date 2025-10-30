"use client";

import { useState, useEffect } from "react";

export default function StaticExpenses({ customerId }) {
    const [expenses, setExpenses] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function fetchStaticExpenses() {
            console.log("Fetching static expenses for customer ID:", customerId);
            
            try {
                const apiUrl = `/api/config-static-expenses-v2/${customerId}`;
                console.log("Making request to:", apiUrl);

                const response = await fetch(apiUrl);
                console.log("Static expenses response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                console.log("Raw response text:", text);

                if (!text || !text.trim()) {
                    console.log("Empty response, setting default values");
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
                    console.log("Parsed JSON result:", result);
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

                // Handle different possible response structures
                let expenseData = null;
                if (result?.data) {
                    expenseData = result.data;
                } else if (result && typeof result === "object" && result.cogs_percentage !== undefined) {
                    expenseData = result;
                } else {
                    console.log("No expense data found in response, using defaults");
                    expenseData = {
                        cogs_percentage: 0,
                        shipping_cost_per_order: 0,
                        transaction_cost_percentage: 0,
                        marketing_bureau_cost: 0,
                        marketing_tooling_cost: 0,
                        fixed_expenses: 0,
                    };
                }

                console.log("Setting expense data:", expenseData);
                setExpenses(expenseData);
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

        if (customerId) {
            fetchStaticExpenses();
        }
    }, [customerId]);

    const handleInputChange = (key, value) => {
        console.log(`Updating ${key} to:`, value);
        setExpenses((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        console.log("Saving static expenses for customer ID:", customerId);
        console.log("Expense data to save:", expenses);
        
        try {
            const apiUrl = `/api/config-static-expenses-v2/${customerId}`;

            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenses),
            });

            console.log("Save response status:", response.status);

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
        return (
            <div className="bg-white border border-[var(--color-light-natural)] rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-[var(--color-natural)] rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 bg-[var(--color-natural)] rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const expenseLabels = {
        cogs_percentage: "COGS Percentage (%)",
        shipping_cost_per_order: "Shipping Cost per Order",
        transaction_cost_percentage: "Transaction Cost Percentage (%)",
        marketing_bureau_cost: "Marketing Bureau Cost",
        marketing_tooling_cost: "Marketing Tooling Cost",
        fixed_expenses: "Fixed Expenses"
    };

    return (
        <div className="bg-white border border-[var(--color-light-natural)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-[var(--color-natural)] border-b border-[var(--color-light-natural)]">
                        <tr className="text-[var(--color-dark-green)]">
                            <th className="px-4 py-3 text-left font-medium">Expense Type</th>
                            <th className="px-4 py-3 text-left font-medium">Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-[var(--color-dark-green)] divide-y divide-[var(--color-light-natural)]">
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
                                <tr key={key} className="hover:bg-[var(--color-natural)] transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-medium">{expenseLabels[key]}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                                            className="w-full max-w-xs border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                            placeholder="0"
                                            step="0.01"
                                        />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-[var(--color-natural)] px-4 py-3 border-t border-[var(--color-light-natural)]">
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-[var(--color-dark-green)] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}