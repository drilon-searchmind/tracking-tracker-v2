"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";
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

export default function PSDashboard({ customerId, customerName, initialData }) {
    // Data is already sanitized in the server component

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
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));
    const [selectedMetric, setSelectedMetric] = useState("Ad Spend");
    const [cpcMetric, setCpcMetric] = useState("CPC");
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [expandedCampaigns, setExpandedCampaigns] = useState({});
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    
    // View mode and granularity states
    const [metricsViewMode, setMetricsViewMode] = useState("YTD");
    const [metricsPeriodGranularity, setMetricsPeriodGranularity] = useState("Daily");
    const [campaignsViewMode, setCampaignsViewMode] = useState("YTD");
    const [campaignsPeriodGranularity, setCampaignsPeriodGranularity] = useState("Daily");
    const [cpcViewMode, setCpcViewMode] = useState("YTD");
    const [cpcPeriodGranularity, setCpcPeriodGranularity] = useState("Daily");

    const { metrics_by_date, top_campaigns, campaigns_by_date } = initialData || {};

    const filteredMetricsByDate = useMemo(() => {
        const filtered = metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
        return filtered;
    }, [metrics_by_date, startDate, endDate]);

    const filteredCampaignsByDate = useMemo(() => {
        const filtered = campaigns_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
        return filtered;
    }, [campaigns_by_date, startDate, endDate]);

    const metrics = useMemo(() => {
        const result = filteredMetricsByDate.reduce(
            (acc, row) => ({
                clicks: acc.clicks + row.clicks,
                impressions: acc.impressions + row.impressions,
                conversions: acc.conversions + row.conversions,
                conversion_value: acc.conversion_value + row.conversion_value,
                ad_spend: acc.ad_spend + row.ad_spend,
                roas: row.ad_spend > 0 ? acc.conversion_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversion_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                cpm: acc.impressions > 0 ? (acc.ad_spend / acc.impressions) * 1000 : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversion_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                conv_rate: 0,
            }
        );
        return result;
    }, [filteredMetricsByDate]);

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

    // Weekly aggregation utility function
    const aggregateDataByWeek = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];

        const weeklyData = {};
        
        dataArray.forEach(row => {
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;

            // Get Monday of the week
            const dayOfWeek = date.getDay();
            const monday = new Date(date);
            monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            const weekKey = monday.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    date: weekKey,
                    clicks: 0,
                    impressions: 0,
                    conversions: 0,
                    conversion_value: 0,
                    ad_spend: 0,
                    roas: 0,
                    aov: 0,
                    ctr: 0,
                    cpc: 0,
                    cpm: 0,
                    conv_rate: 0,
                    count: 0
                };
            }

            const week = weeklyData[weekKey];
            week.clicks += Number(row.clicks) || 0;
            week.impressions += Number(row.impressions) || 0;
            week.conversions += Number(row.conversions) || 0;
            week.conversion_value += Number(row.conversion_value) || 0;
            week.ad_spend += Number(row.ad_spend) || 0;
            week.count += 1;
        });

        // Calculate averages and ratios
        return Object.values(weeklyData).map(week => ({
            ...week,
            roas: week.ad_spend > 0 ? week.conversion_value / week.ad_spend : 0,
            aov: week.conversions > 0 ? week.conversion_value / week.conversions : 0,
            ctr: week.impressions > 0 ? week.clicks / week.impressions : 0,
            cpc: week.clicks > 0 ? week.ad_spend / week.clicks : 0,
            cpm: week.impressions > 0 ? (week.ad_spend / week.impressions) * 1000 : 0,
            conv_rate: week.clicks > 0 ? week.conversions / week.clicks : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Function to format week labels
    const formatWeekLabel = (weekStartDate) => {
        const startDate = new Date(weekStartDate);
        if (isNaN(startDate.getTime())) return weekStartDate;
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        const formatOptions = { month: 'short', day: 'numeric' };
        return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
    };

    // Monthly data aggregation
    const groupDataByMonth = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];

        const monthlyData = {};
        
        dataArray.forEach(row => {
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;

            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[yearMonth]) {
                monthlyData[yearMonth] = {
                    date: yearMonth,
                    clicks: 0,
                    impressions: 0,
                    conversions: 0,
                    conversion_value: 0,
                    ad_spend: 0,
                    roas: 0,
                    aov: 0,
                    ctr: 0,
                    cpc: 0,
                    cpm: 0,
                    conv_rate: 0,
                    count: 0
                };
            }

            const month = monthlyData[yearMonth];
            month.clicks += Number(row.clicks) || 0;
            month.impressions += Number(row.impressions) || 0;
            month.conversions += Number(row.conversions) || 0;
            month.conversion_value += Number(row.conversion_value) || 0;
            month.ad_spend += Number(row.ad_spend) || 0;
            month.count += 1;
        });

        // Calculate averages and ratios
        return Object.values(monthlyData).map(month => ({
            ...month,
            roas: month.ad_spend > 0 ? month.conversion_value / month.ad_spend : 0,
            aov: month.conversions > 0 ? month.conversion_value / month.conversions : 0,
            ctr: month.impressions > 0 ? month.clicks / month.impressions : 0,
            cpc: month.clicks > 0 ? month.ad_spend / month.clicks : 0,
            cpm: month.impressions > 0 ? (month.ad_spend / month.impressions) * 1000 : 0,
            conv_rate: month.clicks > 0 ? month.conversions / month.clicks : 0
        })).sort((a, b) => new Date(a.date + '-01') - new Date(b.date + '-01'));
    };

    // Format month labels
    const formatMonthLabel = (yearMonth) => {
        const date = new Date(yearMonth + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Get YTD data
    const getYTDData = useMemo(() => {
        const currentYear = new Date(endDate).getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearStartStr = formatDate(yearStart);
        
        return (metrics_by_date || []).filter(row => {
            return row.date >= yearStartStr && row.date <= endDate;
        });
    }, [metrics_by_date, endDate]);

    // Get YTD comparison data (previous year)
    const getYTDComparisonData = useMemo(() => {
        const currentYear = new Date(endDate).getFullYear();
        const prevYear = currentYear - 1;
        const prevYearStart = new Date(prevYear, 0, 1);
        const prevYearEnd = new Date(prevYear, new Date(endDate).getMonth(), new Date(endDate).getDate());
        
        const prevYearStartStr = formatDate(prevYearStart);
        const prevYearEndStr = formatDate(prevYearEnd);
        
        return (metrics_by_date || []).filter(row => {
            return row.date >= prevYearStartStr && row.date <= prevYearEndStr;
        });
    }, [metrics_by_date, endDate]);

    const monthlyYTDData = useMemo(() => groupDataByMonth(getYTDData), [getYTDData]);
    const monthlyYTDComparisonData = useMemo(() => groupDataByMonth(getYTDComparisonData), [getYTDComparisonData]);

    // Get filtered comparison data for Period view
    const filteredComparisonMetricsByDate = useMemo(() => {
        return (metrics_by_date || []).filter(row => row.date >= compStart && row.date <= compEnd);
    }, [metrics_by_date, compStart, compEnd]);

    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        const result = comparisonData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + row.clicks,
                impressions: acc.impressions + row.impressions,
                conversions: acc.conversions + row.conversions,
                conversion_value: acc.conversion_value + row.conversion_value,
                ad_spend: acc.ad_spend + row.ad_spend,
                roas: row.ad_spend > 0 ? acc.conversion_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversion_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                cpm: acc.impressions > 0 ? (acc.ad_spend / acc.impressions) * 1000 : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversion_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                conv_rate: 0,
            }
        );
        return result;
    }, [metrics_by_date, compStart, compEnd]);

    const filteredTopCampaigns = useMemo(() => {
        const campaignMap = filteredCampaignsByDate.reduce((acc, row) => {
            const clicks = (acc[row.campaign_name]?.clicks || 0) + row.clicks;
            const impressions = (acc[row.campaign_name]?.impressions || 0) + row.impressions;
            acc[row.campaign_name] = {
                clicks,
                impressions,
                ctr: impressions > 0 ? clicks / impressions : 0,
            };
            return acc;
        }, {});
        const result = Object.entries(campaignMap)
            .map(([campaign_name, data]) => ({
                campaign_name,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.ctr,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);
        return result;
    }, [filteredCampaignsByDate]);

    const selectedCampaigns = filteredTopCampaigns.map((item) => item.campaign_name);

    const colors = {
        primary: "#1C398E",
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(2);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const ppcMetrics = [
        {
            label: "Conv. Value",
            value: metrics.conversion_value ? Math.round(metrics.conversion_value).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversion_value, comparisonMetrics.conversion_value),
            positive: metrics.conversion_value >= comparisonMetrics.conversion_value,
        },
        {
            label: "Ad Spend",
            value: metrics.ad_spend ? Math.round(metrics.ad_spend).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.ad_spend, comparisonMetrics.ad_spend),
            positive: metrics.ad_spend <= comparisonMetrics.ad_spend,
        },
        {
            label: "ROAS",
            value: metrics.roas ? metrics.roas.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.roas, comparisonMetrics.roas),
            positive: metrics.roas >= comparisonMetrics.roas,
        },
        {
            label: "AOV",
            value: metrics.aov ? Math.round(metrics.aov).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.aov, comparisonMetrics.aov),
            positive: metrics.aov >= comparisonMetrics.aov,
        },
        {
            label: "Conversions",
            value: metrics.conversions ? Math.round(metrics.conversions).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversions, comparisonMetrics.conversions),
            positive: metrics.conversions >= comparisonMetrics.conversions,
        },
        {
            label: "Impressions",
            value: metrics.impressions ? Math.round(metrics.impressions).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.impressions, comparisonMetrics.impressions),
            positive: metrics.impressions >= comparisonMetrics.impressions,
        },
        {
            label: "Clicks",
            value: metrics.clicks ? Math.round(metrics.clicks).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.clicks, comparisonMetrics.clicks),
            positive: metrics.clicks >= comparisonMetrics.clicks,
        },
        {
            label: "CTR",
            value: metrics.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics.ctr, comparisonMetrics.ctr),
            positive: metrics.ctr >= comparisonMetrics.ctr,
        },
        {
            label: "CPC",
            value: metrics.cpc ? metrics.cpc.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.cpc, comparisonMetrics.cpc),
            positive: metrics.cpc <= comparisonMetrics.cpc,
        },
        {
            label: "CPM",
            value: metrics.cpm ? metrics.cpm.toFixed(2) : "0.00",
            delta: calculateDelta(metrics.cpm, comparisonMetrics.cpm),
            positive: metrics.cpm <= comparisonMetrics.cpm,
        },
    ];

    const metricsChartData = useMemo(() => {
        let currentData, comparisonData, labels;

        if (metricsViewMode === "YTD") {
            // YTD view uses monthly data
            currentData = monthlyYTDData;
            comparisonData = monthlyYTDComparisonData;
            labels = currentData.map(row => formatMonthLabel(row.date));
        } else {
            // Period view
            if (metricsPeriodGranularity === "Weekly") {
                currentData = aggregateDataByWeek(filteredMetricsByDate);
                comparisonData = aggregateDataByWeek(filteredComparisonMetricsByDate);
                labels = currentData.map(row => formatWeekLabel(row.date));
            } else {
                // Daily
                currentData = filteredMetricsByDate;
                comparisonData = filteredComparisonMetricsByDate;
                labels = currentData.map(row => row.date);
            }
        }

        const getMetricValue = (row) => {
            switch (selectedMetric) {
                case "Conversions":
                    return row.conversions || 0;
                case "Ad Spend":
                    return row.ad_spend || 0;
                case "ROAS":
                    return row.roas || 0;
                default:
                    return 0;
            }
        };

        const datasets = [
            {
                label: selectedMetric,
                data: currentData.map(getMetricValue),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            }
        ];

        // Add comparison dataset for Period view
        if (metricsViewMode === "Period" && comparisonData.length > 0) {
            datasets.push({
                label: `${selectedMetric} (${comparison})`,
                data: comparisonData.map(getMetricValue),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            });
        } else if (metricsViewMode === "YTD" && comparisonData.length > 0) {
            datasets.push({
                label: `${selectedMetric} (Previous Year)`,
                data: comparisonData.map(getMetricValue),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            });
        }

        return {
            labels,
            datasets
        };
    }, [metricsViewMode, metricsPeriodGranularity, selectedMetric, monthlyYTDData, monthlyYTDComparisonData, filteredMetricsByDate, filteredComparisonMetricsByDate, colors, comparison]);

    const cpcChartData = useMemo(() => {
        let currentData, comparisonData, labels;

        if (cpcViewMode === "YTD") {
            // YTD view uses monthly data
            currentData = monthlyYTDData;
            comparisonData = monthlyYTDComparisonData;
            labels = currentData.map(row => formatMonthLabel(row.date));
        } else {
            // Period view
            if (cpcPeriodGranularity === "Weekly") {
                currentData = aggregateDataByWeek(filteredMetricsByDate);
                comparisonData = aggregateDataByWeek(filteredComparisonMetricsByDate);
                labels = currentData.map(row => formatWeekLabel(row.date));
            } else {
                // Daily
                currentData = filteredMetricsByDate;
                comparisonData = filteredComparisonMetricsByDate;
                labels = currentData.map(row => row.date);
            }
        }

        const getCpcMetricValue = (row) => {
            switch (cpcMetric) {
                case "CPC":
                    return row.cpc || 0;
                case "CTR":
                    return row.ctr || 0;
                case "Conv. Rate":
                    return row.conv_rate || 0;
                default:
                    return 0;
            }
        };

        const datasets = [
            {
                label: cpcMetric,
                data: currentData.map(getCpcMetricValue),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            }
        ];

        // Add comparison dataset
        if (cpcViewMode === "Period" && comparisonData.length > 0) {
            datasets.push({
                label: `${cpcMetric} (${comparison})`,
                data: comparisonData.map(getCpcMetricValue),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            });
        } else if (cpcViewMode === "YTD" && comparisonData.length > 0) {
            datasets.push({
                label: `${cpcMetric} (Previous Year)`,
                data: comparisonData.map(getCpcMetricValue),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            });
        }

        return {
            labels,
            datasets
        };
    }, [cpcViewMode, cpcPeriodGranularity, cpcMetric, monthlyYTDData, monthlyYTDComparisonData, filteredMetricsByDate, filteredComparisonMetricsByDate, colors, comparison]);

    // Campaign-specific aggregation functions
    const aggregateCampaignDataByWeek = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];

        const weeklyData = {};
        
        dataArray.forEach(row => {
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;

            // Get Monday of the week
            const dayOfWeek = date.getDay();
            const monday = new Date(date);
            monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            const weekKey = `${monday.toISOString().split('T')[0]}_${row.campaign_name}`;

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    date: monday.toISOString().split('T')[0],
                    campaign_name: row.campaign_name,
                    clicks: 0,
                    impressions: 0,
                    ctr: 0,
                    conv_rate: 0,
                    cpc: 0,
                    cpm: 0,
                    count: 0
                };
            }

            const week = weeklyData[weekKey];
            week.clicks += Number(row.clicks) || 0;
            week.impressions += Number(row.impressions) || 0;
            week.count += 1;
        });

        // Calculate averages
        return Object.values(weeklyData).map(week => ({
            ...week,
            ctr: week.impressions > 0 ? week.clicks / week.impressions : 0,
            cpc: week.clicks > 0 ? (week.ad_spend || 0) / week.clicks : 0,
            conv_rate: week.clicks > 0 ? (week.conversions || 0) / week.clicks : 0,
            cpm: week.impressions > 0 ? ((week.ad_spend || 0) / week.impressions) * 1000 : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const groupCampaignDataByMonth = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];

        const monthlyData = {};
        
        dataArray.forEach(row => {
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;

            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthKey = `${yearMonth}_${row.campaign_name}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    date: yearMonth,
                    campaign_name: row.campaign_name,
                    clicks: 0,
                    impressions: 0,
                    ctr: 0,
                    conv_rate: 0,
                    cpc: 0,
                    cpm: 0,
                    count: 0
                };
            }

            const month = monthlyData[monthKey];
            month.clicks += Number(row.clicks) || 0;
            month.impressions += Number(row.impressions) || 0;
            month.count += 1;
        });

        // Calculate averages
        return Object.values(monthlyData).map(month => ({
            ...month,
            ctr: month.impressions > 0 ? month.clicks / month.impressions : 0,
            cpc: month.clicks > 0 ? (month.ad_spend || 0) / month.clicks : 0,
            conv_rate: month.clicks > 0 ? (month.conversions || 0) / month.clicks : 0,
            cpm: month.impressions > 0 ? ((month.ad_spend || 0) / month.impressions) * 1000 : 0
        })).sort((a, b) => new Date(a.date + '-01') - new Date(b.date + '-01'));
    };

    // Get YTD campaigns data
    const getYTDCampaignsData = useMemo(() => {
        const currentYear = new Date(endDate).getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearStartStr = formatDate(yearStart);
        
        return (campaigns_by_date || []).filter(row => {
            return row.date >= yearStartStr && row.date <= endDate;
        });
    }, [campaigns_by_date, endDate]);

    const monthlyCampaignsYTDData = useMemo(() => groupCampaignDataByMonth(getYTDCampaignsData), [getYTDCampaignsData]);

    const campaignChartData = useMemo(() => {
        let campaignData, labels;

        if (campaignsViewMode === "YTD") {
            // YTD view uses monthly data
            campaignData = monthlyCampaignsYTDData;
            labels = [...new Set(campaignData.map(row => formatMonthLabel(row.date)))].sort();
        } else {
            // Period view
            if (campaignsPeriodGranularity === "Weekly") {
                campaignData = aggregateCampaignDataByWeek(filteredCampaignsByDate);
                labels = [...new Set(campaignData.map(row => formatWeekLabel(row.date)))].sort();
            } else {
                // Daily
                campaignData = filteredCampaignsByDate;
                labels = [...new Set(campaignData.map(row => row.date))].sort();
            }
        }

        const getCampaignMetricValue = (row) => {
            if (selectedMetric === "Conversions") return row.conv_rate || 0;
            if (selectedMetric === "Ad Spend") return row.cpc || 0;
            return row.ctr || 0;
        };

        const datasets = selectedCampaigns.map((campaign, i) => {
            const campaignRows = campaignData.filter(row => row.campaign_name === campaign && row.impressions > 0);
            
            let data;
            if (campaignsViewMode === "YTD") {
                data = campaignRows.map(row => ({
                    x: formatMonthLabel(row.date),
                    y: getCampaignMetricValue(row)
                }));
            } else if (campaignsPeriodGranularity === "Weekly") {
                data = campaignRows.map(row => ({
                    x: formatWeekLabel(row.date),
                    y: getCampaignMetricValue(row)
                }));
            } else {
                data = campaignRows.map(row => ({
                    x: row.date,
                    y: getCampaignMetricValue(row)
                }));
            }

            return {
                label: campaign,
                data,
                borderColor: colors[`hue${i % 4 + 1}`] || colors.primary,
                backgroundColor: colors[`hue${i % 4 + 1}`] || colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            };
        });

        return {
            labels,
            datasets
        };
    }, [campaignsViewMode, campaignsPeriodGranularity, selectedMetric, monthlyCampaignsYTDData, filteredCampaignsByDate, selectedCampaigns, colors]);

    // Dynamic chart options function
    const getChartOptions = (viewMode, periodGranularity) => {
        let timeUnit, displayFormats;
        
        if (viewMode === "YTD") {
            timeUnit = "month";
            displayFormats = { month: "MMM yyyy" };
        } else if (periodGranularity === "Weekly") {
            timeUnit = "week";
            displayFormats = { week: "MMM dd" };
        } else {
            timeUnit = "day";
            displayFormats = { day: "MMM dd" };
        }

        return {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    type: viewMode === "YTD" || periodGranularity === "Weekly" ? "category" : "time",
                    time: viewMode === "YTD" || periodGranularity === "Weekly" ? undefined : { 
                        unit: timeUnit,
                        displayFormats 
                    },
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
                        callback: (value) => value.toLocaleString('en-US')
                    },
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
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${typeof value === 'number' ? value.toLocaleString('en-US') : value}`;
                        }
                    }
                },
            },
        };
    };

    // ViewModeToggle component
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

    const chartComponents = [
        {
            title: selectedMetric,
            chart: <Line data={metricsChartData} options={getChartOptions(metricsViewMode, metricsPeriodGranularity)} />,
            viewModeToggle: (
                <ViewModeToggle 
                    viewMode={metricsViewMode} 
                    setViewMode={setMetricsViewMode}
                    periodGranularity={metricsPeriodGranularity}
                    setPeriodGranularity={setMetricsPeriodGranularity}
                />
            ),
            selector: (
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="border px-2 py-1 rounded text-xs"
                >
                    <option>Ad Spend</option>
                    <option>Conversions</option>
                    <option>ROAS</option>
                </select>
            )
        },
        {
            title: "Top Campaigns",
            chart: <Line data={campaignChartData} options={getChartOptions(campaignsViewMode, campaignsPeriodGranularity)} />,
            viewModeToggle: (
                <ViewModeToggle 
                    viewMode={campaignsViewMode} 
                    setViewMode={setCampaignsViewMode}
                    periodGranularity={campaignsPeriodGranularity}
                    setPeriodGranularity={setCampaignsPeriodGranularity}
                />
            ),
            selector: null
        },
        {
            title: cpcMetric,
            chart: <Line data={cpcChartData} options={getChartOptions(cpcViewMode, cpcPeriodGranularity)} />,
            viewModeToggle: (
                <ViewModeToggle 
                    viewMode={cpcViewMode} 
                    setViewMode={setCpcViewMode}
                    periodGranularity={cpcPeriodGranularity}
                    setPeriodGranularity={setCpcPeriodGranularity}
                />
            ),
            selector: (
                <select
                    value={cpcMetric}
                    onChange={(e) => setCpcMetric(e.target.value)}
                    className="border px-2 py-1 rounded text-xs"
                >
                    <option>CPC</option>
                    <option>CTR</option>
                    <option>Conv. Rate</option>
                </select>
            )
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

    const toggleCampaignExpansion = (index) => {
        setExpandedCampaigns(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        setExpandedCampaigns({});
    }, [startDate, endDate]);

    if (!metrics_by_date || !top_campaigns || !campaigns_by_date) {
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
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Paid Social Dashboard</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Overview of key Paid Social metrics including conversions, ad spend, and campaign performance.
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
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Metrics View */}
                <div className="md:hidden mb-6">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-px bg-[var(--color-natural)]">
                            {ppcMetrics.slice(0, showAllMetrics ? ppcMetrics.length : 4).map((item, i) => (
                                <div key={i} className="bg-white p-4">
                                    <p className="text-xs font-medium text-[var(--color-green)] mb-1">{item.label}</p>
                                    <p className="text-xl font-bold text-[var(--color-dark-green)]">{item.value}</p>
                                    {item.delta && (
                                        <p className={`text-xs font-semibold ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                            {item.delta}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {ppcMetrics.length > 4 && (
                            <button 
                                onClick={() => setShowAllMetrics(!showAllMetrics)}
                                className="w-full py-2 text-sm text-[var(--color-lime)] border-t border-[var(--color-light-natural)] hover:text-[var(--color-green)] transition-colors font-medium"
                            >
                                {showAllMetrics ? "Show Less" : `Show ${ppcMetrics.length - 4} More Metrics`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Metrics Grid */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
                    {ppcMetrics.map((item, i) => (
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

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-8">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4 h-[280px]">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</h3>
                                <div className="flex items-center gap-2">
                                    {activeChartIndex === 0 && (
                                        <>
                                            {chartComponents[activeChartIndex].viewModeToggle}
                                            <select
                                                value={selectedMetric}
                                                onChange={(e) => setSelectedMetric(e.target.value)}
                                                className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                            >
                                                <option>Ad Spend</option>
                                                <option>Conversions</option>
                                                <option>ROAS</option>
                                            </select>
                                        </>
                                    )}
                                    {activeChartIndex === 1 && chartComponents[activeChartIndex].viewModeToggle}
                                    {activeChartIndex === 2 && (
                                        <>
                                            {chartComponents[activeChartIndex].viewModeToggle}
                                            <select
                                                value={cpcMetric}
                                                onChange={(e) => setCpcMetric(e.target.value)}
                                                className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                            >
                                                <option>CPC</option>
                                                <option>CTR</option>
                                                <option>Conv. Rate</option>
                                            </select>
                                        </>
                                    )}
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
                        </div>
                        <div className="w-full h-[180px]">
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

                {/* Desktop Charts - First Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">{selectedMetric}</h3>
                        <div className="flex items-center gap-3">
                            <ViewModeToggle 
                                viewMode={metricsViewMode} 
                                setViewMode={setMetricsViewMode}
                                periodGranularity={metricsPeriodGranularity}
                                setPeriodGranularity={setMetricsPeriodGranularity}
                            />
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            >
                                <option>Ad Spend</option>
                                <option>Conversions</option>
                                <option>ROAS</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={metricsChartData} options={getChartOptions(metricsViewMode, metricsPeriodGranularity)} />
                    </div>
                </div>

                {/* Mobile Campaigns Section */}
                <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                        <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                    </div>
                    <div className="p-1">
                        {filteredTopCampaigns.map((row, i) => (
                            <div key={i} className="border-b border-[var(--color-light-natural)] last:border-b-0">
                                <div 
                                    className="p-3 flex justify-between items-center hover:bg-[var(--color-natural)] transition-colors cursor-pointer"
                                    onClick={() => toggleCampaignExpansion(i)}
                                >
                                    <div className="truncate pr-2 w-4/5">
                                        <span className="font-medium text-xs text-[var(--color-dark-green)]">{row.campaign_name}</span>
                                    </div>
                                    <FaChevronRight 
                                        className={`text-[var(--color-green)] transition-transform ${expandedCampaigns[i] ? 'rotate-90' : ''}`}
                                        size={12}
                                    />
                                </div>
                                {expandedCampaigns[i] && (
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
                </div>

                {/* Desktop Campaigns Table and Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[var(--color-natural)] border-b text-[var(--color-dark-green)] text-left sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Campaign Name</th>
                                    <th className="px-4 py-3 font-semibold">Clicks</th>
                                    <th className="px-4 py-3 font-semibold">Impr</th>
                                    <th className="px-4 py-3 font-semibold">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTopCampaigns.map((row, i) => (
                                    <tr key={i} className="border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)] transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-[var(--color-dark-green)] font-medium">{row.campaign_name}</td>
                                        <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.clicks).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-3 text-[var(--color-dark-green)]">{Math.round(row.impressions).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-3 text-[var(--color-dark-green)]">{(row.ctr * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Campaigns Impressions Over Time</h3>
                            <ViewModeToggle 
                                viewMode={campaignsViewMode} 
                                setViewMode={setCampaignsViewMode}
                                periodGranularity={campaignsPeriodGranularity}
                                setPeriodGranularity={setCampaignsPeriodGranularity}
                            />
                        </div>
                        <div className="w-full h-[300px]">
                            <Line data={campaignChartData} options={getChartOptions(campaignsViewMode, campaignsPeriodGranularity)} />
                        </div>
                    </div>
                </div>

                {/* Desktop CPC Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">{cpcMetric}</h3>
                        <div className="flex items-center gap-3">
                            <ViewModeToggle 
                                viewMode={cpcViewMode} 
                                setViewMode={setCpcViewMode}
                                periodGranularity={cpcPeriodGranularity}
                                setPeriodGranularity={setCpcPeriodGranularity}
                            />
                            <select
                                value={cpcMetric}
                                onChange={(e) => setCpcMetric(e.target.value)}
                                className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            >
                                <option>CPC</option>
                                <option>CTR</option>
                                <option>Conv. Rate</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={cpcChartData} options={getChartOptions(cpcViewMode, cpcPeriodGranularity)} />
                    </div>
                </div>
            </div>
        </div>
    );
}