import { useState, useMemo } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { HiOutlineCalendar } from "react-icons/hi2";

export default function DashboardCharts({
    revenueViewMode, setRevenueViewMode,
    spendViewMode, setSpendViewMode,
    aovViewMode, setAovViewMode,
    sessionsViewMode, setSessionsViewMode,
    revenuePeriodGranularity, setRevenuePeriodGranularity,
    spendPeriodGranularity, setSpendPeriodGranularity,
    aovPeriodGranularity, setAovPeriodGranularity,
    sessionsPeriodGranularity, setSessionsPeriodGranularity,
    monthlyYTDData, monthlyYTDComparisonData,
    validChartData, comparisonData,
    currentMetrics, comparison,
    formatMonthLabel, formatComparisonDate
}) {
    const [activeChartIndex, setActiveChartIndex] = useState(0);

    const colors = {
        primary: "var(--color-dark-green)",
        hue1: "var(--color-green)",
        hue2: "var(--color-lime)",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    // Weekly aggregation utility function
    const aggregateDataByWeek = (dataArray) => {
        const weeklyData = {};
        
        dataArray.forEach(row => {
            const date = new Date(row.date);
            // Get Monday of the week (ISO week)
            const monday = new Date(date);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            monday.setDate(diff);
            
            const weekKey = monday.toISOString().split('T')[0];
            
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    date: weekKey,
                    revenue: 0,
                    gross_profit: 0,
                    orders: 0,
                    cost: 0,
                    google_ads_cost: 0,
                    meta_spend: 0,
                    impressions: 0,
                    sessions: 0,
                    channel_sessions: {},
                    count: 0
                };
            }
            
            // Aggregate values
            weeklyData[weekKey].revenue += row.revenue || 0;
            weeklyData[weekKey].gross_profit += row.gross_profit || 0;
            weeklyData[weekKey].orders += row.orders || 0;
            weeklyData[weekKey].cost += row.cost || 0;
            weeklyData[weekKey].google_ads_cost += row.google_ads_cost || 0;
            weeklyData[weekKey].meta_spend += row.meta_spend || 0;
            weeklyData[weekKey].impressions += row.impressions || 0;
            weeklyData[weekKey].sessions += row.sessions || 0;
            weeklyData[weekKey].count += 1;
            
            // Aggregate channel sessions
            if (row.channel_sessions) {
                Object.entries(row.channel_sessions).forEach(([channel, sessions]) => {
                    weeklyData[weekKey].channel_sessions[channel] = 
                        (weeklyData[weekKey].channel_sessions[channel] || 0) + sessions;
                });
            }
        });
        
        // Calculate averages and derived metrics
        Object.values(weeklyData).forEach(week => {
            week.roas = week.cost > 0 ? week.revenue / week.cost : 0;
            week.poas = week.cost > 0 ? week.gross_profit / week.cost : 0;
            week.aov = week.orders > 0 ? week.revenue / week.orders : 0;
        });
        
        return Object.values(weeklyData).sort((a, b) => a.date.localeCompare(b.date));
    };

    // Function to format week labels
    const formatWeekLabel = (weekStartDate) => {
        const date = new Date(weekStartDate);
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + 6);
        
        const startMonth = date.toLocaleString('default', { month: 'short' });
        const endMonth = endDate.toLocaleString('default', { month: 'short' });
        const startDay = date.getDate();
        const endDay = endDate.getDate();
        
        if (startMonth === endMonth) {
            return `${startMonth} ${startDay}-${endDay}`;
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        }
    };

    const revenueChartData = useMemo(() => {
        let sourceData, compData;
        
        if (revenueViewMode === "YTD") {
            sourceData = monthlyYTDData;
            compData = monthlyYTDComparisonData;
        } else {
            // Period mode - check granularity
            if (revenuePeriodGranularity === "Weekly") {
                sourceData = aggregateDataByWeek(validChartData);
                compData = aggregateDataByWeek(comparisonData);
            } else {
                sourceData = validChartData;
                compData = comparisonData;
            }
        }

        const labels = sourceData.map((row) => {
            if (revenueViewMode === "YTD") {
                return formatMonthLabel(row.date);
            } else if (revenuePeriodGranularity === "Weekly") {
                return formatWeekLabel(row.date);
            } else {
                return row.date;
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: `Revenue${revenueViewMode === "YTD" ? " (YTD)" : revenuePeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: sourceData.map((row) => row.revenue || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `Revenue (${comparison})${revenueViewMode === "YTD" ? " (YTD)" : revenuePeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: compData.map((row) => row.revenue || 0),
                    borderColor: colors.hue3,
                    backgroundColor: colors.hue3,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [2, 5],
                },
            ],
        };
    }, [revenueViewMode, revenuePeriodGranularity, monthlyYTDData, validChartData, monthlyYTDComparisonData, comparisonData, colors, formatMonthLabel, formatWeekLabel, comparison]);

    const aovChartData = useMemo(() => {
        let sourceData, compData;
        
        if (aovViewMode === "YTD") {
            sourceData = monthlyYTDData;
            compData = monthlyYTDComparisonData;
        } else {
            // Period mode - check granularity
            if (aovPeriodGranularity === "Weekly") {
                sourceData = aggregateDataByWeek(validChartData);
                compData = aggregateDataByWeek(comparisonData);
            } else {
                sourceData = validChartData;
                compData = comparisonData;
            }
        }

        const labels = sourceData.map((row) => {
            if (aovViewMode === "YTD") {
                return formatMonthLabel(row.date);
            } else if (aovPeriodGranularity === "Weekly") {
                return formatWeekLabel(row.date);
            } else {
                return row.date;
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: `AOV${aovViewMode === "YTD" ? " (YTD)" : aovPeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: sourceData.map((row) => row.aov || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `AOV (${comparison})${aovViewMode === "YTD" ? " (YTD)" : aovPeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: aovViewMode === "YTD" || aovPeriodGranularity === "Weekly"
                        ? compData.map((row) => row.aov || 0)
                        : compData.map((row) => ({
                            x: formatComparisonDate(row.date),
                            y: row.aov || 0,
                        })),
                    borderColor: colors.hue3,
                    backgroundColor: colors.hue3,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [2, 5],
                },
            ],
        };
    }, [aovViewMode, aovPeriodGranularity, monthlyYTDData, monthlyYTDComparisonData, validChartData, comparisonData, colors, comparison, formatMonthLabel, formatWeekLabel, formatComparisonDate]);

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

    const spendAllocationPercentages = useMemo(() => {
        const totalSpend = (currentMetrics.google_ads_cost || 0) + (currentMetrics.meta_spend || 0);
        return {
            google: totalSpend > 0 ? ((currentMetrics.google_ads_cost || 0) / totalSpend) * 100 : 0,
            meta: totalSpend > 0 ? ((currentMetrics.meta_spend || 0) / totalSpend) * 100 : 0,
        };
    }, [currentMetrics.google_ads_cost, currentMetrics.meta_spend]);

    const sessionsChartData = useMemo(() => {
        // Sessions chart uses current aggregated metrics regardless of view mode
        // since it shows channel distribution rather than time series
        const entries = Object.entries(currentMetrics.channel_sessions || {})
            .sort((a, b) => b[1] - a[1]);

        const viewLabel = sessionsViewMode === "YTD" ? " (YTD)" : 
                         sessionsPeriodGranularity === "Weekly" ? " (Weekly)" : "";

        return {
            labels: entries.map(([channel]) => channel),
            datasets: [
                {
                    label: `Sessions${viewLabel}`,
                    data: entries.map(([_, sessions]) => sessions),
                    backgroundColor: [
                        colors.primary,
                        colors.hue1,
                        colors.hue2,
                        colors.hue3,
                        colors.hue4,
                        "#4963BE",
                        "#9BABE1",
                        "#6E82D0",
                        "#2E4CA8",
                        "#1C398E",
                        "#D6CDB6",
                        "#c0b8a3",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [currentMetrics.channel_sessions, sessionsViewMode, sessionsPeriodGranularity, colors]);

    const spendAllocationLineChartData = useMemo(() => {
        let sourceData;
        
        if (spendViewMode === "YTD") {
            sourceData = monthlyYTDData;
        } else {
            // Period mode - check granularity
            if (spendPeriodGranularity === "Weekly") {
                sourceData = aggregateDataByWeek(validChartData);
            } else {
                sourceData = validChartData;
            }
        }

        const labels = sourceData.map((row) => {
            if (spendViewMode === "YTD") {
                return formatMonthLabel(row.date);
            } else if (spendPeriodGranularity === "Weekly") {
                return formatWeekLabel(row.date);
            } else {
                return row.date;
            }
        });

        const totalSpend = sourceData.map((row) => (row.google_ads_cost || 0) + (row.meta_spend || 0));

        return {
            labels,
            datasets: [
                {
                    label: `Google Ads${spendViewMode === "YTD" ? " (YTD)" : spendPeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: sourceData.map((row) => row.google_ads_cost || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const datasetLabel = context.dataset.label || "";
                                const value = context.raw || 0;
                                return `${datasetLabel}: ${value.toLocaleString('en-US')} DKK`;
                            },
                        },
                    },
                },
                {
                    label: `Meta${spendViewMode === "YTD" ? " (YTD)" : spendPeriodGranularity === "Weekly" ? " (Weekly)" : ""}`,
                    data: sourceData.map((row) => row.meta_spend || 0),
                    borderColor: colors.hue4,
                    backgroundColor: colors.hue4,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const datasetLabel = context.dataset.label || "";
                                const value = context.raw || 0;
                                return `${datasetLabel}: ${value.toLocaleString('en-US')} DKK`;
                            },
                        },
                    },
                },
            ],
        };
    }, [spendViewMode, spendPeriodGranularity, monthlyYTDData, validChartData, colors, formatMonthLabel, formatWeekLabel]);
    
    const getChartOptions = (viewMode, periodGranularity) => {
        let xAxisType, timeUnit;
        
        if (viewMode === "YTD") {
            xAxisType = "category";
            timeUnit = undefined;
        } else if (periodGranularity === "Weekly") {
            xAxisType = "category";
            timeUnit = undefined;
        } else {
            xAxisType = "time";
            timeUnit = { unit: "day" };
        }

        return {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: xAxisType,
                    time: timeUnit,
                    grid: { display: false },
                    ticks: { font: { size: 10 }, color: "var(--color-green)" },
                },
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: "#e5e7eb", // Light gray color
                        lineWidth: 0.5 // Make lines thinner and more subtle
                    },
                    ticks: { font: { size: 10 }, color: "var(--color-green)" },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "var(--color-dark-green)",
                    titleFont: { size: 12 },
                    bodyFont: { size: 10 },
                    padding: 8,
                    cornerRadius: 4,
                },
                datalabels: {
                    display: false,
                },
            },
            responsive: true,
        };
    };

    const revenueChartOptions = getChartOptions(revenueViewMode, revenuePeriodGranularity);
    const aovChartOptions = getChartOptions(aovViewMode, aovPeriodGranularity);
    const spendChartOptions = getChartOptions(spendViewMode, spendPeriodGranularity);

    const pieChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 10 },
                    padding: 10,
                    color: "var(--color-dark-green)",
                },
            },
            tooltip: {
                backgroundColor: "var(--color-dark-green)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${Math.round(value).toLocaleString('en-US')} DKK`;
                    },
                },
            },
            datalabels: {
                color: "#fff",
                font: { size: 10, weight: "bold" },
                formatter: (value) => `${Math.round(value).toLocaleString('en-US')} DKK`,
                anchor: "center",
                align: "center",
            },
        },
        responsive: true,
    };

    const barChartOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                grid: { 
                    color: "#e5e7eb", // Light gray color
                    lineWidth: 0.5 // Make lines thinner and more subtle
                },
                ticks: {
                    font: { size: 10 },
                    color: "var(--color-green)",
                    callback: (value) => value.toLocaleString('en-US')
                },
                title: {
                    display: true,
                    text: "Sessions",
                    font: { size: 12 },
                    color: "var(--color-dark-green)",
                },
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: "var(--color-green)" },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "var(--color-dark-green)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || "";
                        const value = context.raw || 0;
                        return `${value.toLocaleString('en-US')} sessions`;
                    },
                },
            },
            datalabels: {
                color: "#fff",
                font: { size: 10, weight: "bold" },
                formatter: (value) => value.toLocaleString('en-US'),
                anchor: "end",
                align: "start",
                display: function (context) {
                    return context.dataset.data[context.dataIndex] > 500;
                },
            },
        },
        responsive: true,
    };

    const chartComponents = [
        {
            title: "Revenue",
            chart: <Line data={revenueChartData} options={revenueChartOptions} />,
            viewMode: revenueViewMode,
            setViewMode: setRevenueViewMode,
            periodGranularity: revenuePeriodGranularity,
            setPeriodGranularity: setRevenuePeriodGranularity
        },
        {
            title: "Spend Allocation",
            chart: <Line data={spendAllocationLineChartData} options={spendChartOptions} />,
            viewMode: spendViewMode,
            setViewMode: setSpendViewMode,
            periodGranularity: spendPeriodGranularity,
            setPeriodGranularity: setSpendPeriodGranularity
        },
        {
            title: "Average Order Value",
            chart: <Line data={aovChartData} options={aovChartOptions} />,
            viewMode: aovViewMode,
            setViewMode: setAovViewMode,
            periodGranularity: aovPeriodGranularity,
            setPeriodGranularity: setAovPeriodGranularity
        },
        {
            title: "Sessions Per Channel Group",
            chart: <Bar data={sessionsChartData} options={barChartOptions} />,
            viewMode: sessionsViewMode,
            setViewMode: setSessionsViewMode,
            periodGranularity: sessionsPeriodGranularity,
            setPeriodGranularity: setSessionsPeriodGranularity
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

    const ViewModeToggle = ({ viewMode, setViewMode, periodGranularity, setPeriodGranularity }) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setViewMode(viewMode === "YTD" ? "Period" : "YTD")}
                className="flex items-center text-xs px-3 py-1.5 bg-[var(--color-natural)] hover:bg-[var(--color-lime)] text-[var(--color-dark-green)] hover:text-white rounded-md transition-colors duration-200"
                title={viewMode === "YTD" ? "Switch to Period view" : "Switch to YTD view"}
            >
                <HiOutlineCalendar className="mr-1" />
                {viewMode}
            </button>
            
            {viewMode === "Period" && (
                <div className="flex items-center bg-[var(--color-natural)] rounded-md overflow-hidden">
                    <button
                        onClick={() => setPeriodGranularity("Daily")}
                        className={`text-xs px-2 py-1.5 transition-colors duration-200 ${
                            periodGranularity === "Daily" 
                                ? "bg-[var(--color-lime)] text-white" 
                                : "text-[var(--color-dark-green)] hover:bg-[var(--color-lime)] hover:text-white"
                        }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setPeriodGranularity("Weekly")}
                        className={`text-xs px-2 py-1.5 transition-colors duration-200 ${
                            periodGranularity === "Weekly" 
                                ? "bg-[var(--color-lime)] text-white" 
                                : "text-[var(--color-dark-green)] hover:bg-[var(--color-lime)] hover:text-white"
                        }`}
                    >
                        Weekly
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Charts - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Revenue (Inc VAT)</p>
                        <ViewModeToggle 
                            viewMode={revenueViewMode} 
                            setViewMode={setRevenueViewMode}
                            periodGranularity={revenuePeriodGranularity}
                            setPeriodGranularity={setRevenuePeriodGranularity}
                        />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Spend Allocation</p>
                        <ViewModeToggle 
                            viewMode={spendViewMode} 
                            setViewMode={setSpendViewMode}
                            periodGranularity={spendPeriodGranularity}
                            setPeriodGranularity={setSpendPeriodGranularity}
                        />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={spendAllocationLineChartData} options={spendChartOptions} />
                    </div>
                </div>
            </div>

            <div className="hidden md:grid md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Average Order Value</p>
                        <ViewModeToggle 
                            viewMode={aovViewMode} 
                            setViewMode={setAovViewMode}
                            periodGranularity={aovPeriodGranularity}
                            setPeriodGranularity={setAovPeriodGranularity}
                        />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={aovChartData} options={aovChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Sessions Per Channel Group</p>
                        <ViewModeToggle 
                            viewMode={sessionsViewMode} 
                            setViewMode={setSessionsViewMode}
                            periodGranularity={sessionsPeriodGranularity}
                            setPeriodGranularity={setSessionsPeriodGranularity}
                        />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Bar data={sessionsChartData} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {/* Mobile Chart Carousel */}
            <div className="md:hidden mb-8">
                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-4 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</p>
                        <div className="flex gap-2 items-center">
                            <ViewModeToggle
                                viewMode={chartComponents[activeChartIndex].viewMode}
                                setViewMode={chartComponents[activeChartIndex].setViewMode}
                                periodGranularity={chartComponents[activeChartIndex].periodGranularity}
                                setPeriodGranularity={chartComponents[activeChartIndex].setPeriodGranularity}
                            />
                            <button
                                onClick={() => navigateChart('prev')}
                                className="text-sm bg-[var(--color-natural)] hover:bg-[var(--color-lime)] text-[var(--color-dark-green)] hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                                &larr;
                            </button>
                            <button
                                onClick={() => navigateChart('next')}
                                className="text-sm bg-[var(--color-natural)] hover:bg-[var(--color-lime)] text-[var(--color-dark-green)] hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        {chartComponents[activeChartIndex].chart}
                    </div>
                </div>
                <div className="flex justify-center mt-3 gap-1">
                    {chartComponents.map((_, index) => (
                        <span
                            key={index}
                            className={`block w-2 h-2 rounded-full ${index === activeChartIndex ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-natural)]'}`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}