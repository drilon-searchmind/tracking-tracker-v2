"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function SEOSettings({ customerId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [keywordGroups, setKeywordGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [showNewGroupForm, setShowNewGroupForm] = useState(false);
    const [newGroupData, setNewGroupData] = useState({
        name: "",
        keywords: ""
    });

    // Fetch keyword groups when component mounts or accordion opens
    useEffect(() => {
        if (isOpen && customerId) {
            fetchKeywordGroups();
        }
    }, [isOpen, customerId]);

    const fetchKeywordGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/seo-keyword-groups?customerId=${customerId}`);
            if (response.ok) {
                const groups = await response.json();
                setKeywordGroups(groups);
            } else {
                console.error("Failed to fetch keyword groups");
            }
        } catch (error) {
            console.error("Error fetching keyword groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupData.name.trim() || !newGroupData.keywords.trim()) {
            alert("Please provide both group name and keywords");
            return;
        }

        setSaving(true);
        try {
            const keywords = newGroupData.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k);

            const response = await fetch('/api/seo-keyword-groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newGroupData.name,
                    keywords: keywords,
                    customerId: customerId
                }),
            });

            if (response.ok) {
                const newGroup = await response.json();
                setKeywordGroups(prev => [...prev, newGroup]);
                setNewGroupData({ name: "", keywords: "" });
                setShowNewGroupForm(false);
                alert("Keyword group created successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to create keyword group");
            }
        } catch (error) {
            console.error("Error creating keyword group:", error);
            alert("An error occurred while creating the keyword group");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateGroup = async (groupId, updatedData) => {
        setSaving(true);
        try {
            const keywords = updatedData.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k);

            const response = await fetch(`/api/seo-keyword-groups/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedData.name,
                    keywords: keywords
                }),
            });

            if (response.ok) {
                const updatedGroup = await response.json();
                setKeywordGroups(prev => 
                    prev.map(group => group._id === groupId ? updatedGroup : group)
                );
                setEditingGroup(null);
                alert("Keyword group updated successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update keyword group");
            }
        } catch (error) {
            console.error("Error updating keyword group:", error);
            alert("An error occurred while updating the keyword group");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!confirm("Are you sure you want to delete this keyword group?")) {
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`/api/seo-keyword-groups/${groupId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setKeywordGroups(prev => prev.filter(group => group._id !== groupId));
                alert("Keyword group deleted successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to delete keyword group");
            }
        } catch (error) {
            console.error("Error deleting keyword group:", error);
            alert("An error occurred while deleting the keyword group");
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (group) => {
        setEditingGroup({
            ...group,
            keywords: group.keywords.join(', ')
        });
    };

    const cancelEditing = () => {
        setEditingGroup(null);
    };

    const cancelNewGroup = () => {
        setShowNewGroupForm(false);
        setNewGroupData({ name: "", keywords: "" });
    };

    return (
        <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mt-8">
            {/* Accordion Header */}
            <div 
                className="flex justify-between items-center p-6 cursor-pointer hover:bg-[var(--color-natural)]/50 transition-colors border-b border-[var(--color-light-natural)]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">SEO Settings</h3>
                <FaChevronDown 
                    className={`text-[var(--color-green)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    size={16}
                />
            </div>

            {/* Accordion Content */}
            {isOpen && (
                <div className="p-6">
                    <div className="mb-6">
                        <h4 className="text-base font-semibold text-[var(--color-dark-green)] mb-2">
                            Keyword Groups
                        </h4>
                        <p className="text-sm text-[var(--color-green)] mb-4">
                            Create and manage keyword groups to filter your SEO performance data. 
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                            <p className="mt-2 text-sm text-[var(--color-green)]">Loading keyword groups...</p>
                        </div>
                    ) : (
                        <>
                            {/* Existing Groups */}
                            <div className="space-y-4 mb-6">
                                {keywordGroups.length === 0 ? (
                                    <div className="text-center py-8 bg-[var(--color-natural)] rounded-lg">
                                        <p className="text-[var(--color-green)]">No keyword groups created yet.</p>
                                        <p className="text-sm text-[var(--color-green)] mt-1">
                                            Click "Add New Group" to create your first keyword group.
                                        </p>
                                    </div>
                                ) : (
                                    keywordGroups.map((group) => (
                                        <div key={group._id} className="border border-[var(--color-dark-natural)] rounded-lg p-4">
                                            {editingGroup && editingGroup._id === group._id ? (
                                                // Edit Mode
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                            Group Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editingGroup.name}
                                                            onChange={(e) => setEditingGroup({
                                                                ...editingGroup,
                                                                name: e.target.value
                                                            })}
                                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                            placeholder="Enter group name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                            Keywords (comma-separated)
                                                        </label>
                                                        <textarea
                                                            value={editingGroup.keywords}
                                                            onChange={(e) => setEditingGroup({
                                                                ...editingGroup,
                                                                keywords: e.target.value
                                                            })}
                                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                            placeholder="keyword1, keyword2, keyword3"
                                                            rows="3"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateGroup(group._id, editingGroup)}
                                                            disabled={saving}
                                                            className="bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <FaSave size={12} />
                                                            {saving ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            disabled={saving}
                                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <FaTimes size={12} />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-semibold text-[var(--color-dark-green)]">
                                                            {group.name}
                                                        </h5>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditing(group)}
                                                                disabled={saving}
                                                                className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Edit group"
                                                            >
                                                                <FaEdit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGroup(group._id)}
                                                                disabled={saving}
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Delete group"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.keywords.map((keyword, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] text-xs rounded-md border border-[var(--color-lime)]/50"
                                                            >
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-[var(--color-green)] mt-2">
                                                        {group.keywords.length} keywords • Created {new Date(group.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New Group Form */}
                            {showNewGroupForm ? (
                                <div className="border border-[var(--color-dark-natural)] rounded-lg p-4 bg-[var(--color-natural)]">
                                    <h5 className="font-semibold text-[var(--color-dark-green)] mb-3">Create New Keyword Group</h5>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                Group Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newGroupData.name}
                                                onChange={(e) => setNewGroupData({
                                                    ...newGroupData,
                                                    name: e.target.value
                                                })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                placeholder="e.g., Brand Keywords, Product Names, Competitors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                Keywords (comma-separated) *
                                            </label>
                                            <textarea
                                                value={newGroupData.keywords}
                                                onChange={(e) => setNewGroupData({
                                                    ...newGroupData,
                                                    keywords: e.target.value
                                                })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                placeholder="keyword1, keyword2, keyword3..."
                                                rows="3"
                                            />
                                            <p className="text-xs text-[var(--color-green)] mt-1">
                                                Separate keywords with commas. Keywords will be converted to lowercase for matching.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCreateGroup}
                                                disabled={saving}
                                                className="bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <FaSave size={12} />
                                                {saving ? "Creating..." : "Create Group"}
                                            </button>
                                            <button
                                                onClick={cancelNewGroup}
                                                disabled={saving}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <FaTimes size={12} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowNewGroupForm(true)}
                                    disabled={saving || editingGroup}
                                    className="w-full border-2 border-dashed border-[var(--color-dark-natural)] rounded-lg p-4 text-[var(--color-green)] hover:text-[var(--color-dark-green)] hover:border-[var(--color-lime)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <FaPlus size={14} />
                                    Add New Keyword Group
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}