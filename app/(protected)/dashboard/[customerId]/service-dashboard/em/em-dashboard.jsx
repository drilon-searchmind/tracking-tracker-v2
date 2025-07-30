"use client";

import { useEffect, useState } from "react";
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
    const [comparison, setComparison] = useState("Previous Year");
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState("2025-04-15");
    const [selectedMetric, setSelectedMetric] = useState("Conversions");
    const selectedCampaigns = initialData.top_campaigns?.slice(0, 5).map((item) => item.campaign_name) || [];
    const [emailTypeName, setEmailTypeName] = useState("");

    const { metrics, metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance } = initialData || {};

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
        return `${delta > 0 ? "+" : ""}${delta}%`;
    };

    const emailMetrics = [
        {
            label: "Total Emails Sent",
            value: metrics?.impressions ? Math.round(metrics.impressions).toLocaleString() : "0",
            delta: calculateDelta(metrics?.impressions),
            positive: true,
        },
        {
            label: "Total Clicks",
            value: metrics?.clicks ? Math.round(metrics.clicks).toLocaleString() : "0",
            delta: calculateDelta(metrics?.clicks),
            positive: true,
        },
        {
            label: "CTR",
            value: metrics?.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics?.ctr),
            positive: true,
        },
        {
            label: "Conversions",
            value: metrics?.conversions ? Math.round(metrics.conversions).toLocaleString() : "0",
            delta: calculateDelta(metrics?.conversions),
            positive: true,
        },
        {
            label: "Conversion Rate",
            value: metrics?.conv_rate ? `${(metrics.conv_rate * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics?.conv_rate),
            positive: true,
        },
        {
            label: "Conversion Value",
            value: metrics?.conversion_value ? Math.round(metrics.conversion_value).toLocaleString() : "0",
            delta: calculateDelta(metrics?.conversion_value),
            positive: true,
        },
        {
            label: "Cost",
            value: metrics?.cost ? Math.round(metrics.cost).toLocaleString() : "0",
            delta: calculateDelta(metrics?.cost),
            positive: true,
        },
        {
            label: "CPC",
            value: metrics?.cpc ? metrics.cpc.toFixed(2) : "0.00",
            delta: calculateDelta(metrics?.cpc),
            positive: true,
        },
    ];

    const metricsChartData = {
        labels: metrics_by_date?.map((row) => row.date) || [],
        datasets: [
            {
                label: selectedMetric,
                data: metrics_by_date?.map((row) => {
                    switch (selectedMetric) {
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

    const campaignChartData = {
        labels: [...new Set(campaigns_by_date?.map((row) => row.date) || [])].sort(),
        datasets: selectedCampaigns.map((campaign, i) => ({
            label: campaign,
            data: campaigns_by_date
                ?.filter((row) => row.campaign_name === campaign && row.impressions > 0)
                .map((row) => ({
                    x: row.date,
                    y: row.impressions
                })) || [],
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
                ticks: { font: { size: 10 } },
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

    if (!metrics || !metrics_by_date || !top_campaigns || !campaigns_by_date || !campaign_performance) {
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
                            <option>Conversions</option>
                            <option>Conversion Value</option>
                            <option>Clicks</option>
                            <option>CTR</option>
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
                                {top_campaigns.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{row.campaign_name}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString()}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString()}</td>
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
                        <p className="font-semibold">Campaign Performance by Date (Top 30)</p>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Campaign Name</th>
                                    <th className="px-4 py-2">Emails Sent</th>
                                    <th className="px-4 py-2">Clicks</th>
                                    <th className="px-4 py-2">CTR</th>
                                    <th className="px-4 py-2">Conversions</th>
                                    <th className="px-4 py-2">Conv. Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaign_performance.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{row.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{row.campaign_name}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString()}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString()}</td>
                                        <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-2">{Math.round(row.conversions).toLocaleString()}</td>
                                        <td className="px-4 py-2">{Math.round(row.conversion_value).toLocaleString()}</td>
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