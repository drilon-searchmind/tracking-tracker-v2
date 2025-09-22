"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react";
import UnauthorizedAccess from "../UI/UnauthorizedAccess";

export default function ShareCustomerModal({ closeModal, customerId }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "http://localhost:3000";
    const [email, setEmail] = useState("");
    const [sharedWith, setSharedWith] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [sharingMode, setSharingMode] = useState("new"); // "new" or "existing"
    const [existingUsers, setExistingUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    // Check if user has permission to share reports
    useEffect(() => {
        if (session?.user) {
            const isAdmin = session.user.isAdmin === true;
            const isInternal = session.user.isExternal === false;
            setHasPermission(isAdmin || isInternal);
        }
    }, [session]);

    // Fetch existing users
    useEffect(() => {
        if (sharingMode === "existing") {
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`${baseUrl}/api/users`);
                    if (response.ok) {
                        const data = await response.json();
                        setExistingUsers(data.filter(user => user.isExternal));
                    } else {
                        console.error("Failed to fetch users");
                    }
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };
            
            fetchUsers();
        }
    }, [sharingMode, baseUrl]);

    const handleShareReport = async () => {
        if (sharingMode === "new") {
            if (!email || !sharedWith || !password) {
                alert("Please fill in all fields.");
                return;
            }
        } else {
            if (!selectedUser) {
                alert("Please select a user.");
                return;
            }
        }

        setLoading(true);

        try {
            const endpoint = `${baseUrl}/api/customer-sharings/${customerId}`;
            const body = sharingMode === "new" 
                ? { email, sharedWith, password }
                : { userId: selectedUser };
                
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const result = await response.json();
                if (sharingMode === "new") {
                    if (result.userCreated) {
                        alert("Report shared successfully! A new user account has been created.");
                    } else {
                        alert("Report shared successfully! User already exists.");
                    }
                    setEmail("");
                    setSharedWith("");
                    setPassword("");
                } else {
                    alert("Report shared successfully with existing user!");
                    setSelectedUser("");
                }
                closeModal();
            } else {
                const errorData = await response.json();
                alert(`Failed to share report: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error sharing report:", error);
            alert("An error occurred while sharing the report.");
        } finally {
            setLoading(false);
        }
    };

    if (!hasPermission) {
        return (
            <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                    <span className="flex justify-between mb-5">
                        <h4 className="text-xl font-semibold">Share report</h4>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg">
                            <IoMdClose className="text-2xl" />
                        </button>
                    </span>
                    <UnauthorizedAccess message="You do not have permission to share this report. Only administrators and internal users can share reports." />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Share report</h4>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        className={`py-2 px-4 ${sharingMode === "new" 
                            ? "border-b-2 border-blue-500 font-medium text-blue-600" 
                            : "text-gray-500"}`}
                        onClick={() => setSharingMode("new")}
                    >
                        New User
                    </button>
                    <button
                        className={`py-2 px-4 ${sharingMode === "existing" 
                            ? "border-b-2 border-blue-500 font-medium text-blue-600" 
                            : "text-gray-500"}`}
                        onClick={() => setSharingMode("existing")}
                    >
                        Existing User
                    </button>
                </div>

                {sharingMode === "new" ? (
                    <>
                        <input
                            type="text"
                            placeholder="Insert email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Shared With (Name)"
                            value={sharedWith}
                            onChange={(e) => setSharedWith(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="password"
                            placeholder="Set Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                        />
                        <p className="text-xs mb-5">
                            Notice: A new user account will be created for this email with the provided password.
                        </p>
                    </>
                ) : (
                    <>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="">Select existing user</option>
                            {existingUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs mb-5">
                            Share this customer report with an existing user account.
                        </p>
                    </>
                )}

                <button
                    onClick={handleShareReport}
                    disabled={loading}
                    className={`hover:cursor-pointer bg-[var(--color-primary-searchmind)] py-3 px-8 rounded text-white w-full ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Sharing..." : "Share Customer Report"}
                </button>
            </div>
        </div>
    );
}