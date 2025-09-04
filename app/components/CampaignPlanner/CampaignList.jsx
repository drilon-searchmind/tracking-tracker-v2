"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext";
import CampaignDetailsModal from "./CampaignDetailsModal";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

import { FaMeta } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { SiGoogleads } from "react-icons/si";
import { FaMagnifyingGlassChart } from "react-icons/fa6";

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
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setIsDetailsModalOpen(false);
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

    const filteredCampaigns = campaigns.filter(campaign => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Social") return campaign.service === "Paid Social";
        if (activeFilter === "Email") return campaign.service === "Email Marketing";
        if (activeFilter === "Paid Search") return campaign.service === "Paid Search";
        if (activeFilter === "SEO") return campaign.service === "SEO";
        return true;
    });

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
        <div className="bg-white border border-zinc-200 rounded-lg shadow-solid-9 overflow-hidden">
            <div className="flex border-b border-gray-200 bg-[#f8fafc]">
                <button
                    key="All"
                    className={`px-6 py-3 text-sm font-medium ${activeFilter === "All"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("All")}
                >
                    All
                </button>
                <button
                    key="Social"
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeFilter === "Social"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("Social")}
                >
                    <FaMeta className="text-lg" /> Social
                </button>
                <button
                    key="Email"
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeFilter === "Email"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("Email")}
                >
                    <MdEmail className="text-lg" /> Email
                </button>
                <button
                    key="Paid Search"
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeFilter === "Paid Search"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("Paid Search")}
                >
                    <SiGoogleads className="text-lg" /> Paid Search
                </button>
                <button
                    key="SEO"
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeFilter === "SEO"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("SEO")}
                >
                    <FaMagnifyingGlassChart className="text-lg" /> SEO
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" id="campaignListTable">
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign._id} className="hover:bg-gray-50">
                                    <td
                                        onClick={() => handleViewDetails(campaign)}
                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1C398E]hover:cursor-pointer hover:underline cursor-pointer">
                                        {campaign.campaignName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {campaign.service === "Paid Social" ? (
                                            <div className="flex items-center gap-2">
                                                <FaMeta className="text-lg" />
                                                <span>{campaign.service}</span>
                                            </div>
                                        ) : campaign.service === "Email Marketing" ? (
                                            <div className="flex items-center gap-2">
                                                <MdEmail className="text-lg" />
                                                <span>{campaign.service}</span>
                                            </div>
                                        ) : campaign.service === "Paid Search" ? (
                                            <div className="flex items-center gap-2">
                                                <SiGoogleads className="text-lg" />
                                                <span>{campaign.service}</span>
                                            </div>
                                        ) : campaign.service === "SEO" ? (
                                            <div className="flex items-center gap-2">
                                                <FaMagnifyingGlassChart className="text-lg" />
                                                <span>{campaign.service}</span>
                                            </div>
                                        ) : (
                                            <span>{campaign.service}</span>
                                        )}
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {campaign.budget.toLocaleString()} DKK
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={campaign.readyForApproval || false}
                                            onChange={(e) => handleReadyForApprovalChange(campaign._id, e.target.checked)}
                                            className="h-4 w-4 text-[#1C398E] border-gray-300 rounded focus:ring-[#1C398E]"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <select
                                            value={campaign.status || "Draft"}
                                            onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(campaign)}
                                                className="border py-1 text-xs text-center px-2 text-[var(--color-primary-searchmind)] hover:text-[#2E4CA8] font-medium flex items-center"
                                            >
                                                <span className="">View</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCampaign(campaign._id)}
                                                className="border py-1 text-xs text-center px-2 text-red-600 hover:text-red-800 font-medium flex items-center"
                                            >
                                                <span className="">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                                    No campaigns found for the selected filter
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
                    onUpdate={handleCampaignUpdated}
                />
            )}
        </div>
    );
}