"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

// Import components
import DashboardMetrics from "./components/DashboardMetrics";
import DashboardCharts from "./components/DashboardCharts";
import ServiceDashboards from "./components/ServiceDashboards";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    ChartDataLabels,
);

export default function PerformanceDashboard({ customerId, customerName, initialData }) {
    // Initialize date picker to first day of current month to yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            console.warn('Invalid date encountered:', date);
            return '';
        }
        return date.toISOString().split("T")[0];
    };

    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // View mode states for each chart
    const [revenueViewMode, setRevenueViewMode] = useState("YTD");
    const [spendViewMode, setSpendViewMode] = useState("YTD");
    const [aovViewMode, setAovViewMode] = useState("YTD");
    const [sessionsViewMode, setSessionsViewMode] = useState("YTD");

    const data = Array.isArray(initialData) ? initialData : [];

    // Initial loading effect when component mounts
    useEffect(() => {
        if (initialData) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setInitialLoadComplete(true); // Mark initial load as complete
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [initialData]);

    // Modified to only show loading on filters change when initial load is not complete
    useEffect(() => {
        if (initialLoadComplete) {
            // Don't show loader for subsequent filter changes
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [dateStart, dateEnd, comparison, initialLoadComplete]);

    const formatComparisonDate = (date) => {
        if (!date) return '';

        try {
            const compDate = new Date(date);

            if (isNaN(compDate.getTime())) {
                console.warn('Invalid comparison date:', date);
                return '';
            }

            const offset = comparison === "Previous Year"
                ? 365
                : Math.ceil((new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24));

            compDate.setDate(compDate.getDate() + offset);
            return formatDate(compDate);
        } catch (error) {
            console.error('Error formatting comparison date:', error);
            return '';
        }
    };

    // Filter data for the selected period
    const filteredData = useMemo(() => {
        return data.filter((row) => row.date >= dateStart && row.date <= dateEnd);
    }, [data, dateStart, dateEnd]);

    // Get comparison dates
    const getComparisonDates = () => {
        const end = new Date(dateEnd);
        const start = new Date(dateStart);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (comparison === "Previous Year") {
            return {
                compStart: formatDate(new Date(start.setFullYear(start.getFullYear() - 1))),
                compEnd: formatDate(new Date(end.setFullYear(end.getFullYear() - 1))),
            };
        } else {
            return {
                compStart: formatDate(new Date(start.setDate(start.getDate() - daysDiff))),
                compEnd: formatDate(new Date(end.setDate(end.getDate() - daysDiff))),
            };
        }
    };

    const { compStart, compEnd } = getComparisonDates();

    // Get comparison data
    const comparisonData = useMemo(() => {
        return data.filter((row) => row.date >= compStart && row.date <= compEnd);
    }, [data, compStart, compEnd]);

    // Function to get YTD data
    const getYTDData = useMemo(() => {
        const currentYear = new Date(dateEnd).getFullYear();
        const startOfYear = `${currentYear}-01-01`;

        return data.filter((row) => {
            const rowDate = new Date(row.date);
            return rowDate >= new Date(startOfYear) && rowDate <= new Date(dateEnd);
        });
    }, [data, dateEnd]);

    // Function to get YTD comparison data
    const getYTDComparisonData = useMemo(() => {
        const currentYear = new Date(dateEnd).getFullYear();
        const previousYear = currentYear - 1;
        const startOfPreviousYear = `${previousYear}-01-01`;
        const endOfPreviousYearYTD = `${previousYear}-${dateEnd.substring(5)}`;

        return data.filter((row) => {
            const rowDate = new Date(row.date);
            return rowDate >= new Date(startOfPreviousYear) && rowDate <= new Date(endOfPreviousYearYTD);
        });
    }, [data, dateEnd]);

    // Function to group YTD data by month
    const groupDataByMonth = (dataArray) => {
        const groupedData = {};

        dataArray.forEach(row => {
            // Extract year and month from date
            const date = new Date(row.date);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // Initialize month group if it doesn't exist
            if (!groupedData[yearMonth]) {
                groupedData[yearMonth] = {
                    date: yearMonth,
                    revenue: 0,
                    gross_profit: 0,
                    orders: 0,
                    cost: 0,
                    google_ads_cost: 0,
                    meta_spend: 0,
                    impressions: 0,
                    channel_sessions: {}
                };
            }

            // Aggregate the metrics
            groupedData[yearMonth].revenue += row.revenue || 0;
            groupedData[yearMonth].gross_profit += row.gross_profit || 0;
            groupedData[yearMonth].orders += row.orders || 0;
            groupedData[yearMonth].cost += row.cost || 0;
            groupedData[yearMonth].google_ads_cost += row.google_ads_cost || 0;
            groupedData[yearMonth].meta_spend += row.meta_spend || 0;
            groupedData[yearMonth].impressions += row.impressions || 0;

            // Aggregate channel sessions
            if (row.channel_sessions) {
                row.channel_sessions.forEach(({ channel_group, sessions }) => {
                    if (channel_group) {
                        groupedData[yearMonth].channel_sessions[channel_group] =
                            (groupedData[yearMonth].channel_sessions[channel_group] || 0) + (sessions || 0);
                    }
                });
            }
        });

        // Calculate derived metrics for each month
        Object.values(groupedData).forEach(month => {
            month.roas = month.cost > 0 ? month.revenue / month.cost : 0;
            month.poas = month.cost > 0 ? month.gross_profit / month.cost : 0;
            month.aov = month.orders > 0 ? month.revenue / month.orders : 0;
        });

        // Convert to array and sort by date
        return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
    };

    // Get monthly grouped data for YTD views
    const monthlyYTDData = useMemo(() => groupDataByMonth(getYTDData), [getYTDData]);
    const monthlyYTDComparisonData = useMemo(() => groupDataByMonth(getYTDComparisonData), [getYTDComparisonData]);

    // Function to format month labels
    const formatMonthLabel = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleString('default', { month: 'short' });
    };

    const aggregateMetrics = (data) => {
        const channelSessions = {};
        data.forEach((row) => {
            if (row.channel_sessions) {
                if (Array.isArray(row.channel_sessions)) {
                    row.channel_sessions.forEach(({ channel_group, sessions }) => {
                        if (channel_group) {
                            channelSessions[channel_group] = (channelSessions[channel_group] || 0) + (sessions || 0);
                        }
                    });
                } else {
                    // Handle case where channel_sessions is an object (for grouped data)
                    Object.entries(row.channel_sessions).forEach(([channel_group, sessions]) => {
                        channelSessions[channel_group] = (channelSessions[channel_group] || 0) + (sessions || 0);
                    });
                }
            }
        });

        return {
            revenue: data.reduce((sum, row) => sum + (row.revenue || 0), 0),
            gross_profit: data.reduce((sum, row) => sum + (row.gross_profit || 0), 0),
            orders: data.reduce((sum, row) => sum + (row.orders || 0), 0),
            cost: data.reduce((sum, row) => sum + (row.cost || 0), 0),
            roas: data.reduce((sum, row) => sum + (row.roas || 0), 0) / (data.length || 1),
            poas: data.reduce((sum, row) => sum + (row.poas || 0), 0) / (data.length || 1),
            aov: data.reduce((sum, row) => sum + (row.aov || 0), 0) / (data.length || 1),
            impressions: data.reduce((sum, row) => sum + (row.impressions || 0), 0),
            google_ads_cost: data.reduce((sum, row) => sum + (row.google_ads_cost || 0), 0),
            meta_spend: data.reduce((sum, row) => sum + (row.meta_spend || 0), 0),
            channel_sessions: channelSessions,
        };
    };

    // Get metrics based on the currently selected data
    const currentMetrics = aggregateMetrics(filteredData);
    const prevMetrics = aggregateMetrics(comparisonData);

    // Filter valid chart data
    const validChartData = filteredData.filter(
        (row) => row.date && !isNaN(new Date(row.date).getTime()) && row.revenue !== 0 && row.aov !== 0
    );

    if (isLoading && !initialLoadComplete) {
        return <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-searchmind)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading performance dashboard data...</p>
        </div>;
    }

    if (!data.length) {
        return <div className="flex justify-center items-center p-10">No data available for {customerId}</div>;
    }

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[#f8fafc] rounded-lg z-1"></div>
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black md:pr-16 xl:text-[44px] inline-grid z-10">Performance Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed. Commodo in viv...
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center mb-6 md:mb-10 md:justify-end">
                    <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
                        <select
                            value={comparison}
                            onChange={(e) => setComparison(e.target.value)}
                            className="border px-4 py-2 rounded text-sm bg-white w-full md:w-auto"
                        >
                            <option>Previous Year</option>
                            <option>Previous Period</option>
                        </select>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                            <span className="text-gray-400 hidden md:inline">→</span>
                            <span className="text-gray-400 md:hidden">to</span>
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <>
                    {/* Metrics Grid */}
                    <DashboardMetrics
                        currentMetrics={currentMetrics}
                        prevMetrics={prevMetrics}
                    />

                    {/* Charts */}
                    <DashboardCharts
                        revenueViewMode={revenueViewMode}
                        setRevenueViewMode={setRevenueViewMode}
                        spendViewMode={spendViewMode}
                        setSpendViewMode={setSpendViewMode}
                        aovViewMode={aovViewMode}
                        setAovViewMode={setAovViewMode}
                        sessionsViewMode={sessionsViewMode}
                        setSessionsViewMode={setSessionsViewMode}
                        monthlyYTDData={monthlyYTDData}
                        monthlyYTDComparisonData={monthlyYTDComparisonData}
                        validChartData={validChartData}
                        comparisonData={comparisonData}
                        currentMetrics={currentMetrics}
                        comparison={comparison}
                        formatMonthLabel={formatMonthLabel}
                        formatComparisonDate={formatComparisonDate}
                    />

                    {/* Service Dashboards */}
                    <ServiceDashboards />
                </>
            </div>
        </div>
    );
}