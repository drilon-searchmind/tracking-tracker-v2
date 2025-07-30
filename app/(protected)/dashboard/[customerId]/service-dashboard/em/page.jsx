import EmailDashboard from "./em-dashboard";
import { queryBigQueryEmailActiveCampaignMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function EmailDashboardPage({ params }) {
    const { customerId } = params;
    const emailType = "active_campaign";

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
	    let projectId = bigQueryProjectId

        const dashboardQuery = `
    WITH raw_data AS (
        SELECT
            segments_date AS date,
            campaign_name,
            metrics_clicks AS clicks,
            metrics_impressions AS impressions,
            CAST(metrics_conversions AS FLOAT64) AS conversions,
            CAST(metrics_conversions_value AS FLOAT64) AS conversion_value,
            metrics_cost_micros / 1000000.0 AS cost
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.campaign\`
    ),
    metrics AS (
        SELECT
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            SUM(conversions) AS conversions,
            SUM(conversion_value) AS conversion_value,
            SUM(cost) AS cost,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(conversions) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS conv_rate,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(cost) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc
        FROM raw_data
    ),
    metrics_by_date AS (
        SELECT
            CAST(date AS STRING) AS date,
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            CAST(SUM(conversions) AS FLOAT64) AS conversions,
            CAST(SUM(conversion_value) AS FLOAT64) AS conversion_value,
            SUM(cost) AS cost,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(conversions) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS conv_rate,
            CAST(
                CASE
                    WHEN SUM(clicks) > 0 THEN SUM(cost) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc
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
    ),
    campaign_performance AS (
        SELECT
            CAST(date AS STRING) AS date,
            campaign_name,
            SUM(impressions) AS impressions,
            SUM(clicks) AS clicks,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(SUM(conversions) AS FLOAT64) AS conversions,
            CAST(SUM(conversion_value) AS FLOAT64) AS conversion_value
        FROM raw_data
        GROUP BY date, campaign_name
        ORDER BY date DESC, clicks DESC
        LIMIT 30
    )
    SELECT
        (SELECT AS STRUCT * FROM metrics) AS metrics,
        (SELECT ARRAY_AGG(STRUCT(
            date,
            clicks,
            impressions,
            conversions,
            conversion_value,
            cost,
            ctr,
            conv_rate,
            cpc
        )) FROM metrics_by_date) AS metrics_by_date,
        (SELECT ARRAY_AGG(STRUCT(campaign_name, clicks, impressions, ctr)) FROM top_campaigns) AS top_campaigns,
        (SELECT ARRAY_AGG(STRUCT(date, campaign_name, clicks, impressions, ctr, conv_rate, cpc)) FROM campaigns_by_date) AS campaigns_by_date,
        (SELECT ARRAY_AGG(STRUCT(date, campaign_name, impressions, clicks, ctr, conversions, conversion_value)) FROM campaign_performance) AS campaign_performance
`;

        const data = await queryBigQueryEmailActiveCampaignMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { metrics, metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance } = data[0];

        return (
            <EmailDashboard
                customerId={customerId}
                initialData={{ metrics, metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance }}
                customerName={customerName}
                emailType={emailType}
            />
        );
    } catch (error) {
        console.error("Email Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Email dashboard - {error.message}</div>;
    }
}