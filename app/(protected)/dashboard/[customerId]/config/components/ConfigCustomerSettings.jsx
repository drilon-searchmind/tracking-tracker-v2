"use client";

import { useState, useEffect } from "react";
import currencyData from "@/lib/static-data/commonCurrency.json";

export default function ConfigCustomerSettings({ customerId, baseUrl }) {
    const [settings, setSettings] = useState({
        metricPreference: "ROAS/POAS",
        customerValuta: "kr",
        customerValutaCode: "DKK",
        customerClickupID: "",
        customerMetaID: "",
        customerMetaIDExclude: ""
    });
    const [loading, setLoading] = useState(false);
    const [tempValues, setTempValues] = useState({
        clickupId: "",
        countryId: "",
        excludeCountries: ""
    });

    const currencies = Object.entries(currencyData)
        .map(([code, data]) => ({ code, ...data }))
        .sort((a, b) => a.code.localeCompare(b.code));

    useEffect(() => {
        fetchSettings();
    }, [customerId, baseUrl]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/customer-settings/${customerId}`);
            
            if (response.ok) {
                const data = await response.json();
                setSettings({
                    metricPreference: data.metricPreference || "ROAS/POAS",
                    customerValuta: data.customerValuta || "kr",
                    customerValutaCode: data.customerValutaCode || "DKK",
                    customerClickupID: data.customerClickupID || "",
                    customerMetaID: data.customerMetaID || "",
                    customerMetaIDExclude: data.customerMetaIDExclude || ""
                });
                setTempValues({
                    clickupId: data.customerClickupID || "",
                    countryId: data.customerMetaID || "",
                    excludeCountries: data.customerMetaIDExclude || ""
                });
            }
        } catch (error) {
            console.error("Error fetching customer settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (updateData) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/customer-settings/${customerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setSettings(prevSettings => ({
                    ...prevSettings,
                    ...updateData
                }));
                return true;
            } else {
                console.error("Failed to update settings");
                return false;
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (preference) => {
        await updateSettings({ metricPreference: preference });
    };

    const handleCurrencyChange = async (e) => {
        const currencyCode = e.target.value;
        const selectedCurrency = currencyData[currencyCode];

        if (!selectedCurrency) return;

        await updateSettings({
            customerValuta: selectedCurrency.symbol_native,
            customerValutaCode: selectedCurrency.code
        });
    };

    const handleClickupIdUpdate = async () => {
        if (tempValues.clickupId === settings.customerClickupID) return;
        
        const success = await updateSettings({ customerClickupID: tempValues.clickupId });
        if (!success) {
            setTempValues(prev => ({ ...prev, clickupId: settings.customerClickupID }));
        }
    };

    const handleMetaIdUpdate = async () => {
        if (tempValues.countryId === settings.customerMetaID) return;
        
        const success = await updateSettings({ customerMetaID: tempValues.countryId });
        if (!success) {
            setTempValues(prev => ({ ...prev, countryId: settings.customerMetaID }));
        }
    };

    const handleExcludeCountriesUpdate = async () => {
        if (tempValues.excludeCountries === settings.customerMetaIDExclude) return;
        
        const success = await updateSettings({ customerMetaIDExclude: tempValues.excludeCountries });
        if (!success) {
            setTempValues(prev => ({ ...prev, excludeCountries: settings.customerMetaIDExclude }));
        }
    };

    const getCurrentCurrencyCode = () => {
        return settings.customerValutaCode || "DKK";
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
                                {settings.metricPreference}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggle("ROAS/POAS")}
                                        disabled={loading || settings.metricPreference === "ROAS/POAS"}
                                        className={`py-1 px-3 rounded text-sm ${settings.metricPreference === "ROAS/POAS"
                                            ? "bg-zinc-700 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        ROAS/POAS
                                    </button>
                                    <button
                                        onClick={() => handleToggle("Spendshare")}
                                        disabled={loading || settings.metricPreference === "Spendshare"}
                                        className={`py-1 px-3 rounded text-sm ${settings.metricPreference === "Spendshare"
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
                            <td className="px-4 py-3">Backend/Store Currency</td>
                            <td className="px-4 py-3">
                                {settings.customerValuta} ({getCurrentCurrencyCode()})
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <select
                                        value={getCurrentCurrencyCode()}
                                        onChange={handleCurrencyChange}
                                        disabled={loading}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name} ({currency.symbol_native})
                                            </option>
                                        ))}
                                    </select>
                                    {loading && <span className="text-xs italic">Updating...</span>}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Clickup ID</td>
                            <td className="px-4 py-3">
                                {settings.customerClickupID || "Not set"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempValues.clickupId}
                                        onChange={(e) => setTempValues(prev => ({ ...prev, clickupId: e.target.value }))}
                                        placeholder="Enter Clickup ID"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={handleClickupIdUpdate}
                                        disabled={loading || tempValues.clickupId === settings.customerClickupID}
                                        className="py-1 px-3 rounded text-sm bg-zinc-700 text-white hover:bg-zinc-800 disabled:bg-gray-300 disabled:text-gray-500"
                                    >
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Meta Customer Country</td>
                            <td className="px-4 py-3">
                                {settings.customerMetaID || "Not set"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempValues.countryId}
                                        onChange={(e) => setTempValues(prev => ({ ...prev, countryId: e.target.value }))}
                                        placeholder="Enter Country ID (e.g., DK, UK)"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={handleMetaIdUpdate}
                                        disabled={loading || tempValues.countryId === settings.customerMetaID}
                                        className="py-1 px-3 rounded text-sm bg-zinc-700 text-white hover:bg-zinc-800 disabled:bg-gray-300 disabled:text-gray-500"
                                    >
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-zinc-100">
                            <td className="px-4 py-3">Exclude Meta Countries</td>
                            <td className="px-4 py-3">
                                {settings.customerMetaIDExclude || "Not set"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempValues.excludeCountries}
                                        onChange={(e) => setTempValues(prev => ({ ...prev, excludeCountries: e.target.value }))}
                                        placeholder="Enter countries to exclude (e.g., DE,DK,NO)"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={handleExcludeCountriesUpdate}
                                        disabled={loading || tempValues.excludeCountries === settings.customerMetaIDExclude}
                                        className="py-1 px-3 rounded text-sm bg-zinc-700 text-white hover:bg-zinc-800 disabled:bg-gray-300 disabled:text-gray-500"
                                    >
                                        {loading ? "Updating..." : "Update"}
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