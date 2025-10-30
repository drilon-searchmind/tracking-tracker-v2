"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Select from 'react-select';
import countryCodes from "@/lib/static-data/countryCodes.json";

export default function CampaignPlannerModal({
    isOpen,
    onClose,
    formData,
    onInputChange,
    onSubmit,
    customerId,
    parentCampaigns,
}) {
    const { showToast } = useToast();
    const { setIsCampaignModalOpen } = useModalContext();
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        setIsCampaignModalOpen(isOpen);

        return () => {
            setIsCampaignModalOpen(false);
        };
    }, [isOpen, setIsCampaignModalOpen]);

    const handleClose = () => {
        setIsCampaignModalOpen(false);
        onClose();
    };

    const handleCountryChange = (selectedOption) => {
        const syntheticEvent = {
            target: {
                name: 'countryCode',
                value: selectedOption ? selectedOption.value : ''
            }
        };
        onInputChange(syntheticEvent);
    };

    const selectedCountryOption = allCountryOptions.find(option =>
        option.value === formData.countryCode
    ) || null;

    const selectedUserOptions = formData.assignedUsers && formData.assignedUsers.length > 0
        ? users.filter(user => {
            return formData.assignedUsers.some(id =>
                id.toString() === user.value.toString()
            );
        })
        : [];

    useEffect(() => {
        const fetchUsers = async () => {
            if (isOpen) {
                try {
                    const response = await fetch('/api/campaign-assignable-users');

                    if (response.ok) {
                        const userData = await response.json();
                        console.log("Fetched users:", userData);
                        setUsers(userData.map(user => ({
                            value: user._id || user.id,
                            label: user.name || user.email
                        })));
                    }
                } catch (error) {
                    console.error("Error fetching users:", error);
                    showToast("Failed to load users", "error");
                }
            }
        };

        fetchUsers();
    }, [isOpen, showToast]);

    const handleUserChange = (selectedOptions) => {
        console.log("Selected options:", selectedOptions);

        const syntheticEvent = {
            target: {
                name: 'assignedUsers',
                value: selectedOptions ? selectedOptions.map(option => option.value) : []
            }
        };

        console.log("New assigned users:", syntheticEvent.target.value);
        onInputChange(syntheticEvent);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-gray-200 mt-40">
                <span className="flex justify-between mb-6">
                    <h4 className="text-xl font-bold text-[var(--color-dark-green)]">Create New Campaign</h4>
                    <button onClick={onClose} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] text-lg transition-colors">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Parent Campaign (Optional)</label>
                        <select
                            name="parentCampaignId"
                            value={formData.parentCampaignId || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                        >
                            <option value="">No Parent Campaign</option>
                            {parentCampaigns.map(parent => (
                                <option key={parent._id} value={parent._id}>
                                    {parent.parentCampaignName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Assign Users (Optional)</label>
                        <Select
                            name="assignedUsers"
                            value={selectedUserOptions}
                            onChange={handleUserChange}
                            options={users}
                            className="w-full"
                            placeholder="Select users to assign..."
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Service</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                required
                            >
                                <option value="">Select Service</option>
                                <option value="Paid Social">Paid Social</option>
                                <option value="Paid Search">Paid Search</option>
                                <option value="Email Marketing">Email Marketing</option>
                                <option value="SEO">SEO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Media</label>
                            <select
                                name="media"
                                value={formData.media}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                required
                            >
                                <option value="">Select Media</option>
                                <option value="META">META</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Pinterest">Pinterest</option>
                                <option value="TikTok">TikTok</option>
                                <option value="YouTube">YouTube</option>
                                <option value="Google">Google</option>
                                <option value="Email">Email</option>
                                <option value="Website">Website</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Format</label>
                            <select
                                name="campaignFormat"
                                value={formData.campaignFormat}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                required
                            >
                                <option value="">Select Campaign Format</option>
                                <option value="Video">Video</option>
                                <option value="Picture">Picture</option>
                                <option value="Carousel">Carousel</option>
                                <option value="Display Ad">Display Ad</option>
                                <option value="Search Ad">Search Ad</option>
                                <option value="Newsletter">Newsletter</option>
                                <option value="Email Flow">Email Flow</option>
                                <option value="Landingpage">Landingpage</option>
                                <option value="Collection">Collection</option>
                            </select>
                        </div>
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
                                required
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Type</label>
                            <select
                                name="campaignType"
                                value={formData.campaignType || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            >
                                <option value="">Select Campaign Type</option>
                                <option value="Always On">Always On</option>
                                <option value="Conversion">Conversion</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">B2B/B2C</label>
                            <select
                                name="b2bOrB2c"
                                value={formData.b2bOrB2c}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                required
                            >
                                <option value="">Select</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">
                                Start Date {formData.campaignType === "Always On" && "(Optional)"}
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                required={formData.campaignType !== "Always On"}
                            />
                        </div>

                        {formData.campaignType !== "Always On" && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                                    required={true}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Name</label>
                        <input
                            type="text"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Budget</label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Landing Page</label>
                        <input
                            type="text"
                            name="landingpage"
                            value={formData.landingpage}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Message/Brief</label>
                        <textarea
                            name="messageBrief"
                            value={formData.messageBrief}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Material from Customer</label>
                        <textarea
                            name="materialFromCustomer"
                            value={formData.materialFromCustomer}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Dimensions</label>
                            <input
                                type="text"
                                name="campaignDimensions"
                                value={formData.campaignDimensions || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Campaign Variation</label>
                            <input
                                type="text"
                                name="campaignVariation"
                                value={formData.campaignVariation || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Text to Creative</label>
                        <textarea
                            name="campaignTextToCreative"
                            value={formData.campaignTextToCreative || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Text to Creative Translation</label>
                        <textarea
                            name="campaignTextToCreativeTranslation"
                            value={formData.campaignTextToCreativeTranslation || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors text-[var(--color-dark-green)]"
                            rows="3"
                        />
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="submit"
                            className="w-full bg-[var(--color-dark-green)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-green)] transition-colors"
                        >
                            Create Campaign
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
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