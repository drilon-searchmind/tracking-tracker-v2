import React from "react";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";

export default async function TestPage({ params }) {
    const customerId = "airbyte_humdakin_dk"
    const tableId = `performance-dashboard-airbyte`;
    const projectId = `performance-dashboard-airbyte`;

    try {
        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");

        const dashboardQuery = `
            WITH orders_data AS (
                SELECT
                DATE(updated_at) as date,
                SUM(current_total_price) as revenue,
                SUM(current_subtotal_price - total_discounts) as gross_profit,
                COUNT(id) as order_count,
                COUNT(id) as unique_customers
                FROM \`${projectId}.airbyte_${cleanCustomerId}.orders\`
                WHERE DATE(updated_at) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
                GROUP BY DATE(updated_at)
            ),
            ads_data AS (
                SELECT
                segments_date as date,
                SUM(metrics_cost_micros) as google_ads_cost,
                SUM(metrics_impressions) as google_ads_impressions
                FROM \`${projectId}.airbyte_${cleanCustomerId}.campaign\`
                WHERE segments_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
                GROUP BY segments_date
            ),
            meta_data AS (
                SELECT
                date_start as date,
                SUM(spend) as meta_spend,
                SUM(impressions) as meta_impressions
                FROM \`${projectId}.airbyte_${cleanCustomerId}.ads_insights\`
                WHERE date_start BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
                GROUP BY date_start
            ),
            combined_data AS (
                SELECT
                COALESCE(o.date, a.date, m.date) as date,
                o.revenue,
                o.gross_profit,
                o.order_count,
                COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0) as total_cost,
                CASE
                    WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
                    THEN o.revenue / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
                    ELSE 0
                END as roas,
                CASE
                    WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
                    THEN o.gross_profit / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
                    ELSE 0
                END as poas,
                CASE
                    WHEN o.unique_customers > 0
                    THEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) / o.unique_customers
                    ELSE 0
                END as cac,
                CASE
                    WHEN o.order_count > 0
                    THEN o.revenue / o.order_count
                    ELSE 0
                END as aov,
                COALESCE(a.google_ads_impressions, 0) + COALESCE(m.meta_impressions, 0) as total_impressions
                FROM orders_data o
                FULL OUTER JOIN ads_data a ON o.date = a.date
                FULL OUTER JOIN meta_data m ON o.date = m.date
                WHERE COALESCE(o.date, a.date, m.date) IS NOT NULL
            )
            SELECT
                date,
                revenue,
                gross_profit,
                order_count as orders,
                total_cost as cost,
                roas,
                poas,
                cac,
                aov,
                total_impressions as impressions
            FROM combined_data
            WHERE revenue IS NOT NULL
                OR gross_profit IS NOT NULL
                OR order_count IS NOT NULL
                OR total_cost IS NOT NULL
                OR roas IS NOT NULL
                OR poas IS NOT NULL
                OR cac IS NOT NULL
                OR aov IS NOT NULL
                OR total_impressions IS NOT NULL
            ORDER BY date
            `;

        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId,
            customQuery: dashboardQuery,
        });

        return (
            <div>
                <h1>Analytics for {customerId} (performance dashboard metrics) </h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        )
    } catch (error) {
        console.error("Error in TestPage:", error);
        return (
            <div>
                <h1>Error {error}</h1>
            </div>
        );
    }
}