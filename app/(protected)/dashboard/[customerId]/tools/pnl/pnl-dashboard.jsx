"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip"; // Make sure this package is installed
import { FaInfoCircle } from "react-icons/fa";

export default function PnLDashboard({ customerId, customerName, initialData }) {
    const [isClient, setIsClient] = useState(false);
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Initialize date picker to first day of current month to yesterday
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
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));

    const { metrics_by_date, staticExpenses } = initialData || {};

    // Filter data based on date range
    const filteredMetricsByDate = useMemo(() => {
        const filtered = metrics_by_date?.filter((row) => row.date >= startDate && row.date <= endDate) || [];
        return filtered;
    }, [metrics_by_date, startDate, endDate]);

    // Calculate P&L metrics for current period
    const metrics = useMemo(() => {
        const aggregated = filteredMetricsByDate.reduce(
            (acc, row) => ({
                net_sales: acc.net_sales + (Number(row.net_sales) || 0),
                orders: acc.orders + (Number(row.orders) || 0),
                total_marketing_spend: acc.total_marketing_spend + (Number(row.total_marketing_spend) || 0),
                marketing_spend_facebook: acc.marketing_spend_facebook + (Number(row.marketing_spend_facebook) || 0),
                marketing_spend_google: acc.marketing_spend_google + (Number(row.marketing_spend_google) || 0),
            }),
            {
                net_sales: 0,
                orders: 0,
                total_marketing_spend: 0,
                marketing_spend_facebook: 0,
                marketing_spend_google: 0,
            }
        );

        // Correct COGS calculation
        const cogs = aggregated.net_sales * (staticExpenses.cogs_percentage || 0);
        const db1 = aggregated.net_sales - cogs;

        const shipping_cost = aggregated.orders * (staticExpenses.shipping_cost_per_order || 0);
        const transaction_cost = aggregated.net_sales * (staticExpenses.transaction_cost_percentage || 0);
        const direct_selling_costs = shipping_cost + transaction_cost;
        const db2 = db1 - direct_selling_costs;

        const marketing_costs = aggregated.total_marketing_spend + (staticExpenses.marketing_bureau_cost || 0) + (staticExpenses.marketing_tooling_cost || 0);
        const db3 = db2 - marketing_costs;
        const result = db3 - (staticExpenses.fixed_expenses || 0);

        const realized_roas = aggregated.total_marketing_spend > 0 ? aggregated.net_sales / aggregated.total_marketing_spend : 0;

        // Calculate total costs for percentage calculations
        const total_costs = cogs + shipping_cost + transaction_cost +
            aggregated.total_marketing_spend +
            (staticExpenses.marketing_bureau_cost || 0) +
            (staticExpenses.marketing_tooling_cost || 0) +
            (staticExpenses.fixed_expenses || 0);

        // Correct percentage calculations for DB shares
        const db1_percentage = total_costs > 0 ? ((total_costs - cogs) / total_costs) * 100 : 0;
        const db2_percentage = total_costs > 0 ? ((total_costs - cogs - shipping_cost - transaction_cost) / total_costs) * 100 : 0;
        const db3_percentage = total_costs > 0 ? ((total_costs - cogs - shipping_cost - transaction_cost -
            aggregated.total_marketing_spend -
            (staticExpenses.marketing_bureau_cost || 0) -
            (staticExpenses.marketing_tooling_cost || 0)) / total_costs) * 100 : 0;

        const break_even_roas = aggregated.total_marketing_spend > 0 ? total_costs / aggregated.total_marketing_spend : 0;

        const resultMetrics = {
            net_sales: aggregated.net_sales,
            orders: aggregated.orders,
            cogs,
            db1,
            shipping_cost,
            transaction_cost,
            db2,
            marketing_spend: aggregated.total_marketing_spend,
            marketing_bureau_cost: staticExpenses.marketing_bureau_cost || 0,
            marketing_tooling_cost: staticExpenses.marketing_tooling_cost || 0,
            db3,
            fixed_expenses: staticExpenses.fixed_expenses || 0,
            result,
            realized_roas,
            break_even_roas,
            db_percentages: {
                db1: isFinite(db1_percentage) ? db1_percentage : 0,
                db2: isFinite(db2_percentage) ? db2_percentage : 0,
                db3: isFinite(db3_percentage) ? db3_percentage : 0,
            },
            total_costs,
        };
        return resultMetrics;
    }, [filteredMetricsByDate, staticExpenses]);

    // Calculate comparison dates
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

    // Calculate metrics for comparison period
    const comparisonMetrics = useMemo(() => {
        const comparisonData = metrics_by_date?.filter((row) => row.date >= compStart && row.date <= compEnd) || [];
        const aggregated = comparisonData.reduce(
            (acc, row) => ({
                net_sales: acc.net_sales + (Number(row.net_sales) || 0),
                orders: acc.orders + (Number(row.orders) || 0),
                total_marketing_spend: acc.total_marketing_spend + (Number(row.total_marketing_spend) || 0),
                marketing_spend_facebook: acc.marketing_spend_facebook + (Number(row.marketing_spend_facebook) || 0),
                marketing_spend_google: acc.marketing_spend_google + (Number(row.marketing_spend_google) || 0),
            }),
            {
                net_sales: 0,
                orders: 0,
                total_marketing_spend: 0,
                marketing_spend_facebook: 0,
                marketing_spend_google: 0,
            }
        );

        // Correct COGS calculation
        const cogs = aggregated.net_sales * (staticExpenses.cogs_percentage || 0);
        const db1 = aggregated.net_sales - cogs;

        const shipping_cost = aggregated.orders * (staticExpenses.shipping_cost_per_order || 0);
        const transaction_cost = aggregated.net_sales * (staticExpenses.transaction_cost_percentage || 0);
        const direct_selling_costs = shipping_cost + transaction_cost;
        const db2 = db1 - direct_selling_costs;

        const marketing_costs = aggregated.total_marketing_spend + (staticExpenses.marketing_bureau_cost || 0) + (staticExpenses.marketing_tooling_cost || 0);
        const db3 = db2 - marketing_costs;
        const result = db3 - (staticExpenses.fixed_expenses || 0);

        const realized_roas = aggregated.total_marketing_spend > 0 ? aggregated.net_sales / aggregated.total_marketing_spend : 0;

        // Calculate total costs for percentage calculations
        const total_costs = cogs + shipping_cost + transaction_cost +
            aggregated.total_marketing_spend +
            (staticExpenses.marketing_bureau_cost || 0) +
            (staticExpenses.marketing_tooling_cost || 0) +
            (staticExpenses.fixed_expenses || 0);

        // Correct percentage calculations for DB shares
        const db1_percentage = total_costs > 0 ? ((total_costs - cogs) / total_costs) * 100 : 0;
        const db2_percentage = total_costs > 0 ? ((total_costs - cogs - shipping_cost - transaction_cost) / total_costs) * 100 : 0;
        const db3_percentage = total_costs > 0 ? ((total_costs - cogs - shipping_cost - transaction_cost -
            aggregated.total_marketing_spend -
            (staticExpenses.marketing_bureau_cost || 0) -
            (staticExpenses.marketing_tooling_cost || 0)) / total_costs) * 100 : 0;

        const break_even_roas = aggregated.total_marketing_spend > 0 ? total_costs / aggregated.total_marketing_spend : 0;

        const resultMetrics = {
            net_sales: aggregated.net_sales,
            orders: aggregated.orders,
            cogs,
            db1,
            shipping_cost,
            transaction_cost,
            db2,
            marketing_spend: aggregated.total_marketing_spend,
            marketing_bureau_cost: staticExpenses.marketing_bureau_cost || 0,
            marketing_tooling_cost: staticExpenses.marketing_tooling_cost || 0,
            db3,
            fixed_expenses: staticExpenses.fixed_expenses || 0,
            result,
            realized_roas,
            break_even_roas,
            db_percentages: {
                db1: isFinite(db1_percentage) ? db1_percentage : 0,
                db2: isFinite(db2_percentage) ? db2_percentage : 0,
                db3: isFinite(db3_percentage) ? db3_percentage : 0,
            },
            total_costs,
        };
        return resultMetrics;
    }, [metrics_by_date, compStart, compEnd, staticExpenses]);

    const calculateDelta = (current, prev = 0) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(2);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const metricsDisplay = [
        {
            label: "Net Sales",
            value: metrics.net_sales ? Math.round(metrics.net_sales).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.net_sales, comparisonMetrics.net_sales),
            positive: metrics.net_sales >= comparisonMetrics.net_sales,
        },
        {
            label: "Orders",
            value: metrics.orders ? Math.round(metrics.orders).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.orders, comparisonMetrics.orders),
            positive: metrics.orders >= comparisonMetrics.orders,
        },
        {
            label: "COGS",
            value: metrics.cogs ? Math.round(metrics.cogs).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.cogs, comparisonMetrics.cogs),
            positive: metrics.cogs <= comparisonMetrics.cogs,
        },
        {
            label: "Shipping",
            value: metrics.shipping_cost ? Math.round(metrics.shipping_cost).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.shipping_cost, comparisonMetrics.shipping_cost),
            positive: metrics.shipping_cost <= comparisonMetrics.shipping_cost,
        },
        {
            label: "Transaction Costs",
            value: metrics.transaction_cost ? Math.round(metrics.transaction_cost).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.transaction_cost, comparisonMetrics.transaction_cost),
            positive: metrics.transaction_cost <= comparisonMetrics.transaction_cost,
        },
        {
            label: "Marketing Spend",
            value: metrics.marketing_spend ? Math.round(metrics.marketing_spend).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.marketing_spend, comparisonMetrics.marketing_spend),
            positive: metrics.marketing_spend <= comparisonMetrics.marketing_spend,
        },
        {
            label: "Marketing Bureau",
            value: metrics.marketing_bureau_cost ? Math.round(metrics.marketing_bureau_cost).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.marketing_bureau_cost, comparisonMetrics.marketing_bureau_cost),
            positive: metrics.marketing_bureau_cost <= comparisonMetrics.marketing_bureau_cost,
        },
        {
            label: "Marketing Tooling",
            value: metrics.marketing_tooling_cost ? Math.round(metrics.marketing_tooling_cost).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.marketing_tooling_cost, comparisonMetrics.marketing_tooling_cost),
            positive: metrics.marketing_tooling_cost <= comparisonMetrics.marketing_tooling_cost,
        },
        {
            label: "Fixed Expenses",
            value: metrics.fixed_expenses ? Math.round(metrics.fixed_expenses).toLocaleString('en-US') : "0",
            delta: calculateDelta(metrics.fixed_expenses, comparisonMetrics.fixed_expenses),
            positive: metrics.fixed_expenses <= comparisonMetrics.fixed_expenses,
        },
    ];

    if (!metrics_by_date || !staticExpenses) {
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
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">P&L</h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        Overview of profit and loss metrics including net turnover, direct costs, marketing expenses, and financial results.
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                            <span className="text-gray-400 hidden md:inline">→</span>
                            <span className="text-gray-400 md:hidden">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border px-2 py-2 rounded text-sm w-full md:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Metrics View */}
                <div className="md:hidden mb-6">
                    <div className="bg-white border border-zinc-200 rounded shadow-sm">
                        <div className="grid grid-cols-2 gap-px bg-gray-100">
                            {metricsDisplay.slice(0, showAllMetrics ? metricsDisplay.length : 4).map((item, i) => (
                                <div key={i} className="bg-white p-4">
                                    <p className="text-xs text-gray-500">{item.label}</p>
                                    <p className="text-xl font-bold text-zinc-800">
                                        {item.label === "Orders" ? (
                                            <span>{item.value}</span>
                                        ) : (
                                            <>kr. {item.value}</>
                                        )}
                                    </p>
                                    {item.delta && (
                                        <p className={`text-xs font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                            {item.delta}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {metricsDisplay.length > 4 && (
                            <button 
                                onClick={() => setShowAllMetrics(!showAllMetrics)}
                                className="w-full py-2 text-sm text-blue-600 border-t border-gray-100"
                            >
                                {showAllMetrics ? "Show Less" : `Show ${metricsDisplay.length - 4} More Metrics`}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Left: P&L Table */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Metric Cards (Desktop only) */}
                        <div className="hidden md:hidden md:grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                            {metricsDisplay.map((item, i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded p-4">
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className="text-2xl font-bold text-zinc-800">
                                        {item.label === "Orders" ? (
                                            <span>{item.value}</span>
                                        ) : (
                                            <>kr. {item.value}</>
                                        )}
                                    </p>
                                    {item.delta && (
                                        <p className={`text-sm font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                                            {item.delta}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Section: Nettoomsætning */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium flex items-center justify-between">
                                <span>Net turnover (turnover - discount & return)</span>
                                {isClient && (
                                    <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="net-sales-tooltip">
                                        <FaInfoCircle />
                                    </span>
                                )}
                            </div>
                            {isClient && (
                                <Tooltip id="net-sales-tooltip" place="top">
                                    Net sales represents total revenue minus discounts and returns
                                </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base">
                                <span>Netsales</span>
                                <span>kr. {Math.round(metrics.net_sales).toLocaleString('en-US')}</span>
                            </div>
                        </div>

                        {/* Section: DB1 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium flex items-center justify-between">
                                <span>DB1 (turnover - cost of goods sold)</span>
                                {isClient && (
                                    <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="db1-tooltip">
                                        <FaInfoCircle />
                                    </span>
                                )}
                            </div>
                            {isClient && (
                            <Tooltip id="db1-tooltip" place="top">
                                DB1 = Net Sales - COGS (Cost of Goods Sold)<br />
                                COGS is calculated as {(staticExpenses.cogs_percentage * 100).toFixed(1)}% of Net Sales
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="cogs-calc-tooltip">
                                <span>COGS</span>
                                <span>kr. {Math.round(metrics.cogs).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="cogs-calc-tooltip" place="top">
                                COGS = Net Sales × {(staticExpenses.cogs_percentage * 100).toFixed(1)}%<br />
                                = kr. {Math.round(metrics.net_sales).toLocaleString('en-US')} × {(staticExpenses.cogs_percentage * 100).toFixed(1)}%
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t font-medium text-sm md:text-base" data-tooltip-id="db1-total-tooltip">
                                <span>Total, DB1</span>
                                <span>kr. {Math.round(metrics.db1).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="db1-total-tooltip" place="top">
                                DB1 = Net Sales - COGS<br />
                                = kr. {Math.round(metrics.net_sales).toLocaleString('en-US')} - kr. {Math.round(metrics.cogs).toLocaleString('en-US')}
                            </Tooltip>
                            )}
                        </div>

                        {/* Section: DB2 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium flex items-center justify-between">
                                <span>DB2 (DB1 - direct selling costs)</span>
                                {isClient && (
                                    <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="db2-tooltip">
                                        <FaInfoCircle />
                                    </span>
                                )}
                            </div>
                            {isClient && (
                            <Tooltip id="db2-tooltip" place="top">
                                DB2 = DB1 - Shipping Costs - Transaction Costs<br />
                                Direct selling costs are the expenses directly related to selling each product
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="shipping-tooltip">
                                <span>Shipping</span>
                                <span>kr. {Math.round(metrics.shipping_cost).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="shipping-tooltip" place="top">
                                Shipping = Orders × Shipping Cost Per Order<br />
                                = {metrics.orders.toLocaleString('en-US')} × kr. {staticExpenses.shipping_cost_per_order.toLocaleString('en-US')}
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="transaction-tooltip">
                                <span>Transaction Costs</span>
                                <span>kr. {Math.round(metrics.transaction_cost).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="transaction-tooltip" place="top">
                                Transaction Costs = Net Sales × Transaction Cost Percentage<br />
                                = kr. {Math.round(metrics.net_sales).toLocaleString('en-US')} × {(staticExpenses.transaction_cost_percentage * 100).toFixed(1)}%
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t font-medium text-sm md:text-base" data-tooltip-id="db2-total-tooltip">
                                <span>Total, DB2</span>
                                <span>kr. {Math.round(metrics.db2).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="db2-total-tooltip" place="top">
                                DB2 = DB1 - Shipping - Transaction Costs<br />
                                = kr. {Math.round(metrics.db1).toLocaleString('en-US')} - kr. {Math.round(metrics.shipping_cost).toLocaleString('en-US')} - kr. {Math.round(metrics.transaction_cost).toLocaleString('en-US')}
                            </Tooltip>
                            )}
                        </div>

                        {/* Section: DB3 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium flex items-center justify-between">
                                <span>DB3 (DB2 - marketing costs)</span>
                                {isClient && (
                                    <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="db3-tooltip">
                                        <FaInfoCircle />
                                    </span>
                                )}
                            </div>
                            {isClient && (
                            <Tooltip id="db3-tooltip" place="top">
                                DB3 = DB2 - Marketing Spend - Marketing Bureau - Marketing Tooling<br />
                                This represents margin after marketing expenses
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="marketing-spend-tooltip">
                                <span>Marketing Spend</span>
                                <span>kr. {Math.round(metrics.marketing_spend).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="marketing-spend-tooltip" place="top">
                                Marketing Spend = Total ad spend from Facebook and Google campaigns
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="bureau-tooltip">
                                <span>Marketing Bureau</span>
                                <span>kr. {Math.round(metrics.marketing_bureau_cost).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="bureau-tooltip" place="top">
                                Marketing Bureau = Fixed cost for marketing agency services
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="tooling-tooltip">
                                <span>Marketing Tooling</span>
                                <span>kr. {Math.round(metrics.marketing_tooling_cost).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="tooling-tooltip" place="top">
                                Marketing Tooling = Cost for marketing tools and software
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t font-medium text-sm md:text-base" data-tooltip-id="db3-total-tooltip">
                                <span>Total, DB3</span>
                                <span>kr. {Math.round(metrics.db3).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="db3-total-tooltip" place="top">
                                DB3 = DB2 - Marketing Spend - Marketing Bureau - Marketing Tooling<br />
                                = kr. {Math.round(metrics.db2).toLocaleString('en-US')} - kr. {Math.round(metrics.marketing_spend).toLocaleString('en-US')} - kr. {Math.round(metrics.marketing_bureau_cost).toLocaleString('en-US')} - kr. {Math.round(metrics.marketing_tooling_cost).toLocaleString('en-US')}
                            </Tooltip>
                            )}
                        </div>

                        {/* Section: Resultat */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium flex items-center justify-between">
                                <span>Result</span>
                                {isClient && (
                                    <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="result-tooltip">
                                        <FaInfoCircle />
                                    </span>
                                )}
                            </div>
                            {isClient && (
                            <Tooltip id="result-tooltip" place="top">
                                Final result = DB3 - Fixed Expenses<br />
                                This represents the profit after all expenses
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t text-sm md:text-base" data-tooltip-id="fixed-expenses-tooltip">
                                <span>Fixed Expenses</span>
                                <span>kr. {Math.round(metrics.fixed_expenses).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="fixed-expenses-tooltip" place="top">
                                Fixed Expenses = Costs that remain constant regardless of sales volume
                            </Tooltip>
                            )}
                            <div className="flex justify-between px-4 py-2 border-t font-medium text-sm md:text-base" data-tooltip-id="final-result-tooltip">
                                <span>Result</span>
                                <span>kr. {Math.round(metrics.result).toLocaleString('en-US')}</span>
                            </div>
                            {isClient && (
                            <Tooltip id="final-result-tooltip" place="top">
                                Final Result = DB3 - Fixed Expenses<br />
                                = kr. {Math.round(metrics.db3).toLocaleString('en-US')} - kr. {Math.round(metrics.fixed_expenses).toLocaleString('en-US')}
                            </Tooltip>
                            )}
                        </div>

                        {/* Section: ROAS */}
                        <div className="grid grid-cols-2 border border-zinc-200 rounded divide-x divide-gray-300 text-center z-10 bg-white">
                            <div className="px-4 py-3 md:py-5" data-tooltip-id="realized-roas-tooltip">
                                <p className="font-medium text-zinc-500 text-xs md:text-base mb-1 md:mb-2">Realized ROAS</p>
                                <p className="text-zinc-800 text-2xl md:text-4xl font-bold">{metrics.realized_roas.toFixed(2)}</p>
                            </div>
                            {isClient && (
                            <Tooltip id="realized-roas-tooltip" place="top">
                                Realized ROAS = Net Sales ÷ Marketing Spend<br />
                                = kr. {Math.round(metrics.net_sales).toLocaleString('en-US')} ÷ kr. {Math.round(metrics.marketing_spend).toLocaleString('en-US')}<br />
                            </Tooltip>
                            )}
                            <div className="px-4 py-3 md:py-5" data-tooltip-id="breakeven-roas-tooltip">
                                <p className="font-medium text-zinc-400 text-xs md:text-base mb-1 md:mb-2">Break-even ROAS</p>
                                <p className="text-zinc-800 text-2xl md:text-4xl font-bold">{metrics.break_even_roas.toFixed(2)}</p>
                            </div>
                            {isClient && (
                            <Tooltip id="breakeven-roas-tooltip" place="top">
                                Break-even ROAS = Total Costs ÷ Marketing Spend<br />
                                = kr. {Math.round(metrics.total_costs).toLocaleString('en-US')} ÷ kr. {Math.round(metrics.marketing_spend).toLocaleString('en-US')}<br />

                            </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Right: DB Andel Circles */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="border border-zinc-200 rounded text-center py-2 bg-gray-100 font-medium flex justify-center items-center gap-1" data-tooltip-id="db-share-tooltip">
                            <span className="text-sm md:text-base">DB share of total expenses</span>
                            {isClient && (
                                <span className="text-gray-500 text-sm md:hidden" data-tooltip-id="db-share-tooltip">
                                    <FaInfoCircle />
                                </span>
                            )}
                        </div>
                        {isClient && (
                        <Tooltip id="db-share-tooltip" place="top">
                            These percentages show how much of your total expenses remain<br />
                            at each stage of the profit calculation (higher is better)
                        </Tooltip>
                        )}

                        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-6">
                            {[
                                { label: "DB1", percentage: metrics.db_percentages.db1, description: "Nettoomsætning - COGS" },
                                { label: "DB2", percentage: metrics.db_percentages.db2, description: "DB1 - Fragt - Transaction Fees" },
                                { label: "DB3", percentage: metrics.db_percentages.db3, description: "DB2 - Marketing Costs" }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded-lg p-2 md:p-6 text-center" data-tooltip-id={`db-circle-${i}-tooltip`}>
                                    <div className="flex justify-between text-xs md:text-sm text-gray-500 mb-1 md:mb-2 px-1 md:px-4">
                                        <span>{item.label}</span>
                                        <span className="text-[10px] md:text-xs hidden md:block">{item.description}</span>
                                    </div>
                                    <div className="relative w-full h-16 md:h-32 flex items-center justify-center">
                                        <svg className="w-14 h-14 md:w-28 md:h-28 transform -rotate-90">
                                            <circle
                                                cx={28}
                                                cy={28}
                                                r={25}
                                                stroke="#E5E7EB"
                                                strokeWidth="5"
                                                fill="transparent"
                                                className="md:hidden"
                                            />
                                            <circle
                                                cx={28}
                                                cy={28}
                                                r={25}
                                                stroke="#1E2B2B"
                                                strokeWidth="5"
                                                strokeDasharray={25 * 2 * Math.PI}
                                                strokeDashoffset={25 * 2 * Math.PI * (1 - (item.percentage / 100))}
                                                fill="transparent"
                                                className="md:hidden"
                                            />
                                            <circle
                                                cx={56}
                                                cy={56}
                                                r={50}
                                                stroke="#E5E7EB"
                                                strokeWidth="10"
                                                fill="transparent"
                                                className="hidden md:block"
                                            />
                                            <circle
                                                cx={56}
                                                cy={56}
                                                r={50}
                                                stroke="#1E2B2B"
                                                strokeWidth="10"
                                                strokeDasharray="314"
                                                strokeDashoffset={314 * (1 - (item.percentage / 100))}
                                                fill="transparent"
                                                className="hidden md:block"
                                            />
                                        </svg>
                                        <div className="absolute text-base md:text-xl font-semibold text-gray-800">{Math.round(item.percentage)}%</div>
                                    </div>
                                    {isClient && (
                                    <Tooltip id={`db-circle-${i}-tooltip`} place="top">
                                        {i === 0 && `DB1: After deducting COGS, ${Math.round(item.percentage)}% of total costs remain`}
                                        {i === 1 && `DB2: After deducting COGS, shipping and transaction costs, ${Math.round(item.percentage)}% of total costs remain`}
                                        {i === 2 && `DB3: After deducting all costs except fixed expenses, ${Math.round(item.percentage)}% of total costs remain`}
                                    </Tooltip>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}