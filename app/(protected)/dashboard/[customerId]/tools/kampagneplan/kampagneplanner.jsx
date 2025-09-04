"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import CampaignPlannerModal from "@/app/components/CampaignPlanner/CampaignPlannerModal";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function KampagneplanDashboard({ customerId, customerName, initialData }) {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setIsCampaignModalOpen } = useModalContext();

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
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, customerId }),
            })

            if (response.ok) {
                showToast("Campaign created successfully!", "success");
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
                });
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

    return (
        <div className="py-20 px-0 relative overflow">
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

            <div className="px-20 mx-auto z-10 relative">
                <div className="mb-8">
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">Campaign Planner</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Plan and adjust your marketing campaigns with precise budgets and expected results.
                    </p>
                </div>

                <div className="mb-12">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                    >
                        Create a New Campaign
                    </button>
                </div>

                <CampaignPlannerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    customerId={customerId}
                />
            </div>
        </div>
    );
}