"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useClickUpUsers } from "@/app/contexts/ClickUpUsersContext";

export default function CustomerAssignedUsers({ customerId, onUsersLoaded = null }) {
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);
    const { updateClickupUsers } = useClickUpUsers();

    useEffect(() => {
        const fetchAssignedUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const customerSettingsRes = await fetch(`/api/customers/${customerId}/settings`);

                if (customerSettingsRes.status === 404) {
                    console.log(`No settings found for customer ${customerId}`);
                    updateClickupUsers({});

                    if (onUsersLoaded) {
                        onUsersLoaded({});
                    }

                    setDataFetched(true);
                    return;
                }

                if (!customerSettingsRes.ok) {
                    throw new Error("Failed to fetch customer settings");
                }

                const customerSettings = await customerSettingsRes.json();
                const customerClickupId = customerSettings.customerClickupID;

                if (!customerClickupId) {
                    console.log("No Clickup ID found for this customer");
                    updateClickupUsers({});

                    if (onUsersLoaded) {
                        onUsersLoaded({});
                    }

                    setDataFetched(true);
                    return;
                }

                const clickupRes = await fetch(`/api/clickup/task/${customerClickupId}`);

                if (!clickupRes.ok) {
                    throw new Error("Failed to fetch data from Clickup");
                }

                const clickupData = await clickupRes.json();

                const userFields = [
                    "51ed563e-4a2c-489b-9506-be385c49a354", // SEO
                    "bee4b7c5-c9d0-4808-8a4f-b00ee6df311e", // PPC
                    "2df85265-d5eb-4e86-a111-5d55623851fa", // PS
                    "55b3e92d-5972-4246-8160-73d7ba04401a", // EM
                ];

                const users = [];
                const usersByService = {};

                if (clickupData.custom_fields) {
                    clickupData.custom_fields.forEach(field => {
                        if (userFields.includes(field.id) && field.value && field.value.length > 0) {
                            let serviceLabel = "";

                            if (field.id === "51ed563e-4a2c-489b-9506-be385c49a354") {
                                serviceLabel = "SEO";
                            } else if (field.id === "bee4b7c5-c9d0-4808-8a4f-b00ee6df311e") {
                                serviceLabel = "PPC";
                            } else if (field.id === "2df85265-d5eb-4e86-a111-5d55623851fa") {
                                serviceLabel = "PS";
                            } else if (field.id === "55b3e92d-5972-4246-8160-73d7ba04401a") {
                                serviceLabel = "EM";
                            } else {
                                serviceLabel = field.name.split(".")[1]?.split(" -")[0] || "";
                            }

                            field.value.forEach(user => {
                                const userData = {
                                    ...user,
                                    service: serviceLabel
                                };

                                users.push(userData);

                                if (!usersByService[serviceLabel]) {
                                    usersByService[serviceLabel] = [];
                                }
                                usersByService[serviceLabel].push(userData);
                            });
                        }
                    });
                }

                console.log("Fetched clickup users by service:", usersByService);
                setAssignedUsers(users);
                setDataFetched(true);

                updateClickupUsers(usersByService);

                if (onUsersLoaded) {
                    onUsersLoaded(usersByService);
                }
            } catch (err) {
                console.error("Error fetching assigned users:", err);
                setError(err.message);

                updateClickupUsers({});

                if (onUsersLoaded) {
                    onUsersLoaded({});
                }

                setDataFetched(true);
            } finally {
                setLoading(false);
            }
        };

        if (customerId && !dataFetched) {
            fetchAssignedUsers();
        }
    }, [customerId, dataFetched, updateClickupUsers, onUsersLoaded]);

    if (loading) {
        return (
            <div className="border-b border-zinc-200 p-3 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-zinc-700 rounded-full animate-spin"></div>
                <span className="ml-2 text-xs text-gray-500">Loading users...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border-b border-zinc-200 p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">No assigned users found</p>
                    <div className="relative group">
                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-600 cursor-help ml-2">
                            i
                        </div>
                        <div className="absolute z-50 hidden group-hover:block w-60 bg-white shadow-lg border border-gray-200 rounded p-2 right-0 top-6 text-xs">
                            <p className="text-gray-700">This customer requires ClickUp configuration. Visit the config page for this customer and assign the appropiate ClickUp task ID.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (assignedUsers.length === 0) {
        return (
            <div className="border-b border-zinc-200 p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">No assigned users found</p>
                    <div className="relative group">
                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-600 cursor-help ml-2">
                            i
                        </div>
                        <div className="absolute z-50 hidden group-hover:block w-60 bg-white shadow-lg border border-gray-200 rounded p-2 right-0 top-6 text-xs">
                            <p className="text-gray-700">This customer requires ClickUp configuration. Visit the config page for this customer and assign the appropiate ClickUp task ID.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b border-zinc-200 p-3">
            <div className="flex text-right mb-2 w-full justify-end">
                <h3 className="text-xs text-right font-semibold text-gray-700">Customer Team</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {assignedUsers.map((user, index) => (
                    <div key={index} className="flex items-center" title={`${user.username} (${user.service})`}>
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                                {user.profilePicture ? (
                                    <Image
                                        src={user.profilePicture}
                                        alt={user.username}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-medium">
                                        {user.initials || user.username?.charAt(0)}
                                    </div>
                                )}
                                <div
                                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white border border-white"
                                    style={{
                                        backgroundColor: user.service === "SEO" ? "#ff7800" :
                                            user.service === "PPC" ? "#f9d900" :
                                                user.service === "PS" ? "#0231E8" :
                                                    user.service === "EM" ? "#3397dd" : "#667684"
                                    }}
                                >
                                    {user.service?.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}