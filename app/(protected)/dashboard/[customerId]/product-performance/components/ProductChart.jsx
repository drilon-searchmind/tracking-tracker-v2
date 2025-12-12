import { useMemo } from "react";
import { Line } from "react-chartjs-2";

export default function ProductChart({ dailyMetrics, selectedMetric, colors, viewMode, granularity }) {
    const chartData = useMemo(() => {
        if (!dailyMetrics || dailyMetrics.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Aggregate data by date
        const aggregatedData = dailyMetrics.reduce((acc, metric) => {
            const date = metric.order_date;
            if (!acc[date]) {
                acc[date] = {
                    date,
                    daily_revenue: 0,
                    daily_quantity: 0,
                    daily_orders: 0
                };
            }
            acc[date].daily_revenue += metric.daily_revenue || 0;
            acc[date].daily_quantity += metric.daily_quantity || 0;
            acc[date].daily_orders += metric.daily_orders || 0;
            return acc;
        }, {});

        const sortedData = Object.values(aggregatedData).sort((a, b) => new Date(a.date) - new Date(b.date));

        const getMetricValue = (item) => {
            switch (selectedMetric) {
                case "Revenue":
                    return item.daily_revenue || 0;
                case "Quantity":
                case "Quantity Sold":
                    return item.daily_quantity || 0;
                case "Orders":
                    return item.daily_orders || 0;
                default:
                    return item.daily_revenue || 0;
            }
        };

        return {
            labels: sortedData.map(item => item.date),
            datasets: [
                {
                    label: selectedMetric,
                    data: sortedData.map(getMetricValue),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                }
            ],
        };
    }, [dailyMetrics, selectedMetric, colors]);

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                grid: { display: false },
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45
                },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: {
                    font: { size: 10 },
                    callback: (value) => {
                        if (selectedMetric === "Revenue") {
                            return value.toLocaleString('en-US');
                        }
                        return value.toLocaleString('en-US');
                    }
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 12,
                    font: { size: 10 }
                }
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        if (selectedMetric === "Revenue") {
                            return `${label}: ${value.toLocaleString('en-US')}`;
                        }
                        return `${label}: ${value.toLocaleString('en-US')}`;
                    }
                }
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
}