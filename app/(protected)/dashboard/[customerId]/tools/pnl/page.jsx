import PnLDashboard from "./pnl-dashboard";
import { fetchShopifyPnLMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import { dbConnect } from "@/lib/dbConnect";
import StaticExpenses from "@/models/StaticExpenses";

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Helper function to merge Shopify, Facebook Ads, and Google Ads data for P&L
 */
function mergePnLData(shopifyMetrics, facebookAdsData, googleAdsData) {
    const dataByDate = {};

    // Process Shopify data
    shopifyMetrics.forEach(row => {
        dataByDate[row.date] = {
            date: row.date,
            net_sales: row.net_sales || 0,
            gross_sales: row.gross_sales || 0,
            total_discounts: row.total_discounts || 0,
            total_refunds: row.total_refunds || 0,
            shipping_fees: row.shipping_fees || 0,
            total_taxes: row.total_taxes || 0,
            orders: row.orders || 0,
            marketing_spend_facebook: 0,
            marketing_spend_google: 0,
            total_marketing_spend: 0,
        };
    });

    // Add Facebook Ads data
    facebookAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                net_sales: 0,
                gross_sales: 0,
                total_discounts: 0,
                total_refunds: 0,
                shipping_fees: 0,
                total_taxes: 0,
                orders: 0,
                marketing_spend_facebook: 0,
                marketing_spend_google: 0,
                total_marketing_spend: 0,
            };
        }
        dataByDate[row.date].marketing_spend_facebook = row.ps_cost || 0;
        dataByDate[row.date].total_marketing_spend += row.ps_cost || 0;
    });

    // Add Google Ads data
    googleAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                net_sales: 0,
                gross_sales: 0,
                total_discounts: 0,
                total_refunds: 0,
                shipping_fees: 0,
                total_taxes: 0,
                orders: 0,
                marketing_spend_facebook: 0,
                marketing_spend_google: 0,
                total_marketing_spend: 0,
            };
        }
        dataByDate[row.date].marketing_spend_google = row.ppc_cost || 0;
        dataByDate[row.date].total_marketing_spend += row.ppc_cost || 0;
    });

    const result = Object.values(dataByDate);
    return result.sort((a, b) => a.date.localeCompare(b.date));
}

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
        const { customerName, customerValutaCode, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId } = await fetchCustomerDetails(customerId);

        // Calculate date range for initial data (last 30 days)
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const startDate = new Date(yesterday);
        startDate.setDate(yesterday.getDate() - 30);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(yesterday);

        // Shopify API configuration
        const shopifyConfig = {
            shopUrl: shopifyUrl || process.env.TEMP_SHOPIFY_URL,
            accessToken: shopifyApiPassword || process.env.TEMP_SHOPIFY_PASSWORD,
            startDate: startDateStr,
            endDate: endDateStr
        };

        // Facebook Ads API configuration
        const facebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId || process.env.TEMP_FACEBOOK_AD_ACCOUNT_ID,
            startDate: startDateStr,
            endDate: endDateStr
        };

        // Google Ads API configuration
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
            startDate: startDateStr,
            endDate: endDateStr
        };

        // Fetch initial data (last 30 days) in parallel
        const [shopifyMetrics, facebookAdsData, googleAdsData] = await Promise.all([
            fetchShopifyPnLMetrics(shopifyConfig).catch(err => {
                console.error("Failed to fetch Shopify data:", err.message);
                return [];
            }),
            fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                console.error("Failed to fetch Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                console.error("Failed to fetch Google Ads data:", err.message);
                return [];
            })
        ]);

        // Merge all data sources
        const metrics_by_date = mergePnLData(shopifyMetrics, facebookAdsData, googleAdsData);

        console.log(`[P&L] Fetched ${metrics_by_date.length} days of initial data for ${customerId}`);

        return (
            <PnLDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={{ metrics_by_date, staticExpenses }}
            />
        );
    } catch (error) {
        console.error("P&L Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load P&L dashboard - {error.message}</div>;
    }
}