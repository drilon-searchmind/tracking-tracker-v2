"use client";

import { useState } from "react";
import Image from "next/image";
import {
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
    HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { FaMoneyCheckAlt, FaChartLine } from "react-icons/fa";
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
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

export default function PerformanceDashboard({ customerId, initialData }) {
    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState("2025-01-01");
    const [dateEnd, setDateEnd] = useState("2025-04-15");
    const [isLoading, setIsLoading] = useState(!initialData);

    // Ensure initialData is valid
    const data = Array.isArray(initialData) ? initialData : [];

    // Use all data (no filtering)
    const filteredData = data;

    // Calculate comparison period (use all data for now)
    const getComparisonDates = () => {
        const end = new Date(dateEnd);
        const start = new Date(dateStart);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (comparison === "Previous Year") {
            return {
                compStart: new Date(start.setFullYear(start.getFullYear() - 1)).toISOString().split("T")[0],
                compEnd: new Date(end.setFullYear(end.getFullYear() - 1)).toISOString().split("T")[0],
            };
        } else {
            return {
                compStart: new Date(start.setDate(start.getDate() - daysDiff)).toISOString().split("T")[0],
                compEnd: new Date(end.setDate(end.getDate() - daysDiff)).toISOString().split("T")[0],
            };
        }
    };

    const { compStart, compEnd } = getComparisonDates();
    // Use all data for comparison (no date filtering)
    const comparisonData = data;

    // Aggregate metrics for current and comparison periods
    const aggregateMetrics = (data) => ({
        revenue: data.reduce((sum, row) => sum + (row.revenue || 0), 0),
        gross_profit: data.reduce((sum, row) => sum + (row.gross_profit || 0), 0),
        orders: data.reduce((sum, row) => sum + (row.orders || 0), 0),
        cost: data.reduce((sum, row) => sum + (row.cost || 0), 0),
        roas: data.reduce((sum, row) => sum + (row.roas || 0), 0) / (data.length || 1),
        poas: data.reduce((sum, row) => sum + (row.poas || 0), 0) / (data.length || 1),
        cac: data.reduce((sum, row) => sum + (row.cac || 0), 0) / (data.length || 1),
        aov: data.reduce((sum, row) => sum + (row.aov || 0), 0) / (data.length || 1),
        impressions: data.reduce((sum, row) => sum + (row.impressions || 0), 0),
    });

    const currentMetrics = aggregateMetrics(filteredData);
    const prevMetrics = aggregateMetrics(comparisonData);

    // Calculate deltas
    const calculateDelta = (current, prev) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(1);
        return `${delta > 0 ? "+" : ""}${delta}%`;
    };

    const metrics = [
        {
            title: "Revenue",
            value: `$${Math.round(currentMetrics.revenue).toLocaleString()}`,
            delta: calculateDelta(currentMetrics.revenue, prevMetrics.revenue),
            positive: currentMetrics.revenue >= prevMetrics.revenue,
            icon: <HiOutlineCurrencyDollar className="text-2xl text-gray-400" />,
        },
        {
            title: "Gross Profit",
            value: `$${Math.round(currentMetrics.gross_profit).toLocaleString()}`,
            delta: calculateDelta(currentMetrics.gross_profit, prevMetrics.gross_profit),
            positive: currentMetrics.gross_profit >= prevMetrics.gross_profit,
            icon: <FaMoneyCheckAlt className="text-2xl text-gray-400" />,
        },
        {
            title: "Orders",
            value: Math.round(currentMetrics.orders).toLocaleString(),
            delta: calculateDelta(currentMetrics.orders, prevMetrics.orders),
            positive: currentMetrics.orders >= prevMetrics.orders,
            icon: <HiOutlineShoppingCart className="text-2xl text-gray-400" />,
        },
        {
            title: "Cost",
            value: `$${Math.round(currentMetrics.cost).toLocaleString()}`,
            delta: calculateDelta(currentMetrics.cost, prevMetrics.cost),
            positive: currentMetrics.cost <= prevMetrics.cost,
            icon: <HiOutlineChartBar className="text-2xl text-gray-400" />,
        },
        {
            title: "ROAS (incl. moms)",
            value: currentMetrics.roas.toFixed(2),
            delta: calculateDelta(currentMetrics.roas, prevMetrics.roas),
            positive: currentMetrics.roas >= prevMetrics.roas,
            icon: <HiOutlineArrowTrendingUp className="text-2xl text-gray-400" />,
        },
        {
            title: "POAS",
            value: currentMetrics.poas.toFixed(2),
            delta: calculateDelta(currentMetrics.poas, prevMetrics.poas),
            positive: currentMetrics.poas >= prevMetrics.poas,
            icon: <HiOutlineArrowTrendingUp className="text-2xl text-gray-400" />,
        },
        {
            title: "CAC",
            value: `$${Math.round(currentMetrics.cac).toLocaleString()}`,
            delta: calculateDelta(currentMetrics.cac, prevMetrics.cac),
            positive: currentMetrics.cac <= prevMetrics.cac,
            icon: <HiOutlineChartBar className="text-2xl text-gray-400" />,
        },
        {
            title: "AOV",
            value: `$${Math.round(currentMetrics.aov).toLocaleString()}`,
            delta: calculateDelta(currentMetrics.aov, prevMetrics.aov),
            positive: currentMetrics.aov >= prevMetrics.aov,
            icon: <HiOutlineChartBar className="text-2xl text-gray-400" />,
        },
        {
            title: "Impressions",
            value: Math.round(currentMetrics.impressions).toLocaleString(),
            delta: calculateDelta(currentMetrics.impressions, prevMetrics.impressions),
            positive: currentMetrics.impressions >= prevMetrics.impressions,
            icon: <HiOutlineChartBar className="text-2xl text-gray-400" />,
        },
    ];

    // Chart data for Revenue and AOV
    const revenueChartData = {
        labels: filteredData.map((row) => row.date),
        datasets: [
            {
                label: "Revenue",
                data: filteredData.map((row) => row.revenue || 0),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                fill: true,
            },
        ],
    };

    const aovChartData = {
        labels: filteredData.map((row) => row.date),
        datasets: [
            {
                label: "AOV",
                data: filteredData.map((row) => row.aov || 0),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                fill: true,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: { type: "time", time: { unit: "day" } },
            y: { beginAtZero: true },
        },
    };

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    if (!data.length) {
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerId.replace("airbyte_", "")}</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Performance Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed. Commodo in viv...
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {metrics.map((metric, i) => (
                        <div
                            key={i}
                            className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-2">
                                {metric.icon}
                                <p className="text-xs text-gray-500 uppercase">{metric.title}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-semibold text-black">{metric.value}</span>
                                {metric.delta && (
                                    <span
                                        className={`text-sm font-medium ${metric.positive ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {metric.delta}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Revenue</p>
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Spend Allocation</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Average Order Value</p>
                        <Line data={aovChartData} options={chartOptions} />
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Sessions Per Channel Group</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="mt-16 space-y-4 px-20 mx-auto z-10 relative">
                    <h3 className="mb-2 text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5 mb-5">Service Dashboards</h3>
                    {["SEO", "PPC", "EM", "PS"].map((title, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-50 rounded-md px-6 py-4 border border-zinc-200 shadow-solid-l"
                        >
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                                <p className="text-sm text-gray-500">Subtitle</p>
                            </div>
                            <button className="text-xs border border-blue-500 text-blue-500 px-4 py-1.5 rounded hover:bg-blue-50 flex items-center gap-2">
                                <span className="text-sm">+</span> Open
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}