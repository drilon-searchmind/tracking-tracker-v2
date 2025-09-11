"use client";

import { useState, useMemo } from "react";
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

export default function PSDashboard({ customerId, customerName, initialData }) {
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
    const [cpcMetric, setCpcMetric] = useState("CPC");

    const { metrics_by_date, top_campaigns, campaigns_by_date } = initialData || {};

    const filteredMetricsByDate = useMemo(() => {
        const filtered = metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
        console.log("Filtered Metrics By Date:", filtered);
        return filtered;
    }, [metrics_by_date, startDate, endDate]);

    const filteredCampaignsByDate = useMemo(() => {
        const filtered = campaigns_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
        console.log("Filtered Campaigns By Date:", filtered);
        return filtered;
    }, [campaigns_by_date, startDate, endDate]);

    const metrics = useMemo(() => {
        const result = filteredMetricsByDate.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (Number(row.clicks) || 0),
                impressions: acc.impressions + (Number(row.impressions) || 0),
                conversions: acc.conversions + (Number(row.conversions) || 0),
                conversion_value: acc.conversion_value + (Number(row.conversion_value) || 0),
                ad_spend: acc.ad_spend + (Number(row.ad_spend) || 0),
                roas: Number(row.ad_spend) > 0 ? acc.conversion_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversion_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                cpm: acc.impressions > 0 ? (acc.ad_spend / acc.impressions) * 1000 : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversion_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                conv_rate: 0,
            }
        );
        console.log("Calculated Metrics:", result);
        return result;
    }, [filteredMetricsByDate]);

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

    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        const result = comparisonData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (Number(row.clicks) || 0),
                impressions: acc.impressions + (Number(row.impressions) || 0),
                conversions: acc.conversions + (Number(row.conversions) || 0),
                conversion_value: acc.conversion_value + (Number(row.conversion_value) || 0),
                ad_spend: acc.ad_spend + (Number(row.ad_spend) || 0),
                roas: Number(row.ad_spend) > 0 ? acc.conversion_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversion_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                cpm: acc.impressions > 0 ? (acc.ad_spend / acc.impressions) * 1000 : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversion_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                conv_rate: 0,
            }
        );
        console.log("Comparison Metrics:", result);
        return result;
    }, [metrics_by_date, compStart, compEnd]);

    const filteredTopCampaigns = useMemo(() => {
        const campaignMap = filteredCampaignsByDate.reduce((acc, row) => {
            const clicks = (acc[row.campaign_name]?.clicks || 0) + (Number(row.clicks) || 0);
            const impressions = (acc[row.campaign_name]?.impressions || 0) + (Number(row.impressions) || 0);
            acc[row.campaign_name] = {
                clicks,
                impressions,
                ctr: impressions > 0 ? clicks / impressions : 0,
            };
            return acc;
        }, {});
        const result = Object.entries(campaignMap)
            .map(([campaign_name, data]) => ({
                campaign_name,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.ctr,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);
        console.log("Filtered Top Campaigns:", result);
        return result;
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

    const ppcMetrics = [
        {
            label: "Conv. Value",
            value: metrics.conversion_value ? Math.round(metrics.conversion_value).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversion_value, comparisonMetrics.conversion_value),
            positive: metrics.conversion_value >= comparisonMetrics.conversion_value,
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
            label: "CPM",
            value: metrics.cpm ? metrics.cpm.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.cpm, comparisonMetrics.cpm),
            positive: metrics.cpm <= comparisonMetrics.cpm,
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
                            return Number(row.conversions) || 0;
                        case "Ad Spend":
                            return Number(row.ad_spend) || 0;
                        case "ROAS":
                            return Number(row.roas) || 0;
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

    const cpcChartData = {
        labels: filteredMetricsByDate.map((row) => row.date) || [],
        datasets: [
            {
                label: cpcMetric,
                data: filteredMetricsByDate.map((row) => {
                    switch (cpcMetric) {
                        case "CPC":
                            return Number(row.cpc) || 0;
                        case "CTR":
                            return Number(row.ctr) || 0;
                        case "Conv. Rate":
                            return Number(row.conv_rate) || 0;
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

    const campaignChartData = {
        labels: [...new Set(filteredCampaignsByDate.map((row) => row.date))].sort(),
        datasets: selectedCampaigns.map((campaign, i) => ({
            label: campaign,
            data: filteredCampaignsByDate
                .filter((row) => row.campaign_name === campaign && Number(row.impressions) > 0)
                .map((row) => ({
                    x: row.date,
                    y: selectedMetric === "Conversions" ? (Number(row.conv_rate) || 0) :
                        selectedMetric === "Ad Spend" ? (Number(row.cpc) || 0) :
                            (Number(row.ctr) || 0)
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

    if (!metrics_by_date || !top_campaigns || !campaigns_by_date) {
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
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">Paid Social Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of key Paid Social metrics including conversions, ad spend, and campaign performance.
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {ppcMetrics.map((item, i) => (
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
                            <option>Conversions</option>
                            <option>Ad Spend</option>
                            <option>ROAS</option>
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
                                    <th className="px-4 py-2">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTopCampaigns.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{row.campaign_name}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
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
                        <p className="font-semibold">{cpcMetric}</p>
                        <select
                            value={cpcMetric}
                            onChange={(e) => setCpcMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
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