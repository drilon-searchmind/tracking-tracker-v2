import { NextResponse } from "next/server";
import { fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

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

/**
 * GET /api/pace-report/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch Pace Report data for a specific date range
 */
export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const customerId = resolvedParams.customerId;
        const { searchParams } = new URL(request.url);
        
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "startDate and endDate are required" },
                { status: 400 }
            );
        }

        console.log(`[API] Fetching Pace Report data for ${customerId} from ${startDate} to ${endDate}`);

        // Fetch customer settings from database
        await dbConnect();
        const customerSettings = await CustomerSettings.findOne({ customer: customerId });
        
        const shopifyUrl = customerSettings?.shopifyUrl || "";
        const shopifyApiPassword = customerSettings?.shopifyApiPassword || "";
        const facebookAdAccountId = customerSettings?.facebookAdAccountId || "";
        const googleAdsCustomerId = customerSettings?.googleAdsCustomerId || "";

        // Shopify API configuration
        const shopifyConfig = {
            shopUrl: shopifyUrl || process.env.TEMP_SHOPIFY_URL,
            accessToken: shopifyApiPassword || process.env.TEMP_SHOPIFY_PASSWORD,
            startDate,
            endDate
        };

        // Facebook Ads API configuration
        const facebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate,
            endDate
        };

        // Google Ads API configuration
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
            startDate,
            endDate
        };

        // Fetch all data in parallel
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
        const data = mergePaceReportData(shopifyMetrics, facebookAdsData, googleAdsData);

        console.log(`[API] Successfully fetched ${data.length} days of Pace Report data`);

        return NextResponse.json({ data });

    } catch (error) {
        console.error("[API] Pace Report error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
