"use client";

import { useState } from "react";

const mockRows = Array(10).fill({
    date: "22-05-2025",
    orders: "--",
    revenue: "--",
    revenueExTax: "--",
    ppcCost: "--",
    roas: "--",
    poas: "--",
    gp: "--",
    aov: "--"
});

const DashboardTable = () => {
    const [rows] = useState(mockRows);

    return (
        <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <div className="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 justify-end">
                <button className="border border-gray-300 px-4 py-2 rounded text-sm bg-white hover:bg-gray-100">
                    Comparison
                </button>
                <input
                    type="date"
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                    placeholder="Start date"
                />
                <span className="text-gray-400">→</span>
                <input
                    type="date"
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
                        <th className="px-4 py-3 font-medium">ROAS</th>
                        <th className="px-4 py-3 font-medium">POAS</th>
                        <th className="px-4 py-3 font-medium">GP</th>
                        <th className="px-4 py-3 font-medium">AOV</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                            <td className="px-4 py-3">{row.date}</td>
                            <td className="px-4 py-3">{row.orders}</td>
                            <td className="px-4 py-3">{row.revenue}</td>
                            <td className="px-4 py-3">{row.revenueExTax}</td>
                            <td className="px-4 py-3">{row.ppcCost}</td>
                            <td className="px-4 py-3">{row.roas}</td>
                            <td className="px-4 py-3">{row.poas}</td>
                            <td className="px-4 py-3">{row.gp}</td>
                            <td className="px-4 py-3">{row.aov}</td>
                        </tr>
                    ))}

                    <tr className="bg-gray-200 font-semibold text-sm">
                        <td className="px-4 py-3">Total</td>
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
                        <td className="px-4 py-3">Last Year</td>
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
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTable;
