"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft, FaSearch } from "react-icons/fa";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);

export default function SEODashboard({ customerId, customerName, initialData }) {
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

    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [metric, setMetric] = useState("Impressions");
    const [filter, setFilter] = useState("Med brand");
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [showMobileUrlDetails, setShowMobileUrlDetails] = useState(false);
    const [expandedKeywords, setExpandedKeywords] = useState({});
    const [expandedUrls, setExpandedUrls] = useState({});

    const [keywordSearch, setKeywordSearch] = useState("");
    const [urlSearch, setUrlSearch] = useState("");

    const { impressions_data, top_keywords, top_urls, urls_by_date, keywords_by_date } = initialData || {};

    const filteredImpressionsData = useMemo(() => {
        return impressions_data?.filter((row) => row.date >= dateStart && row.date <= dateEnd) || [];
    }, [impressions_data, dateStart, dateEnd]);

    const filteredUrlsByDate = useMemo(() => {
        return urls_by_date?.filter((row) => row.date >= dateStart && row.date <= dateEnd) || [];
    }, [urls_by_date, dateStart, dateEnd]);

    const filteredKeywordsByDate = useMemo(() => {
        return keywords_by_date?.filter((row) => row.date >= dateStart && row.date <= dateEnd) || [];
    }, [keywords_by_date, dateStart, dateEnd]);

    const metrics = useMemo(() => {
        return filteredImpressionsData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                avg_position: acc.avg_position + (row.avg_position || 0),
                count: acc.count + 1,
            }),
            { clicks: 0, impressions: 0, ctr: 0, avg_position: 0, count: 0 }
        );
    }, [filteredImpressionsData]);

    const getComparisonDates = () => {
        try {
            const end = new Date(dateEnd);
            const start = new Date(dateStart);

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

    const comparisonMetrics = useMemo(() => {
        const comparisonData = impressions_data?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        return comparisonData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                ctr: row.impressions > 0 ? acc.clicks / acc.impressions : 0,
                avg_position: acc.avg_position + (row.avg_position || 0),
                count: acc.count + 1,
            }),
            { clicks: 0, impressions: 0, ctr: 0, avg_position: 0, count: 0 }
        );
    }, [impressions_data, compStart, compEnd]);

    const allKeywords = useMemo(() => {
        const keywordMap = filteredKeywordsByDate.reduce((acc, row) => {
            acc[row.keyword] = {
                clicks: (acc[row.keyword]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.keyword]?.impressions || 0) + (row.impressions || 0),
                position: (acc[row.keyword]?.position || 0) + (row.position || 0),
                count: (acc[row.keyword]?.count || 0) + 1,
            };
            return acc;
        }, {});
        return Object.entries(keywordMap)
            .map(([keyword, data]) => ({
                keyword,
                clicks: data.clicks,
                impressions: data.impressions,
                position: data.count > 0 ? data.position / data.count : 0,
            }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [filteredKeywordsByDate]);

    const filteredTopKeywords = useMemo(() => {
        return allKeywords
            .filter(item =>
                keywordSearch ?
                    item.keyword.toLowerCase().includes(keywordSearch.toLowerCase()) :
                    true
            )
            .slice(0, keywordSearch ? undefined : 10);
    }, [allKeywords, keywordSearch]);

    const allUrls = useMemo(() => {
        const urlMap = filteredUrlsByDate.reduce((acc, row) => {
            acc[row.url] = {
                clicks: (acc[row.url]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.url]?.impressions || 0) + (row.impressions || 0),
                ctr: row.impressions > 0 ? (acc[row.url]?.clicks || 0) / (acc[row.url]?.impressions || 1) : 0,
            };
            return acc;
        }, {});
        return Object.entries(urlMap)
            .map(([url, data]) => ({
                url,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
            }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [filteredUrlsByDate]);

    const filteredTopUrls = useMemo(() => {
        return allUrls
            .filter(item =>
                urlSearch ?
                    item.url.toLowerCase().includes(urlSearch.toLowerCase()) :
                    true
            )
            .slice(0, urlSearch ? undefined : 20);
    }, [allUrls, urlSearch]);

    const selectedUrls = useMemo(() => {
        return filteredTopUrls.slice(0, 5).map(item => item.url);
    }, [filteredTopUrls]);

    const selectedKeywords = useMemo(() => {
        return filteredTopKeywords.slice(0, 5).map(item => item.keyword);
    }, [filteredTopKeywords]);

    const colors = {
        primary: "#1C398E",
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(1);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const seoMetrics = [
        {
            label: "Click",
            value: metrics.clicks ? Math.round(metrics.clicks).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.clicks, comparisonMetrics.clicks),
            positive: metrics.clicks >= comparisonMetrics.clicks,
        },
        {
            label: "Impressions",
            value: metrics.impressions ? Math.round(metrics.impressions).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.impressions, comparisonMetrics.impressions),
            positive: metrics.impressions >= comparisonMetrics.impressions,
        },
        {
            label: "CTR",
            value: metrics.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics.ctr, comparisonMetrics.ctr),
            positive: metrics.ctr >= comparisonMetrics.ctr,
        },
        {
            label: "Avg. Position",
            value: metrics.count > 0 ? (metrics.avg_position / metrics.count).toFixed(2) : "0.00",
            delta: calculateDelta(metrics.avg_position / (metrics.count || 1), comparisonMetrics.avg_position / (comparisonMetrics.count || 1)),
            positive: (metrics.avg_position / (metrics.count || 1)) <= (comparisonMetrics.avg_position / (comparisonMetrics.count || 1)),
        },
    ];

    const impressionsChartData = {
        labels: filteredImpressionsData.map((row) => row.date) || [],
        datasets: [
            {
                label: metric,
                data: filteredImpressionsData.map((row) => {
                    if (metric === "Clicks") return row.clicks || 0;
                    if (metric === "CTR") return row.ctr || 0;
                    return row.impressions || 0;
                }) || [],
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
        ],
    };

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
                ticks: { font: { size: 10 } },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 12 },
                bodyFont: { size: 10 },
                padding: 8,
                cornerRadius: 4,
            },
        },
    };

    const urlChartData = {
        labels: [...new Set(filteredUrlsByDate.map((row) => row.date))].sort(),
        datasets: selectedUrls.map((url, i) => ({
            label: url,
            data: filteredUrlsByDate
                .filter((row) => row.url === url)
                .map((row) => ({
                    x: row.date,
                    y: metric === "Clicks" ? row.clicks || 0 :
                        metric === "Impressions" ? row.impressions || 0 :
                            row.ctr || 0
                })),
            borderColor: colors[`hue${i % 5}`] || colors.primary,
            backgroundColor: colors[`hue${i % 5}`] || colors.primary,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: false,
        })),
    };

    const keywordChartData = {
        labels: [...new Set(filteredKeywordsByDate.map((row) => row.date))].sort(),
        datasets: selectedKeywords.map((keyword, i) => ({
            label: keyword,
            data: filteredKeywordsByDate
                .filter((row) => row.keyword === keyword && row.impressions > 0)
                .map((row) => ({
                    x: row.date,
                    y: metric === "Clicks" ? row.clicks || 0 :
                        metric === "Impressions" ? row.impressions || 0 :
                            row.ctr || 0
                })),
            borderColor: colors[`hue${i % 5}`] || colors.primary,
            backgroundColor: colors[`hue${i % 5}`] || colors.primary,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: false,
        })),
    };

    const chartComponents = [
        {
            title: "Impressions",
            chart: <Line data={impressionsChartData} options={chartOptions} />
        },
        {
            title: "Top Keywords Impressions",
            chart: <Line data={keywordChartData} options={chartOptions} />
        },
        {
            title: "Top URLs Trends",
            chart: <Line data={urlChartData} options={chartOptions} />
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

    const toggleKeywordExpansion = (index) => {
        setExpandedKeywords(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleUrlExpansion = (index) => {
        setExpandedUrls(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        setExpandedKeywords({});
        setExpandedUrls({});
    }, [dateStart, dateEnd]);

    if (!impressions_data || !top_keywords || !top_urls || !urls_by_date || !keywords_by_date) {
        return <div className="p-4 text-center">No data available for {customerId}</div>;
    }

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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">SEO Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        Overview of clicks, impressions, CTR, and position based on Google Search Console data.
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
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                            <span className="text-gray-400 hidden md:inline">→</span>
                            <span className="text-gray-400 md:hidden">to</span>
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-10">
                    {seoMetrics.map((item, i) => (
                        <div key={i} className="bg-white border border-zinc-200 rounded p-4">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-xl md:text-2xl font-bold text-zinc-800">{item.value}</p>
                            {item.delta && (
                                <p className={`text-sm font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                    {item.delta}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="hidden md:block bg-white border border-zinc-200 rounded p-6 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Impressions</p>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Impressions</option>
                            <option>Clicks</option>
                            <option>CTR</option>
                        </select>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={impressionsChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="md:hidden mb-8">
                    <div className="bg-white border border-zinc-200 rounded p-4 h-[280px]">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-sm">{chartComponents[activeChartIndex].title}</p>
                            <div className="flex items-center gap-2">
                                <select
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    className="border px-2 py-1 rounded text-xs"
                                >
                                    <option>Impressions</option>
                                    <option>Clicks</option>
                                    <option>CTR</option>
                                </select>
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
                        </div>
                        <div className="w-full h-[210px]">
                            {chartComponents[activeChartIndex].chart}
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

                {/* Updated Keywords Section - Desktop */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-zinc-200 rounded p-6 mb-8 shadow-solid-l">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold">Top Performance Keywords</p>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    {/* New search input for keywords */}
                                    <input
                                        type="text"
                                        placeholder="Search keywords..."
                                        value={keywordSearch}
                                        onChange={(e) => setKeywordSearch(e.target.value)}
                                        className="border px-3 py-1 rounded text-sm pr-8"
                                    />
                                    <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                </div>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border px-3 py-1 rounded text-sm"
                                >
                                    <option>Med brand</option>
                                    <option>Uden brand</option>
                                </select>
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                    <tr>
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">Keyword</th>
                                        <th className="px-4 py-2">Click</th>
                                        <th className="px-4 py-2">Impr</th>
                                        <th className="px-4 py-2">Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopKeywords.map((row, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="px-4 py-2">{i + 1}</td>
                                            <td className="px-4 py-2">{row.keyword}</td>
                                            <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-2">{row.position.toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Keywords Over Time</p>
                            <select
                                className="border px-3 py-1 rounded text-sm"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                            >
                                <option>Clicks</option>
                                <option>Impressions</option>
                                <option>CTR</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px] max-h-[500px] overflow-y-auto">
                            <Line data={keywordChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Keywords Section - Mobile */}
                <div className="md:hidden bg-white border border-zinc-200 rounded mb-6 shadow-solid-l">
                    <div className="flex justify-between items-center p-4 border-b">
                        <p className="font-semibold text-sm">Top Performance Keywords</p>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border px-2 py-1 rounded text-xs"
                        >
                            <option>Med brand</option>
                            <option>Uden brand</option>
                        </select>
                    </div>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search keywords..."
                                value={keywordSearch}
                                onChange={(e) => setKeywordSearch(e.target.value)}
                                className="border w-full px-3 py-2 rounded text-sm pr-8"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                    </div>
                    <div className="p-1">
                        {filteredTopKeywords.map((row, i) => (
                            <div key={i} className="border-b border-gray-100 last:border-b-0">
                                <div
                                    className="p-3 flex justify-between items-center"
                                    onClick={() => toggleKeywordExpansion(i)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                                        <span className="font-medium text-sm">{row.keyword}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-gray-400 transition-transform ${expandedKeywords[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedKeywords[i] && (
                                    <div className="px-4 pb-3 grid grid-cols-3 gap-1 text-xs">
                                        <div>
                                            <span className="text-gray-500 block">Clicks</span>
                                            <span className="font-medium">{Math.round(row.clicks).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Impressions</span>
                                            <span className="font-medium">{Math.round(row.impressions).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Position</span>
                                            <span className="font-medium">{row.position.toFixed(0)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop URLs Section - With search functionality */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-zinc-200 rounded p-6 mt-10 shadow-solid-10">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold">Top Performance URLs</p>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search URLs..."
                                    value={urlSearch}
                                    onChange={(e) => setUrlSearch(e.target.value)}
                                    className="border px-3 py-1 rounded text-sm pr-8"
                                />
                                <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                    <tr>
                                        <th className="px-4 py-2">URL</th>
                                        <th className="px-4 py-2">Click</th>
                                        <th className="px-4 py-2">Impr</th>
                                        <th className="px-4 py-2">CTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopUrls.map((row, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="px-4 py-2 whitespace-nowrap">{row.url}</td>
                                            <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-2">{(row.ctr * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">URLs Over Time</p>
                            <select
                                className="border px-3 py-1 rounded text-sm"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                            >
                                <option>Clicks</option>
                                <option>Impressions</option>
                                <option>CTR</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px] max-h-[500px] overflow-y-auto">
                            <Line data={urlChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Mobile URLs Section - With search functionality */}
                <div className="md:hidden bg-white border border-zinc-200 rounded mt-6 shadow-solid-10">
                    <div className="flex justify-between items-center p-4 border-b">
                        <p className="font-semibold text-sm">Top Performance URLs</p>
                        <button
                            onClick={() => setShowMobileUrlDetails(!showMobileUrlDetails)}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                            {showMobileUrlDetails ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search URLs..."
                                value={urlSearch}
                                onChange={(e) => setUrlSearch(e.target.value)}
                                className="border w-full px-3 py-2 rounded text-sm pr-8"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                    </div>
                    <div className="p-1">
                        {(showMobileUrlDetails ? filteredTopUrls : filteredTopUrls.slice(0, 5)).map((row, i) => (
                            <div key={i} className="border-b border-gray-100 last:border-b-0">
                                <div
                                    className="p-3 flex justify-between items-center"
                                    onClick={() => toggleUrlExpansion(i)}
                                >
                                    <div className="truncate pr-2 w-4/5">
                                        <span className="font-medium text-xs">{row.url}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-gray-400 transition-transform ${expandedUrls[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedUrls[i] && (
                                    <div className="px-4 pb-3 grid grid-cols-3 gap-1 text-xs">
                                        <div>
                                            <span className="text-gray-500 block">Clicks</span>
                                            <span className="font-medium">{Math.round(row.clicks).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Impressions</span>
                                            <span className="font-medium">{Math.round(row.impressions).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">CTR</span>
                                            <span className="font-medium">{(row.ctr * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {filteredTopUrls.length > 5 && !showMobileUrlDetails && !urlSearch && (
                        <div className="p-3 border-t border-gray-100 text-center">
                            <button
                                onClick={() => setShowMobileUrlDetails(true)}
                                className="text-blue-600 text-xs font-medium"
                            >
                                Show all {filteredTopUrls.length} URLs
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}