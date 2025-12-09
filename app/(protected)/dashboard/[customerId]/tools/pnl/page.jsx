import PnLDashboard from "./pnl-dashboard";
import { queryBigQueryPNLMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import { dbConnect } from "@/lib/dbConnect";
import StaticExpenses from "@/models/StaticExpenses";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PnLPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    let staticExpenses = {
        cogs_percentage: 0,
        shipping_cost_per_order: 0,
        transaction_cost_percentage: 0,
        marketing_bureau_cost: 0,
        marketing_tooling_cost: 0,
        fixed_expenses: 0
    };

    try {
        await dbConnect()
        const staticExpensesData = await StaticExpenses.findOne({ customer: customerId });
        
        if (staticExpensesData) {
            staticExpenses = {
                cogs_percentage: staticExpensesData.cogs_percentage || 0,
                shipping_cost_per_order: staticExpensesData.shipping_cost_per_order || 0,
                transaction_cost_percentage: staticExpensesData.transaction_cost_percentage || 0,
                marketing_bureau_cost: staticExpensesData.marketing_bureau_cost || 0,
                marketing_tooling_cost: staticExpensesData.marketing_tooling_cost || 0,
                fixed_expenses: staticExpensesData.fixed_expenses || 0,
            };
        }
    } catch (error) {
        console.error("P&L Static Expenses error:", error.message, error.stack);
    }

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName, customerMetaID, customerValutaCode, customerMetaIDExclude, customerType } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

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

        const dashboardQuery = `
            WITH combined_metrics AS (
                SELECT
                    COALESCE(s.date, f.date, g.date) AS date,
                    COALESCE(s.net_sales, 0) AS net_sales,
                    COALESCE(s.gross_sales, 0) AS gross_sales,
                    COALESCE(s.total_discounts, 0) AS total_discounts,
                    COALESCE(s.total_refunds, 0) AS total_refunds,
                    COALESCE(s.shipping_fees, 0) AS shipping_fees,
                    COALESCE(s.total_taxes, 0) AS total_taxes,
                    COALESCE(s.orders, 0) AS orders,
                    COALESCE(f.marketing_spend_facebook, 0) AS marketing_spend_facebook,
                    COALESCE(g.marketing_spend_google, 0) AS marketing_spend_google,
                    COALESCE(f.marketing_spend_facebook, 0) + COALESCE(g.marketing_spend_google, 0) AS total_marketing_spend
                FROM (
                    ${customerType === "Shopify" ? `
                    WITH orders AS (
                        SELECT
                            DATE(created_at) AS date,
                            -- Extract billing components directly from fields
                            SUM(CAST(total_line_items_price AS FLOAT64)) AS gross_sales,
                            SUM(CAST(total_discounts AS FLOAT64)) AS total_discounts,
                            SUM(CAST(total_tax AS FLOAT64)) AS total_taxes,
                            -- Extract shipping fees from shipping_lines JSON
                            SUM(
                                (SELECT SUM(CAST(JSON_EXTRACT_SCALAR(shipping_line, '$.price') AS FLOAT64))
                                FROM UNNEST(JSON_EXTRACT_ARRAY(shipping_lines)) AS shipping_line)
                            ) AS shipping_fees,
                            SUM(CAST(total_price AS FLOAT64)) AS total_price,
                            COUNT(*) AS order_count
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_orders\`
                        WHERE presentment_currency = "${customerValutaCode}"
                        GROUP BY DATE(created_at)
                    ),
                    refunds AS (
                        SELECT
                            DATE(created_at) AS date,
                            -- Extract refund amounts from refund_line_items using proper JSON handling
                            SUM(
                                (SELECT SUM(CAST(JSON_EXTRACT_SCALAR(refund_line_item, '$.subtotal') AS FLOAT64))
                                FROM UNNEST(JSON_EXTRACT_ARRAY(refund_line_items)) AS refund_line_item)
                            ) AS total_refunds
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_order_refunds\`
                        WHERE refund_line_items IS NOT NULL 
                            AND ARRAY_LENGTH(JSON_EXTRACT_ARRAY(refund_line_items)) > 0
                        GROUP BY DATE(created_at)
                    )
                    SELECT
                        CAST(o.date AS STRING) AS date,
                        o.gross_sales,
                        o.total_discounts,
                        COALESCE(r.total_refunds, 0) AS total_refunds,
                        o.shipping_fees,
                        o.total_taxes,
                        o.total_price - COALESCE(r.total_refunds, 0) AS net_sales,
                        o.order_count AS orders
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                    ` : `
                    -- WooCommerce version (existing logic)
                    WITH orders AS (
                        SELECT
                            DATE(TIMESTAMP(date_created)) AS date,
                            SUM(CAST(total AS FLOAT64)) AS gross_sales,
                            SUM(CAST(discount_total AS FLOAT64)) AS total_discounts,
                            SUM(CAST(total_tax AS FLOAT64)) AS total_taxes,
                            SUM(CAST(shipping_total AS FLOAT64)) AS shipping_fees,
                            SUM(CAST(total AS FLOAT64)) AS total_price,
                            COUNT(*) AS order_count
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.woocommerce_orders\`
                        WHERE currency = "${customerValutaCode}"
                        GROUP BY DATE(TIMESTAMP(date_created))
                    ),
                    refunds AS (
                        SELECT
                            DATE(TIMESTAMP(date_created)) AS date,
                            SUM(CAST(amount AS FLOAT64)) AS total_refunds
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.woocommerce_refunds\`
                        GROUP BY DATE(TIMESTAMP(date_created))
                    )
                    SELECT
                        CAST(o.date AS STRING) AS date,
                        o.gross_sales,
                        o.total_discounts,
                        COALESCE(r.total_refunds, 0) AS total_refunds,
                        o.shipping_fees,
                        o.total_taxes,
                        o.total_price - COALESCE(r.total_refunds, 0) AS net_sales,
                        o.order_count AS orders
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                    `}
                ) s
                -- ...existing Facebook and Google joins...
                FULL OUTER JOIN (
                    SELECT
                        CAST(date_start AS STRING) AS date,
                        SUM(COALESCE(spend, 0)) AS marketing_spend_facebook
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.meta_ads_insights_demographics_country\`
                    ${facebookWhereClause}
                    GROUP BY date_start
                ) f ON s.date = f.date
                FULL OUTER JOIN (
                    SELECT
                        CAST(segments_date AS STRING) AS date,
                        SUM(COALESCE(metrics_cost_micros / 1000000.0, 0)) AS marketing_spend_google
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.google_ads_campaign\`
                    WHERE segments_date IS NOT NULL
                    GROUP BY segments_date
                ) g ON COALESCE(s.date, f.date) = g.date
                WHERE COALESCE(s.date, f.date, g.date) IS NOT NULL
            )
            SELECT
                ARRAY_AGG(STRUCT(
                    date,
                    net_sales,
                    gross_sales,
                    total_discounts,
                    total_refunds,
                    shipping_fees,
                    total_taxes,
                    orders,
                    total_marketing_spend,
                    marketing_spend_facebook,
                    marketing_spend_google
                ) ORDER BY date) AS metrics_by_date
            FROM combined_metrics
        `;

        const data = await queryBigQueryPNLMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        if (!data || !data[0] || !data[0].metrics_by_date) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const serializedMetricsByDate = data[0].metrics_by_date.map(row => ({
            date: row.date,
            net_sales: Number(row.net_sales || 0),
            gross_sales: Number(row.gross_sales || 0),
            total_discounts: Number(row.total_discounts || 0),
            total_refunds: Number(row.total_refunds || 0),
            shipping_fees: Number(row.shipping_fees || 0),
            total_taxes: Number(row.total_taxes || 0),
            orders: Number(row.orders || 0),
            total_marketing_spend: Number(row.total_marketing_spend || 0),
            marketing_spend_facebook: Number(row.marketing_spend_facebook || 0),
            marketing_spend_google: Number(row.marketing_spend_google || 0),
        }));

        return (
            <PnLDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={{ metrics_by_date: serializedMetricsByDate, staticExpenses }}
            />
        );
    } catch (error) {
        console.error("P&L Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load P&L dashboard - {error.message}</div>;
    }
}