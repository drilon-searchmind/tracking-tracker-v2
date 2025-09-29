export default function ServiceDashboards() {
    return (
        <section>
            <div className="mt-8 md:mt-16 space-y-4 px-0 md:px-0 mx-auto z-10 relative">
                <h3 className="mb-2 text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5 mb-5">
                    Service Dashboards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["SEO", "PPC", "EM", "PS"].map((title, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-50 rounded-md px-4 md:px-6 py-4 border border-zinc-200 shadow-solid-l"
                        >
                            <div>
                                <h4 className="text-base md:text-lg font-semibold text-gray-900">{title}</h4>
                                <p className="text-xs md:text-sm text-gray-500">Subtitle</p>
                            </div>
                            <button className="text-xs border border-blue-500 text-blue-500 px-3 md:px-4 py-1 md:py-1.5 rounded hover:bg-blue-50 flex items-center gap-2">
                                <span className="text-sm">+</span> Open
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}