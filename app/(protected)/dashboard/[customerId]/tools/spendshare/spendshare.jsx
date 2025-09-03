"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";

export default function Spendshare({ customerId, customerName, initialData }) {
    const [forecastData, setForecastData] = useState({
        spendshare: Array(12).fill(0.2),
        spendMeta: Array(12).fill(0),
        spendGoogleAds: Array(12).fill(0),
        netSales: Array(12).fill(0),
    });
    const [share1, setShare1] = useState(0);
    const [share2, setShare2] = useState(0);
    const [share3, setShare3] = useState(0);
    const { showToast } = useToast();

    const difference = share2 - share3;

    const [monthlyData, setMonthlyData] = useState(initialData.monthly_metrics || []);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const totals = useMemo(() => {
        return monthlyData.reduce((acc, row) => ({
            revenue: acc.revenue + row.revenue,
            net_profit: acc.net_profit + row.net_profit,
            spend: acc.spend + row.spend,
            meta_spend: acc.meta_spend + row.meta_spend,
            google_ads_spend: acc.google_ads_spend + row.google_ads_spend,
        }), { revenue: 0, net_profit: 0, spend: 0, meta_spend: 0, google_ads_spend: 0 });
    }, [monthlyData]);

    const forecastTotals = useMemo(() => {
        return forecastData.spendshare.reduce((acc, _, i) => ({
            spendshare: acc.spendshare + (forecastData.spendshare[i] || 0),
            spendMeta: acc.spendMeta + (forecastData.spendMeta[i] || 0),
            spendGoogleAds: acc.spendGoogleAds + (forecastData.spendGoogleAds[i] || 0),
            netSales: acc.netSales + (forecastData.netSales[i] || 0),
        }), { spendshare: 0, spendMeta: 0, spendGoogleAds: 0, netSales: 0 });
    }, [forecastData]);

    const handleForecastChange = (field, index, value) => {
        setForecastData(prev => ({
            ...prev,
            [field]: prev[field].map((v, i) => (i === index ? Number(value) : v)),
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/spendshare/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    forecastData,
                    share1,
                    share2,
                    share3,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save spendshare data');
            }

            showToast("Changes saved successfully!", "success");
        } catch (error) {
            console.error("Error saving spendshare data:", error);
            showToast("Failed to save changes: " + error.message, "error");
        }
    };

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const res = await fetch(`/api/spendshare/${customerId}`);
                const data = await res.json();
                if (data.forecastData) {
                    setForecastData(data.forecastData);
                    setShare1(data.share1 || 0);
                    setShare2(data.share2 || 0);
                    setShare3(data.share3 || 0);
                }
            } catch (error) {
                console.error("Error fetching spendshare data:", error);
            }
        };
        fetchForecastData();
    }, [customerId]);

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
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">Spendshare</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of spendshare, forecast, and realized metrics for the current year.
                    </p>
                </div>

                {/* Table 1: Forecast Inputs */}
                <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-[10px]">
                                <th className="px-4 py-3 font-medium">Metric</th>
                                {months.map((month, i) => (
                                    <th key={i} className="px-4 py-3 font-medium text-[10px]">{month}</th>
                                ))}
                                <th className="px-4 py-3 font-medium text-[10px]">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">Forecast 20% Spendshare</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={forecastData.spendshare[i]}
                                            onChange={(e) => handleForecastChange('spendshare', i, e.target.value)}
                                            className="border px-2 py-1 rounded w-full text-[10px]"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendshare / 12).toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">Forecast Spend: Meta</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={forecastData.spendMeta[i]}
                                            onChange={(e) => handleForecastChange('spendMeta', i, e.target.value)}
                                            className="border px-2 py-1 rounded w-full text-[10px]"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.spendMeta).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">Forecast Spend: Google Ads</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={forecastData.spendGoogleAds[i]}
                                            onChange={(e) => handleForecastChange('spendGoogleAds', i, e.target.value)}
                                            className="border px-2 py-1 rounded w-full text-[10px]"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.spendGoogleAds).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">Forecast Net Sales ex VAT</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={forecastData.netSales[i]}
                                            onChange={(e) => handleForecastChange('netSales', i, e.target.value)}
                                            className="border px-2 py-1 rounded w-full text-[10px]"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.netSales).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Table 2: Share Inputs */}
                <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-xs">
                                <th className="px-4 py-3 font-medium">Share 1 (%)</th>
                                <th className="px-4 py-3 font-medium">Share 2 (%)</th>
                                <th className="px-4 py-3 font-medium">Share 3 (%)</th>
                                <th className="px-4 py-3 font-medium">Difference</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr>
                                <td className="px-4 py-3">
                                    <input type="number" value={share1} onChange={(e) => setShare1(e.target.value)} className="border px-2 py-1 rounded w-full" />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" value={share2} onChange={(e) => setShare2(e.target.value)} className="border px-2 py-1 rounded w-full" />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" value={share3} onChange={(e) => setShare3(e.target.value)} className="border px-2 py-1 rounded w-full" />
                                </td>
                                <td className="px-4 py-3">
                                    {difference.toFixed(2)}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="mb-10 text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm"
                    >
                        Save Changes
                    </button>
                </div>

                {/* Table 3: Monthly Metrics */}
                <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <table className="min-w-full text-[10px] text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-[10px]">
                                <th className="px-4 py-3 font-medium">Metric</th>
                                {months.map((month, i) => (
                                    <th key={i} className="px-4 py-3 font-medium">{month}</th>
                                ))}
                                <th className="px-4 py-3 font-medium">Total</th>
                                <th className="px-4 py-3 font-medium">Share</th>
                                <th className="px-4 py-3 font-medium">Dif</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Realized - Revenue</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] ? Math.round(monthlyData[i].revenue).toLocaleString() : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(totals.revenue).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {forecastTotals.netSales > 0 ? ((totals.revenue / forecastTotals.netSales) * 100).toFixed(2) : 0}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(totals.revenue - forecastTotals.netSales).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Realized - Netprofit</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] ? Math.round(monthlyData[i].net_profit).toLocaleString() : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(totals.net_profit).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {forecastTotals.netSales > 0 ? ((totals.net_profit / forecastTotals.netSales) * 100).toFixed(2) : 0}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(totals.net_profit - forecastTotals.netSales).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Realized - Spend</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] ? Math.round(monthlyData[i].spend).toLocaleString() : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(totals.spend).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendshare / 12 * 100).toFixed(2)}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(totals.spend - (forecastTotals.spendMeta + forecastTotals.spendGoogleAds)).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Realized - Spend - Meta</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] ? Math.round(monthlyData[i].meta_spend).toLocaleString() : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(totals.meta_spend).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {forecastTotals.spendMeta > 0 ? ((totals.meta_spend / forecastTotals.spendMeta) * 100).toFixed(2) : 0}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(totals.meta_spend - forecastTotals.spendMeta).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Realized - Spend - Ads</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] ? Math.round(monthlyData[i].google_ads_spend).toLocaleString() : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(totals.google_ads_spend).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {forecastTotals.spendGoogleAds > 0 ? ((totals.google_ads_spend / forecastTotals.spendGoogleAds) * 100).toFixed(2) : 0}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(totals.google_ads_spend - forecastTotals.spendGoogleAds).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Forecast - Spend</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {Math.round(forecastData.spendMeta[i] + forecastData.spendGoogleAds[i]).toLocaleString()}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.spendMeta + forecastTotals.spendGoogleAds).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendshare / 12 * 100).toFixed(2)}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendMeta + forecastTotals.spendGoogleAds - totals.spend).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Forecast - Spend - Meta</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {Math.round(forecastData.spendMeta[i] * share2).toLocaleString()}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.spendMeta * share2).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {share2 * 100}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendMeta * share2 - totals.meta_spend).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Forecast - Spend - Ads</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {Math.round(forecastData.spendGoogleAds[i] * share2).toLocaleString()}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {Math.round(forecastTotals.spendGoogleAds * share2).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {share2 * 100}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {(forecastTotals.spendGoogleAds * share2 - totals.google_ads_spend).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Spendshare</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] && monthlyData[i].revenue > 0 ? ((monthlyData[i].spend / monthlyData[i].revenue) * 100).toFixed(2) : 0}%
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {totals.revenue > 0 ? ((totals.spend / totals.revenue) * 100).toFixed(2) : 0}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {share1 * 100}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {difference.toFixed(2)}%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium text-[10px]">DK - Return</td>
                                {months.map((month, i) => (
                                    <td key={i} className="px-4 py-3 text-[10px]">
                                        {monthlyData[i] && monthlyData[i].spend > 0 ? (monthlyData[i].revenue / monthlyData[i].spend).toFixed(2) : 0}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-[10px]">
                                    {totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : 0}
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {share3 * 100}%
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}