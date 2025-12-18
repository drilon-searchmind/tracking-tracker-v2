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

import DashboardMetrics from "./components/DashboardMetrics";
import DashboardCharts from "./components/DashboardCharts";
import CustomerSegmentationCharts from "./components/CustomerSegmentationCharts";
import ServiceDashboards from "./components/ServiceDashboards";
import Subheading from "@/app/components/UI/Utility/Subheading";
import CustomerAssignedUsers from "@/app/components/CampaignPlanner/CustomerAssignedUsers";
import currencyExchangeData from "@/lib/static-data/currencyApiValues.json";

// Currency conversion utility
const convertCurrency = (amount, fromCurrency, toCurrency = "DKK") => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    const exchangeData = currencyExchangeData.data;
    
    if (!exchangeData[fromCurrency] || !exchangeData[toCurrency]) {
        console.warn(`Currency conversion failed: ${fromCurrency} to ${toCurrency}`);
        return amount;
    }
    
    // Convert from source currency to USD, then to target currency
    const amountInUSD = amount / exchangeData[fromCurrency].value;
    const convertedAmount = amountInUSD * exchangeData[toCurrency].value;
    
    return convertedAmount;
};

// Apply currency conversion to a data row
const convertDataRow = (row, fromCurrency, shouldConvertCurrency) => {
    if (fromCurrency === "DKK" || !shouldConvertCurrency) return row;
    
    const revenueFields = ['revenue', 'gross_profit'];
    const convertedRow = { ...row };
    
    revenueFields.forEach(field => {
        if (convertedRow[field] !== undefined && convertedRow[field] !== null) {
            convertedRow[field] = convertCurrency(convertedRow[field], fromCurrency);
        }
    });
    
    // Recalculate ROAS and POAS using converted revenue values
    const totalCost = convertedRow.cost || 0;
    convertedRow.roas = totalCost > 0 ? convertedRow.revenue / totalCost : 0;
    convertedRow.poas = totalCost > 0 ? convertedRow.gross_profit / totalCost : 0;
    convertedRow.aov = (convertedRow.orders || 0) > 0 ? convertedRow.revenue / convertedRow.orders : 0;
    
    return convertedRow;
};

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

export default function PerformanceDashboard({ customerId, customerName, customerValutaCode, initialData, customerRevenueType }) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            console.warn('Invalid date encountered:', date);
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [comparison, setComparison] = useState("Previous Period");
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [tempDateStart, setTempDateStart] = useState(formatDate(firstDayOfMonth));
    const [tempDateEnd, setTempDateEnd] = useState(formatDate(yesterday));
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [changeCurrency, setChangeCurrency] = useState(true);
    const [fetchedData, setFetchedData] = useState(initialData);

    const [revenueViewMode, setRevenueViewMode] = useState("Period");
    const [spendViewMode, setSpendViewMode] = useState("Period");
    const [aovViewMode, setAovViewMode] = useState("Period");
    const [sessionsViewMode, setSessionsViewMode] = useState("Period");

    // Period granularity states (for when viewMode is "Period")
    const [revenuePeriodGranularity, setRevenuePeriodGranularity] = useState("Daily");
    const [spendPeriodGranularity, setSpendPeriodGranularity] = useState("Daily");
    const [aovPeriodGranularity, setAovPeriodGranularity] = useState("Daily");
    const [sessionsPeriodGranularity, setSessionsPeriodGranularity] = useState("Daily");

    useEffect(() => {
        const fetchCustomerSettings = async () => {
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChangeCurrency(data.changeCurrency ?? true);
                }
            } catch (error) {
                console.error("Error fetching customer settings:", error);
            }
        }

        fetchCustomerSettings()
    }, [customerId]);

    const data = useMemo(() => {
        return Array.isArray(fetchedData)
            ? fetchedData.map(row => {
                  const convertedRow = convertDataRow(row, customerValutaCode, changeCurrency);
                  return {
                      ...convertedRow,
                      revenue: customerRevenueType === "net_sales" ? convertedRow.net_sales : convertedRow.revenue,
                  };
              })
            : [];
    }, [fetchedData, customerValutaCode, changeCurrency, customerRevenueType]);

    useEffect(() => {
        if (initialData) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setInitialLoadComplete(true);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [initialData]);

    // Function to fetch data for current period and comparison period
    const fetchPerformanceData = async (start, end, compStart, compEnd) => {
        setIsFetchingData(true);
        try {
            console.log(`Fetching data: Current (${start} to ${end}), Comparison (${compStart} to ${compEnd})`);
            
            // Calculate the full date range needed (current + comparison)
            const allDates = [start, end, compStart, compEnd].sort();
            const earliestDate = allDates[0];
            const latestDate = allDates[allDates.length - 1];

            const response = await fetch(
                `/api/performance-dashboard/${customerId}?startDate=${earliestDate}&endDate=${latestDate}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const result = await response.json();
            setFetchedData(result.data || []);
            console.log(`Successfully fetched ${result.data?.length || 0} days of data`);
        } catch (error) {
            console.error("Error fetching performance data:", error);
            setFetchedData([]);
        } finally {
            setIsFetchingData(false);
        }
    };

    // Handle Apply button click
    const handleApplyDates = () => {
        setDateStart(tempDateStart);
        setDateEnd(tempDateEnd);
        
        // Calculate comparison dates
        const end = new Date(tempDateEnd);
        const start = new Date(tempDateStart);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        let compStart, compEnd;
        if (comparison === "Previous Year") {
            const compStartDate = new Date(start);
            compStartDate.setFullYear(compStartDate.getFullYear() - 1);
            const compEndDate = new Date(end);
            compEndDate.setFullYear(compEndDate.getFullYear() - 1);
            compStart = formatDate(compStartDate);
            compEnd = formatDate(compEndDate);
        } else {
            const compStartDate = new Date(start);
            compStartDate.setDate(compStartDate.getDate() - daysDiff - 1);
            const compEndDate = new Date(end);
            compEndDate.setDate(compEndDate.getDate() - daysDiff - 1);
            compStart = formatDate(compStartDate);
            compEnd = formatDate(compEndDate);
        }

        // Fetch data for both periods
        fetchPerformanceData(tempDateStart, tempDateEnd, compStart, compEnd);
    };

    // Initial load - fetch data for current period and previous period
    useEffect(() => {
        if (initialData && !initialLoadComplete) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setInitialLoadComplete(true);
                
                // Don't fetch data automatically - we already have initialData from server
                // Only fetch when user clicks Apply or changes comparison period
                console.log("Initial data loaded from server, skipping automatic fetch");
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [initialData, initialLoadComplete]);

    useEffect(() => {
        const fetchCustomerSettings = async () => {
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data?.data?.convertCurrency !== undefined) {
                        setChangeCurrency(data.data.convertCurrency);
                    }
                }
            } catch (error) {
                console.error("Error fetching customer settings:", error);
            }
        }

        fetchCustomerSettings()
    }, [customerId]);

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

    const filteredData = useMemo(() => {
        return data.filter((row) => row.date >= dateStart && row.date <= dateEnd);
    }, [data, dateStart, dateEnd]);

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

    const comparisonData = useMemo(() => {
        return data.filter((row) => row.date >= compStart && row.date <= compEnd);
    }, [data, compStart, compEnd]);

    const getYTDData = useMemo(() => {
        const currentYear = new Date(dateEnd).getFullYear();
        const startOfYear = `${currentYear}-01-01`;

        return data.filter((row) => {
            const rowDate = new Date(row.date);
            return rowDate >= new Date(startOfYear) && rowDate <= new Date(dateEnd);
        });
    }, [data, dateEnd]);

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

    const groupDataByMonth = (dataArray) => {
        const groupedData = {};

        dataArray.forEach(row => {
            const date = new Date(row.date);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

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

            // Use the already converted values from the data array (converted by convertDataRow)
            groupedData[yearMonth].revenue += row.revenue || 0;
            groupedData[yearMonth].gross_profit += row.gross_profit || 0;
            groupedData[yearMonth].orders += row.orders || 0;
            groupedData[yearMonth].cost += row.cost || 0;
            groupedData[yearMonth].google_ads_cost += row.google_ads_cost || 0;
            groupedData[yearMonth].meta_spend += row.meta_spend || 0;
            groupedData[yearMonth].impressions += row.impressions || 0;

            if (row.channel_sessions) {
                row.channel_sessions.forEach(({ channel_group, sessions }) => {
                    if (channel_group) {
                        groupedData[yearMonth].channel_sessions[channel_group] =
                            (groupedData[yearMonth].channel_sessions[channel_group] || 0) + (sessions || 0);
                    }
                });
            }
        });

        Object.values(groupedData).forEach(month => {
            month.roas = month.cost > 0 ? month.revenue / month.cost : 0;
            month.poas = month.cost > 0 ? month.gross_profit / month.cost : 0;
            month.aov = month.orders > 0 ? month.revenue / month.orders : 0;
        });

        return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
    };

    const monthlyYTDData = useMemo(() => groupDataByMonth(getYTDData), [getYTDData]);
    const monthlyYTDComparisonData = useMemo(() => groupDataByMonth(getYTDComparisonData), [getYTDComparisonData]);

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

    const currentMetrics = aggregateMetrics(filteredData);
    const prevMetrics = aggregateMetrics(comparisonData);

    // Debug logging
    console.log("=== Performance Dashboard Debug ===");
    console.log("Date Range:", dateStart, "to", dateEnd);
    console.log("Comparison Range:", compStart, "to", compEnd);
    console.log("Total data rows:", data.length);
    console.log("Filtered data rows:", filteredData.length);
    console.log("Comparison data rows:", comparisonData.length);
    console.log("Current Metrics:", currentMetrics);
    console.log("Prev Metrics:", prevMetrics);
    console.log("Sample filtered data:", filteredData.slice(0, 3));

    const validChartData = filteredData.filter(
        (row) => row.date && !isNaN(new Date(row.date).getTime()) && row.revenue !== 0 && row.aov !== 0
    );

    if (isLoading && !initialLoadComplete) {
        return (
            <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
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
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                        <p className="mt-4 text-[var(--color-dark-green)]">Loading performance dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
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
                    <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-sm border border-[var(--color-natural)]">
                        <p className="text-[var(--color-dark-green)] text-lg">No data available for {customerId}</p>
                    </div>
                </div>
            </div>
        );
    }

    const tableHeader = customerRevenueType === "net_sales" ? "Net Sales" : "Revenue";

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
            {/* Loading Overlay - positioned at top level */}
            {isFetchingData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4 border-2 border-[var(--color-lime)]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--color-lime)]"></div>
                        <p className="text-[var(--color-dark-green)] font-medium">Loading performance data...</p>
                    </div>
                </div>
            )}
            
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
                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                        <div className="flex-1">
                            <Subheading headingText={customerName} />
                            <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Performance Dashboard</h1>
                            <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                                Comprehensive performance analytics and insights for your marketing campaigns and business metrics across all channels.
                            </p>
                        </div>
                        
                        <div className="lg:w-80 xl:w-96 mt-6 lg:mt-0">
                            <div className="bg-white rounded-lg shadow-sm border border-[var(--color-light-natural)] p-4">
                                <CustomerAssignedUsers customerId={customerId} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-end">
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3 ">
                            <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Comparison:</label>
                            <select
                                value={comparison}
                                onChange={(e) => setComparison(e.target.value)}
                                className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent w-full md:w-auto transition-colors"
                            >
                                <option>Previous Year</option>
                                <option>Previous Period</option>
                            </select>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Date Range:</label>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                    <input
                                        type="date"
                                        value={tempDateStart}
                                        onChange={(e) => setTempDateStart(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={tempDateEnd}
                                        onChange={(e) => setTempDateEnd(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleApplyDates}
                                disabled={isFetchingData}
                                className="bg-[var(--color-lime)] hover:bg-[var(--color-lime-dark)] text-[var(--color-dark-green)] font-medium px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                            >
                                {isFetchingData ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : 'Apply'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <>
                    {/* Metrics Grid */}
                    <DashboardMetrics
                        currentMetrics={currentMetrics}
                        prevMetrics={prevMetrics}
                        customerId={customerId}
                        tableHeader={tableHeader}
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
                        revenuePeriodGranularity={revenuePeriodGranularity}
                        setRevenuePeriodGranularity={setRevenuePeriodGranularity}
                        spendPeriodGranularity={spendPeriodGranularity}
                        setSpendPeriodGranularity={setSpendPeriodGranularity}
                        aovPeriodGranularity={aovPeriodGranularity}
                        setAovPeriodGranularity={setAovPeriodGranularity}
                        sessionsPeriodGranularity={sessionsPeriodGranularity}
                        setSessionsPeriodGranularity={setSessionsPeriodGranularity}
                        monthlyYTDData={monthlyYTDData}
                        monthlyYTDComparisonData={monthlyYTDComparisonData}
                        validChartData={validChartData}
                        comparisonData={comparisonData}
                        currentMetrics={currentMetrics}
                        comparison={comparison}
                        formatMonthLabel={formatMonthLabel}
                        formatComparisonDate={formatComparisonDate}
                        tableHeader={tableHeader}
                    />

                    {/* TODO: Re-enable after migrating to native APIs */}

                    {/* Customer Segmentation Charts */}
                    {/* Temporarily disabled - needs migration to native APIs */}
                    {/* <CustomerSegmentationCharts 
                        customerId={customerId}
                        customerType="Shopify" // This could be dynamic based on customer data
                        dateStart={dateStart}
                        dateEnd={dateEnd}
                        compStart={compStart}
                        compEnd={compEnd}
                        comparison={comparison}
                    /> */}

                    {/* Service Dashboards */}
                    {/* <ServiceDashboards /> */}
                </>
            </div>
        </div>
    );
}