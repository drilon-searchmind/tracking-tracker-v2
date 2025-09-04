"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext";
import CampaignDetailsModal from "./CampaignDetailsModal";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function CampaignList({ customerId }) {
    const { showToast } = useToast();
    const { setIsDetailsModalOpen } = useModalContext();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [modalUpdateTriggered, setModalUpdateTriggered] = useState(false);

    const handleViewDetails = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDetailsModal(true);
        setIsDetailsModalOpen(true); // Update the context
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setIsDetailsModalOpen(false); // Update the context
    };

    const refreshCampaigns = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/campaigns/${customerId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch campaigns");
            }
            const data = await response.json();
            setCampaigns(data);
            
            // If we have a selected campaign and just updated it, update the selectedCampaign state
            if (selectedCampaign && modalUpdateTriggered) {
                const updatedSelectedCampaign = data.find(c => c._id === selectedCampaign._id);
                if (updatedSelectedCampaign) {
                    setSelectedCampaign(updatedSelectedCampaign);
                }
                setModalUpdateTriggered(false);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            showToast("Error refreshing campaign list", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCampaignUpdated = () => {
        setModalUpdateTriggered(true);
        refreshCampaigns();
    };

    // Fetch campaigns when component mounts
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`/api/campaigns/${customerId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch campaigns");
                }
                const data = await response.json();
                setCampaigns(data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
                showToast("Error fetching campaigns", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [customerId, showToast]);

    // Filter campaigns based on active filter
    const filteredCampaigns = campaigns.filter(campaign => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Social") return campaign.service === "Paid Social";
        if (activeFilter === "Email") return campaign.service === "Email Marketing";
        if (activeFilter === "Paid Search") return campaign.service === "Paid Search";
        if (activeFilter === "SEO") return campaign.service === "SEO";
        return true;
    });

    // Handle ready for approval change
    const handleReadyForApprovalChange = async (id, value) => {
        try {
            const response = await fetch(`/api/campaigns/${customerId}?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ readyForApproval: value }),
            });

            if (response.ok) {
                // Update the campaign in the local state
                setCampaigns(campaigns.map(campaign =>
                    campaign._id === id ? { ...campaign, readyForApproval: value } : campaign
                ));
                showToast("Campaign updated", "success");
            } else {
                throw new Error("Failed to update campaign");
            }
        } catch (error) {
            console.error("Error updating campaign:", error);
            showToast("Error updating campaign", "error");
        }
    };

    // Handle status change
    const handleStatusChange = async (id, value) => {
        try {
            const response = await fetch(`/api/campaigns/${customerId}?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: value }),
            });

            if (response.ok) {
                // Update the campaign in the local state
                setCampaigns(campaigns.map(campaign =>
                    campaign._id === id ? { ...campaign, status: value } : campaign
                ));
                showToast("Campaign status updated", "success");
            } else {
                throw new Error("Failed to update campaign status");
            }
        } catch (error) {
            console.error("Error updating campaign status:", error);
            showToast("Error updating campaign status", "error");
        }
    };

    // Handle comment change
    const handleCommentChange = async (id, value) => {
        try {
            const response = await fetch(`/api/campaigns/${customerId}?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ commentToCustomer: value }),
            });

            if (response.ok) {
                // Update the campaign in the local state
                setCampaigns(campaigns.map(campaign =>
                    campaign._id === id ? { ...campaign, commentToCustomer: value } : campaign
                ));
                showToast("Comment updated", "success");
            } else {
                throw new Error("Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            showToast("Error updating comment", "error");
        }
    };

    const handleDeleteCampaign = async (id) => {
        if (!confirm("Are you sure you want to delete this campaign?")) {
            return;
        }

        try {
            const response = await fetch(`/api/campaigns/${customerId}?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the campaign from the local state
                setCampaigns(campaigns.filter(campaign => campaign._id !== id));
                showToast("Campaign deleted", "success");
            } else {
                throw new Error("Failed to delete campaign");
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            showToast("Error deleting campaign", "error");
        }
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Filter tabs */}
            <div className="flex border-b border-gray-200">
                {["All", "Social", "Email", "Paid Search", "SEO"].map((filter) => (
                    <button
                        key={filter}
                        className={`px-6 py-3 text-sm font-medium ${activeFilter === filter
                            ? "border-b-2 border-blue-900 text-blue-900"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Campaigns table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Campaign Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Media
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Format
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Budget
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ready for Approval
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comment
                            </th> */}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.campaignName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.service}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.media}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.campaignFormat}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.budget.toLocaleString()} DKK
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={campaign.readyForApproval || false}
                                            onChange={(e) => handleReadyForApprovalChange(campaign._id, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <select
                                            value={campaign.status || "Draft"}
                                            onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="text"
                                            value={campaign.commentToCustomer || ""}
                                            onChange={(e) => handleCommentChange(campaign._id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                                            placeholder="Add comment..."
                                        />
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(campaign)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCampaign(campaign._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                    No campaigns found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showDetailsModal && (
                <CampaignDetailsModal
                    isOpen={showDetailsModal}
                    onClose={handleCloseDetailsModal}
                    campaign={selectedCampaign}
                    customerId={customerId}
                    onUpdate={handleCampaignUpdated} // Use the new handler
                />
            )}
        </div>
    );
}