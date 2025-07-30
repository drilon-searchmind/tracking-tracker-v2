"use client";

import { useState } from "react";
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

export default function SEODashboard({ customerId, customerName, initialData }) {
    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState("2025-01-01");
    const [dateEnd, setDateEnd] = useState("2025-04-15");
    const [metric, setMetric] = useState("Impressions");
    const [filter, setFilter] = useState("Med brand");

    const selectedUrls = initialData.top_urls?.slice(0, 5).map((item) => item.url) || [];

    const selectedKeywords = initialData.top_keywords?.slice(0, 5).map((item) => item.keyword) || [];

    const { metrics, impressions_data, top_keywords, top_urls, urls_by_date, keywords_by_date } = initialData || {};

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

    const seoMetrics = [
        {
            label: "Click",
            value: metrics?.clicks ? Math.round(metrics.clicks).toLocaleString() : "0",
            delta: calculateDelta(metrics?.clicks),
            positive: true,
        },
        {
            label: "Impressions",
            value: metrics?.impressions ? Math.round(metrics.impressions).toLocaleString() : "0",
            delta: calculateDelta(metrics?.impressions),
            positive: true,
        },
        {
            label: "CTR",
            value: metrics?.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics?.ctr),
            positive: true,
        },
        {
            label: "Avg. Position",
            value: metrics?.avg_position ? metrics.avg_position.toFixed(2) : "0.00",
            delta: calculateDelta(metrics?.avg_position),
            positive: false,
        },
    ];

    const impressionsChartData = {
        labels: impressions_data?.map((row) => row.date) || [],
        datasets: [
            {
                label: metric,
                data: impressions_data?.map((row) => row.impressions || 0) || [],
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
        ],
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

    const urlChartData = {
        labels: [...new Set(urls_by_date?.map((row) => row.date) || [])].sort(),
        datasets: selectedUrls.map((url, i) => ({
            label: url,
            data: urls_by_date
                ?.filter((row) => row.url === url)
                .map((row) => ({
                    x: row.date,
                    y: metric === "Clicks" ? row.clicks || 0 :
                        metric === "Impressions" ? row.impressions || 0 :
                            row.ctr || 0
                })) || [],
            borderColor: colors[`hue${i % 5}`] || colors.primary,
            backgroundColor: colors[`hue${i % 5}`] || colors.primary,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: false,
        })),
    };

    const keywordChartData = {
        labels: [...new Set(keywords_by_date?.map((row) => row.date) || [])].sort(),
        datasets: selectedKeywords.map((keyword, i) => ({
            label: keyword,
            data: keywords_by_date
                ?.filter((row) => row.keyword === keyword && row.impressions > 0)
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

    if (!metrics || !impressions_data || !top_keywords || !top_urls || !urls_by_date || !keywords_by_date) {
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
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">SEO Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of clicks, impressions, CTR, and position based on Google Search Console data.
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
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {seoMetrics.map((item, i) => (
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

                <div className="bg-white border border-zinc-200 rounded p-6 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Impressions</p>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Impressions</option>
                            <option>Clicks</option>
                            <option>CTR</option>
                        </select>
                    </div>
                    <div className="w-full h-[calc(100%-2rem)] min-h-[300px]">
                        <Line data={impressionsChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-8 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Top Performance Keyword</p>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Med brand</option>
                            <option>Uden brand</option>
                        </select>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Keyword</th>
                                    <th className="px-4 py-2">Click</th>
                                    <th className="px-4 py-2">Impr</th>
                                    <th className="px-4 py-2">Position</th>
                                    <th className="px-4 py-2 text-center hidden">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_keywords.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2">{row.keyword}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString()}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString()}</td>
                                        <td className="px-4 py-2">{row.position.toFixed(0)}</td>
                                        <td className="px-4 py-2 text-center hidden">
                                            <input type="checkbox" className="rounded border-zinc-300" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6">
                        <p className="font-semibold mb-4">Top Keywords Impressions Over Time</p>
                        <div className="w-full h-[300px]">
                            <Line data={keywordChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-zinc-200 rounded p-6 mt-10 shadow-solid-10">
                    <div className="overflow-auto">
                        <p className="font-semibold mb-4">Top Performance URLs</p>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">URL</th>
                                    <th className="px-4 py-2">Click</th>
                                    <th className="px-4 py-2">Impr</th>
                                    <th className="px-4 py-2">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_urls.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{row.url}</td>
                                        <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString()}</td>
                                        <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString()}</td>
                                        <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-end mb-2">
                            <select
                                className="border px-3 py-1 rounded text-sm"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                            >
                                <option>Clicks</option>
                                <option>Impressions</option>
                                <option>CTR</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px]">
                            <Line data={urlChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}