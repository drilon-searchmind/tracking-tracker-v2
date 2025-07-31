import PnLDashboard from "./pnl-dashboard";
import { queryBigQueryPNLMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PnLPage({ params }) {
    const { customerId } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Initiate base URL and static expenses
    let staticExpenses = {
        cogs_percentage: 0,
        shipping_cost_per_order: 0, 
        transaction_cost_percentage: 0,
        marketing_bureau_cost: 0, 
        marketing_tooling_cost: 0,
        fixed_expenses: 0
    };

    try {
        const response = await fetch(`${baseUrl}/api/config-static-expenses/${customerId}`);
        const result = await response.json();

        if (result.data) {
            staticExpenses = {
                cogs_percentage: result.data.cogs_percentage || 0,
                shipping_cost_per_order: result.data.shipping_cost_per_order || 0,	
                transaction_cost_percentage: result.data.transaction_cost_percentage || 0,
                marketing_bureau_cost: result.data.marketing_bureau_cost || 0,
                marketing_tooling_cost: result.data.marketing_tooling_cost || 0,
                fixed_expenses: result.data.fixed_expenses || 0,
            };

            console.log("Static Expenses:", staticExpenses);
        }
    } catch (error) {
        console.error("P&L Dashboard error:", error.message, error.stack);
    }

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);
        let projectId = bigQueryProjectId

        const dashboardQuery = `
    WITH shopify_data AS (
        SELECT
            SUM(amount) AS net_sales,
            COUNT(*) AS orders
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.transactions\`
    ),
    facebook_data AS (
        SELECT
            SUM(spend) AS marketing_spend_facebook
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.ads_insights\`
    ),
    google_ads_data AS (
        SELECT
            SUM(metrics_cost_micros / 1000000.0) AS marketing_spend_google
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.campaign\`
    ),
    email_data AS (
        SELECT
            SUM(metrics_cost_micros / 1000000.0) AS marketing_spend_email
        FROM \`${projectId}.airbyte_${bigQueryCustomerId.replace("airbyte_", "")}.campaign\`
    ),
    combined_metrics AS (
        SELECT
            COALESCE(s.net_sales, 0) AS net_sales,
            COALESCE(s.orders, 0) AS orders,
            COALESCE(f.marketing_spend_facebook, 0) AS marketing_spend_facebook,
            COALESCE(g.marketing_spend_google, 0) AS marketing_spend_google,
            COALESCE(e.marketing_spend_email, 0) AS marketing_spend_email,
            COALESCE(f.marketing_spend_facebook, 0) + COALESCE(g.marketing_spend_google, 0) + COALESCE(e.marketing_spend_email, 0) AS total_marketing_spend
        FROM shopify_data s
        CROSS JOIN facebook_data f
        CROSS JOIN google_ads_data g
        CROSS JOIN email_data e
    )
    SELECT
        net_sales,
        orders,
        total_marketing_spend,
        marketing_spend_facebook,
        marketing_spend_google,
        marketing_spend_email
    FROM combined_metrics
`;

        const data = await queryBigQueryPNLMetrics({
            tableId: projectId,
            customerId: bigQueryCustomerId,
            customQuery: dashboardQuery,
        });

        console.log("P&L Dashboard data:", JSON.stringify(data, null, 2));

        if (!data || !data[0]) {
            console.warn("No data returned from BigQuery for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { net_sales, orders, total_marketing_spend, marketing_spend_facebook, marketing_spend_google, marketing_spend_email } = data[0];

        // Calculate P&L metrics
        const cogs = net_sales * staticExpenses.cogs_percentage;
        const db1 = net_sales - cogs;
        const shipping_cost = orders * staticExpenses.shipping_cost_per_order;
        const transaction_cost = net_sales * staticExpenses.transaction_cost_percentage;
        const direct_selling_costs = shipping_cost + transaction_cost;
        const db2 = db1 - direct_selling_costs;
        const marketing_costs = total_marketing_spend + staticExpenses.marketing_bureau_cost + staticExpenses.marketing_tooling_cost;
        const db3 = db2 - marketing_costs;
        const result = db3 - staticExpenses.fixed_expenses;
        const realized_roas = total_marketing_spend > 0 ? net_sales / total_marketing_spend : 0;
        const total_costs = cogs + direct_selling_costs + marketing_costs + staticExpenses.fixed_expenses;
        const break_even_roas = total_marketing_spend > 0 ? total_costs / total_marketing_spend : 0;

        // Calculate DB percentages
        const db1_percentage = total_costs > 0 ? (db1 / total_costs) * 100 : 0;
        const db2_percentage = total_costs > 0 ? (db2 / total_costs) * 100 : 0;
        const db3_percentage = total_costs > 0 ? (db3 / total_costs) * 100 : 0;

        const pnlData = {
            net_sales,
            orders,
            cogs,
            db1,
            shipping_cost,
            transaction_cost,
            db2,
            marketing_spend: total_marketing_spend,
            marketing_bureau_cost: staticExpenses.marketing_bureau_cost,
            marketing_tooling_cost: staticExpenses.marketing_tooling_cost,
            db3,
            fixed_expenses: staticExpenses.fixed_expenses,
            result,
            realized_roas,
            break_even_roas,
            db_percentages: {
                db1: db1_percentage,
                db2: db2_percentage,
                db3: db3_percentage
            }
        };

        return (
            <PnLDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={pnlData}
            />
        );
    } catch (error) {
        console.error("P&L Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load P&L dashboard - {error.message}</div>;
    }
}