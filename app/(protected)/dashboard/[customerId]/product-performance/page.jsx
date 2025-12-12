import ProductPerformanceDashboard from "./product-performance";
import { queryBigQueryGoogleAdsDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

// Helper function to serialize BigQuery data for client components
function serializeBigQueryData(data) {
    if (!data) return data;
    
    if (Array.isArray(data)) {
        return data.map(item => serializeBigQueryData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
        const serialized = {};
        for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === 'object' && 'value' in value) {
                // This is likely a BigQuery date/datetime object
                serialized[key] = value.value;
            } else if (value && typeof value === 'object' && value.constructor === Object) {
                serialized[key] = serializeBigQueryData(value);
            } else if (Array.isArray(value)) {
                serialized[key] = serializeBigQueryData(value);
            } else {
                serialized[key] = value;
            }
        }
        return serialized;
    }
    
    return data;
}

export default async function ProductPerformancePage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName, customerMetaID, customerMetaIDExclude, customerValutaCode, customerType } = await fetchCustomerDetails(customerId);
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

        const productPerformanceQuery = `
            WITH combined_data AS (
                SELECT
                    COALESCE(s.date, a.date, m.date, sess.date) as date,
                    s.revenue,
                    s.gross_profit,
                    s.order_count,
                    COALESCE(a.google_ads_cost, 0) as google_ads_cost,
                    COALESCE(m.meta_spend, 0) as meta_spend,
                    COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0) as total_cost,
                    CASE
                        WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
                        THEN s.revenue / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
                        ELSE 0
                    END as roas,
                    CASE
                        WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
                        THEN s.gross_profit / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
                        ELSE 0
                    END as poas,
                    CASE
                        WHEN s.order_count > 0
                        THEN s.revenue / s.order_count
                        ELSE 0
                    END as aov,
                    COALESCE(a.google_ads_impressions, 0) + COALESCE(m.meta_impressions, 0) as total_impressions,
                    ARRAY_AGG(STRUCT(sess.channel_group, sess.sessions) IGNORE NULLS) as channel_sessions
                FROM (
                    ${customerType === "Shopify" ? `
                    WITH orders AS (
                        SELECT
                            DATE(DATETIME(created_at, "Europe/Copenhagen")) AS date,
                            SUM(CAST(total_price AS FLOAT64)) AS gross_sales,
                            SUM(CAST(total_price AS FLOAT64)) AS net_sales,
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
                        CAST(o.date AS STRING) as date,
                        o.order_count AS orders,
                        o.gross_sales AS gross_revenue,
                        o.net_sales - COALESCE(r.total_refunds, 0) AS revenue,
                        o.net_sales - COALESCE(r.total_refunds, 0) AS gross_profit,
                        o.order_count,
                        o.currency AS presentment_currency
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                    ` : `
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
                        CAST(o.date AS STRING) as date,
                        o.order_count AS orders,
                        o.gross_sales AS gross_revenue,
                        o.gross_sales - COALESCE(r.total_refunds, 0) AS revenue,
                        o.gross_sales - COALESCE(r.total_refunds, 0) AS gross_profit,
                        o.order_count,
                        o.presentment_currency
                    FROM
                        orders o
                    LEFT JOIN
                        refunds r ON o.date = r.date
                    `}
                ) s
                FULL OUTER JOIN (
                    SELECT
                    CAST(segments_date AS STRING) as date,
                    CAST(SUM(metrics_cost_micros) / 1000000 AS FLOAT64) as google_ads_cost,
                    SUM(metrics_impressions) as google_ads_impressions
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.google_ads_campaign\`
                    GROUP BY date
                ) a ON s.date = a.date
                FULL OUTER JOIN (
                    SELECT
                    CAST(date_start AS STRING) as date,
                    CAST(SUM(spend) AS FLOAT64) as meta_spend,
                    SUM(impressions) as meta_impressions
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.meta_ads_insights_demographics_country\`
                    ${facebookWhereClause}
                    GROUP BY date
                ) m ON COALESCE(s.date, a.date) = m.date
                FULL OUTER JOIN (
                    SELECT
                    date as date,
                    sessionDefaultChannelGrouping as channel_group,
                    SUM(sessions) as sessions
                    FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.ga4_traffic_acquisition_session_default_channel_grouping_report\`
                    GROUP BY date, channel_group
                ) sess ON COALESCE(s.date, a.date, m.date) = sess.date
                WHERE COALESCE(s.date, a.date, m.date, sess.date) IS NOT NULL
                GROUP BY date, s.revenue, s.gross_profit, s.order_count, a.google_ads_cost, m.meta_spend, a.google_ads_impressions, m.meta_impressions
            ),
            order_line_items AS (
                SELECT
                    DATE(DATETIME(o.created_at, "Europe/Copenhagen")) AS order_date,
                    JSON_EXTRACT_SCALAR(line_item, '$.product_id') AS product_id,
                    JSON_EXTRACT_SCALAR(line_item, '$.variant_id') AS variant_id,
                    JSON_EXTRACT_SCALAR(line_item, '$.name') AS product_name,
                    JSON_EXTRACT_SCALAR(line_item, '$.title') AS product_title,
                    CAST(JSON_EXTRACT_SCALAR(line_item, '$.quantity') AS INT64) AS quantity,
                    CAST(JSON_EXTRACT_SCALAR(line_item, '$.price') AS FLOAT64) AS unit_price,
                    CAST(JSON_EXTRACT_SCALAR(line_item, '$.quantity') AS INT64) * CAST(JSON_EXTRACT_SCALAR(line_item, '$.price') AS FLOAT64) AS line_total,
                    o.presentment_currency,
                    o.financial_status,
                    o.id AS order_id
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_orders\` o,
                UNNEST(JSON_EXTRACT_ARRAY(o.line_items)) AS line_item
                WHERE o.created_at IS NOT NULL
                    AND JSON_EXTRACT_SCALAR(line_item, '$.product_id') IS NOT NULL
                    AND o.financial_status IN ('paid', 'authorized', 'partially_paid')
                    AND o.presentment_currency = "${customerValutaCode}"
            ),
            product_metrics AS (
                SELECT
                    oli.product_id,
                    oli.product_name,
                    oli.product_title,
                    oli.presentment_currency,
                    SUM(oli.quantity) AS total_quantity_sold,
                    COUNT(DISTINCT oli.order_id) AS total_orders,
                    SUM(oli.line_total) AS total_revenue,
                    AVG(oli.unit_price) AS avg_unit_price,
                    MAX(oli.order_date) AS last_sold_date,
                    MIN(oli.order_date) AS first_sold_date
                FROM order_line_items oli
                GROUP BY 
                    oli.product_id, 
                    oli.product_name, 
                    oli.product_title,
                    oli.presentment_currency
            ),
            product_daily_metrics AS (
                SELECT
                    oli.order_date,
                    oli.product_id,
                    oli.product_name,
                    SUM(oli.quantity) AS daily_quantity,
                    SUM(oli.line_total) AS daily_revenue,
                    COUNT(DISTINCT oli.order_id) AS daily_orders
                FROM order_line_items oli
                GROUP BY 
                    oli.order_date, 
                    oli.product_id, 
                    oli.product_name
            ),
            top_products AS (
                SELECT
                    pm.product_id,
                    pm.product_name,
                    pm.product_title,
                    pm.presentment_currency,
                    pm.total_quantity_sold,
                    pm.total_orders,
                    pm.total_revenue,
                    pm.avg_unit_price,
                    pm.last_sold_date,
                    pm.first_sold_date,
                    p.vendor,
                    p.product_type,
                    p.status,
                    JSON_EXTRACT_SCALAR(p.featured_image, '$.url') AS featured_image_url,
                    p.total_inventory,
                    p.handle,
                    CASE 
                        WHEN pm.total_revenue > 0 AND pm.total_quantity_sold > 0 
                        THEN pm.total_revenue / pm.total_quantity_sold 
                        ELSE 0 
                    END AS revenue_per_unit
                FROM product_metrics pm
                LEFT JOIN \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_products\` p
                ON pm.product_id = CAST(p.id AS STRING)
                WHERE pm.total_quantity_sold > 0
                ORDER BY pm.total_revenue DESC
                LIMIT 100
            )
            SELECT
                (SELECT ARRAY_AGG(STRUCT(
                    date,
                    revenue,
                    gross_profit,
                    order_count as orders,
                    google_ads_cost,
                    meta_spend,
                    total_cost as cost,
                    roas,
                    poas,
                    aov,
                    total_impressions as impressions,
                    channel_sessions
                )) FROM combined_data) AS dashboard_data,
                (SELECT ARRAY_AGG(STRUCT(
                    product_id,
                    product_name,
                    product_title,
                    vendor,
                    product_type,
                    status,
                    total_quantity_sold,
                    total_orders,
                    total_revenue,
                    avg_unit_price,
                    revenue_per_unit,
                    featured_image_url,
                    total_inventory,
                    handle,
                    presentment_currency,
                    last_sold_date,
                    first_sold_date
                )) FROM top_products) AS top_products,
                (SELECT ARRAY_AGG(STRUCT(
                    order_date,
                    product_id,
                    product_name,
                    daily_quantity,
                    daily_revenue,
                    daily_orders
                )) FROM product_daily_metrics) AS product_daily_metrics
        `;

        const data = await queryBigQueryGoogleAdsDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: productPerformanceQuery,
        });

        if (!data || !data[0]) {
            console.warn("No product performance data returned from BigQuery for customerId:", customerId);
            return <div>No product performance data available for {customerId}</div>;
        }

        const rawData = data[0];
        
        // Serialize the data to ensure it can be passed to client components
        const serializedData = serializeBigQueryData(rawData);

        return (
            <ProductPerformanceDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={serializedData}
            />
        );
    } catch (error) {
        console.error("Product Performance Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Product Performance dashboard - {error.message}</div>;
    }
}