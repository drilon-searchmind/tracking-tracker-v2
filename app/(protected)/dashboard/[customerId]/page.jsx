import OverviewDashboard from "./overview-dashboard";
// import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchShopifyDashboardMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const dynamic = 'force-dynamic';

export default async function OverviewPage({ params, searchParams }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    
    const resolvedSearchParams = await searchParams;
    
    console.log("::: Fetching customer with ID:", customerId);

    try {
        const { customerName, customerValutaCode } = await fetchCustomerDetails(customerId);

        // Get dates from search params or use defaults
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = resolvedSearchParams?.startDate || formatDate(firstDayOfMonth);
        const endDate = resolvedSearchParams?.endDate || formatDate(yesterday);

        // Shopify API configuration
        const shopifyConfig = {
            shopUrl: process.env.TEMP_SHOPIFY_URL,
            accessToken: process.env.TEMP_SHOPIFY_PASSWORD,
            startDate: startDate,
            endDate: endDate
        };

        // Facebook Ads API configuration
        const facebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: process.env.TEMP_FACEBOOK_AD_ACCOUNT_ID,
            startDate: startDate,
            endDate: endDate
        };

        // Google Ads API configuration
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ADS_ACCESS_TOKEN, // Use existing access token first
            customerId: '806-648-1135',
            startDate: startDate,
            endDate: endDate
        };

        console.log("::: Fetching Shopify data from:", shopifyConfig.startDate, "to", shopifyConfig.endDate);
        console.log("::: Fetching Facebook Ads data from:", facebookConfig.startDate, "to", facebookConfig.endDate);
        console.log("::: Fetching Google Ads data from:", googleAdsConfig.startDate, "to", googleAdsConfig.endDate);

        // Fetch all ad platform data in parallel
        const [facebookAdsData, googleAdsData] = await Promise.all([
            fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                console.error("Failed to fetch Facebook Ads data:", err);
                return []; // Return empty array on error
            }),
            fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                console.error("Failed to fetch Google Ads data:", err);
                return []; // Return empty array on error
            })
        ]);

        // Fetch Shopify data and merge with both ad platforms
        const data = await fetchShopifyDashboardMetrics(shopifyConfig, facebookAdsData, googleAdsData);

        if (!data || !data.overview_metrics || data.overview_metrics.length === 0) {
            console.warn("No data returned from Shopify API for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { overview_metrics, totals, last_year_totals } = data;

        console.log("::: Successfully fetched", overview_metrics.length, "days of data");

        return (
            <OverviewDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={{ overview_metrics, totals, last_year_totals }}
            />
        );
    } catch (error) {
        console.error("Overview Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Overview dashboard - {error.message}</div>;
    }
}