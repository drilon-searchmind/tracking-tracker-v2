import PaceReport from "./pace-report";
import { fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Helper function to merge Shopify, Facebook Ads, and Google Ads data for Pace Report
 */
function mergePaceReportData(shopifyMetrics, facebookAdsData, googleAdsData) {
    const dataByDate = {};

    // Process Shopify data
    shopifyMetrics.forEach(row => {
        dataByDate[row.date] = {
            date: row.date,
            orders: row.orders || 0,
            revenue: row.revenue || 0,
            ad_spend: 0,
        };
    });

    // Add Facebook Ads data
    facebookAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                orders: 0,
                revenue: 0,
                ad_spend: 0,
            };
        }
        dataByDate[row.date].ad_spend += row.ps_cost || 0;
    });

    // Add Google Ads data
    googleAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                orders: 0,
                revenue: 0,
                ad_spend: 0,
            };
        }
        dataByDate[row.date].ad_spend += row.ppc_cost || 0;
    });

    const result = Object.values(dataByDate);
    return result.sort((a, b) => a.date.localeCompare(b.date));
}

export default async function PacePage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

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
            fetchShopifyOrderMetrics(shopifyConfig).catch(err => {
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
        const daily_metrics = mergePaceReportData(shopifyMetrics, facebookAdsData, googleAdsData);

        console.log(`[Pace Report] Fetched ${daily_metrics.length} days of initial data for ${customerId}`);

        return (
            <PaceReport
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={{ daily_metrics }}
            />
        );
    } catch (error) {
        console.error("Pace Report error:", error.message, error.stack);
        return <div>Error: Failed to load Pace Report - {error.message}</div>;
    }
}