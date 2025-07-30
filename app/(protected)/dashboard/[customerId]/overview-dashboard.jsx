"use client";

import { useState } from "react";
import Image from "next/image";

export default function OverviewDashboard({ customerId, customerName, initialData }) {
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState("2025-04-15");

    const { overview_metrics, totals } = initialData || {};

    if (!overview_metrics || overview_metrics.length === 0) {
        return <div>No data available for {customerId}</div>;
    }

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
                    <div className="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 justify-end">
                        <button className="border border-gray-300 px-4 py-2 rounded text-sm bg-white hover:bg-gray-100">
                            Comparison
                        </button>
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
                                <td className="px-4 py-3">{Math.round(totals.orders).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.revenue_ex_tax).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.ppc_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.ps_cost).toLocaleString()}</td>
                                <td className="px-4 py-3">{totals.roas.toFixed(2)}</td>
                                <td className="px-4 py-3">{totals.poas.toFixed(2)}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.gp).toLocaleString()}</td>
                                <td className="px-4 py-3">kr. {Math.round(totals.aov).toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Last Year</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                            </tr>
                            <tr className="bg-gray-200 font-semibold text-sm">
                                <td className="px-4 py-3">Difference</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                                <td className="px-4 py-3">--</td>
                            </tr>
                            {overview_metrics.map((row, i) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="px-4 py-3">{row.date}</td>
                                    <td className="px-4 py-3">{Math.round(row.orders).toLocaleString()}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.revenue).toLocaleString()}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.revenue_ex_tax).toLocaleString()}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.ppc_cost).toLocaleString()}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.ps_cost).toLocaleString()}</td>
                                    <td className="px-4 py-3">{row.roas.toFixed(2)}</td>
                                    <td className="px-4 py-3">{row.poas.toFixed(2)}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.gp).toLocaleString()}</td>
                                    <td className="px-4 py-3">kr. {Math.round(row.aov).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}