"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

export default function OverviewDashboard({ customerId, customerName, initialData }) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => date.toISOString().split("T")[0];

    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(yesterday));

    const { overview_metrics, totals, last_year_totals } = initialData || {};

    if (!overview_metrics || overview_metrics.length === 0) {
        return <div>No data available for {customerId}</div>;
    }

    const filteredMetrics = useMemo(() => {
        return overview_metrics.filter(
            (row) => row.date >= startDate && row.date <= endDate
        ).sort((a, b) => a.date.localeCompare(b.date));
    }, [overview_metrics, startDate, endDate]);

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
                        ? (acc.revenue * (1 - 0.25) - acc.revenue * 0.7) /
                          (acc.ppc_cost + acc.ps_cost)
                        : 0,
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
                gp: 0,
                aov: 0,
            }
        );
    }, [filteredMetrics]);

    const lastYearStart = formatDate(new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() - 1)));
    const lastYearEnd = formatDate(new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - 1)));
    
    const lastYearMetrics = useMemo(() => {
        return overview_metrics.filter(
            (row) => row.date >= lastYearStart && row.date <= lastYearEnd
        ).sort((a, b) => a.date.localeCompare(b.date));
    }, [overview_metrics, lastYearStart, lastYearEnd]);
    
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
                        ? (acc.revenue * (1 - 0.25) - acc.revenue * 0.7) /
                          (acc.ppc_cost + acc.ps_cost)
                        : 0,
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
        gp: filteredTotals.gp - filteredLastYearTotals.gp,
        aov: filteredTotals.aov - filteredLastYearTotals.aov,
    }), [filteredTotals, filteredLastYearTotals]);

    const metricRanges = useMemo(() => {
        const ranges = {
            orders: { min: Infinity, max: -Infinity },
            revenue: { min: Infinity, max: -Infinity },
            revenue_ex_tax: { min: Infinity, max: -Infinity },
            ppc_cost: { min: Infinity, max: -Infinity },
            ps_cost: { min: Infinity, max: -Infinity },
            roas: { min: Infinity, max: -Infinity },
            poas: { min: Infinity, max: -Infinity },
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

    return (
        <div className="py-20 px-0 relative overflow">
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

            <div className="px-20 mx-auto z-10 relative">
                <div className="mb-8">
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Overview</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Daily overview of key performance metrics including orders, revenue, ad spend, and profitability.
                    </p>
                </div>

                <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <div className="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 justify-between">
                        <h3 className="text-lg font-semibold">Current Period</h3>
                        <div className="flex gap-4 items-center">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 px-3 py-2 rounded text-sm"
                                placeholder="Start date"
                            />
                            <span className="text-gray-400">→</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 px-3 py-2 rounded text-sm"
                                placeholder="End date"
                            />
                        </div>
                    </div>

                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-xs">
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Orders</th>
                                <th className="px-4 py-3 font-medium">Revenue</th>
                                <th className="px-4 py-3 font-medium">Revenue Ex Tax</th>
                                <th className="px-4 py-3 font-medium">PPC Cost</th>
                                <th className="px-4 py-3 font-medium">PS Cost</th>
                                <th className="px-4 py-3 font-medium">ROAS</th>
                                <th className="px-4 py-3 font-medium">POAS</th>
                                <th className="px-4 py-3 font-medium">GP</th>
                                <th className="px-4 py-3 font-medium">AOV</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {filteredMetrics.map((row, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="px-4 py-3">{row.date}</td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.orders, 'orders')}>
                                        {Math.round(row.orders).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.revenue, 'revenue')}>
                                        kr. {Math.round(row.revenue).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax')}>
                                        kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.ppc_cost, 'ppc_cost')}>
                                        kr. {Math.round(row.ppc_cost).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.ps_cost, 'ps_cost')}>
                                        kr. {Math.round(row.ps_cost).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.roas, 'roas')}>
                                        {row.roas.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.poas, 'poas')}>
                                        {row.poas.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.gp, 'gp')}>
                                        kr. {Math.round(row.gp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.aov, 'aov')}>
                                        kr. {Math.round(row.aov).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Total</td>
                                <td className="px-4 py-3">{Math.round(filteredTotals.orders).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.revenue_ex_tax).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.ppc_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.ps_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">{filteredTotals.roas.toFixed(2)}</td>
                                <td className="px-4 py-3">{filteredTotals.poas.toFixed(2)}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.gp).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredTotals.aov).toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Last Year</td>
                                <td className="px-4 py-3">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.revenue_ex_tax).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.ppc_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.ps_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">{filteredLastYearTotals.roas.toFixed(2)}</td>
                                <td className="px-4 py-3">{filteredLastYearTotals.poas.toFixed(2)}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.aov).toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Difference</td>
                                <td className="px-4 py-3">{Math.round(differences.orders).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.revenue_ex_tax).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.ppc_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.ps_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">{differences.roas.toFixed(2)}</td>
                                <td className="px-4 py-3">{differences.poas.toFixed(2)}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.gp).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(differences.aov).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <div className="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 justify-between">
                        <h3 className="text-lg font-semibold">Last Year Period ({lastYearStart} to {lastYearEnd})</h3>
                    </div>

                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-xs">
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Orders</th>
                                <th className="px-4 py-3 font-medium">Revenue</th>
                                <th className="px-4 py-3 font-medium">Revenue Ex Tax</th>
                                <th className="px-4 py-3 font-medium">PPC Cost</th>
                                <th className="px-4 py-3 font-medium">PS Cost</th>
                                <th className="px-4 py-3 font-medium">ROAS</th>
                                <th className="px-4 py-3 font-medium">POAS</th>
                                <th className="px-4 py-3 font-medium">GP</th>
                                <th className="px-4 py-3 font-medium">AOV</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Total</td>
                                <td className="px-4 py-3">{Math.round(filteredLastYearTotals.orders).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.revenue_ex_tax).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.ppc_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.ps_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">{filteredLastYearTotals.roas.toFixed(2)}</td>
                                <td className="px-4 py-3">{filteredLastYearTotals.poas.toFixed(2)}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.gp).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(filteredLastYearTotals.aov).toLocaleString()}</td>
                            </tr>
                            {lastYearMetrics.map((row, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="px-4 py-3">{row.date}</td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.orders, 'orders', true)}>
                                        {Math.round(row.orders).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.revenue, 'revenue', true)}>
                                        kr. {Math.round(row.revenue).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.revenue_ex_tax, 'revenue_ex_tax', true)}>
                                        kr. {Math.round(row.revenue_ex_tax).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.ppc_cost, 'ppc_cost', true)}>
                                        kr. {Math.round(row.ppc_cost).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.ps_cost, 'ps_cost', true)}>
                                        kr. {Math.round(row.ps_cost).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.roas, 'roas', true)}>
                                        {row.roas.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.poas, 'poas', true)}>
                                        {row.poas.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.gp, 'gp', true)}>
                                        kr. {Math.round(row.gp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" style={getHeatmapStyle(row.aov, 'aov', true)}>
                                        kr. {Math.round(row.aov).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}