"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useToast } from '@/app/contexts/ToastContext';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaLock, FaShare } from 'react-icons/fa';

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
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-[var(--color-dark-natural)] pb-4">
                <h2 className="text-2xl font-bold text-[var(--color-dark-green)] mb-2">User Settings</h2>
                <p className="text-[var(--color-green)]">Manage your account information and security settings</p>
            </div>

            {/* Account Information */}
            <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[var(--color-lime)]/20 rounded-lg">
                        <FaUser className="text-[var(--color-dark-green)] text-lg" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">Account Information</h3>
                </div>

                <div className="space-y-6">
                    {/* Email Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-[var(--color-green)] text-sm" />
                            <label className="font-medium text-[var(--color-dark-green)]">Email Address</label>
                        </div>
                        <div className="md:col-span-2">
                            {editMode.email ? (
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        value={updatedData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateUserData('email')}
                                            disabled={isSubmitting || !updatedData.email}
                                            className="flex items-center gap-2 bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaSave className="text-sm" />
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={() => toggleEditMode('email')}
                                            className="flex items-center gap-2 border-2 border-[var(--color-dark-green)] text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <FaTimes className="text-sm" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--color-dark-natural)]">
                                    <span className="text-[var(--color-dark-green)]">{userData.email}</span>
                                    <button
                                        onClick={() => toggleEditMode('email')}
                                        className="flex items-center gap-2 text-[var(--color-light-green)] hover:text-[var(--color-dark-green)] transition-colors"
                                    >
                                        <FaEdit className="text-sm" />
                                        <span className="text-sm font-medium">Edit</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-[var(--color-green)] text-sm" />
                            <label className="font-medium text-[var(--color-dark-green)]">Full Name</label>
                        </div>
                        <div className="md:col-span-2">
                            {editMode.name ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={updatedData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateUserData('name')}
                                            disabled={isSubmitting || !updatedData.name}
                                            className="flex items-center gap-2 bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaSave className="text-sm" />
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={() => toggleEditMode('name')}
                                            className="flex items-center gap-2 border-2 border-[var(--color-dark-green)] text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <FaTimes className="text-sm" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--color-dark-natural)]">
                                    <span className="text-[var(--color-dark-green)]">{userData.name}</span>
                                    <button
                                        onClick={() => toggleEditMode('name')}
                                        className="flex items-center gap-2 text-[var(--color-light-green)] hover:text-[var(--color-dark-green)] transition-colors"
                                    >
                                        <FaEdit className="text-sm" />
                                        <span className="text-sm font-medium">Edit</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="flex items-center gap-2">
                            <FaLock className="text-[var(--color-green)] text-sm" />
                            <label className="font-medium text-[var(--color-dark-green)]">Password</label>
                        </div>
                        <div className="md:col-span-2">
                            {editMode.password ? (
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        value={updatedData.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={updatedData.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={updatedData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateUserData('password')}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaSave className="text-sm" />
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={() => toggleEditMode('password')}
                                            className="flex items-center gap-2 border-2 border-[var(--color-dark-green)] text-[var(--color-dark-green)] hover:bg-[var(--color-natural)] px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <FaTimes className="text-sm" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--color-dark-natural)]">
                                    <span className="text-[var(--color-dark-green)]">••••••••••••</span>
                                    <button
                                        onClick={() => toggleEditMode('password')}
                                        className="flex items-center gap-2 text-[var(--color-light-green)] hover:text-[var(--color-dark-green)] transition-colors"
                                    >
                                        <FaEdit className="text-sm" />
                                        <span className="text-sm font-medium">Change</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Properties */}
            <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[var(--color-lime)]/20 rounded-lg">
                        <FaShare className="text-[var(--color-dark-green)] text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">Shared Properties</h3>
                        <p className="text-sm text-[var(--color-green)] mt-1">View properties that have been shared with you</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-[var(--color-dark-natural)] overflow-hidden">
                    <div className="bg-[var(--color-natural)] px-6 py-4 border-b border-[var(--color-dark-natural)]">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="font-semibold text-[var(--color-dark-green)] text-sm">Property Name</div>
                            <div className="font-semibold text-[var(--color-dark-green)] text-sm">Access Level</div>
                        </div>
                    </div>
                    <div className="px-6 py-8 text-center">
                        <div className="text-[var(--color-green)] mb-2">
                            <FaShare className="text-2xl mx-auto mb-3 opacity-50" />
                        </div>
                        <p className="text-[var(--color-green)]">No shared properties found</p>
                        <p className="text-sm text-[var(--color-green)]/80 mt-1">Properties shared with you will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}