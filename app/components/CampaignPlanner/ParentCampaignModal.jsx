"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function ParentCampaignModal({
    isOpen,
    onClose,
    customerId,
    onSuccess
}) {
    const { showToast } = useToast();
    const { setIsParentCampaignModalOpen } = useModalContext();

    const [formData, setFormData] = useState({
        parentCampaignName: "",
        materialLinks: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsParentCampaignModalOpen?.(isOpen);

        return () => {
            setIsParentCampaignModalOpen?.(false);
        };
    }, [isOpen, setIsParentCampaignModalOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.parentCampaignName.trim()) {
            showToast("Parent campaign name is required", "error");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/parent-campaigns/${customerId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showToast("Parent campaign created successfully!", "success");
                setFormData({
                    parentCampaignName: "",
                    materialLinks: ""
                });
                onSuccess?.();
                onClose();
            } else {
                const errorData = await response.json();
                showToast(`Failed to create parent campaign: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Parent campaign creation error:", error);
            showToast("Error creating parent campaign", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Create Parent Campaign</h4>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Campaign Name</label>
                        <input
                            type="text"
                            name="parentCampaignName"
                            value={formData.parentCampaignName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material Links</label>
                        <textarea
                            name="materialLinks"
                            value={formData.materialLinks}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            rows="3"
                            placeholder="Add links to materials, one per line"
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Parent Campaign"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
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