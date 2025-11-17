"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import countryCodes from '@/lib/static-data/countryCodes.json';

export default function ConfigCustomerSettings({ customerId, baseUrl }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parentCustomers, setParentCustomers] = useState([]);
    const [showNewParentForm, setShowNewParentForm] = useState(false);
    const [newParentData, setNewParentData] = useState({
        name: "",
        description: "",
        industry: "",
        headquarters: "",
        website: ""
    });

    // Add country options based on countryCodes.json
    const countryOptions = countryCodes.map(country => ({
        value: country.code,
        label: `${country.name} (${country.code})`,
    }));

    const frequentCountries = [
        { value: "", label: "None" },
        { value: "DK", label: "Denmark (DK)" },
        { value: "DE", label: "Germany (DE)" },
        { value: "NL", label: "Netherlands (NL)" },
        { value: "NO", label: "Norway (NO)" },
        { value: "FR", label: "France (FR)" },
        { value: "CY", label: "Cyprus (CY)" },
        { value: "", label: "───────────────" },
    ];

    const allCountryOptions = [...frequentCountries, ...countryOptions];

    const selectedCountryOption = allCountryOptions.find(option =>
        option.value === settings?.metaCustomerCountry
    ) || null;

    const handleCountryChange = (selectedOption) => {
        setSettings({ 
            ...settings, 
            metaCustomerCountry: selectedOption ? selectedOption.value : "" 
        });
    };

    const handleExcludeCountryAdd = (selectedOption) => {
        if (!selectedOption) return;
        
        const currentExcluded = settings?.excludeMetaCountries || "";
        const currentCountries = currentExcluded.split(',').map(c => c.trim()).filter(c => c !== "");
        
        // Check if country is already in the list
        if (!currentCountries.includes(selectedOption.value)) {
            const updatedCountries = [...currentCountries, selectedOption.value];
            setSettings({ 
                ...settings, 
                excludeMetaCountries: updatedCountries.join(', ')
            });
        }
    };

    const removeExcludedCountry = (countryCode) => {
        const currentExcluded = settings?.excludeMetaCountries || "";
        const currentCountries = currentExcluded.split(',').map(c => c.trim()).filter(c => c !== "");
        const updatedCountries = currentCountries.filter(c => c !== countryCode);
        setSettings({ 
            ...settings, 
            excludeMetaCountries: updatedCountries.join(', ')
        });
    };

    const getExcludedCountriesList = () => {
        const currentExcluded = settings?.excludeMetaCountries || "";
        return currentExcluded.split(',').map(c => c.trim()).filter(c => c !== "");
    };

    useEffect(() => {
        async function fetchData() {
            console.log("Fetching settings for customer ID:", customerId);
            
            try {
                // Fetch customer settings
                const settingsResponse = await fetch(`/api/customer-settings/${customerId}`);
                const settingsData = await settingsResponse.json();
                
                // Fetch customer info (including parent customer)
                const customerResponse = await fetch(`/api/customers/${customerId}`);
                const customerData = await customerResponse.json();
                
                // Fetch parent customers
                const parentCustomersResponse = await fetch('/api/parent-customers');
                const parentCustomersData = await parentCustomersResponse.json();
                
                // Map API response fields to component fields
                const apiData = settingsData.data || settingsData;
                setSettings({
                    metricPreference: apiData.metricPreference || "",
                    backendStoreCurrency: apiData.customerValutaCode || "DKK",
                    clickupId: apiData.customerClickupID || "",
                    metaCustomerCountry: apiData.customerMetaID || "",
                    excludeMetaCountries: apiData.customerMetaIDExclude || "",
                    parentCustomer: customerData.parentCustomer?._id || "",
                    changeCurrency: apiData.changeCurrency !== undefined ? apiData.changeCurrency : true
                });
                
                setParentCustomers(parentCustomersData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setSettings({
                    metricPreference: "",
                    backendStoreCurrency: "DKK",
                    clickupId: "",
                    metaCustomerCountry: "",
                    excludeMetaCountries: "",
                    parentCustomer: "",
                    changeCurrency: true
                });
                setParentCustomers([]);
            } finally {
                setLoading(false);
            }
        }
        
        if (customerId) {
            fetchData();
        }
    }, [customerId]);

    const handleCreateParentCustomer = async () => {
        if (!newParentData.name.trim()) {
            alert("Parent customer name is required");
            return;
        }

        try {
            const response = await fetch('/api/parent-customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newParentData),
            });

            if (response.ok) {
                const result = await response.json();
                const createdParent = result.parentCustomer;
                
                // Add to parent customers list
                setParentCustomers(prev => [...prev, createdParent]);
                
                // Select the newly created parent
                setSettings(prev => ({
                    ...prev,
                    parentCustomer: createdParent._id
                }));
                
                // Reset form and hide it
                setNewParentData({
                    name: "",
                    description: "",
                    industry: "",
                    headquarters: "",
                    website: ""
                });
                setShowNewParentForm(false);
                
                alert("Parent customer created successfully!");
            } else {
                const errorData = await response.json();
                alert(`Failed to create parent customer: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error creating parent customer:", error);
            alert("An error occurred while creating parent customer.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            console.log("Saving settings for customer ID:", customerId);
            
            // Save customer settings
            const settingsPayload = {
                metricPreference: settings.metricPreference,
                customerValutaCode: settings.backendStoreCurrency,
                customerClickupID: settings.clickupId,
                customerMetaID: settings.metaCustomerCountry,
                customerMetaIDExclude: settings.excludeMetaCountries,
                changeCurrency: settings.changeCurrency ?? true // Default to true if undefined
            };
            
            console.log("Frontend: Current settings state:", settings);
            console.log("Frontend: Payload being sent:", settingsPayload);
            
            const settingsResponse = await fetch(`/api/customer-settings/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settingsPayload),
            });

            // Save customer parent relationship
            const customerPayload = {
                parentCustomer: settings.parentCustomer || null
            };
            
            const customerResponse = await fetch(`/api/customers/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customerPayload),
            });

            if (settingsResponse.ok && customerResponse.ok) {
                alert("Settings updated successfully!");
            } else {
                alert("Failed to update some settings.");
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
                    {/* Parent Customer Section */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Parent Customer (Optional)</label>
                        <div className="space-y-3">
                            <select
                                value={settings?.parentCustomer || ""}
                                onChange={(e) => setSettings({ ...settings, parentCustomer: e.target.value })}
                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            >
                                <option value="">No parent customer</option>
                                {parentCustomers.map(parent => (
                                    <option key={parent._id} value={parent._id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                            
                            <button
                                type="button"
                                onClick={() => setShowNewParentForm(!showNewParentForm)}
                                className="text-sm text-[var(--color-dark-green)] hover:text-[var(--color-green)] transition-colors underline"
                            >
                                {showNewParentForm ? "Cancel" : "Create new parent customer"}
                            </button>
                            
                            {showNewParentForm && (
                                <div className="border border-[var(--color-dark-natural)] rounded-lg p-4 space-y-3 bg-gray-50">
                                    <h4 className="font-medium text-[var(--color-dark-green)]">Create New Parent Customer</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-dark-green)] mb-1">Name *</label>
                                            <input
                                                type="text"
                                                value={newParentData.name}
                                                onChange={(e) => setNewParentData({ ...newParentData, name: e.target.value })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded px-2 py-1 text-sm"
                                                placeholder="e.g., Pompdelux"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-dark-green)] mb-1">Industry</label>
                                            <input
                                                type="text"
                                                value={newParentData.industry}
                                                onChange={(e) => setNewParentData({ ...newParentData, industry: e.target.value })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded px-2 py-1 text-sm"
                                                placeholder="e.g., E-commerce"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-dark-green)] mb-1">Headquarters</label>
                                            <input
                                                type="text"
                                                value={newParentData.headquarters}
                                                onChange={(e) => setNewParentData({ ...newParentData, headquarters: e.target.value })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded px-2 py-1 text-sm"
                                                placeholder="e.g., Copenhagen, Denmark"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-dark-green)] mb-1">Website</label>
                                            <input
                                                type="url"
                                                value={newParentData.website}
                                                onChange={(e) => setNewParentData({ ...newParentData, website: e.target.value })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded px-2 py-1 text-sm"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-[var(--color-dark-green)] mb-1">Description</label>
                                            <textarea
                                                value={newParentData.description}
                                                onChange={(e) => setNewParentData({ ...newParentData, description: e.target.value })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded px-2 py-1 text-sm"
                                                rows="2"
                                                placeholder="Brief description of the parent company"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={handleCreateParentCustomer}
                                        className="bg-[var(--color-dark-green)] text-white py-1 px-3 rounded text-sm font-medium hover:bg-[var(--color-green)] transition-colors"
                                    >
                                        Create Parent Customer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Existing fields */}
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
                            <option value="CHF">Swiss Franc (CHF)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Change Currency</label>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const currentValue = settings?.changeCurrency ?? true; // Default to true if undefined
                                    const newValue = !currentValue; // Toggle it
                                    console.log("Toggle clicked: current =", currentValue, "new =", newValue);
                                    setSettings({ ...settings, changeCurrency: newValue });
                                }}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 ${
                                    (settings?.changeCurrency ?? true) ? 'bg-[var(--color-dark-green)]' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        (settings?.changeCurrency ?? true) ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                            <span className="text-sm text-[var(--color-green)]">
                                {(settings?.changeCurrency ?? true) ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-green)] mt-1">
                            Enable automatic currency conversion for dashboard views
                        </p>
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
                        <Select
                            name="metaCustomerCountry"
                            value={selectedCountryOption}
                            onChange={handleCountryChange}
                            options={allCountryOptions}
                            className="w-full"
                            placeholder="Select Meta customer country..."
                            isClearable
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    border: '1px solid var(--color-dark-natural)',
                                    borderRadius: '0.5rem',
                                    padding: '0.125rem 0.25rem',
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        borderColor: 'var(--color-lime)'
                                    },
                                    boxShadow: state.isFocused ? '0 0 0 2px var(--color-lime)' : 'none',
                                    borderColor: state.isFocused ? 'transparent' : 'var(--color-dark-natural)'
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? 'var(--color-lime)' : state.isFocused ? 'var(--color-natural)' : 'white',
                                    color: 'var(--color-dark-green)',
                                    fontSize: '0.875rem'
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#9ca3af',
                                    fontSize: '0.875rem'
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'var(--color-dark-green)',
                                    fontSize: '0.875rem'
                                })
                            }}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Exclude Meta Countries</label>
                        <div className="space-y-3">
                            <textarea
                                value={settings?.excludeMetaCountries || ""}
                                onChange={(e) => setSettings({ ...settings, excludeMetaCountries: e.target.value })}
                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                placeholder="Enter countries to exclude (comma-separated)"
                                rows="3"
                            />
                            
                            {/* Country selection dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-green)] mb-1">Add countries to exclude:</label>
                                <Select
                                    name="excludeCountrySelector"
                                    value={null} // Always reset after selection
                                    onChange={handleExcludeCountryAdd}
                                    options={allCountryOptions}
                                    className="w-full"
                                    placeholder="Select a country to add..."
                                    isClearable
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            border: '1px solid var(--color-dark-natural)',
                                            borderRadius: '0.375rem',
                                            padding: '0.125rem 0.25rem',
                                            fontSize: '0.75rem',
                                            minHeight: '32px',
                                            '&:hover': {
                                                borderColor: 'var(--color-lime)'
                                            },
                                            boxShadow: state.isFocused ? '0 0 0 2px var(--color-lime)' : 'none',
                                            borderColor: state.isFocused ? 'transparent' : 'var(--color-dark-natural)'
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? 'var(--color-lime)' : state.isFocused ? 'var(--color-natural)' : 'white',
                                            color: 'var(--color-dark-green)',
                                            fontSize: '0.75rem'
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#9ca3af',
                                            fontSize: '0.75rem'
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'var(--color-dark-green)',
                                            fontSize: '0.75rem'
                                        })
                                    }}
                                />
                            </div>
                            
                            {/* Display selected countries as tags */}
                            {getExcludedCountriesList().length > 0 && (
                                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                                    <span className="text-xs font-medium text-[var(--color-green)] mb-1">Selected countries:</span>
                                    <div className="w-full flex flex-wrap gap-2">
                                        {getExcludedCountriesList().map((countryCode) => {
                                            const countryInfo = countryCodes.find(c => c.code === countryCode);
                                            return (
                                                <span 
                                                    key={countryCode} 
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] text-xs rounded-md border border-[var(--color-lime)]/50"
                                                >
                                                    {countryInfo ? `${countryInfo.name} (${countryCode})` : countryCode}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExcludedCountry(countryCode)}
                                                        className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                                                        title="Remove country"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
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