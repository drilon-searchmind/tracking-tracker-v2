import React from "react";
import PerformanceDashboard from "./performance-dashboard";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function DashboardPage({ params }) {
	const resolvedParams = await params;
	const customerId = resolvedParams.customerId;

	try {
		const { bigQueryCustomerId, bigQueryProjectId, customerName, customerMetaID, customerValutaCode, customerMetaIDExclude } = await fetchCustomerDetails(customerId);
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
			WITH orders_data AS (
				SELECT
				CAST(DATE(created_at) AS STRING) as date,
				CAST(SUM(amount) AS FLOAT64) as revenue,
				CAST(SUM(amount) AS FLOAT64) as gross_profit,
				COUNT(id) as order_count
				FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_transactions\`
				WHERE 
					status = 'SUCCESS' 
					AND kind = 'AUTHORIZATION'
					AND JSON_EXTRACT_SCALAR(total_unsettled_set, '$.presentment_money.currency') = "${customerValutaCode}"
				GROUP BY date
			),
			ads_data AS (
				SELECT
				CAST(segments_date AS STRING) as date,
				CAST(SUM(metrics_cost_micros) / 1000000 AS FLOAT64) as google_ads_cost,
				SUM(metrics_impressions) as google_ads_impressions
				FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.google_ads_campaign\`
				GROUP BY date
			),
			meta_data AS (
				SELECT
				CAST(date_start AS STRING) as date,
				CAST(SUM(spend) AS FLOAT64) as meta_spend,
				SUM(impressions) as meta_impressions
				FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.meta_ads_insights_demographics_country\`
				${facebookWhereClause}
				GROUP BY date
			),
			sessions_data AS (
				SELECT
				date as date,
				sessionDefaultChannelGrouping as channel_group,
				SUM(sessions) as sessions
				FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.ga4_traffic_acquisition_session_default_channel_grouping_report\`
				GROUP BY date, channel_group
			),
			combined_data AS (
				SELECT
				COALESCE(o.date, a.date, m.date, s.date) as date,
				o.revenue,
				o.gross_profit,
				o.order_count,
				COALESCE(a.google_ads_cost, 0) as google_ads_cost,
				COALESCE(m.meta_spend, 0) as meta_spend,
				COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0) as total_cost,
				CASE
					WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
					THEN o.revenue / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
					ELSE 0
				END as roas,
				CASE
					WHEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) > 0
					THEN o.gross_profit / (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0))
					ELSE 0
				END as poas,
				CASE
					WHEN o.order_count > 0
					THEN o.revenue / o.order_count
					ELSE 0
				END as aov,
				COALESCE(a.google_ads_impressions, 0) + COALESCE(m.meta_impressions, 0) as total_impressions,
				ARRAY_AGG(STRUCT(s.channel_group, s.sessions) IGNORE NULLS) as channel_sessions
				FROM orders_data o
				FULL OUTER JOIN ads_data a ON o.date = a.date
				FULL OUTER JOIN meta_data m ON o.date = m.date
				FULL OUTER JOIN sessions_data s ON o.date = s.date
				WHERE COALESCE(o.date, a.date, m.date, s.date) IS NOT NULL
				GROUP BY date, o.revenue, o.gross_profit, o.order_count, a.google_ads_cost, m.meta_spend, a.google_ads_impressions, m.meta_impressions
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
				initialData={data}
			/>
		);
	} catch (error) {
		console.error("Dashboard error:", error.message, error.stack);
		return <div>Error: Failed to load dashboard - {error.message}</div>;
	}
}