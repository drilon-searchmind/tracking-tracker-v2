"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaChartLine } from "react-icons/fa";

export default function PaceReport({ params }) {
    const [customerId, setCustomerId] = useState(null);
    const [budget, setBudget] = useState("500.000 kr");
    const [pace, setPace] = useState("200.000 kr");
    const [metric, setMetric] = useState("Omsætning");

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
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Pace Report</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed. Commodo in viv
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Budget</p>
                            <div className="flex gap-2 items-center">
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                                <span className="text-gray-400">→</span>
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                            </div>
                        </div>
                        <div className="h-[280px] flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                        <div className="mt-4">
                            <input
                                type="text"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-solid-l">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold">Pace</p>
                            <div className="flex gap-2 items-center">
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                                <span className="text-gray-400">→</span>
                                <input type="date" className="border px-2 py-1 rounded text-sm" />
                            </div>
                        </div>
                        <div className="h-[280px] flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={pace}
                                onChange={(e) => setPace(e.target.value)}
                                className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm"
                            />
                            <select
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                                className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm"
                            >
                                <option>Omsætning</option>
                                <option>Ordre</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
