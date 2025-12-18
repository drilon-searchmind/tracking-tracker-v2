"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import RollUpChildCustomers from "./components/RollUpChildCustomers";
import Subheading from "@/app/components/UI/Utility/Subheading";

// Move server functions inside useEffect or separate API calls
export default function RollUpPage({ params, customerRevenueType }) {
    const [parentCustomer, setParentCustomer] = useState(null);
    const [childCustomers, setChildCustomers] = useState([]);
    const [summaryData, setSummaryData] = useState({
        total_revenue: 0,
        total_ad_spend: 0,
        total_orders: 0,
        overall_roas: 0,
        aov: 0,
        customer_metrics: []
    });
    const [loading, setLoading] = useState(true);
    const [parentCustomerId, setParentCustomerId] = useState(null);

    // Format currency values
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

    // Date calculations for initial date picker values
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Function to handle data updates from RollUpChildCustomers
    const handleDataUpdate = (customerMetrics) => {
        if (!customerMetrics || customerMetrics.length === 0) {
            setSummaryData({
                total_revenue: 0,
                total_ad_spend: 0,
                total_orders: 0,
                overall_roas: 0,
                aov: 0,
                customer_metrics: []
            });
            return;
        }

        // Aggregate the data from all customers
        const aggregated = customerMetrics.reduce((acc, customer) => {
            const revenueMetric = customer.customerRevenueType === "net_sales" ? customer.net_sales : customer.revenue;
            return {
                total_revenue: acc.total_revenue + (revenueMetric || 0),
                total_ad_spend: acc.total_ad_spend + (customer.total_ad_spend || 0),
                total_orders: acc.total_orders + (customer.orders || 0),
            };
        }, { total_revenue: 0, total_ad_spend: 0, total_orders: 0 });

        // Calculate derived metrics
        const overall_roas = aggregated.total_ad_spend > 0 ? aggregated.total_revenue / aggregated.total_ad_spend : 0;
        const aov = aggregated.total_orders > 0 ? aggregated.total_revenue / aggregated.total_orders : 0;

        // Only update state if the data has changed
        if (
            aggregated.total_revenue !== summaryData.total_revenue ||
            aggregated.total_ad_spend !== summaryData.total_ad_spend ||
            aggregated.total_orders !== summaryData.total_orders ||
            overall_roas !== summaryData.overall_roas ||
            aov !== summaryData.aov ||
            JSON.stringify(customerMetrics) !== JSON.stringify(summaryData.customer_metrics)
        ) {
            setSummaryData({
                ...aggregated,
                overall_roas,
                aov,
                customer_metrics: customerMetrics
            });
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.parentCustomerId;

                if (!parentCustomerId) {
                    // Fetch parent customer data
                    const parentResponse = await fetch(`/api/parent-customers`);
                    if (parentResponse.ok) {
                        const parentCustomers = await parentResponse.json();
                        const parent = parentCustomers.find(pc => pc._id === id);
                        setParentCustomer(parent);
                    }

                    // Fetch child customers with settings
                    const customersResponse = await fetch(`/api/customers`);
                    if (customersResponse.ok) {
                        const allCustomers = await customersResponse.json();
                        const children = allCustomers.filter(customer => 
                            customer.parentCustomer && 
                            (customer.parentCustomer._id === id || customer.parentCustomer === id)
                        );

                        // Fetch settings for each child customer
                        const customersWithSettings = await Promise.all(
                            children.map(async (customer) => {
                                try {
                                    const settingsResponse = await fetch(`/api/customer-settings/${customer._id}`);
                                    if (settingsResponse.ok) {
                                        const settings = await settingsResponse.json();
                                        return {
                                            ...customer,
                                            customerMetaID: settings.customerMetaID || "",
                                            customerMetaIDExclude: settings.customerMetaIDExclude || "",
                                            customerValutaCode: settings.customerValutaCode || "DKK",
                                            customerRevenueType: settings.customerRevenueType || "revenue", // Include customerRevenueType
                                        };
                                    }
                                } catch (error) {
                                    console.error(`Error fetching settings for customer ${customer._id}:`, error);
                                }

                                return {
                                    ...customer,
                                    customerMetaID: "",
                                    customerMetaIDExclude: "",
                                    customerValutaCode: "DKK",
                                    customerRevenueType: "revenue", // Default value
                                };
                            })
                        );

                        setChildCustomers(customersWithSettings);
                        setParentCustomerId(id); // Set parentCustomerId after fetching data
                    }
                }
            } catch (error) {
                console.error("Error initializing page:", error);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []); // Ensure the effect runs only once on mount

    const parentCustomerName = parentCustomer?.name || "Parent Customer";

    if (loading) {
        return (
            <div className="py-6 md:py-20 px-4 md:px-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                    <p className="mt-4 text-[var(--color-green)]">Loading roll-up dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[var(--color-natural)] rounded-lg z-1"></div>
            <div className="absolute bottom-[-355px] left-0 w-full h-full z-1">
                <Image
                    width={1920}
                    height={1080}
                    src="/images/shape-dotted-light.svg"
                    alt="bg"
                    className="w-full h-full"
                />
            </div>

            <div className="px-0 md:px-20 mx-auto z-10 relative">
                <div className="mb-6 md:mb-8">
                    <div className="mb-3 md:mb-5">
                        <Subheading headingText={parentCustomerName} />
                    </div>
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">{parentCustomerName} Roll-Up Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        {parentCustomer?.description || `This is the aggregated view for all customers under the ${parentCustomerName} parent customer. Here you can see consolidated metrics and performance data across all child customers.`}
                    </p>
                </div>

                {/* Summary cards with filtered data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-6 mb-8">
                    <div className="border rounded-lg shadow-sm p-6 transition-all duration-200 cursor-pointer hover:shadow-md bg-[var(--color-primary-searchmind)] border-[var(--color-primary-searchmind)] col-span-2">
                        <h3 className="text-lg font-semibold text-white-important mb-2">Combined Revenue</h3>
                        <p className="text-3xl font-bold text-white-important mb-2">
                            {formatCurrency(summaryData.total_revenue)}
                        </p>
                        <p className="text-sm text-white-important">Total across all properties for selected period</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100 col-span-2">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Total Ad Spend</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {formatCurrency(summaryData.total_ad_spend)}
                        </p>
                        <p className="text-sm text-gray-600">Combined advertising costs for selected period</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {summaryData.total_orders?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-600">Orders across all customers for selected period</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Combined ROAS</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {formatNumber(summaryData.overall_roas)}x
                        </p>
                        <p className="text-sm text-gray-600">Weighted average performance for selected period</p>
                    </div>
                </div>

                {/* Child customers list with real metrics and date picker */}
                <RollUpChildCustomers 
                    childCustomers={childCustomers}
                    customer_metrics={[]}
                    parentCustomerId={parentCustomerId}
                    initialStartDate={formatDate(firstDayOfMonth)}
                    initialEndDate={formatDate(yesterday)}
                    onDataUpdate={handleDataUpdate}
                />

                {/* Parent Customer Info Card - moved below child customers */}
                {parentCustomer && (
                    <div className="bg-white rounded-xl shadow-solid-l border border-gray-100 p-6 mb-8 hidden">
                        <h2 className="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Parent Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Company Name</p>
                                <p className="font-medium text-[var(--color-dark-green)]">{parentCustomer.name}</p>
                            </div>
                            {parentCustomer.industry && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Industry</p>
                                    <p className="font-medium text-[var(--color-dark-green)]">{parentCustomer.industry}</p>
                                </div>
                            )}
                            {parentCustomer.headquarters && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Headquarters</p>
                                    <p className="font-medium text-[var(--color-dark-green)]">{parentCustomer.headquarters}</p>
                                </div>
                            )}
                            {parentCustomer.website && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Website</p>
                                    <a 
                                        href={parentCustomer.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="font-medium text-[var(--color-green)] hover:text-[var(--color-dark-green)] transition-colors"
                                    >
                                        {parentCustomer.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Performance Overview with filtered data */}
                <div className="mt-8 bg-white rounded-xl shadow-solid-l border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Performance Metrics Overview</h2>
                    {summaryData.total_revenue > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--color-dark-green)]">Key Performance Indicators</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Combined Revenue:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(summaryData.total_revenue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Total Ad Spend:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(summaryData.total_ad_spend)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Overall ROAS:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatNumber(summaryData.overall_roas)}x</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Total Orders:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{summaryData.total_orders?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Average Order Value:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(summaryData.aov)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--color-dark-green)]">Customer Performance Distribution</h3>
                                <div className="space-y-2">
                                    {summaryData.customer_metrics?.slice(0, 5).map((customerMetric, index) => {
                                        const revenueMetric = customerMetric.customerRevenueType === "net_sales" ? customerMetric.net_sales : customerMetric.revenue;
                                        return (
                                            <div key={customerMetric.customer_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                <span className="text-sm text-gray-600">{customerMetric.customer_name}:</span>
                                                <span className="font-medium text-[var(--color-dark-green)]">
                                                    {formatCurrency(revenueMetric)} ({customerMetric.customerRevenueType === "net_sales" ? "Net Sales" : "Total Sales"})
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {summaryData.customer_metrics?.length === 0 && (
                                        <div className="flex justify-center items-center p-3 bg-gray-50 rounded">
                                            <span className="text-sm text-gray-500">No customer data available for selected period</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">No performance data available</p>
                                <p className="text-sm text-gray-400">Select a date range to view aggregated metrics for all child customers</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}