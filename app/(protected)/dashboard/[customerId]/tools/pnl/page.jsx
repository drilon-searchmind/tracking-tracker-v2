"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PnLPage({ params }) {
    const [customerId, setCustomerId] = useState(null);

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
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">P&L</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed. Commodo in viv
                    </p>
                </div>

                <div className="flex gap-2 mb-6 justify-end">
                    <input type="date" className="border px-2 py-2 rounded text-sm" />
                    <span className="text-gray-400">→</span>
                    <input type="date" className="border px-2 py-2 rounded text-sm" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: P&L Table */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Section: Nettoomsætning */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">Nettoomsætning</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Netsales</span>
                                <span>kr. 6.411.233</span>
                            </div>
                        </div>

                        {/* Section: DB1 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">DB1</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>COGS</span>
                                <span>kr. 6.411.233</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB1</span>
                                <span>kr. 6.411.233</span>
                            </div>
                        </div>

                        {/* Section: DB2 */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">DB2</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>COGS</span>
                                <span>kr. 6.411.233</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB1</span>
                                <span>kr. 6.411.233</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Total, DB1</span>
                                <span>kr. 6.411.233</span>
                            </div>
                        </div>

                        {/* Section: Resultat */}
                        <div className="border border-zinc-200 rounded bg-white">
                            <div className="bg-gray-100 px-4 py-2 font-medium">Resultat</div>
                            <div className="flex justify-between px-4 py-2 border-t">
                                <span>Faste udgifter</span>
                                <span>kr. 6.411.233</span>
                            </div>
                        </div>

                        {/* Section: ROAS */}
                        <div className="grid grid-cols-2 border border-zinc-200 rounded divide-x divide-gray-300 text-center z-10 bg-white">
                            <div className="px-4 py-5">
                                <p className="font-medium text-zinc-500 mb-2">Realiseret ROAS</p>
                                <p className="text-zinc-800 text-4xl font-bold">12.92</p>
                            </div>
                            <div className="px-4 py-5">
                                <p className="font-medium text-zinc-400 mb-2">Break-even ROAS</p>
                                <p className="text-zinc-800 text-4xl font-bold">12.92</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: DB Andel Circles */}
                    <div className="space-y-6">
                        <div className="border border-zinc-200 rounded text-center py-2 bg-gray-100 font-medium">
                            DB andel af samlede udgifter
                        </div>

                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                                <div className="flex justify-between text-sm text-gray-500 mb-2 px-4">
                                    <span>Achieved</span>
                                    <span>Remaining</span>
                                </div>
                                <div className="relative w-full h-32 flex items-center justify-center">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="50"
                                            stroke="#E5E7EB"
                                            strokeWidth="10"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r="50"
                                            stroke="#C6ED62"
                                            strokeWidth="10"
                                            strokeDasharray="314"
                                            strokeDashoffset="104"
                                            fill="transparent"
                                        />
                                    </svg>
                                    <div className="absolute text-xl font-semibold text-gray-800">67%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
