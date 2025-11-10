"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/app/contexts/ToastContext';
import { FaExternalLinkAlt, FaFilter, FaSearch, FaCalendarAlt, FaUser, FaTasks, FaChartLine } from 'react-icons/fa';

export default function UserCampaignsContent() {
    const { data: session } = useSession();
    const { showToast } = useToast();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [customerMap, setCustomerMap] = useState({});
    const [statusFilter, setStatusFilter] = useState('All');
    const [monthFilter, setMonthFilter] = useState('All');

    useEffect(() => {
        fetchUserCampaigns();
    }, []);

    const fetchUserCampaigns = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/assigned-campaigns');

            if (!response.ok) {
                throw new Error('Failed to fetch campaigns');
            }

            const campaignData = await response.json();
            setCampaigns(campaignData);

            const customerMapData = {};
            campaignData.forEach(campaign => {
                if (campaign.customerId && campaign.customerName) {
                    customerMapData[campaign.customerId] = campaign.customerName;
                }
            });
            setCustomerMap(customerMapData);
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            showToast("Failed to load campaigns", "error");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Always On';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Live':
                return 'bg-green-100 text-green-700 border border-green-200';
            case 'Pending Customer Approval':
                return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'Approved':
                return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'Ended':
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const getUniqueStatuses = () => {
        const statuses = [...new Set(campaigns.map(campaign => campaign.status))];
        return ['All', ...statuses];
    };

    const getUniqueMonths = () => {
        const months = [];
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        campaigns.forEach(campaign => {
            if (campaign.startDate) {
                const date = new Date(campaign.startDate);
                const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                if (!months.includes(monthYear)) {
                    months.push(monthYear);
                }
            }
        });

        return ['All', ...months.sort((a, b) => {
            if (a === 'All' || b === 'All') return 0;
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');

            if (yearA !== yearB) return yearA - yearB;
            return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
        })];
    };

    const filterCampaigns = () => {
        return campaigns.filter(campaign => {
            const matchesSearch = campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customerMap[campaign.customerId] &&
                    customerMap[campaign.customerId].toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;

            let matchesMonth = true;
            if (monthFilter !== 'All' && campaign.startDate) {
                const date = new Date(campaign.startDate);
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                matchesMonth = monthYear === monthFilter;
            }

            return matchesSearch && matchesStatus && matchesMonth;
        });
    };

    const filteredCampaigns = filterCampaigns();

    const getCampaignStats = () => {
        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter(c => c.status === 'Live').length;
        const pendingCampaigns = campaigns.filter(c => c.status === 'Pending Customer Approval').length;
        const endedCampaigns = campaigns.filter(c => c.status === 'Ended').length;

        return { totalCampaigns, activeCampaigns, pendingCampaigns, endedCampaigns };
    };

    const stats = getCampaignStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-[var(--color-dark-natural)] pb-4">
                <h2 className="text-2xl font-bold text-[var(--color-dark-green)] mb-2">My Assigned Campaigns</h2>
                <p className="text-[var(--color-green)]">View and manage campaigns you've been assigned to work on</p>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-green)]">Total Campaigns</p>
                            <p className="text-2xl font-bold text-[var(--color-dark-green)] mt-1">{stats.totalCampaigns}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-lime)]/20 rounded-lg">
                            <FaTasks className="text-[var(--color-dark-green)] text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-green)]">Active</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeCampaigns}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FaChartLine className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-green)]">Pending Approval</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingCampaigns}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FaCalendarAlt className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-natural)] rounded-xl p-6 border border-[var(--color-dark-natural)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-green)]">Ended</p>
                            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.endedCampaigns}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <FaUser className="text-gray-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 border border-[var(--color-dark-natural)] shadow-solid-11">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)] text-sm" />
                        <input
                            type="text"
                            placeholder="Search campaigns or customers..."
                            className="w-full pl-10 pr-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-sm">
                            <FaFilter className="text-[var(--color-green)]" />
                            <span className="text-[var(--color-dark-green)] font-medium">Filter by:</span>
                        </div>

                        <select
                            className="border border-[var(--color-dark-natural)] rounded-lg px-4 py-2 text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {getUniqueStatuses().map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            className="border border-[var(--color-dark-natural)] rounded-lg px-4 py-2 text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                        >
                            {getUniqueMonths().map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white rounded-xl border border-[var(--color-dark-natural)] shadow-solid-11 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                        <p className="mt-4 text-[var(--color-green)]">Loading campaigns...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[var(--color-natural)] border-b border-[var(--color-dark-natural)]">
                                <tr className="text-[var(--color-dark-green)]">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Campaign Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Start Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">End Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--color-dark-green)] divide-y divide-[var(--color-dark-natural)]">
                                {filteredCampaigns.length > 0 ? (
                                    filteredCampaigns.map(campaign => (
                                        <tr key={campaign._id} className="hover:bg-[var(--color-natural)]/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-sm">{campaign.campaignName}</td>
                                            <td className="px-6 py-4 text-sm text-[var(--color-green)]">
                                                {customerMap[campaign.customerId] || 'Unknown Customer'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--color-green)]">{formatDate(campaign.startDate)}</td>
                                            <td className="px-6 py-4 text-sm text-[var(--color-green)]">{formatDate(campaign.endDate)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`/dashboard/${campaign.customerId}/tools/kampagneplan?campaignId=${campaign._id}`}
                                                    className="inline-flex items-center gap-2 bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    View Campaign
                                                    <FaExternalLinkAlt className="text-xs" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <FaTasks className="text-4xl text-[var(--color-green)]/30 mb-4" />
                                                <p className="text-[var(--color-green)] text-lg font-medium mb-2">
                                                    {searchQuery || statusFilter !== 'All' || monthFilter !== 'All'
                                                        ? "No campaigns match your filters"
                                                        : "No campaigns assigned"}
                                                </p>
                                                <p className="text-sm text-[var(--color-green)]/80">
                                                    {searchQuery || statusFilter !== 'All' || monthFilter !== 'All'
                                                        ? "Try adjusting your search criteria or filters"
                                                        : "You haven't been assigned to any campaigns yet"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            {!loading && filteredCampaigns.length > 0 && (
                <div className="text-sm text-[var(--color-green)] text-center">
                    Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                </div>
            )}
        </div>
    );
}