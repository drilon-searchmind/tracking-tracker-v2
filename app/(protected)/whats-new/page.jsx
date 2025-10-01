"use client";

import { useState } from "react";
import Image from "next/image";
import releases from "@/app/data/releases";

export default function WhatsNewPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeRelease, setActiveRelease] = useState(null);

    const filteredReleases = activeFilter === "all"
        ? releases
        : releases.filter(release => release.type === activeFilter);

    if (!activeRelease && filteredReleases.length > 0) {
        setActiveRelease(filteredReleases[0].id);
    }

    const selectedRelease = filteredReleases.find(release => release.id === activeRelease) || filteredReleases[0];

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
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

            <div className="px-0 md:px-20 mx-auto z-10 relative">
                <div className="mb-6 md:mb-8">
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">What's New<span class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md font-medium">🚧 Work In Progress</span></h1>
                    <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                        Stay updated with the latest features, improvements, and fixes in Searchmind Apex.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => {
                            setActiveFilter("all");
                            setActiveRelease(null);
                        }}
                        className={`px-4 py-2 rounded-md text-sm ${activeFilter === "all"
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Updates
                    </button>
                    <button
                        onClick={() => {
                            setActiveFilter("major");
                            setActiveRelease(null);
                        }}
                        className={`px-4 py-2 rounded-md text-sm ${activeFilter === "major"
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Major Releases
                    </button>
                    <button
                        onClick={() => {
                            setActiveFilter("feature");
                            setActiveRelease(null);
                        }}
                        className={`px-4 py-2 rounded-md text-sm ${activeFilter === "feature"
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Feature Updates
                    </button>
                </div>

                {filteredReleases.length > 0 ? (
                    <div className="bg-white border border-zinc-200 rounded-lg shadow-solid-l">
                        <div className="flex flex-col md:flex-row">
                            {/* Sidebar navigation */}
                            <div className="w-full md:w-64 border-r border-zinc-200">
                                <div className="p-4 bg-gray-50 border-b border-zinc-200">
                                    <h3 className="font-semibold text-gray-700">Version History</h3>
                                </div>
                                <ul className="py-2">
                                    {filteredReleases.map((release) => (
                                        <li key={release.id}>
                                            <button
                                                onClick={() => setActiveRelease(release.id)}
                                                className={`w-full text-left px-4 py-3 border-b border-gray-100 ${activeRelease === release.id ? 'bg-blue-50 border-l-4 border-l-[var(--color-primary-searchmind)]' : ''}`}
                                            >
                                                <div className="font-medium">{release.title}</div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">v{release.version}</span>
                                                    <span className="text-gray-500">{release.date}</span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Content area */}
                            {selectedRelease && (
                                <div className="flex-1 p-6">
                                    <div className="mb-6">
                                        <div className="flex items-center mb-2">
                                            <h2 className="text-2xl font-semibold">{selectedRelease.title}</h2>
                                            <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                                                v{selectedRelease.version}
                                            </span>
                                            {selectedRelease.type === "major" && (
                                                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                                                    MAJOR RELEASE
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm">{selectedRelease.date}</p>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-700">{selectedRelease.description}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                                        <ul className="space-y-6">
                                            {selectedRelease.features.map((feature, index) => (
                                                <li key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                                    <h4 className="text-lg font-medium text-blue-900">{feature.title}</h4>
                                                    <p className="text-gray-600 mt-1">{feature.description}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No releases found matching your filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}