"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SEOReportPage({ params }) {
    const [customerId, setCustomerId] = useState(null);
    const [comparison, setComparison] = useState("Previous Year");
    const [dateStart, setDateStart] = useState("2025-01-01");
    const [dateEnd, setDateEnd] = useState("2025-04-15");
    const [metric, setMetric] = useState("Impressions");
    const [filter, setFilter] = useState("Med brand");

    useEffect(() => {
        if (params?.customerId) {
            setCustomerId(params.customerId);
        }
    }, [params]);

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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">Humdakin DK</h2>
                    <h1 className="mb-5 text-3xl font-bold text-black xl:text-[44px]">SEO Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Overview of clicks, impressions, CTR and position based on Google Search Console data.
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Click", value: "51.387", delta: "+37.81%", positive: true },
                        { label: "Impressions", value: "1.843.887", delta: "+76.01%", positive: true },
                        { label: "CTR", value: "2,78%", delta: "-20.33%", positive: false },
                        { label: "Avg. Position", value: "24,20", delta: "+7.90", positive: false },
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-zinc-200 rounded p-4">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-2xl font-bold text-zinc-800">{item.value}</p>
                            <p
                                className={`text-sm font-medium ${item.positive ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {item.delta}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-10">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Impressions</p>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Impressions</option>
                            <option>Clicks</option>
                            <option>CTR</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-300">
                        <span className="text-sm">[Chart]</span>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 mb-8 shadow-solid-l">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold">Top Performance Keyword (Last 3 months)</p>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Med brand</option>
                            <option>Uden brand</option>
                        </select>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Keyword</th>
                                    <th className="px-4 py-2">Click</th>
                                    <th className="px-4 py-2">Impr</th>
                                    <th className="px-4 py-2">Position</th>
                                    <th className="px-4 py-2 text-center">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["baron", "5.130", "78.645", "1"],
                                    ["baron", "2.715", "4.889", "1"],
                                    ["baron", "826", "2.682", "21"],
                                    ["baron retur", "496", "1.963", "3"],
                                    ["baron t shirt", "436", "9.641", "5"],
                                ].map(([keyword, click, impr, pos], i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2">{keyword}</td>
                                        <td className="px-4 py-2">{click}</td>
                                        <td className="px-4 py-2">{impr}</td>
                                        <td className="px-4 py-2">{pos}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input type="checkbox" className="rounded border-zinc-300" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded p-6 h-40 flex items-center justify-center text-zinc-300 text-sm">
                    Tilføj en serie for at visualisere dine data
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-zinc-200 rounded p-6 mt-10 shadow-solid-10">
                    <div className="overflow-auto">
                        <p className="font-semibold mb-4">Top Performance URLs (Last 3 months)</p>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-zinc-600 text-left">
                                <tr>
                                    <th className="px-4 py-2">URL</th>
                                    <th className="px-4 py-2">Click</th>
                                    <th className="px-4 py-2">Impr</th>
                                    <th className="px-4 py-2">CTR</th>
                                    <th className="px-4 py-2 text-center">✓</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["/", "10.822", "418.095", "2.59%"],
                                    ["/collections/herre", "1.573", "228.277", "0.69%"],
                                    ["/pages/ombyt-retur", "993", "18.945", "5.24%"],
                                    ["/collections/sport-dame", "574", "44.041", "1.25%"],
                                    ["/collections/baeren-football-club", "567", "5.368", "10.57%"],
                                    ["/pages/baeren-butikk", "504", "6.548", "7.70%"],
                                    ["/collections/hoodies-classic", "483", "9.437", "5.12%"],
                                    ["/collections/tshirt-shirts", "473", "40.947", "1.17%"],
                                    ["/pages/football-jersey", "470", "12.922", "3.63%"],
                                    ["/collections/dame", "460", "121.980", "0.37%"],
                                    ["/collections/baeren-gill-samar", "380", "6.688", "5.68%"],
                                    ["/collections/gill-samar-klub-old", "362", "5.178", "6.99%"],
                                    ["/collections/gill-samar-klub-alt", "317", "2.922", "10.85%"],
                                    ["/collections/tuning", "289", "7.111", "4.06%"],
                                    ["/collections/fargofolk", "270", "7.266", "3.72%"],
                                    ["/collections/long-sleeve-herre", "270", "39.023", "0.69%"],
                                    ["/pages/training-club", "248", "13.881", "1.79%"],
                                    ["/collections/sweatpants", "247", "29.809", "0.83%"],
                                ].map(([url, click, impr, ctr], i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{url}</td>
                                        <td className="px-4 py-2">{click}</td>
                                        <td className="px-4 py-2">{impr}</td>
                                        <td className="px-4 py-2">{ctr}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input type="checkbox" defaultChecked={i < 5} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex justify-end mb-2">
                            <select
                                className="border px-3 py-1 rounded text-sm"
                                defaultValue="Clicks"
                            >
                                <option>Clicks</option>
                                <option>Impressions</option>
                                <option>CTR</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-zinc-300 text-sm border border-zinc-200 rounded h-full">
                            [Line Chart Placeholder]
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
