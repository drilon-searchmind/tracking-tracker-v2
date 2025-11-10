"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Select from 'react-select';
import countryCodes from "@/lib/static-data/countryCodes.json";

export default function ParentCampaignModal({
    isOpen,
    onClose,
    customerId,
    onSuccess
}) {
    const { showToast } = useToast();
    const { setIsParentCampaignModalOpen } = useModalContext();

    const [formData, setFormData] = useState({
        parentCampaignName: "",
        service: [],
        countryCode: "",
        campaignText: "",
        campaignMessage: "",
        campaignBrief: "",
        startDate: "",
        endDate: "",
        b2bOrB2c: "",
        budget: "",
        materialFromCustomer: "",
        materialLinks: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [budgetDistribution, setBudgetDistribution] = useState({});

    const countryOptions = countryCodes.map(country => ({
        value: country.code,
        label: `${country.name} (${country.code})`,
    }));

    const frequentCountries = [
        { value: "DK", label: "Denmark (DK)" },
        { value: "DE", label: "Germany (DE)" },
        { value: "NL", label: "Netherlands (NL)" },
        { value: "NO", label: "Norway (NO)" },
        { value: "FR", label: "France (FR)" },
        { value: "", label: "───────────────" },
    ];

    const allCountryOptions = [...frequentCountries, ...countryOptions];

    const selectedCountryOption = allCountryOptions.find(option =>
        option.value === formData.countryCode
    ) || null;

    const serviceOptions = [
        { value: "Paid Social", label: "Paid Social" },
        { value: "Paid Search", label: "Paid Search" },
        { value: "Email Marketing", label: "Email Marketing" },
        { value: "SEO", label: "SEO" },
    ];

    useEffect(() => {
        setIsParentCampaignModalOpen?.(isOpen);

        return () => {
            setIsParentCampaignModalOpen?.(false);
        };
    }, [isOpen, setIsParentCampaignModalOpen]);

    const handleClose = () => {
        setIsParentCampaignModalOpen?.(false);
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCountryChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            countryCode: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleServiceChange = (selectedOptions) => {
        setSelectedServices(selectedOptions);
        const services = selectedOptions ? selectedOptions.map(option => option.value) : [];
        
        setFormData((prev) => ({
            ...prev,
            service: services,
        }));

        // Initialize budget distribution equally
        if (services.length > 0) {
            const equalPercentage = Math.floor(100 / services.length);
            const remainder = 100 - (equalPercentage * services.length);
            
            const newDistribution = {};
            services.forEach((service, index) => {
                // Give the remainder to the first service to ensure 100% total
                newDistribution[service] = index === 0 ? equalPercentage + remainder : equalPercentage;
            });
            setBudgetDistribution(newDistribution);
        } else {
            setBudgetDistribution({});
        }
    };

    const handleBudgetDistributionChange = (service, percentage) => {
        setBudgetDistribution(prev => {
            const newDistribution = { ...prev };
            const oldPercentage = newDistribution[service] || 0;
            const difference = percentage - oldPercentage;
            
            // Update the changed service
            newDistribution[service] = percentage;
            
            // Calculate total of other services
            const otherServices = Object.keys(newDistribution).filter(s => s !== service);
            const otherServicesTotal = otherServices.reduce((sum, s) => sum + newDistribution[s], 0);
            
            // If total would exceed 100%, proportionally reduce other services
            if (percentage + otherServicesTotal > 100) {
                const excessPercentage = (percentage + otherServicesTotal) - 100;
                const adjustmentRatio = excessPercentage / otherServicesTotal;
                
                otherServices.forEach(s => {
                    newDistribution[s] = Math.max(0, Math.round(newDistribution[s] - (newDistribution[s] * adjustmentRatio)));
                });
            }
            
            // Ensure total is exactly 100%
            const currentTotal = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
            if (currentTotal !== 100 && otherServices.length > 0) {
                const adjustment = 100 - currentTotal;
                // Add/subtract the difference to/from the first other service
                newDistribution[otherServices[0]] = Math.max(0, newDistribution[otherServices[0]] + adjustment);
            }
            
            return newDistribution;
        });
    };

    const getTotalDistribution = () => {
        return Object.values(budgetDistribution).reduce((sum, percentage) => sum + percentage, 0);
    };

    const getServiceBudget = (service) => {
        const totalBudget = parseFloat(formData.budget) || 0;
        const percentage = budgetDistribution[service] || 0;
        return (totalBudget * percentage / 100).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.parentCampaignName.trim()) {
            showToast("Parent campaign name is required", "error");
            return;
        }

        // Validate budget distribution if services are selected
        if (formData.service.length > 0 && formData.budget) {
            const totalDistribution = getTotalDistribution();
            if (totalDistribution !== 100) {
                showToast("Budget distribution must total exactly 100%", "error");
                return;
            }
        }

        try {
            setIsSubmitting(true);

            const requestData = {
                ...formData,
                budgetDistribution: budgetDistribution
            };

            const response = await fetch(`/api/parent-campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                showToast("Parent campaign created successfully!", "success");
                setFormData({
                    parentCampaignName: "",
                    service: [],
                    countryCode: "",
                    campaignText: "",
                    campaignMessage: "",
                    campaignBrief: "",
                    startDate: "",
                    endDate: "",
                    b2bOrB2c: "",
                    budget: "",
                    materialFromCustomer: "",
                    materialLinks: ""
                });
                setSelectedServices([]);
                setBudgetDistribution({});
                onSuccess?.();
                handleClose();
            } else {
                const errorData = await response.json();
                showToast(`Failed to create parent campaign: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Parent campaign creation error:", error);
            showToast("Error creating parent campaign", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-gray-200 mt-40">
                <span className="flex justify-between mb-6">
                    <h4 className="text-xl font-bold text-[var(--color-dark-green)]">Create Parent Campaign</h4>
                    <button onClick={handleClose} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] text-lg transition-colors">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Parent Campaign Name</label>
                        <input
                            type="text"
                            name="parentCampaignName"
                            value={formData.parentCampaignName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Service (Multiple)</label>
                        <Select
                            name="service"
                            value={selectedServices}
                            onChange={handleServiceChange}
                            options={serviceOptions}
                            className="w-full"
                            placeholder="Select services..."
                            isMulti
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.25rem',
                                    '&:hover': {
                                        borderColor: 'var(--color-lime)'
                                    }
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? 'var(--color-lime)' : state.isFocused ? 'var(--color-natural)' : 'white',
                                    color: 'var(--color-dark-green)'
                                })
                            }}
                        />
                    </div>

                    {selectedServices.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Budget Distribution</label>
                            {selectedServices.map(service => (
                                <div key={service.value} className="mb-4">
                                    <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                        {service.label} ({budgetDistribution[service.value] || 0}% - {getServiceBudget(service.value)}) DKK
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={budgetDistribution[service.value] || 0}
                                        onChange={(e) => handleBudgetDistributionChange(service.value, parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                            <p className="text-sm text-gray-500">Total: {getTotalDistribution()}%</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Country Code</label>
                        <Select
                            name="countryCode"
                            value={selectedCountryOption}
                            onChange={handleCountryChange}
                            options={allCountryOptions}
                            className="w-full"
                            placeholder="Search for a country..."
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.25rem',
                                    '&:hover': {
                                        borderColor: 'var(--color-lime)'
                                    }
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? 'var(--color-lime)' : state.isFocused ? 'var(--color-natural)' : 'white',
                                    color: 'var(--color-dark-green)'
                                })
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">B2B/B2C</label>
                            <select
                                name="b2bOrB2c"
                                value={formData.b2bOrB2c}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            >
                                <option value="">Select</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Budget (Optional)</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Text</label>
                        <input
                            type="text"
                            name="campaignText"
                            value={formData.campaignText}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Message</label>
                        <textarea
                            name="campaignMessage"
                            value={formData.campaignMessage}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Brief</label>
                        <textarea
                            name="campaignBrief"
                            value={formData.campaignBrief}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Material from Customer</label>
                        <textarea
                            name="materialFromCustomer"
                            value={formData.materialFromCustomer}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Material Links</label>
                        <textarea
                            name="materialLinks"
                            value={formData.materialLinks}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                            placeholder="Add links to materials, one per line"
                        />
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--color-dark-green)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-green)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Parent Campaign"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full border-2 border-[var(--color-dark-green)] text-[var(--color-dark-green)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-dark-green)] hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}