"use client";

import { useState } from 'react';
import { IoMdClose } from "react-icons/io";

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        isAdmin: false,
        isExternal: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onAddUser(formData);
            setFormData({
                name: "",
                email: "",
                password: "",
                isAdmin: false,
                isExternal: false,
            });
            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold">Add New User</h4>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-lg"
                    >
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-searchmind)] focus:border-[var(--color-primary-searchmind)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-searchmind)] focus:border-[var(--color-primary-searchmind)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-searchmind)] focus:border-[var(--color-primary-searchmind)]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 6 characters long.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAdmin"
                                checked={formData.isAdmin}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-zinc-600 focus:ring-zinc-500"
                            />
                            <span className="text-sm">Administrator privileges</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isExternal"
                                checked={formData.isExternal}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-zinc-600 focus:ring-zinc-500"
                            />
                            <span className="text-sm">External user (customer/client)</span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--color-primary-searchmind)] py-3 px-8 rounded text-white hover:bg-opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating user..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}