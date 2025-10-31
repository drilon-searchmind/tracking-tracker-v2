"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaUserShield, FaUserCheck, FaUserTimes, FaEdit, FaArchive, FaUsers, FaBuilding } from 'react-icons/fa';
import { useToast } from '@/app/contexts/ToastContext';
import AddUserModal from '@/app/components/Admin/AddUserModal';

const UsersContent = () => {
    const [users, setUsers] = useState([]);
    const [customerSharings, setCustomerSharings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUsers, setEditingUsers] = useState({});
    const [updatingId, setUpdatingId] = useState(null);
    const [archivingId, setArchivingId] = useState(null);
    const [activeTab, setActiveTab] = useState("internal");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
        fetchAllCustomerSharings();
    }, []);

    const handleAddNewUser = async (userData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error creating user: ${response.status}`);
            }

            const newUser = await response.json();

            setUsers([...users, newUser]);

            setEditingUsers(prev => ({
                ...prev,
                [newUser._id]: {
                    name: newUser.name,
                    email: newUser.email,
                    isAdmin: newUser.isAdmin || false,
                    isArchived: newUser.isArchived || false,
                    isExternal: newUser.isExternal || false,
                    password: ''
                }
            }));

            showToast("User created successfully", "success");
            return newUser;
        } catch (error) {
            console.error("Failed to create user:", error);
            showToast(error.message || "Failed to create user", "error");
            throw error;
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);

            const initialEditState = {};
            data.forEach(user => {
                initialEditState[user._id] = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin || false,
                    isArchived: user.isArchived || false,
                    isExternal: user.isExternal || false,
                    password: ''
                };
            });
            setEditingUsers(initialEditState);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCustomerSharings = async () => {
        try {
            const response = await fetch('/api/customer-sharings/all');

            if (!response.ok) {
                throw new Error(`Error fetching customer sharings: ${response.status}`);
            }

            const data = await response.json();
            setCustomerSharings(data.data || []);
        } catch (error) {
            console.error("Failed to fetch customer sharings:", error);
            showToast("Failed to load customer access data", "error");
        }
    };

    const sharingsByEmail = {};
    customerSharings.forEach(sharing => {
        if (!sharingsByEmail[sharing.email]) {
            sharingsByEmail[sharing.email] = [];
        }
        sharingsByEmail[sharing.email].push({
            customerId: sharing.customer,
            customerName: sharing.customerName
        });
    });

    const handleInputChange = (userId, field, value) => {
        setEditingUsers(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: field === 'isAdmin' || field === 'isExternal' ? !prev[userId][field] : value
            }
        }));
    };

    const handleSaveUser = async (userId) => {
        try {
            setUpdatingId(userId);
            const userData = editingUsers[userId];

            const dataToSend = {
                name: userData.name,
                email: userData.email,
                isAdmin: userData.isAdmin,
                isArchived: userData.isArchived,
                isExternal: userData.isExternal
            };

            if (userData.password) {
                dataToSend.password = userData.password;
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`Error updating user: ${response.status}`);
            }

            const updatedUser = await response.json();

            setUsers(users.map(user =>
                user._id === userId ? updatedUser : user
            ));

            showToast("User updated successfully", "success");

            setEditingUsers(prev => ({
                ...prev,
                [userId]: {
                    ...prev[userId],
                    password: ''
                }
            }));
        } catch (error) {
            console.error("Failed to update user:", error);
            showToast("Failed to update user", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    const toggleArchiveUser = async (userId) => {
        try {
            setArchivingId(userId);
            const userData = editingUsers[userId];
            const newArchivedState = !userData.isArchived;

            const dataToSend = {
                name: userData.name,
                email: userData.email,
                isAdmin: userData.isAdmin,
                isArchived: newArchivedState,
                isExternal: userData.isExternal
            };

            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`Error ${newArchivedState ? 'archiving' : 'unarchiving'} user: ${response.status}`);
            }

            const updatedUser = await response.json();

            setUsers(users.map(user =>
                user._id === userId ? updatedUser : user
            ));

            setEditingUsers(prev => ({
                ...prev,
                [userId]: {
                    ...prev[userId],
                    isArchived: newArchivedState
                }
            }));

            showToast(
                `User ${newArchivedState ? 'archived' : 'unarchived'} successfully`,
                "success"
            );
        } catch (error) {
            console.error(`Failed to ${userData.isArchived ? 'unarchive' : 'archive'} user:`, error);
            showToast(`Failed to ${userData.isArchived ? 'unarchive' : 'archive'} user`, "error");
        } finally {
            setArchivingId(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab = activeTab === "internal" ? !user.isExternal : user.isExternal;

        return matchesSearch && matchesTab;
    });

    const renderUserTable = () => {
        return (
            <div className="overflow-x-auto bg-white rounded-lg border border-[var(--color-dark-natural)]">
                <table className="min-w-full text-sm">
                    <thead className="bg-[var(--color-natural)] border-b border-[var(--color-dark-natural)]">
                        <tr className="text-[var(--color-dark-green)]">
                            <th className="px-4 py-4 text-left font-semibold">Name</th>
                            <th className="px-4 py-4 text-left font-semibold">Email</th>
                            <th className="px-4 py-4 text-left font-semibold">Role</th>
                            <th className="px-4 py-4 text-left font-semibold">Status</th>
                            {activeTab === "external" && (
                                <th className="px-4 py-4 text-left font-semibold">Customer Access</th>
                            )}
                            <th className="px-4 py-4 text-left font-semibold">New Password</th>
                            <th className="px-4 py-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[var(--color-green)] divide-y divide-[var(--color-light-natural)]">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user._id} className={`hover:bg-[var(--color-natural)]/50 transition-colors ${
                                    user.isArchived ? "bg-[var(--color-light-natural)]/50" : ""
                                }`}>
                                    <td className="px-4 py-4">
                                        <input
                                            type="text"
                                            value={editingUsers[user._id]?.name || ''}
                                            onChange={(e) => handleInputChange(user._id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <input
                                            type="email"
                                            value={editingUsers[user._id]?.email || ''}
                                            onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                                            className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editingUsers[user._id]?.isAdmin || false}
                                                onChange={() => handleInputChange(user._id, 'isAdmin')}
                                                className="rounded border-[var(--color-dark-natural)] text-[var(--color-lime)] focus:ring-[var(--color-lime)]"
                                            />
                                            <span className="flex items-center gap-1">
                                                <FaUserShield className="text-[var(--color-light-green)]" />
                                                Admin
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                            user.isArchived 
                                                ? 'bg-[var(--color-dark-natural)] text-[var(--color-green)]' 
                                                : 'bg-[var(--color-lime)]/20 text-[var(--color-dark-green)]'
                                        }`}>
                                            {user.isArchived ? (
                                                <>
                                                    <FaUserTimes className="text-xs" />
                                                    Archived
                                                </>
                                            ) : (
                                                <>
                                                    <FaUserCheck className="text-xs" />
                                                    Active
                                                </>
                                            )}
                                        </span>
                                    </td>

                                    {activeTab === "external" && (
                                        <td className="px-4 py-4">
                                            {sharingsByEmail[user.email] ? (
                                                <div className="max-h-20 overflow-y-auto space-y-1">
                                                    {sharingsByEmail[user.email].map((access, idx) => (
                                                        <div key={idx} className="text-xs py-1 px-2 bg-[var(--color-lime)]/10 rounded border border-[var(--color-lime)]/20">
                                                            {access.customerName || access.customerId}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-[var(--color-green)]/60 text-xs">No customer access</span>
                                            )}
                                        </td>
                                    )}

                                    <td className="px-4 py-4">
                                        <input
                                            type="password"
                                            placeholder="Leave empty to keep current"
                                            value={editingUsers[user._id]?.password || ''}
                                            onChange={(e) => handleInputChange(user._id, 'password', e.target.value)}
                                            className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSaveUser(user._id)}
                                                disabled={updatingId === user._id}
                                                className="bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-[var(--color-dark-natural)] disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                <FaEdit className="text-xs" />
                                                {updatingId === user._id ? "Saving..." : "Update"}
                                            </button>
                                            <button
                                                onClick={() => toggleArchiveUser(user._id)}
                                                disabled={archivingId === user._id}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                                    user.isArchived
                                                        ? "text-[var(--color-light-green)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-lime)]/10"
                                                        : "text-red-600 hover:text-red-800 hover:bg-red-50"
                                                }`}
                                            >
                                                <FaArchive className="text-xs" />
                                                {archivingId === user._id ?
                                                    "Processing..." :
                                                    (user.isArchived ? "Unarchive" : "Archive")
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={activeTab === "external" ? "7" : "6"} className="px-4 py-12 text-center text-[var(--color-green)]">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaUsers className="text-2xl text-[var(--color-light-green)]" />
                                        <p>{searchQuery ? "No users match your search" : `No ${activeTab === "internal" ? "internal" : "external"} users found`}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] mb-2">Users Management</h2>
                    <p className="text-[var(--color-green)]">Manage user accounts, permissions, and access rights</p>
                </div>
            </div>

            <div className="border-b border-[var(--color-dark-natural)]">
                <nav className="flex space-x-8" aria-label="User Types">
                    <button
                        onClick={() => setActiveTab("internal")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === "internal"
                                ? "border-[var(--color-lime)] text-[var(--color-dark-green)]"
                                : "border-transparent text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:border-[var(--color-light-green)]"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <FaUsers />
                            Internal Users
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("external")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === "external"
                                ? "border-[var(--color-lime)] text-[var(--color-dark-green)]"
                                : "border-transparent text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:border-[var(--color-light-green)]"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <FaBuilding />
                            External Users
                        </span>
                    </button>
                </nav>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-[var(--color-green)] text-sm" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full md:w-80 pl-10 pr-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="bg-[var(--color-lime)] hover:bg-[var(--color-light-green)] text-[var(--color-dark-green)] px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <FaPlus />
                    Add New User
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-green)]">Loading users...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">
                            {activeTab === "internal" ? "Internal Users" : "External Users"}
                            <span className="ml-2 text-sm font-normal text-[var(--color-green)]">
                                ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
                            </span>
                        </h3>
                    </div>
                    {renderUserTable()}
                </div>
            )}

            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAddUser={handleAddNewUser}
            />
        </div>
    );
};

export default UsersContent;