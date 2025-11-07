"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft, FaSearch } from "react-icons/fa";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import Subheading from "@/app/components/UI/Utility/Subheading";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);

export default function PPCDashboard({ customerId, customerName, initialData }) {
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
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));
    const [selectedMetric, setSelectedMetric] = useState("Ad Spend");
    const [cpcMetric, setCpcMetric] = useState("CPC");
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [expandedCampaigns, setExpandedCampaigns] = useState({});
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    const [campaignSearch, setCampaignSearch] = useState("");

    const { metrics_by_date, top_campaigns, campaigns_by_date } = initialData || {};

    const getComparisonDates = () => {
        try {
            const end = new Date(endDate);
            const start = new Date(startDate);

            if (isNaN(end.getTime()) || isNaN(start.getTime())) {
                console.warn('Invalid start or end date:', { start, end });
                return { compStart: '', compEnd: '' };
            }

            const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            if (comparison === "Previous Year") {
                const prevStart = new Date(start);
                const prevEnd = new Date(end);
                prevStart.setFullYear(prevStart.getFullYear() - 1);
                prevEnd.setFullYear(prevEnd.getFullYear() - 1);

                return {
                    compStart: formatDate(prevStart),
                    compEnd: formatDate(prevEnd),
                };
            } else {
                const prevStart = new Date(start);
                const prevEnd = new Date(end);
                prevStart.setDate(prevStart.getDate() - daysDiff);
                prevEnd.setDate(prevEnd.getDate() - daysDiff);

                return {
                    compStart: formatDate(prevStart),
                    compEnd: formatDate(prevEnd),
                };
            }
        } catch (error) {
            console.error('Error calculating comparison dates:', error);
            return { compStart: '', compEnd: '' };
        }
    };

    const { compStart, compEnd } = getComparisonDates();

    const filteredComparisonMetricsByDate = useMemo(() => {
        return metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
    }, [metrics_by_date, compStart, compEnd]);

    const filteredMetricsByDate = useMemo(() => {
        return metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [metrics_by_date, startDate, endDate]);

    const filteredCampaignsByDate = useMemo(() => {
        return campaigns_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [campaigns_by_date, startDate, endDate]);

    const allCampaigns = useMemo(() => {
        const campaignMap = filteredCampaignsByDate.reduce((acc, row) => {
            acc[row.campaign_name] = {
                clicks: (acc[row.campaign_name]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.campaign_name]?.impressions || 0) + (row.impressions || 0),
                ctr: row.impressions > 0 ? (acc[row.campaign_name]?.clicks || 0) / (acc[row.campaign_name]?.impressions || 1) : 0,
            };
            return acc;
        }, {});
        return Object.entries(campaignMap)
            .map(([campaign_name, data]) => ({
                campaign_name,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
            }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [filteredCampaignsByDate]);

    const getComparisonMetricValue = (currentDate, metricName) => {
        const currentStartDateTime = new Date(startDate).getTime();
        const currentDateTime = new Date(currentDate).getTime();
        const daysSinceStart = Math.floor((currentDateTime - currentStartDateTime) / (86400000));

        const compStartDateTime = new Date(compStart).getTime();
        const targetCompDateTime = new Date(compStartDateTime + (daysSinceStart * 86400000));
        const targetCompDate = formatDate(targetCompDateTime);

        const compData = filteredComparisonMetricsByDate.find(row => row.date === targetCompDate);

        if (!compData) return null;

        switch (metricName) {
            case "Conv. Value": return compData.conversions_value || 0;
            case "Ad Spend": return compData.ad_spend || 0;
            case "ROAS": return compData.roas || 0;
            case "AOV": return compData.aov || 0;
            case "Conversions": return compData.conversions || 0;
            case "Impressions": return compData.impressions || 0;
            case "Clicks": return compData.clicks || 0;
            case "CTR": return compData.ctr || 0;
            case "CPC": return compData.cpc || 0;
            case "Conv. Rate": return compData.conv_rate || 0;
            default: return 0;
        }
    };

    const metrics = useMemo(() => {
        return filteredMetricsByDate.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                conversions: acc.conversions + (row.conversions || 0),
                conversions_value: acc.conversions_value + (row.conversions_value || 0),
                ad_spend: acc.ad_spend + (row.ad_spend || 0),
                roas: row.ad_spend > 0 ? acc.conversions_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversions_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversions_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                conv_rate: 0,
            }
        );
    }, [filteredMetricsByDate]);

    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        return comparisonData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                conversions: acc.conversions + (row.conversions || 0),
                conversions_value: acc.conversions_value + (row.conversions_value || 0),
                ad_spend: acc.ad_spend + (row.ad_spend || 0),
                roas: row.ad_spend > 0 ? acc.conversions_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversions_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversions_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                conv_rate: 0,
            }
        );
    }, [metrics_by_date, compStart, compEnd]);

    const filteredTopCampaigns = useMemo(() => {
        return allCampaigns
            .filter(item =>
                campaignSearch ?
                    item.campaign_name.toLowerCase().includes(campaignSearch.toLowerCase()) :
                    true
            )
            .slice(0, campaignSearch ? undefined : 10);
    }, [allCampaigns, campaignSearch]);

    const selectedCampaigns = useMemo(() => {
        return filteredTopCampaigns.slice(0, 5).map(item => item.campaign_name);
    }, [filteredTopCampaigns]);

    const colors = {
        primary: "#1C398E",
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(2);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const ppcMetrics = [
        {
            label: "Conv. Value",
            value: metrics.conversions_value ? Math.round(metrics.conversions_value).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversions_value, comparisonMetrics.conversions_value),
            positive: metrics.conversions_value >= comparisonMetrics.conversions_value,
        },
        {
            label: "Ad Spend",
            value: metrics.ad_spend ? Math.round(metrics.ad_spend).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.ad_spend, comparisonMetrics.ad_spend),
            positive: metrics.ad_spend <= comparisonMetrics.ad_spend,
        },
        {
            label: "ROAS",
            value: metrics.roas ? metrics.roas.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.roas, comparisonMetrics.roas),
            positive: metrics.roas >= comparisonMetrics.roas,
        },
        {
            label: "AOV",
            value: metrics.aov ? Math.round(metrics.aov).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.aov, comparisonMetrics.aov),
            positive: metrics.aov >= comparisonMetrics.aov,
        },
        {
            label: "Conversions",
            value: metrics.conversions ? Math.round(metrics.conversions).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversions, comparisonMetrics.conversions),
            positive: metrics.conversions >= comparisonMetrics.conversions,
        },
        {
            label: "Impressions",
            value: metrics.impressions ? Math.round(metrics.impressions).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.impressions, comparisonMetrics.impressions),
            positive: metrics.impressions >= comparisonMetrics.impressions,
        },
        {
            label: "Clicks",
            value: metrics.clicks ? Math.round(metrics.clicks).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.clicks, comparisonMetrics.clicks),
            positive: metrics.clicks >= comparisonMetrics.clicks,
        },
        {
            label: "CTR",
            value: metrics.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics.ctr, comparisonMetrics.ctr),
            positive: metrics.ctr >= comparisonMetrics.ctr,
        },
        {
            label: "CPC",
            value: metrics.cpc ? metrics.cpc.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.cpc, comparisonMetrics.cpc),
            positive: metrics.cpc <= comparisonMetrics.cpc,
        },
        {
            label: "Conv. Rate",
            value: metrics.conv_rate ? `${(metrics.conv_rate * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics.conv_rate, comparisonMetrics.conv_rate),
            positive: metrics.conv_rate >= comparisonMetrics.conv_rate,
        },
    ];

    const metricsChartData = {
        labels: filteredMetricsByDate.map((row) => row.date) || [],
        datasets: [
            {
                label: selectedMetric,
                data: filteredMetricsByDate.map((row) => {
                    switch (selectedMetric) {
                        case "Conversions":
                            return row.conversions || 0;
                        case "Ad Spend":
                            return row.ad_spend || 0;
                        case "ROAS":
                            return row.roas || 0;
                        case "Conv. Value":
                            return row.conversions_value || 0;
                        case "AOV":
                            return row.aov || 0;
                        case "Impressions":
                            return row.impressions || 0;
                        case "Clicks":
                            return row.clicks || 0;
                        case "CTR":
                            return row.ctr || 0;
                        case "CPC":
                            return row.cpc || 0;
                        case "Conv. Rate":
                            return row.conv_rate || 0;
                        default:
                            return 0;
                    }
                }) || [],
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
            {
                label: `${selectedMetric} (${comparison})`,
                data: filteredMetricsByDate.map(row => getComparisonMetricValue(row.date, selectedMetric)),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            }
        ],
    };

    const cpcChartData = {
        labels: filteredMetricsByDate.map((row) => row.date) || [],
        datasets: [
            {
                label: cpcMetric,
                data: filteredMetricsByDate.map((row) => {
                    switch (cpcMetric) {
                        case "CPC":
                            return row.cpc || 0;
                        case "CTR":
                            return row.ctr || 0;
                        case "Conv. Rate":
                            return row.conv_rate || 0;
                        default:
                            return 0;
                    }
                }) || [],
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
            {
                label: `${cpcMetric} (${comparison})`,
                data: filteredMetricsByDate.map(row => getComparisonMetricValue(row.date, cpcMetric)),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            }
        ],
    };

    const campaignChartData = {
        labels: [...new Set(filteredCampaignsByDate.map((row) => row.date))].sort(),
        datasets: selectedCampaigns.map((campaign, i) => ({
            label: campaign,
            data: filteredCampaignsByDate
                .filter((row) => row.campaign_name === campaign && row.impressions > 0)
                .map((row) => ({
                    x: row.date,
                    y: selectedMetric === "Conversions" ? row.conv_rate || 0 :
                        selectedMetric === "Ad Spend" ? row.cpc || 0 :
                            row.ctr || 0
                })),
            borderColor: colors[`hue${i % 5}`] || colors.primary,
            backgroundColor: colors[`hue${i % 5}`] || colors.primary,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: false,
        })),
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                grid: { display: false },
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45
                },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: {
                    font: { size: 10 },
                    callback: (value) => value.toLocaleString('en-US')
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 12,
                    font: { size: 10 }
                }
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${typeof value === 'number' ? value.toLocaleString('en-US') : value}`;
                    }
                }
            },
        },
    };

    const chartComponents = [
        {
            title: selectedMetric,
            chart: <Line data={metricsChartData} options={chartOptions} />,
            selector: (
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="border px-2 py-1 rounded text-xs"
                >
                    <option>Conv. Value</option>
                    <option>Ad Spend</option>
                    <option>ROAS</option>
                    <option>AOV</option>
                    <option>Conversions</option>
                    <option>Impressions</option>
                    <option>Clicks</option>
                    <option>CTR</option>
                    <option>CPC</option>
                    <option>Conv. Rate</option>
                </select>
            )
        },
        {
            title: "Top Campaigns",
            chart: <Line data={campaignChartData} options={chartOptions} />,
            selector: null
        },
        {
            title: cpcMetric,
            chart: <Line data={cpcChartData} options={chartOptions} />,
            selector: (
                <select
                    value={cpcMetric}
                    onChange={(e) => setCpcMetric(e.target.value)}
                    className="border px-2 py-1 rounded text-xs"
                >
                    <option>CPC</option>
                    <option>CTR</option>
                    <option>Conv. Rate</option>
                </select>
            )
        }
    ];

    const navigateChart = (direction) => {
        if (direction === 'next') {
            setActiveChartIndex((prev) =>
                prev === chartComponents.length - 1 ? 0 : prev + 1
            );
        } else {
            setActiveChartIndex((prev) =>
                prev === 0 ? chartComponents.length - 1 : prev - 1
            );
        }
    };

    const toggleCampaignExpansion = (index) => {
        setExpandedCampaigns(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        setExpandedCampaigns({});
    }, [startDate, endDate]);

    if (!metrics_by_date || !top_campaigns || !campaigns_by_date) {
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
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Google Ads Dashboard</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Overview of key Google Ads metrics including conversions, ad spend, and campaign performance.
                    </p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-end">
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
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
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Metrics View */}
                <div className="md:hidden mb-6">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-px bg-[var(--color-natural)]">
                            {ppcMetrics.slice(0, showAllMetrics ? ppcMetrics.length : 4).map((item, i) => (
                                <div 
                                    key={i} 
                                    className={`p-4 transition-all duration-200 cursor-pointer ${
                                        selectedMetric === item.label 
                                            ? 'bg-[var(--color-primary-searchmind)]' 
                                            : 'bg-white hover:bg-[var(--color-natural)]'
                                    }`}
                                    onClick={() => setSelectedMetric(item.label)}
                                >
                                    <p className={`text-xs font-medium mb-1 ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-green)]'
                                    }`}>
                                        {item.label}
                                    </p>
                                    <p className={`text-xl font-bold ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-dark-green)]'
                                    }`}>
                                        {item.value}
                                    </p>
                                    {item.delta && (
                                        <h6 className={`text-xs font-semibold ${
                                            selectedMetric === item.label 
                                                ? (item.positive ? "text-green-200" : "text-red-200")
                                                : (item.positive ? "text-green-600" : "text-red-500")
                                        }`}>
                                            {item.delta}
                                        </h6>
                                    )}
                                </div>
                            ))}
                        </div>
                        {ppcMetrics.length > 4 && (
                            <button
                                onClick={() => setShowAllMetrics(!showAllMetrics)}
                                className="w-full py-2 text-sm text-[var(--color-lime)] border-t border-[var(--color-light-natural)] hover:text-[var(--color-green)] transition-colors font-medium"
                            >
                                {showAllMetrics ? "Show Less" : `Show ${ppcMetrics.length - 4} More Metrics`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Metrics Grid */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
                    {ppcMetrics.map((item, i) => (
                        <div 
                            key={i} 
                            className={`border rounded-lg shadow-sm p-6 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                selectedMetric === item.label 
                                    ? 'bg-[var(--color-primary-searchmind)] border-[var(--color-primary-searchmind)]' 
                                    : 'bg-white border-[var(--color-light-natural)] hover:border-[var(--color-green)]'
                            }`}
                            onClick={() => setSelectedMetric(item.label)}
                        >
                            <div className="flex flex-col">
                                <p className={`text-sm font-medium mb-2 ${
                                    selectedMetric === item.label 
                                        ? 'text-white-important' 
                                        : 'text-[var(--color-green)]'
                                }`}>
                                    {item.label}
                                </p>
                                <div className="flex items-baseline justify-between">
                                    <p className={`text-2xl md:text-3xl font-bold ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-dark-green)]'
                                    }`}>
                                        {item.value}
                                    </p>
                                    {item.delta && (
                                        <div className="flex flex-col items-end">
                                            <h6 className={`text-sm font-semibold ${
                                                selectedMetric === item.label 
                                                    ? (item.positive ? "text-green-200" : "text-red-200")
                                                    : (item.positive ? "text-green-600" : "text-red-500")
                                            }`}>
                                                {item.delta}
                                            </h6>
                                            <h6 className={`text-xs mt-1 ${
                                                selectedMetric === item.label 
                                                    ? 'text-white-important opacity-80' 
                                                    : 'text-[var(--color-green)]'
                                            }`}>
                                                vs prev period
                                            </h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-8">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4 h-[280px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</h3>
                            <div className="flex items-center gap-2">
                                {activeChartIndex === 0 && (
                                    <select
                                        value={selectedMetric}
                                        onChange={(e) => setSelectedMetric(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                    >
                                        <option>Conv. Value</option>
                                        <option>Ad Spend</option>
                                        <option>ROAS</option>
                                        <option>AOV</option>
                                        <option>Conversions</option>
                                        <option>Impressions</option>
                                        <option>Clicks</option>
                                        <option>CTR</option>
                                        <option>CPC</option>
                                        <option>Conv. Rate</option>
                                    </select>
                                )}
                                {activeChartIndex === 2 && (
                                    <select
                                        value={cpcMetric}
                                        onChange={(e) => setCpcMetric(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                    >
                                        <option>CPC</option>
                                        <option>CTR</option>
                                        <option>Conv. Rate</option>
                                    </select>
                                )}
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => navigateChart('prev')}
                                        className="text-sm bg-[var(--color-natural)] text-[var(--color-dark-green)] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[var(--color-light-natural)] transition-colors"
                                    >
                                        <FaChevronLeft size={12} />
                                    </button>
                                    <button
                                        onClick={() => navigateChart('next')}
                                        className="text-sm bg-[var(--color-natural)] text-[var(--color-dark-green)] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[var(--color-light-natural)] transition-colors"
                                    >
                                        <FaChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[210px]">
                            {chartComponents[activeChartIndex].chart}
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 gap-1">
                        {chartComponents.map((_, index) => (
                            <span
                                key={index}
                                className={`block w-2 h-2 rounded-full transition-colors ${index === activeChartIndex ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-light-natural)]'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Charts - First Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">{selectedMetric}</h3>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        >
                            <option>Conv. Value</option>
                            <option>Ad Spend</option>
                            <option>ROAS</option>
                            <option>AOV</option>
                            <option>Conversions</option>
                            <option>Impressions</option>
                            <option>Clicks</option>
                            <option>CTR</option>
                            <option>CPC</option>
                            <option>Conv. Rate</option>
                        </select>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={metricsChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Desktop Campaigns Table and Chart */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={campaignSearch}
                                    onChange={(e) => setCampaignSearch(e.target.value)}
                                    className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm pr-8 w-48 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                />
                                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[var(--color-natural)] border-b text-[var(--color-dark-green)] text-left sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Campaign Name</th>
                                        <th className="px-4 py-3 font-semibold">Clicks</th>
                                        <th className="px-4 py-3 font-semibold">Impr</th>
                                        <th className="px-4 py-3 font-semibold">CTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopCampaigns.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)] transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-[var(--color-dark-green)] font-medium">{row.campaign_name}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{(row.ctr * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Campaigns Over Time</h3>
                            <select
                                className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                            >
                                <option>Conv. Value</option>
                                <option>Ad Spend</option>
                                <option>ROAS</option>
                                <option>AOV</option>
                                <option>Conversions</option>
                                <option>Impressions</option>
                                <option>Clicks</option>
                                <option>CTR</option>
                                <option>CPC</option>
                                <option>Conv. Rate</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px] max-h-[500px] overflow-y-auto">
                            <Line data={campaignChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Mobile Campaigns Section */}
                <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                        <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                    </div>
                    <div className="p-4 border-b border-[var(--color-light-natural)]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={campaignSearch}
                                onChange={(e) => setCampaignSearch(e.target.value)}
                                className="border border-[var(--color-dark-natural)] w-full px-3 py-2 rounded-lg text-sm pr-8 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                        </div>
                    </div>
                    <div className="p-1">
                        {filteredTopCampaigns.map((row, i) => (
                            <div key={i} className="border-b border-[var(--color-light-natural)] last:border-b-0">
                                <div
                                    className="p-3 flex justify-between items-center hover:bg-[var(--color-natural)] transition-colors cursor-pointer"
                                    onClick={() => toggleCampaignExpansion(i)}
                                >
                                    <div className="truncate pr-2 w-4/5">
                                        <span className="font-medium text-xs text-[var(--color-dark-green)]">{row.campaign_name}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-[var(--color-green)] transition-transform ${expandedCampaigns[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedCampaigns[i] && (
                                    <div className="px-4 pb-3 grid grid-cols-3 gap-1 text-xs bg-[var(--color-natural)]">
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Clicks</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Impressions</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">CTR</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{(row.ctr * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop CPC Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">{cpcMetric}</h3>
                        <select
                            value={cpcMetric}
                            onChange={(e) => setCpcMetric(e.target.value)}
                            className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        >
                            <option>CPC</option>
                            <option>CTR</option>
                            <option>Conv. Rate</option>
                        </select>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={cpcChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}