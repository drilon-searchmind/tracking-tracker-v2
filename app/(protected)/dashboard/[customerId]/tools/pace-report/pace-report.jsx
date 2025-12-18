"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft, FaCalendarAlt, FaTrendUp, FaTrendDown } from "react-icons/fa";
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
import currencyExchangeData from "@/lib/static-data/currencyApiValues.json";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Currency conversion utility
const convertCurrency = (amount, fromCurrency, toCurrency = "DKK") => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    const exchangeData = currencyExchangeData.data;
    
    if (!exchangeData[fromCurrency] || !exchangeData[toCurrency]) {
        console.warn(`Currency conversion failed: ${fromCurrency} to ${toCurrency}`);
        return amount;
    }
    
    // Convert from source currency to USD, then to target currency
    const amountInUSD = amount / exchangeData[fromCurrency].value;
    const convertedAmount = amountInUSD * exchangeData[toCurrency].value;
    
    return convertedAmount;
};

// Apply currency conversion to a data row
const convertDataRow = (row, fromCurrency, shouldConvertCurrency) => {
    if (fromCurrency === "DKK" || !shouldConvertCurrency) return row;
    
    const convertedRow = { ...row };
    
    // Convert revenue field
    if (convertedRow.revenue !== undefined && convertedRow.revenue !== null) {
        convertedRow.revenue = convertCurrency(convertedRow.revenue, fromCurrency);
    }
    
    return convertedRow;
};

export default function PaceReport({ customerId, customerName, customerValutaCode, initialData, customerRevenueType }) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            console.warn('Invalid date encountered:', date);
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [revenueBudget, setRevenueBudget] = useState("500000");
    const [ordersBudget, setOrdersBudget] = useState("1000");
    const [adSpendBudget, setAdSpendBudget] = useState("100000");
    const [metric, setMetric] = useState("Revenue");
    const [tempStartDate, setTempStartDate] = useState(formatDate(firstDayOfMonth));
    const [tempEndDate, setTempEndDate] = useState(formatDate(yesterday));
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [changeCurrency, setChangeCurrency] = useState(true);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);

    const end = new Date(dateEnd);
    const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

    useEffect(() => {
        const fetchCustomerSettings = async () => {
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChangeCurrency(data.changeCurrency ?? true);
                }
            } catch (error) {
                console.error("Error fetching customer settings:", error);
            }
        }

        fetchCustomerSettings()
    }, [customerId]);

    const fetchPaceData = async (startDate, endDate) => {
        setIsFetchingData(true);
        try {
            const response = await fetch(
                `/api/pace-report/${customerId}?startDate=${startDate}&endDate=${endDate}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch Pace Report data');
            }
            
            const data = await response.json();
            setFetchedData(data);
        } catch (error) {
            console.error('Error fetching Pace Report data:', error);
        } finally {
            setIsFetchingData(false);
        }
    };

    const handleApplyDates = () => {
        setDateStart(tempStartDate);
        setDateEnd(tempEndDate);
        fetchPaceData(tempStartDate, tempEndDate);
    };

    if (!initialData || !initialData.daily_metrics) {
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

    const daily_metrics = fetchedData?.data || initialData?.daily_metrics || [];

    const filteredMetrics = useMemo(() => {
        const filtered = daily_metrics
            .filter(row => row.date >= dateStart && row.date <= dateEnd)
            .map(row => {
                const convertedRow = convertDataRow(row, customerValutaCode, changeCurrency);
                return {
                    ...convertedRow,
                    revenue: customerRevenueType === "net_sales" ? convertedRow.net_sales : convertedRow.revenue,
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));
        return filtered;
    }, [daily_metrics, dateStart, dateEnd, customerValutaCode, changeCurrency, customerRevenueType]);

    const cumulativeMetrics = useMemo(() => {
        let cumOrders = 0, cumRevenue = 0, cumNetSales = 0, cumAdSpend = 0;
        const result = filteredMetrics.map(row => {
            cumOrders += Number(row.orders || 0);
            cumRevenue += Number(row.revenue || 0);
            cumNetSales += Number(row.net_sales || 0); // Accumulate net_sales
            cumAdSpend += Number(row.ad_spend || 0);
            return {
                date: row.date,
                orders: cumOrders,
                revenue: cumRevenue,
                net_sales: cumNetSales, // Include net_sales in cumulative metrics
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

        const start = new Date(dateStart);
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
            net_sales: aggregated.net_sales || 0, // Ensure net_sales is included
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
    }, [cumulativeMetrics, revenueBudget, ordersBudget, adSpendBudget, dateStart, dateEnd, daysInMonth]);

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

    const paceChartLabels = cumulativeMetrics.map(row => row.date);
    const paceChartValues = cumulativeMetrics;

    const paceChartData = {
        labels: paceChartLabels,
        datasets: [
            {
                label: customerRevenueType === 'net_sales' ? 'Net Sales' : 'Revenue',
                data: paceChartValues.map(value => customerRevenueType === 'net_sales' ? value.net_sales : value.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Orders',
                data: paceChartValues.map(value => value.orders),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };

    const getChartOptions = (chartType) => ({
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
                padding: 8,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        
                        if (chartType === 'pace' && (metric === "Orders" || label.includes("Orders"))) {
                            return `${label}: ${value.toLocaleString("en-US")}`;
                        }
                        
                        return `${label}: kr. ${value.toLocaleString("en-US")}`;
                    }
                }
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
                        if (chartType === 'pace' && metric === "Orders") {
                            return value.toLocaleString("en-US");
                        }
                        return `kr. ${value.toLocaleString("en-US")}`;
                    }
                },
                title: {
                    display: false,
                    text: chartType === 'budget' ? "Ad Spend (kr.)" : 
                          (metric === "Revenue" ? "kr." : "Count"),
                    font: { size: 10, family: "'Inter', sans-serif" },
                    color: "#4b5563"
                },
                beginAtZero: true
            }
        }
    });

    const chartComponents = [
        {
            title: "Ad Spend Budget",
            chart: <Line data={budgetChartData} options={getChartOptions('budget')} />,
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
            chart: <Line data={paceChartData} options={getChartOptions('pace')} />,
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
                        ? `kr. ${Math.round(customerRevenueType === "net_sales" ? totals.net_sales : totals.revenue).toLocaleString("en-US")}`
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
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
            {/* Loading Overlay - positioned at top level */}
            {isFetchingData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4 border-2 border-[var(--color-lime)]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--color-lime)]"></div>
                        <p className="text-[var(--color-dark-green)] font-medium">Loading Pace Report data...</p>
                    </div>
                </div>
            )}
            
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
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Pace Report</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Track budget utilization and pacing for revenue and ad spend, with projections for the current month.
                    </p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-end">
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Date Range:</label>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                    <input
                                        type="date"
                                        value={tempStartDate}
                                        onChange={(e) => setTempStartDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={tempEndDate}
                                        onChange={(e) => setTempEndDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                            
                            <button
                                onClick={handleApplyDates}
                                disabled={isFetchingData}
                                className="bg-[var(--color-lime)] hover:bg-[var(--color-lime-dark)] text-[var(--color-dark-green)] font-medium px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto justify-center"
                            >
                                {isFetchingData ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-dark-green)]"></div>
                                        Loading...
                                    </>
                                ) : (
                                    'Apply'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-6">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-sm text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</p>
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
                        <div className="h-[210px]">
                            {chartComponents[activeChartIndex].chart}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {chartComponents[activeChartIndex].metrics.map((item, i) => (
                                item.input ? (
                                    <div key={i} className={i === 0 && activeChartIndex === 1 ? "col-span-2" : ""}>
                                        <p className="text-xs text-[var(--color-green)] mb-1">{item.label}</p>
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={item.onChange}
                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-1 text-xs text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                            placeholder={item.placeholder}
                                        />
                                    </div>
                                ) : item.select ? (
                                    <div key={i} className="col-span-2">
                                        <p className="text-xs text-[var(--color-green)] mb-1">{item.label}</p>
                                        <select
                                            value={item.value}
                                            onChange={item.onChange}
                                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-1 text-xs text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                        >
                                            {item.options.map(option => (
                                                <option key={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div key={i}>
                                        <p className="text-xs text-[var(--color-green)]">{item.label}</p>
                                        <p className="text-sm font-semibold text-[var(--color-dark-green)]">{item.value}</p>
                                    </div>
                                )
                            ))}
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

                {/* Desktop Charts Layout */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-[var(--color-dark-green)]">Ad Spend Budget</p>
                        </div>
                        <div className="h-[280px]">
                            <Line data={budgetChartData} options={getChartOptions('budget')} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <p className="text-sm text-[var(--color-green)] mb-2">Ad Spend Budget</p>
                                <input
                                    type="text"
                                    value={adSpendBudget}
                                    onChange={(e) => setAdSpendBudget(e.target.value)}
                                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-4 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    placeholder="kr. 100,000"
                                />
                            </div>
                            <div className="hidden">
                                <p className="text-sm text-[var(--color-green)]">ROAS</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">{totals.roas.toFixed(2)}x</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">Ad Spend</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">kr. {Math.round(totals.ad_spend).toLocaleString("en-US")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">Pace Ratio</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">
                                    {totals.ad_spend_pace_ratio.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-[var(--color-dark-green)]">Pace</p>
                        </div>
                        <div className="h-[280px]">
                            <Line data={paceChartData} options={getChartOptions('pace')} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[var(--color-green)] mb-2">Metric</p>
                                <select
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-4 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                >
                                    <option>Revenue</option>
                                    <option>Orders</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)] mb-2">{metric} Budget</p>
                                <input
                                    type="text"
                                    value={metric === "Revenue" ? revenueBudget : ordersBudget}
                                    onChange={(e) => metric === "Revenue" ? setRevenueBudget(e.target.value) : setOrdersBudget(e.target.value)}
                                    className="w-full border border-[var(--color-dark-natural)] rounded-lg px-4 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    placeholder={metric === "Revenue" ? "kr. 500,000" : "1000"}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">Current {metric}</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">
                                    {metric === "Revenue"
                                        ? `kr. ${Math.round(customerRevenueType === "net_sales" ? totals.net_sales : totals.revenue).toLocaleString("en-US")}`
                                        : Math.round(totals.orders).toLocaleString("en-US")
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">{metric} Pace</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">
                                    {metric === "Revenue"
                                        ? `kr. ${Math.round(totals.revenue_pace).toLocaleString("en-US")}`
                                        : Math.round(totals.orders_pace).toLocaleString("en-US")
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">Pace Ratio</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">
                                    {metric === "Revenue"
                                        ? totals.revenue_pace_ratio.toFixed(2)
                                        : totals.orders_pace_ratio.toFixed(2)
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-green)]">Daily {metric} Gap</p>
                                <p className="text-lg font-semibold text-[var(--color-dark-green)]">
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