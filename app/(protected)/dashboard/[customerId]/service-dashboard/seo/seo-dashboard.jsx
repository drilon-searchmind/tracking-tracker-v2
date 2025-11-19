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
import Subheading from "@/app/components/UI/Utility/Subheading";
import SEOSettings from "./components/SEOSettings";

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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
    const [keywordGroups, setKeywordGroups] = useState([]);
    const [exactKeywordGroups, setExactKeywordGroups] = useState([]);
    const [brandKeywords, setBrandKeywords] = useState([]);
    const [selectedKeywordGroup, setSelectedKeywordGroup] = useState("all");

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
        const keywordClicksInDateRange = filteredKeywordsByDate.reduce((acc, row) => {
            acc[row.keyword] = {
                clicks: (acc[row.keyword]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.keyword]?.impressions || 0) + (row.impressions || 0),
            };
            return acc;
        }, {});

        return top_keywords
            .map(topKeyword => {
                const dateRangeData = keywordClicksInDateRange[topKeyword.keyword];
                if (dateRangeData) {
                    return {
                        keyword: topKeyword.keyword,
                        clicks: dateRangeData.clicks,
                        impressions: dateRangeData.impressions,
                        position: topKeyword.position,
                    };
                } else {
                    return {
                        keyword: topKeyword.keyword,
                        clicks: 0,
                        impressions: 0,
                        position: topKeyword.position,
                    };
                }
            })
            .filter(item => item.clicks > 0 || item.impressions > 0)
            .sort((a, b) => b.clicks - a.clicks);
    }, [filteredKeywordsByDate, top_keywords]);

    const containsBrandKeywords = (keyword) => {
        if (!brandKeywords.length) return false;
        const lowerKeyword = keyword.toLowerCase();
        return brandKeywords.some(brandTerm => 
            lowerKeyword.includes(brandTerm.toLowerCase())
        );
    };

    const matchesExactKeywords = (keyword, exactKeywords) => {
        if (!exactKeywords.length) return false;
        const keywordLower = keyword.toLowerCase().trim();
        return exactKeywords.some(exactKeyword => 
            keywordLower === exactKeyword.toLowerCase().trim()
        );
    };

    const filteredTopKeywords = useMemo(() => {
        let filtered = allKeywords;

        if (keywordSearch) {
            filtered = filtered.filter(item =>
                item.keyword.toLowerCase().includes(keywordSearch.toLowerCase())
            );
        }

        if (selectedKeywordGroup === "with-brand") {
            filtered = filtered.filter(item => containsBrandKeywords(item.keyword));
        } else if (selectedKeywordGroup === "without-brand") {
            filtered = filtered.filter(item => !containsBrandKeywords(item.keyword));
        } else if (selectedKeywordGroup && selectedKeywordGroup !== "all") {
            if (selectedKeywordGroup.startsWith("exact-")) {
                const exactGroupId = selectedKeywordGroup.replace("exact-", "");
                const selectedExactGroup = exactKeywordGroups.find(group => group._id === exactGroupId);
                if (selectedExactGroup) {
                    filtered = filtered.filter(item =>
                        matchesExactKeywords(item.keyword, selectedExactGroup.keywords)
                    );
                }
            } else {
                const selectedGroup = keywordGroups.find(group => group._id === selectedKeywordGroup);
                if (selectedGroup) {
                    filtered = filtered.filter(item =>
                        selectedGroup.keywords.some(groupKeyword => 
                            item.keyword.toLowerCase().includes(groupKeyword.toLowerCase())
                        )
                    );
                }
            }
        }

        return filtered.slice(0, keywordSearch || selectedKeywordGroup !== "all" ? undefined : 10);
    }, [allKeywords, keywordSearch, selectedKeywordGroup, keywordGroups, exactKeywordGroups, brandKeywords]);

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
                        metric === "Position" ? row.avg_position || 0 :
                            (row.ctr * 100) || 0
                })),
            borderColor: colors[`hue${i % 5}`] || colors.primary,
            backgroundColor: colors[`hue${i % 5}`] || colors.primary,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: false,
        })),
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
                            (row.ctr * 100) || 0
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

    useEffect(() => {
        const fetchKeywordGroups = async () => {
            try {
                const response = await fetch(`/api/seo-keyword-groups?customerId=${customerId}`);
                if (response.ok) {
                    const groups = await response.json();
                    setKeywordGroups(groups);
                }
            } catch (error) {
                console.error("Error fetching keyword groups:", error);
            }
        };

        const fetchExactKeywordGroups = async () => {
            try {
                const response = await fetch(`/api/seo-exact-keyword-groups?customerId=${customerId}`);
                if (response.ok) {
                    const groups = await response.json();
                    setExactKeywordGroups(groups);
                }
            } catch (error) {
                console.error("Error fetching exact keyword groups:", error);
            }
        };

        const fetchBrandKeywords = async () => {
            try {
                const response = await fetch(`/api/seo-brand-keywords?customerId=${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBrandKeywords(data.keywords || []);
                }
            } catch (error) {
                console.error("Error fetching brand keywords:", error);
            }
        };

        if (customerId) {
            fetchKeywordGroups();
            fetchExactKeywordGroups();
            fetchBrandKeywords();
        }
    }, [customerId]);

    if (!impressions_data || !top_keywords || !top_urls || !urls_by_date || !keywords_by_date) {
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
                <div className="mb-6 md:mb-8">
                    <Subheading headingText={customerName} />
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">SEO Dashboard</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Overview of clicks, impressions, CTR, and position based on Google Search Console data.
                    </p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-end">
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
                            <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Comparison:</label>
                            <select
                                value={comparison}
                                onChange={(e) => setComparison(e.target.value)}
                                className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent w-full md:w-auto transition-colors"
                            >
                                <option>Previous Year</option>
                                <option>Previous Period</option>
                            </select>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Date Range:</label>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                    <input
                                        type="date"
                                        value={dateStart}
                                        onChange={(e) => setDateStart(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={dateEnd}
                                        onChange={(e) => setDateEnd(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
                    {seoMetrics.map((item, i) => (
                        <div key={i} className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-[var(--color-green)] mb-2">{item.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <p className="text-2xl md:text-3xl font-bold text-[var(--color-dark-green)]">{item.value}</p>
                                    {item.delta && (
                                        <div className="flex flex-col items-end">
                                            <p className={`text-sm font-semibold ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                                {item.delta}
                                            </p>
                                            <p className="text-xs text-[var(--color-green)] mt-1">vs prev period</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Charts */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Impressions Overview</h3>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
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

                {/* Mobile Charts */}
                <div className="md:hidden mb-8">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4 h-[280px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</h3>
                            <div className="flex items-center gap-2">
                                <select
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                >
                                    <option>Impressions</option>
                                    <option>Clicks</option>
                                    <option>CTR</option>
                                </select>
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
                        </div>
                        <div className="w-full h-[210px]">
                            {chartComponents[activeChartIndex].chart}
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

                {/* Keywords Section - Desktop */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Performance Keywords</h3>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search keywords..."
                                        value={keywordSearch}
                                        onChange={(e) => setKeywordSearch(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm pr-8 w-48 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                                </div>
                                <select
                                    value={selectedKeywordGroup}
                                    onChange={(e) => setSelectedKeywordGroup(e.target.value)}
                                    className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                >
                                    <option value="all">All Keywords</option>
                                    <option value="with-brand">With Brand</option>
                                    <option value="without-brand">Without Brand</option>
                                    {exactKeywordGroups.length > 0 && (
                                        <>
                                            <option disabled>──── Exact Match Groups ────</option>
                                            {exactKeywordGroups.map(group => (
                                                <option key={`exact-${group._id}`} value={`exact-${group._id}`}>
                                                    📍 {group.name} ({group.keywords.length} exact)
                                                </option>
                                            ))}
                                        </>
                                    )}
                                    {keywordGroups.length > 0 && (
                                        <>
                                            <option disabled>──── Partial Match Groups ────</option>
                                            {keywordGroups.map(group => (
                                                <option key={group._id} value={group._id}>
                                                    🔍 {group.name} ({group.keywords.length} partial)
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[var(--color-natural)] border-b text-[var(--color-dark-green)] text-left sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">#</th>
                                        <th className="px-4 py-3 font-semibold">Keyword</th>
                                        <th className="px-4 py-3 font-semibold">Click</th>
                                        <th className="px-4 py-3 font-semibold">Impr</th>
                                        <th className="px-4 py-3 font-semibold">Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopKeywords.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)] transition-colors">
                                            <td className="px-4 py-3 text-[var(--color-green)]">{i + 1}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)] font-medium">{row.keyword}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{row.position.toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Keywords Over Time</h3>
                            <select
                                className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                            >
                                <option>Clicks</option>
                                <option>Impressions</option>
                                <option>CTR</option>
                                <option>Position</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px] max-h-[500px] overflow-y-auto">
                            <Line data={keywordChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Keywords Section - Mobile */}
                <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                        <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Top Performance Keywords</h3>
                        <select
                            value={selectedKeywordGroup}
                            onChange={(e) => setSelectedKeywordGroup(e.target.value)}
                            className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                        >
                            <option value="all">All</option>
                            <option value="with-brand">With Brand</option>
                            <option value="without-brand">Without Brand</option>
                            {exactKeywordGroups.length > 0 && (
                                <>
                                    <option disabled>────</option>
                                    {exactKeywordGroups.map(group => (
                                        <option key={`exact-${group._id}`} value={`exact-${group._id}`}>
                                            📍 {group.name}
                                        </option>
                                    ))}
                                </>
                            )}
                            {keywordGroups.length > 0 && (
                                <>
                                    <option disabled>────</option>
                                    {keywordGroups.map(group => (
                                        <option key={group._id} value={group._id}>
                                            🔍 {group.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div className="p-4 border-b border-[var(--color-light-natural)]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search keywords..."
                                value={keywordSearch}
                                onChange={(e) => setKeywordSearch(e.target.value)}
                                className="border border-[var(--color-dark-natural)] w-full px-3 py-2 rounded-lg text-sm pr-8 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                        </div>
                    </div>
                    <div className="p-1">
                        {filteredTopKeywords.map((row, i) => (
                            <div key={i} className="border-b border-[var(--color-light-natural)] last:border-b-0">
                                <div
                                    className="p-3 flex justify-between items-center hover:bg-[var(--color-natural)] transition-colors cursor-pointer"
                                    onClick={() => toggleKeywordExpansion(i)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[var(--color-green)] w-5 font-medium">{i + 1}.</span>
                                        <span className="font-medium text-sm text-[var(--color-dark-green)]">{row.keyword}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-[var(--color-green)] transition-transform ${expandedKeywords[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedKeywords[i] && (
                                    <div className="px-4 pb-3 grid grid-cols-3 gap-1 text-xs bg-[var(--color-natural)]">
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Clicks</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Impressions</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Position</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{row.position.toFixed(0)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* URLs Section - Desktop */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mt-8">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Performance URLs</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search URLs..."
                                    value={urlSearch}
                                    onChange={(e) => setUrlSearch(e.target.value)}
                                    className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm pr-8 w-48 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                />
                                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[var(--color-natural)] border-b text-[var(--color-dark-green)] text-left sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">URL</th>
                                        <th className="px-4 py-3 font-semibold">Click</th>
                                        <th className="px-4 py-3 font-semibold">Impr</th>
                                        <th className="px-4 py-3 font-semibold">CTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopUrls.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)] transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-[var(--color-dark-green)] font-medium">{row.url}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                            <td className="px-4 py-3 text-[var(--color-dark-green)]">{(row.ctr * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">URLs Over Time</h3>
                            <select
                                className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
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

                {/* URLs Section - Mobile */}
                <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mt-6">
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                        <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Top Performance URLs</h3>
                        <button
                            onClick={() => setShowMobileUrlDetails(!showMobileUrlDetails)}
                            className="text-xs bg-[var(--color-natural)] text-[var(--color-dark-green)] px-3 py-1 rounded-lg hover:bg-[var(--color-light-natural)] transition-colors font-medium"
                        >
                            {showMobileUrlDetails ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className="p-4 border-b border-[var(--color-light-natural)]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search URLs..."
                                value={urlSearch}
                                onChange={(e) => setUrlSearch(e.target.value)}
                                className="border border-[var(--color-dark-natural)] w-full px-3 py-2 rounded-lg text-sm pr-8 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                        </div>
                    </div>
                    <div className="p-1">
                        {(showMobileUrlDetails ? filteredTopUrls : filteredTopUrls.slice(0, 5)).map((row, i) => (
                            <div key={i} className="border-b border-[var(--color-light-natural)] last:border-b-0">
                                <div
                                    className="p-3 flex justify-between items-center hover:bg-[var(--color-natural)] transition-colors cursor-pointer"
                                    onClick={() => toggleUrlExpansion(i)}
                                >
                                    <div className="truncate pr-2 w-4/5">
                                        <span className="font-medium text-xs text-[var(--color-dark-green)]">{row.url}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-[var(--color-green)] transition-transform ${expandedUrls[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedUrls[i] && (
                                    <div className="px-4 pb-3 grid grid-cols-3 gap-1 text-xs bg-[var(--color-natural)]">
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Clicks</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">Impressions</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-green)] block font-medium">CTR</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{(row.ctr * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {filteredTopUrls.length > 5 && !showMobileUrlDetails && !urlSearch && (
                        <div className="p-3 border-t border-[var(--color-light-natural)] text-center">
                            <button
                                onClick={() => setShowMobileUrlDetails(true)}
                                className="text-[var(--color-lime)] text-xs font-semibold hover:text-[var(--color-green)] transition-colors"
                            >
                                Show all {filteredTopUrls.length} URLs
                            </button>
                        </div>
                    )}
                </div>

                {/* SEO Settings Section */}
                <SEOSettings customerId={customerId} />
            </div>
        </div>
    );
}