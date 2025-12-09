import React from "react";
import PerformanceDashboard from "./performance-dashboard";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function DashboardPage({ params }) {
	const resolvedParams = await params;
	const customerId = resolvedParams.customerId;

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
                            DATE(created_at) AS date,
                            SUM(CAST(total_price AS FLOAT64)) AS gross_sales,
                            SUM(CAST(total_price AS FLOAT64)) AS net_sales,
                            COUNT(*) AS order_count,
                            presentment_currency AS currency
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_orders\`
                        WHERE presentment_currency = "${customerValutaCode}"
                        GROUP BY DATE(created_at), presentment_currency
                    ),
                    refunds AS (
                        SELECT
                            DATE(created_at) AS date,
                            SUM(
                                (SELECT SUM(CAST(JSON_EXTRACT_SCALAR(transaction, '$.amount') AS FLOAT64))
                                FROM UNNEST(JSON_EXTRACT_ARRAY(transactions)) AS transaction
                                WHERE JSON_EXTRACT_SCALAR(transaction, '$.kind') = 'refund'
                                    AND JSON_EXTRACT_SCALAR(transaction, '$.currency') = "${customerValutaCode}"
                                )
                            ) AS total_refunds
                        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_order_refunds\`
                        GROUP BY DATE(created_at)
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
            )
            SELECT
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
            FROM combined_data
            ORDER BY date
        `;

		const data = await queryBigQueryDashboardMetrics({
			tableId: projectId,
			customerId: bigQueryCustomerId,
			customQuery: dashboardQuery,
		});

		if (!Array.isArray(data) || data.length === 0) {
			console.warn("No data returned from BigQuery for customerId:", customerId);
			return <div>No data available for {customerId}</div>;
		}

		return (
			<PerformanceDashboard
				customerId={customerId}
				customerName={customerName}
				customerValutaCode={customerValutaCode}
				initialData={data}
			/>
		);
	} catch (error) {
		console.error("Dashboard error:", error.message, error.stack);
		return <div>Error: Failed to load dashboard - {error.message}</div>;
	}
}