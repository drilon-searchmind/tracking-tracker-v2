"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useToast } from '@/app/contexts/ToastContext';

export default function UserSettingsContent() {
    const { data: session, update } = useSession();
    const { showToast } = useToast();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });

    const [editMode, setEditMode] = useState({
        name: false,
        email: false,
        password: false,
    });

    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setUserData({
                name: session.user.name || '',
                email: session.user.email || '',
            });

            setUpdatedData(prev => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || '',
            }));
        }
    }, [session]);

    const toggleEditMode = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));

        if (editMode[field]) {
            setUpdatedData(prev => ({
                ...prev,
                [field]: userData[field] || '',
                ...(field === 'password' ? {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                } : {})
            }));
        }
    };

    const handleInputChange = (field, value) => {
        setUpdatedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validatePasswordChange = () => {
        if (!updatedData.currentPassword) {
            showToast("Current password is required", "error");
            return false;
        }

        if (!updatedData.newPassword) {
            showToast("New password is required", "error");
            return false;
        }

        if (updatedData.newPassword !== updatedData.confirmPassword) {
            showToast("New passwords don't match", "error");
            return false;
        }

        if (updatedData.newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return false;
        }

        return true;
    };

    const updateUserData = async (field) => {
        try {
            setIsSubmitting(true);
    
            if (field === 'password') {
                if (!validatePasswordChange()) {
                    setIsSubmitting(false);
                    return;
                }
            }
    
            const dataToUpdate = {
                userId: session.user.id
            };
    
            if (field === 'name') {
                dataToUpdate.name = updatedData.name;
            } else if (field === 'email') {
                dataToUpdate.email = updatedData.email;
            } else if (field === 'password') {
                dataToUpdate.currentPassword = updatedData.currentPassword;
                dataToUpdate.newPassword = updatedData.newPassword;
            }
    
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update profile');
            }
    
            if (field !== 'password') {
                setUserData(prev => ({
                    ...prev,
                    [field]: updatedData[field]
                }));
            }
    
            if (field === 'name' || field === 'email') {
                const updatedSession = {
                    ...session,
                    user: {
                        ...session.user,
                        [field]: updatedData[field]
                    }
                };
                
                const updateResult = await update(updatedSession);
                
                console.log("Session update result:", updateResult);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`, "success");
            } else {
                showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`, "success");
            }
    
            if (field === 'password') {
                setUpdatedData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
    
            toggleEditMode(field);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            showToast(error.message || `Failed to update ${field}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold mb-6">User Settings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Setting</th>
                                <th className="px-4 py-3 font-medium">Value</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            <tr>
                                <td className="px-4 py-3 font-medium">Email</td>
                                <td className="px-4 py-3">
                                    {editMode.email ? (
                                        <input
                                            type="email"
                                            value={updatedData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    ) : (
                                        userData.email
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editMode.email ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => updateUserData('email')}
                                                disabled={isSubmitting || !updatedData.email}
                                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-xs disabled:bg-gray-400"
                                            >
                                                {isSubmitting ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => toggleEditMode('email')}
                                                className="border border-gray-300 py-1 px-3 rounded text-gray-600 hover:bg-gray-100 text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleEditMode('email')}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 font-medium">Name</td>
                                <td className="px-4 py-3">
                                    {editMode.name ? (
                                        <input
                                            type="text"
                                            value={updatedData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    ) : (
                                        userData.name
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editMode.name ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => updateUserData('name')}
                                                disabled={isSubmitting || !updatedData.name}
                                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-xs disabled:bg-gray-400"
                                            >
                                                {isSubmitting ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => toggleEditMode('name')}
                                                className="border border-gray-300 py-1 px-3 rounded text-gray-600 hover:bg-gray-100 text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleEditMode('name')}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 font-medium">Password</td>
                                <td className="px-4 py-3">
                                    {editMode.password ? (
                                        <div className="space-y-2">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={updatedData.currentPassword}
                                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={updatedData.newPassword}
                                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={updatedData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    ) : (
                                        "••••••••"
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editMode.password ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => updateUserData('password')}
                                                disabled={isSubmitting}
                                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-xs disabled:bg-gray-400"
                                            >
                                                {isSubmitting ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => toggleEditMode('password')}
                                                className="border border-gray-300 py-1 px-3 rounded text-gray-600 hover:bg-gray-100 text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleEditMode('password')}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                            Change
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='mt-10'>
                <h2 className="text-2xl font-semibold mb-6">Shared Properties</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Property Name</th>
                                <th className="px-4 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            <tr>
                                <td className="px-4 py-3 font-medium">Name</td>
                                <td className="px-4 py-3">View</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}