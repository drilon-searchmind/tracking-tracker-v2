"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect, useState } from "react";

export default function CampaignDetailsModal({
    isOpen,
    onClose,
    campaign,
    customerId,
    onUpdate, // Add this prop to refresh the campaign list after update
}) {
    const { showToast } = useToast();
    const { setIsDetailsModalOpen } = useModalContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedCampaign, setEditedCampaign] = useState(null);
    const [displayedCampaign, setDisplayedCampaign] = useState(null); // Add this state
    const [isSaving, setIsSaving] = useState(false);

    // Initialize both edit form and display data when a campaign is selected
    useEffect(() => {
        if (campaign) {
            const formattedCampaign = {
                ...campaign,
                startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
                endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
            };
            setEditedCampaign(formattedCampaign);
            setDisplayedCampaign(campaign);
        }
    }, [campaign]);

    useEffect(() => {
        setIsDetailsModalOpen(isOpen);
        return () => {
            setIsDetailsModalOpen(false);
        };
    }, [isOpen, setIsDetailsModalOpen]);

    const handleClose = () => {
        setIsDetailsModalOpen(false);
        setIsEditing(false);
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedCampaign(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
    
            const response = await fetch(`/api/campaigns/${customerId}?id=${campaign._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedCampaign),
            });
    
            if (response.ok) {
                showToast("Campaign updated successfully!", "success");
                
                // Call onUpdate to refresh the campaign list
                if (onUpdate) onUpdate();
                
                // Close the modal after successful update
                handleClose();
            } else {
                const errorData = await response.json();
                showToast(`Failed to update campaign: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Error updating campaign:", error);
            showToast("Error updating campaign", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !editedCampaign || !displayedCampaign) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-blue-900">
                        {isEditing ? "Edit Campaign" : "Campaign Details"}
                    </h3>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                    disabled={isSaving}
                                >
                                    Cancel Edit
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Basic Information</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block">Campaign Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="campaignName"
                                        value={editedCampaign.campaignName}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    />
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.campaignName}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Service</label>
                                {isEditing ? (
                                    <select
                                        name="service"
                                        value={editedCampaign.service}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    >
                                        <option value="Paid Social">Paid Social</option>
                                        <option value="Paid Search">Paid Search</option>
                                        <option value="Email Marketing">Email Marketing</option>
                                        <option value="SEO">SEO</option>
                                    </select>
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.service}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Media</label>
                                {isEditing ? (
                                    <select
                                        name="media"
                                        value={editedCampaign.media}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    >
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
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.media}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Format</label>
                                {isEditing ? (
                                    <select
                                        name="campaignFormat"
                                        value={editedCampaign.campaignFormat}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    >
                                        <option value="Video">Video</option>
                                        <option value="Picture">Picture</option>
                                        <option value="Carousel">Carousel</option>
                                        <option value="Display Ad">Display Ad</option>
                                        <option value="Search Ad">Search Ad</option>
                                        <option value="Newsletter">Newsletter</option>
                                        <option value="Email Flow">Email Flow</option>
                                        <option value="Landingpage">Landingpage</option>
                                    </select>
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.campaignFormat}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Country</label>
                                {isEditing ? (
                                    <select
                                        name="countryCode"
                                        value={editedCampaign.countryCode}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    >
                                        <option value="DK">DK</option>
                                        <option value="DE">DE</option>
                                        <option value="NL">NL</option>
                                        <option value="NO">NO</option>
                                        <option value="FR">FR</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.countryCode}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Type</label>
                                {isEditing ? (
                                    <select
                                        name="b2bOrB2c"
                                        value={editedCampaign.b2bOrB2c}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    >
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                    </select>
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.b2bOrB2c}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Budget</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="budget"
                                        value={editedCampaign.budget}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.budget.toLocaleString()} DKK</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Additional Information</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block">Start Date</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={editedCampaign.startDate}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    />
                                ) : (
                                    <span className="text-base font-medium">{formatDate(displayedCampaign.startDate)}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">End Date</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={editedCampaign.endDate}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                        required
                                    />
                                ) : (
                                    <span className="text-base font-medium">{formatDate(displayedCampaign.endDate)}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Status</label>
                                {isEditing ? (
                                    <select
                                        name="status"
                                        value={editedCampaign.status || "Draft"}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                ) : (
                                    <span className="text-base font-medium">{displayedCampaign.status || "Draft"}</span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Ready for Approval</label>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="readyForApproval"
                                        checked={editedCampaign.readyForApproval || false}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 rounded mt-1"
                                    />
                                ) : (
                                    <span className="text-base font-medium">
                                        {displayedCampaign.readyForApproval ? "Yes" : "No"}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Landingpage</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="landingpage"
                                        value={editedCampaign.landingpage || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                    />
                                ) : (
                                    <span className="text-base font-medium">
                                        {displayedCampaign.landingpage || "Not specified"}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block">Created At</label>
                                <span className="text-base font-medium">{formatDate(displayedCampaign.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="font-medium text-lg mb-4 text-gray-800">Message/Brief</label>
                        {isEditing ? (
                            <textarea
                                name="messageBrief"
                                value={editedCampaign.messageBrief || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                rows="4"
                            />
                        ) : (
                            <p className="text-base bg-gray-50 p-3 rounded border border-gray-200 mt-1">
                                {displayedCampaign.messageBrief || "No message/brief provided."}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="font-medium text-lg mb-4 text-gray-800">Material from Customer</label>
                        {isEditing ? (
                            <textarea
                                name="materialFromCustomer"
                                value={editedCampaign.materialFromCustomer || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                rows="4"
                            />
                        ) : (
                            <p className="text-base bg-gray-50 p-3 rounded border border-gray-200 mt-1">
                                {displayedCampaign.materialFromCustomer || "No materials provided."}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="font-medium text-lg mb-4 text-gray-800">Comment to Customer</label>
                        {isEditing ? (
                            <textarea
                                name="commentToCustomer"
                                value={editedCampaign.commentToCustomer || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full text-sm mt-1"
                                rows="4"
                            />
                        ) : (
                            <p className="text-base bg-gray-50 p-3 rounded border border-gray-200 mt-1">
                                {displayedCampaign.commentToCustomer || "No comments provided."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}