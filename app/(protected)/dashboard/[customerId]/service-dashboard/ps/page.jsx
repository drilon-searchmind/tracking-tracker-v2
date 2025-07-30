import PSDashboard from "./ps-dashboard";
import { queryBigQueryPaidSocialDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PaidSocialDashboardPage({ params }) {
    const { customerId } = params;

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId

        const dashboardQuery = `
    WITH raw_data AS (
        SELECT
            date_start AS date,
            campaign_name,
            clicks,
            impressions,
            CAST(JSON_VALUE(conversions) AS FLOAT64) AS conversions,
            CAST(JSON_VALUE(conversion_values) AS FLOAT64) AS conversion_value,
            spend
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.ads_insights\`
    ),
    metrics AS (
        SELECT
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            SUM(conversions) AS conversions,
            SUM(conversion_value) AS conversion_value,
            SUM(spend) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(spend) > 0 THEN SUM(conversion_value) / SUM(spend)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(conversions) > 0 THEN SUM(conversion_value) / SUM(conversions)
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
                    WHEN SUM(clicks) > 0 THEN SUM(spend) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN (SUM(spend) / SUM(impressions)) * 1000
                    ELSE 0
                END AS FLOAT64
            ) AS cpm
        FROM raw_data
    ),
    metrics_by_date AS (
        SELECT
            CAST(date AS STRING) AS date,
            SUM(clicks) AS clicks,
            SUM(impressions) AS impressions,
            CAST(SUM(conversions) AS FLOAT64) AS conversions,
            CAST(SUM(conversion_value) AS FLOAT64) AS conversion_value,
            SUM(spend) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(spend) > 0 THEN SUM(conversion_value) / SUM(spend)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(conversions) > 0 THEN SUM(conversion_value) / SUM(conversions)
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
                    WHEN SUM(clicks) > 0 THEN SUM(spend) / SUM(clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(impressions) > 0 THEN (SUM(spend) / SUM(impressions)) * 1000
                    ELSE 0
                END AS FLOAT64
            ) AS cpm
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
                    WHEN SUM(r.clicks) > 0 THEN SUM(r.spend) / SUM(r.clicks)
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(r.impressions) > 0 THEN (SUM(r.spend) / SUM(r.impressions)) * 1000
                    ELSE 0
                END AS FLOAT64
            ) AS cpm
        FROM raw_data r
        INNER JOIN top_campaigns t
            ON r.campaign_name = t.campaign_name
        GROUP BY r.date, r.campaign_name
        ORDER BY r.date, clicks DESC
    )
    SELECT
        (SELECT AS STRUCT * FROM metrics) AS metrics,
        (SELECT ARRAY_AGG(STRUCT(
            date,
            clicks,
            impressions,
            conversions,
            conversion_value,
            ad_spend,
            roas,
            aov,
            ctr,
            cpc,
            cpm
        )) FROM metrics_by_date) AS metrics_by_date,
        (SELECT ARRAY_AGG(STRUCT(campaign_name, clicks, impressions, ctr)) FROM top_campaigns) AS top_campaigns,
        (SELECT ARRAY_AGG(STRUCT(date, campaign_name, clicks, impressions, ctr, conv_rate, cpc, cpm)) FROM campaigns_by_date) AS campaigns_by_date
`;

        const data = await queryBigQueryPaidSocialDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        console.log("Paid Social Dashboard data:", JSON.stringify(data, null, 2));

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { metrics, metrics_by_date, top_campaigns, campaigns_by_date } = data[0];

        return (
            <PSDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics, metrics_by_date, top_campaigns, campaigns_by_date }}
            />
        );
    } catch (error) {
        console.error("Paid Social Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Paid Social dashboard - {error.message}</div>;
    }
}