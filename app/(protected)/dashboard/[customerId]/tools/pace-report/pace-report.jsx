"use client";

import { useState, useMemo } from "react";
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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => date.toISOString().split("T")[0];

    const [revenueBudget, setRevenueBudget] = useState("0");
    const [adSpendBudget, setAdSpendBudget] = useState("0");
    const [metric, setMetric] = useState("Revenue");
    const [comparison, setComparison] = useState("Previous Year");
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));

    if (!initialData || !initialData.daily_metrics) {
        return <div>No data available for {customerId}</div>;
    }

    const { daily_metrics } = initialData;

    const filteredMetrics = useMemo(() => {
        const filtered = daily_metrics
            .filter(row => row.date >= startDate && row.date <= endDate)
            .sort((a, b) => a.date.localeCompare(b.date));
        console.log("Filtered Metrics:", filtered);
        return filtered;
    }, [daily_metrics, startDate, endDate]);

    const cumulativeMetrics = useMemo(() => {
        let cumOrders = 0, cumRevenue = 0, cumAdSpend = 0;
        const result = filteredMetrics.map(row => {
            cumOrders += Number(row.orders || 0);
            cumRevenue += Number(row.revenue || 0);
            cumAdSpend += Number(row.ad_spend || 0);
            return {
                date: row.date,
                orders: cumOrders,
                revenue: cumRevenue,
                ad_spend: cumAdSpend,
                roas: cumAdSpend > 0 ? cumRevenue / cumAdSpend : 0,
            };
        });
        console.log("Cumulative Metrics:", result);
        return result;
    }, [filteredMetrics]);

    const totals = useMemo(() => {
        const aggregated = cumulativeMetrics.length > 0 ? cumulativeMetrics[cumulativeMetrics.length - 1] : {
            orders: 0,
            revenue: 0,
            ad_spend: 0,
            roas: 0
        };

        const revenueBudgetNum = Number(revenueBudget.replace(/[^0-9.-]+/g, "")) || 500000;
        const adSpendBudgetNum = Number(adSpendBudget.replace(/[^0-9.-]+/g, "")) || 100000;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysInRange = Math.ceil((end - start + 1) / (1000 * 60 * 60 * 24));
        const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
        const daysElapsed = daysInRange;

        const pace = (aggregated.revenue / daysInMonth) * (daysElapsed - 1) > 0
            ? revenueBudgetNum / ((aggregated.revenue / daysInMonth) * (daysElapsed - 1))
            : 0;

        const suggestedDailyAdjustment = daysInMonth * daysElapsed > 0
            ? (revenueBudgetNum - aggregated.revenue) / (daysInMonth * daysElapsed)
            : 0;

        const result = {
            orders: aggregated.orders,
            revenue: aggregated.revenue,
            ad_spend: aggregated.ad_spend,
            roas: isFinite(aggregated.roas) ? aggregated.roas : 0,
            revenue_budget: revenueBudgetNum,
            ad_spend_budget: adSpendBudgetNum,
            revenue_pace: revenueBudgetNum * (daysInRange / daysInMonth),
            ad_spend_pace: adSpendBudgetNum * (daysInRange / daysInMonth),
            revenue_budget_percentage: revenueBudgetNum > 0 ? (aggregated.revenue / revenueBudgetNum) * 100 : 0,
            ad_spend_budget_percentage: adSpendBudgetNum > 0 ? (aggregated.ad_spend / adSpendBudgetNum) * 100 : 0,
            pace: isFinite(pace) ? pace : 0,
            suggested_daily_adjustment: isFinite(suggestedDailyAdjustment) ? suggestedDailyAdjustment : 0
        };
        console.log("Calculated Totals:", result);
        return result;
    }, [cumulativeMetrics, revenueBudget, adSpendBudget, startDate, endDate]);

    const getComparisonDates = () => {
        const end = new Date(endDate);
        const start = new Date(startDate);
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

    const comparisonTotals = useMemo(() => {
        const comparisonData = daily_metrics
            .filter(row => row.date >= compStart && row.date <= compEnd)
            .sort((a, b) => a.date.localeCompare(b.date));
        let cumOrders = 0, cumRevenue = 0, cumAdSpend = 0;
        const cumulativeComparison = comparisonData.map(row => {
            cumOrders += Number(row.orders || 0);
            cumRevenue += Number(row.revenue || 0);
            cumAdSpend += Number(row.ad_spend || 0);
            return { orders: cumOrders, revenue: cumRevenue, ad_spend: cumAdSpend };
        });

        const aggregated = cumulativeComparison.length > 0 ? cumulativeComparison[cumulativeComparison.length - 1] : {
            orders: 0,
            revenue: 0,
            ad_spend: 0
        };

        const roas = aggregated.ad_spend > 0 ? aggregated.revenue / aggregated.ad_spend : 0;
        const revenueBudgetNum = Number(revenueBudget.replace(/[^0-9.-]+/g, "")) || 500000;
        const adSpendBudgetNum = Number(adSpendBudget.replace(/[^0-9.-]+/g, "")) || 100000;

        const result = {
            orders: aggregated.orders,
            revenue: aggregated.revenue,
            ad_spend: aggregated.ad_spend,
            roas: isFinite(roas) ? roas : 0,
            revenue_budget: revenueBudgetNum,
            ad_spend_budget: adSpendBudgetNum,
        };
        console.log("Comparison Totals:", result);
        return result;
    }, [daily_metrics, compStart, compEnd, revenueBudget, adSpendBudget]);

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(2);
        return `${delta > 0 ? "+" : ""}${delta}%`;
    };

    const metricsDisplay = [
        {
            label: "Revenue",
            value: totals.revenue ? Math.round(totals.revenue).toLocaleString("da-DK") : "0",
            delta: calculateDelta(totals.revenue, comparisonTotals.revenue),
            positive: totals.revenue >= comparisonTotals.revenue,
        },
        {
            label: "Orders",
            value: totals.orders ? Math.round(totals.orders).toLocaleString("da-DK") : "0",
            delta: calculateDelta(totals.orders, comparisonTotals.orders),
            positive: totals.orders >= comparisonTotals.orders,
        },
        {
            label: "Ad Spend",
            value: totals.ad_spend ? Math.round(totals.ad_spend).toLocaleString("da-DK") : "0",
            delta: calculateDelta(totals.ad_spend, comparisonTotals.ad_spend),
            positive: totals.ad_spend <= comparisonTotals.ad_spend,
        },
        {
            label: "ROAS",
            value: totals.roas.toFixed(2),
            delta: calculateDelta(totals.roas, comparisonTotals.roas),
            positive: totals.roas >= comparisonTotals.roas,
        },
    ];

    const budgetChartData = {
        labels: cumulativeMetrics.map(row => row.date),
        datasets: [
            {
                label: "Revenue",
                data: cumulativeMetrics.map(row => row.revenue),
                borderColor: "#1e3a8a",
                backgroundColor: "#1e3a8a",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: "Revenue Budget",
                data: cumulativeMetrics.map((_, i) => totals.revenue_budget * ((i + 1) / cumulativeMetrics.length)),
                borderColor: "#d1d5db",
                backgroundColor: "#d1d5db",
                fill: false,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: "Ad Spend",
                data: cumulativeMetrics.map(row => row.ad_spend),
                borderColor: "#dc2626",
                backgroundColor: "#dc2626",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'yRight'
            },
            {
                label: "Ad Spend Budget",
                data: cumulativeMetrics.map((_, i) => totals.ad_spend_budget * ((i + 1) / cumulativeMetrics.length)),
                borderColor: "#d1d5db",
                backgroundColor: "#d1d5db",
                fill: false,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'yRight'
            }
        ]
    };

    const paceChartData = {
        labels: cumulativeMetrics.map(row => row.date),
        datasets: [
            {
                label: metric,
                data: cumulativeMetrics.map(row => (metric === "Revenue" ? row.revenue : row.orders)),
                borderColor: "#1e3a8a",
                backgroundColor: "#1e3a8a",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: "Ad Spend",
                data: cumulativeMetrics.map(row => row.ad_spend),
                borderColor: "#dc2626",
                backgroundColor: "#dc2626",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'yRight'
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563",
                    padding: 10,
                    boxWidth: 20,
                    usePointStyle: false
                }
            },
            tooltip: {
                backgroundColor: "#1e3a8a",
                titleFont: { size: 10, family: "'Inter', sans-serif" },
                bodyFont: { size: 10, family: "'Inter', sans-serif" },
                padding: 8
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10, family: "'Inter', sans-serif" }, color: "#4b5563" },
                title: { display: true, text: "Date", font: { size: 10, family: "'Inter', sans-serif" }, color: "#4b5563" }
            },
            y: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563",
                    callback: function (value) {
                        return metric === "Revenue" ? `kr. ${value.toLocaleString("da-DK")}` : value;
                    }
                },
                title: {
                    display: true,
                    text: metric === "Revenue" ? "kr." : "Count",
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563"
                },
                beginAtZero: true
            },
            yRight: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563",
                    callback: function (value) {
                        return `kr. ${value.toLocaleString("da-DK")}`;
                    }
                },
                title: {
                    display: true,
                    text: "Ad Spend (kr.)",
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563"
                },
                beginAtZero: true,
                position: 'right'
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Budget</p>
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
                            {metricsDisplay.slice(0, 2).map((item, i) => (
                                <div key={i}>
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className="text-lg font-semibold">
                                        {item.label === "Orders" ? item.value : `kr. ${item.value}`}
                                        {item.delta && (
                                            <span className={`ml-2 text-sm ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                                {item.delta}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
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
                            <div>
                                <p className="text-sm text-gray-500">{metric} Pace</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue" ? `kr. ${Math.round(totals.revenue_pace).toLocaleString("da-DK")}` : Math.round(totals.orders * (31 / filteredMetrics.length)).toLocaleString("da-DK")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ad Spend Pace</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.ad_spend_pace).toLocaleString("da-DK")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">ROAS</p>
                                <p className="text-lg font-semibold">
                                    {totals.roas.toFixed(2)}
                                    {metricsDisplay[3].delta && (
                                        <span className={`ml-2 text-sm ${metricsDisplay[3].positive ? "text-green-600" : "text-red-500"}`}>
                                            {metricsDisplay[3].delta}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pace</p>
                                <p className="text-lg font-semibold">{totals.pace.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Suggested Daily Adjustment</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.suggested_daily_adjustment).toLocaleString("da-DK")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}