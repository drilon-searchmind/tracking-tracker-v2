"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

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

    useEffect(() => {
        setIsCampaignModalOpen(isOpen);

        return () => {
            setIsCampaignModalOpen(false);
        };
    }, [isOpen, setIsCampaignModalOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsCampaignModalOpen(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-auto relative max-h-[80vh] overflow-y-auto">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Create New Campaign</h4>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Campaign (Optional)</label>
                        <select
                            name="parentCampaignId"
                            value={formData.parentCampaignId || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
                        <select
                            name="media"
                            value={formData.media}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Format</label>
                        <select
                            name="campaignFormat"
                            value={formData.campaignFormat}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Country</option>
                            <option value="DK">DK</option>
                            <option value="DE">DE</option>
                            <option value="NL">NL</option>
                            <option value="NO">NO</option>
                            <option value="FR">FR</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                        <select
                            name="campaignType"
                            value={formData.campaignType || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Campaign Type</option>
                            <option value="Always On">Always On</option>
                            <option value="Conversion">Conversion</option>
                        </select>
                    </div>

                    {formData.campaignType !== "Always On" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    required={formData.campaignType !== "Always On"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    required={formData.campaignType !== "Always On"}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                        <input
                            type="text"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message/Brief</label>
                        <textarea
                            name="messageBrief"
                            value={formData.messageBrief}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">B2B/B2C</label>
                            <select
                                name="b2bOrB2c"
                                value={formData.b2bOrB2c}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Landingpage</label>
                        <input
                            type="text"
                            name="landingpage"
                            value={formData.landingpage}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material from Customer</label>
                        <textarea
                            name="materialFromCustomer"
                            value={formData.materialFromCustomer}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Dimensions</label>
                        <input
                            type="text"
                            name="campaignDimensions"
                            value={formData.campaignDimensions || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Variation</label>
                        <input
                            type="text"
                            name="campaignVariation"
                            value={formData.campaignVariation || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text to Creative</label>
                        <textarea
                            name="campaignTextToCreative"
                            value={formData.campaignTextToCreative || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text to Creative Translation</label>
                        <textarea
                            name="campaignTextToCreativeTranslation"
                            value={formData.campaignTextToCreativeTranslation || ""}
                            onChange={onInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <button
                            type="submit"
                            className="w-full text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm"
                        >
                            Create Campaign
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
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