"use client";

import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/app/contexts/ToastContext";
import CampaignDetailsModal from "./CampaignDetailsModal";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { format, startOfMonth, endOfMonth } from 'date-fns';

import { FaMeta } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { SiGoogleads } from "react-icons/si";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { MdOutlinePending } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import countryCodes from "@/lib/static-data/countryCodes.json";

export default function CampaignList({ customerId }) {
    const { showToast } = useToast();
    const { setIsDetailsModalOpen } = useModalContext();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [commentCounts, setCommentCounts] = useState({});
    const [parentCampaignMap, setParentCampaignMap] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fetchId, setFetchId] = useState(0);
    const [expandedParents, setExpandedParents] = useState({});
    const [organizedCampaigns, setOrganizedCampaigns] = useState({});
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("All");
    const [modalUpdateTriggered, setModalUpdateTriggered] = useState(false);

    const countryOptions = useMemo(() => {
        const uniqueCountryCodes = new Set(campaigns.map(campaign => campaign.countryCode).filter(Boolean));
        const frequentCountries = [
            { value: "DK", name: "Denmark" },
            { value: "DE", name: "Germany" },
            { value: "NL", name: "Netherlands" },
            { value: "NO", name: "Norway" },
            { value: "FR", name: "France" },
        ].filter(country => uniqueCountryCodes.has(country.value));
        
        const otherCountries = [...uniqueCountryCodes]
            .filter(code => !frequentCountries.some(c => c.value === code))
            .map(code => {
                const countryInfo = countryCodes.find(c => c.code === code) || { code };
                return { value: code, name: countryInfo.name || code };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
            
        return [...frequentCountries, ...otherCountries];
    }, [campaigns]);

    const pendingApprovalCount = campaigns.filter(
        campaign => campaign.status === "Pending Customer Approval"
    ).length;

    const fetchCommentCounts = useCallback(async (campaignIds) => {
        try {
            const counts = {};

            await Promise.all(campaignIds.map(async (id) => {
                const response = await fetch(`/api/campaign-comments/${id}`);
                if (response.ok) {
                    const comments = await response.json();
                    counts[id] = comments.length;
                }
            }));

            setCommentCounts(counts);
        } catch (error) {
            console.error("Error fetching comment counts:", error);
        }
    }, []);

    const toggleParentExpansion = useCallback((parentId) => {
        setExpandedParents(prev => ({
            ...prev,
            [parentId]: !prev[parentId]
        }));
    }, []);

    const getAvailableMonths = useCallback(() => {
        const months = [];
        const uniqueMonthsSet = new Set();

        campaigns.forEach(campaign => {
            if (campaign.campaignType === "Always On" || !campaign.startDate || !campaign.endDate) {
                return;
            }

            const startDate = new Date(campaign.startDate);
            const endDate = new Date(campaign.endDate);

            let currentDate = new Date(startDate);

            const safeEndDate = new Date(endDate);
            safeEndDate.setFullYear(safeEndDate.getFullYear() + 1);

            while (currentDate <= endDate && currentDate <= safeEndDate) {
                const monthKey = format(currentDate, 'yyyy-MM');
                const monthLabel = format(currentDate, 'MMMM yyyy');

                if (!uniqueMonthsSet.has(monthKey)) {
                    uniqueMonthsSet.add(monthKey);
                    months.push({
                        value: monthKey,
                        label: monthLabel
                    });
                }

                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        });

        months.sort((a, b) => {
            return new Date(a.value + '-01') - new Date(b.value + '-01');
        });

        return months;
    }, [campaigns]);

    const organizeCampaigns = useCallback(() => {
        const organized = {
            'no-parent': {
                id: 'no-parent',
                name: 'No Parent',
                campaigns: []
            }
        };

        filteredCampaigns.forEach(campaign => {
            if (campaign.parentCampaignId && parentCampaignMap[campaign.parentCampaignId]) {
                const parentId = campaign.parentCampaignId;

                if (!organized[parentId]) {
                    organized[parentId] = {
                        id: parentId,
                        name: parentCampaignMap[parentId],
                        campaigns: []
                    };
                }

                organized[parentId].campaigns.push(campaign);
            } else {
                organized['no-parent'].campaigns.push(campaign);
            }
        });

        return organized;
    }, [filteredCampaigns, parentCampaignMap]);

    const availableMonths = getAvailableMonths();

    const handleViewDetails = useCallback((campaign) => {
        setSelectedCampaign(campaign);
        setShowDetailsModal(true);
        setIsDetailsModalOpen(true);
    }, [setIsDetailsModalOpen]);

    const handleCloseDetailsModal = useCallback(() => {
        setShowDetailsModal(false);
        setIsDetailsModalOpen(false);
    }, [setIsDetailsModalOpen]);

    const fetchCampaigns = useCallback(async (isRefreshOperation = false) => {
        if (isRefreshing) return;

        const currentFetchId = fetchId + 1;
        setFetchId(currentFetchId);

        try {
            setIsRefreshing(true);
            setLoading(true);

            console.log("Fetching campaigns for customer ID:", customerId);
            console.log("Current fetch ID:", currentFetchId);

            const response = await fetch(`/api/campaigns/${customerId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch campaigns");
            }

            const data = await response.json();

            console.log("Fetch complete. Current/Latest fetch ID:", currentFetchId, fetchId);

            setCampaigns(data);

            if (data.length > 0) {
                fetchCommentCounts(data.map(campaign => campaign._id));
            }

            if (selectedCampaign && isRefreshOperation) {
                const updatedSelectedCampaign = data.find(c => c._id === selectedCampaign._id);
                if (updatedSelectedCampaign) {
                    setSelectedCampaign(updatedSelectedCampaign);
                }
            }

            setLoading(false);

            setTimeout(() => {
                setIsRefreshing(false);
            }, 300);

            if (isRefreshOperation) {
                setModalUpdateTriggered(false);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            showToast(isRefreshOperation ? "Error refreshing campaign list" : "Error fetching campaigns", "error");

            setLoading(false);
            setTimeout(() => {
                setIsRefreshing(false);
            }, 300);
        }
    }, [customerId, fetchCommentCounts, showToast, selectedCampaign, fetchId, isRefreshing]);

    const handleCampaignUpdated = useCallback(() => {
        setModalUpdateTriggered(true);
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [customerId]);

    useEffect(() => {
        let refreshTimer;
        if (modalUpdateTriggered) {
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => {
                fetchCampaigns(true);
            }, 200);
        }

        return () => {
            clearTimeout(refreshTimer);
        };
    }, [modalUpdateTriggered, fetchCampaigns]);

    useEffect(() => {
        const fetchParentCampaigns = async () => {
            if (campaigns.length === 0) return;

            try {
                const response = await fetch(`/api/parent-campaigns/${customerId}`);
                if (response.ok) {
                    const parentCampaigns = await response.json();
                    const map = {};
                    parentCampaigns.forEach(parent => {
                        map[parent._id] = parent.parentCampaignName;
                    });
                    setParentCampaignMap(map);
                }
            } catch (error) {
                console.error("Error fetching parent campaigns:", error);
            }
        };

        fetchParentCampaigns();
    }, [campaigns.length, customerId]);

    useEffect(() => {
        const filtered = campaigns.filter(campaign => {
            let passesServiceFilter = true;
            if (activeFilter === "Social") passesServiceFilter = campaign.service === "Paid Social";
            else if (activeFilter === "Email") passesServiceFilter = campaign.service === "Email Marketing";
            else if (activeFilter === "Paid Search") passesServiceFilter = campaign.service === "Paid Search";
            else if (activeFilter === "SEO") passesServiceFilter = campaign.service === "SEO";
            else if (activeFilter === "Pending Customer Approval") passesServiceFilter = campaign.status === "Pending Customer Approval";

            let passesMonthFilter = true;
            if (selectedMonth !== "All") {
                if (campaign.campaignType === "Always On") {
                    passesMonthFilter = true;
                } else {
                    const [year, month] = selectedMonth.split('-').map(num => parseInt(num, 10));
                    const filterStartDate = startOfMonth(new Date(year, month - 1));
                    const filterEndDate = endOfMonth(filterStartDate);

                    if (campaign.startDate && campaign.endDate) {
                        const campaignStartDate = new Date(campaign.startDate);
                        const campaignEndDate = new Date(campaign.endDate);

                        passesMonthFilter = (
                            (campaignStartDate >= filterStartDate && campaignStartDate <= filterEndDate) ||
                            (campaignEndDate >= filterStartDate && campaignEndDate <= filterEndDate) ||
                            (campaignStartDate <= filterStartDate && campaignEndDate >= filterEndDate)
                        );
                    } else {
                        passesMonthFilter = false;
                    }
                }
            }

            let passesCountryFilter = true;
            if (selectedCountry !== "All") {
                passesCountryFilter = campaign.countryCode === selectedCountry;
            }

            let passesSearchFilter = true;
            if (searchQuery.trim() !== "") {
                passesSearchFilter = campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return passesServiceFilter && passesMonthFilter && passesCountryFilter && passesSearchFilter;
        });

        setFilteredCampaigns(filtered);
    }, [campaigns, activeFilter, selectedMonth, selectedCountry, searchQuery]);

    useEffect(() => {
        setOrganizedCampaigns(organizeCampaigns());
    }, [filteredCampaigns, parentCampaignMap, organizeCampaigns]);

    const handleStatusChange = useCallback(async (id, value) => {
        try {
            const response = await fetch(`/api/campaigns/${customerId}?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: value }),
            });

            if (response.ok) {
                setCampaigns(prevCampaigns =>
                    prevCampaigns.map(campaign =>
                        campaign._id === id ? { ...campaign, status: value } : campaign
                    )
                );
                showToast("Campaign status updated", "success");
            } else {
                throw new Error("Failed to update campaign status");
            }
        } catch (error) {
            console.error("Error updating campaign status:", error);
            showToast("Error updating campaign status", "error");
        }
    }, [customerId, showToast]);

    const [copyingCampaignId, setCopyingCampaignId] = useState(null);

    const handleCopyCampaign = useCallback(async (id) => {
        try {
            setCopyingCampaignId(id);

            const campaignToCopy = campaigns.find(campaign => campaign._id === id);
            if (!campaignToCopy) {
                throw new Error("Campaign not found");
            }

            const newCampaign = { ...campaignToCopy };
            delete newCampaign._id;
            delete newCampaign.createdAt;
            newCampaign.campaignName = `${newCampaign.campaignName} (Copy)`;

            const response = await fetch(`/api/campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCampaign),
            });

            if (response.ok) {
                showToast("Campaign copied successfully", "success");
                setModalUpdateTriggered(true);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to copy campaign");
            }
        } catch (error) {
            console.error("Error copying campaign:", error);
            showToast(`Error copying campaign: ${error.message}`, "error");
        } finally {
            setCopyingCampaignId(null);
        }
    }, [campaigns, customerId, showToast]);

    const handleDeleteCampaign = useCallback(async (id) => {
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
    }, [campaigns, customerId, showToast]);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    const renderCampaignRow = (campaign) => (
        <tr key={campaign._id} className="hover:bg-gray-50">
            <td className="px-3 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center">
                    <div
                        className={`w-3 h-3 rounded-full ${campaign.status === "Live" ? "bg-green-500" :
                            campaign.status === "Pending" || campaign.status === "Pending Customer Approval" ? "bg-amber-500" :
                                campaign.status === "Ended" ? "bg-red-500" :
                                    campaign.status === "Approved" ? "bg-blue-500" : "bg-gray-300"
                            }`}
                        title={campaign.status}
                    ></div>
                </div>
            </td>
            <td
                onClick={() => handleViewDetails(campaign)}
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1C398E] hover:underline cursor-pointer pl-10">
                {campaign.campaignName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <select
                    value={campaign.status || "Pending"}
                    onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                >
                    <option value="Pending">Pending</option>
                    <option value="Pending Customer Approval">Pending Customer Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Live">Live</option>
                    <option value="Ended">Ended</option>
                </select>
            </td>
            {/* Add new cell for country code */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.countryCode || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.campaignType === "Always On" ? (
                    <span className="text-gray-800 font-medium">Always On</span>
                ) : (
                    <>
                        {campaign.startDate && campaign.endDate ? (
                            `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                        ) : (
                            <span className="text-gray-400">No dates specified</span>
                        )}
                    </>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {campaign.budget.toLocaleString()} DKK
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleViewDetails(campaign)}
                        className="border py-1 text-xs text-center px-2 text-[var(--color-primary-searchmind)] hover:text-[#2E4CA8] font-medium flex items-center rounded-md"
                    >
                        <span className="">View</span>
                    </button>
                    <button
                        onClick={() => handleCopyCampaign(campaign._id)}
                        disabled={copyingCampaignId === campaign._id}
                        className="border py-1 text-xs text-center px-2 text-blue-600 hover:text-blue-800 font-medium flex items-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="">
                            {copyingCampaignId === campaign._id ? "Copying..." : "Copy"}
                        </span>
                    </button>
                    <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="border py-1 text-xs text-center px-2 text-red-600 hover:text-red-800 font-medium flex items-center rounded-md"
                    >
                        <span className="">Delete</span>
                    </button>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commentCounts[campaign._id] > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {commentCounts[campaign._id]}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">0</span>
                )}
            </td>
        </tr>
    );

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
                <button
                    key="Pending Customer Approval"
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeFilter === "Pending Customer Approval"
                        ? "border-b-2 border-[#1C398E] text-[#1C398E]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveFilter("Pending Customer Approval")}
                >
                    <MdOutlinePending className="text-lg" />
                    Pending Customer Approval
                    {pendingApprovalCount > 0 && (
                        <span className="ml-0 px-2 py-0.5 text-[0.65rem] bg-red-100 text-red-800 rounded-full">
                            {pendingApprovalCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="flex justify-end px-6 py-2 bg-gray-50 border-b border-gray-200 gap-4">
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-sm border border-gray-300 rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E] w-64"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <span className="text-xs">✕</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="country-filter" className="mr-2 text-sm font-medium text-gray-700">
                            Filter by country:
                        </label>
                        <select
                            id="country-filter"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                        >
                            <option value="All">All Countries</option>
                            {countryOptions.map(country => (
                                <option key={country.value} value={country.value}>
                                    {country.name} ({country.value})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="month-filter" className="mr-2 text-sm font-medium text-gray-700">
                            Filter by month:
                        </label>
                        <select
                            id="month-filter"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1C398E] focus:border-[#1C398E]"
                        >
                            <option value="All">All Months</option>
                            {availableMonths.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200" id="campaignListTable">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '40px' }}>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Campaign Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Country
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Budget
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comments
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Object.keys(organizedCampaigns).length > 0 ? (
                            Object.values(organizedCampaigns).map((parentGroup) => (
                                <React.Fragment key={parentGroup.id}>
                                    <tr
                                        className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => toggleParentExpansion(parentGroup.id)}
                                    >
                                        <td className="px-3 py-3 whitespace-nowrap text-center">
                                            {expandedParents[parentGroup.id] ?
                                                <FaChevronDown className="text-gray-500" /> :
                                                <FaChevronRight className="text-gray-500" />
                                            }
                                        </td>
                                        <td colSpan="6" className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {parentGroup.name} ({parentGroup.campaigns.length})
                                        </td>
                                    </tr>

                                    {expandedParents[parentGroup.id] &&
                                        parentGroup.campaigns.map(campaign => renderCampaignRow(campaign))
                                    }
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                    No campaigns found for the selected filter
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-600 py-2 px-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Live</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Ended</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Approved</span>
                </div>
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