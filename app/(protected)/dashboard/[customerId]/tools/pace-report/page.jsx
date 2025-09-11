import PaceReport from "./pace-report";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PacePage({ params }) {
    const { customerId } = params;

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        const dashboardQuery = `
    WITH shopify_data AS (
        SELECT
            date,
            SUM(COALESCE(amount, 0)) AS revenue,
            COUNT(*) AS orders
        FROM (
            SELECT
                CAST(DATE(processed_at) AS STRING) AS date,
                amount
            FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.shopify_transactions\`
            WHERE status = 'SUCCESS' AND processed_at IS NOT NULL
        ) t
        GROUP BY date
    ),
    facebook_data AS (
        SELECT
            CAST(date_start AS STRING) AS date,
            SUM(COALESCE(spend, 0)) AS ps_cost
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.meta_ads_insights\`
        WHERE date_start IS NOT NULL
        GROUP BY date_start
    ),
    google_ads_data AS (
        SELECT
            CAST(segments_date AS STRING) AS date,
            SUM(COALESCE(metrics_cost_micros / 1000000.0, 0)) AS ppc_cost
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.google_ads_campaign\`
        WHERE segments_date IS NOT NULL
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
        FULL OUTER JOIN facebook_data f ON s.date = f.date
        FULL OUTER JOIN google_ads_data g ON s.date = g.date
        WHERE COALESCE(s.date, f.date, g.date) IS NOT NULL
    )
    SELECT
        ARRAY_AGG(STRUCT(
            date,
            orders,
            revenue,
            (ps_cost + ppc_cost) AS ad_spend
        ) ORDER BY date) AS daily_metrics
    FROM combined_data
`;

        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        console.log("Pace Report data (raw):", JSON.stringify(data, null, 2));

        if (!data || !data[0] || !data[0].daily_metrics) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        // Serialize numeric fields to plain JavaScript numbers
        const serializedDailyMetrics = data[0].daily_metrics.map(row => ({
            date: row.date,
            orders: Number(row.orders || 0),
            revenue: Number(row.revenue || 0),
            ad_spend: Number(row.ad_spend || 0)
        }));

        console.log("Pace Report data (serialized):", JSON.stringify(serializedDailyMetrics, null, 2));

        return (
            <PaceReport
                customerId={customerId}
                customerName={customerName}
                initialData={{ daily_metrics: serializedDailyMetrics }}
            />
        );
    } catch (error) {
        console.error("Pace Report error:", error.message, error.stack);
        return <div>Error: Failed to load Pace Report - {error.message}</div>;
    }
}