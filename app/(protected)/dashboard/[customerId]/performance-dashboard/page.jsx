"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
    HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { FaMoneyCheckAlt, FaChartLine } from "react-icons/fa";

export default function PerformanceDashboard({ params }) {
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        if (params?.customerId) {
            setCustomerId(params.customerId);
        }
    }, [params]);

    const metrics = [
        { title: "Revenue", value: "250+", delta: "+12%", positive: true },
        { title: "Gross Profit", value: "600+", delta: "+10%", positive: true },
        { title: "Orders", value: "1.8K+", delta: "+12%", positive: true },
        { title: "Cost", value: "11K+", delta: "-2%", positive: false },
        { title: "ROAS (incl. moms)", value: "250+", delta: "+13%", positive: true },
        { title: "POAS", value: "600+", delta: "+13%", positive: true },
        { title: "CAC", value: "1.8K+", delta: "+12%", positive: true },
        { title: "AOV", value: "11K+", delta: "-2%", positive: false },
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">PomPdeLux DK</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Performance Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed. Commodo in viv...
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {metrics.map((metric, i) => (
                        <div
                            key={i}
                            className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col gap-2"
                        >
                            <p className="text-xs text-gray-500 uppercase">{metric.title}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-semibold text-black">{metric.value}</span>
                                <span
                                    className={`text-sm font-medium ${metric.positive ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {metric.delta}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Revenue</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Spend Allocation</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Average Order Value</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6 h-[300px]">
                        <p className="font-semibold mb-4">Sessions Per Channel Group</p>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl" />
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="mt-16 space-y-4 px-20 mx-auto z-10 relative ">
                    <h3 className="mb-2 text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5 mb-5">Service Dashboards</h3>

                    {["SEO", "PPC", "EM", "PS"].map((title, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-50 rounded-md px-6 py-4 border border-zinc-200 shadow-solid-l"
                        >
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                                <p className="text-sm text-gray-500">Subtitle</p>
                            </div>
                            <button className="text-xs border border-blue-500 text-blue-500 px-4 py-1.5 rounded hover:bg-blue-50 flex items-center gap-2">
                                <span className="text-sm">+</span> Open
                            </button>
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );
}
