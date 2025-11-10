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
import ServiceDashboards from "./components/ServiceDashboards";
import Subheading from "@/app/components/UI/Utility/Subheading";
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
const convertDataRow = (row, fromCurrency) => {
    if (fromCurrency === "DKK") return row;
    
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

export default function PerformanceDashboard({ customerId, customerName, customerValutaCode, initialData }) {
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

    const [revenueViewMode, setRevenueViewMode] = useState("YTD");
    const [spendViewMode, setSpendViewMode] = useState("YTD");
    const [aovViewMode, setAovViewMode] = useState("YTD");
    const [sessionsViewMode, setSessionsViewMode] = useState("YTD");

    const data = Array.isArray(initialData) ? initialData.map(row => convertDataRow(row, customerValutaCode)) : [];

    useEffect(() => {
        if (initialData) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setInitialLoadComplete(true);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [initialData]);

    useEffect(() => {
        if (initialLoadComplete) {
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
                <div className="mb-6 md:mb-8">
                    <Subheading headingText={customerName} />
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Performance Dashboard</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Comprehensive performance analytics and insights for your marketing campaigns and business metrics across all channels.
                    </p>
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
                                        value={dateStart}
                                        onChange={(e) => setDateStart(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={dateEnd}
                                        onChange={(e) => setDateEnd(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
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