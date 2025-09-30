import { useState, useMemo } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { HiOutlineCalendar } from "react-icons/hi2";

export default function DashboardCharts({
    revenueViewMode, setRevenueViewMode,
    spendViewMode, setSpendViewMode,
    aovViewMode, setAovViewMode,
    sessionsViewMode, setSessionsViewMode,
    monthlyYTDData, monthlyYTDComparisonData,
    validChartData, comparisonData,
    currentMetrics, comparison,
    formatMonthLabel, formatComparisonDate
}) {
    const [activeChartIndex, setActiveChartIndex] = useState(0);

    const colors = {
        primary: "#1C398E",
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    // Revenue chart data setup - Toggle between YTD and Period
    const revenueChartData = useMemo(() => {
        const sourceData = revenueViewMode === "YTD" ? monthlyYTDData : validChartData;
        const compData = revenueViewMode === "YTD" ? monthlyYTDComparisonData : comparisonData;

        // Format labels based on view mode
        const labels = sourceData.map((row) => revenueViewMode === "YTD" ? formatMonthLabel(row.date) : row.date);

        return {
            labels,
            datasets: [
                {
                    label: `Revenue${revenueViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: sourceData.map((row) => row.revenue || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `Revenue (${comparison})${revenueViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: compData.map((row) => row.revenue || 0),
                    borderColor: colors.hue3,
                    backgroundColor: colors.hue3,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [5, 5], // Dashed line for comparison
                },
            ],
        };
    }, [revenueViewMode, monthlyYTDData, validChartData, monthlyYTDComparisonData, comparisonData, colors, formatMonthLabel, comparison]);

    // AOV chart data setup - Toggle between YTD and Period
    const aovChartData = useMemo(() => {
        const sourceData = aovViewMode === "YTD" ? monthlyYTDData : validChartData;
        const compData = aovViewMode === "YTD" ? monthlyYTDComparisonData : comparisonData;

        // Format labels based on view mode
        const labels = sourceData.map((row) => aovViewMode === "YTD" ? formatMonthLabel(row.date) : row.date);

        return {
            labels,
            datasets: [
                {
                    label: `AOV${aovViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: sourceData.map((row) => row.aov || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `AOV (${comparison})${aovViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: aovViewMode === "YTD"
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
                    borderDash: [5, 5], // Dashed line for comparison
                },
            ],
        };
    }, [aovViewMode, monthlyYTDData, monthlyYTDComparisonData, validChartData, comparisonData, colors, comparison, formatMonthLabel, formatComparisonDate]);

    // Spend allocation pie chart
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

    // Modified sessions chart data to display correctly with horizontal bar chart
    const sessionsChartData = useMemo(() => {
        // Sort entries by session count (descending)
        const entries = Object.entries(currentMetrics.channel_sessions || {})
            .sort((a, b) => b[1] - a[1]);

        return {
            labels: entries.map(([channel]) => channel),
            datasets: [
                {
                    label: "Sessions",
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
    }, [currentMetrics.channel_sessions, colors]);

    // Spend allocation line chart - Toggle between YTD and Period
    const spendAllocationLineChartData = useMemo(() => {
        const sourceData = spendViewMode === "YTD" ? monthlyYTDData : validChartData;
        const compData = spendViewMode === "YTD" ? monthlyYTDComparisonData : comparisonData;

        // Format labels based on view mode
        const labels = sourceData.map((row) => spendViewMode === "YTD" ? formatMonthLabel(row.date) : row.date);

        return {
            labels,
            datasets: [
                {
                    label: `Google Ads${spendViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: sourceData.map((row) => row.google_ads_cost || 0),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `Meta${spendViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: sourceData.map((row) => row.meta_spend || 0),
                    borderColor: colors.hue4,
                    backgroundColor: colors.hue4,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `Google Ads (${comparison})${spendViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: compData.map((row) => row.google_ads_cost || 0),
                    borderColor: colors.hue2,
                    backgroundColor: colors.hue2,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [5, 5], // Dashed line for comparison
                },
                {
                    label: `Meta (${comparison})${spendViewMode === "YTD" ? " (YTD)" : ""}`,
                    data: compData.map((row) => row.meta_spend || 0),
                    borderColor: colors.hue3,
                    backgroundColor: colors.hue3,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [5, 5], // Dashed line for comparison
                },
            ],
        };
    }, [spendViewMode, monthlyYTDData, validChartData, monthlyYTDComparisonData, comparisonData, colors, formatMonthLabel, comparison]);

    // Chart options
    const getChartOptions = (viewMode) => {
        return {
            maintainAspectRatio: false,
            scales: {
                x: {
                    // Use categorical scale for YTD mode, time scale for Period mode
                    type: viewMode === "YTD" ? "category" : "time",
                    time: viewMode === "YTD" ? undefined : { unit: "day" },
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
            responsive: true,
        };
    };

    const revenueChartOptions = getChartOptions(revenueViewMode);
    const aovChartOptions = getChartOptions(aovViewMode);
    const spendChartOptions = getChartOptions(spendViewMode);

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

    // Updated bar chart options for horizontal display
    const barChartOptions = {
        indexAxis: 'y', // This makes the bars horizontal
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: {
                    font: { size: 10 },
                    callback: (value) => value.toLocaleString('en-US')
                },
                title: {
                    display: true,
                    text: "Sessions",
                    font: { size: 12 },
                },
            },
            y: {
                grid: { display: false },
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
                    return context.dataset.data[context.dataIndex] > 500; // Only show labels for values > 500
                },
            },
        },
        responsive: true,
    };

    // Chart components for mobile carousel
    const chartComponents = [
        {
            title: "Revenue",
            chart: <Line data={revenueChartData} options={revenueChartOptions} />,
            viewMode: revenueViewMode,
            setViewMode: setRevenueViewMode
        },
        {
            title: "Spend Allocation",
            chart: <Line data={spendAllocationLineChartData} options={spendChartOptions} />,
            viewMode: spendViewMode,
            setViewMode: setSpendViewMode
        },
        {
            title: "Average Order Value",
            chart: <Line data={aovChartData} options={aovChartOptions} />,
            viewMode: aovViewMode,
            setViewMode: setAovViewMode
        },
        {
            title: "Sessions Per Channel Group",
            chart: <Bar data={sessionsChartData} options={barChartOptions} />,
            viewMode: sessionsViewMode,
            setViewMode: setSessionsViewMode
        }
    ];

    // Navigation for chart carousel
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

    // Toggle view mode button component
    const ViewModeToggle = ({ viewMode, setViewMode }) => (
        <div className="flex items-center">
            <button
                onClick={() => setViewMode(viewMode === "YTD" ? "Period" : "YTD")}
                className="flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded ml-2"
                title={viewMode === "YTD" ? "Switch to Period view" : "Switch to YTD view"}
            >
                <HiOutlineCalendar className="mr-1" />
                {viewMode}
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Charts - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold">Revenue</p>
                        <ViewModeToggle viewMode={revenueViewMode} setViewMode={setRevenueViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold">Spend Allocation</p>
                        <ViewModeToggle viewMode={spendViewMode} setViewMode={setSpendViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={spendAllocationLineChartData} options={spendChartOptions} />
                    </div>
                </div>
            </div>

            <div className="hidden md:grid md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold">Average Order Value</p>
                        <ViewModeToggle viewMode={aovViewMode} setViewMode={setAovViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={aovChartData} options={aovChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold">Sessions Per Channel Group</p>
                        <ViewModeToggle viewMode={sessionsViewMode} setViewMode={setSessionsViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Bar data={sessionsChartData} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {/* Mobile Chart Carousel */}
            <div className="md:hidden mb-8">
                <div className="bg-white border border-zinc-200 rounded-lg p-4 h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold">{chartComponents[activeChartIndex].title}</p>
                        <div className="flex gap-2 items-center">
                            <ViewModeToggle
                                viewMode={chartComponents[activeChartIndex].viewMode}
                                setViewMode={chartComponents[activeChartIndex].setViewMode}
                            />
                            <button
                                onClick={() => navigateChart('prev')}
                                className="text-sm bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center"
                            >
                                &larr;
                            </button>
                            <button
                                onClick={() => navigateChart('next')}
                                className="text-sm bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center"
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
                            className={`block w-2 h-2 rounded-full ${index === activeChartIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}