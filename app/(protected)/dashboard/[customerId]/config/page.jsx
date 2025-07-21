"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ConfigPage({ params }) {
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        if (params?.customerId) {
            setCustomerId(params.customerId);
        }
    }, [params]);

    const dbRows = [
        { month: "Januar", year: "2025", omsaetning: "40.000", budget: "40.000" },
        { month: "Februar", year: "2025", omsaetning: "40.000", budget: "40.000" },
        { month: "Marts", year: "2025", omsaetning: "40.000", budget: "40.000" },
    ];

    const channels = ["Google Ads", "Microsoft Ads"];

    return (
        <div className="py-20 px-0 relative overflow">
            {/* Background */}
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
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">Humdakin DK</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px]">Config</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros
                        scelerisque sed. Commodo in viv
                    </p>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* DB Table */}
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">DB</h3>
                        <div className="overflow-auto border border-zinc-200 rounded bg-white">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                                    <tr className="text-zinc-600">
                                        <th className="px-4 py-3">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="px-4 py-3 font-medium">Målsætning ↓</th>
                                        <th className="px-4 py-3 font-medium">Omsætning</th>
                                        <th className="px-4 py-3 font-medium">Budget</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-700">
                                    {dbRows.map((row, i) => (
                                        <tr key={i} className="border-b border-zinc-100">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="block font-medium">{row.month}</span>
                                                <span className="text-xs text-zinc-400">{row.year}</span>
                                            </td>
                                            <td className="px-4 py-3">{row.omsaetning}</td>
                                            <td className="px-4 py-3">{row.budget}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Marketing Channels */}
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">Marketing Channels</h3>
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="border-b border-zinc-100 px-4 py-2">
                                <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                                    <input type="checkbox" />
                                    Channels
                                </label>
                            </div>
                            {channels.map((channel, i) => (
                                <div key={i} className="border-b last:border-0 border-zinc-100 px-4 py-2">
                                    <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                        <input type="checkbox" />
                                        {channel}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
