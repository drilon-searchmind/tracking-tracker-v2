import ShareOfSearch from "./share-of-search";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function SEODashboardPage({ params }) {
    const customerId = "airbyte_humdakin_dk";
    const projectId = `performance-dashboard-airbyte`;

    try {
        const dashboardQuery = `
            WITH raw_data AS (
                SELECT
                    date,
                    page,
                    query,
                    clicks,
                    impressions,
                    ctr,
                    position
                FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "airbyte_")}.gsc_search_analytics_all_fields\`
            ),
            metrics AS (
                SELECT
                    SUM(clicks) AS clicks,
                    SUM(impressions) AS impressions,
                    CAST(
                        CASE
                            WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                            ELSE 0
                        END AS FLOAT64
                    ) AS ctr,
                    CAST(AVG(CAST(position AS FLOAT64)) AS FLOAT64) AS avg_position
                FROM raw_data
            ),
            impressions_by_date AS (
                SELECT
                    CAST(date AS STRING) AS date,
                    SUM(impressions) AS impressions
                FROM raw_data
                GROUP BY date
                ORDER BY date
            ),
            top_keywords AS (
                SELECT
                    query AS keyword,
                    SUM(clicks) AS clicks,
                    SUM(impressions) AS impressions,
                    AVG(CAST(position AS FLOAT64)) AS position
                FROM raw_data
                GROUP BY query
                ORDER BY clicks DESC
                LIMIT 5
            ),
            top_urls AS (
                SELECT
                    page AS url,
                    SUM(clicks) AS clicks,
                    SUM(impressions) AS impressions,
                    CAST(
                        CASE
                            WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions)
                            ELSE 0
                        END AS FLOAT64
                    ) AS ctr
                FROM raw_data
                GROUP BY page
                ORDER BY clicks DESC
                LIMIT 20
            ),
            urls_by_date AS (
                SELECT
                    CAST(r.date AS STRING) AS date,
                    r.page AS url,
                    SUM(r.clicks) AS clicks,
                    SUM(r.impressions) AS impressions,
                    CAST(
                        CASE
                            WHEN SUM(r.impressions) > 0 THEN SUM(r.clicks) / SUM(r.impressions)
                            ELSE 0
                        END AS FLOAT64
                    ) AS ctr
                FROM raw_data r
                INNER JOIN top_urls t
                    ON r.page = t.url
                GROUP BY r.date, r.page
                ORDER BY r.date, clicks DESC
            ),
            keywords_by_date AS (
                SELECT
                    CAST(r.date AS STRING) AS date,
                    r.query AS keyword,
                    SUM(r.clicks) AS clicks,
                    SUM(r.impressions) AS impressions,
                    CAST(
                        CASE
                            WHEN SUM(r.impressions) > 0 THEN SUM(r.clicks) / SUM(r.impressions)
                            ELSE 0
                        END AS FLOAT64
                    ) AS ctr
                FROM raw_data r
                INNER JOIN top_keywords t
                    ON r.query = t.keyword
                GROUP BY r.date, r.query
                ORDER BY r.date, clicks DESC
            )
            SELECT
                (SELECT AS STRUCT * FROM metrics) AS metrics,
                (SELECT ARRAY_AGG(STRUCT(date, impressions)) FROM impressions_by_date) AS impressions_data,
                (SELECT ARRAY_AGG(STRUCT(keyword, clicks, impressions, position)) FROM top_keywords) AS top_keywords,
                (SELECT ARRAY_AGG(STRUCT(url, clicks, impressions, ctr)) FROM top_urls) AS top_urls,
                (SELECT ARRAY_AGG(STRUCT(date, url, clicks, impressions, ctr)) FROM urls_by_date) AS urls_by_date,
                (SELECT ARRAY_AGG(STRUCT(date, keyword, clicks, impressions, ctr)) FROM keywords_by_date) AS keywords_by_date
        `;

        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId,
            customQuery: dashboardQuery,
        });

        console.log("SEO Dashboard data:", JSON.stringify(data, null, 2));

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { metrics, impressions_data, top_keywords, top_urls, urls_by_date, keywords_by_date } = data[0];

        return (
            <ShareOfSearch
                customerId={customerId}
                initialData={{ metrics, impressions_data, top_keywords, top_urls, urls_by_date, keywords_by_date }}
            />
        );
    } catch (error) {
        console.error("SEO Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load SEO dashboard - {error.message}</div>;
    }
}