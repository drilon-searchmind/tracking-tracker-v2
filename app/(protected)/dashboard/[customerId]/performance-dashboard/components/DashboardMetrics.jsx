import {
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineShoppingCart,
    HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { FaMoneyCheckAlt } from "react-icons/fa";

export default function DashboardMetrics({ currentMetrics, prevMetrics }) {
    const calculateDelta = (current, prev) => {
        if (!prev || prev === 0) return null;
        const delta = ((current - prev) / prev * 100).toFixed(1);
        return `${delta > 0 ? "+" : ""}${delta.toLocaleString('en-US')}%`;
    };

    const metrics = [
        {
            title: "Revenue (Inc VAT)",
            value: `${Math.round(currentMetrics.revenue).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.revenue, prevMetrics.revenue),
            positive: currentMetrics.revenue >= prevMetrics.revenue,
            icon: <HiOutlineCurrencyDollar className="text-2xl text-[var(--color-green)]" />,
        },
        {
            title: "Gross Profit",
            value: `${Math.round(currentMetrics.gross_profit).toLocaleString('en-US')} DKK`,
            delta: calculateDelta(currentMetrics.gross_profit, prevMetrics.gross_profit),
            positive: currentMetrics.gross_profit >= prevMetrics.gross_profit,
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
            title: "Impressions",
            value: Math.round(currentMetrics.impressions).toLocaleString('en-US'),
            delta: calculateDelta(currentMetrics.impressions, prevMetrics.impressions),
            positive: currentMetrics.impressions >= prevMetrics.impressions,
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
                            {metric.title === "Gross Profit" && (
                                <span className="text-xs text-red-500 ml-1 font-bold">(TBU)</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xl md:text-2xl font-semibold ${metric.title === "Gross Profit" ? "text-red-500 line-through" : "text-[var(--color-dark-green)]"}`}>{metric.value}</span>
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