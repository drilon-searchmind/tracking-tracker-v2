import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import HomePageFlowChart from "@/app/components/UI/HomePageFlowChart";

export default function HomePage() {
    return (
        <section id="pageHomePage" className="py-10 md:py-20 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-20 items-start relative">
                <div className="absolute top-20 bottom-0 left-0 w-full h-full z-1 pointer-events-none">
                    <Image
                        width={1920}
                        height={1080}
                        src="/images/shape-dotted-light.svg"
                        alt="bg"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="col-span-1 md:col-span-6 mb-8 md:mb-0 z-10">
                    <h4 className="mb-4 text-base md:text-lg font-light text-zinc-700">Searchmind Apex - Home</h4>
                    <h1 className="mb-5 text-2xl md:text-3xl xl:text-[44px] font-bold text-black md:pr-8 z-10">
                        Welcome to Your <span className="bg-titlebg relative w-full bottom-0 z-10">Searchmind Apex</span> Homepage
                    </h1>
                    <p className="text-sm md:text-base">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis eligendi laboriosam eaque ea, autem est. Minus, ipsum sequi! Modi nulla nihil deleniti mollitia dignissimos quibusdam minus esse necessitatibus.
                    </p>
                    <button className="mt-6 md:mt-10 bg-[var(--color-primary-searchmind)] py-2 md:py-3 px-6 md:px-8 rounded text-white hover:cursor-pointer text-sm md:text-base">
                        Get Started
                    </button>
                </div>

                <div className="col-span-1 md:col-span-6 shadow-solid-l bg-white rounded-lg px-6 md:px-20 py-6 md:py-10 border border-zinc-200 z-10">
                    <div className="border border-zinc-200 w-full pt-20 md:pt-40 text-center flex justify-center pb-20 md:pb-40 rounded-md mt-6 md:mt-10">
                        <FaPlay className="text-zinc-400 text-4xl md:text-6xl" />
                    </div>
                    <h3 className="mb-2 text-lg md:text-xl xl:text-2xl font-semibold text-black mt-4 md:mt-5">Get Started</h3>
                    <div className="">
                        <p className="text-sm md:text-base">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis.</p>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-12 mt-10 md:mt-20 hidden">
                    <HomePageFlowChart />
                </div>
            </div>
        </section>
    )
}