"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerSettings({ customerId, baseUrl }) {
    const [metricPreference, setMetricPreference] = useState("ROAS/POAS");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMetricPreference(data.metricPreference || "ROAS/POAS");
                }
            } catch (error) {
                console.error("Error fetching customer settings:", error);
            }
        };

        fetchSettings();
    }, [customerId, baseUrl]);

    const handleToggle = async (preference) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/customer-settings/${customerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ metricPreference: preference }),
            });

            if (response.ok) {
                setMetricPreference(preference);
            } else {
                console.error("Failed to update metric preference");
            }
        } catch (error) {
            console.error("Error updating metric preference:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4 text-zinc-800">General Settings</h3>
            <div className="overflow-auto border border-zinc-200 rounded bg-white shadow-solid-l">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                        <tr className="text-zinc-600">
                            <th className="px-4 py-3 font-medium">Setting</th>
                            <th className="px-4 py-3 font-medium">Value</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-zinc-700">
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Metric Preference</td>
                            <td className="px-4 py-3">
                                {metricPreference}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggle("ROAS/POAS")}
                                        disabled={loading || metricPreference === "ROAS/POAS"}
                                        className={`py-1 px-3 rounded text-sm ${metricPreference === "ROAS/POAS"
                                                ? "bg-zinc-700 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        ROAS/POAS
                                    </button>
                                    <button
                                        onClick={() => handleToggle("Spendshare")}
                                        disabled={loading || metricPreference === "Spendshare"}
                                        className={`py-1 px-3 rounded text-sm ${metricPreference === "Spendshare"
                                                ? "bg-zinc-700 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        Spendshare
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}