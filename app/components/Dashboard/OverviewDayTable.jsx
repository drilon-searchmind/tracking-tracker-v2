"use client";

import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

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
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRowExpansion = (index) => {
        setExpandedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="mb-12 overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <div className="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 justify-between md:justify-end">
                <button className="border border-gray-300 px-4 py-2 rounded text-sm bg-white hover:bg-gray-100 order-1 md:order-none">
                    Comparison
                </button>
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto order-3 md:order-none">
                    <input
                        type="date"
                        className="border border-gray-300 px-3 py-2 rounded text-sm flex-grow md:flex-grow-0"
                        placeholder="Start date"
                    />
                    <span className="text-gray-400 hidden md:inline">→</span>
                    <span className="text-gray-400 inline md:hidden">to</span>
                    <input
                        type="date"
                        className="border border-gray-300 px-3 py-2 rounded text-sm flex-grow md:flex-grow-0"
                        placeholder="End date"
                    />
                </div>
            </div>

            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden md:block">
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

            {/* Mobile Card-Based Layout */}
            <div className="md:hidden">
                <div className="text-xs uppercase text-gray-600 px-4 py-2 bg-gray-50 border-b border-gray-200">
                    Data View
                </div>
                {rows.map((row, i) => (
                    <div key={i} className="border-b border-gray-200 last:border-b-0">
                        <div 
                            className="px-4 py-3 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleRowExpansion(i)}
                        >
                            <div>
                                <div className="font-semibold">{row.date}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Revenue: {row.revenue} | Orders: {row.orders}
                                </div>
                            </div>
                            <FaChevronRight className={`text-gray-400 transition-transform ${expandedRows[i] ? 'transform rotate-90' : ''}`} />
                        </div>
                        
                        {expandedRows[i] && (
                            <div className="px-4 pb-3 grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">Orders:</span>
                                    <span>{row.orders}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">Revenue:</span>
                                    <span>{row.revenue}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">Ex Tax:</span>
                                    <span>{row.revenueExTax}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">PPC Cost:</span>
                                    <span>{row.ppcCost}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">ROAS:</span>
                                    <span>{row.roas}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">POAS:</span>
                                    <span>{row.poas}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">GP:</span>
                                    <span>{row.gp}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-600">AOV:</span>
                                    <span>{row.aov}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Mobile Summary Rows */}
                <div className="bg-gray-200 px-4 py-3">
                    <div className="font-semibold">Total</div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Orders:</span>
                            <span>--</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Revenue:</span>
                            <span>--</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-200 px-4 py-3 border-t border-gray-300">
                    <div className="font-semibold">Last Year</div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Orders:</span>
                            <span>--</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Revenue:</span>
                            <span>--</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-200 px-4 py-3 border-t border-gray-300">
                    <div className="font-semibold">Difference</div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Orders:</span>
                            <span>--</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Revenue:</span>
                            <span>--</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTable;