"use client";

import { useState } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function PaceReport({ customerId, customerName, initialData }) {
    const [revenueBudget, setRevenueBudget] = useState(initialData.totals.revenue_budget.toLocaleString("da-DK"));
    const [adSpendBudget, setAdSpendBudget] = useState(initialData.totals.ad_spend_budget.toLocaleString("da-DK"));
    const [metric, setMetric] = useState("Revenue");

    if (!initialData || !initialData.daily_metrics) {
        return <div>No data available for {customerId}</div>;
    }

    const { daily_metrics, totals } = initialData;

    // Prepare chart data
    const dates = daily_metrics.map((row) => row.date);
    const revenueBudgetDaily = totals.revenue_budget / 31;
    const adSpendBudgetDaily = totals.ad_spend_budget / 31;

    const budgetChartData = {
        labels: dates,
        datasets: [
            {
                label: "Revenue",
                data: daily_metrics.map((row) => row.revenue),
                borderColor: "#1e3a8a", // Tailwind blue-900
                backgroundColor: "#1e3a8a",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            },
            {
                label: "Revenue Budget",
                data: daily_metrics.map((row) => row.revenue_budget),
                borderColor: "#d1d5db", // Tailwind gray-300
                backgroundColor: "#d1d5db",
                fill: false,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            },
            {
                label: "Ad Spend",
                data: daily_metrics.map((row) => row.ad_spend),
                borderColor: "#dc2626", // Tailwind red-600
                backgroundColor: "#dc2626",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            },
            {
                label: "Ad Spend Budget",
                data: daily_metrics.map((row) => row.ad_spend_budget),
                borderColor: "#d1d5db", // Tailwind gray-300
                backgroundColor: "#d1d5db",
                fill: false,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            }
        ]
    };

    const paceChartData = {
        labels: dates,
        datasets: [
            {
                label: metric,
                data: daily_metrics.map((row) => (metric === "Revenue" ? row.revenue : row.orders)),
                borderColor: "#1e3a8a", // Tailwind blue-900
                backgroundColor: "#1e3a8a",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            },
            {
                label: "Ad Spend",
                data: daily_metrics.map((row) => row.ad_spend),
                borderColor: "#dc2626", // Tailwind red-600
                backgroundColor: "#dc2626",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif"
                    },
                    color: "#4b5563", // Tailwind gray-600
                    padding: 10,
                    boxWidth: 20,
                    usePointStyle: false
                }
            },
            tooltip: {
                backgroundColor: "#1e3a8a", // Tailwind blue-900
                titleFont: { size: 10, family: "'Inter', sans-serif" },
                bodyFont: { size: 10, family: "'Inter', sans-serif" },
                padding: 8
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif"
                    },
                    color: "#4b5563" // Tailwind gray-600
                },
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif"
                    },
                    color: "#4b5563" // Tailwind gray-600
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif"
                    },
                    color: "#4b5563", // Tailwind gray-600
                    callback: function (value) {
                        return metric === "Revenue" ? `kr. ${value.toLocaleString("da-DK")}` : value;
                    }
                },
                title: {
                    display: true,
                    text: metric === "Revenue" ? "kr." : "Count",
                    font: {
                        size: 10,
                        family: "'Inter', sans-serif"
                    },
                    color: "#4b5563" // Tailwind gray-600
                },
                beginAtZero: true
            }
        }
    };

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
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Pace Report</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Track budget utilization and pacing for revenue and ad spend, with projections for the current month.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Budget</p>
                            <div className="flex gap-2 items-center">
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                                <span className="text-gray-400">→</span>
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                            </div>
                        </div>
                        <div className="h-[280px]">
                            <Line data={budgetChartData} options={chartOptions} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Revenue Budget</p>
                                <input
                                    type="text"
                                    value={revenueBudget}
                                    onChange={(e) => setRevenueBudget(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                                    placeholder="kr. 500,000"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Ad Spend Budget</p>
                                <input
                                    type="text"
                                    value={adSpendBudget}
                                    onChange={(e) => setAdSpendBudget(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                                    placeholder="kr. 100,000"
                                />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.revenue).toLocaleString("da-DK")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ad Spend</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.ad_spend).toLocaleString("da-DK")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revenue % of Budget</p>
                                <p className="text-lg font-semibold">{totals.revenue_budget_percentage.toFixed(2)}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ad Spend % of Budget</p>
                                <p className="text-lg font-semibold">{totals.ad_spend_budget_percentage.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Pace</p>
                            <div className="flex gap-2 items-center">
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                                <span className="text-gray-400">→</span>
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                            </div>
                        </div>
                        <div className="h-[280px]">
                            <Line data={paceChartData} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, title: { ...chartOptions.scales.y.title, text: metric === "Revenue" ? "kr." : "Count" } } } }} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Metric</p>
                                <select
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                                >
                                    <option>Revenue</option>
                                    <option>Orders</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Current {metric}</p>
                                <input
                                    type="text"
                                    value={metric === "Revenue" ? `kr. ${Math.round(totals.revenue).toLocaleString("da-DK")}` : Math.round(totals.orders).toLocaleString("da-DK")}
                                    readOnly
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">{metric} Pace</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue" ? `kr. ${Math.round(totals.revenue_pace).toLocaleString("da-DK")}` : Math.round(totals.orders * (31 / 23)).toLocaleString("da-DK")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ad Spend Pace</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.ad_spend_pace).toLocaleString("da-DK")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">ROAS</p>
                                <p className="text-lg font-semibold">{totals.roas.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}