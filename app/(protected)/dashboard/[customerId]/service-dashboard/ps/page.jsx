import PSDashboard from "./ps-dashboard";
import { queryBigQueryPaidSocialDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PaidSocialDashboardPage({ params }) {
    const { customerId } = params;

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

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
        WHERE date_start IS NOT NULL
    ),
    metrics_by_date AS (
        SELECT
            CAST(date AS STRING) AS date,
            SUM(COALESCE(clicks, 0)) AS clicks,
            SUM(COALESCE(impressions, 0)) AS impressions,
            CAST(SUM(COALESCE(conversions, 0)) AS FLOAT64) AS conversions,
            CAST(SUM(COALESCE(conversion_value, 0)) AS FLOAT64) AS conversion_value,
            SUM(COALESCE(spend, 0)) AS ad_spend,
            CAST(
                CASE
                    WHEN SUM(COALESCE(spend, 0)) > 0 THEN SUM(COALESCE(conversion_value, 0)) / SUM(COALESCE(spend, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(COALESCE(conversions, 0)) > 0 THEN SUM(COALESCE(conversion_value, 0)) / SUM(COALESCE(conversions, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS aov,
            CAST(
                CASE
                    WHEN SUM(COALESCE(impressions, 0)) > 0 THEN SUM(COALESCE(clicks, 0)) / SUM(COALESCE(impressions, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(COALESCE(clicks, 0)) > 0 THEN SUM(COALESCE(spend, 0)) / SUM(COALESCE(clicks, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(COALESCE(impressions, 0)) > 0 THEN (SUM(COALESCE(spend, 0)) / SUM(COALESCE(impressions, 0))) * 1000
                    ELSE 0
                END AS FLOAT64
            ) AS cpm,
            CAST(
                CASE
                    WHEN SUM(COALESCE(clicks, 0)) > 0 THEN SUM(COALESCE(conversions, 0)) / SUM(COALESCE(clicks, 0))
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
            SUM(COALESCE(clicks, 0)) AS clicks,
            SUM(COALESCE(impressions, 0)) AS impressions,
            CAST(
                CASE
                    WHEN SUM(COALESCE(impressions, 0)) > 0 THEN SUM(COALESCE(clicks, 0)) / SUM(COALESCE(impressions, 0))
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
            SUM(COALESCE(r.clicks, 0)) AS clicks,
            SUM(COALESCE(r.impressions, 0)) AS impressions,
            CAST(
                CASE
                    WHEN SUM(COALESCE(r.impressions, 0)) > 0 THEN SUM(COALESCE(r.clicks, 0)) / SUM(COALESCE(r.impressions, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS ctr,
            CAST(
                CASE
                    WHEN SUM(COALESCE(r.clicks, 0)) > 0 THEN SUM(COALESCE(r.conversions, 0)) / SUM(COALESCE(r.clicks, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS conv_rate,
            CAST(
                CASE
                    WHEN SUM(COALESCE(r.clicks, 0)) > 0 THEN SUM(COALESCE(r.spend, 0)) / SUM(COALESCE(r.clicks, 0))
                    ELSE 0
                END AS FLOAT64
            ) AS cpc,
            CAST(
                CASE
                    WHEN SUM(COALESCE(r.impressions, 0)) > 0 THEN (SUM(COALESCE(r.spend, 0)) / SUM(COALESCE(r.impressions, 0))) * 1000
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
            cpm,
            conv_rate
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

        const { metrics_by_date, top_campaigns, campaigns_by_date } = data[0];

        return (
            <PSDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics_by_date, top_campaigns, campaigns_by_date }}
            />
        );
    } catch (error) {
        console.error("Paid Social Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Paid Social dashboard - {error.message}</div>;
    }
}