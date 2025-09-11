import OverviewDashboard from "./overview-dashboard";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function OverviewPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    
    console.log("::: Fetching customer with ID:", customerId);

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        const dashboardQuery = `
    WITH shopify_data AS (
        SELECT
            DATE(processed_at) AS date,
            COUNT(*) AS orders,
            SUM(amount) AS revenue
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.shopify_transactions\`
        GROUP BY DATE(processed_at)
    ),
    facebook_data AS (
        SELECT
            date_start AS date,
            SUM(spend) AS ps_cost
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.meta_ads_insights\`
        GROUP BY date_start
    ),
    google_ads_data AS (
        SELECT
            segments_date AS date,
            SUM(metrics_cost_micros / 1000000.0) AS ppc_cost
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.google_ads_campaign\`
        GROUP BY segments_date
    ),
    combined_data AS (
        SELECT
            COALESCE(s.date, f.date, g.date) AS date,
            COALESCE(s.orders, 0) AS orders,
            COALESCE(s.revenue, 0) AS revenue,
            COALESCE(s.revenue * (1 - 0.25), 0) AS revenue_ex_tax, -- Danish VAT 25%
            COALESCE(f.ps_cost, 0) AS ps_cost,
            COALESCE(g.ppc_cost, 0) AS ppc_cost
        FROM shopify_data s
        FULL OUTER JOIN facebook_data f
            ON s.date = f.date
        FULL OUTER JOIN google_ads_data g
            ON s.date = g.date
    ),
    metrics AS (
        SELECT
            CAST(date AS STRING) AS date,
            orders,
            CAST(revenue AS FLOAT64) AS revenue,
            CAST(revenue_ex_tax AS FLOAT64) AS revenue_ex_tax,
            CAST(ppc_cost AS FLOAT64) AS ppc_cost,
            CAST(ps_cost AS FLOAT64) AS ps_cost,
            CAST((ppc_cost + ps_cost) AS FLOAT64) AS total_ad_spend,
            CAST(
                CASE
                    WHEN (ppc_cost + ps_cost) > 0 THEN revenue / (ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN (ppc_cost + ps_cost) > 0 THEN (revenue * (1 - 0.25) - revenue * 0.7) / (ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS poas, -- COGS = 70% of Revenue
            CAST(
                CASE
                    WHEN revenue_ex_tax > 0 THEN (ppc_cost + ps_cost) / revenue_ex_tax
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare,
            CAST(
                CASE
                    WHEN revenue_ex_tax > 0 THEN (ppc_cost + ps_cost) / (0.7 * revenue_ex_tax)
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare_db, -- COGS = 0.7
            CAST((revenue * (1 - 0.25) - revenue * 0.7) AS FLOAT64) AS gp, -- Gross Profit
            CAST(
                CASE
                    WHEN orders > 0 THEN revenue / orders
                    ELSE 0
                END AS FLOAT64
            ) AS aov
        FROM combined_data
        WHERE date IS NOT NULL
        ORDER BY date DESC
    ),
    totals AS (
        SELECT
            'Total' AS date,
            SUM(orders) AS orders,
            CAST(SUM(revenue) AS FLOAT64) AS revenue,
            CAST(SUM(revenue_ex_tax) AS FLOAT64) AS revenue_ex_tax,
            CAST(SUM(ppc_cost) AS FLOAT64) AS ppc_cost,
            CAST(SUM(ps_cost) AS FLOAT64) AS ps_cost,
            CAST(
                CASE
                    WHEN SUM(ppc_cost + ps_cost) > 0 THEN SUM(revenue) / SUM(ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(ppc_cost + ps_cost) > 0 THEN SUM(revenue * (1 - 0.25) - revenue * 0.7) / SUM(ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS poas,
            CAST(
                CASE
                    WHEN SUM(revenue_ex_tax) > 0 THEN SUM(ppc_cost + ps_cost) / SUM(revenue_ex_tax)
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare,
            CAST(
                CASE
                    WHEN SUM(revenue_ex_tax) > 0 THEN SUM(ppc_cost + ps_cost) / (0.7 * SUM(revenue_ex_tax))
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare_db,
            CAST(SUM(gp) AS FLOAT64) AS gp,
            CAST(
                CASE
                    WHEN SUM(orders) > 0 THEN SUM(revenue) / SUM(orders)
                    ELSE 0
                END AS FLOAT64
            ) AS aov
        FROM metrics
    ),
    last_year_metrics AS (
        SELECT
            CAST(DATE_SUB(date, INTERVAL 1 YEAR) AS STRING) AS date,
            orders,
            CAST(revenue AS FLOAT64) AS revenue,
            CAST(revenue_ex_tax AS FLOAT64) AS revenue_ex_tax,
            CAST(ppc_cost AS FLOAT64) AS ppc_cost,
            CAST(ps_cost AS FLOAT64) AS ps_cost,
            CAST((ppc_cost + ps_cost) AS FLOAT64) AS total_ad_spend,
            CAST(
                CASE
                    WHEN (ppc_cost + ps_cost) > 0 THEN revenue / (ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN (ppc_cost + ps_cost) > 0 THEN (revenue * (1 - 0.25) - revenue * 0.7) / (ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS poas,
            CAST(
                CASE
                    WHEN revenue_ex_tax > 0 THEN (ppc_cost + ps_cost) / revenue_ex_tax
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare,
            CAST(
                CASE
                    WHEN revenue_ex_tax > 0 THEN (ppc_cost + ps_cost) / (0.7 * revenue_ex_tax)
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare_db,
            CAST((revenue * (1 - 0.25) - revenue * 0.7) AS FLOAT64) AS gp,
            CAST(
                CASE
                    WHEN orders > 0 THEN revenue / orders
                    ELSE 0
                END AS FLOAT64
            ) AS aov
        FROM combined_data
        WHERE date IS NOT NULL
        ORDER BY date DESC
    ),
    last_year_totals AS (
        SELECT
            'Last Year Total' AS date,
            SUM(orders) AS orders,
            CAST(SUM(revenue) AS FLOAT64) AS revenue,
            CAST(SUM(revenue_ex_tax) AS FLOAT64) AS revenue_ex_tax,
            CAST(SUM(ppc_cost) AS FLOAT64) AS ppc_cost,
            CAST(SUM(ps_cost) AS FLOAT64) AS ps_cost,
            CAST(
                CASE
                    WHEN SUM(ppc_cost + ps_cost) > 0 THEN SUM(revenue) / SUM(ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS roas,
            CAST(
                CASE
                    WHEN SUM(ppc_cost + ps_cost) > 0 THEN SUM(revenue * (1 - 0.25) - revenue * 0.7) / SUM(ppc_cost + ps_cost)
                    ELSE 0
                END AS FLOAT64
            ) AS poas,
            CAST(
                CASE
                    WHEN SUM(revenue_ex_tax) > 0 THEN SUM(ppc_cost + ps_cost) / SUM(revenue_ex_tax)
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare,
            CAST(
                CASE
                    WHEN SUM(revenue_ex_tax) > 0 THEN SUM(ppc_cost + ps_cost) / (0.7 * SUM(revenue_ex_tax))
                    ELSE 0
                END AS FLOAT64
            ) AS spendshare_db,
            CAST(SUM(gp) AS FLOAT64) AS gp,
            CAST(
                CASE
                    WHEN SUM(orders) > 0 THEN SUM(revenue) / SUM(orders)
                    ELSE 0
                END AS FLOAT64
            ) AS aov
        FROM last_year_metrics
    )
    SELECT
        ARRAY_AGG(STRUCT(
            date,
            orders,
            revenue,
            revenue_ex_tax,
            ppc_cost,
            ps_cost,
            roas,
            poas,
            spendshare,
            spendshare_db,
            gp,
            aov
        )) AS overview_metrics,
        (SELECT AS STRUCT * FROM totals) AS totals,
        (SELECT AS STRUCT * FROM last_year_totals) AS last_year_totals
    FROM metrics
`;

        const data = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        if (!data || !data[0] || !data[0].overview_metrics) {
            console.warn("No data returned from BigQuery for customerId:", bigQueryCustomerId);
            return <div>No data available for {bigQueryCustomerId}</div>;
        }

        const { overview_metrics, totals, last_year_totals } = data[0];

        return (
            <OverviewDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ overview_metrics, totals, last_year_totals }}
            />
        );
    } catch (error) {
        console.error("Overview Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Overview dashboard - {error.message}</div>;
    }
}