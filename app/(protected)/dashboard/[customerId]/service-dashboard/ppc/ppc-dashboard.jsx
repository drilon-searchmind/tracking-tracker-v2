"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft, FaSearch } from "react-icons/fa";
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

export default function PPCDashboard({ customerId, customerName }) {
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

    const [comparison, setComparison] = useState("Previous Period");
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));
    const [tempStartDate, setTempStartDate] = useState(formatDate(firstDayOfMonth));
    const [tempEndDate, setTempEndDate] = useState(formatDate(yesterday));
    const [selectedMetric, setSelectedMetric] = useState("Ad Spend");
    const [cpcMetric, setCpcMetric] = useState("CPC");
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [expandedCampaigns, setExpandedCampaigns] = useState({});
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    const [campaignSearch, setCampaignSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    
    // View mode and granularity states
    const [metricsViewMode, setMetricsViewMode] = useState("Period");
    const [metricsPeriodGranularity, setMetricsPeriodGranularity] = useState("Daily");
    const [campaignsViewMode, setCampaignsViewMode] = useState("Period");
    const [campaignsPeriodGranularity, setCampaignsPeriodGranularity] = useState("Daily");

    const { metrics_by_date, top_campaigns, campaigns_by_date } = dashboardData || {};

    // Fetch data function
    const fetchData = async (start, end) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/ppc-dashboard/${customerId}?startDate=${start}&endDate=${end}`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // You could set an error state here to display to the user
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (customerId && startDate && endDate) {
            fetchData(startDate, endDate);
        }
    }, [customerId, startDate, endDate]);

    // Handle apply button click
    const handleApplyDates = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
    };

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
        if (!dataArray || dataArray.length === 0) return [];
        
        const weekMap = {};
        
        dataArray.forEach(row => {
            if (!row.date) return;
            
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;
            
            // Get Monday of the week
            const monday = new Date(date);
            monday.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
            const weekKey = monday.toISOString().split('T')[0];
            
            if (!weekMap[weekKey]) {
                weekMap[weekKey] = {
                    date: weekKey,
                    ad_spend: 0,
                    conversions_value: 0,
                    conversions: 0,
                    impressions: 0,
                    clicks: 0,
                    count: 0
                };
            }
            
            weekMap[weekKey].ad_spend += row.ad_spend || 0;
            weekMap[weekKey].conversions_value += row.conversions_value || 0;
            weekMap[weekKey].conversions += row.conversions || 0;
            weekMap[weekKey].impressions += row.impressions || 0;
            weekMap[weekKey].clicks += row.clicks || 0;
            weekMap[weekKey].count += 1;
        });
        
        return Object.values(weekMap).map(week => ({
            ...week,
            roas: week.ad_spend > 0 ? week.conversions_value / week.ad_spend : 0,
            aov: week.conversions > 0 ? week.conversions_value / week.conversions : 0,
            ctr: week.impressions > 0 ? week.clicks / week.impressions : 0,
            cpc: week.clicks > 0 ? week.ad_spend / week.clicks : 0,
            conv_rate: week.clicks > 0 ? week.conversions / week.clicks : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Function to format week labels
    const formatWeekLabel = (weekStartDate) => {
        const startDate = new Date(weekStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        const formatDateShort = (date) => {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${month}/${day}`;
        };
        
        return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
    };

    // Monthly data aggregation
    const groupDataByMonth = (dataArray) => {
        if (!dataArray || dataArray.length === 0) return [];
        
        const monthMap = {};
        
        dataArray.forEach(row => {
            if (!row.date) return;
            
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;
            
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthMap[yearMonth]) {
                monthMap[yearMonth] = {
                    date: yearMonth,
                    ad_spend: 0,
                    conversions_value: 0,
                    conversions: 0,
                    impressions: 0,
                    clicks: 0,
                    count: 0
                };
            }
            
            monthMap[yearMonth].ad_spend += row.ad_spend || 0;
            monthMap[yearMonth].conversions_value += row.conversions_value || 0;
            monthMap[yearMonth].conversions += row.conversions || 0;
            monthMap[yearMonth].impressions += row.impressions || 0;
            monthMap[yearMonth].clicks += row.clicks || 0;
            monthMap[yearMonth].count += 1;
        });
        
        return Object.values(monthMap).map(month => ({
            ...month,
            roas: month.ad_spend > 0 ? month.conversions_value / month.ad_spend : 0,
            aov: month.conversions > 0 ? month.conversions_value / month.conversions : 0,
            ctr: month.impressions > 0 ? month.clicks / month.impressions : 0,
            cpc: month.clicks > 0 ? month.ad_spend / month.clicks : 0,
            conv_rate: month.clicks > 0 ? month.conversions / month.clicks : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Format month labels
    const formatMonthLabel = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Get YTD data
    const getYTDData = useMemo(() => {
        if (!metrics_by_date) return [];
        
        const currentYear = new Date(endDate).getFullYear();
        const endOfPeriod = new Date(endDate);
        
        return metrics_by_date.filter(row => {
            if (!row.date) return false;
            const rowDate = new Date(row.date);
            return rowDate.getFullYear() === currentYear && rowDate <= endOfPeriod;
        });
    }, [metrics_by_date, endDate]);

    // Get YTD comparison data (previous year)
    const getYTDComparisonData = useMemo(() => {
        if (!metrics_by_date) return [];
        
        const currentYear = new Date(endDate).getFullYear();
        const previousYear = currentYear - 1;
        const endOfPeriod = new Date(endDate);
        endOfPeriod.setFullYear(previousYear);
        
        return metrics_by_date.filter(row => {
            if (!row.date) return false;
            const rowDate = new Date(row.date);
            return rowDate.getFullYear() === previousYear && rowDate <= endOfPeriod;
        });
    }, [metrics_by_date, endDate]);

    const monthlyYTDData = useMemo(() => groupDataByMonth(getYTDData), [getYTDData]);
    const monthlyYTDComparisonData = useMemo(() => groupDataByMonth(getYTDComparisonData), [getYTDComparisonData]);

    // Campaign-specific aggregation functions
    const aggregateCampaignDataByWeek = (dataArray) => {
        if (!dataArray || dataArray.length === 0) return [];
        
        const weekMap = {};
        
        dataArray.forEach(row => {
            if (!row.date || !row.campaign_name) return;
            
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;
            
            // Get Monday of the week
            const monday = new Date(date);
            monday.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
            const weekKey = `${monday.toISOString().split('T')[0]}_${row.campaign_name}`;
            
            if (!weekMap[weekKey]) {
                weekMap[weekKey] = {
                    date: monday.toISOString().split('T')[0],
                    campaign_name: row.campaign_name,
                    ad_spend: 0,
                    conversions_value: 0,
                    conversions: 0,
                    impressions: 0,
                    clicks: 0,
                    count: 0
                };
            }
            
            weekMap[weekKey].ad_spend += row.ad_spend || 0;
            weekMap[weekKey].conversions_value += row.conversions_value || 0;
            weekMap[weekKey].conversions += row.conversions || 0;
            weekMap[weekKey].impressions += row.impressions || 0;
            weekMap[weekKey].clicks += row.clicks || 0;
            weekMap[weekKey].count += 1;
        });
        
        return Object.values(weekMap).map(week => ({
            ...week,
            roas: week.ad_spend > 0 ? week.conversions_value / week.ad_spend : 0,
            aov: week.conversions > 0 ? week.conversions_value / week.conversions : 0,
            ctr: week.impressions > 0 ? week.clicks / week.impressions : 0,
            cpc: week.clicks > 0 ? week.ad_spend / week.clicks : 0,
            conv_rate: week.clicks > 0 ? week.conversions / week.clicks : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const groupCampaignDataByMonth = (dataArray) => {
        if (!dataArray || dataArray.length === 0) return [];
        
        const monthMap = {};
        
        dataArray.forEach(row => {
            if (!row.date || !row.campaign_name) return;
            
            const date = new Date(row.date);
            if (isNaN(date.getTime())) return;
            
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthKey = `${yearMonth}_${row.campaign_name}`;
            
            if (!monthMap[monthKey]) {
                monthMap[monthKey] = {
                    date: yearMonth,
                    campaign_name: row.campaign_name,
                    ad_spend: 0,
                    conversions_value: 0,
                    conversions: 0,
                    impressions: 0,
                    clicks: 0,
                    count: 0
                };
            }
            
            monthMap[monthKey].ad_spend += row.ad_spend || 0;
            monthMap[monthKey].conversions_value += row.conversions_value || 0;
            monthMap[monthKey].conversions += row.conversions || 0;
            monthMap[monthKey].impressions += row.impressions || 0;
            monthMap[monthKey].clicks += row.clicks || 0;
            monthMap[monthKey].count += 1;
        });
        
        return Object.values(monthMap).map(month => ({
            ...month,
            roas: month.ad_spend > 0 ? month.conversions_value / month.ad_spend : 0,
            aov: month.conversions > 0 ? month.conversions_value / month.conversions : 0,
            ctr: month.impressions > 0 ? month.clicks / month.impressions : 0,
            cpc: month.clicks > 0 ? month.ad_spend / month.clicks : 0,
            conv_rate: month.clicks > 0 ? month.conversions / month.clicks : 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Get YTD campaigns data
    const getYTDCampaignsData = useMemo(() => {
        if (!campaigns_by_date) return [];
        
        const currentYear = new Date(endDate).getFullYear();
        const endOfPeriod = new Date(endDate);
        
        return campaigns_by_date.filter(row => {
            if (!row.date) return false;
            const rowDate = new Date(row.date);
            return rowDate.getFullYear() === currentYear && rowDate <= endOfPeriod;
        });
    }, [campaigns_by_date, endDate]);

    const monthlyCampaignsYTDData = useMemo(() => groupCampaignDataByMonth(getYTDCampaignsData), [getYTDCampaignsData]);

    const filteredComparisonMetricsByDate = useMemo(() => {
        return metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
    }, [metrics_by_date, compStart, compEnd]);

    const filteredMetricsByDate = useMemo(() => {
        return metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [metrics_by_date, startDate, endDate]);

    const filteredCampaignsByDate = useMemo(() => {
        return campaigns_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
    }, [campaigns_by_date, startDate, endDate]);

    const allCampaigns = useMemo(() => {
        const campaignMap = filteredCampaignsByDate.reduce((acc, row) => {
            acc[row.campaign_name] = {
                clicks: (acc[row.campaign_name]?.clicks || 0) + (row.clicks || 0),
                impressions: (acc[row.campaign_name]?.impressions || 0) + (row.impressions || 0),
                ctr: row.impressions > 0 ? (acc[row.campaign_name]?.clicks || 0) / (acc[row.campaign_name]?.impressions || 1) : 0,
            };
            return acc;
        }, {});
        return Object.entries(campaignMap)
            .map(([campaign_name, data]) => ({
                campaign_name,
                clicks: data.clicks,
                impressions: data.impressions,
                ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
            }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [filteredCampaignsByDate]);

    const getComparisonMetricValue = (currentDate, metricName) => {
        const currentStartDateTime = new Date(startDate).getTime();
        const currentDateTime = new Date(currentDate).getTime();
        const daysSinceStart = Math.floor((currentDateTime - currentStartDateTime) / (86400000));

        const compStartDateTime = new Date(compStart).getTime();
        const targetCompDateTime = new Date(compStartDateTime + (daysSinceStart * 86400000));
        const targetCompDate = formatDate(targetCompDateTime);

        const compData = filteredComparisonMetricsByDate.find(row => row.date === targetCompDate);

        if (!compData) return null;

        switch (metricName) {
            case "Conv. Value": return compData.conversions_value || 0;
            case "Ad Spend": return compData.ad_spend || 0;
            case "ROAS": return compData.roas || 0;
            case "AOV": return compData.aov || 0;
            case "Conversions": return compData.conversions || 0;
            case "Impressions": return compData.impressions || 0;
            case "Clicks": return compData.clicks || 0;
            case "CTR": return compData.ctr || 0;
            case "CPC": return compData.cpc || 0;
            case "Conv. Rate": return compData.conv_rate || 0;
            default: return 0;
        }
    };

    const metrics = useMemo(() => {
        return filteredMetricsByDate.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                conversions: acc.conversions + (row.conversions || 0),
                conversions_value: acc.conversions_value + (row.conversions_value || 0),
                ad_spend: acc.ad_spend + (row.ad_spend || 0),
                roas: row.ad_spend > 0 ? acc.conversions_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversions_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversions_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                conv_rate: 0,
            }
        );
    }, [filteredMetricsByDate]);

    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        return comparisonData.reduce(
            (acc, row) => ({
                clicks: acc.clicks + (row.clicks || 0),
                impressions: acc.impressions + (row.impressions || 0),
                conversions: acc.conversions + (row.conversions || 0),
                conversions_value: acc.conversions_value + (row.conversions_value || 0),
                ad_spend: acc.ad_spend + (row.ad_spend || 0),
                roas: row.ad_spend > 0 ? acc.conversions_value / acc.ad_spend : 0,
                aov: acc.conversions > 0 ? acc.conversions_value / acc.conversions : 0,
                ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
                cpc: acc.clicks > 0 ? acc.ad_spend / acc.clicks : 0,
                conv_rate: acc.clicks > 0 ? acc.conversions / acc.clicks : 0,
            }),
            {
                clicks: 0,
                impressions: 0,
                conversions: 0,
                conversions_value: 0,
                ad_spend: 0,
                roas: 0,
                aov: 0,
                ctr: 0,
                cpc: 0,
                conv_rate: 0,
            }
        );
    }, [metrics_by_date, compStart, compEnd]);

    const filteredTopCampaigns = useMemo(() => {
        return allCampaigns
            .filter(item =>
                campaignSearch ?
                    item.campaign_name.toLowerCase().includes(campaignSearch.toLowerCase()) :
                    true
            )
            .slice(0, campaignSearch ? undefined : 10);
    }, [allCampaigns, campaignSearch]);

    const selectedCampaigns = useMemo(() => {
        return filteredTopCampaigns.slice(0, 5).map(item => item.campaign_name);
    }, [filteredTopCampaigns]);

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
            value: metrics.conversions_value ? Math.round(metrics.conversions_value).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.conversions_value, comparisonMetrics.conversions_value),
            positive: metrics.conversions_value >= comparisonMetrics.conversions_value,
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
            label: "Conv. Rate",
            value: metrics.conv_rate ? `${(metrics.conv_rate * 100).toFixed(2)}%` : "0.00%",
            delta: calculateDelta(metrics.conv_rate, comparisonMetrics.conv_rate),
            positive: metrics.conv_rate >= comparisonMetrics.conv_rate,
        },
    ];

    const metricsChartData = useMemo(() => {
        let currentData, comparisonData, currentLabels;
        
        if (metricsViewMode === "YTD") {
            currentData = monthlyYTDData;
            comparisonData = monthlyYTDComparisonData;
            currentLabels = currentData.map(row => formatMonthLabel(row.date));
        } else {
            // Period view
            if (metricsPeriodGranularity === "Weekly") {
                currentData = aggregateDataByWeek(filteredMetricsByDate);
                comparisonData = aggregateDataByWeek(filteredComparisonMetricsByDate);
                currentLabels = currentData.map(row => formatWeekLabel(row.date));
            } else {
                // Daily
                currentData = filteredMetricsByDate;
                comparisonData = filteredComparisonMetricsByDate;
                currentLabels = currentData.map(row => row.date);
            }
        }
        
        const getMetricValue = (row) => {
            switch (selectedMetric) {
                case "Conv. Value":
                    return row.conversions_value || 0;
                case "Ad Spend":
                    return row.ad_spend || 0;
                case "ROAS":
                    return row.roas || 0;
                case "AOV":
                    return row.aov || 0;
                case "Conversions":
                    return row.conversions || 0;
                case "Impressions":
                    return row.impressions || 0;
                case "Clicks":
                    return row.clicks || 0;
                case "CTR":
                    return (row.ctr || 0) * 100;
                case "CPC":
                    return row.cpc || 0;
                case "Conv. Rate":
                    return (row.conv_rate || 0) * 100;
                default:
                    return 0;
            }
        };
        
        return {
            labels: currentLabels,
            datasets: [
                {
                    label: selectedMetric,
                    data: currentData.map(getMetricValue),
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                },
                {
                    label: `${selectedMetric} (${comparison})`,
                    data: comparisonData.map(getMetricValue),
                    borderColor: colors.hue3,
                    backgroundColor: colors.hue3,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                    borderDash: [5, 5],
                }
            ],
        };
    }, [metricsViewMode, metricsPeriodGranularity, selectedMetric, monthlyYTDData, monthlyYTDComparisonData, filteredMetricsByDate, filteredComparisonMetricsByDate, colors, comparison]);

    const cpcChartData = {
        labels: filteredMetricsByDate.map((row) => row.date) || [],
        datasets: [
            {
                label: cpcMetric,
                data: filteredMetricsByDate.map((row) => {
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
                }) || [],
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
            },
            {
                label: `${cpcMetric} (${comparison})`,
                data: filteredMetricsByDate.map(row => getComparisonMetricValue(row.date, cpcMetric)),
                borderColor: colors.hue3,
                backgroundColor: colors.hue3,
                borderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                borderDash: [5, 5],
            }
        ],
    };

    const campaignChartData = useMemo(() => {
        let currentData, currentLabels;
        
        if (campaignsViewMode === "YTD") {
            currentData = monthlyCampaignsYTDData;
            currentLabels = [...new Set(currentData.map(row => row.date))].sort().map(date => formatMonthLabel(date));
        } else {
            // Period view
            if (campaignsPeriodGranularity === "Weekly") {
                currentData = aggregateCampaignDataByWeek(filteredCampaignsByDate);
                currentLabels = [...new Set(currentData.map(row => row.date))].sort().map(date => formatWeekLabel(date));
            } else {
                // Daily
                currentData = filteredCampaignsByDate;
                currentLabels = [...new Set(currentData.map(row => row.date))].sort();
            }
        }
        
        const getMetricValue = (row) => {
            switch (selectedMetric) {
                case "Conv. Value":
                    return row.conversions_value || 0;
                case "Ad Spend":
                    return row.ad_spend || 0;
                case "ROAS":
                    return row.roas || 0;
                case "AOV":
                    return row.aov || 0;
                case "Conversions":
                    return row.conversions || 0;
                case "Impressions":
                    return row.impressions || 0;
                case "Clicks":
                    return row.clicks || 0;
                case "CTR":
                    return (row.ctr || 0) * 100;
                case "CPC":
                    return row.cpc || 0;
                case "Conv. Rate":
                    return (row.conv_rate || 0) * 100;
                default:
                    return 0;
            }
        };
        
        return {
            labels: currentLabels,
            datasets: selectedCampaigns.map((campaign, i) => {
                const campaignData = currentData.filter(row => row.campaign_name === campaign && row.impressions > 0);
                
                let chartData;
                if (campaignsViewMode === "YTD" || campaignsPeriodGranularity === "Weekly") {
                    // For YTD and weekly, use category-based data
                    chartData = campaignData.map(row => getMetricValue(row));
                } else {
                    // For daily period view, use time-based data
                    chartData = campaignData.map(row => ({
                        x: row.date,
                        y: getMetricValue(row)
                    }));
                }
                
                return {
                    label: campaign,
                    data: chartData,
                    borderColor: colors[`hue${(i % 4) + 1}`] || colors.primary,
                    backgroundColor: colors[`hue${(i % 4) + 1}`] || colors.primary,
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: false,
                };
            }),
        };
    }, [campaignsViewMode, campaignsPeriodGranularity, selectedMetric, monthlyCampaignsYTDData, filteredCampaignsByDate, selectedCampaigns, colors]);

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

    // Dynamic chart options based on view mode
    const getChartOptions = (viewMode, periodGranularity) => {
        const baseOptions = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
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
                            return `${label}: ${typeof value === 'number' ? value.toLocaleString('en-US') : value}`;
                        }
                    }
                },
            },
        };
        
        // For YTD view (monthly) or Period view, adjust x-axis scale
        if (viewMode === "YTD" || periodGranularity === "Weekly") {
            baseOptions.scales.x.type = "category";
        } else {
            baseOptions.scales.x.type = "time";
            baseOptions.scales.x.time = { unit: "day" };
        }
        
        return baseOptions;
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
                ticks: {
                    font: { size: 10 },
                    callback: (value) => value.toLocaleString('en-US')
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
                        return `${label}: ${typeof value === 'number' ? value.toLocaleString('en-US') : value}`;
                    }
                }
            },
        },
    };

    const chartComponents = [
        {
            title: selectedMetric,
            chart: <Line data={metricsChartData} options={getChartOptions(metricsViewMode, metricsPeriodGranularity)} />,
            selector: (
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="border px-2 py-1 rounded text-xs"
                >
                    <option>Conv. Value</option>
                    <option>Ad Spend</option>
                    <option>ROAS</option>
                    <option>AOV</option>
                    <option>Conversions</option>
                    <option>Impressions</option>
                    <option>Clicks</option>
                    <option>CTR</option>
                    <option>CPC</option>
                    <option>Conv. Rate</option>
                </select>
            )
        },
        {
            title: "Top Campaigns",
            chart: <Line data={campaignChartData} options={getChartOptions(campaignsViewMode, campaignsPeriodGranularity)} />,
            selector: null
        },
        {
            title: cpcMetric,
            chart: <Line data={cpcChartData} options={chartOptions} />,
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

    if (isLoading) {
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
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                        <p className="mt-4 text-[var(--color-dark-green)]">Loading PPC dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

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
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)]"></div>
                            <p className="text-[var(--color-dark-green)] font-medium">Loading PPC data...</p>
                        </div>
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
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Google Ads Dashboard</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Overview of key Google Ads metrics including conversions, ad spend, and campaign performance.
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
                                    <button
                                        onClick={handleApplyDates}
                                        disabled={isLoading}
                                        className="bg-[var(--color-lime)] hover:bg-[var(--color-dark-green)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                                    >
                                        {isLoading ? 'Loading...' : 'Apply'}
                                    </button>
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
                                <div 
                                    key={i} 
                                    className={`p-4 transition-all duration-200 cursor-pointer ${
                                        selectedMetric === item.label 
                                            ? 'bg-[var(--color-primary-searchmind)]' 
                                            : 'bg-white hover:bg-[var(--color-natural)]'
                                    }`}
                                    onClick={() => setSelectedMetric(item.label)}
                                >
                                    <p className={`text-xs font-medium mb-1 ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-green)]'
                                    }`}>
                                        {item.label}
                                    </p>
                                    <p className={`text-xl font-bold ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-dark-green)]'
                                    }`}>
                                        {item.value}
                                    </p>
                                    {item.delta && (
                                        <h6 className={`text-xs font-semibold ${
                                            selectedMetric === item.label 
                                                ? (item.positive ? "text-green-200" : "text-red-200")
                                                : (item.positive ? "text-green-600" : "text-red-500")
                                        }`}>
                                            {item.delta}
                                        </h6>
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
                        <div 
                            key={i} 
                            className={`border rounded-lg shadow-sm p-6 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                selectedMetric === item.label 
                                    ? 'bg-[var(--color-primary-searchmind)] border-[var(--color-primary-searchmind)]' 
                                    : 'bg-white border-[var(--color-light-natural)] hover:border-[var(--color-green)]'
                            }`}
                            onClick={() => setSelectedMetric(item.label)}
                        >
                            <div className="flex flex-col">
                                <p className={`text-sm font-medium mb-2 ${
                                    selectedMetric === item.label 
                                        ? 'text-white-important' 
                                        : 'text-[var(--color-green)]'
                                }`}>
                                    {item.label}
                                </p>
                                <div className="flex items-baseline justify-between">
                                    <p className={`text-2xl md:text-3xl font-bold ${
                                        selectedMetric === item.label 
                                            ? 'text-white-important' 
                                            : 'text-[var(--color-dark-green)]'
                                    }`}>
                                        {item.value}
                                    </p>
                                    {item.delta && (
                                        <div className="flex flex-col items-end">
                                            <h6 className={`text-sm font-semibold ${
                                                selectedMetric === item.label 
                                                    ? (item.positive ? "text-green-200" : "text-red-200")
                                                    : (item.positive ? "text-green-600" : "text-red-500")
                                            }`}>
                                                {item.delta}
                                            </h6>
                                            <h6 className={`text-xs mt-1 ${
                                                selectedMetric === item.label 
                                                    ? 'text-white-important opacity-80' 
                                                    : 'text-[var(--color-green)]'
                                            }`}>
                                                vs prev period
                                            </h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-8">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4 h-[320px]">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">{chartComponents[activeChartIndex].title}</h3>
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
                            <div className="flex items-center justify-between gap-2">
                                {activeChartIndex === 0 && (
                                    <>
                                        <ViewModeToggle
                                            viewMode={metricsViewMode}
                                            setViewMode={setMetricsViewMode}
                                            periodGranularity={metricsPeriodGranularity}
                                            setPeriodGranularity={setMetricsPeriodGranularity}
                                        />
                                        <select
                                            value={selectedMetric}
                                            onChange={(e) => setSelectedMetric(e.target.value)}
                                            className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                        >
                                            <option>Conv. Value</option>
                                            <option>Ad Spend</option>
                                            <option>ROAS</option>
                                            <option>AOV</option>
                                            <option>Conversions</option>
                                            <option>Impressions</option>
                                            <option>Clicks</option>
                                            <option>CTR</option>
                                            <option>CPC</option>
                                            <option>Conv. Rate</option>
                                        </select>
                                    </>
                                )}
                                {activeChartIndex === 1 && (
                                    <ViewModeToggle
                                        viewMode={campaignsViewMode}
                                        setViewMode={setCampaignsViewMode}
                                        periodGranularity={campaignsPeriodGranularity}
                                        setPeriodGranularity={setCampaignsPeriodGranularity}
                                    />
                                )}
                                {activeChartIndex === 2 && (
                                    <select
                                        value={cpcMetric}
                                        onChange={(e) => setCpcMetric(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-2 py-1 rounded text-xs bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime)]"
                                    >
                                        <option>CPC</option>
                                        <option>CTR</option>
                                        <option>Conv. Rate</option>
                                    </select>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-[250px]">
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
                        <div className="flex items-center gap-4">
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
                                <option>Conv. Value</option>
                                <option>Ad Spend</option>
                                <option>ROAS</option>
                                <option>AOV</option>
                                <option>Conversions</option>
                                <option>Impressions</option>
                                <option>Clicks</option>
                                <option>CTR</option>
                                <option>CPC</option>
                                <option>Conv. Rate</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-[300px]">
                        <Line data={metricsChartData} options={getChartOptions(metricsViewMode, metricsPeriodGranularity)} />
                    </div>
                </div>

                {/* Desktop Campaigns Table and Chart */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={campaignSearch}
                                    onChange={(e) => setCampaignSearch(e.target.value)}
                                    className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm pr-8 w-48 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                />
                                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
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
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Campaigns Over Time</h3>
                            <div className="flex items-center gap-4">
                                <ViewModeToggle
                                    viewMode={campaignsViewMode}
                                    setViewMode={setCampaignsViewMode}
                                    periodGranularity={campaignsPeriodGranularity}
                                    setPeriodGranularity={setCampaignsPeriodGranularity}
                                />
                                <select
                                    className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    value={selectedMetric}
                                    onChange={(e) => setSelectedMetric(e.target.value)}
                                >
                                    <option>Impressions</option>
                                    <option>Clicks</option>
                                    <option>CTR</option>
                                    <option>CPC</option>
                                    <option>Conv. Rate</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-[calc(100%-2rem)] min-h-[300px] max-h-[500px] overflow-y-auto">
                            <Line data={campaignChartData} options={getChartOptions(campaignsViewMode, campaignsPeriodGranularity)} />
                        </div>
                    </div>
                </div>

                {/* Mobile Campaigns Section */}
                <div className="md:hidden bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-natural)]">
                        <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">Top Performance Campaigns</h3>
                    </div>
                    <div className="p-4 border-b border-[var(--color-light-natural)]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={campaignSearch}
                                onChange={(e) => setCampaignSearch(e.target.value)}
                                className="border border-[var(--color-dark-natural)] w-full px-3 py-2 rounded-lg text-sm pr-8 text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-green)]" size={14} />
                        </div>
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
            </div>
        </div>
    );
}