import OverviewDashboard from "./overview-dashboard";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function OverviewPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    
    console.log("::: Fetching customer with ID:", customerId);

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName, customerMetaID, customerValutaCode, customerMetaIDExclude, customerType } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        console.log("::: Environment customerType:", customerType);

        const buildFacebookWhereClause = () => {
            const conditions = [];
            
            if (customerMetaID?.trim()) {
                conditions.push(`country = "${customerMetaID}"`);
            }
            
            if (customerMetaIDExclude?.trim()) {
                const excludeList = customerMetaIDExclude
                    .split(',')
                    .map(c => `"${c.trim()}"`)
                    .filter(c => c !== '""')
                    .join(', ');
                
                if (excludeList) {
                    conditions.push(`country NOT IN (${excludeList})`);
                }
            }
            
            return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        };

        const facebookWhereClause = buildFacebookWhereClause();

        const dashboardQuery = customerType === "Shopify" ? `
            WITH combined_data AS (
                SELECT
                    COALESCE(s.date, f.date, g.date) AS date,
                    COALESCE(s.orders, 0) AS orders,
                    COALESCE(s.revenue, 0) AS revenue,
                    COALESCE(s.revenue * (1 - 0.25), 0) AS revenue_ex_tax, -- Danish VAT 25%
                    COALESCE(f.ps_cost, 0) AS ps_cost,
                    COALESCE(g.ppc_cost, 0) AS ppc_cost
                FROM (
                    WITH orders AS (
                        SELECT
                            DATE(DATETIME(created_at, "Europe/Copenhagen")) AS date,
                            SUM(CAST(total_price AS FLOAT64)) AS gross_sales,
                            COUNT(*) AS order_count,
                            presentment_currency AS currency
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_orders\`
                        WHERE presentment_currency = "${customerValutaCode}"
                        GROUP BY DATE(DATETIME(created_at, "Europe/Copenhagen")), presentment_currency
                    ),
                    refunds AS (
                        SELECT
                            DATE(DATETIME(created_at, "Europe/Copenhagen")) AS date,
                            SUM(
                                (SELECT SUM(CAST(JSON_EXTRACT_SCALAR(transaction, '$.amount') AS FLOAT64))
                                FROM UNNEST(JSON_EXTRACT_ARRAY(transactions)) AS transaction
                                WHERE JSON_EXTRACT_SCALAR(transaction, '$.kind') = 'refund'
                                    AND JSON_EXTRACT_SCALAR(transaction, '$.currency') = "${customerValutaCode}"
                                )
                            ) AS total_refunds
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_order_refunds\`
                        GROUP BY DATE(DATETIME(created_at, "Europe/Copenhagen"))
                    )
                    SELECT
                        o.date,
                        COALESCE(o.order_count, 0) AS orders,
                        COALESCE(o.gross_sales, 0) AS gross_revenue,
                        COALESCE(o.gross_sales, 0) - COALESCE(r.total_refunds, 0) AS revenue,
                        COALESCE(o.currency, 'N/A') AS presentment_currency
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                ) s
                FULL OUTER JOIN (
                    SELECT
                        date_start AS date,
                        SUM(spend) AS ps_cost
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.meta_ads_insights_demographics_country\`
                    ${facebookWhereClause}
                    GROUP BY date_start
                ) f ON s.date = f.date
                FULL OUTER JOIN (
                    SELECT
                        segments_date AS date,
                        SUM(metrics_cost_micros / 1000000.0) AS ppc_cost
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.google_ads_campaign\`
                    GROUP BY segments_date
                ) g ON COALESCE(s.date, f.date) = g.date
                WHERE COALESCE(s.date, f.date, g.date) IS NOT NULL
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
            dummy_last_year_totals AS (
                SELECT
                    'Last Year Total' AS date,
                    0 AS orders,
                    CAST(0 AS FLOAT64) AS revenue,
                    CAST(0 AS FLOAT64) AS revenue_ex_tax,
                    CAST(0 AS FLOAT64) AS ppc_cost,
                    CAST(0 AS FLOAT64) AS ps_cost,
                    CAST(0 AS FLOAT64) AS roas,
                    CAST(0 AS FLOAT64) AS poas,
                    CAST(0 AS FLOAT64) AS spendshare,
                    CAST(0 AS FLOAT64) AS spendshare_db,
                    CAST(0 AS FLOAT64) AS gp,
                    CAST(0 AS FLOAT64) AS aov
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
                (SELECT AS STRUCT * FROM dummy_last_year_totals) AS last_year_totals
            FROM metrics
        ` : `
            WITH combined_data AS (
                SELECT
                    COALESCE(o.date, f.date, g.date) AS date,
                    COALESCE(o.order_count, 0) AS orders,
                    COALESCE(o.gross_sales, 0) - COALESCE(o.total_refunds, 0) AS revenue,
                    COALESCE((o.gross_sales - COALESCE(o.total_refunds, 0)) * (1 - 0.25), 0) AS revenue_ex_tax, -- Danish VAT 25%
                    COALESCE(f.ps_cost, 0) AS ps_cost,
                    COALESCE(g.ppc_cost, 0) AS ppc_cost
                FROM (
                    WITH orders AS (
                        SELECT
                            DATE(TIMESTAMP(date_created)) AS date,
                            SUM(CAST(total AS FLOAT64)) AS gross_sales,
                            COUNT(*) AS order_count,
                            currency AS presentment_currency
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.woocommerce_orders\`
                        WHERE currency = "${customerValutaCode}"
                        GROUP BY DATE(TIMESTAMP(date_created)), currency
                    ),
                    refunds AS (
                        SELECT
                            DATE(TIMESTAMP(date_created)) AS date,
                            SUM(CAST(amount AS FLOAT64)) AS total_refunds
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.woocommerce_refunds\`
                        GROUP BY DATE(TIMESTAMP(date_created))
                    )
                    SELECT
                        o.date,
                        COALESCE(o.order_count, 0) AS order_count,
                        COALESCE(o.gross_sales, 0) AS gross_sales,
                        COALESCE(r.total_refunds, 0) AS total_refunds,
                        COALESCE(o.presentment_currency, 'N/A') AS presentment_currency
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                ) o
                FULL OUTER JOIN (
                    SELECT
                        date_start AS date,
                        SUM(spend) AS ps_cost
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.meta_ads_insights_demographics_country\`
                    ${facebookWhereClause}
                    GROUP BY date_start
                ) f ON o.date = f.date
                FULL OUTER JOIN (
                    SELECT
                        segments_date AS date,
                        SUM(metrics_cost_micros / 1000000.0) AS ppc_cost
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.google_ads_campaign\`
                    GROUP BY segments_date
                ) g ON COALESCE(o.date, f.date) = g.date
                WHERE COALESCE(o.date, f.date, g.date) IS NOT NULL
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
            dummy_last_year_totals AS (
                SELECT
                    'Last Year Total' AS date,
                    0 AS orders,
                    CAST(0 AS FLOAT64) AS revenue,
                    CAST(0 AS FLOAT64) AS revenue_ex_tax,
                    CAST(0 AS FLOAT64) AS ppc_cost,
                    CAST(0 AS FLOAT64) AS ps_cost,
                    CAST(0 AS FLOAT64) AS roas,
                    CAST(0 AS FLOAT64) AS poas,
                    CAST(0 AS FLOAT64) AS spendshare,
                    CAST(0 AS FLOAT64) AS spendshare_db,
                    CAST(0 AS FLOAT64) AS gp,
                    CAST(0 AS FLOAT64) AS aov
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
                (SELECT AS STRUCT * FROM dummy_last_year_totals) AS last_year_totals
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
                customerValutaCode={customerValutaCode}
                initialData={{ overview_metrics, totals, last_year_totals }}
            />
        );
    } catch (error) {
        console.error("Overview Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Overview dashboard - {error.message}</div>;
    }
}