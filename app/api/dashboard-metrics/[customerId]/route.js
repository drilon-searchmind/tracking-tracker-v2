import { fetchShopifySalesAnalyticsWithAds } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export async function GET(request, { params }) {
    const { customerId } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
        return new Response(JSON.stringify({ error: 'startDate and endDate are required' }), { status: 400 });
    }

    try {
        const { customerName, customerValutaCode, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId, customerMetaID, customerRevenueType } = await fetchCustomerDetails(customerId);

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

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

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
            countryCode: customerMetaID || undefined
        };

        // Last year Facebook Ads configuration
        const lastYearFacebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate: formatDate(lastYearStartDate),
            endDate: formatDate(lastYearEndDate),
            countryCode: customerMetaID || undefined
        };

        // 2 years ago Facebook Ads configuration
        const twoYearsAgoFacebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate: formatDate(twoYearsAgoStartDate),
            endDate: formatDate(twoYearsAgoEndDate),
            countryCode: customerMetaID || undefined
        };

        // Google Ads API configuration
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
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

        // Fetch all ad platform data in parallel
        const [
            facebookAdsData, 
            googleAdsData,
            lastYearFacebookAdsData,
            lastYearGoogleAdsData,
            twoYearsAgoFacebookAdsData,
            twoYearsAgoGoogleAdsData
        ] = await Promise.all([
            fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                console.error("Failed to fetch Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                console.error("Failed to fetch Google Ads data:", err.message);
                return [];
            }),
            fetchFacebookAdsMetrics(lastYearFacebookConfig).catch(err => {
                console.error("Failed to fetch Last Year Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(lastYearGoogleAdsConfig).catch(err => {
                console.error("Failed to fetch Last Year Google Ads data:", err.message);
                return [];
            }),
            fetchFacebookAdsMetrics(twoYearsAgoFacebookConfig).catch(err => {
                console.error("Failed to fetch 2 Years Ago Facebook Ads data:", err.message);
                return [];
            }),
            fetchGoogleAdsMetrics(twoYearsAgoGoogleAdsConfig).catch(err => {
                console.error("Failed to fetch 2 Years Ago Google Ads data:", err.message);
                return [];
            })
        ]);

        // Fetch Shopify sales analytics and merge with ad platforms data
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
            return new Response(JSON.stringify({ error: 'No data available' }), { status: 404 });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Dashboard metrics API error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}