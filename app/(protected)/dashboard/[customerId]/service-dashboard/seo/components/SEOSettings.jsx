"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function SEOSettings({ customerId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [keywordGroups, setKeywordGroups] = useState([]);
    const [exactKeywordGroups, setExactKeywordGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [editingExactGroup, setEditingExactGroup] = useState(null);
    const [showNewGroupForm, setShowNewGroupForm] = useState(false);
    const [showNewExactGroupForm, setShowNewExactGroupForm] = useState(false);
    const [newGroupData, setNewGroupData] = useState({
        name: "",
        keywords: ""
    });
    const [newExactGroupData, setNewExactGroupData] = useState({
        name: "",
        keywords: ""
    });

    const [brandKeywords, setBrandKeywords] = useState([]);
    const [brandKeywordsText, setBrandKeywordsText] = useState("");
    const [brandKeywordsLoading, setBrandKeywordsLoading] = useState(false);

    // Fetch keyword groups, exact keyword groups, and brand keywords when component mounts or accordion opens
    useEffect(() => {
        if (isOpen && customerId) {
            fetchKeywordGroups();
            fetchBrandKeywords();
            fetchExactKeywordGroups();
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

    const fetchExactKeywordGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/seo-exact-keyword-groups?customerId=${customerId}`);
            if (response.ok) {
                const groups = await response.json();
                setExactKeywordGroups(groups);
            } else {
                console.error("Failed to fetch exact keyword groups");
            }
        } catch (error) {
            console.error("Error fetching exact keyword groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrandKeywords = async () => {
        setBrandKeywordsLoading(true);
        try {
            const response = await fetch(`/api/seo-brand-keywords?customerId=${customerId}`);
            if (response.ok) {
                const data = await response.json();
                setBrandKeywords(data.keywords || []);
                setBrandKeywordsText(data.keywords ? data.keywords.join(', ') : '');
            } else {
                console.error("Failed to fetch brand keywords");
            }
        } catch (error) {
            console.error("Error fetching brand keywords:", error);
        } finally {
            setBrandKeywordsLoading(false);
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

    const handleCreateExactGroup = async () => {
        if (!newExactGroupData.name.trim() || !newExactGroupData.keywords.trim()) {
            alert("Please provide both group name and keywords");
            return;
        }

        setSaving(true);
        try {
            const keywords = newExactGroupData.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k);

            const response = await fetch('/api/seo-exact-keyword-groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newExactGroupData.name,
                    keywords: keywords,
                    customerId: customerId
                }),
            });

            if (response.ok) {
                const newGroup = await response.json();
                setExactKeywordGroups(prev => [...prev, newGroup]);
                setNewExactGroupData({ name: "", keywords: "" });
                setShowNewExactGroupForm(false);
                alert("Exact keyword group created successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to create exact keyword group");
            }
        } catch (error) {
            console.error("Error creating exact keyword group:", error);
            alert("An error occurred while creating the exact keyword group");
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

    const handleUpdateExactGroup = async (groupId, updatedData) => {
        setSaving(true);
        try {
            const keywords = updatedData.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k);

            const response = await fetch(`/api/seo-exact-keyword-groups/${groupId}`, {
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
                setExactKeywordGroups(prev => 
                    prev.map(group => group._id === groupId ? updatedGroup : group)
                );
                setEditingExactGroup(null);
                alert("Exact keyword group updated successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update exact keyword group");
            }
        } catch (error) {
            console.error("Error updating exact keyword group:", error);
            alert("An error occurred while updating the exact keyword group");
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

    const handleDeleteExactGroup = async (groupId) => {
        if (!confirm("Are you sure you want to delete this exact keyword group?")) {
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`/api/seo-exact-keyword-groups/${groupId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setExactKeywordGroups(prev => prev.filter(group => group._id !== groupId));
                alert("Exact keyword group deleted successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to delete exact keyword group");
            }
        } catch (error) {
            console.error("Error deleting exact keyword group:", error);
            alert("An error occurred while deleting the exact keyword group");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateBrandKeywords = async () => {
        setSaving(true);
        try {
            const keywords = brandKeywordsText
                .split(',')
                .map(k => k.trim())
                .filter(k => k);

            const response = await fetch('/api/seo-brand-keywords', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords: keywords,
                    customerId: customerId
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setBrandKeywords(result.keywords);
                alert("Brand keywords updated successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update brand keywords");
            }
        } catch (error) {
            console.error("Error updating brand keywords:", error);
            alert("An error occurred while updating brand keywords");
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

    const startEditingExact = (group) => {
        setEditingExactGroup({
            ...group,
            keywords: group.keywords.join(', ')
        });
    };

    const cancelEditing = () => {
        setEditingGroup(null);
    };

    const cancelEditingExact = () => {
        setEditingExactGroup(null);
    };

    const cancelNewGroup = () => {
        setShowNewGroupForm(false);
        setNewGroupData({ name: "", keywords: "" });
    };

    const cancelNewExactGroup = () => {
        setShowNewExactGroupForm(false);
        setNewExactGroupData({ name: "", keywords: "" });
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
                            Brand Keywords
                        </h4>
                        <p className="text-sm text-[var(--color-green)] mb-4">
                            Define your brand keywords to enable "With Brand" and "Without Brand" filtering. 
                            Keywords matching these terms will be considered brand-related searches.
                        </p>
                        
                        {brandKeywordsLoading ? (
                            <div className="flex items-center gap-2 p-4 bg-[var(--color-natural)] rounded-lg">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-lime)]"></div>
                                <span className="text-sm text-[var(--color-green)]">Loading brand keywords...</span>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">
                                        Brand Keywords (comma-separated) *
                                    </label>
                                    <textarea
                                        value={brandKeywordsText}
                                        onChange={(e) => setBrandKeywordsText(e.target.value)}
                                        className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                        placeholder="your-brand, another brand, company name..."
                                        rows="3"
                                        disabled={saving}
                                    />
                                    <p className="text-xs text-[var(--color-green)] mt-1">
                                        Enter your brand terms separated by commas. These will be used to filter "With Brand" vs "Without Brand" keywords.
                                    </p>
                                </div>
                                
                                {brandKeywords.length > 0 && (
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <span className="text-xs font-medium text-[var(--color-green)] mb-2 block">Current brand keywords:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {brandKeywords.map((keyword, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-1 bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] text-xs rounded-md border border-[var(--color-lime)]/50"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleUpdateBrandKeywords}
                                    disabled={saving}
                                    className="bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FaSave size={12} />
                                    {saving ? "Updating..." : "Update Brand Keywords"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 border-t border-[var(--color-light-natural)] pt-6">
                        <h4 className="text-base font-semibold text-[var(--color-dark-green)] mb-2">
                            Exact Keyword Groups
                        </h4>
                        <p className="text-sm text-[var(--color-green)] mb-4">
                            Create groups of exact keywords to filter for. When selected, shows all keywords that match exactly any of the keywords in the group.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                            <p className="mt-2 text-sm text-[var(--color-green)]">Loading exact keyword groups...</p>
                        </div>
                    ) : (
                        <>
                            {/* Existing Exact Groups */}
                            <div className="space-y-4 mb-6">
                                {exactKeywordGroups.length === 0 ? (
                                    <div className="text-center py-8 bg-[var(--color-natural)] rounded-lg">
                                        <p className="text-[var(--color-green)]">No exact keyword groups created yet.</p>
                                        <p className="text-sm text-[var(--color-green)] mt-1">
                                            Click "Add New Exact Group" to create your first exact keyword group.
                                        </p>
                                    </div>
                                ) : (
                                    exactKeywordGroups.map((group) => (
                                        <div key={group._id} className="border border-[var(--color-dark-natural)] rounded-lg p-4 bg-blue-50/30">
                                            {editingExactGroup && editingExactGroup._id === group._id ? (
                                                // Edit Mode
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                            Group Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editingExactGroup.name}
                                                            onChange={(e) => setEditingExactGroup({
                                                                ...editingExactGroup,
                                                                name: e.target.value
                                                            })}
                                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                            placeholder="Enter group name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                            Exact Keywords (comma-separated)
                                                        </label>
                                                        <textarea
                                                            value={editingExactGroup.keywords}
                                                            onChange={(e) => setEditingExactGroup({
                                                                ...editingExactGroup,
                                                                keywords: e.target.value
                                                            })}
                                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                            placeholder="pige, 2025, december"
                                                            rows="3"
                                                        />
                                                        <p className="text-xs text-[var(--color-green)] mt-1">
                                                            Keywords will match exactly. "pige" will show "pige" but not "pigekjole".
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateExactGroup(group._id, editingExactGroup)}
                                                            disabled={saving}
                                                            className="bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <FaSave size={12} />
                                                            {saving ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingExact}
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
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">EXACT</span>
                                                        </h5>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditingExact(group)}
                                                                disabled={saving}
                                                                className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Edit exact group"
                                                            >
                                                                <FaEdit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteExactGroup(group._id)}
                                                                disabled={saving}
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Delete exact group"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.keywords.map((keyword, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border border-blue-200"
                                                            >
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-[var(--color-green)] mt-2">
                                                        {group.keywords.length} exact keywords • Created {new Date(group.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New Exact Group Form */}
                            {showNewExactGroupForm ? (
                                <div className="border border-[var(--color-dark-natural)] rounded-lg p-4 bg-blue-50/20 mb-6">
                                    <h5 className="font-semibold text-[var(--color-dark-green)] mb-3">Create New Exact Keyword Group</h5>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                Group Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newExactGroupData.name}
                                                onChange={(e) => setNewExactGroupData({
                                                    ...newExactGroupData,
                                                    name: e.target.value
                                                })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                placeholder="e.g., Specific Terms, Product Names, Campaign Keywords"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-1">
                                                Exact Keywords (comma-separated) *
                                            </label>
                                            <textarea
                                                value={newExactGroupData.keywords}
                                                onChange={(e) => setNewExactGroupData({
                                                    ...newExactGroupData,
                                                    keywords: e.target.value
                                                })}
                                                className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                                placeholder="pige, 2025, december, sale"
                                                rows="3"
                                            />
                                            <p className="text-xs text-[var(--color-green)] mt-1">
                                                Enter keywords that must match exactly. "pige" will only match "pige", not "pigekjole".
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCreateExactGroup}
                                                disabled={saving}
                                                className="bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <FaSave size={12} />
                                                {saving ? "Creating..." : "Create Exact Group"}
                                            </button>
                                            <button
                                                onClick={cancelNewExactGroup}
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
                                    onClick={() => setShowNewExactGroupForm(true)}
                                    disabled={saving || editingGroup || editingExactGroup}
                                    className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-blue-600 hover:text-blue-800 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
                                >
                                    <FaPlus size={14} />
                                    Add New Exact Keyword Group
                                </button>
                            )}
                        </>
                    )}

                    <div className="mb-6 border-t border-[var(--color-light-natural)] pt-6">
                        <h4 className="text-base font-semibold text-[var(--color-dark-green)] mb-2">
                            Keyword Groups (Partial Match)
                        </h4>
                        <p className="text-sm text-[var(--color-green)] mb-4">
                            Create and manage keyword groups to filter your SEO performance data using partial matching. 
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