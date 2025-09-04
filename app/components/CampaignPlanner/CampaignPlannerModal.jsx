"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect } from "react";

export default function CampaignPlannerModal({
isOpen,
onClose,
formData,
onInputChange,
onSubmit,
customerId
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
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-scroll">
            <span className="flex justify-between">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Create New Campaign</h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-none text-xs"
                >
                    Close
                </button>
            </span>

            
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Media</label>
                    <select
                        name="media"
                        value={formData.media}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Campaign Format</label>
                    <select
                        name="campaignFormat"
                        value={formData.campaignFormat}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
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
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Country Code</label>
                    <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                    <input
                        type="text"
                        name="campaignName"
                        value={formData.campaignName}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message/Brief</label>
                    <textarea
                        name="messageBrief"
                        value={formData.messageBrief}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        rows="4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">B2B/B2C</label>
                    <select
                        name="b2bOrB2c"
                        value={formData.b2bOrB2c}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        required
                    >
                        <option value="">Select B2B/B2C</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Landingpage</label>
                    <input
                        type="text"
                        name="landingpage"
                        value={formData.landingpage}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Material from Customer</label>
                    <textarea
                        name="materialFromCustomer"
                        value={formData.materialFromCustomer}
                        onChange={onInputChange}
                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
                        rows="4"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}