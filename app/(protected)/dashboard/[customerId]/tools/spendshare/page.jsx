import SpendshareDashboard from "./spendshare";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600;

export default async function SpendSharePage({ params }) {
    const { customerId } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.NODE_ENV === "development"
            ? "http://192.168.1.253:3000"
            : "http://localhost:3000";

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        const dashboardQuery = `
            WITH shopify_data AS (
                SELECT
                    EXTRACT(MONTH FROM processed_at) AS month,
                    SUM(amount) AS revenue,
                    SUM(amount) - SUM(amount * 0.25) AS net_profit
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.shopify_transactions\`
                WHERE EXTRACT(YEAR FROM processed_at) = EXTRACT(YEAR FROM CURRENT_DATE())
                GROUP BY month
            ),
            meta_data AS (
                SELECT
                    EXTRACT(MONTH FROM date_start) AS month,
                    SUM(spend) AS meta_spend
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.meta_ads_insights\`
                WHERE EXTRACT(YEAR FROM date_start) = EXTRACT(YEAR FROM CURRENT_DATE())
                GROUP BY month
            ),
            google_ads_data AS (
                SELECT
                    EXTRACT(MONTH FROM segments_date) AS month,
                    SUM(metrics_cost_micros / 1000000.0) AS google_ads_spend
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.google_ads_campaign\`
                WHERE EXTRACT(YEAR FROM segments_date) = EXTRACT(YEAR FROM CURRENT_DATE())
                GROUP BY month
            ),
            combined_data AS (
                SELECT
                    COALESCE(s.month, m.month, g.month) AS month,
                    COALESCE(s.revenue, 0) AS revenue,
                    COALESCE(s.net_profit, 0) AS net_profit,
                    COALESCE(m.meta_spend, 0) AS meta_spend,
                    COALESCE(g.google_ads_spend, 0) AS google_ads_spend,
                    COALESCE(m.meta_spend, 0) + COALESCE(g.google_ads_spend, 0) AS spend
                FROM shopify_data s
                FULL OUTER JOIN meta_data m ON s.month = m.month
                FULL OUTER JOIN google_ads_data g ON s.month = g.month
            )
            SELECT
                ARRAY_AGG(STRUCT(
                    month,
                    revenue,
                    net_profit,
                    spend,
                    meta_spend,
                    google_ads_spend
                ) ORDER BY month) AS monthly_metrics
            FROM combined_data
        `;

        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        console.log("Spendshare data:", JSON.stringify(data, null, 2));

        if (!data || !data[0] || !data[0].monthly_metrics) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const monthlyMetrics = data[0].monthly_metrics.map(row => ({
            month: Number(row.month),
            revenue: Number(row.revenue || 0),
            net_profit: Number(row.net_profit || 0),
            spend: Number(row.spend || 0),
            meta_spend: Number(row.meta_spend || 0),
            google_ads_spend: Number(row.google_ads_spend || 0)
        }));

        return (
            <SpendshareDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ monthly_metrics: monthlyMetrics }}
            />
        );
    } catch (error) {
        console.error("SpendShare error:", error.message, error.stack);
        return <div>Error: Failed to load Spendshare dashboard - {error.message}</div>;
    }
}