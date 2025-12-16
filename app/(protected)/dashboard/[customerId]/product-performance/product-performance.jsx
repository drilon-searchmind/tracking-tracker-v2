"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FaChevronRight, FaChevronLeft, FaSearch } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import Subheading from "@/app/components/UI/Utility/Subheading";
import ProductTable from "./components/ProductTable";
import ProductMetricsCards from "./components/ProductMetricsCards";
import ProductChart from "./components/ProductChart";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);

export default function ProductPerformanceDashboard({ customerId, customerName, customerValutaCode, initialData }) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            console.warn('Invalid date encountered:', date);
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [tempStartDate, setTempStartDate] = useState(formatDate(firstDayOfMonth));
    const [tempEndDate, setTempEndDate] = useState(formatDate(yesterday));
    const [dateStart, setDateStart] = useState(formatDate(firstDayOfMonth));
    const [dateEnd, setDateEnd] = useState(formatDate(yesterday));
    const [selectedMetric, setSelectedMetric] = useState("Revenue");
    const [activeChartIndex, setActiveChartIndex] = useState(0);
    const [expandedProducts, setExpandedProducts] = useState({});
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [sortBy, setSortBy] = useState("total_revenue");
    const [sortOrder, setSortOrder] = useState("desc");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
    
    // View mode and granularity states
    const [metricsViewMode, setMetricsViewMode] = useState("Period");
    const [metricsPeriodGranularity, setMetricsPeriodGranularity] = useState("Daily");
    const [productsViewMode, setProductsViewMode] = useState("Period");
    const [productsPeriodGranularity, setProductsPeriodGranularity] = useState("Daily");

    useEffect(() => {
        console.log('Product Performance Dashboard mounted for customer:', customerId);
        // Auto-fetch with default date range (first day of month to yesterday)
        setIsFetchingData(true);
        fetchProductData(formatDate(firstDayOfMonth), formatDate(yesterday));
    }, [customerId]);

    const fetchProductData = async (startDate, endDate) => {
        setIsFetchingData(true);
        try {
            const response = await fetch(
                `/api/product-performance/${customerId}?startDate=${startDate}&endDate=${endDate}`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch product data: ${response.statusText}`);
            }
            
            const result = await response.json();
            setFetchedData(result.data);
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setIsFetchingData(false);
        }
    };

    const handleApplyDates = () => {
        setDateStart(tempStartDate);
        setDateEnd(tempEndDate);
        fetchProductData(tempStartDate, tempEndDate);
    };

    // Use fetchedData (client-side only)
    const { dashboard_data, top_products, product_daily_metrics } = fetchedData || {};

    // Filter dashboard data by date range
    const filteredDashboardData = useMemo(() => {
        if (!dashboard_data) return [];
        return dashboard_data.filter(item => item.date >= dateStart && item.date <= dateEnd);
    }, [dashboard_data, dateStart, dateEnd]);

    // Calculate overall metrics from dashboard data (matching performance dashboard)
    const overallMetrics = useMemo(() => {
        return filteredDashboardData.reduce(
            (acc, item) => ({
                totalRevenue: acc.totalRevenue + (item.revenue || 0),
                totalOrders: acc.totalOrders + (item.orders || 0),
                totalCost: acc.totalCost + (item.cost || 0),
                totalImpressions: acc.totalImpressions + (item.impressions || 0),
            }),
            {
                totalRevenue: 0,
                totalOrders: 0,
                totalCost: 0,
                totalImpressions: 0,
            }
        );
    }, [filteredDashboardData]);

    // Filter products by date range and search - and recalculate metrics for the date range
    const filteredProducts = useMemo(() => {
        if (!top_products || !product_daily_metrics) return [];
        
        // First, get products that have sales within the date range
        const productsWithSalesInRange = new Set();
        product_daily_metrics
            .filter(metric => metric.order_date >= dateStart && metric.order_date <= dateEnd)
            .forEach(metric => productsWithSalesInRange.add(metric.product_id));
        
        // Filter and recalculate metrics for products with sales in the date range
        let filtered = top_products
            .filter(product => productsWithSalesInRange.has(product.product_id))
            .map(product => {
                // Recalculate metrics based on daily metrics within the date range
                const productDailyData = product_daily_metrics.filter(
                    metric => 
                        metric.product_id === product.product_id &&
                        metric.order_date >= dateStart && 
                        metric.order_date <= dateEnd
                );
                
                const dateRangeMetrics = productDailyData.reduce(
                    (acc, daily) => ({
                        total_quantity_sold: acc.total_quantity_sold + (daily.daily_quantity || 0),
                        total_revenue: acc.total_revenue + (daily.daily_revenue || 0),
                        total_orders: acc.total_orders + (daily.daily_orders || 0),
                    }),
                    { total_quantity_sold: 0, total_revenue: 0, total_orders: 0 }
                );
                
                // Calculate average unit price for the date range
                const avg_unit_price = dateRangeMetrics.total_quantity_sold > 0 
                    ? dateRangeMetrics.total_revenue / dateRangeMetrics.total_quantity_sold 
                    : 0;
                
                return {
                    ...product,
                    // Override with date-range specific metrics
                    total_quantity_sold: dateRangeMetrics.total_quantity_sold,
                    total_revenue: dateRangeMetrics.total_revenue,
                    total_orders: dateRangeMetrics.total_orders,
                    avg_unit_price: avg_unit_price,
                    revenue_per_unit: avg_unit_price, // Same as avg_unit_price for individual products
                };
            })
            .filter(product => {
                // Apply search filter
                const matchesSearch = productSearch ? 
                    product.product_name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.vendor?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.product_type?.toLowerCase().includes(productSearch.toLowerCase())
                    : true;
                
                return matchesSearch && product.total_quantity_sold > 0;
            });

        // Sort products
        filtered.sort((a, b) => {
            const aVal = a[sortBy] || 0;
            const bVal = b[sortBy] || 0;
            
            if (sortOrder === "desc") {
                return bVal - aVal;
            } else {
                return aVal - bVal;
            }
        });

        return filtered;
    }, [top_products, product_daily_metrics, productSearch, dateStart, dateEnd, sortBy, sortOrder]);

    // Filter daily metrics by date range
    const filteredDailyMetrics = useMemo(() => {
        if (!product_daily_metrics) return [];
        
        return product_daily_metrics.filter(metric => 
            metric.order_date >= dateStart && metric.order_date <= dateEnd
        );
    }, [product_daily_metrics, dateStart, dateEnd]);

    // Calculate product-specific metrics from filtered products
    const productMetricsFromProducts = useMemo(() => {
        return filteredProducts.reduce(
            (acc, product) => ({
                totalProducts: acc.totalProducts + 1,
                totalQuantitySold: acc.totalQuantitySold + (product.total_quantity_sold || 0),
                productRevenue: acc.productRevenue + (product.total_revenue || 0),
                productOrders: acc.productOrders + (product.total_orders || 0),
                avgUnitPrice: acc.avgUnitPrice + (product.avg_unit_price || 0),
                totalInventory: acc.totalInventory + (parseInt(product.total_inventory) || 0),
            }),
            {
                totalProducts: 0,
                totalQuantitySold: 0,
                productRevenue: 0,
                productOrders: 0,
                avgUnitPrice: 0,
                totalInventory: 0,
            }
        );
    }, [filteredProducts]);

    // Calculate average unit price correctly
    const avgUnitPrice = filteredProducts.length > 0 
        ? productMetricsFromProducts.avgUnitPrice / filteredProducts.length 
        : 0;

    // Calculate average order value from dashboard data
    const avgOrderValue = overallMetrics.totalOrders > 0 
        ? overallMetrics.totalRevenue / overallMetrics.totalOrders 
        : 0;

    // Get top performing products for selection
    const topPerformingProducts = useMemo(() => {
        return filteredProducts
            .slice(0, 10)
            .map(product => product.product_name);
    }, [filteredProducts]);

    const colors = {
        primary: "#1C398E",
        hue1: "#2E4CA8",
        hue2: "#4963BE",
        hue3: "#6E82D0",
        hue4: "#9BABE1",
    };

    const productMetrics = [
        {
            label: "Total Products",
            value: productMetricsFromProducts.totalProducts.toLocaleString('en-US'),
            delta: null,
            positive: true,
        },
        {
            label: "Revenue",
            value: `${Math.round(overallMetrics.totalRevenue).toLocaleString('en-US')} DKK`,
            delta: null,
            positive: true,
        },
        {
            label: "Quantity Sold",
            value: productMetricsFromProducts.totalQuantitySold.toLocaleString('en-US'),
            delta: null,
            positive: true,
        },
        {
            label: "Orders",
            value: overallMetrics.totalOrders.toLocaleString('en-US'),
            delta: null,
            positive: true,
        },
        {
            label: "Avg Unit Price",
            value: `${avgUnitPrice ? avgUnitPrice.toFixed(2) : "0.00"} DKK`,
            delta: null,
            positive: true,
        },
        {
            label: "Avg Order Value",
            value: `${avgOrderValue ? Math.round(avgOrderValue).toLocaleString('en-US') : "0"} DKK`,
            delta: null,
            positive: true,
        },
        {
            label: "Total Inventory",
            value: productMetricsFromProducts.totalInventory.toLocaleString('en-US'),
            delta: null,
            positive: true,
        },
    ];

    const navigateChart = (direction) => {
        const totalCharts = 2; // We have 2 charts: metrics and products
        if (direction === 'next') {
            setActiveChartIndex((prev) => (prev === totalCharts - 1 ? 0 : prev + 1));
        } else {
            setActiveChartIndex((prev) => (prev === 0 ? totalCharts - 1 : prev - 1));
        }
    };

    const toggleProductExpansion = (index) => {
        setExpandedProducts(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        setExpandedProducts({});
    }, [dateStart, dateEnd]);

    if (isFetchingData || !dashboard_data || !top_products || !product_daily_metrics) {
        return (
            <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
                <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[var(--color-natural)] rounded-lg z-1"></div>
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
                    <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-sm border border-[var(--color-natural)]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-[var(--color-dark-green)] text-lg">Loading product performance data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
            {/* Loading Overlay */}
            {isFetchingData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg p-8 shadow-xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)]"></div>
                            <p className="text-[var(--color-dark-green)] font-medium">Loading product data...</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[var(--color-natural)] rounded-lg z-1"></div>
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
                    <Subheading headingText={customerName} />
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Product Performance</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Overview of product performance including sales, revenue, and inventory metrics from Shopify data.
                    </p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-end">
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-3">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                <label className="text-sm font-medium text-[var(--color-dark-green)] md:hidden">Date Range:</label>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                    <input
                                        type="date"
                                        value={tempStartDate}
                                        onChange={(e) => setTempStartDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <span className="text-[var(--color-green)] text-sm hidden md:inline">→</span>
                                    <span className="text-[var(--color-green)] text-sm md:hidden">to</span>
                                    <input
                                        type="date"
                                        value={tempEndDate}
                                        onChange={(e) => setTempEndDate(e.target.value)}
                                        className="border border-[var(--color-dark-natural)] px-3 py-2 rounded-lg text-sm w-full md:w-auto text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                                    />
                                    <button
                                        onClick={handleApplyDates}
                                        disabled={isFetchingData}
                                        className="bg-[var(--color-lime)] text-[var(--color-dark-green)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-lime-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isFetchingData ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-dark-green)]"></div>
                                                Loading...
                                            </>
                                        ) : (
                                            'Apply'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Metrics Cards */}
                <ProductMetricsCards 
                    metrics={productMetrics}
                    selectedMetric={selectedMetric}
                    setSelectedMetric={setSelectedMetric}
                    showAllMetrics={showAllMetrics}
                    setShowAllMetrics={setShowAllMetrics}
                />

                {/* Mobile Chart Carousel */}
                <div className="md:hidden mb-8">
                    <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-4 h-[320px]">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-[var(--color-dark-green)]">
                                    {activeChartIndex === 0 ? selectedMetric : "Product Performance Over Time"}
                                </h3>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => navigateChart('prev')}
                                        className="text-sm bg-[var(--color-natural)] text-[var(--color-dark-green)] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[var(--color-light-natural)] transition-colors"
                                    >
                                        <FaChevronLeft size={12} />
                                    </button>
                                    <button
                                        onClick={() => navigateChart('next')}
                                        className="text-sm bg-[var(--color-natural)] text-[var(--color-dark-green)] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[var(--color-light-natural)] transition-colors"
                                    >
                                        <FaChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[250px]">
                            <ProductChart
                                dailyMetrics={filteredDailyMetrics}
                                selectedMetric={selectedMetric}
                                colors={colors}
                                viewMode={activeChartIndex === 0 ? metricsViewMode : productsViewMode}
                                granularity={activeChartIndex === 0 ? metricsPeriodGranularity : productsPeriodGranularity}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 gap-1">
                        {[0, 1].map((index) => (
                            <span
                                key={index}
                                className={`block w-2 h-2 rounded-full transition-colors ${index === activeChartIndex ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-light-natural)]'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Chart */}
                <div className="hidden md:block bg-white border border-[var(--color-light-natural)] rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">{selectedMetric} Over Time</h3>
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="border border-[var(--color-dark-natural)] px-4 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            >
                                <option value="Revenue">Revenue</option>
                                <option value="Quantity">Quantity Sold</option>
                                <option value="Orders">Orders</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-[300px]">
                        <ProductChart
                            dailyMetrics={filteredDailyMetrics}
                            selectedMetric={selectedMetric}
                            colors={colors}
                            viewMode={metricsViewMode}
                            granularity={metricsPeriodGranularity}
                        />
                    </div>
                </div>

                {/* Product Table */}
                <ProductTable 
                    products={filteredProducts}
                    productSearch={productSearch}
                    setProductSearch={setProductSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    expandedProducts={expandedProducts}
                    toggleProductExpansion={toggleProductExpansion}
                />
            </div>
        </div>
    );
}