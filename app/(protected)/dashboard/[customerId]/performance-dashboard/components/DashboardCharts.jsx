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
        primary: "var(--color-dark-green)",
        hue1: "var(--color-green)",
        hue2: "var(--color-lime)",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    const revenueChartData = useMemo(() => {
        const sourceData = revenueViewMode === "YTD" ? monthlyYTDData : validChartData;
        const compData = revenueViewMode === "YTD" ? monthlyYTDComparisonData : comparisonData;

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
                    borderDash: [2, 5],
                },
            ],
        };
    }, [revenueViewMode, monthlyYTDData, validChartData, monthlyYTDComparisonData, comparisonData, colors, formatMonthLabel, comparison]);

    const aovChartData = useMemo(() => {
        const sourceData = aovViewMode === "YTD" ? monthlyYTDData : validChartData;
        const compData = aovViewMode === "YTD" ? monthlyYTDComparisonData : comparisonData;

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
                    borderDash: [2, 5],
                },
            ],
        };
    }, [aovViewMode, monthlyYTDData, monthlyYTDComparisonData, validChartData, comparisonData, colors, comparison, formatMonthLabel, formatComparisonDate]);

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

    const sessionsChartData = useMemo(() => {
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

    const spendAllocationLineChartData = useMemo(() => {
        const sourceData = spendViewMode === "YTD" ? monthlyYTDData : validChartData;
    
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
                }
            ],
        };
    }, [spendViewMode, monthlyYTDData, validChartData, colors, formatMonthLabel]);
    
    const getChartOptions = (viewMode) => {
        return {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: viewMode === "YTD" ? "category" : "time",
                    time: viewMode === "YTD" ? undefined : { unit: "day" },
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

    const ViewModeToggle = ({ viewMode, setViewMode }) => (
        <div className="flex items-center">
            <button
                onClick={() => setViewMode(viewMode === "YTD" ? "Period" : "YTD")}
                className="flex items-center text-xs px-3 py-1.5 bg-[var(--color-natural)] hover:bg-[var(--color-lime)] text-[var(--color-dark-green)] hover:text-white rounded-md ml-2 transition-colors duration-200"
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
                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Revenue (Inc VAT)</p>
                        <ViewModeToggle viewMode={revenueViewMode} setViewMode={setRevenueViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Spend Allocation</p>
                        <ViewModeToggle viewMode={spendViewMode} setViewMode={setSpendViewMode} />
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
                        <ViewModeToggle viewMode={aovViewMode} setViewMode={setAovViewMode} />
                    </div>
                    <div className="w-full h-[calc(100%-2rem)]">
                        <Line data={aovChartData} options={aovChartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-[var(--color-natural)] rounded-lg p-6 h-[300px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-[var(--color-dark-green)]">Sessions Per Channel Group</p>
                        <ViewModeToggle viewMode={sessionsViewMode} setViewMode={setSessionsViewMode} />
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