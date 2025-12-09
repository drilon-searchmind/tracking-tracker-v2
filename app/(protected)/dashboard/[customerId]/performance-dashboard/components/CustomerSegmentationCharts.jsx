import { useState, useMemo, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { HiOutlineCalendar } from "react-icons/hi2";

export default function CustomerSegmentationCharts({ 
    customerId, 
    customerType,
    dateStart, 
    dateEnd, 
    compStart, 
    compEnd,
    comparison 
}) {
    const [viewMode, setViewMode] = useState("Current");
    const [segmentationData, setSegmentationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const colors = {
        newCustomers: "var(--color-lime)",
        returningCustomers: "#6E82D0", // Updated color
        border: "var(--color-green)",
    };

    // Fetch customer segmentation data
    const fetchSegmentationData = async () => {
        if (!customerId || !dateStart || !dateEnd) return;
        
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: dateStart,
                endDate: dateEnd,
            });

            if (compStart && compEnd) {
                params.append('compStartDate', compStart);
                params.append('compEndDate', compEnd);
            }

            const response = await fetch(`/api/customer-segmentation/${customerId}?${params}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Segmentation API response:", data); // Debug log
                setSegmentationData(data);
            } else {
                console.error("Failed to fetch segmentation data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching customer segmentation data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component mounts or dependencies change
    useEffect(() => {
        fetchSegmentationData();
    }, [customerId, dateStart, dateEnd, compStart, compEnd]);

    // Process segmentation data with fallback to demo data
    const processedData = useMemo(() => {
        if (segmentationData && segmentationData.timeSeries) {
            console.log("Using real API data:", segmentationData); // Debug log
            return segmentationData;
        }
        
        // Generate fallback demo time-series data
        const generateDemoTimeSeries = (start, end) => {
            const result = [];
            const startDate = new Date(start);
            const endDate = new Date(end);
            
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                result.push({
                    date: d.toISOString().split('T')[0],
                    new_customer_revenue: Math.random() * 5000 + 1000,
                    returning_customer_revenue: Math.random() * 8000 + 2000,
                    new_customer_orders: Math.floor(Math.random() * 10 + 2),
                    returning_customer_orders: Math.floor(Math.random() * 15 + 3),
                });
            }
            return result;
        };

        const currentTimeSeries = generateDemoTimeSeries(dateStart, dateEnd);
        const comparisonTimeSeries = compStart && compEnd ? generateDemoTimeSeries(compStart, compEnd) : [];

        console.log("Using demo data with", currentTimeSeries.length, "data points"); // Debug log

        return {
            timeSeries: {
                current: currentTimeSeries,
                comparison: comparisonTimeSeries
            },
            summary: {
                current: {
                    newCustomerRevenue: currentTimeSeries.reduce((sum, row) => sum + row.new_customer_revenue, 0),
                    returningCustomerRevenue: currentTimeSeries.reduce((sum, row) => sum + row.returning_customer_revenue, 0),
                    newCustomerOrders: currentTimeSeries.reduce((sum, row) => sum + row.new_customer_orders, 0),
                    returningCustomerOrders: currentTimeSeries.reduce((sum, row) => sum + row.returning_customer_orders, 0),
                },
                comparison: comparisonTimeSeries.length > 0 ? {
                    newCustomerRevenue: comparisonTimeSeries.reduce((sum, row) => sum + row.new_customer_revenue, 0),
                    returningCustomerRevenue: comparisonTimeSeries.reduce((sum, row) => sum + row.returning_customer_revenue, 0),
                    newCustomerOrders: comparisonTimeSeries.reduce((sum, row) => sum + row.new_customer_orders, 0),
                    returningCustomerOrders: comparisonTimeSeries.reduce((sum, row) => sum + row.returning_customer_orders, 0),
                } : null
            }
        };
    }, [segmentationData, dateStart, dateEnd, compStart, compEnd]);

    const data = processedData;

    // Debug log for chart data
    console.log("Processed data for charts:", data);
    console.log("Time series current length:", data?.timeSeries?.current?.length);

    // Time-series line chart data for revenue
    const revenueTimeSeriesData = useMemo(() => {
        if (!data?.timeSeries?.current || data.timeSeries.current.length === 0) {
            console.log("No current time series data for revenue chart");
            return { labels: [], datasets: [] };
        }

        const currentData = data.timeSeries.current;
        console.log("Creating revenue chart with", currentData.length, "data points");

        return {
            labels: currentData.map(row => {
                // Handle both direct string dates and date objects with value property
                const date = row.date?.value || row.date;
                return String(date);
            }),
            datasets: [
                {
                    label: "New Customer Revenue",
                    data: currentData.map(row => row.new_customer_revenue || 0),
                    borderColor: colors.newCustomers,
                    backgroundColor: colors.newCustomers + "20",
                    borderWidth: 1, // Made thinner
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: "Returning Customer Revenue",
                    data: currentData.map(row => row.returning_customer_revenue || 0),
                    borderColor: colors.returningCustomers,
                    backgroundColor: colors.returningCustomers + "20",
                    borderWidth: 1, // Made thinner
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tension: 0.1,
                },
                ...(data.timeSeries.comparison && data.timeSeries.comparison.length > 0 && viewMode === "Comparison" ? [
                    {
                        label: `New Customer Revenue (${comparison})`,
                        data: data.timeSeries.comparison.map(row => row.new_customer_revenue || 0),
                        borderColor: colors.newCustomers,
                        backgroundColor: colors.newCustomers + "10",
                        borderWidth: 1, // Made thinner
                        pointRadius: 1,
                        pointHoverRadius: 3,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    },
                    {
                        label: `Returning Customer Revenue (${comparison})`,
                        data: data.timeSeries.comparison.map(row => row.returning_customer_revenue || 0),
                        borderColor: colors.returningCustomers,
                        backgroundColor: colors.returningCustomers + "10",
                        borderWidth: 1, // Made thinner
                        pointRadius: 1,
                        pointHoverRadius: 3,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    }
                ] : [])
            ],
        };
    }, [data, viewMode, comparison, colors]);

    // Time-series line chart data for orders
    const ordersTimeSeriesData = useMemo(() => {
        if (!data?.timeSeries?.current || data.timeSeries.current.length === 0) {
            console.log("No current time series data for orders chart");
            return { labels: [], datasets: [] };
        }

        const currentData = data.timeSeries.current;
        console.log("Creating orders chart with", currentData.length, "data points");

        return {
            labels: currentData.map(row => {
                // Handle both direct string dates and date objects with value property
                const date = row.date?.value || row.date;
                return String(date);
            }),
            datasets: [
                {
                    label: "New Customer Orders",
                    data: currentData.map(row => row.new_customer_orders || 0),
                    borderColor: colors.newCustomers,
                    backgroundColor: colors.newCustomers + "20",
                    borderWidth: 1, // Made thinner
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: "Returning Customer Orders",
                    data: currentData.map(row => row.returning_customer_orders || 0),
                    borderColor: colors.returningCustomers,
                    backgroundColor: colors.returningCustomers + "20",
                    borderWidth: 1, // Made thinner
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tension: 0.1,
                },
                ...(data.timeSeries.comparison && data.timeSeries.comparison.length > 0 && viewMode === "Comparison" ? [
                    {
                        label: `New Customer Orders (${comparison})`,
                        data: data.timeSeries.comparison.map(row => row.new_customer_orders || 0),
                        borderColor: colors.newCustomers,
                        backgroundColor: colors.newCustomers + "10",
                        borderWidth: 1, // Made thinner
                        pointRadius: 1,
                        pointHoverRadius: 3,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    },
                    {
                        label: `Returning Customer Orders (${comparison})`,
                        data: data.timeSeries.comparison.map(row => row.returning_customer_orders || 0),
                        borderColor: colors.returningCustomers,
                        backgroundColor: colors.returningCustomers + "10",
                        borderWidth: 1, // Made thinner
                        pointRadius: 1,
                        pointHoverRadius: 3,
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                    }
                ] : [])
            ],
        };
    }, [data, viewMode, comparison, colors]);

    const lineChartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                grid: { display: false },
                ticks: {
                    font: { size: 10 },
                    color: "var(--color-green)",
                    maxTicksLimit: 10,
                    callback: function(value, index) {
                        // Format the date for display
                        const date = this.getLabelForValue(value);
                        if (typeof date === 'string' && date.includes('-')) {
                            // Convert YYYY-MM-DD to MM/DD format
                            const parts = date.split('-');
                            if (parts.length === 3) {
                                return `${parts[1]}/${parts[2]}`;
                            }
                        }
                        return date;
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: { 
                    color: "#e5e7eb",
                    lineWidth: 0.5
                },
                ticks: {
                    font: { size: 10 },
                    color: "var(--color-green)",
                    callback: (value) => value.toLocaleString('en-US')
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Match DashboardCharts style
            },
            tooltip: {
                backgroundColor: "var(--color-dark-green)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${Math.round(value).toLocaleString('en-US')}`;
                    },
                    title: (context) => {
                        // Format the date for tooltip title
                        const date = context[0].label;
                        if (typeof date === 'string' && date.includes('-')) {
                            const parts = date.split('-');
                            if (parts.length === 3) {
                                return `${parts[1]}/${parts[2]}/${parts[0]}`;
                            }
                        }
                        return date;
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
        responsive: true,
        elements: {
            point: {
                hoverBorderWidth: 3
            }
        }
    };

    // Calculate metrics for display
    const summary = data?.summary?.current || {
        newCustomerRevenue: 0,
        returningCustomerRevenue: 0,
        newCustomerOrders: 0,
        returningCustomerOrders: 0
    };

    const totalCurrentRevenue = summary.newCustomerRevenue + summary.returningCustomerRevenue;
    const totalCurrentOrders = summary.newCustomerOrders + summary.returningCustomerOrders;
    const returningCustomerRevenuePercent = totalCurrentRevenue > 0 ? 
        ((summary.returningCustomerRevenue / totalCurrentRevenue) * 100).toFixed(1) : 0;
    const returningCustomerOrdersPercent = totalCurrentOrders > 0 ? 
        ((summary.returningCustomerOrders / totalCurrentOrders) * 100).toFixed(1) : 0;

    if (isLoading) {
        return (
            <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 shadow-sm">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-lime)]"></div>
                    <p className="ml-3 text-[var(--color-green)]">Loading customer segmentation data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)] mb-2">
                            Customer Segmentation Analysis
                        </h3>
                        <p className="text-sm text-[var(--color-green)]">
                            Revenue and order distribution between new and returning customers over time
                        </p>
                    </div>
                    
                    {data?.summary?.comparison && (
                        <button
                            onClick={() => setViewMode(viewMode === "Current" ? "Comparison" : "Current")}
                            className="flex items-center text-xs px-3 py-2 bg-[var(--color-natural)] hover:bg-[var(--color-lime)] text-[var(--color-dark-green)] hover:text-white rounded-md transition-colors duration-200"
                        >
                            <HiOutlineCalendar className="mr-1" />
                            {viewMode === "Current" ? "Show Comparison" : "Hide Comparison"}
                        </button>
                    )}
                </div>

                {/* Key Metrics - Reorganized layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Returning Customers Section */}
                    <div className="space-y-4">
                        <h4 className="text-center font-medium text-[var(--color-dark-green)]">Returning Customers</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--color-natural)] rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-[var(--color-dark-green)]">
                                    {returningCustomerRevenuePercent}%
                                </div>
                                <div className="text-xs text-[var(--color-green)] mt-1">
                                    Revenue Share
                                </div>
                            </div>
                            <div className="bg-[var(--color-natural)] rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-[var(--color-dark-green)]">
                                    {returningCustomerOrdersPercent}%
                                </div>
                                <div className="text-xs text-[var(--color-green)] mt-1">
                                    Orders Share
                                </div>
                            </div>
                            <div className="bg-[var(--color-natural)] rounded-lg p-4 text-center col-span-1">
                                <div className="text-lg font-bold text-[var(--color-dark-green)]">
                                    {Math.round(summary.returningCustomerRevenue).toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-[var(--color-green)] mt-1">
                                    Total Revenue
                                </div>
                            </div>
                            <div className="bg-[var(--color-natural)] rounded-lg p-4 text-center col-span-1">
                                <div className="text-lg font-bold text-[var(--color-dark-green)]">
                                    {Math.round(summary.returningCustomerOrders).toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-[var(--color-green)] mt-1">
                                    Total Orders
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Customers Section */}
                    <div className="space-y-4">
                        <h4 className="text-center font-medium text-[var(--color-dark-green)]">New Customers</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--color-primary-searchmind)] text-white rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">
                                    {(100 - returningCustomerRevenuePercent).toFixed(1)}%
                                </div>
                                <div className="text-xs text-white mt-1">
                                    Revenue Share
                                </div>
                            </div>
                            <div className="bg-[var(--color-primary-searchmind)] text-white rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">
                                    {(100 - returningCustomerOrdersPercent).toFixed(1)}%
                                </div>
                                <div className="text-xs text-white mt-1">
                                    Orders Share
                                </div>
                            </div>
                            <div className="bg-[var(--color-primary-searchmind)] text-white rounded-lg p-4 text-center col-span-1">
                                <div className="text-lg font-bold text-white">
                                    {Math.round(summary.newCustomerRevenue).toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-white mt-1">
                                    Total Revenue
                                </div>
                            </div>
                            <div className="bg-[var(--color-primary-searchmind)] text-white rounded-lg p-4 text-center col-span-1">
                                <div className="text-lg font-bold text-white">
                                    {Math.round(summary.newCustomerOrders).toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-white mt-1">
                                    Total Orders
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time-Series Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Revenue Over Time */}
                    <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[400px] shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-[var(--color-dark-green)]">Revenue Over Time</p>
                        </div>
                        <div className="w-full h-[calc(100%-2rem)]">
                            {revenueTimeSeriesData.labels.length > 0 ? (
                                <Line data={revenueTimeSeriesData} options={lineChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[var(--color-green)]">
                                    No revenue data available for the selected period
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders Over Time */}
                    <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[400px] shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-[var(--color-dark-green)]">Orders Over Time</p>
                        </div>
                        <div className="w-full h-[calc(100%-2rem)]">
                            {ordersTimeSeriesData.labels.length > 0 ? (
                                <Line data={ordersTimeSeriesData} options={lineChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[var(--color-green)]">
                                    No orders data available for the selected period
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-[var(--color-natural)] rounded-lg">
                    <p className="text-xs text-[var(--color-green)] text-center">
                        <strong>Note:</strong> Customer classification is based on order history. 
                        A returning customer is one who has placed more than one order in the system.
                        {!segmentationData && " Currently showing demo data."}
                    </p>
                </div>
            </div>
        </div>
    );
}