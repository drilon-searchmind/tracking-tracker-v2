import { NextRequest } from "next/server";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const customerId = resolvedParams.customerId;
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const compStartDate = searchParams.get('compStartDate');
        const compEndDate = searchParams.get('compEndDate');

        if (!startDate || !endDate) {
            return Response.json({ error: "Start date and end date are required" }, { status: 400 });
        }

        const { bigQueryCustomerId, bigQueryProjectId, customerType, customerValutaCode } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        // Query to get time-series customer segmentation data
        const segmentationQuery = `
            WITH customer_order_history AS (
                ${customerType === "Shopify" ? `
                SELECT 
                    DATE(created_at) as order_date,
                    CAST(total_price AS FLOAT64) as order_value,
                    JSON_EXTRACT_SCALAR(customer, '$.id') as customer_id
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.shopify_orders\`
                WHERE presentment_currency = "${customerValutaCode}"
                    AND JSON_EXTRACT_SCALAR(customer, '$.id') IS NOT NULL
                    AND JSON_EXTRACT_SCALAR(customer, '$.id') != 'null'
                ` : `
                SELECT 
                    DATE(TIMESTAMP(date_created)) as order_date,
                    CAST(total AS FLOAT64) as order_value,
                    CAST(customer_id AS STRING) as customer_id
                FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "airbyte_")}.woocommerce_orders\`
                WHERE currency = "${customerValutaCode}"
                    AND customer_id IS NOT NULL
                    AND customer_id != 0
                `}
            ),
            returning_customers AS (
                SELECT DISTINCT customer_id
                FROM customer_order_history
                GROUP BY customer_id
                HAVING COUNT(*) > 1
            ),
            period_data AS (
                SELECT 
                    coh.order_date,
                    coh.order_value,
                    coh.customer_id,
                    CASE 
                        WHEN rc.customer_id IS NOT NULL THEN 'returning'
                        ELSE 'new'
                    END as customer_type
                FROM customer_order_history coh
                LEFT JOIN returning_customers rc ON coh.customer_id = rc.customer_id
                WHERE coh.order_date >= '${startDate}' 
                    AND coh.order_date <= '${endDate}'
            ),
            daily_segmentation AS (
                SELECT 
                    order_date as date,
                    customer_type,
                    SUM(order_value) as revenue,
                    COUNT(*) as orders,
                    COUNT(DISTINCT customer_id) as unique_customers
                FROM period_data
                GROUP BY order_date, customer_type
            ),
            all_dates AS (
                SELECT date
                FROM UNNEST(GENERATE_DATE_ARRAY('${startDate}', '${endDate}')) AS date
            ),
            complete_data AS (
                SELECT 
                    ad.date,
                    COALESCE(new_data.revenue, 0) as new_customer_revenue,
                    COALESCE(new_data.orders, 0) as new_customer_orders,
                    COALESCE(returning_data.revenue, 0) as returning_customer_revenue,
                    COALESCE(returning_data.orders, 0) as returning_customer_orders
                FROM all_dates ad
                LEFT JOIN (
                    SELECT date, revenue, orders 
                    FROM daily_segmentation 
                    WHERE customer_type = 'new'
                ) new_data ON ad.date = new_data.date
                LEFT JOIN (
                    SELECT date, revenue, orders 
                    FROM daily_segmentation 
                    WHERE customer_type = 'returning'
                ) returning_data ON ad.date = returning_data.date
            )
            SELECT * FROM complete_data ORDER BY date
        `;

        const currentData = await queryBigQueryDashboardMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: segmentationQuery,
        });

        // If comparison dates are provided, get comparison data
        let comparisonData = null;
        if (compStartDate && compEndDate) {
            const comparisonQuery = segmentationQuery.replace(
                `WHERE coh.order_date >= '${startDate}' 
                    AND coh.order_date <= '${endDate}'`,
                `WHERE coh.order_date >= '${compStartDate}' 
                    AND coh.order_date <= '${compEndDate}'`
            ).replace(
                `GENERATE_DATE_ARRAY('${startDate}', '${endDate}')`,
                `GENERATE_DATE_ARRAY('${compStartDate}', '${compEndDate}')`
            );

            comparisonData = await queryBigQueryDashboardMetrics({
                tableId: projectId,
                customerId: bigQueryCustomerId,
                customQuery: comparisonQuery,
            });
        }

        // Calculate summary metrics
        const calculateSummary = (data) => {
            if (!Array.isArray(data) || data.length === 0) {
                return {
                    newCustomerRevenue: 0,
                    returningCustomerRevenue: 0,
                    newCustomerOrders: 0,
                    returningCustomerOrders: 0,
                };
            }

            return {
                newCustomerRevenue: data.reduce((sum, row) => sum + (row.new_customer_revenue || 0), 0),
                returningCustomerRevenue: data.reduce((sum, row) => sum + (row.returning_customer_revenue || 0), 0),
                newCustomerOrders: data.reduce((sum, row) => sum + (row.new_customer_orders || 0), 0),
                returningCustomerOrders: data.reduce((sum, row) => sum + (row.returning_customer_orders || 0), 0),
            };
        };

        const responseData = {
            timeSeries: {
                current: currentData || [],
                comparison: comparisonData || []
            },
            summary: {
                current: calculateSummary(currentData),
                comparison: comparisonData ? calculateSummary(comparisonData) : null
            },
            period: {
                startDate,
                endDate,
                compStartDate,
                compEndDate
            }
        };

        return Response.json(responseData);

    } catch (error) {
        console.error("Customer segmentation API error:", error);
        return Response.json(
            { error: "Failed to fetch customer segmentation data", details: error.message },
            { status: 500 }
        );
    }
}