import EmailDashboard from "./em-dashboard";
import { queryBigQueryEmailActiveCampaignMetrics, queryBigQueryEmailKlaviyoMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function EmailDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    const emailType = "klaviyo";

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        let data;
        if (emailType === "klaviyo") {
            const klaviyoQuery = `
            WITH campaign_data AS (
                SELECT
                    k.id AS campaign_id,
                    k.updated_at AS date,
                    JSON_EXTRACT_SCALAR(k.attributes, '$.name') AS campaign_name,
                    JSON_EXTRACT_SCALAR(k.attributes, '$.status') AS status,
                    JSON_EXTRACT_SCALAR(k.attributes, '$.channel') AS channel
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.klaviyo_campaigns\` k
                WHERE k.updated_at IS NOT NULL
            ),
            detailed_metrics AS (
                SELECT
                    cd.campaign_name,
                    cd.date,
                    -- Extract metrics from campaign_messages JSON array
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.sends') AS INT64)) AS impressions,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.opens') AS INT64)) AS opens,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.clicks') AS INT64)) AS clicks,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.bounces') AS INT64)) AS bounces,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.unsubscribes') AS INT64)) AS unsubscribes,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.conversions') AS FLOAT64)) AS conversions,
                    MAX(CAST(JSON_EXTRACT_SCALAR(msg, '$.attributes.stats.revenue') AS FLOAT64)) AS conversion_value
                FROM campaign_data cd
                JOIN \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.klaviyo_campaigns_detailed\` kcd
                ON cd.campaign_id = kcd.id
                CROSS JOIN UNNEST(JSON_EXTRACT_ARRAY(kcd.campaign_messages, '$')) AS msg
                GROUP BY cd.campaign_name, cd.date
            ),
            metrics_by_date AS (
                SELECT
                    CAST(date AS STRING) AS date,
                    COALESCE(SUM(clicks), 0) AS clicks,
                    COALESCE(SUM(impressions), 0) AS impressions,
                    COALESCE(SUM(opens), 0) AS opens,
                    COALESCE(SUM(bounces), 0) AS bounces,
                    COALESCE(SUM(unsubscribes), 0) AS unsubscribes,
                    COALESCE(SUM(conversions), 0) AS conversions,
                    COALESCE(SUM(conversion_value), 0) AS conversion_value,
                    0 AS cost,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                        ELSE 0 
                    END AS ctr,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(opens) / SUM(impressions)
                        ELSE 0 
                    END AS open_rate,
                    CASE 
                        WHEN SUM(clicks) > 0 THEN SUM(conversions) / SUM(clicks)
                        ELSE 0 
                    END AS conv_rate,
                    CASE 
                        WHEN SUM(clicks) > 0 THEN 0 / SUM(clicks)  -- No cost data, so cost is 0
                        ELSE 0 
                    END AS cpc
                FROM detailed_metrics
                GROUP BY date
                ORDER BY date
            ),
            top_campaigns AS (
                SELECT
                    campaign_name,
                    COALESCE(SUM(clicks), 0) AS clicks,
                    COALESCE(SUM(impressions), 0) AS impressions,
                    COALESCE(SUM(opens), 0) AS opens,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                        ELSE 0 
                    END AS ctr,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(opens) / SUM(impressions)
                        ELSE 0 
                    END AS open_rate
                FROM detailed_metrics
                GROUP BY campaign_name
                ORDER BY clicks DESC
                LIMIT 5
            ),
            campaigns_by_date AS (
                SELECT
                    CAST(d.date AS STRING) AS date,
                    d.campaign_name,
                    COALESCE(SUM(d.clicks), 0) AS clicks,
                    COALESCE(SUM(d.impressions), 0) AS impressions,
                    COALESCE(SUM(d.opens), 0) AS opens,
                    CASE 
                        WHEN SUM(d.impressions) > 0 THEN SUM(d.clicks) / SUM(d.impressions)
                        ELSE 0 
                    END AS ctr,
                    CASE 
                        WHEN SUM(d.impressions) > 0 THEN SUM(d.opens) / SUM(d.impressions)
                        ELSE 0 
                    END AS open_rate,
                    CASE 
                        WHEN SUM(d.clicks) > 0 THEN SUM(d.conversions) / SUM(d.clicks)
                        ELSE 0 
                    END AS conv_rate,
                    0 AS cpc  -- No cost data
                FROM detailed_metrics d
                INNER JOIN top_campaigns t
                    ON d.campaign_name = t.campaign_name
                GROUP BY d.date, d.campaign_name
                ORDER BY d.date, clicks DESC
            ),
            campaign_performance AS (
                SELECT
                    CAST(date AS STRING) AS date,
                    campaign_name,
                    COALESCE(SUM(impressions), 0) AS impressions,
                    COALESCE(SUM(opens), 0) AS opens,
                    COALESCE(SUM(clicks), 0) AS clicks,
                    COALESCE(SUM(bounces), 0) AS bounces,
                    COALESCE(SUM(unsubscribes), 0) AS unsubscribes,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                        ELSE 0 
                    END AS ctr,
                    CASE 
                        WHEN SUM(impressions) > 0 THEN SUM(opens) / SUM(impressions)
                        ELSE 0 
                    END AS open_rate,
                    COALESCE(SUM(conversions), 0) AS conversions,
                    COALESCE(SUM(conversion_value), 0) AS conversion_value
                FROM detailed_metrics
                GROUP BY date, campaign_name
                ORDER BY date DESC, clicks DESC
                LIMIT 30
            )
            SELECT
                (SELECT ARRAY_AGG(STRUCT(
                    date,
                    clicks,
                    impressions,
                    opens,
                    bounces,
                    unsubscribes,
                    conversions,
                    conversion_value,
                    cost,
                    ctr,
                    open_rate,
                    conv_rate,
                    cpc
                )) FROM metrics_by_date) AS metrics_by_date,
                (SELECT ARRAY_AGG(STRUCT(campaign_name, clicks, impressions, opens, ctr, open_rate)) FROM top_campaigns) AS top_campaigns,
                (SELECT ARRAY_AGG(STRUCT(date, campaign_name, clicks, impressions, opens, ctr, open_rate, conv_rate, cpc)) FROM campaigns_by_date) AS campaigns_by_date,
                (SELECT ARRAY_AGG(STRUCT(date, campaign_name, impressions, opens, clicks, bounces, unsubscribes, ctr, open_rate, conversions, conversion_value)) FROM campaign_performance) AS campaign_performance
            `;

            data = await queryBigQueryEmailKlaviyoMetrics({
                tableId: projectId,
                customerId: bigQueryCustomerId,
                customQuery: klaviyoQuery,
            });

        } else {
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
        WHERE segments_date IS NOT NULL
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

            data = await queryBigQueryEmailActiveCampaignMetrics({
                tableId: projectId,
                customerId: bigQueryCustomerId,
                customQuery: dashboardQuery,
            });
        }

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance } = data[0];

        console.log(metrics_by_date)
        return (
            <EmailDashboard
                customerId={customerId}
                initialData={{ metrics_by_date, top_campaigns, campaigns_by_date, campaign_performance }}
                customerName={customerName}
                emailType={emailType}
            />
        );
    } catch (error) {
        console.error("Email Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Email dashboard - {error.message}</div>;
    }
}