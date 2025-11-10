import Image from "next/image";
import { queryBigQueryRollUpMetrics } from "@/lib/bigQueryConnect";
import RollUpChildCustomers from "./components/RollUpChildCustomers";
import Subheading from "@/app/components/UI/Utility/Subheading";

async function fetchParentCustomerData(parentCustomerId) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/parent-customers`, {
            cache: 'no-store'
        });
        
        if (response.ok) {
            const parentCustomers = await response.json();
            return parentCustomers.find(pc => pc._id === parentCustomerId);
        }
    } catch (error) {
        console.error("Error fetching parent customer:", error);
    }
    return null;
}

async function fetchChildCustomersWithSettings(parentCustomerId) {
    try {
        const customersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/customers`, {
            cache: 'no-store'
        });
        
        if (customersResponse.ok) {
            const allCustomers = await customersResponse.json();
            // Filter customers that have this parent
            const childCustomers = allCustomers.filter(customer => 
                customer.parentCustomer && 
                (customer.parentCustomer._id === parentCustomerId || customer.parentCustomer === parentCustomerId)
            );

            // Fetch settings for each child customer
            const customersWithSettings = await Promise.all(
                childCustomers.map(async (customer) => {
                    try {
                        const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/customer-settings/${customer._id}`, {
                            cache: 'no-store'
                        });
                        
                        if (settingsResponse.ok) {
                            const settings = await settingsResponse.json();
                            return {
                                ...customer,
                                customerMetaID: settings.customerMetaID || "",
                                customerMetaIDExclude: settings.customerMetaIDExclude || "",
                                customerValutaCode: settings.customerValutaCode || "DKK"
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching settings for customer ${customer._id}:`, error);
                    }
                    
                    // Return customer with default settings if fetch fails
                    return {
                        ...customer,
                        customerMetaID: "",
                        customerMetaIDExclude: "",
                        customerValutaCode: "DKK"
                    };
                })
            );

            return customersWithSettings;
        }
    } catch (error) {
        console.error("Error fetching child customers:", error);
    }
    return [];
}

export default async function RollUpPage({ params }) {
    const resolvedParams = await params;
    const parentCustomerId = resolvedParams.parentCustomerId;

    console.log("::: Fetching roll-up data for parent customer:", parentCustomerId);

    // Fetch real data
    const parentCustomer = await fetchParentCustomerData(parentCustomerId);
    const childCustomers = await fetchChildCustomersWithSettings(parentCustomerId);
    
    const parentCustomerName = parentCustomer?.name || "Parent Customer";

    // Fetch BigQuery metrics for all child customers
    let rollUpMetrics = { totals: {}, customer_metrics: [] };
    
    if (childCustomers.length > 0) {
        try {
            console.log(`::: Fetching BigQuery roll-up metrics for ${childCustomers.length} customers`);
            rollUpMetrics = await queryBigQueryRollUpMetrics({ childCustomers });
        } catch (error) {
            console.error("Error fetching roll-up metrics:", error);
            // Continue with empty metrics if BigQuery fails
        }
    }

    const { totals, customer_metrics } = rollUpMetrics;

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
    const formatDate = (date) => date.toISOString().split("T")[0];

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

                {/* Summary cards with real data - reduced to 6 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-6 mb-8">
                    <div className="border rounded-lg shadow-sm p-6 transition-all duration-200 cursor-pointer hover:shadow-md bg-[var(--color-primary-searchmind)] border-[var(--color-primary-searchmind)] col-span-2">
                        <h3 className="text-lg font-semibold text-white-important mb-2">Combined Revenue</h3>
                        <p className="text-3xl font-bold text-white-important mb-2">
                            {formatCurrency(totals?.total_revenue)}
                        </p>
                        <p className="text-sm text-white-important">Total across all properties all time</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100 col-span-2">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Total Ad Spend</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {formatCurrency(totals?.total_ad_spend)}
                        </p>
                        <p className="text-sm text-gray-600">Combined advertising costs all time</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {totals?.total_orders?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-600">Orders across all customers all time</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-solid-l border border-gray-100">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">Combined ROAS</h3>
                        <p className="text-3xl font-bold text-[var(--color-dark-green)] mb-2">
                            {formatNumber(totals?.overall_roas)}x
                        </p>
                        <p className="text-sm text-gray-600">Weighted average performance all time</p>
                    </div>
                </div>

                {/* Child customers list with real metrics and date picker */}
                <RollUpChildCustomers 
                    childCustomers={childCustomers}
                    customer_metrics={customer_metrics}
                    parentCustomerId={parentCustomerId}
                    initialStartDate={formatDate(firstDayOfMonth)}
                    initialEndDate={formatDate(yesterday)}
                />

                {/* Parent Customer Info Card - moved below child customers */}
                {parentCustomer && (
                    <div className="bg-white rounded-xl shadow-solid-l border border-gray-100 p-6 mb-8">
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

                {/* Performance Overview Chart Placeholder */}
                <div className="mt-8 bg-white rounded-xl shadow-solid-l border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Performance Metrics Overview</h2>
                    {totals?.total_revenue > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--color-dark-green)]">Key Performance Indicators</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Combined Revenue:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(totals.total_revenue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Total Ad Spend:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(totals.total_ad_spend)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Overall ROAS:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{formatNumber(totals.overall_roas)}x</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Total Orders:</span>
                                        <span className="font-medium text-[var(--color-dark-green)]">{totals.total_orders?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-[var(--color-dark-green)]">Customer Performance Distribution</h3>
                                <div className="space-y-2">
                                    {customer_metrics?.slice(0, 5).map((customerMetric, index) => (
                                        <div key={customerMetric.customer_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span className="text-sm text-gray-600">{customerMetric.customer_name}:</span>
                                            <span className="font-medium text-[var(--color-dark-green)]">{formatCurrency(customerMetric.revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">No performance data available</p>
                                <p className="text-sm text-gray-400">Data will appear here once BigQuery metrics are available for the child customers</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}