"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { ClickUpUsersProvider } from "@/app/contexts/ClickUpUsersContext";

import CampaignPlannerModal from "@/app/components/CampaignPlanner/CampaignPlannerModal";
import ParentCampaignModal from "@/app/components/CampaignPlanner/ParentCampaignModal";
import CampaignList from "@/app/components/CampaignPlanner/CampaignList";
import CampaignCalendar from "@/app/components/CampaignPlanner/CampaignCalendar";
import CampaignDetailsModal from "@/app/components/CampaignPlanner/CampaignDetailsModal";
import CampaignPlannerGanttChart from "@/app/components/CampaignPlanner/CampaignPlannerGanttChart";
import CustomerAssignedUsers from "@/app/components/CampaignPlanner/CustomerAssignedUsers";

import { FaCirclePlus } from "react-icons/fa6";

export default function KampagneplanDashboard({ customerId, customerName, initialData }) {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setIsCampaignModalOpen } = useModalContext();
    const [refreshList, setRefreshList] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [clickupDataLoaded, setClickupDataLoaded] = useState(false);

    const [isParentModalOpen, setIsParentModalOpen] = useState(false);
    const [parentCampaigns, setParentCampaigns] = useState([]);
    const [refreshParentList, setRefreshParentList] = useState(false);

    const [formData, setFormData] = useState({
        service: "",
        media: "",
        campaignFormat: "",
        countryCode: "",
        startDate: "",
        endDate: "",
        campaignName: "",
        messageBrief: "",
        b2bOrB2c: "",
        budget: "",
        landingpage: "",
        materialFromCustomer: "",
        parentCampaignId: "",
        campaignType: "",
        campaignDimensions: "",
        campaignVariation: "",
        campaignTextToCreative: "",
        campaignTextToCreativeTranslation: "",
        assignedUsers: [],
    });

    const handleClickupUsersLoaded = useCallback((usersByService) => {
        console.log("Clickup users loaded:", usersByService);
        setClickupDataLoaded(true);
    }, []);

    const fetchParentCampaigns = async () => {
        try {
            const response = await fetch(`/api/parent-campaigns/${customerId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch parent campaigns");
            }
            const data = await response.json();
            setParentCampaigns(data);
        } catch (error) {
            console.error("Error fetching parent campaigns:", error);
            showToast("Error fetching parent campaigns", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "campaignType" && value === "Always On") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                endDate: "",   // Clear end date
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

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
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [customerId, refreshList]);

    useEffect(() => {
        fetchParentCampaigns();
    }, [customerId, refreshParentList]);

    const handleOpenParentModal = () => {
        setIsParentModalOpen(true);
    };

    const handleCloseParentModal = () => {
        setIsParentModalOpen(false);
    };

    const handleParentCampaignSuccess = () => {
        setRefreshParentList(prev => !prev);
        setRefreshList(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, customerId }),
            });

            if (response.ok) {
                const campaignData = await response.json();
                const campaignId = campaignData.campaign._id;

                showToast("Campaign created successfully!", "success");

                if (formData.assignedUsers && formData.assignedUsers.length > 0) {
                    await Promise.all(formData.assignedUsers.map(async (userId) => {
                        console.log(`Assigning user ${userId} to campaign ${campaignId}`);
                        try {
                            const assignResponse = await fetch('/api/assigned-campaign-users', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    campaignId: campaignId,
                                    assignedUserId: userId
                                })
                            });

                            if (!assignResponse.ok) {
                                const errorData = await assignResponse.json();
                                console.error("Error assigning user:", errorData);
                            }
                        } catch (err) {
                            console.error(`Error assigning user ${userId}:`, err);
                        }
                    }));
                }

                setIsModalOpen(false);
                setFormData({
                    service: "",
                    media: "",
                    campaignFormat: "",
                    countryCode: "",
                    startDate: "",
                    endDate: "",
                    campaignName: "",
                    messageBrief: "",
                    b2bOrB2c: "",
                    budget: "",
                    landingpage: "",
                    materialFromCustomer: "",
                    parentCampaignId: "",
                    campaignType: "",
                    campaignDimensions: "",
                    campaignVariation: "",
                    campaignTextToCreative: "",
                    campaignTextToCreativeTranslation: "",
                    assignedUsers: [],
                });
                setRefreshList(prev => !prev);
            } else {
                const errorData = await response.json();
                showToast(`Failed to create campaign: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Campaign creation error:", error);
            showToast("Error submitting form", "error");
        }
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setIsCampaignModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsCampaignModalOpen(false);
    };

    const handleToggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleViewCampaignDetails = (campaign) => {
        setSelectedCampaign(campaign);
        if (clickupDataLoaded) {
            setShowDetailsModal(true);
        } else {
            console.log("Waiting for Clickup data to load before showing campaign details...");
            setTimeout(() => {
                setShowDetailsModal(true);
            }, 500);
        }
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedCampaign(null);
    };

    const handleCampaignUpdated = () => {
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const campaignId = params.get('campaignId');

        if (campaignId && campaigns.length > 0) {
            const targetCampaign = campaigns.find(campaign => campaign._id === campaignId);
            if (targetCampaign) {
                handleViewCampaignDetails(targetCampaign);
            }
        }
    }, [campaigns]);

    return (
        <ClickUpUsersProvider>
            <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[#f8fafc] rounded-lg z-1"></div>
                <div className="absolute bottom-[-355px] left-0 w-full h-full z-1">
                    <Image
                        width={1920}
                        height={1080}
                        src="/images/shape-dotted-light.svg"
                        alt="bg"
                        className="w-full h-full"
                    />
                </div>

                <div className="px-0 md:px-20 mx-auto z-10 relative">
                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-center md:items-center gap-4">
                        <span>
                            <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                            <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">Campaign Planner</h1>
                            <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                                Plan and adjust your marketing campaigns with precise budgets and expected results.
                            </p>
                        </span>

                        <span>
                            <CustomerAssignedUsers
                                customerId={customerId}
                                onUsersLoaded={handleClickupUsersLoaded}
                            />
                        </span>
                    </div>

                    {/* Campaign List */}
                    <div className="mb-6 md:mb-10">
                        <div className="mb-2 md:mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h3 className="text-lg md:text-xl font-semibold text-black xl:text-2xl">Your Campaigns</h3>

                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                                <button
                                    onClick={handleOpenParentModal}
                                    className="text-center text-zinc-900 border border-zinc-700 py-2 px-4 rounded text-white hover:text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm flex gap-2 items-center justify-center md:justify-start"
                                >
                                    <FaCirclePlus />
                                    <span className="whitespace-nowrap">Create Parent Campaign</span>
                                </button>
                                <button
                                    onClick={handleOpenModal}
                                    className="hidden text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm flex gap-2 items-center justify-center md:justify-start"
                                >
                                    <FaCirclePlus />
                                    <span>Create Campaign</span>
                                </button>
                            </div>
                        </div>
                        <CampaignList customerId={customerId} key={refreshList} />
                    </div>

                    <div className="mb-8 md:mb-12">
                        <h3 className="text-lg md:text-xl font-semibold text-black xl:text-2xl mb-4 md:mb-5">Campaign Calendar</h3>
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <CampaignCalendar
                                    campaigns={campaigns}
                                    customerId={customerId}
                                    onViewCampaignDetails={handleViewCampaignDetails}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 md:mb-12">
                        <h3 className="text-lg md:text-xl font-semibold text-black xl:text-2xl mb-4 md:mb-5">Campaign Timeline</h3>
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <CampaignPlannerGanttChart
                                    campaigns={campaigns}
                                    customerId={customerId}
                                    onViewCampaignDetails={handleViewCampaignDetails}
                                />
                            </div>
                        </div>
                    </div>

                    <CampaignPlannerModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        customerId={customerId}
                        parentCampaigns={parentCampaigns}
                    />

                    <ParentCampaignModal
                        isOpen={isParentModalOpen}
                        onClose={handleCloseParentModal}
                        customerId={customerId}
                        onSuccess={handleParentCampaignSuccess}
                    />

                    {showDetailsModal && selectedCampaign && (
                        <CampaignDetailsModal
                            isOpen={showDetailsModal}
                            onClose={handleCloseDetailsModal}
                            campaign={selectedCampaign}
                            customerId={customerId}
                            onUpdate={handleCampaignUpdated}
                        />
                    )}
                </div>
            </div>
        </ClickUpUsersProvider>
    );
}