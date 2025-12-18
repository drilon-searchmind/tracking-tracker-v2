import OverviewDashboard from "./overview-dashboard";
// import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchShopifySalesAnalyticsWithAds } from "@/lib/shopifyApi";
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
        const { customerName, customerValutaCode, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId, customerMetaID } = await fetchCustomerDetails(customerId);

        console.log("::: Customer details:", { customerName, customerValutaCode, shopifyUrl, facebookAdAccountId, googleAdsCustomerId, customerMetaID });

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

        // Calculate last year date range
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const lastYearStartDate = new Date(startDateObj);
        lastYearStartDate.setFullYear(lastYearStartDate.getFullYear() - 1);
        const lastYearEndDate = new Date(endDateObj);
        lastYearEndDate.setFullYear(lastYearEndDate.getFullYear() - 1);

        // Calculate 2 years ago date range
        const twoYearsAgoStartDate = new Date(startDateObj);
        twoYearsAgoStartDate.setFullYear(twoYearsAgoStartDate.getFullYear() - 2);
        const twoYearsAgoEndDate = new Date(endDateObj);
        twoYearsAgoEndDate.setFullYear(twoYearsAgoEndDate.getFullYear() - 2);

        // Shopify API configuration
        const shopifyConfig = {
            shopUrl: shopifyUrl || process.env.TEMP_SHOPIFY_URL,
            accessToken: shopifyApiPassword || process.env.TEMP_SHOPIFY_PASSWORD,
            startDate: startDate,
            endDate: endDate
        };

        // Facebook Ads API configuration
        const facebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate: startDate,
            endDate: endDate,
            countryCode: customerMetaID || undefined // Filter by country if specified
        };

        // Last year Facebook Ads configuration
        const lastYearFacebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate: formatDate(lastYearStartDate),
            endDate: formatDate(lastYearEndDate),
            countryCode: customerMetaID || undefined // Filter by country if specified
        };

        // 2 years ago Facebook Ads configuration
        const twoYearsAgoFacebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate: formatDate(twoYearsAgoStartDate),
            endDate: formatDate(twoYearsAgoEndDate),
            countryCode: customerMetaID || undefined // Filter by country if specified
        };

        // Google Ads API configuration with OAuth 2.0
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID, // e.g., '6042038980' (no dashes)
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID, // e.g., '6635038416' (no dashes)
            startDate: startDate,
            endDate: endDate
        };

        // Last year Google Ads configuration
        const lastYearGoogleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
            startDate: formatDate(lastYearStartDate),
            endDate: formatDate(lastYearEndDate)
        };

        // 2 years ago Google Ads configuration
        const twoYearsAgoGoogleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
            startDate: formatDate(twoYearsAgoStartDate),
            endDate: formatDate(twoYearsAgoEndDate)
        };

        console.log("::: Fetching Shopify data from:", shopifyConfig.startDate, "to", shopifyConfig.endDate);
        console.log("::: Fetching Facebook Ads data from:", facebookConfig.startDate, "to", facebookConfig.endDate);
        console.log("::: Fetching Google Ads data from:", googleAdsConfig.startDate, "to", googleAdsConfig.endDate);
        console.log("::: Fetching Last Year data from:", formatDate(lastYearStartDate), "to", formatDate(lastYearEndDate));
        console.log("::: Fetching 2 Years Ago data from:", formatDate(twoYearsAgoStartDate), "to", formatDate(twoYearsAgoEndDate));

        // Fetch all ad platform data in parallel for all periods
        const [
            facebookAdsData, 
            googleAdsData,
            lastYearFacebookAdsData,
            lastYearGoogleAdsData,
            twoYearsAgoFacebookAdsData,
            twoYearsAgoGoogleAdsData
        ] = await Promise.all([
            // Current period
            fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                console.error("Failed to fetch Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                console.error("Failed to fetch Google Ads data:", err.message);
                console.warn("⚠️  Google Ads integration is currently unavailable - continuing without it");
                return [];
            }),
            // Last year period
            fetchFacebookAdsMetrics(lastYearFacebookConfig).catch(err => {
                console.error("Failed to fetch Last Year Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(lastYearGoogleAdsConfig).catch(err => {
                console.error("Failed to fetch Last Year Google Ads data:", err.message);
                return [];
            }),
            // 2 years ago period
            fetchFacebookAdsMetrics(twoYearsAgoFacebookConfig).catch(err => {
                console.error("Failed to fetch 2 Years Ago Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(twoYearsAgoGoogleAdsConfig).catch(err => {
                console.error("Failed to fetch 2 Years Ago Google Ads data:", err.message);
                return [];
            })
        ]);

        // Fetch Shopify sales analytics and merge with all ad platforms data
        const data = await fetchShopifySalesAnalyticsWithAds(
            shopifyConfig, 
            facebookAdsData, 
            googleAdsData,
            lastYearFacebookAdsData,
            lastYearGoogleAdsData,
            twoYearsAgoFacebookAdsData,
            twoYearsAgoGoogleAdsData
        );

        if (!data || !data.overview_metrics || data.overview_metrics.length === 0) {
            console.warn("No data returned from Shopify API for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        const { overview_metrics, totals, last_year_totals, last_year_metrics, two_years_ago_totals } = data;

        console.log("::: Successfully fetched", overview_metrics.length, "days of data");

        return (
            <OverviewDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={{ overview_metrics, totals, last_year_totals, last_year_metrics, two_years_ago_totals }}
            />
        );
    } catch (error) {
        console.error("Overview Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Overview dashboard - {error.message}</div>;
    }
}