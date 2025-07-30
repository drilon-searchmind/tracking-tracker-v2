"use client";

import { useState } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
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

export default function ShareOfSearch({ customerId, initialData }) {
    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState("2025-01-01");
    const [dateEnd, setDateEnd] = useState("2025-04-15");
    const [metric, setMetric] = useState("Impressions");
    const [filter, setFilter] = useState("Med brand");

    const { metrics, impressions_data, top_keywords, top_urls, urls_by_date, keywords_by_date } = initialData || {};

    if (!metrics || !impressions_data || !top_keywords || !top_urls || !urls_by_date || !keywords_by_date) {
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerId.replace("airbyte_", "")}</h2>
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">Share of Search</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque accusantium ex tempore at quas distinctio sint velit labore quaerat ea.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 items-center mb-10 justify-end">
                    <select
                        value={comparison}
                        onChange={(e) => setComparison(e.target.value)}
                        className="border px-4 py-2 rounded text-sm bg-white"
                    >
                        <option>Previous Year</option>
                        <option>Previous Period</option>
                    </select>
                    <input
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        className="border px-2 py-2 rounded text-sm"
                    />
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Brands</p>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Brand 1</option>
                            <option>Brand 2</option>
                            <option>Brand 3</option>
                        </select>
                    </div>
                    <div className="w-full h-[calc(100%-2rem)] min-h-[300px]">
                        {/* Full Stacked Share of Search Chart */}
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Searches</p>
                    </div>
                    <div className="w-full h-[calc(100%-2rem)] min-h-[300px]">
                        {/* Line Chart Share of Search Chart (searches?) */}
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-8 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Top Performance Keyword</p>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        <div className="overflow-auto col-span-6">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                    <tr>
                                        <th className="px-4 py-2">Brands</th>
                                        <th className="px-4 py-2">Searches</th>
                                        <th className="px-4 py-2">Searches (previous)</th>
                                        <th className="px-4 py-2">Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_keywords.map((row, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="px-4 py-2">{i + 1}</td>
                                            <td className="px-4 py-2">{row.keyword}</td>
                                            <td className="px-4 py-2">{Math.round(row.clicks).toLocaleString()}</td>
                                            <td className="px-4 py-2">{Math.round(row.impressions).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 col-span-6">
                            <div className="w-full h-[300px]">
                                <p className="text-center">STACKED CHART</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}