"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/app/contexts/ToastContext';

const UsersContent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUsers, setEditingUsers] = useState({});
    const [updatingId, setUpdatingId] = useState(null);
    const [archivingId, setArchivingId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            
            // Initialize editing state for all users
            const initialEditState = {};
            data.forEach(user => {
                initialEditState[user._id] = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin || false,
                    isArchived: user.isArchived || false,
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

    const handleInputChange = (userId, field, value) => {
        setEditingUsers(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: field === 'isAdmin' ? !prev[userId].isAdmin : value
            }
        }));
    };

    const handleSaveUser = async (userId) => {
        try {
            setUpdatingId(userId);
            const userData = editingUsers[userId];
            
            // Don't send empty password (means no password change)
            const dataToSend = {
                name: userData.name,
                email: userData.email,
                isAdmin: userData.isAdmin,
                isArchived: userData.isArchived
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
            
            // Update local state
            setUsers(users.map(user => 
                user._id === userId ? updatedUser : user
            ));
            
            showToast("User updated successfully", "success");
            
            // Reset password field after successful update
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
                isArchived: newArchivedState
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
            
            // Update local state
            setUsers(users.map(user => 
                user._id === userId ? updatedUser : user
            ));
            
            // Also update the editing state
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

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Users Management</h2>
            <div className="mb-6 flex justify-between items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-64 px-4 py-2 border border-gray-300 rounded text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm">
                    Add New User
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading users...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">New Password</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className={user.isArchived ? "bg-gray-50" : ""}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={editingUsers[user._id]?.name || ''}
                                                onChange={(e) => handleInputChange(user._id, 'name', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="email"
                                                value={editingUsers[user._id]?.email || ''}
                                                onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={editingUsers[user._id]?.isAdmin || false}
                                                    onChange={() => handleInputChange(user._id, 'isAdmin')}
                                                    className="rounded border-gray-300 text-zinc-600 focus:ring-zinc-500"
                                                />
                                                <span>Admin</span>
                                            </label>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.isArchived ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.isArchived ? 'Archived' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="password"
                                                placeholder="Leave empty to keep current"
                                                value={editingUsers[user._id]?.password || ''}
                                                onChange={(e) => handleInputChange(user._id, 'password', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button 
                                                onClick={() => handleSaveUser(user._id)}
                                                disabled={updatingId === user._id}
                                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-sm disabled:bg-gray-400"
                                            >
                                                {updatingId === user._id ? "Saving..." : "Update"}
                                            </button>
                                            <button 
                                                onClick={() => toggleArchiveUser(user._id)}
                                                disabled={archivingId === user._id}
                                                className={`py-1 px-3 rounded text-sm ${
                                                    user.isArchived 
                                                    ? "text-green-600 hover:text-green-800" 
                                                    : "text-red-600 hover:text-red-800"
                                                }`}
                                            >
                                                {archivingId === user._id ? 
                                                    "Processing..." : 
                                                    (user.isArchived ? "Unarchive" : "Archive")
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? "No users match your search" : "No users found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersContent;