import PaceReport from "./pace-report";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PacePage({ params }) {
    const customerId = "airbyte_humdakin_dk";
    const projectId = `performance-dashboard-airbyte`;

    try {
        const dashboardQuery = `
    WITH shopify_data AS (
        SELECT
            DATE(processed_at) AS date,
            COUNT(*) AS orders,
            SUM(amount) AS revenue
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.transactions\`
        WHERE status = 'SUCCESS'
            AND DATE(processed_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        GROUP BY DATE(processed_at)
    ),
    facebook_data AS (
        SELECT
            date_start AS date,
            SUM(spend) AS ps_cost
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.ads_insights\`
        WHERE date_start >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        GROUP BY date_start
    ),
    google_ads_data AS (
        SELECT
            segments_date AS date,
            SUM(metrics_cost_micros / 1000000.0) AS ppc_cost
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.campaign\`
        WHERE segments_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        GROUP BY segments_date
    ),
    combined_data AS (
        SELECT
            COALESCE(s.date, f.date, g.date) AS date,
            COALESCE(s.orders, 0) AS orders,
            COALESCE(s.revenue, 0) AS revenue,
            COALESCE(f.ps_cost, 0) AS ps_cost,
            COALESCE(g.ppc_cost, 0) AS ppc_cost
        FROM shopify_data s
        FULL OUTER JOIN facebook_data f
            ON s.date = f.date
        FULL OUTER JOIN google_ads_data g
            ON s.date = g.date
        WHERE COALESCE(s.date, f.date, g.date) IS NOT NULL
    ),
    daily_metrics AS (
        SELECT
            CAST(date AS STRING) AS date,
            SUM(orders) OVER (ORDER BY date) AS orders,
            CAST(SUM(revenue) OVER (ORDER BY date) AS FLOAT64) AS revenue,
            CAST(SUM(ps_cost + ppc_cost) OVER (ORDER BY date) AS FLOAT64) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(ps_cost + ppc_cost) OVER (ORDER BY date) > 0 THEN SUM(revenue) OVER (ORDER BY date) / SUM(ps_cost + ppc_cost) OVER (ORDER BY date)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(500000 * (ROW_NUMBER() OVER (ORDER BY date) / 31.0) AS FLOAT64) AS revenue_budget,
            CAST(100000 * (ROW_NUMBER() OVER (ORDER BY date) / 31.0) AS FLOAT64) AS ad_spend_budget
        FROM combined_data
        ORDER BY date
    ),
    totals AS (
        SELECT
            SUM(orders) AS orders,
            CAST(SUM(revenue) AS FLOAT64) AS revenue,
            CAST(SUM(ps_cost) AS FLOAT64) AS ps_cost,
            CAST(SUM(ppc_cost) AS FLOAT64) AS ppc_cost,
            CAST(SUM(ps_cost + ppc_cost) AS FLOAT64) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(ps_cost + ppc_cost) > 0 THEN SUM(revenue) / SUM(ps_cost + ppc_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas
        FROM combined_data
    )
    SELECT
        ARRAY_AGG(STRUCT(
            date,
            orders,
            revenue,
            ad_spend,
            roas,
            revenue_budget,
            ad_spend_budget
        )) AS daily_metrics,
        (SELECT AS STRUCT
            orders,
            revenue,
            ad_spend,
            roas,
            500000 AS revenue_budget,
            100000 AS ad_spend_budget,
            CAST(500000 * EXTRACT(DAY FROM CURRENT_DATE() - DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) / 31 AS FLOAT64) AS revenue_pace,
            CAST(100000 * EXTRACT(DAY FROM CURRENT_DATE() - DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) / 31 AS FLOAT64) AS ad_spend_pace,
            CAST(
                CASE
                    WHEN 500000 > 0 THEN (revenue / 500000) * 100
                    ELSE 0
                END AS FLOAT64
            ) AS revenue_budget_percentage,
            CAST(
                CASE
                    WHEN 100000 > 0 THEN (ad_spend / 100000) * 100
                    ELSE 0
                END AS FLOAT64
            ) AS ad_spend_budget_percentage
        FROM totals
        ) AS totals
    FROM daily_metrics
`;
        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId,
            customQuery: dashboardQuery,
        });

        console.log("Pace Report data:", JSON.stringify(data, null, 2));

        if (!data || !data[0] || !data[0].daily_metrics) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { daily_metrics, totals } = data[0];
        return (
            <PaceReport
                customerId={customerId}
                initialData={{ daily_metrics, totals }}
            />
        );
    } catch (error) {
        console.error("Pace Report error:", error.message, error.stack);
        return <div>Error: Failed to load Pace Report - {error.message}</div>;
    }
}