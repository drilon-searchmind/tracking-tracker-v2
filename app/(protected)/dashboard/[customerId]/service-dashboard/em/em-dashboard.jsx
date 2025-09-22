"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
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

export default function EmailDashboard({ customerId, initialData, customerName, emailType }) {
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
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));
    const [selectedMetric, setSelectedMetric] = useState("Conversions");
    const [emailTypeName, setEmailTypeName] = useState("");

    const { metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance } = initialData || {};

    // Filter data based on date range
    const filteredMetricsByDate = useMemo(() => {
        return metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [metrics_by_date, startDate, endDate]);

    const filteredCampaignsByDate = useMemo(() => {
        return campaigns_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [campaigns_by_date, startDate, endDate]);

    const filteredCampaignPerformance = useMemo(() => {
        return campaign_performance?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [campaign_performance, startDate, endDate]);

    // Calculate metrics for current period
    const metrics = useMemo(() => {
        if (emailType === "klaviyo") {
            return filteredMetricsByDate.reduce(
                (acc, row) => ({
                    clicks: acc.clicks + (row.clicks || 0),
                    impressions: acc.impressions + (row.impressions || 0),
                    opens: acc.opens + (row.opens || 0),
                    bounces: acc.bounces + (row.bounces || 0),
                    unsubscribes: acc.unsubscribes + (row.unsubscribes || 0),
                    conversions: acc.conversions + (row.conversions || 0),
                    conversion_value: acc.conversion_value + (row.conversion_value || 0),
                    cost: acc.cost + (row.cost || 0),
                    ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                    open_rate: row.impressions > 0 ? acc.opens / acc.impressions : 0,
                    conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
                    cpc: acc.clicks > 0 ? acc.cost / acc.clicks : 0,
                }),
                {
                    clicks: 0,
                    impressions: 0,
                    opens: 0,
                    bounces: 0,
                    unsubscribes: 0,
                    conversions: 0,
                    conversion_value: 0,
                    cost: 0,
                    ctr: 0,
                    open_rate: 0,
                    conv_rate: 0,
                    cpc: 0,
                }
            );
        } else {
            // Original ActiveCampaign metrics calculation
            return filteredMetricsByDate.reduce(
                (acc, row) => ({
                    clicks: acc.clicks + (row.clicks || 0),
                    impressions: acc.impressions + (row.impressions || 0),
                    conversions: acc.conversions + (row.conversions || 0),
                    conversion_value: acc.conversion_value + (row.conversion_value || 0),
                    cost: acc.cost + (row.cost || 0),
                    ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                    conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
                    cpc: acc.clicks > 0 ? acc.cost / acc.clicks : 0,
                }),
                {
                    clicks: 0,
                    impressions: 0,
                    conversions: 0,
                    conversion_value: 0,
                    cost: 0,
                    ctr: 0,
                    conv_rate: 0,
                    cpc: 0,
                }
            );
        }
    }, [filteredMetricsByDate, emailType]);

    // Calculate comparison dates
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

    // Calculate metrics for comparison period
    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];

        if (emailType === "klaviyo") {
            return comparisonData.reduce(
                (acc, row) => ({
                    clicks: acc.clicks + (row.clicks || 0),
                    impressions: acc.impressions + (row.impressions || 0),
                    opens: acc.opens + (row.opens || 0),
                    bounces: acc.bounces + (row.bounces || 0),
                    unsubscribes: acc.unsubscribes + (row.unsubscribes || 0),
                    conversions: acc.conversions + (row.conversions || 0),
                    conversion_value: acc.conversion_value + (row.conversion_value || 0),
                    cost: acc.cost + (row.cost || 0),
                    ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                    open_rate: row.impressions > 0 ? acc.opens / acc.impressions : 0,
                    conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
                    cpc: acc.clicks > 0 ? acc.cost / acc.clicks : 0,
                }),
                {
                    clicks: 0,
                    impressions: 0,
                    opens: 0,
                    bounces: 0,
                    unsubscribes: 0,
                    conversions: 0,
                    conversion_value: 0,
                    cost: 0,
                    ctr: 0,
                    open_rate: 0,
                    conv_rate: 0,
                    cpc: 0,
                }
            );
        } else {
            // Original ActiveCampaign metrics calculation
            return comparisonData.reduce(
                (acc, row) => ({
                    // existing code...
                    clicks: acc.clicks + (row.clicks || 0),
                    impressions: acc.impressions + (row.impressions || 0),
                    conversions: acc.conversions + (row.conversions || 0),
                    conversion_value: acc.conversion_value + (row.conversion_value || 0),
                    cost: acc.cost + (row.cost || 0),
                    ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                    conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
                    cpc: acc.clicks > 0 ? acc.cost / acc.clicks : 0,
                }),
                {
                    clicks: 0,
                    impressions: 0,
                    conversions: 0,
                    conversion_value: 0,
                    cost: 0,
                    ctr: 0,
                    conv_rate: 0,
                    cpc: 0,
                }
            );
        }
    }, [metrics_by_date, compStart, compEnd, emailType]);


    // Calculate filtered top_campaigns
    const filteredTopCampaigns = useMemo(() => {
        const campaignMap = filteredCampaignsByDate.reduce((acc, row) => {
            acc[row.campaign_name] = {
                clicks: (acc[row.campaign_name]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.campaign_name]?.impressions || 0) + (row.impressions || 0),
                ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
            };
            return acc;
        }, {});
        return Object.entries(campaignMap)
            .map(([campaign_name, data]) => ({
                campaign_name,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.ctr,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);
    }, [filteredCampaignsByDate]);

    const selectedCampaigns = filteredTopCampaigns.map((item) => item.campaign_name);

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

    const emailMetrics = useMemo(() => {
        if (emailType === "klaviyo") {
            return [
                {
                    label: "Total Emails Sent",
                    value: metrics.impressions ? Math.round(metrics.impressions).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.impressions, comparisonMetrics.impressions),
                    positive: metrics.impressions >= comparisonMetrics.impressions,
                },
                {
                    label: "Total Opens",
                    value: metrics.opens ? Math.round(metrics.opens).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.opens, comparisonMetrics.opens),
                    positive: metrics.opens >= comparisonMetrics.opens,
                },
                {
                    label: "Open Rate",
                    value: metrics.open_rate ? `${(metrics.open_rate * 100).toFixed(2)}%` : "0.00%",
                    delta: calculateDelta(metrics.open_rate, comparisonMetrics.open_rate),
                    positive: metrics.open_rate >= comparisonMetrics.open_rate,
                },
                {
                    label: "Total Clicks",
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
                    label: "Bounces",
                    value: metrics.bounces ? Math.round(metrics.bounces).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.bounces, comparisonMetrics.bounces),
                    positive: metrics.bounces <= comparisonMetrics.bounces,
                },
                {
                    label: "Unsubscribes",
                    value: metrics.unsubscribes ? Math.round(metrics.unsubscribes).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.unsubscribes, comparisonMetrics.unsubscribes),
                    positive: metrics.unsubscribes <= comparisonMetrics.unsubscribes,
                },
                {
                    label: "Revenue",
                    value: metrics.conversion_value ? Math.round(metrics.conversion_value).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.conversion_value, comparisonMetrics.conversion_value),
                    positive: metrics.conversion_value >= comparisonMetrics.conversion_value,
                },
            ];
        } else {
            // Original ActiveCampaign metrics
            return [
                {
                    label: "Total Emails Sent",
                    value: metrics.impressions ? Math.round(metrics.impressions).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.impressions, comparisonMetrics.impressions),
                    positive: metrics.impressions >= comparisonMetrics.impressions,
                },
                // ... rest of your existing ActiveCampaign metrics
                {
                    label: "Total Clicks",
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
                    label: "Conversions",
                    value: metrics.conversions ? Math.round(metrics.conversions).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.conversions, comparisonMetrics.conversions),
                    positive: metrics.conversions >= comparisonMetrics.conversions,
                },
                {
                    label: "Conversion Rate",
                    value: metrics.conv_rate ? `${(metrics.conv_rate * 100).toFixed(2)}%` : "0.00%",
                    delta: calculateDelta(metrics.conv_rate, comparisonMetrics.conv_rate),
                    positive: metrics.conv_rate >= comparisonMetrics.conv_rate,
                },
                {
                    label: "Conversion Value",
                    value: metrics.conversion_value ? Math.round(metrics.conversion_value).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.conversion_value, comparisonMetrics.conversion_value),
                    positive: metrics.conversion_value >= comparisonMetrics.conversion_value,
                },
                {
                    label: "Cost",
                    value: metrics.cost ? Math.round(metrics.cost).toLocaleString('en-US') : "0",
                    delta: calculateDelta(metrics.cost, comparisonMetrics.cost),
                    positive: metrics.cost <= comparisonMetrics.cost,
                },
                {
                    label: "CPC",
                    value: metrics.cpc ? metrics.cpc.toFixed(2) : "0.00",
                    delta: calculateDelta(metrics.cpc, comparisonMetrics.cpc),
                    positive: metrics.cpc <= comparisonMetrics.cpc,
                },
            ];
        }
    }, [metrics, comparisonMetrics, emailType, calculateDelta]);

    // Update metricsChartData to conditionally include Klaviyo-specific metrics
    const metricsChartData = useMemo(() => {
        const metricOptions = emailType === "klaviyo"
            ? ["Opens", "Open Rate", "Clicks", "CTR", "Bounces", "Unsubscribes", "Revenue"]
            : ["Conversions", "Conversion Value", "Clicks", "CTR"];

        if (emailType === "klaviyo" && !metricOptions.includes(selectedMetric)) {
            setSelectedMetric("Opens");
        }

        return {
            labels: filteredMetricsByDate.map((row) => row.date) || [],
            datasets: [
                {
                    label: selectedMetric,
                    data: filteredMetricsByDate.map((row) => {
                        switch (selectedMetric) {
                            case "Opens":
                                return emailType === "klaviyo" ? row.opens || 0 : 0;
                            case "Open Rate":
                                return emailType === "klaviyo" ? row.open_rate || 0 : 0;
                            case "Bounces":
                                return emailType === "klaviyo" ? row.bounces || 0 : 0;
                            case "Unsubscribes":
                                return emailType === "klaviyo" ? row.unsubscribes || 0 : 0;
                            case "Revenue":
                                return row.conversion_value || 0;
                            case "Conversions":
                                return row.conversions || 0;
                            case "Conversion Value":
                                return row.conversion_value || 0;
                            case "Clicks":
                                return row.clicks || 0;
                            case "CTR":
                                return row.ctr || 0;
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
            ],
        };
    }, [filteredMetricsByDate, selectedMetric, emailType, colors.primary]);

    const campaignChartData = useMemo(() => {
        return {
            labels: [...new Set(filteredCampaignsByDate.map((row) => row.date))].sort(),
            datasets: selectedCampaigns.map((campaign, i) => ({
                label: campaign,
                data: filteredCampaignsByDate
                    .filter((row) => row.campaign_name === campaign && row.impressions > 0)
                    .map((row) => ({
                        x: row.date,
                        y: emailType === "klaviyo"
                            ? (selectedMetric === "Opens" ? row.opens || 0 :
                                selectedMetric === "Open Rate" ? row.open_rate || 0 :
                                    selectedMetric === "Clicks" ? row.clicks || 0 :
                                        selectedMetric === "CTR" ? row.ctr || 0 : 0)
                            : (selectedMetric === "Conversions" ? row.conv_rate || 0 :
                                selectedMetric === "Conversion Value" ? row.cpc || 0 :
                                    selectedMetric === "Clicks" ? row.clicks || 0 :
                                        row.ctr || 0)
                    })),
                borderColor: colors[`hue${i % 5}`] || colors.primary,
                backgroundColor: colors[`hue${i % 5}`] || colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            })),
        };
    }, [filteredCampaignsByDate, selectedCampaigns, selectedMetric, emailType, colors]);


    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                grid: { display: false },
                ticks: { font: { size: 10 } },
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
            legend: { display: false },
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

    useEffect(() => {
        if (emailType) {
            const formattedName = emailType
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            setEmailTypeName(formattedName);
        } else {
            setEmailTypeName("");
        }
    }, [emailType]);

    if (!metrics_by_date || !top_campaigns || !campaigns_by_date || !campaign_performance) {
        return <div>No data available for {customerId}</div>;
    }

    return (
        <div className="py-20 px-0 relative overflow">
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

            <div className="px-20 mx-auto z-10 relative">
                <div className="mb-8">
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">EM ({emailTypeName}) Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of key email marketing metrics including clicks, conversions, and campaign performance.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 items-center mb-10 justify-end">
                    <select
                        value={comparison}
                        onChange={(e) => setComparison(e.target.value)}
                        className="border px-4 py-2 rounded text-sm bg-white"
                    >
                        <option>Previous Year</option>
                        <option>Previous Period</option>
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                    {emailMetrics.map((item, i) => (
                        <div key={i} className="bg-white border border-zinc-200 rounded p-4">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-2xl font-bold text-zinc-800">{item.value}</p>
                            {item.delta && (
                                <p className={`text-sm font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                    {item.delta}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-10 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">{selectedMetric}</p>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            {emailType === "klaviyo" ? (
                                <>
                                    <option>Opens</option>
                                    <option>Open Rate</option>
                                    <option>Clicks</option>
                                    <option>CTR</option>
                                    <option>Bounces</option>
                                    <option>Unsubscribes</option>
                                    <option>Revenue</option>
                                </>
                            ) : (
                                <>
                                    <option>Conversions</option>
                                    <option>Conversion Value</option>
                                    <option>Clicks</option>
                                    <option>CTR</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={metricsChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-8 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Top Performance Campaigns</p>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">Campaign Name</th>
                                    <th className="px-4 py-2">Clicks</th>
                                    <th className="px-4 py-2">Impr</th>
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Opens</th>}
                                    <th className="px-4 py-2">CTR</th>
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Open Rate</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTopCampaigns.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{row.campaign_name}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{Math.round(row.opens).toLocaleString('en-US')}</td>
                                        )}
                                        <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{(row.open_rate * 100).toFixed(2)}%</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6">
                        <p className="font-semibold mb-4">Top Campaigns Impressions Over Time</p>
                        <div className="w-full h-[300px]">
                            <Line data={campaignChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Campaign Performance by Date (Top 30)</p>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Campaign Name</th>
                                    <th className="px-4 py-2">Emails Sent</th>
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Opens</th>}
                                    <th className="px-4 py-2">Clicks</th>
                                    <th className="px-4 py-2">CTR</th>
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Open Rate</th>}
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Bounces</th>}
                                    {emailType === "klaviyo" && <th className="px-4 py-2">Unsubs</th>}
                                    <th className="px-4 py-2">Conversions</th>
                                    <th className="px-4 py-2">{emailType === "klaviyo" ? "Revenue" : "Conv. Value"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCampaignPerformance.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{row.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{row.campaign_name}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{Math.round(row.opens).toLocaleString('en-US')}</td>
                                        )}
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{(row.open_rate * 100).toFixed(2)}%</td>
                                        )}
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{Math.round(row.bounces).toLocaleString('en-US')}</td>
                                        )}
                                        {emailType === "klaviyo" && (
                                            <td className="px-4 py-2">{Math.round(row.unsubscribes).toLocaleString('en-US')}</td>
                                        )}
                                        <td className="px-4 py-2">{Math.round(row.conversions).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-2">{Math.round(row.conversion_value).toLocaleString('en-US')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}