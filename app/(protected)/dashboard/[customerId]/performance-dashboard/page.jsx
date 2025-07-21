import React from "react";
import PerformanceDashboard from "./performance-dashboard";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function DashboardPage({ params }) {
  const customerId = "airbyte_humdakin_dk";
  const projectId = `performance-dashboard-airbyte`;

  try {
    const dashboardQuery = `
      WITH orders_data AS (
        SELECT
          CAST(DATE(updated_at) AS STRING) as date,
          CAST(SUM(current_total_price) AS FLOAT64) as revenue,
          CAST(SUM(current_subtotal_price - total_discounts) AS FLOAT64) as gross_profit,
          COUNT(id) as order_count,
          COUNT(id) as unique_customers
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.orders\`
        WHERE DATE(updated_at) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
        GROUP BY date
      ),
      ads_data AS (
        SELECT
          CAST(segments_date AS STRING) as date,
          CAST(SUM(metrics_cost_micros) / 1000000 AS FLOAT64) as google_ads_cost,
          SUM(metrics_impressions) as google_ads_impressions
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.campaign\`
        WHERE segments_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
        GROUP BY date
      ),
      meta_data AS (
        SELECT
          CAST(date_start AS STRING) as date,
          CAST(SUM(spend) AS FLOAT64) as meta_spend,
          SUM(impressions) as meta_impressions
        FROM \`${projectId}.airbyte_${customerId.replace("airbyte_", "")}.ads_insights\`
        WHERE date_start BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
        GROUP BY date
      ),
      combined_data AS (
        SELECT
          COALESCE(o.date, a.date, m.date) as date,
          o.revenue,
          o.gross_profit,
          o.order_count,
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
            WHEN o.unique_customers > 0
            THEN (COALESCE(a.google_ads_cost, 0) + COALESCE(m.meta_spend, 0)) / o.unique_customers
            ELSE 0
          END as cac,
          CASE
            WHEN o.order_count > 0
            THEN o.revenue / o.order_count
            ELSE 0
          END as aov,
          COALESCE(a.google_ads_impressions, 0) + COALESCE(m.meta_impressions, 0) as total_impressions
        FROM orders_data o
        FULL OUTER JOIN ads_data a ON o.date = a.date
        FULL OUTER JOIN meta_data m ON o.date = m.date
        WHERE COALESCE(o.date, a.date, m.date) IS NOT NULL
      )
      SELECT
        date,
        revenue,
        gross_profit,
        order_count as orders,
        total_cost as cost,
        roas,
        poas,
        cac,
        aov,
        total_impressions as impressions
      FROM combined_data
      ORDER BY date
    `;

    const data = await queryBigQueryDashboardMetrics({
      tableId: projectId,
      customerId,
      customQuery: dashboardQuery,
    });

    // console.log("Dashboard data:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No data returned from BigQuery for customerId:", customerId);
      return <div>No data available for {customerId}</div>;
    }

    return (
      <PerformanceDashboard
        customerId={customerId}
        initialData={data}
      />
    );
  } catch (error) {
    console.error("Dashboard error:", error.message, error.stack);
    return <div>Error: Failed to load dashboard - {error.message}</div>;
  }
}