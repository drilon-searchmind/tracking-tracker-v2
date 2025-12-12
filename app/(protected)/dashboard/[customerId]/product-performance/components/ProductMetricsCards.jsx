export default function ProductMetricsCards({ 
    metrics, 
    selectedMetric, 
    setSelectedMetric, 
    showAllMetrics, 
    setShowAllMetrics 
}) {
    return (
        <>
            {/* Mobile Metrics View */}
            <div className="md:hidden mb-6">
                <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm">
                    <div className="grid grid-cols-2 gap-px bg-[var(--color-natural)]">
                        {metrics.slice(0, showAllMetrics ? metrics.length : 4).map((item, i) => (
                            <div 
                                key={i} 
                                className={`p-4 transition-all duration-200 cursor-pointer ${
                                    selectedMetric === item.label 
                                        ? 'bg-[var(--color-primary-searchmind)]' 
                                        : 'bg-white hover:bg-[var(--color-natural)]'
                                }`}
                                onClick={() => setSelectedMetric(item.label)}
                            >
                                <p className={`text-xs font-medium mb-1 ${
                                    selectedMetric === item.label 
                                        ? 'text-white-important' 
                                        : 'text-[var(--color-green)]'
                                }`}>
                                    {item.label}
                                </p>
                                <p className={`text-xl font-bold ${
                                    selectedMetric === item.label 
                                        ? 'text-white-important' 
                                        : 'text-[var(--color-dark-green)]'
                                }`}>
                                    {item.value}
                                </p>
                                {item.delta && (
                                    <h6 className={`text-xs font-semibold ${
                                        selectedMetric === item.label 
                                            ? (item.positive ? "text-green-200" : "text-red-200")
                                            : (item.positive ? "text-green-600" : "text-red-500")
                                    }`}>
                                        {item.delta}
                                    </h6>
                                )}
                            </div>
                        ))}
                    </div>
                    {metrics.length > 4 && (
                        <button
                            onClick={() => setShowAllMetrics(!showAllMetrics)}
                            className="w-full py-2 text-sm text-[var(--color-lime)] border-t border-[var(--color-light-natural)] hover:text-[var(--color-green)] transition-colors font-medium"
                        >
                            {showAllMetrics ? "Show Less" : `Show ${metrics.length - 4} More Metrics`}
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Metrics Grid */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6 md:mb-8">
                {metrics.map((item, i) => (
                    <div 
                        key={i} 
                        className={`border rounded-lg shadow-sm p-6 transition-all duration-200 cursor-pointer hover:shadow-md ${
                            selectedMetric === item.label 
                                ? 'bg-[var(--color-primary-searchmind)] border-[var(--color-primary-searchmind)]' 
                                : 'bg-white border-[var(--color-light-natural)] hover:border-[var(--color-green)]'
                        }`}
                        onClick={() => setSelectedMetric(item.label)}
                    >
                        <div className="flex flex-col">
                            <p className={`text-sm font-medium mb-2 ${
                                selectedMetric === item.label 
                                    ? 'text-white-important' 
                                    : 'text-[var(--color-green)]'
                            }`}>
                                {item.label}
                            </p>
                            <div className="flex items-baseline justify-between">
                                <p className={`text-2xl md:text-xl xl:text-2xl font-bold ${
                                    selectedMetric === item.label 
                                        ? 'text-white-important' 
                                        : 'text-[var(--color-dark-green)]'
                                }`}>
                                    {item.value}
                                </p>
                                {item.delta && (
                                    <div className="flex flex-col items-end">
                                        <h6 className={`text-sm font-semibold ${
                                            selectedMetric === item.label 
                                                ? (item.positive ? "text-green-200" : "text-red-200")
                                                : (item.positive ? "text-green-600" : "text-red-500")
                                        }`}>
                                            {item.delta}
                                        </h6>
                                        <h6 className={`text-xs mt-1 ${
                                            selectedMetric === item.label 
                                                ? 'text-white-important opacity-80' 
                                                : 'text-[var(--color-green)]'
                                        }`}>
                                            vs prev period
                                        </h6>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}