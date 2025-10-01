"use client";

import { useState, useEffect } from "react";
import currencyData from "@/lib/static-data/commonCurrency.json";

export default function ConfigCustomerSettings({ customerId, baseUrl }) {
    const [metricPreference, setMetricPreference] = useState("ROAS/POAS");
    const [customerValuta, setCustomerValuta] = useState("DKK");
    const [loading, setLoading] = useState(false);
    const [currencyLoading, setCurrencyLoading] = useState(false);
    const [clickupId, setClickupId] = useState("");
    const [clickupLoading, setClickupLoading] = useState(false);
    const [tempClickupId, setTempClickupId] = useState("");

    // Convert currency data object to sorted array for dropdown
    const currencies = Object.entries(currencyData)
        .map(([code, data]) => ({ code, ...data }))
        .sort((a, b) => a.code.localeCompare(b.code));

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch metric preference
                const settingsResponse = await fetch(`/api/customer-settings/${customerId}`);
                if (settingsResponse.ok) {
                    const data = await settingsResponse.json();
                    setMetricPreference(data.metricPreference || "ROAS/POAS");
                    setClickupId(data.customerClickupID || "");
                    setTempClickupId(data.customerClickupID || "");
                }

                // Fetch currency separately from the dedicated endpoint
                const currencyResponse = await fetch(`/api/customer-settings/${customerId}/customerValuta`);
                if (currencyResponse.ok) {
                    const data = await currencyResponse.json();
                    setCustomerValuta(data.customerValuta || "DKK");
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

    const handleCurrencyChange = async (e) => {
        const currencyCode = e.target.value;
        const selectedCurrency = currencyData[currencyCode];

        if (!selectedCurrency) return;

        setCurrencyLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/customer-settings/${customerId}/customerValuta`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerValuta: selectedCurrency.symbol_native }),
            });

            if (response.ok) {
                setCustomerValuta(selectedCurrency.symbol_native);
            } else {
                console.error("Failed to update currency");
            }
        } catch (error) {
            console.error("Error updating currency:", error);
        } finally {
            setCurrencyLoading(false);
        }
    };

    const handleClickupIdChange = (e) => {
        setTempClickupId(e.target.value);
    };

    const handleClickupIdUpdate = async () => {
        if (tempClickupId === clickupId) return;

        setClickupLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/customer-settings/${customerId}/clickupId`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerClickupID: tempClickupId }),
            });

            if (response.ok) {
                setClickupId(tempClickupId);
            } else {
                console.error("Failed to update Clickup ID");
                setTempClickupId(clickupId); // Reset to original value on failure
            }
        } catch (error) {
            console.error("Error updating Clickup ID:", error);
            setTempClickupId(clickupId); // Reset to original value on failure
        } finally {
            setClickupLoading(false);
        }
    };

    // Find current currency code by its native symbol
    const getCurrentCurrencyCode = () => {
        const found = Object.entries(currencyData).find(
            ([_, data]) => data.symbol_native === customerValuta
        );
        return found ? found[0] : "DKK";
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
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Currency</td>
                            <td className="px-4 py-3">
                                {customerValuta} ({getCurrentCurrencyCode()})
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <select
                                        value={getCurrentCurrencyCode()}
                                        onChange={handleCurrencyChange}
                                        disabled={currencyLoading}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name} ({currency.symbol_native})
                                            </option>
                                        ))}
                                    </select>
                                    {currencyLoading && <span className="text-xs italic">Updating...</span>}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Clickup ID</td>
                            <td className="px-4 py-3">
                                {clickupId || "Not set"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempClickupId}
                                        onChange={handleClickupIdChange}
                                        placeholder="Enter Clickup ID"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={handleClickupIdUpdate}
                                        disabled={clickupLoading || tempClickupId === clickupId}
                                        className="py-1 px-3 rounded text-sm bg-zinc-700 text-white hover:bg-zinc-800 disabled:bg-gray-300 disabled:text-gray-500"
                                    >
                                        {clickupLoading ? "Updating..." : "Update"}
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