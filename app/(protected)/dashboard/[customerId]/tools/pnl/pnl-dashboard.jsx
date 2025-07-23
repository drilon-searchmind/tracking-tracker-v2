"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PnLDashboard({ customerId, initialData }) {
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState("2025-04-15");

    const { net_sales, orders, cogs, db1, shipping_cost, transaction_cost, db2, marketing_spend, marketing_bureau_cost, marketing_tooling_cost, db3, fixed_expenses, result, realized_roas, break_even_roas, db_percentages } = initialData || {};

    if (!initialData) {
        return <div>No data available for {customerId}</div>;
    }

    const metrics = [
        {
            label: "Net Sales",
            value: Math.round(net_sales).toLocaleString(),
        },
        {
            label: "Orders",
            value: Math.round(orders).toLocaleString(),
        },
        {
            label: "COGS",
            value: Math.round(cogs).toLocaleString(),
        },
        {
            label: "Shipping",
            value: Math.round(shipping_cost).toLocaleString(),
        },
        {
            label: "Transaction Costs",
            value: Math.round(transaction_cost).toLocaleString(),
        },
        {
            label: "Marketing Spend",
            value: Math.round(marketing_spend).toLocaleString(),
        },
        {
            label: "Marketing Bureau",
            value: Math.round(marketing_bureau_cost).toLocaleString(),
        },
        {
            label: "Marketing Tooling",
            value: Math.round(marketing_tooling_cost).toLocaleString(),
        },
        {
            label: "Fixed Expenses",
            value: Math.round(fixed_expenses).toLocaleString(),
        }
    ];

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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerId.replace("airbyte_", "")}</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">P&L</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of profit and loss metrics including net turnover, direct costs, marketing expenses, and financial results.
                    </p>
                </div>

                <div className="flex gap-2 mb-6 justify-end">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: P&L Table */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Metric Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                            {metrics.map((item, i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded p-4">
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className="text-2xl font-bold text-zinc-800">
                                        {item.label === "Orders" ? (
                                            <span>{item.value}</span>
                                        ) : (
                                            <>kr. {item.value}</>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Section: Nettoomsætning */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">Net turnover (turnover - discount & return)</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Netsales</span>
                                <span>kr. {Math.round(net_sales).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Section: DB1 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">DB1 (turnover - cost of goods sold)</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>COGS</span>
                                <span>kr. {Math.round(cogs).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB1</span>
                                <span>kr. {Math.round(db1).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Section: DB2 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">DB2 (DB1 - direct selling costs)</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Shipping</span>
                                <span>kr. {Math.round(shipping_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Transaction Costs</span>
                                <span>kr. {Math.round(transaction_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB2</span>
                                <span>kr. {Math.round(db2).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Section: DB3 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">DB3 (DB2 - marketing costs)</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Marketing Spend</span>
                                <span>kr. {Math.round(marketing_spend).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Marketing Bureau</span>
                                <span>kr. {Math.round(marketing_bureau_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Marketing Tooling</span>
                                <span>kr. {Math.round(marketing_tooling_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB3</span>
                                <span>kr. {Math.round(db3).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Section: Resultat */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">Result</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Fixed Expenses</span>
                                <span>kr. {Math.round(fixed_expenses).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Result</span>
                                <span>kr. {Math.round(result).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Section: ROAS */}
                        <div className="grid grid-cols-2 border border-zinc-200 rounded divide-x divide-gray-300 text-center z-10 bg-white">
                            <div className="px-4 py-5">
                                <p className="font-medium text-zinc-500 mb-2">Realized ROAS</p>
                                <p className="text-zinc-800 text-4xl font-bold">{realized_roas.toFixed(2)}</p>
                            </div>
                            <div className="px-4 py-5">
                                <p className="font-medium text-zinc-400 mb-2">Break-even ROAS</p>
                                <p className="text-zinc-800 text-4xl font-bold">{break_even_roas.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: DB Andel Circles */}
                    <div className="space-y-6">
                        <div className="border border-zinc-200 rounded text-center py-2 bg-gray-100 font-medium">
                            DB share of total expenses
                        </div>

                        {[
                            { label: "DB1", percentage: db_percentages.db1 },
                            { label: "DB2", percentage: db_percentages.db2 },
                            { label: "DB3", percentage: db_percentages.db3 }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                                <div className="flex justify-between text-sm text-gray-500 mb-2 px-4">
                                    <span>{item.label}</span>
                                </div>
                                <div className="relative w-full h-32 flex items-center justify-center">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="50"
                                            stroke="#E5E7EB"
                                            strokeWidth="10"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="50"
                                            stroke="#C6ED62"
                                            strokeWidth="10"
                                            strokeDasharray="314"
                                            strokeDashoffset={314 * (1 - item.percentage / 100)}
                                            fill="transparent"
                                        />
                                    </svg>
                                    <div className="absolute text-xl font-semibold text-gray-800">{Math.round(item.percentage)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}