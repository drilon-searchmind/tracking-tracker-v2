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
            : process.env.NEXT_PUBLIC_BASE_URL;
            
    const [email, setEmail] = useState("");
    const [sharedWith, setSharedWith] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [sharingMode, setSharingMode] = useState("new");
    const [existingUsers, setExistingUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            const isAdmin = session.user.isAdmin === true;
            const isInternal = session.user.isExternal === false;
            setHasPermission(isAdmin || isInternal);
        }
    }, [session]);

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
                <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-md relative border border-gray-200">
                    <span className="flex justify-between mb-6">
                        <h4 className="text-xl font-bold text-[var(--color-dark-green)]">Share report</h4>
                        <button onClick={closeModal} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] text-lg transition-colors">
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
            <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-md relative border border-gray-200">
                <span className="flex justify-between mb-6">
                    <h4 className="text-xl font-bold text-[var(--color-dark-green)]">Share report</h4>
                    <button onClick={closeModal} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] text-lg transition-colors">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-3 px-4 font-medium transition-colors ${sharingMode === "new" 
                            ? "border-b-2 border-[var(--color-lime)] text-[var(--color-dark-green)]" 
                            : "text-[var(--color-green)] hover:text-[var(--color-dark-green)]"}`}
                        onClick={() => setSharingMode("new")}
                    >
                        New User
                    </button>
                    <button
                        className={`py-3 px-4 font-medium transition-colors ${sharingMode === "existing" 
                            ? "border-b-2 border-[var(--color-lime)] text-[var(--color-dark-green)]" 
                            : "text-[var(--color-green)] hover:text-[var(--color-dark-green)]"}`}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Shared With (Name)"
                            value={sharedWith}
                            onChange={(e) => setSharedWith(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Set Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-[var(--color-green)] mb-6 bg-[var(--color-natural)] p-3 rounded-lg">
                            Notice: A new user account will be created for this email with the provided password.
                        </p>
                    </>
                ) : (
                    <>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        >
                            <option value="">Select existing user</option>
                            {existingUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-[var(--color-green)] mb-6 bg-[var(--color-natural)] p-3 rounded-lg">
                            Share this customer report with an existing user account.
                        </p>
                    </>
                )}

                <button
                    onClick={handleShareReport}
                    disabled={loading}
                    className={`w-full bg-[var(--color-dark-green)] text-white py-3 px-6 rounded-lg font-semibold transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-green)]"
                    }`}
                >
                    {loading ? "Sharing..." : "Share Customer Report"}
                </button>
            </div>
        </div>
    );
}