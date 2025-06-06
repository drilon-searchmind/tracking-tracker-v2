"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function GoogleAdsDashboard({ params }) {
    const [customerId, setCustomerId] = useState(null);
    const [comparison, setComparison] = useState("Previous Year");
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState("2025-04-15");
    const [selectedMetric, setSelectedMetric] = useState("Avg. Position");

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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">PomPdeLux DK</h2>
                    <h1 className="text-3xl font-bold text-black xl:text-[44px] mb-4">Google Ads Dashboard</h1>
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {[
                        { label: "Conv. Value", value: "2.560.721", delta: "-32,27%", positive: false },
                        { label: "Ad Spend", value: "706.824", delta: "+113,19%", positive: true },
                        { label: "ROAS", value: "3,62", delta: "-68,23%", positive: false },
                        { label: "AOV", value: "337", delta: "-39,36%", positive: false },
                        { label: "Conversions", value: "7.588", delta: "+11,71%", positive: true },
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

                <div className="bg-white border border-zinc-200 rounded p-6 shadow-solid-l">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">{selectedMetric}</p>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="border px-3 py-1 rounded text-sm"
                        >
                            <option>Avg. Position</option>
                            <option>Conversions</option>
                            <option>Ad Spend</option>
                            <option>ROAS</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-center justify-center text-gray-300">
                        [Line Chart Placeholder]
                    </div>
                </div>

                <div className="mt-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {[
                            { label: "Impressions", value: "13.637.169", delta: "+104,93%", positive: true },
                            { label: "Clicks", value: "215.800", delta: "+48,98%", positive: true },
                            { label: "CTR", value: "1,58%", delta: "-27,3%", positive: false },
                            { label: "CPC", value: "3,28", delta: "+43,1%", positive: true },
                            { label: "Conv. Rate", value: "3,52%", delta: "-25,02%", positive: false },
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

                    <div className="bg-white border border-zinc-200 rounded p-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">CPC</p>
                            <select className="border px-3 py-1 rounded text-sm" defaultValue="CPC">
                                <option>CPC</option>
                                <option>CTR</option>
                                <option>Conv. Rate</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-center justify-center text-zinc-300">
                            [Line Chart Placeholder]
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
