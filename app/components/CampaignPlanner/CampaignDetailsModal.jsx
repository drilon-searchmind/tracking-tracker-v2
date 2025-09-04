"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect } from "react";

export default function CampaignDetailsModal({
    isOpen,
    onClose,
    campaign,
    customerId,
}) {
    const { showToast } = useToast();
    const { setIsDetailsModalOpen } = useModalContext();

    useEffect(() => {
        setIsDetailsModalOpen(isOpen);
        return () => {
            setIsDetailsModalOpen(false);
        };
    }, [isOpen, setIsDetailsModalOpen]);

    const handleClose = () => {
        setIsDetailsModalOpen(false);
        onClose();
    };

    if (!isOpen || !campaign) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-blue-900">Campaign Details</h3>
                    <button
                        onClick={handleClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Basic Information</h4>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-600 block">Campaign Name</span>
                                <span className="text-base font-medium">{campaign.campaignName}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Service</span>
                                <span className="text-base font-medium">{campaign.service}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Media</span>
                                <span className="text-base font-medium">{campaign.media}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Format</span>
                                <span className="text-base font-medium">{campaign.campaignFormat}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Country</span>
                                <span className="text-base font-medium">{campaign.countryCode}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Type</span>
                                <span className="text-base font-medium">{campaign.b2bOrB2c}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Budget</span>
                                <span className="text-base font-medium">{campaign.budget.toLocaleString()} DKK</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Additional Information</h4>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-600 block">Start Date</span>
                                <span className="text-base font-medium">{formatDate(campaign.startDate)}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">End Date</span>
                                <span className="text-base font-medium">{formatDate(campaign.endDate)}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Status</span>
                                <span className="text-base font-medium">{campaign.status || "Draft"}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Ready for Approval</span>
                                <span className="text-base font-medium">{campaign.readyForApproval ? "Yes" : "No"}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Landingpage</span>
                                <span className="text-base font-medium">{campaign.landingpage || "Not specified"}</span>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600 block">Created At</span>
                                <span className="text-base font-medium">{formatDate(campaign.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Message/Brief</h4>
                        <p className="text-base bg-gray-50 p-3 rounded border border-gray-200">
                            {campaign.messageBrief || "No message/brief provided."}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Material from Customer</h4>
                        <p className="text-base bg-gray-50 p-3 rounded border border-gray-200">
                            {campaign.materialFromCustomer || "No materials provided."}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <h4 className="font-medium text-lg mb-4 text-gray-800">Comment to Customer</h4>
                        <p className="text-base bg-gray-50 p-3 rounded border border-gray-200">
                            {campaign.commentToCustomer || "No comments provided."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}