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
        setFormData((prev) => ({
            ...prev,
            service: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.parentCampaignName.trim()) {
            showToast("Parent campaign name is required", "error");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/parent-campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                onSuccess?.();
                onClose();
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
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Create Parent Campaign</h4>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Campaign Name</label>
                        <input
                            type="text"
                            name="parentCampaignName"
                            value={formData.parentCampaignName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service (Multiple)</label>
                        <Select
                            name="service"
                            value={selectedServices}
                            onChange={handleServiceChange}
                            options={serviceOptions}
                            className="w-full"
                            placeholder="Select services..."
                            isMulti
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                        <Select
                            name="countryCode"
                            value={selectedCountryOption}
                            onChange={handleCountryChange}
                            options={allCountryOptions}
                            className="w-full"
                            placeholder="Search for a country..."
                            isClearable
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Market</label>
                            <select
                                name="b2bOrB2c"
                                value={formData.b2bOrB2c}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            >
                                <option value="">Select</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Optional)</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Text</label>
                        <input
                            type="text"
                            name="campaignText"
                            value={formData.campaignText}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Message</label>
                        <textarea
                            name="campaignMessage"
                            value={formData.campaignMessage}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Brief</label>
                        <textarea
                            name="campaignBrief"
                            value={formData.campaignBrief}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material from Customer</label>
                        <textarea
                            name="materialFromCustomer"
                            value={formData.materialFromCustomer}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material Links</label>
                        <textarea
                            name="materialLinks"
                            value={formData.materialLinks}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                            placeholder="Add links to materials, one per line"
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Parent Campaign"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full text-zinc-700 text-center border border-zinc-700 py-2 px-4 rounded hover:bg-zinc-50 gap-2 hover:cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}