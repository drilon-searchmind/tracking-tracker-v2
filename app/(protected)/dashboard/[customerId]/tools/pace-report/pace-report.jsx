"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
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
import Subheading from "@/app/components/UI/Utility/Subheading";

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
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            console.warn('Invalid date encountered:', date);
            return '';
        }
        return date.toISOString().split("T")[0];
    };

    const [revenueBudget, setRevenueBudget] = useState("500000");
    const [ordersBudget, setOrdersBudget] = useState("1000");
    const [adSpendBudget, setAdSpendBudget] = useState("100000");
    const [metric, setMetric] = useState("Revenue");
    const [comparison, setComparison] = useState("Previous Year");
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));
    const [activeChartIndex, setActiveChartIndex] = useState(0);

    const end = new Date(endDate);
    const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

    if (!initialData || !initialData.daily_metrics) {
        return <div className="p-4 text-center">No data available for {customerId}</div>;
    }

    const { daily_metrics } = initialData;

    const filteredMetrics = useMemo(() => {
        const filtered = daily_metrics
            .filter(row => row.date >= startDate && row.date <= endDate)
            .sort((a, b) => a.date.localeCompare(b.date));
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
        const ordersBudgetNum = Number(ordersBudget.replace(/[^0-9.-]+/g, "")) || 1000;
        const adSpendBudgetNum = Number(adSpendBudget.replace(/[^0-9.-]+/g, "")) || 100000;

        const start = new Date(startDate);
        const daysInRange = Math.ceil((end - start + 1) / (1000 * 60 * 60 * 24));
        const daysElapsed = daysInRange;
        const daysRemaining = daysInMonth - daysElapsed;

        const revenuePace = (aggregated.revenue / daysInMonth) * (daysElapsed - 1) > 0
            ? revenueBudgetNum / ((aggregated.revenue / daysInMonth) * (daysElapsed - 1))
            : 0;

        const ordersPace = (aggregated.orders / daysInMonth) * (daysElapsed - 1) > 0
            ? ordersBudgetNum / ((aggregated.orders / daysInMonth) * (daysElapsed - 1))
            : 0;

        const adSpendPace = (aggregated.ad_spend / daysInMonth) * (daysElapsed - 1) > 0
            ? adSpendBudgetNum / ((aggregated.ad_spend / daysInMonth) * (daysElapsed - 1))
            : 0;

        const dailyRevenueGap = daysRemaining > 0
            ? (revenueBudgetNum - aggregated.revenue) / daysRemaining
            : 0;

        const dailyOrdersGap = daysRemaining > 0
            ? (ordersBudgetNum - aggregated.orders) / daysRemaining
            : 0;

        const dailyAdSpendGap = daysRemaining > 0
            ? (adSpendBudgetNum - aggregated.ad_spend) / daysRemaining
            : 0;

        const result = {
            orders: aggregated.orders,
            revenue: aggregated.revenue,
            ad_spend: aggregated.ad_spend,
            roas: isFinite(aggregated.roas) ? aggregated.roas : 0,
            revenue_budget: revenueBudgetNum,
            orders_budget: ordersBudgetNum,
            ad_spend_budget: adSpendBudgetNum,
            revenue_pace: revenueBudgetNum * (daysInRange / daysInMonth),
            orders_pace: ordersBudgetNum * (daysInRange / daysInMonth),
            ad_spend_pace: adSpendBudgetNum * (daysInRange / daysInMonth),
            revenue_pace_ratio: isFinite(revenuePace) ? revenuePace : 0,
            orders_pace_ratio: isFinite(ordersPace) ? ordersPace : 0,
            ad_spend_pace_ratio: isFinite(adSpendPace) ? adSpendPace : 0,
            daily_revenue_gap: isFinite(dailyRevenueGap) ? dailyRevenueGap : 0,
            daily_orders_gap: isFinite(dailyOrdersGap) ? dailyOrdersGap : 0,
            daily_ad_spend_gap: isFinite(dailyAdSpendGap) ? dailyAdSpendGap : 0
        };

        return result;
    }, [cumulativeMetrics, revenueBudget, ordersBudget, adSpendBudget, startDate, endDate, daysInMonth]);

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

        const result = {
            orders: aggregated.orders,
            revenue: aggregated.revenue,
            ad_spend: aggregated.ad_spend,
            roas: isFinite(roas) ? roas : 0
        };

        return result;
    }, [daily_metrics, compStart, compEnd]);

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(2);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const budgetChartData = {
        labels: cumulativeMetrics.map(row => row.date),
        datasets: [
            {
                label: "Ad Spend",
                data: cumulativeMetrics.map(row => row.ad_spend),
                borderColor: "#dc2626",
                backgroundColor: "#dc2626",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2
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
                borderWidth: 2
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
                borderWidth: 2
            },
            {
                label: `${metric} Budget`,
                data: cumulativeMetrics.map((_, i) => {
                    const totalBudget = metric === "Revenue" ? totals.revenue_budget : totals.orders_budget;
                    return totalBudget * ((i + 1) / cumulativeMetrics.length);
                }),
                borderColor: "#d1d5db",
                backgroundColor: "#d1d5db",
                fill: false,
                borderDash: [5, 5],
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
                ticks: { 
                    font: { size: 10, family: "'Inter', sans-serif" }, 
                    color: "#4b5563",
                    maxRotation: 45,
                    minRotation: 45
                },
                title: { 
                    display: false,
                    text: "Date", 
                    font: { size: 10, family: "'Inter', sans-serif" }, 
                    color: "#4b5563" 
                }
            },
            y: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563",
                    callback: function (value) {
                        if (activeChartIndex === 1 && metric === "Orders") {
                            return value.toLocaleString("en-US");
                        }
                        return `kr. ${value.toLocaleString("en-US")}`;
                    }
                },
                title: {
                    display: false,
                    text: activeChartIndex === 0 ? "Ad Spend (kr.)" : 
                          (metric === "Revenue" ? "kr." : "Count"),
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563"
                },
                beginAtZero: true
            }
        }
    };

    const chartComponents = [
        {
            title: "Ad Spend Budget",
            chart: <Line data={budgetChartData} options={chartOptions} />,
            metrics: [
                {
                    label: "Ad Spend Budget",
                    input: true,
                    value: adSpendBudget,
                    onChange: (e) => setAdSpendBudget(e.target.value),
                    placeholder: "kr. 100,000"
                },
                {
                    label: "Ad Spend",
                    value: `kr. ${Math.round(totals.ad_spend).toLocaleString("en-US")}`
                },
                {
                    label: "Pace Ratio",
                    value: totals.ad_spend_pace_ratio.toFixed(2)
                }
            ]
        },
        {
            title: "Pace",
            chart: <Line data={paceChartData} options={chartOptions} />,
            metrics: [
                {
                    label: "Metric",
                    select: true,
                    value: metric,
                    onChange: (e) => setMetric(e.target.value),
                    options: ["Revenue", "Orders"]
                },
                {
                    label: `${metric} Budget`,
                    input: true,
                    value: metric === "Revenue" ? revenueBudget : ordersBudget,
                    onChange: (e) => metric === "Revenue" ? setRevenueBudget(e.target.value) : setOrdersBudget(e.target.value),
                    placeholder: metric === "Revenue" ? "kr. 500,000" : "1000"
                },
                {
                    label: `Current ${metric}`,
                    value: metric === "Revenue" 
                        ? `kr. ${Math.round(totals.revenue).toLocaleString("en-US")}`
                        : Math.round(totals.orders).toLocaleString("en-US")
                },
                {
                    label: `${metric} Pace`,
                    value: metric === "Revenue"
                        ? `kr. ${Math.round(totals.revenue_pace).toLocaleString("en-US")}`
                        : Math.round(totals.orders_pace).toLocaleString("en-US")
                },
                {
                    label: "Pace Ratio",
                    value: metric === "Revenue"
                        ? totals.revenue_pace_ratio.toFixed(2)
                        : totals.orders_pace_ratio.toFixed(2)
                },
                {
                    label: `Daily ${metric} Gap`,
                    value: metric === "Revenue"
                        ? `kr. ${Math.round(totals.daily_revenue_gap).toLocaleString("en-US")}`
                        : Math.round(totals.daily_orders_gap).toLocaleString("en-US")
                }
            ]
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

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
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

            <div className="px-0 md:px-20 mx-auto z-10 relative">
                <div className="mb-6 md:mb-8">
                    <Subheading headingText={customerName} />
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-black xl:text-[44px] z-10">Pace Report</h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        Track budget utilization and pacing for revenue and ad spend, with projections for the current month.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center mb-6 md:mb-10 justify-start md:justify-end">
                    <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
                        <select
                            value={comparison}
                            onChange={(e) => setComparison(e.target.value)}
                            className="border px-4 py-2 rounded text-sm bg-white w-full md:w-auto"
                        >
                            <option>Previous Year</option>
                            <option>Previous Period</option>
                        </select>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                            <span className="text-gray-400 hidden md:inline">→</span>
                            <span className="text-gray-400 md:hidden">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-6">
                    <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-sm">{chartComponents[activeChartIndex].title}</p>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => navigateChart('prev')} 
                                    className="text-sm bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                    <FaChevronLeft size={12} />
                                </button>
                                <button 
                                    onClick={() => navigateChart('next')} 
                                    className="text-sm bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                    <FaChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="h-[210px]">
                            {chartComponents[activeChartIndex].chart}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {chartComponents[activeChartIndex].metrics.map((item, i) => (
                                item.input ? (
                                    <div key={i} className={i === 0 && activeChartIndex === 1 ? "col-span-2" : ""}>
                                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={item.onChange}
                                            className="w-full border border-gray-300 rounded px-3 py-1 text-xs"
                                            placeholder={item.placeholder}
                                        />
                                    </div>
                                ) : item.select ? (
                                    <div key={i} className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                        <select
                                            value={item.value}
                                            onChange={item.onChange}
                                            className="w-full border border-gray-300 rounded px-3 py-1 text-xs"
                                        >
                                            {item.options.map(option => (
                                                <option key={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div key={i}>
                                        <p className="text-xs text-gray-500">{item.label}</p>
                                        <p className="text-sm font-semibold">{item.value}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 gap-1">
                        {chartComponents.map((_, index) => (
                            <span 
                                key={index} 
                                className={`block w-2 h-2 rounded-full ${index === activeChartIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Charts Layout */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Ad Spend Budget</p>
                        </div>
                        <div className="h-[280px]">
                            <Line data={budgetChartData} options={chartOptions} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500 mb-2">Ad Spend Budget</p>
                                <input
                                    type="text"
                                    value={adSpendBudget}
                                    onChange={(e) => setAdSpendBudget(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                                    placeholder="kr. 100,000"
                                />
                            </div>
                            <div className="hidden">
                                <p className="text-sm text-gray-500">ROAS</p>
                                <p className="text-lg font-semibold">{totals.roas.toFixed(2)}x</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ad Spend</p>
                                <p className="text-lg font-semibold">kr. {Math.round(totals.ad_spend).toLocaleString("en-US")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pace Ratio</p>
                                <p className="text-lg font-semibold">
                                    {totals.ad_spend_pace_ratio.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Pace</p>
                        </div>
                        <div className="h-[280px]">
                            <Line data={paceChartData} options={chartOptions} />
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
                                <p className="text-sm text-gray-500 mb-2">{metric} Budget</p>
                                <input
                                    type="text"
                                    value={metric === "Revenue" ? revenueBudget : ordersBudget}
                                    onChange={(e) => metric === "Revenue" ? setRevenueBudget(e.target.value) : setOrdersBudget(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                                    placeholder={metric === "Revenue" ? "kr. 500,000" : "1000"}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current {metric}</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue"
                                        ? `kr. ${Math.round(totals.revenue).toLocaleString("en-US")}`
                                        : Math.round(totals.orders).toLocaleString("en-US")
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{metric} Pace</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue"
                                        ? `kr. ${Math.round(totals.revenue_pace).toLocaleString("en-US")}`
                                        : Math.round(totals.orders_pace).toLocaleString("en-US")
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pace Ratio</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue"
                                        ? totals.revenue_pace_ratio.toFixed(2)
                                        : totals.orders_pace_ratio.toFixed(2)
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Daily {metric} Gap</p>
                                <p className="text-lg font-semibold">
                                    {metric === "Revenue"
                                        ? `kr. ${Math.round(totals.daily_revenue_gap).toLocaleString("en-US")}`
                                        : Math.round(totals.daily_orders_gap).toLocaleString("en-US")
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}