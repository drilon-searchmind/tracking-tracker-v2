"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
import { useClickUpUsers } from "@/app/contexts/ClickUpUsersContext";
import Select from "react-select";
import countryCodes from '@/lib/static-data/countryCodes.json';
import { IoMdClose } from "react-icons/io";
import CommentSection from "./CommentSection";

export default function CampaignDetailsModal({
    isOpen,
    onClose,
    campaign,
    customerId,
    onUpdate
}) {
    const { showToast } = useToast();
    const { setIsDetailsModalOpen } = useModalContext();
    const { clickupUsers, isClickupUsersLoaded } = useClickUpUsers();

    const [isEditing, setIsEditing] = useState(false);
    const [editedCampaign, setEditedCampaign] = useState(null);
    const [displayedCampaign, setDisplayedCampaign] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [parentCampaigns, setParentCampaigns] = useState([]);
    const [parentCampaignName, setParentCampaignName] = useState("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [serviceUser, setServiceUser] = useState(null);

    const countryOptions = countryCodes.map(country => ({
        value: country.code,
        label: `${country.name} (${country.code})`,
    }));

    const frequentCountries = [
        { value: "DK", label: "Denmark (DK)" },
        { value: "DE", label: "Germany (DE)" },
        { value: "NL", label: "Netherlands (NL)" },
        { value: "NO", label: "Norway (NO)" },
        { value: "FR", label: "France (FR)" },
        { value: "", label: "───────────────" },
    ];

    const allCountryOptions = [...frequentCountries, ...countryOptions];
    const selectedCountryOption = allCountryOptions.find(option =>
        option.value === editedCampaign?.countryCode
    ) || null;

    const selectedUserOptions = assignedUsers.length > 0
        ? users.filter(user => {
            return assignedUsers.some(id =>
                id.toString() === user.value.toString()
            );
        })
        : [];

    const handleCountryChange = (selectedOption) => {
        const syntheticEvent = {
            target: {
                name: 'countryCode',
                value: selectedOption ? selectedOption.value : ''
            }
        };
        handleInputChange(syntheticEvent);
    };

    const handleUserChange = (selectedOptions) => {
        const newAssignedUsers = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setAssignedUsers(newAssignedUsers);

        setEditedCampaign(prev => ({
            ...prev,
            assignedUsers: newAssignedUsers
        }));
    };

    useEffect(() => {
        if (campaign) {
            const formattedCampaign = {
                ...campaign,
                startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
                endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
            };
            setEditedCampaign(formattedCampaign);
            setDisplayedCampaign(campaign);

            fetchAssignedUsers(campaign._id);
        }
    }, [campaign]);

    useEffect(() => {
        if (campaign && campaign.service) {
            console.log("Campaign service:", campaign.service);
            console.log("Available clickup users (from context):", clickupUsers);

            let serviceKey = "";

            switch (campaign.service) {
                case "SEO":
                    serviceKey = "SEO";
                    break;
                case "Paid Search":
                    serviceKey = "PPC";
                    break;
                case "Paid Social":
                    serviceKey = "PS";
                    break;
                case "Email Marketing":
                    serviceKey = "EM";
                    break;
                default:
                    for (const key in clickupUsers) {
                        if (key.toLowerCase().includes(campaign.service.toLowerCase()) ||
                            campaign.service.toLowerCase().includes(key.toLowerCase())) {
                            serviceKey = key;
                            break;
                        }
                    }
                    break;
            }

            console.log(`Mapped service "${campaign.service}" to key "${serviceKey}"`);

            if (serviceKey && clickupUsers && clickupUsers[serviceKey] && clickupUsers[serviceKey].length > 0) {
                console.log(`Found user for ${serviceKey}:`, clickupUsers[serviceKey][0]);
                setServiceUser(clickupUsers[serviceKey][0]);
            } else {
                console.log(`No users found for service key "${serviceKey}"`);
                setServiceUser(null);
            }
        } else {
            console.log("Missing data for service user mapping:", {
                hasService: Boolean(campaign?.service),
                serviceValue: campaign?.service,
                hasClickupUsers: clickupUsers && Object.keys(clickupUsers).length > 0
            });
            setServiceUser(null);
        }
    }, [campaign, clickupUsers]);

    const fetchAssignedUsers = async (campaignId) => {
        try {
            const response = await fetch(`/api/assigned-campaign-users?campaignId=${campaignId}`);
            if (response.ok) {
                const data = await response.json();
                const userIds = data.map(assignment => assignment.assignedUserId);
                setAssignedUsers(userIds);

                setEditedCampaign(prev => ({
                    ...prev,
                    assignedUsers: userIds
                }));
            }
        } catch (error) {
            console.error("Error fetching assigned users:", error);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (isOpen) {
                setIsLoadingUsers(true);
                try {
                    const response = await fetch('/api/campaign-assignable-users');

                    if (response.ok) {
                        const userData = await response.json();
                        setUsers(userData.map(user => ({
                            value: user._id || user.id,
                            label: user.name || user.email
                        })));
                    }
                } catch (error) {
                    console.error("Error fetching users:", error);
                    showToast("Failed to load users", "error");
                } finally {
                    setIsLoadingUsers(false);
                }
            }
        };

        fetchUsers();
    }, [isOpen, showToast]);

    useEffect(() => {
        const fetchParentCampaigns = async () => {
            if (isOpen && customerId) {
                try {
                    const response = await fetch(`/api/parent-campaigns/${customerId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setParentCampaigns(data);

                        if (displayedCampaign?.parentCampaignId) {
                            const parent = data.find(p => p._id === displayedCampaign.parentCampaignId);
                            setParentCampaignName(parent?.parentCampaignName || "Unknown Parent");
                        } else {
                            setParentCampaignName("");
                        }
                    }
                } catch (error) {
                    console.error("Error fetching parent campaigns:", error);
                }
            }
        };

        fetchParentCampaigns();
    }, [isOpen, customerId, displayedCampaign]);

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

        if (name === "campaignType" && value === "Always On") {
            setEditedCampaign(prev => ({
                ...prev,
                [name]: value,
                startDate: '', // Clear start date
                endDate: ''    // Clear end date
            }));
        } else {
            setEditedCampaign(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
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
                await updateAssignedUsers(campaign._id, assignedUsers);

                showToast("Campaign updated successfully!", "success");

                setTimeout(() => {
                    if (onUpdate) onUpdate();
                    handleClose();
                }, 50);
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

    const updateAssignedUsers = async (campaignId, newUserIds) => {
        try {
            const response = await fetch(`/api/assigned-campaign-users?campaignId=${campaignId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch current user assignments");
            }

            const currentAssignments = await response.json();
            const currentUserIds = currentAssignments.map(a => a.assignedUserId);

            const usersToAdd = newUserIds.filter(id => !currentUserIds.includes(id));

            const usersToRemove = currentUserIds.filter(id => !newUserIds.includes(id));

            const addPromises = usersToAdd.map(userId =>
                fetch('/api/assigned-campaign-users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        campaignId,
                        assignedUserId: userId
                    })
                })
            );

            const removePromises = usersToRemove.map(userId =>
                fetch(`/api/assigned-campaign-users?campaignId=${campaignId}&userId=${userId}`, {
                    method: 'DELETE'
                })
            );

            await Promise.all([...addPromises, ...removePromises]);

        } catch (error) {
            console.error("Error updating user assignments:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (campaign && campaign._id && users.length > 0) {
            const loadAssignedUsers = async () => {
                try {
                    const response = await fetch(`/api/assigned-campaign-users?campaignId=${campaign._id}`);
                    if (response.ok) {
                        const data = await response.json();
                        const userIds = data.map(assignment => assignment.assignedUserId);
                        setAssignedUsers(userIds);
                    }
                } catch (error) {
                    console.error("Error loading assigned users:", error);
                }
            };

            loadAssignedUsers();
        }
    }, [campaign, users]);

    if (!isOpen || !editedCampaign || !displayedCampaign) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
                <span className="flex justify-between items-start mb-5">
                    <span>
                        <div>
                            <div className="">
                                {!isClickupUsersLoaded ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-zinc-700 rounded-full animate-spin"></div>
                                        <span className="text-sm text-gray-500">Loading team data...</span>
                                    </div>
                                ) : serviceUser ? (
                                    <div className="flex items-center gap-3">
                                        {serviceUser.profilePicture ? (
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                                <Image
                                                    src={serviceUser.profilePicture}
                                                    alt={serviceUser.username}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full font-medium">
                                                {serviceUser.initials || serviceUser.username?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{serviceUser.username}</p>
                                            <p className="text-sm text-gray-500">{serviceUser.email}</p>
                                            <div className="mt-1 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                {serviceUser.service}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No team member assigned for {displayedCampaign.service}</p>
                                )}
                            </div>
                        </div>
                    </span>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <hr className="mb-5 border-[0.1rem] border-gray-100 border-w-" />

                <span className="flex justify-between items-end mb-5">
                    <h4 className="text-xl font-semibold">
                        {isEditing ? "Edit Campaign" : "Campaign Details"}
                    </h4>
                    <div className="flex justify-end gap-2 mb-0">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-zinc-700 text-zinc-700 rounded hover:bg-zinc-50 text-sm"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-800 text-sm"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-800 text-sm"
                            >
                                Edit Campaign
                            </button>
                        )}
                    </div>
                </span>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-700">Basic Information</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Campaign Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="campaignName"
                                        value={editedCampaign.campaignName}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                        required
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.campaignName}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Parent Campaign</label>
                                {isEditing ? (
                                    <select
                                        name="parentCampaignId"
                                        value={editedCampaign.parentCampaignId || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    >
                                        <option value="">No Parent Campaign</option>
                                        {parentCampaigns.map(parent => (
                                            <option key={parent._id} value={parent._id}>
                                                {parent.parentCampaignName}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {parentCampaignName || "No parent campaign"}
                                    </p>
                                )}
                            </div>

                            {/* Add Assigned Users Field */}
                            <div className="hidden">
                                <label className="text-sm text-gray-600 block mb-1">Assigned Users</label>
                                {isLoadingUsers ? (
                                    <p className="text-base text-gray-500">Loading users...</p>
                                ) : isEditing ? (
                                    <Select
                                        name="assignedUsers"
                                        value={selectedUserOptions}
                                        onChange={handleUserChange}
                                        options={users}
                                        className="w-full"
                                        placeholder="Select users to assign..."
                                        isMulti
                                        isClearable
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUserOptions.length > 0 ? (
                                            selectedUserOptions.map(user => (
                                                <span
                                                    key={user.value}
                                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                                                >
                                                    {user.label}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-base text-gray-900">No users assigned</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Service</label>
                                {isEditing ? (
                                    <select
                                        name="service"
                                        value={editedCampaign.service}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                        required
                                    >
                                        <option value="Paid Social">Paid Social</option>
                                        <option value="Paid Search">Paid Search</option>
                                        <option value="Email Marketing">Email Marketing</option>
                                        <option value="SEO">SEO</option>
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.service}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Media</label>
                                {isEditing ? (
                                    <select
                                        name="media"
                                        value={editedCampaign.media}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
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
                                    <p className="text-base text-gray-900">{displayedCampaign.media}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Format</label>
                                {isEditing ? (
                                    <select
                                        name="campaignFormat"
                                        value={editedCampaign.campaignFormat}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
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
                                        <option value="Collection">Collection</option>
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.campaignFormat}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Country</label>
                                {isEditing ? (
                                    <Select
                                        name="countryCode"
                                        value={selectedCountryOption}
                                        onChange={handleCountryChange}
                                        options={allCountryOptions}
                                        className="w-full"
                                        placeholder="Search for a country..."
                                        isClearable
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.countryCode}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Type</label>
                                {isEditing ? (
                                    <select
                                        name="b2bOrB2c"
                                        value={editedCampaign.b2bOrB2c}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                        required
                                    >
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.b2bOrB2c}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Budget</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="budget"
                                        value={editedCampaign.budget}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.budget.toLocaleString()} DKK</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-4 text-gray-700">Additional Information</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Campaign Type</label>
                                {isEditing ? (
                                    <select
                                        name="campaignType"
                                        value={editedCampaign.campaignType || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    >
                                        <option value="">None</option>
                                        <option value="Always On">Always On</option>
                                        <option value="Conversion">Conversion</option>
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {displayedCampaign.campaignType || "Not specified"}
                                    </p>
                                )}
                            </div>

                            {!(isEditing && editedCampaign.campaignType === "Always On") && (
                                <>
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Start Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={editedCampaign.startDate}
                                                onChange={handleInputChange}
                                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                                required={editedCampaign.campaignType !== "Always On"}
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">
                                                {displayedCampaign.campaignType === "Always On"
                                                    ? "Always On"
                                                    : formatDate(displayedCampaign.startDate)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">End Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={editedCampaign.endDate}
                                                onChange={handleInputChange}
                                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                                required={editedCampaign.campaignType !== "Always On"}
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">
                                                {displayedCampaign.campaignType === "Always On"
                                                    ? "Always On"
                                                    : formatDate(displayedCampaign.endDate)}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Status</label>
                                {isEditing ? (
                                    <select
                                        name="status"
                                        value={editedCampaign.status || "Pending"}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Pending Customer Approval">Pending Customer Approval</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Live">Live</option>
                                        <option value="Ended">Ended</option>
                                    </select>
                                ) : (
                                    <p className="text-base text-gray-900">{displayedCampaign.status || "Draft"}</p>
                                )}
                            </div>

                            <div className="hidden">
                                <label className="text-sm text-gray-600 block mb-1">Ready for Approval</label>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="readyForApproval"
                                        checked={editedCampaign.readyForApproval || false}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-zinc-700 border-gray-300 rounded focus:ring-zinc-500"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {displayedCampaign.readyForApproval ? "Yes" : "No"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Landingpage</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="landingpage"
                                        value={editedCampaign.landingpage || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {displayedCampaign.landingpage || "Not specified"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Campaign Dimensions</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="campaignDimensions"
                                        value={editedCampaign.campaignDimensions || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {displayedCampaign.campaignDimensions || "Not specified"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Campaign Variation</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="campaignVariation"
                                        value={editedCampaign.campaignVariation || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">
                                        {displayedCampaign.campaignVariation || "Not specified"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Created At</label>
                                <p className="text-base text-gray-900">{formatDate(displayedCampaign.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Message/Brief</label>
                        {isEditing ? (
                            <textarea
                                name="messageBrief"
                                value={editedCampaign.messageBrief || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                rows="4"
                            />
                        ) : (
                            <div className="border border-gray-200 rounded bg-gray-50 p-4 text-gray-900">
                                {displayedCampaign.messageBrief || "No message/brief provided."}
                            </div>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Material from Customer</label>
                        {isEditing ? (
                            <textarea
                                name="materialFromCustomer"
                                value={editedCampaign.materialFromCustomer || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                rows="4"
                            />
                        ) : (
                            <div className="border border-gray-200 rounded bg-gray-50 p-4 text-gray-900">
                                {displayedCampaign.materialFromCustomer || "No materials provided."}
                            </div>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Text to Creative</label>
                        {isEditing ? (
                            <textarea
                                name="campaignTextToCreative"
                                value={editedCampaign.campaignTextToCreative || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                rows="4"
                            />
                        ) : (
                            <div className="border border-gray-200 rounded bg-gray-50 p-4 text-gray-900">
                                {displayedCampaign.campaignTextToCreative || "No text to creative provided."}
                            </div>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Text to Creative Translation</label>
                        {isEditing ? (
                            <textarea
                                name="campaignTextToCreativeTranslation"
                                value={editedCampaign.campaignTextToCreativeTranslation || ""}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-4 py-2 rounded w-full text-sm"
                                rows="4"
                            />
                        ) : (
                            <div className="border border-gray-200 rounded bg-gray-50 p-4 text-gray-900">
                                {displayedCampaign.campaignTextToCreativeTranslation || "No translation provided."}
                            </div>
                        )}
                    </div>

                    <div className="col-span-2 mt-6 border-t border-gray-200 pt-6">
                        <CommentSection campaignId={campaign._id} />
                    </div>
                </div>
            </div>
        </div>
    );
}