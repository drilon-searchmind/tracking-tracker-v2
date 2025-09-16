"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/app/contexts/ToastContext';
import { FaExternalLinkAlt, FaFilter } from 'react-icons/fa';

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

    const fetchCustomers = async () => {
        try {
            // In a real implementation, this would fetch customer data from the API
            // For now, we'll just simulate some data
            const mockCustomers = {
                '101': 'Acme Corporation',
                '102': 'TechVision Inc.',
                '103': 'Nordic Retail Group'
            };

            setCustomerMap(mockCustomers);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
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
                return 'bg-green-100 text-green-800';
            case 'Pending Customer Approval':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-blue-100 text-blue-800';
            case 'Ended':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get unique statuses from campaigns
    const getUniqueStatuses = () => {
        const statuses = [...new Set(campaigns.map(campaign => campaign.status))];
        return ['All', ...statuses];
    };

    // Get unique months from campaign start dates
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
            // Sort by year, then by month
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');

            if (yearA !== yearB) return yearA - yearB;
            return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
        })];
    };

    const filterCampaigns = () => {
        return campaigns.filter(campaign => {
            // Text search filter
            const matchesSearch = campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customerMap[campaign.customerId] &&
                    customerMap[campaign.customerId].toLowerCase().includes(searchQuery.toLowerCase()));

            // Status filter
            const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;

            // Month filter
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

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Assigned Campaigns</h2>

            <div className="mb-6 flex justify-between items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-64 px-4 py-2 border border-gray-300 rounded text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                        <FaFilter className="text-zinc-500" />
                        <span className="text-zinc-600">Filter by:</span>
                    </div>

                    <select
                        className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {getUniqueStatuses().map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <select
                        className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                    >
                        {getUniqueMonths().map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-700 mx-auto"></div>
                    <p className="mt-3 text-gray-600">Loading campaigns...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Campaign Name</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Start Date</th>
                                <th className="px-4 py-3 font-medium">End Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            {filteredCampaigns.length > 0 ? (
                                filteredCampaigns.map(campaign => (
                                    <tr key={campaign._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{campaign.campaignName}</td>
                                        <td className="px-4 py-3">{customerMap[campaign.customerId] || 'Unknown Customer'}</td>
                                        <td className="px-4 py-3">{formatDate(campaign.startDate)}</td>
                                        <td className="px-4 py-3">{formatDate(campaign.endDate)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={`/dashboard/${campaign.customerId}/tools/kampagneplan?campaignId=${campaign._id}`}
                                                className="bg-zinc-700 text-white py-1 px-3 rounded text-sm hover:bg-zinc-800 inline-flex items-center gap-2"
                                            >
                                                View <FaExternalLinkAlt size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery || statusFilter !== 'All' || monthFilter !== 'All'
                                            ? "No campaigns match your filters"
                                            : "No campaigns found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}