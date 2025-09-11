import PPCDashboard from "./ppc-dashboard";
import { queryBigQueryGoogleAdsDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function GoogleAdsDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        const dashboardQuery = `
    WITH raw_data AS (
        SELECT
            segments_date AS date,
            campaign_name,
            metrics_clicks AS clicks,
            metrics_impressions AS impressions,
            metrics_conversions AS conversions,
            metrics_conversions_value AS conversions_value,
            metrics_cost_micros / 1000000.0 AS cost
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.google_ads_campaign\`
        WHERE segments_date IS NOT NULL
    ),
    metrics_by_date AS (
        SELECT
            CAST(date AS STRING) AS date,
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            CAST(SUM(conversions) AS FLOAT64) AS conversions,
            CAST(SUM(conversions_value) AS FLOAT64) AS conversions_value,
            SUM(cost) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(cost) > 0 THEN SUM(conversions_value) / SUM(cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(conversions) > 0 THEN SUM(conversions_value) / SUM(conversions)
                    ELSE 0
                END AS FLOAT64
            ) AS aov,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(cost) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(conversions) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS conv_rate
        FROM raw_data
        GROUP BY date
        ORDER BY date
    ),
    top_campaigns AS (
        SELECT
            campaign_name,
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr
        FROM raw_data
        GROUP BY campaign_name
        ORDER BY clicks DESC
        LIMIT 5
    ),
    campaigns_by_date AS (
        SELECT
            CAST(r.date AS STRING) AS date,
            r.campaign_name,
            SUM(r.clicks) AS clicks,
            SUM(r.impressions) AS impressions,
            CAST(
                CASE
                    WHEN SUM(r.impressions) > 0 THEN SUM(r.clicks) / SUM(r.impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(r.clicks) > 0 THEN SUM(r.conversions) / SUM(r.clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS conv_rate,
            CAST(
                CASE
                    WHEN SUM(r.clicks) > 0 THEN SUM(r.cost) / SUM(r.clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc
        FROM raw_data r
        INNER JOIN top_campaigns t
            ON r.campaign_name = t.campaign_name
        GROUP BY r.date, r.campaign_name
        ORDER BY r.date, clicks DESC
    )
    SELECT
        (SELECT ARRAY_AGG(STRUCT(
            date, 
            clicks, 
            impressions, 
            conversions, 
            conversions_value, 
            ad_spend, 
            roas, 
            aov, 
            ctr, 
            cpc, 
            conv_rate
        )) FROM metrics_by_date) AS metrics_by_date,
        (SELECT ARRAY_AGG(STRUCT(campaign_name, clicks, impressions, ctr)) FROM top_campaigns) AS top_campaigns,
        (SELECT ARRAY_AGG(STRUCT(date, campaign_name, clicks, impressions, ctr, conv_rate, cpc)) FROM campaigns_by_date) AS campaigns_by_date
`;

        const data = await queryBigQueryGoogleAdsDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { metrics_by_date, top_campaigns, campaigns_by_date } = data[0];

        return (
            <PPCDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics_by_date, top_campaigns, campaigns_by_date }}
            />
        );
    } catch (error) {
        console.error("Google Ads Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Google Ads dashboard - {error.message}</div>;
    }
}