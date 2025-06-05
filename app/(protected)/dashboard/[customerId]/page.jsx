"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineChartBar, HiOutlineCog, HiOutlineDocumentText } from "react-icons/hi";
import { FaMoneyCheckAlt, FaPlay } from "react-icons/fa";
import DashboardTable from "@/app/components/Dashboard/OverviewDayTable";

export default function CustomerDashboard({ params }) {
    const [customerId, setCustomerId] = useState(null)

    const dashboards = [
        {
            name: "Overview Day",
            subtitle: "Happy customer",
            icon: <HiOutlineCalendar className="text-xl text-gray-400" />
        },
        {
            name: "Overview Hour",
            subtitle: "Happy customer",
            icon: <HiOutlineClock className="text-xl text-gray-400" />
        },
        {
            name: "Performance Dashboard",
            subtitle: "Happy customer",
            icon: <HiOutlineChartBar className="text-xl text-gray-400" />
        },
        {
            name: "SEO Dashboard",
            subtitle: "Happy customer",
            icon: <HiOutlineDocumentText className="text-xl text-gray-400" />
        },
        {
            name: "Budget Report",
            subtitle: "Happy customer",
            icon: <FaMoneyCheckAlt className="text-xl text-gray-400" />
        },
        {
            name: "Config",
            subtitle: "Happy customer",
            icon: <HiOutlineCog className="text-xl text-gray-400" />
        }
    ];

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
                    alt="logo"
                    className="w-full h-full"
                />
            </div>

            <div className="px-20 mx-auto z-10 relative">
                <div className="mb-8 relative z-10">
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">PomPdeLux DK</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Overview</h1>
                    <p className="text-gray-600">
                        Below you can choose which dashboard you want to go to first.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-10">
                    {dashboards.map((dashboard) => (
                        <div
                            key={dashboard.name}
                            className="border border-zinc-200 bg-white rounded-lg p-6 transition hover:shadow-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400">
                                    {dashboard.icon}
                                </div>
                                <div>
                                    <p className="text-xl font-medium text-black">{dashboard.name}</p>
                                    <p className="text-sm text-gray-500">{dashboard.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <DashboardTable />
                </div>

                <span className="col-span-6 shadow-solid-l bg-white rounded-lg px-20 py-20 border border-zinc-200 grid grid-cols-12 gap-20">
                    <div className="col-span-6 border border-zinc-200 w-full pt-40 text-center flex justify-center pb-40 rounded-md">
                        <FaPlay className="text-zinc-400 text-6xl" />
                    </div>
                    <div className="col-span-6">
                        <h3 className="text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5">Get Started</h3>
                        <div className="">
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis.</p>
                        </div>
                    </div>
                </span>
            </div>
        </div>
    );

}