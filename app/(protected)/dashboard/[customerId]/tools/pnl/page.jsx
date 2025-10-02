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
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId;

        const dashboardQuery = `
    WITH shopify_data AS (
        SELECT
            date,
            SUM(COALESCE(amount, 0)) AS net_sales,
            COUNT(*) AS orders
        FROM (
            SELECT
                CAST(DATE(created_at) AS STRING) AS date,
                amount
            FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.shopify_transactions\`
            WHERE status = 'SUCCESS' AND kind = 'AUTHORIZATION'
        ) t
        GROUP BY date
    ),
    facebook_data AS (
        SELECT
            CAST(date_start AS STRING) AS date,
            SUM(COALESCE(spend, 0)) AS marketing_spend_facebook
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.meta_ads_insights\`
        WHERE date_start IS NOT NULL
        GROUP BY date_start
    ),
    google_ads_data AS (
        SELECT
            CAST(segments_date AS STRING) AS date,
            SUM(COALESCE(metrics_cost_micros / 1000000.0, 0)) AS marketing_spend_google
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.google_ads_campaign\`
        WHERE segments_date IS NOT NULL
        GROUP BY segments_date
    ),
    /* email_data AS (
        -- No cost metric in campaigns table; uncomment and replace 'cost' with actual column if available
        SELECT
            CAST(sdate AS STRING) AS date,
            SUM(COALESCE(cost, 0)) AS marketing_spend_email
        FROM \`${projectId}.${bigQueryCustomerId.replace("airbyte_", "")}.klaviyo_campaigns\`
        WHERE sdate IS NOT NULL
        GROUP BY sdate
    ), */
    combined_metrics AS (
        SELECT
            COALESCE(s.date, f.date, g.date) AS date,
            COALESCE(s.net_sales, 0) AS net_sales,
            COALESCE(s.orders, 0) AS orders,
            COALESCE(f.marketing_spend_facebook, 0) AS marketing_spend_facebook,
            COALESCE(g.marketing_spend_google, 0) AS marketing_spend_google,
            COALESCE(f.marketing_spend_facebook, 0) + COALESCE(g.marketing_spend_google, 0) AS total_marketing_spend
            /* Add COALESCE(e.marketing_spend_email, 0) to total_marketing_spend if email_data is included */
        FROM shopify_data s
        FULL OUTER JOIN facebook_data f ON s.date = f.date
        FULL OUTER JOIN google_ads_data g ON s.date = g.date
        /* FULL OUTER JOIN email_data e ON s.date = e.date */
    )
    SELECT
        ARRAY_AGG(STRUCT(
            date,
            net_sales,
            orders,
            total_marketing_spend,
            marketing_spend_facebook,
            marketing_spend_google
            /* , marketing_spend_email */
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
            orders: Number(row.orders || 0),
            total_marketing_spend: Number(row.total_marketing_spend || 0),
            marketing_spend_facebook: Number(row.marketing_spend_facebook || 0),
            marketing_spend_google: Number(row.marketing_spend_google || 0),
        }));

        return (
            <PnLDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics_by_date: serializedMetricsByDate, staticExpenses }}
            />
        );
    } catch (error) {
        console.error("P&L Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load P&L dashboard - {error.message}</div>;
    }
}