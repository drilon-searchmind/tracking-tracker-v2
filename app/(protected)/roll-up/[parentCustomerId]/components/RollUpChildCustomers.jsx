"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function RollUpChildCustomers({ 
    childCustomers, 
    customer_metrics: initialCustomerMetrics, 
    parentCustomerId,
    initialStartDate,
    initialEndDate 
}) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [customerMetrics, setCustomerMetrics] = useState(initialCustomerMetrics || []);
    const [loading, setLoading] = useState(false);

    // Move format functions into the client component
    const formatCurrency = (value, currency = 'DKK') => {
        if (!value || isNaN(value)) return '0';
        
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'DKK' ? 'DKK' : 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
        
        return formatted;
    };

    const formatNumber = (value, decimals = 1) => {
        if (!value || isNaN(value)) return '0';
        return Number(value).toFixed(decimals);
    };

    const fetchFilteredData = async (newStartDate, newEndDate) => {
        if (!childCustomers || childCustomers.length === 0) return;

        setLoading(true);
        try {
            // Use the API endpoint instead of direct BigQuery function call
            const response = await fetch('/api/roll-up-metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    childCustomers,
                    startDate: newStartDate,
                    endDate: newEndDate
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCustomerMetrics(data.customer_metrics || []);
            } else {
                console.error('Failed to fetch filtered roll-up data');
            }
        } catch (error) {
            console.error('Error fetching filtered roll-up data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredData(startDate, endDate);
    }, [startDate, endDate]);

    return (
        <div className="bg-white rounded-xl shadow-solid-l border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-dark-green)] mb-4 md:mb-0">
                    Child Customers ({childCustomers.length})
                </h2>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[var(--color-dark-green)] text-sm" />
                        <span className="text-sm text-[var(--color-green)] font-medium">Date Range:</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <span className="text-[var(--color-green)] text-sm font-medium">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                    <p className="mt-2 text-sm text-[var(--color-green)]">Updating metrics...</p>
                </div>
            )}

            {childCustomers.length > 0 ? (
                <div className="space-y-3">
                    {childCustomers.map((customer) => {
                        const customerMetric = customerMetrics?.find(m => m.customer_id === customer._id) || {};
                        
                        return (
                            <div key={customer._id} className="flex items-center p-4 bg-[var(--color-natural)] rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3 min-w-[20%] max-w-[20%] overflow-hidden">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <span className="font-medium text-[var(--color-dark-green)] block">{customer.name}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-10 text-sm ml-6">
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {formatCurrency(customerMetric.revenue)}
                                        </div>
                                        <div className="text-xs text-gray-500">Revenue</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {customerMetric.orders?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-xs text-gray-500">Orders</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {formatCurrency(customerMetric.total_ad_spend)}
                                        </div>
                                        <div className="text-xs text-gray-500">Ad Spend</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {formatNumber(customerMetric.roas)}x
                                        </div>
                                        <div className="text-xs text-gray-500">ROAS</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {formatCurrency(customerMetric.aov)}
                                        </div>
                                        <div className="text-xs text-gray-500">AOV</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 ml-auto">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                                        {customer.isArchived ? 'Archived' : 'Active'}
                                    </span>
                                    <a 
                                        href={`/dashboard/${customer._id}`}
                                        className="text-xs bg-[var(--color-dark-green)] text-white px-3 py-1 rounded-full hover:bg-[var(--color-green)] transition-colors whitespace-nowrap"
                                    >
                                        View Dashboard
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No child customers found for this parent customer.</p>
                    <p className="text-sm text-gray-400">Child customers will appear here once they are assigned to this parent customer.</p>
                </div>
            )}
        </div>
    );
}