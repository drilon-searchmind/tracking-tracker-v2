import { FaPlay } from "react-icons/fa";

export default function HomePage() {
    return (
        <section id="pageHomePage" className="py-20">
            <div className="grid grid-cols-12 gap-x-20 items-center">
                <span className="col-span-5">
                    <h4 class="mb-4.5 text-lg font-light text-zinc-400 dark:text-white">Searchmind Hub - Home</h4>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Welcome to Your <span className="bg-titlebg relative w-full bottom-0 z-10">Searchmind Hub</span> Homepage</h1>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis eligendi laboriosam eaque ea, autem est. Minus, ipsum sequi! Modi nulla nihil deleniti mollitia dignissimos quibusdam minus esse necessitatibus.</p>
                    <button className="mt-10 bg-[var(--color-secondary-searchmind)] py-3 px-8 rounded-full text-white hover:cursor">
                        Get Started
                    </button>
                </span>
                <span className="col-span-7 shadow-solid-l bg-white rounded-lg p-10">
                    <h3 class="mb-5 text-xl font-semibold text-black dark:text-white xl:text-2xl">Get Started</h3>
                    <div className="">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis.</p>
                    </div>
                    <div className="border border-zinc-200 w-full pt-50 text-center flex justify-center pb-50 rounded-md mt-10">
                        <FaPlay className="text-zinc-400 text-6xl" />
                    </div>
                </span>
            </div>
        </section>
    )
}