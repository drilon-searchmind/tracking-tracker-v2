"use client";

import { useState, useEffect } from "react";

export default function ConfigCustomerSettings({ customerId, baseUrl }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            console.log("Fetching settings for customer ID:", customerId);
            
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                console.log("Settings response status:", response.status);
                
                const data = await response.json();
                console.log("Fetched settings data:", data);
                
                // Map API response fields to component fields
                const apiData = data.data || data;
                setSettings({
                    metricPreference: apiData.metricPreference || "",
                    backendStoreCurrency: apiData.customerValutaCode || "DKK",
                    clickupId: apiData.customerClickupID || "",
                    metaCustomerCountry: apiData.customerMetaID || "",
                    excludeMetaCountries: apiData.customerMetaIDExclude || ""
                });
            } catch (error) {
                console.error("Error fetching settings:", error);
                setSettings({
                    metricPreference: "",
                    backendStoreCurrency: "DKK",
                    clickupId: "",
                    metaCustomerCountry: "",
                    excludeMetaCountries: ""
                });
            } finally {
                setLoading(false);
            }
        }
        
        if (customerId) {
            fetchSettings();
        }
    }, [customerId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            console.log("Saving settings for customer ID:", customerId);
            console.log("Settings data to save:", settings);
            
            // Map component fields back to API fields
            const apiPayload = {
                metricPreference: settings.metricPreference,
                customerValutaCode: settings.backendStoreCurrency,
                customerClickupID: settings.clickupId,
                customerMetaID: settings.metaCustomerCountry,
                customerMetaIDExclude: settings.excludeMetaCountries
            };
            
            console.log("API payload:", apiPayload);
            
            const response = await fetch(`/api/customer-settings/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiPayload),
            });

            console.log("Save settings response status:", response.status);

            if (response.ok) {
                alert("Settings updated successfully!");
            } else {
                const errorText = await response.text();
                console.error("Save settings error:", errorText);
                alert("Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("An error occurred while updating settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
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
        <div>
            <h3 className="font-semibold text-base text-[var(--color-dark-green)] mb-6">General Settings</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Metric Preference</label>
                        <input
                            type="text"
                            value={settings?.metricPreference || ""}
                            onChange={(e) => setSettings({ ...settings, metricPreference: e.target.value })}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            placeholder="Enter metric preference"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Backend/Store Currency</label>
                        <select
                            value={settings?.backendStoreCurrency || "DKK"}
                            onChange={(e) => setSettings({ ...settings, backendStoreCurrency: e.target.value })}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        >
                            <option value="DKK">Danish Krone (DKK)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="GBP">British Pound (GBP)</option>
                            <option value="SEK">Swedish Krona (SEK)</option>
                            <option value="NOK">Norwegian Krone (NOK)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Clickup ID</label>
                        <input
                            type="text"
                            value={settings?.clickupId || ""}
                            onChange={(e) => setSettings({ ...settings, clickupId: e.target.value })}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            placeholder="Enter Clickup ID"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Meta Customer Country</label>
                        <input
                            type="text"
                            value={settings?.metaCustomerCountry || ""}
                            onChange={(e) => setSettings({ ...settings, metaCustomerCountry: e.target.value })}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            placeholder="Enter Meta customer country"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Exclude Meta Countries</label>
                        <textarea
                            value={settings?.excludeMetaCountries || ""}
                            onChange={(e) => setSettings({ ...settings, excludeMetaCountries: e.target.value })}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            placeholder="Enter countries to exclude (comma-separated)"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[var(--color-dark-green)] text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}