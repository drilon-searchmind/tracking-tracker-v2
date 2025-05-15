export default function HomePage() {
    return (
        <section id="pageHomePage" className="py-20">
            <div className="grid grid-cols-12 gap-10 items-center">
                <span className="col-span-5">
                    <h4 class="mb-4.5 text-lg font-medium text-black dark:text-white">Searchmind Hub - Home</h4>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px]">Welcome to your Searchmind Hub homepage</h1>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis eligendi laboriosam eaque ea, autem est. Minus, ipsum sequi! Modi nulla nihil deleniti mollitia dignissimos quibusdam minus esse necessitatibus.</p>
                    <button className="mt-10 bg-[var(--color-secondary-searchmind)] py-3 px-8 rounded-full text-white hover:cursor">
                        Get Started
                    </button>
                </span>
                <span className="col-span-6 col-start-7 shadow-solid-l bg-white rounded-lg p-10">
                    <h3 class="mb-5 mt-7.5 text-xl font-semibold text-black dark:text-white xl:text-2xl">High-quality Fancy Title</h3>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore cupiditate perspiciatis eligendi laboriosam eaque ea, autem est. Minus, ipsum sequi! Modi nulla nihil deleniti mollitia dignissimos quibusdam minus esse necessitatibus.</p>
                </span>
            </div>
        </section>
    )
}