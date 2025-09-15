"use client"

import React from 'react';
import { TbBrandNextjs } from "react-icons/tb";
import { HiOutlineGlobe } from "react-icons/hi";
import { SiGooglecloud, SiMongodb, SiGooglebigquery, SiGoogleads, SiGoogleanalytics, SiMeta } from "react-icons/si";
import { BsArrowRight, BsArrowLeft, BsArrowDown } from "react-icons/bs";

const HomePageFlowChart = () => {
    return (
        <span className="mt-10 col-span-12 rounded-lg py-10 z-10">
            <span className='max-w-xl mx-auto text-center block mb-10'>
                <h3 className="mb-2 text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5">How Data Flows Through Our Platform</h3>
                <div>
                    <p>From data collection to visualization, our platform seamlessly integrates with your marketing data sources for comprehensive performance dashboards.</p>
                </div>
            </span>

            <div className="border border-zinc-200 w-full py-12 text-center rounded-md mt-10 bg-white">
                <div className="w-full mx-auto px-4 py-8">
                    {/* 5x5 Grid Layout */}
                    <div className="grid grid-cols-5 gap-4">
                        {/* Row 1 */}
                        {/* 1x1: Google Cloud */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <SiGooglecloud className="text-4xl text-blue-600 mb-3" />
                                <span className="text-sm font-semibold">Google Cloud</span>
                            </div>
                        </div>

                        {/* 1x2: Arrow Right */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                        </div>

                        {/* 1x3: Airbyte */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-3">
                                    <span className="text-white font-bold text-sm">Airbyte</span>
                                </div>
                                <span className="text-sm font-semibold">Data Integration</span>
                            </div>
                        </div>

                        {/* 1x4: Two Arrows */}
                        <div className="p-2 flex flex-col justify-center items-center">
                            <div className="h-0.5 bg-gray-200 w-full relative mb-4">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowLeft className="text-gray-300 text-lg absolute -left-1 -top-2" />
                            </div>
                        </div>

                        {/* 1x5: External Services */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <div className="flex flex-wrap justify-center gap-2 mb-3">
                                    <SiGoogleads className="text-2xl text-blue-600" />
                                    <SiGoogleanalytics className="text-2xl text-yellow-500" />
                                    <SiMeta className="text-2xl text-blue-700" />
                                </div>
                                <span className="text-sm font-semibold">External Services</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* 2x3: Arrow Down */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="h-20 w-0.5 bg-gray-200 relative">
                                <BsArrowDown className="text-gray-300 text-lg absolute -bottom-1 -left-2" />
                            </div>
                        </div>

                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* Row 3 */}
                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* 3x3: BigQuery */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <SiGooglebigquery className="text-4xl text-green-600 mb-3" />
                                <span className="text-sm font-semibold">BigQuery</span>
                            </div>
                        </div>

                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* Row 4 */}
                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* 4x3: Arrow Down */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="h-20 w-0.5 bg-gray-200 relative">
                                <BsArrowDown className="text-gray-300 text-lg absolute -bottom-1 -left-2" />
                            </div>
                        </div>

                        <div className="p-2"></div>
                        <div className="p-2"></div>

                        {/* Row 5 */}
                        {/* 5x1: MongoDB */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <SiMongodb className="text-4xl text-green-500 mb-3" />
                                <span className="text-sm font-semibold">MongoDB</span>
                            </div>
                        </div>

                        {/* 5x2: Two Arrows */}
                        <div className="p-2 flex flex-col justify-center items-center">
                            <div className="h-0.5 bg-gray-200 w-full relative mb-4">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowLeft className="text-gray-300 text-lg absolute -left-1 -top-2" />
                            </div>
                        </div>

                        {/* 5x3: Web Application */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <TbBrandNextjs className="text-4xl text-black mb-3" />
                                <span className="text-sm font-semibold">Web Application</span>
                            </div>
                        </div>

                        {/* 5x4: Arrow Right */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                        </div>

                        {/* 5x5: End User */}
                        <div className="p-2 flex justify-center items-center">
                            <div className="w-full h-[200px] rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <HiOutlineGlobe className="text-4xl text-blue-700 mb-3" />
                                <span className="text-sm font-semibold">End User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    )
}

export default HomePageFlowChart