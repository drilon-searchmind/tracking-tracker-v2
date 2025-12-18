
import PnLDashboard from "./pnl-dashboard";
import { fetchShopifySalesAnalyticsWithAds } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import { dbConnect } from "@/lib/dbConnect";
import StaticExpenses from "@/models/StaticExpenses";

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Helper function to merge Shopify, Facebook Ads, and Google Ads data for P&L
 */
// No merge function needed, handled in fetchShopifySalesAnalyticsWithAds

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
        const { customerName, customerValutaCode, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId, customerMetaID } = await fetchCustomerDetails(customerId);

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
            adAccountId: facebookAdAccountId,
            startDate: startDateStr,
            endDate: endDateStr,
            countryCode: customerMetaID || undefined // Filter by country if specified
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

        // Fetch initial data (last 30 days) in parallel using ShopifyQL analytics
        const [facebookAdsData, googleAdsData] = await Promise.all([
            fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                console.error("Failed to fetch Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                console.error("Failed to fetch Google Ads data:", err.message);
                return [];
            })
        ]);

        // Use new ShopifyQL analytics with ad data merge
        const analyticsResult = await fetchShopifySalesAnalyticsWithAds(shopifyConfig, facebookAdsData, googleAdsData);
        const metrics_by_date = analyticsResult?.overview_metrics || [];

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