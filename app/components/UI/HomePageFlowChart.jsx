"use client"

import React from 'react';
import { TbBrandNextjs } from "react-icons/tb";
import { HiOutlineGlobe } from "react-icons/hi";
import { SiGooglecloud, SiMongodb, SiGooglebigquery, SiGoogleads, SiGoogleanalytics, SiMeta } from "react-icons/si";
import { BsArrowRight, BsArrowLeft, BsArrowDown, BsArrowDownLeft } from "react-icons/bs";

// TODO: Fix the arrows to be more aligned with the boxes
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
                <div className="w-full max-w-6xl mx-auto px-4 py-8">
                    {/* Top Row - GCE, Airbyte, Services */}
                    <div className="flex flex-wrap justify-center items-center mb-20 relative">
                        {/* Google Cloud */}
                        <div className="mx-10">
                            <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <SiGooglecloud className="text-4xl text-blue-600 mb-3" />
                                <span className="text-sm font-semibold">Google Cloud</span>
                            </div>
                        </div>

                        {/* Arrow GCE to Airbyte */}
                        <div className="w-32 flex items-center justify-center">
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                        </div>

                        {/* Airbyte */}
                        <div className="mx-10">
                            <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-3">
                                    <span className="text-white font-bold text-sm">Airbyte</span>
                                </div>
                                <span className="text-sm font-semibold">Data Integration</span>
                            </div>
                        </div>

                        {/* Arrow Airbyte to Services */}
                        <div className="w-32 flex items-center justify-center">
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                            </div>
                            <div className="h-0.5 bg-gray-200 w-full relative">
                                <BsArrowLeft className="text-gray-300 text-lg absolute -left-1 -top-2" />
                            </div>
                        </div>

                        {/* External Services */}
                        <div className="mx-10">
                            <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                <div className="flex flex-wrap justify-center gap-2 mb-3">
                                    <SiGoogleads className="text-2xl text-blue-600" />
                                    <SiGoogleanalytics className="text-2xl text-yellow-500" />
                                    <SiMeta className="text-2xl text-blue-700" />
                                </div>
                                <span className="text-sm font-semibold">External Services</span>
                            </div>
                        </div>

                    </div>

                    {/* Vertical Arrow from Airbyte to BigQuery */}
                    <div className="flex justify-center -mt-10 mb-10">
                        <div className="h-20 w-0.5 bg-gray-200 relative">
                            <BsArrowDown className="text-gray-300 text-lg absolute -bottom-1 -left-2" />
                        </div>
                    </div>

                    {/* Middle Row - BigQuery */}
                    <div className="flex justify-center mb-20">
                        <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                            <SiGooglebigquery className="text-4xl text-green-600 mb-3" />
                            <span className="text-sm font-semibold">BigQuery</span>
                        </div>
                    </div>
                    
                    {/* Container for the bottom row with connections */}
                    <div className="relative">
                        {/* Arrows from BigQuery to bottom row */}
                        <div className="absolute left-1/2 -top-14 transform -translate-x-0.5 h-14 w-0.5 bg-gray-200">
                            <BsArrowDown className="text-gray-300 text-lg absolute -bottom-1 -left-2" />
                        </div>
                        
                        <div className="absolute left-1/2 -top-24 transform translate-x-32 rotate-45 w-48 h-0.5 bg-gray-200">
                            <BsArrowDownLeft className="text-gray-300 text-lg absolute bottom-0 right-0 transform rotate-[225deg]" />
                        </div>

                        {/* Bottom Row - MongoDB, End User, Web App */}
                        <div className="flex flex-wrap justify-center items-center relative">
                            {/* MongoDB */}
                            <div className="mx-10">
                                <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                    <SiMongodb className="text-4xl text-green-500 mb-3" />
                                    <span className="text-sm font-semibold">MongoDB</span>
                                </div>
                            </div>

                            {/* End User */}
                            <div className="mx-10">
                                <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                    <HiOutlineGlobe className="text-4xl text-blue-700 mb-3" />
                                    <span className="text-sm font-semibold">End User</span>
                                </div>
                            </div>

                            {/* Web App */}
                            <div className="mx-10">
                                <div className="w-36 h-36 rounded-lg border border-zinc-200 shadow-md flex flex-col items-center justify-center bg-white">
                                    <TbBrandNextjs className="text-4xl text-black mb-3" />
                                    <span className="text-sm font-semibold">Web Application</span>
                                </div>
                            </div>

                            {/* Arrow from Web App to End User */}
                            <div className="absolute w-32 left-1/2 top-16 transform -translate-x-[60px]">
                                <div className="h-0.5 bg-gray-200 w-full relative">
                                    <BsArrowLeft className="text-gray-300 text-lg absolute -left-1 -top-2" />
                                </div>
                            </div>

                            {/* Arrow from MongoDB to Web App */}
                            <div className="absolute w-32 left-[calc(50%-150px)] top-16">
                                <div className="h-0.5 bg-gray-200 w-full relative">
                                    <BsArrowRight className="text-gray-300 text-lg absolute -right-1 -top-2" />
                                </div>
                            </div>

                            {/* Arrow from Web App to MongoDB */}
                            <div className="absolute w-32 left-[calc(50%-150px)] top-28">
                                <div className="h-0.5 bg-gray-200 w-full relative">
                                    <BsArrowLeft className="text-gray-300 text-lg absolute -left-1 -top-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section labels */}
                    <div className="grid grid-cols-3 gap-8 mt-20 border-t border-zinc-100 pt-6">
                        <div className="text-xs text-gray-500 font-medium text-center">
                            Data Sources
                        </div>
                        <div className="text-xs text-gray-500 font-medium text-center">
                            Data Pipeline
                        </div>
                        <div className="text-xs text-gray-500 font-medium text-center">
                            Data Destinations
                        </div>
                    </div>
                </div>
            </div>
        </span>
    )
}

export default HomePageFlowChart