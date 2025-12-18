"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import Subheading from "@/app/components/UI/Utility/Subheading";
import currencyExchangeData from "@/lib/static-data/currencyApiValues.json";
import { ClickUpUsersProvider } from "@/app/contexts/ClickUpUsersContext";
import CustomerAssignedUsers from "@/app/components/CampaignPlanner/CustomerAssignedUsers";

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

    const revenueFields = ['revenue', 'revenue_ex_tax'];
    const convertedRow = { ...row };

    revenueFields.forEach(field => {
        if (convertedRow[field] !== undefined && convertedRow[field] !== null) {
            convertedRow[field] = convertCurrency(convertedRow[field], fromCurrency);
        }
    });

    return convertedRow;
};

export default function OverviewDashboard({ customerId, customerName, customerValutaCode, initialData, customerRevenueType }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const { overview_metrics = [], totals = {}, last_year_totals = {}, last_year_metrics = [], two_years_ago_totals = {} } = initialData || {};

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(searchParams.get('startDate') || formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || formatDate(yesterday));
    const [tempStartDate, setTempStartDate] = useState(searchParams.get('startDate') || formatDate(firstDayOfMonth));
    const [tempEndDate, setTempEndDate] = useState(searchParams.get('endDate') || formatDate(yesterday));
    const [metricView, setMetricView] = useState("roas");
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedLastYearRows, setExpandedLastYearRows] = useState({});
    const [loading, setLoading] = useState(true);
    const [changeCurrency, setChangeCurrency] = useState(true);

    useEffect(() => {
        if (initialData) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [initialData]);

    /*
    useEffect(() => {
        const testSalesAnalytics = async () => {
            try {
                // You'll need to get the Shopify credentials - 
                // either pass them from the page component or fetch them
                const response = await fetch(`/api/shopify-sales-test?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`);
                const data = await response.json();
                console.log('Sales Analytics Response:', data);
            } catch (error) {
                console.error('Error fetching sales analytics:', error);
            }
        };

        if (customerId && startDate && endDate) {
            testSalesAnalytics();
        }
    }, [customerId, startDate, endDate]);
    */

    useEffect(() => {
        const fetchCustomerSettings = async () => {
            try {
                const response = await fetch(`/api/customer-settings/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMetricView(data.metricPreference || "ROAS/POAS");
                    setChangeCurrency(data.changeCurrency ?? true);
                }
            } catch (error) {
                console.error("Error fetching customer settings:", error);
            }
        }

        fetchCustomerSettings()
    }, [customerId])

    const handleDateChange = (newStartDate, newEndDate) => {
        if (newStartDate) setTempStartDate(newStartDate);
        if (newEndDate) setTempEndDate(newEndDate);
    };

    const handleApplyDates = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        
        // Show loading state and trigger navigation
        setLoading(true);
        startTransition(() => {
            router.push(`/dashboard/${customerId}?startDate=${tempStartDate}&endDate=${tempEndDate}`);
        });
    };

    const toggleRowExpansion = (index) => {
        setExpandedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleLastYearRowExpansion = (index) => {
        setExpandedLastYearRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (!overview_metrics || overview_metrics.length === 0) {
        return <div>No data available for {customerId}</div>;
    }

    const COGS = 0.7;

    const filteredMetrics = useMemo(() => {
        return overview_metrics
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(row => {
                const convertedRow = convertDataRow(row, customerValutaCode, changeCurrency);

                return {
                    ...convertedRow,
                    revenue: customerRevenueType === "net_sales" ? convertedRow.net_sales : convertedRow.revenue,
                    spendshare: convertedRow.revenue_ex_tax > 0 ? (convertedRow.ppc_cost + convertedRow.ps_cost) / convertedRow.revenue_ex_tax : 0,
                    spendshare_db: convertedRow.revenue_ex_tax > 0 ? (convertedRow.ppc_cost + convertedRow.ps_cost) / (0.7 * convertedRow.revenue_ex_tax) : 0,
                    roas: (convertedRow.ppc_cost + convertedRow.ps_cost) > 0 ? convertedRow.revenue / (convertedRow.ppc_cost + convertedRow.ps_cost) : 0,
                    poas: (convertedRow.ppc_cost + convertedRow.ps_cost) > 0 ? (convertedRow.revenue * (1 - 0.25) - convertedRow.revenue * 0.7) / (convertedRow.ppc_cost + convertedRow.ps_cost) : 0,
                    gp: convertedRow.revenue * (1 - 0.25) - convertedRow.revenue * 0.7,
                    aov: convertedRow.orders > 0 ? convertedRow.revenue / convertedRow.orders : 0,
                };
            });
    }, [overview_metrics, customerValutaCode, changeCurrency, customerRevenueType]);

    const filteredTotals = useMemo(() => {
        return filteredMetrics.reduce(
            (acc, row) => ({
                date: "Total",
                orders: acc.orders + row.orders,
                revenue: acc.revenue + row.revenue,
                revenue_ex_tax: acc.revenue_ex_tax + row.revenue_ex_tax,
                ppc_cost: acc.ppc_cost + row.ppc_cost,
                ps_cost: acc.ps_cost + row.ps_cost,
                roas:
                    acc.ppc_cost + acc.ps_cost > 0
                        ? acc.revenue / (acc.ppc_cost + acc.ps_cost)
                        : 0,
                poas:
                    acc.ppc_cost + acc.ps_cost > 0
                        ? (acc.revenue * (1 - 0.25) - acc.revenue * 0.7) / (acc.ppc_cost + acc.ps_cost)
                        : 0,
                spendshare:
                    acc.revenue_ex_tax > 0 ? (acc.ppc_cost + acc.ps_cost) / acc.revenue_ex_tax : 0,
                spendshare_db:
                    acc.revenue_ex_tax > 0 ? (acc.ppc_cost + acc.ps_cost) / (0.7 * acc.revenue_ex_tax) : 0,
                gp: acc.gp + row.gp,
                aov: acc.orders > 0 ? acc.revenue / acc.orders : 0,
            }),
            {
                orders: 0,
                revenue: 0,
                revenue_ex_tax: 0,
                ppc_cost: 0,
                ps_cost: 0,
                roas: 0,
                poas: 0,
                spendshare: 0,
                spendshare_db: 0,
                gp: 0,
                aov: 0,
            }
        );
    }, [filteredMetrics]);

    const lastYearStart = formatDate(new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() - 1)));
    const lastYearEnd = formatDate(new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - 1)));

    const lastYearMetrics = useMemo(() => {
        return last_year_metrics
            .map(row => {
                // Convert currency for revenue fields
                const convertedRow = convertDataRow(row, customerValutaCode, changeCurrency);

                // Return with all calculated metrics
                return {
                    ...convertedRow,
                    spendshare: convertedRow.revenue_ex_tax > 0 ? (convertedRow.ppc_cost + convertedRow.ps_cost) / convertedRow.revenue_ex_tax : 0,
                    spendshare_db: convertedRow.revenue_ex_tax > 0 ? (convertedRow.ppc_cost + convertedRow.ps_cost) / (0.7 * convertedRow.revenue_ex_tax) : 0,
                    roas: (convertedRow.ppc_cost + convertedRow.ps_cost) > 0 ? convertedRow.revenue / (convertedRow.ppc_cost + convertedRow.ps_cost) : 0,
                    poas: (convertedRow.ppc_cost + convertedRow.ps_cost) > 0 ? (convertedRow.revenue * (1 - 0.25) - convertedRow.revenue * 0.7) / (convertedRow.ppc_cost + convertedRow.ps_cost) : 0,
                    gp: convertedRow.revenue * (1 - 0.25) - convertedRow.revenue * 0.7,
                    aov: convertedRow.orders > 0 ? convertedRow.revenue / convertedRow.orders : 0,
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [last_year_metrics, customerValutaCode, changeCurrency]);

    const filteredLastYearTotals = useMemo(() => {
        return lastYearMetrics.reduce(
            (acc, row) => ({
                date: "Last Year Total",
                orders: acc.orders + row.orders,
                revenue: acc.revenue + row.revenue,
                revenue_ex_tax: acc.revenue_ex_tax + row.revenue_ex_tax,
                ppc_cost: acc.ppc_cost + row.ppc_cost,
                ps_cost: acc.ps_cost + row.ps_cost,
                roas:
                    acc.ppc_cost + acc.ps_cost > 0
                        ? acc.revenue / (acc.ppc_cost + acc.ps_cost)
                        : 0,
                poas:
                    acc.ppc_cost + acc.ps_cost > 0
                        ? (acc.revenue * (1 - 0.25) - acc.revenue * 0.7) / (acc.ppc_cost + acc.ps_cost)
                        : 0,
                spendshare:
                    acc.revenue_ex_tax > 0 ? (acc.ppc_cost + acc.ps_cost) / acc.revenue_ex_tax : 0,
                spendshare_db:
                    acc.revenue_ex_tax > 0 ? (acc.ppc_cost + acc.ps_cost) / (0.7 * acc.revenue_ex_tax) : 0,
                gp: acc.gp + row.gp,
                aov: acc.orders > 0 ? acc.revenue / acc.orders : 0,
            }),
            {
                orders: 0,
                revenue: 0,
                revenue_ex_tax: 0,
                ppc_cost: 0,
                ps_cost: 0,
                roas: 0,
                poas: 0,
                spendshare: 0,
                spendshare_db: 0,
                gp: 0,
                aov: 0,
            }
        );
    }, [lastYearMetrics]);

    const differences = useMemo(() => ({
        orders: filteredTotals.orders - filteredLastYearTotals.orders,
        revenue: filteredTotals.revenue - filteredLastYearTotals.revenue,
        revenue_ex_tax: filteredTotals.revenue_ex_tax - filteredLastYearTotals.revenue_ex_tax,
        ppc_cost: filteredTotals.ppc_cost - filteredLastYearTotals.ppc_cost,
        ps_cost: filteredTotals.ps_cost - filteredLastYearTotals.ps_cost,
        roas: filteredTotals.roas - filteredLastYearTotals.roas,
        poas: filteredTotals.poas - filteredLastYearTotals.poas,
        spendshare: filteredTotals.spendshare - filteredLastYearTotals.spendshare,
        spendshare_db: filteredTotals.spendshare_db - filteredLastYearTotals.spendshare_db,
        gp: filteredTotals.gp - filteredLastYearTotals.gp,
        aov: filteredTotals.aov - filteredLastYearTotals.aov,
    }), [filteredTotals, filteredLastYearTotals]);

    const calculateIndex = (current, lastYear) => {
        if (lastYear === 0 || lastYear === null || lastYear === undefined) {
            return 0;
        }
        return (current / lastYear) * 100;
    };

    const indexMetrics = useMemo(() => {
        return {
            orders: calculateIndex(filteredTotals.orders, filteredLastYearTotals.orders),
            revenue: calculateIndex(filteredTotals.revenue, filteredLastYearTotals.revenue),
            revenue_ex_tax: calculateIndex(filteredTotals.revenue_ex_tax, filteredLastYearTotals.revenue_ex_tax),
            ppc_cost: calculateIndex(filteredTotals.ppc_cost, filteredLastYearTotals.ppc_cost),
            ps_cost: calculateIndex(filteredTotals.ps_cost, filteredLastYearTotals.ps_cost),
            roas: calculateIndex(filteredTotals.roas, filteredLastYearTotals.roas),
            poas: calculateIndex(filteredTotals.poas, filteredLastYearTotals.poas),
            spendshare: calculateIndex(filteredTotals.spendshare, filteredLastYearTotals.spendshare),
            spendshare_db: calculateIndex(filteredTotals.spendshare_db, filteredLastYearTotals.spendshare_db),
            gp: calculateIndex(filteredTotals.gp, filteredLastYearTotals.gp),
            aov: calculateIndex(filteredTotals.aov, filteredLastYearTotals.aov),
        };
    }, [filteredTotals, filteredLastYearTotals]);

    // Calculate differences between last year and 2 years ago
    const lastYearDifferences = useMemo(() => ({
        orders: filteredLastYearTotals.orders - (two_years_ago_totals.orders || 0),
        revenue: filteredLastYearTotals.revenue - (two_years_ago_totals.revenue || 0),
        revenue_ex_tax: filteredLastYearTotals.revenue_ex_tax - (two_years_ago_totals.revenue_ex_tax || 0),
        ppc_cost: filteredLastYearTotals.ppc_cost - (two_years_ago_totals.ppc_cost || 0),
        ps_cost: filteredLastYearTotals.ps_cost - (two_years_ago_totals.ps_cost || 0),
        roas: filteredLastYearTotals.roas - (two_years_ago_totals.roas || 0),
        poas: filteredLastYearTotals.poas - (two_years_ago_totals.poas || 0),
        spendshare: filteredLastYearTotals.spendshare - (two_years_ago_totals.spendshare || 0),
        spendshare_db: filteredLastYearTotals.spendshare_db - (two_years_ago_totals.spendshare_db || 0),
        gp: filteredLastYearTotals.gp - (two_years_ago_totals.gp || 0),
        aov: filteredLastYearTotals.aov - (two_years_ago_totals.aov || 0),
    }), [filteredLastYearTotals, two_years_ago_totals]);

    // Calculate index for last year (comparing last year to 2 years ago)
    const lastYearIndexMetrics = useMemo(() => {
        const calculateIndex = (current, previous) => {
            if (!previous || previous === 0) return current > 0 ? 100 : 0;
            return (current / previous) * 100;
        };

        return {
            orders: calculateIndex(filteredLastYearTotals.orders, two_years_ago_totals.orders),
            revenue: calculateIndex(filteredLastYearTotals.revenue, two_years_ago_totals.revenue),
            revenue_ex_tax: calculateIndex(filteredLastYearTotals.revenue_ex_tax, two_years_ago_totals.revenue_ex_tax),
            ppc_cost: calculateIndex(filteredLastYearTotals.ppc_cost, two_years_ago_totals.ppc_cost),
            ps_cost: calculateIndex(filteredLastYearTotals.ps_cost, two_years_ago_totals.ps_cost),
            roas: calculateIndex(filteredLastYearTotals.roas, two_years_ago_totals.roas),
            poas: calculateIndex(filteredLastYearTotals.poas, two_years_ago_totals.poas),
            spendshare: calculateIndex(filteredLastYearTotals.spendshare, two_years_ago_totals.spendshare),
            spendshare_db: calculateIndex(filteredLastYearTotals.spendshare_db, two_years_ago_totals.spendshare_db),
            gp: calculateIndex(filteredLastYearTotals.gp, two_years_ago_totals.gp),
            aov: calculateIndex(filteredLastYearTotals.aov, two_years_ago_totals.aov),
        };
    }, [filteredLastYearTotals, two_years_ago_totals]);

    const metricRanges = useMemo(() => {
        const ranges = {
            orders: { min: Infinity, max: -Infinity },
            revenue: { min: Infinity, max: -Infinity },
            revenue_ex_tax: { min: Infinity, max: -Infinity },
            ppc_cost: { min: Infinity, max: -Infinity },
            ps_cost: { min: Infinity, max: -Infinity },
            roas: { min: Infinity, max: -Infinity },
            poas: { min: Infinity, max: -Infinity },
            spendshare: { min: Infinity, max: -Infinity },
            spendshare_db: { min: Infinity, max: -Infinity },
            gp: { min: Infinity, max: -Infinity },
            aov: { min: Infinity, max: -Infinity },
        };

        filteredMetrics.forEach(row => {
            Object.keys(ranges).forEach(key => {
                if (row[key] !== 0 && row[key] !== null && row[key] !== undefined) {
                    if (row[key] < ranges[key].min) ranges[key].min = row[key];
                    if (row[key] > ranges[key].max) ranges[key].max = row[key];
                }
            });
        });

        return ranges;
    }, [filteredMetrics]);

    const lastYearMetricRanges = useMemo(() => {
        const ranges = {
            orders: { min: Infinity, max: -Infinity },
            revenue: { min: Infinity, max: -Infinity },
            revenue_ex_tax: { min: Infinity, max: -Infinity },
            ppc_cost: { min: Infinity, max: -Infinity },
            ps_cost: { min: Infinity, max: -Infinity },
            roas: { min: Infinity, max: -Infinity },
            poas: { min: Infinity, max: -Infinity },
            spendshare: { min: Infinity, max: -Infinity },
            spendshare_db: { min: Infinity, max: -Infinity },
            gp: { min: Infinity, max: -Infinity },
            aov: { min: Infinity, max: -Infinity },
        };

        lastYearMetrics.forEach(row => {
            Object.keys(ranges).forEach(key => {
                if (row[key] !== 0 && row[key] !== null && row[key] !== undefined) {
                    if (row[key] < ranges[key].min) ranges[key].min = row[key];
                    if (row[key] > ranges[key].max) ranges[key].max = row[key];
                }
            });
        });

        return ranges;
    }, [lastYearMetrics]);

    const getHeatmapStyle = (value, metricKey, isLastYear = false) => {
        if (value === 0 || value === null || value === undefined) {
            return { backgroundColor: 'transparent' };
        }

        const ranges = isLastYear ? lastYearMetricRanges : metricRanges;

        if (ranges[metricKey].min === ranges[metricKey].max) {
            return { backgroundColor: 'transparent' };
        }

        const normalizedValue = (value - ranges[metricKey].min) /
            (ranges[metricKey].max - ranges[metricKey].min);

        const opacity = Math.max(0.05, normalizedValue);
        return {
            backgroundColor: `rgba(214, 205, 182, ${opacity})`,
        };
    };

    useEffect(() => {
        setExpandedRows({});
        setExpandedLastYearRows({});
    }, [startDate, endDate]);

    const tableHeader = customerRevenueType === "net_sales" ? "NET SALES" : "REVENUE";

    return (
        <ClickUpUsersProvider>
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
                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <Subheading headingText={customerName} />
                            <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px] inline-grid z-10">Overview</h1>
                            <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                                Daily overview of key performance metrics including orders, revenue, ad spend, and profitability.
                            </p>
                        </div>
                        <div className="lg:w-80 xl:w-96">
                            <div className="bg-white rounded-lg shadow-sm border border-[var(--color-light-natural)] p-4">
                                <CustomerAssignedUsers customerId={customerId} />
                            </div>
                        </div>
                    </div>

                    {/* Current Period Table */}
                    <div className="mb-6 md:mb-12 bg-white border border-gray-200 rounded-xl shadow-solid-s">
                        <div className="flex flex-col md:flex-row md:items-center p-6 border-b border-gray-100 bg-[var(--color-natural)] rounded-t-xl gap-4">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[var(--color-dark-green)] text-sm" />
                                <h3 className="text-base md:text-lg font-semibold text-[var(--color-dark-green)]">Current Period</h3>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto md:ml-auto">
                                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full md:w-auto">
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={tempStartDate}
                                            onChange={(e) => handleDateChange(e.target.value, null)}
                                            className="border border-gray-300 px-4 py-2 rounded text-sm w-full md:w-auto focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <span className="text-[var(--color-green)] hidden md:inline font-medium">to</span>
                                    <span className="text-[var(--color-green)] md:hidden text-sm">to</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={tempEndDate}
                                            onChange={(e) => handleDateChange(null, e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded text-sm w-full md:w-auto focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleApplyDates}
                                    className="bg-[var(--foreground)] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[var(--color-primary-searchmind)] cursor-pointer"
                                    disabled={isPending}
                                >
                                    {isPending ? "Applying..." : "Apply"}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto"></div>
                                <p className="mt-4 text-[var(--color-green)]">Loading overview data...</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table - Hidden on mobile */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full text-xs text-left">
                                        <thead className="bg-[var(--color-natural)] border-b border-gray-100">
                                            <tr className="text-[var(--color-dark-green)] uppercase font-medium">
                                                <th className="px-2 py-3">Date</th>
                                                <th className="px-2 py-3">Orders</th>
                                                <th className="px-2 py-3">{tableHeader}</th>
                                                <th className="px-2 py-3">Revenue Ex Tax</th>
                                                <th className="px-2 py-3">PPC Cost</th>
                                                <th className="px-2 py-3">PS Cost</th>
                                                <th className="px-2 py-3">{metricView === "ROAS/POAS" ? "ROAS" : "Spendshare"}</th>
                                                <th className="px-2 py-3">{metricView === "ROAS/POAS" ? "POAS" : "Spendshare inc. DB"}</th>
                                                <th className="px-2 py-3">GP</th>
                                                <th className="px-2 py-3">AOV</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[var(--color-dark-green)] text-xs">
                                            {filteredMetrics.map((row, i) => (
                                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-[var(--color-natural)]/30 transition-colors">
                                                    <td className="px-2 py-1 font-medium">{row.date}</td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.orders, 'orders')}>
                                                        {Math.round(row.orders).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.revenue, 'revenue')}>
                                                        kr. {Math.round(row.revenue).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax')}>
                                                        kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.ppc_cost, 'ppc_cost')}>
                                                        kr. {Math.round(row.ppc_cost).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.ps_cost, 'ps_cost')}>
                                                        kr. {Math.round(row.ps_cost).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.roas : row.spendshare, metricView === "ROAS/POAS" ? 'roas' : 'spendshare')}>
                                                        {metricView === "ROAS/POAS" ? `${row.roas.toFixed(2)}` : `${(row.spendshare * 100).toFixed(2)}%`}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.poas : row.spendshare_db, metricView === "ROAS/POAS" ? 'poas' : 'spendshare_db')}>
                                                        {metricView === "ROAS/POAS" ? `${row.poas.toFixed(2)}` : `${(row.spendshare_db * 100).toFixed(2)}%`}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.gp, 'gp')}>
                                                        kr. {Math.round(row.gp).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-1" style={getHeatmapStyle(row.aov, 'aov')}>
                                                        kr. {Math.round(row.aov).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-[var(--color-lime)]/10 border-t-2 border-[var(--color-lime)] font-semibold text-xs">
                                                <td className="px-2 py-2 text-[var(--color-dark-green)] font-bold">Total</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(filteredTotals.orders).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.revenue).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.revenue_ex_tax).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.ppc_cost).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.ps_cost).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{(metricView === "ROAS/POAS" ? filteredTotals.roas : (filteredTotals.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{(metricView === "ROAS/POAS" ? filteredTotals.poas : (filteredTotals.spendshare_db * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.gp).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.aov).toLocaleString()}</td>
                                            </tr>
                                            <tr className="bg-[var(--color-natural)] font-semibold text-xs">
                                                <td className="px-2 py-2 text-[var(--color-green)] font-bold">Last Year</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.revenue_ex_tax).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.ppc_cost).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.ps_cost).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">{(metricView === "ROAS/POAS" ? filteredLastYearTotals.roas : (filteredLastYearTotals.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">{(metricView === "ROAS/POAS" ? filteredLastYearTotals.poas : (filteredLastYearTotals.spendshare_db * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</td>
                                                <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(filteredLastYearTotals.aov).toLocaleString()}</td>
                                            </tr>
                                            <tr className="bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)] font-semibold text-xs border-t border-[var(--color-lime)]/50">
                                                <td className="px-2 py-2 text-[var(--color-dark-green)] font-bold">Difference</td>
                                                <td className={`px-2 py-2 ${differences.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(differences.orders).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.revenue).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.revenue_ex_tax >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.revenue_ex_tax).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.ppc_cost >= 0 ? 'text-red-600' : 'text-green-600'}`}>kr. {Math.round(differences.ppc_cost).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.ps_cost >= 0 ? 'text-red-600' : 'text-green-600'}`}>kr. {Math.round(differences.ps_cost).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.roas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? differences.roas : (differences.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className={`px-2 py-2 ${differences.poas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? differences.poas : (differences.spendshare_db * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                                <td className={`px-2 py-2 ${differences.gp >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.gp).toLocaleString()}</td>
                                                <td className={`px-2 py-2 ${differences.aov >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.aov).toLocaleString()}</td>
                                            </tr>
                                            <tr className="bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)] font-semibold text-xs border-t border-[var(--color-lime)]/50">
                                                <td className="px-2 py-2 text-[var(--color-dark-green)] font-bold">Index</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.orders)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.revenue)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.revenue_ex_tax)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.ppc_cost)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.ps_cost)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.roas)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.poas)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.gp)}</td>
                                                <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(indexMetrics.aov)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card-Based Layout */}
                                <div className="md:hidden">
                                    <div className="border-b border-gray-100">
                                        <div className="px-6 py-4 bg-[var(--color-lime)]/10 border-l-4 border-[var(--color-lime)]">
                                            <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Total</div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Orders:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(filteredTotals.orders).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Revenue:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.revenue).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">{metricView === "roas" ? "ROAS:" : "Spendshare:"}</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{(metricView === "roas" ? filteredTotals.roas : (filteredTotals.spendshare * 100)).toFixed(2)}{metricView === "roas" ? "" : "%"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">GP:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">kr. {Math.round(filteredTotals.gp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-100">
                                        <div className="px-6 py-4 bg-[var(--color-natural)]">
                                            <div className="text-sm font-bold text-[var(--color-green)] mb-2">Last Year</div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Orders:</span>
                                                    <span className="font-semibold">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Revenue:</span>
                                                    <span className="font-semibold">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                                    <span className="font-semibold">{(metricView === "ROAS/POAS" ? filteredLastYearTotals.roas : (filteredLastYearTotals.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">GP:</span>
                                                    <span className="font-semibold">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-100">
                                        <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)]">
                                            <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Difference</div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Orders:</span>
                                                    <span className={`font-semibold ${differences.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(differences.orders).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Revenue:</span>
                                                    <span className={`font-semibold ${differences.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.revenue).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                                    <span className={`font-semibold ${differences.roas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? differences.roas : (differences.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">GP:</span>
                                                    <span className={`font-semibold ${differences.gp >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(differences.gp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-100">
                                        <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)]">
                                            <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Index</div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Orders:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(indexMetrics.orders)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">Revenue:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(indexMetrics.revenue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(indexMetrics.roas)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-green)]">GP:</span>
                                                    <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(indexMetrics.gp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs uppercase text-[var(--color-green)] px-6 py-3 bg-[var(--color-natural)] border-b border-gray-100 font-medium">
                                        Daily Data
                                    </div>

                                    {filteredMetrics.map((row, i) => (
                                        <div key={i} className="border-b border-gray-50 last:border-b-0">
                                            <div
                                                className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-[var(--color-natural)]/50 transition-colors"
                                                onClick={() => toggleRowExpansion(i)}
                                            >
                                                <div>
                                                    <div className="font-semibold text-[var(--color-dark-green)]">{row.date}</div>
                                                    <div className="text-xs text-[var(--color-green)] mt-1">
                                                        Revenue: kr. {Math.round(row.revenue).toLocaleString()} | Orders: {Math.round(row.orders).toLocaleString()}
                                                    </div>
                                                </div>
                                                <FaChevronRight className={`text-[var(--color-green)] transition-transform ${expandedRows[i] ? 'transform rotate-90' : ''}`} />
                                            </div>

                                            {expandedRows[i] && (
                                                <div className="px-6 pb-4 bg-[var(--color-natural)]/30">
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">Orders:</span>
                                                            <span style={getHeatmapStyle(row.orders, 'orders')}>
                                                                {Math.round(row.orders).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">Revenue:</span>
                                                            <span style={getHeatmapStyle(row.revenue, 'revenue')}>
                                                                kr. {Math.round(row.revenue).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">Ex Tax:</span>
                                                            <span style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax')}>
                                                                kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">PPC Cost:</span>
                                                            <span style={getHeatmapStyle(row.ppc_cost, 'ppc_cost')}>
                                                                kr. {Math.round(row.ppc_cost).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">PS Cost:</span>
                                                            <span style={getHeatmapStyle(row.ps_cost, 'ps_cost')}>
                                                                kr. {Math.round(row.ps_cost).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                                            <span style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.roas : row.spendshare, metricView === "ROAS/POAS" ? 'roas' : 'spendshare')}>
                                                                {metricView === "ROAS/POAS" ? row.roas.toFixed(2) : `${(row.spendshare * 100).toFixed(2)}%`}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">{metricView === "roas" ? "POAS:" : "Spendshare DB:"}</span>
                                                            <span style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.poas : row.spendshare_db, metricView === "ROAS/POAS" ? 'poas' : 'spendshare_db')}>
                                                                {metricView === "ROAS/POAS" ? row.poas.toFixed(2) : `${(row.spendshare_db * 100).toFixed(2)}%`}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">GP:</span>
                                                            <span style={getHeatmapStyle(row.gp, 'gp')}>
                                                                kr. {Math.round(row.gp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-100 py-1">
                                                            <span className="text-[var(--color-green)]">AOV:</span>
                                                            <span style={getHeatmapStyle(row.aov, 'aov')}>
                                                                kr. {Math.round(row.aov).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Last Year Period Table */}
                    <div className="mb-6 md:mb-12 bg-white border border-gray-200 rounded-xl shadow-solid-s">
                        <div className="flex items-center p-6 border-b border-gray-100 bg-[var(--color-natural)] rounded-t-xl justify-between">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[var(--color-green)] text-sm" />
                                <h3 className="text-base md:text-lg font-semibold text-[var(--color-dark-green)]">Last Year Period</h3>
                                <span className="text-sm text-[var(--color-green)] bg-white px-3 py-1 rounded-full">
                                    {lastYearStart} to {lastYearEnd}
                                </span>
                            </div>
                        </div>

                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full text-xs text-left">
                                <thead className="bg-[var(--color-natural)] border-b border-gray-100">
                                    <tr className="text-[var(--color-dark-green)] uppercase text-xs font-medium">
                                        <th className="px-2 py-2 font-medium">Date</th>
                                        <th className="px-2 py-2 font-medium">Orders</th>
                                        <th className="px-2 py-2 font-medium">{tableHeader}</th>
                                        <th className="px-2 py-2 font-medium">Revenue Ex Tax</th>
                                        <th className="px-2 py-2 font-medium">PPC Cost</th>
                                        <th className="px-2 py-2 font-medium">PS Cost</th>
                                        <th className="px-2 py-2 font-medium">{metricView === "ROAS/POAS" ? "ROAS" : "Spendshare"}</th>
                                        <th className="px-2 py-2 font-medium">{metricView === "ROAS/POAS" ? "POAS" : "Spendshare inc. DB"}</th>
                                        <th className="px-2 py-2 font-medium">GP</th>
                                        <th className="px-2 py-2 font-medium">AOV</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[var(--color-dark-green)] text-xs">
                                    <tr className="bg-[var(--color-natural)] font-semibold text-xs border-b-2 border-[var(--color-green)]">
                                        <td className="px-2 py-2">Total</td>
                                        <td className="px-2 py-2">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.revenue_ex_tax).toLocaleString()}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.ppc_cost).toLocaleString()}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.ps_cost).toLocaleString()}</td>
                                        <td className="px-2 py-2">{(metricView === "ROAS/POAS" ? filteredLastYearTotals.roas : (filteredLastYearTotals.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className="px-2 py-2">{(metricView === "ROAS/POAS" ? filteredLastYearTotals.poas : (filteredLastYearTotals.spendshare_db * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</td>
                                        <td className="px-2 py-2">kr. {Math.round(filteredLastYearTotals.aov).toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-[var(--color-natural)] font-semibold text-xs">
                                        <td className="px-2 py-2 text-[var(--color-green)] font-bold">2 Years Ago</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">{Math.round(two_years_ago_totals.orders || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.revenue || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.revenue_ex_tax || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.ppc_cost || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.ps_cost || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">{(metricView === "ROAS/POAS" ? (two_years_ago_totals.roas || 0) : ((two_years_ago_totals.spendshare || 0) * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">{(metricView === "ROAS/POAS" ? (two_years_ago_totals.poas || 0) : ((two_years_ago_totals.spendshare_db || 0) * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.gp || 0).toLocaleString()}</td>
                                        <td className="px-2 py-2 text-[var(--color-green)]">kr. {Math.round(two_years_ago_totals.aov || 0).toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)] font-semibold text-xs border-t border-[var(--color-lime)]/50">
                                        <td className="px-2 py-2 text-[var(--color-dark-green)] font-bold">Difference</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(lastYearDifferences.orders).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.revenue).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.revenue_ex_tax >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.revenue_ex_tax).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.ppc_cost >= 0 ? 'text-red-600' : 'text-green-600'}`}>kr. {Math.round(lastYearDifferences.ppc_cost).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.ps_cost >= 0 ? 'text-red-600' : 'text-green-600'}`}>kr. {Math.round(lastYearDifferences.ps_cost).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.roas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? lastYearDifferences.roas : (lastYearDifferences.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.poas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? lastYearDifferences.poas : (lastYearDifferences.spendshare_db * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.gp >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.gp).toLocaleString()}</td>
                                        <td className={`px-2 py-2 ${lastYearDifferences.aov >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.aov).toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)] font-semibold text-xs border-t border-[var(--color-lime)]/50">
                                        <td className="px-2 py-2 text-[var(--color-dark-green)] font-bold">Index</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.orders)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.revenue)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.revenue_ex_tax)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.ppc_cost)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.ps_cost)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.roas)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.poas)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.gp)}</td>
                                        <td className="px-2 py-2 text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.aov)}</td>
                                    </tr>
                                    {lastYearMetrics.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-[var(--color-natural)]/30 transition-colors">
                                            <td className="px-2 py-1">{row.date}</td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.orders, 'orders', true)}>
                                                {Math.round(row.orders).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.revenue, 'revenue', true)}>
                                                kr. {Math.round(row.revenue).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax', true)}>
                                                kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.ppc_cost, 'ppc_cost', true)}>
                                                kr. {Math.round(row.ppc_cost).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.ps_cost, 'ps_cost', true)}>
                                                kr. {Math.round(row.ps_cost).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.roas : row.spendshare, metricView === "ROAS/POAS" ? 'roas' : 'spendshare', true)}>
                                                {metricView === "ROAS/POAS" ? row.roas.toFixed(2) : `${(row.spendshare * 100).toFixed(2)}%`}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.poas : row.spendshare_db, metricView === "ROAS/POAS" ? 'poas' : 'spendshare_db', true)}>
                                                {metricView === "ROAS/POAS" ? row.poas.toFixed(2) : `${(row.spendshare_db * 100).toFixed(2)}%`}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.gp, 'gp', true)}>
                                                kr. {Math.round(row.gp).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-1" style={getHeatmapStyle(row.aov, 'aov', true)}>
                                                kr. {Math.round(row.aov).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card-Based Layout for Last Year */}
                        <div className="md:hidden">
                            <div className="border-b border-gray-100">
                                <div className="px-6 py-4 bg-[var(--color-lime)]/10 border-l-4 border-[var(--color-lime)]">
                                    <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Total</div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Orders:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Revenue:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">{metricView === "roas" ? "ROAS:" : "Spendshare:"}</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{(metricView === "roas" ? filteredLastYearTotals.roas : (filteredLastYearTotals.spendshare * 100)).toFixed(2)}{metricView === "roas" ? "" : "%"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">GP:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-100">
                                <div className="px-6 py-4 bg-[var(--color-natural)]">
                                    <div className="text-sm font-bold text-[var(--color-green)] mb-2">2 Years Ago</div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Orders:</span>
                                            <span className="font-semibold">{Math.round(two_years_ago_totals.orders || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Revenue:</span>
                                            <span className="font-semibold">kr. {Math.round(two_years_ago_totals.revenue || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                            <span className="font-semibold">{(metricView === "ROAS/POAS" ? (two_years_ago_totals.roas || 0) : ((two_years_ago_totals.spendshare || 0) * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">GP:</span>
                                            <span className="font-semibold">kr. {Math.round(two_years_ago_totals.gp || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-100">
                                <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)]">
                                    <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Difference</div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Orders:</span>
                                            <span className={`font-semibold ${lastYearDifferences.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(lastYearDifferences.orders).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Revenue:</span>
                                            <span className={`font-semibold ${lastYearDifferences.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.revenue).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                            <span className={`font-semibold ${lastYearDifferences.roas >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metricView === "ROAS/POAS" ? lastYearDifferences.roas : (lastYearDifferences.spendshare * 100)).toFixed(2)}{metricView === "ROAS/POAS" ? "" : "%"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">GP:</span>
                                            <span className={`font-semibold ${lastYearDifferences.gp >= 0 ? 'text-green-600' : 'text-red-600'}`}>kr. {Math.round(lastYearDifferences.gp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-100">
                                <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-lime)]/20 to-[var(--color-natural)]">
                                    <div className="text-sm font-bold text-[var(--color-dark-green)] mb-2">Index</div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Orders:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.orders)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">Revenue:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.revenue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.roas)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-green)]">GP:</span>
                                            <span className="font-semibold text-[var(--color-dark-green)]">{Math.round(lastYearIndexMetrics.gp)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs uppercase text-[var(--color-green)] px-6 py-3 bg-[var(--color-natural)] border-b border-gray-100 font-medium">
                                Daily Data
                            </div>

                            {lastYearMetrics.map((row, i) => (
                                <div key={i} className="border-b border-gray-50 last:border-b-0">
                                    <div
                                        className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-[var(--color-natural)]/50 transition-colors"
                                        onClick={() => toggleLastYearRowExpansion(i)}
                                    >
                                        <div>
                                            <div className="font-semibold text-[var(--color-dark-green)]">{row.date}</div>
                                            <div className="text-xs text-[var(--color-green)] mt-1">
                                                Revenue: kr. {Math.round(row.revenue).toLocaleString()} | Orders: {Math.round(row.orders).toLocaleString()}
                                            </div>
                                        </div>
                                        <FaChevronRight className={`text-[var(--color-green)] transition-transform ${expandedLastYearRows[i] ? 'transform rotate-90' : ''}`} />
                                    </div>

                                    {expandedLastYearRows[i] && (
                                        <div className="px-6 pb-4 bg-[var(--color-natural)]/30">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">Orders:</span>
                                                    <span style={getHeatmapStyle(row.orders, 'orders', true)}>
                                                        {Math.round(row.orders).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">Revenue:</span>
                                                    <span style={getHeatmapStyle(row.revenue, 'revenue', true)}>
                                                        kr. {Math.round(row.revenue).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">Ex Tax:</span>
                                                    <span style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax', true)}>
                                                        kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">PPC Cost:</span>
                                                    <span style={getHeatmapStyle(row.ppc_cost, 'ppc_cost', true)}>
                                                        kr. {Math.round(row.ppc_cost).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">PS Cost:</span>
                                                    <span style={getHeatmapStyle(row.ps_cost, 'ps_cost', true)}>
                                                        kr. {Math.round(row.ps_cost).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">{metricView === "ROAS/POAS" ? "ROAS:" : "Spendshare:"}</span>
                                                    <span style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.roas : row.spendshare, metricView === "ROAS/POAS" ? 'roas' : 'spendshare', true)}>
                                                        {metricView === "ROAS/POAS" ? row.roas.toFixed(2) : `${(row.spendshare * 100).toFixed(2)}%`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">{metricView === "roas" ? "POAS:" : "Spendshare DB:"}</span>
                                                    <span style={getHeatmapStyle(metricView === "ROAS/POAS" ? row.poas : row.spendshare_db, metricView === "ROAS/POAS" ? 'poas' : 'spendshare_db', true)}>
                                                        {metricView === "ROAS/POAS" ? row.poas.toFixed(2) : `${(row.spendshare_db * 100).toFixed(2)}%`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">GP:</span>
                                                    <span style={getHeatmapStyle(row.gp, 'gp', true)}>
                                                        kr. {Math.round(row.gp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-1">
                                                    <span className="text-[var(--color-green)]">AOV:</span>
                                                    <span style={getHeatmapStyle(row.aov, 'aov', true)}>
                                                        kr. {Math.round(row.aov).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ClickUpUsersProvider>
    );
}