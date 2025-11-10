export default function ServiceDashboards() {
    return (
        <section>
            <div className="mt-8 md:mt-16 space-y-4 px-0 md:px-0 mx-auto z-10 relative">
                <h3 className="mb-2 text-xl font-semibold text-[var(--color-dark-green)] xl:text-2xl mt-5 mb-5">
                    Service Dashboards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["SEO", "PPC", "EM", "PS"].map((title, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded-md px-4 md:px-6 py-4 border border-[var(--color-natural)] shadow-sm"
                        >
                            <div>
                                <h4 className="text-base md:text-lg font-semibold text-[var(--color-dark-green)]">{title}</h4>
                                <p className="text-xs md:text-sm text-[var(--color-green)]">Subtitle</p>
                            </div>
                            <button className="text-xs border border-[var(--color-lime)] text-[var(--color-lime)] px-3 md:px-4 py-1 md:py-1.5 rounded hover:bg-[var(--color-lime)] hover:text-white flex items-center gap-2 transition-colors duration-200">
                                <span className="text-sm">+</span> Open
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}