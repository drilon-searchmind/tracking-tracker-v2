"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
    HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
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
    const formatDate = (date) => date.toISOString().split("T")[0];

    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [isLoading, setIsLoading] = useState(!initialData);

    const data = Array.isArray(initialData) ? initialData : [];

    // Filter data for current period
    const filteredData = useMemo(() => {
        return data.filter((row) => row.date >= dateStart && row.date <= dateEnd);
    }, [data, dateStart, dateEnd]);

    // Calculate comparison dates
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

    const aggregateMetrics = (data) => {
        const channelSessions = {};
        data.forEach((row) => {
            if (row.channel_sessions) {
                row.channel_sessions.forEach(({ channel_group, sessions }) => {
                    if (channel_group) {
                        channelSessions[channel_group] = (channelSessions[channel_group] || 0) + (sessions || 0);
                    }
                });
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

    const calculateDelta = (current, prev) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(1);
        return `${delta > 0 ? "+" : ""}${delta}%`;
    };

    const metrics = [
        {
            title: "Revenue",
            value: `${Math.round(currentMetrics.revenue).toLocaleString()} DKK`,
            delta: calculateDelta(currentMetrics.revenue, prevMetrics.revenue),
            positive: currentMetrics.revenue >= prevMetrics.revenue,
            icon: <HiOutlineCurrencyDollar className="text-2xl text-gray-400" />,
        },
        {
            title: "Gross Profit",
            value: `${Math.round(currentMetrics.gross_profit).toLocaleString()} DKK`,
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
            value: `${Math.round(currentMetrics.cost).toLocaleString()} DKK`,
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
            title: "AOV",
            value: `${Math.round(currentMetrics.aov).toLocaleString()} DKK`,
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

    // Color palette based on rgb(28, 57, 142)
    const colors = {
        primary: "#1C398E", // rgb(28, 57, 142)
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    // Filter data for charts to exclude zero or invalid values
    const validChartData = filteredData.filter(
        (row) => row.date && !isNaN(new Date(row.date).getTime()) && row.revenue !== 0 && row.aov !== 0
    );

    // Chart data for Revenue
    const revenueChartData = {
        labels: validChartData.map((row) => row.date),
        datasets: [
            {
                label: "Revenue",
                data: validChartData.map((row) => row.revenue || 0),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
        ],
    };

    const aovChartData = {
        labels: validChartData.map((row) => row.date),
        datasets: [
            {
                label: "AOV",
                data: validChartData.map((row) => row.aov || 0),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
        ],
    };

    const spendAllocationChartData = {
        labels: ["Google Ads", "Meta"],
        datasets: [
            {
                label: "Spend Allocation",
                data: [currentMetrics.google_ads_cost || 0, currentMetrics.meta_spend || 0],
                backgroundColor: [colors.primary, colors.hue1],
                borderColor: [colors.primary, colors.hue1],
                borderWidth: 1,
            },
        ],
    };

    const sessionsChartData = {
        labels: Object.keys(currentMetrics.channel_sessions || {}),
        datasets: [
            {
                label: "Sessions",
                data: Object.values(currentMetrics.channel_sessions || {}),
                backgroundColor: [colors.primary, colors.hue1, colors.hue2, colors.hue3, colors.hue4],
                borderColor: [colors.primary, colors.hue1, colors.hue2, colors.hue3, colors.hue4],
                borderWidth: 1,
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
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
            },
            datalabels: {
                display: false,
            },
        },
    };

    const pieChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 10 },
                    padding: 10,
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${Math.round(value).toLocaleString()} DKK`;
                    },
                },
            },
            datalabels: {
                color: "#fff",
                font: { size: 10, weight: "bold" },
                formatter: (value) => `${Math.round(value).toLocaleString()} DKK`,
                anchor: "center",
                align: "center",
            },
        },
    };

    const spendAllocationLineChartData = {
        labels: validChartData.map((row) => row.date),
        datasets: [
            {
                label: "Google Ads",
                data: validChartData.map((row) => row.google_ads_cost || 0),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
            {
                label: "Meta",
                data: validChartData.map((row) => row.meta_spend || 0),
                borderColor: colors.hue4,
                backgroundColor: colors.hue5,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
        ],
    };

    const barChartOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: { font: { size: 10 } },
                title: {
                    display: true,
                    text: "Sessions",
                    font: { size: 12 },
                },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 } },
                title: {
                    display: true,
                    text: "Channel Group",
                    font: { size: 12 },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${Math.round(value).toLocaleString()} sessions`;
                    },
                },
            },
            datalabels: {
                display: false,
            },
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
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
                                <p className="text-xs text-gray-500 uppercase">
                                    {metric.title}
                                    {metric.title === "Gross Profit" && (
                                        <span className="text-xs text-red-500 ml-1 font-bold">(TBU)</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-2xl font-semibold ${metric.title === "Gross Profit" ? "text-red-500 line-through" : "text-black"}`}>{metric.value}</span>
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
                        <div className="w-full h-[calc(100%-2rem)]">
                            <Line data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Spend Allocation</p>
                        <div className="w-full h-[calc(100%-2rem)]">
                            <Line data={spendAllocationLineChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Average Order Value</p>
                        <div className="w-full h-[calc(100%-2rem)]">
                            <Line data={aovChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Sessions Per Channel Group</p>
                        <div className="w-full h-[calc(100%-2rem)]">
                            <Bar data={sessionsChartData} options={barChartOptions} />
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