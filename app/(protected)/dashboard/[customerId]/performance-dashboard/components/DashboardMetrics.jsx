import { useEffect, useState } from "react";
import {
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
    HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { FaMoneyCheckAlt } from "react-icons/fa";

export default function DashboardMetrics({ currentMetrics, prevMetrics, customerId, tableHeader }) {
    const [cogsPercentage, setCogsPercentage] = useState(0);

    // Debug logging
    useEffect(() => {
        console.log("=== DashboardMetrics Debug ===");
        console.log("currentMetrics:", currentMetrics);
        console.log("prevMetrics:", prevMetrics);
        console.log("cogsPercentage:", cogsPercentage);
    }, [currentMetrics, prevMetrics, cogsPercentage]);

    useEffect(() => {
        console.log("Fetching COGS percentage for customer ID:", customerId);
        
        async function fetchStaticExpenses() {
            try {
                const apiUrl = `/api/config-static-expenses/${customerId}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log({result})
                if (result?.data?.cogs_percentage !== undefined) {
                    setCogsPercentage(result.data.cogs_percentage);
                } else {
                    console.warn("COGS percentage not found in response, defaulting to 0.");
                    setCogsPercentage(0);
                }
            } catch (error) {
                console.error("Error fetching static expenses:", error);
                setCogsPercentage(0);
            }
        }

        if (customerId) {
            fetchStaticExpenses();
        }
    }, [customerId]);

    const calculateDelta = (current, prev) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(1);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const calculateGrossProfit = (revenueExTax, totalCost) => {
        return totalCost > 0 ? (((revenueExTax * cogsPercentage) - totalCost)) : 0;
    };

    const metrics = [
        {
            title: `${tableHeader} (Inc VAT)`,
            value: `${Math.round(currentMetrics.revenue).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.revenue, prevMetrics.revenue),
            positive: currentMetrics.revenue >= prevMetrics.revenue,
            icon: <HiOutlineCurrencyDollar className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "Gross Profit",
            value: `${Math.round(calculateGrossProfit(currentMetrics.revenue, currentMetrics.cost)).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(
                calculateGrossProfit(currentMetrics.revenue, currentMetrics.cost),
                calculateGrossProfit(prevMetrics.revenue, prevMetrics.cost)
            ),
            positive: calculateGrossProfit(currentMetrics.revenue, currentMetrics.cost) >=
                      calculateGrossProfit(prevMetrics.revenue, prevMetrics.cost),
            icon: <FaMoneyCheckAlt className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "Orders",
            value: Math.round(currentMetrics.orders).toLocaleString('en-US'),
            delta: calculateDelta(currentMetrics.orders, prevMetrics.orders),
            positive: currentMetrics.orders >= prevMetrics.orders,
            icon: <HiOutlineShoppingCart className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "Cost",
            value: `${Math.round(currentMetrics.cost).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.cost, prevMetrics.cost),
            positive: currentMetrics.cost <= prevMetrics.cost,
            icon: <HiOutlineChartBar className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "ROAS (Inc VAT)",
            value: currentMetrics.roas.toFixed(2),
            delta: calculateDelta(currentMetrics.roas, prevMetrics.roas),
            positive: currentMetrics.roas >= prevMetrics.roas,
            icon: <HiOutlineArrowTrendingUp className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "POAS (Inc VAT)",
            value: currentMetrics.poas.toFixed(2),
            delta: calculateDelta(currentMetrics.poas, prevMetrics.poas),
            positive: currentMetrics.poas >= prevMetrics.poas,
            icon: <HiOutlineArrowTrendingUp className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "AOV",
            value: `${Math.round(currentMetrics.aov).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.aov, prevMetrics.aov),
            positive: currentMetrics.aov >= prevMetrics.aov,
            icon: <HiOutlineChartBar className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "CAC",
            value: `${Math.round(currentMetrics.cost / currentMetrics.orders).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.cost / currentMetrics.orders, prevMetrics.cost / prevMetrics.orders),
            positive: (currentMetrics.cost / currentMetrics.orders) <= (prevMetrics.cost / prevMetrics.orders),
            icon: <HiOutlineChartBar className="text-2xl text-[var(--color-green)]" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
            {metrics.map((metric, i) => (
                <div
                    key={i}
                    className="bg-white border border-[var(--color-natural)] rounded-lg p-4 md:p-5 flex flex-col gap-2 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        {metric.icon}
                        <p className="text-xs text-[var(--color-green)] uppercase font-medium">
                            {metric.title}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl md:text-2xl font-semibold text-[var(--color-dark-green)]">{metric.value}</span>
                        {metric.delta && (
                            <span
                                className={`text-xs md:text-sm font-medium px-2 py-1 rounded-md ${metric.positive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}
                            >
                                {metric.delta}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}