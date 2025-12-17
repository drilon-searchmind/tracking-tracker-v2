import { NextResponse } from "next/server";
import { fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

/**
 * Helper function to merge Shopify, Facebook Ads, and Google Ads data
 */
function mergePerformanceData(shopifyMetrics, facebookAdsData, googleAdsData) {
    const dataByDate = {};

    // Process Shopify data
    shopifyMetrics.forEach(row => {
        dataByDate[row.date] = {
            date: row.date,
            revenue: row.revenue || 0,
            gross_profit: (row.revenue || 0) * 0.3, // 30% gross profit margin
            orders: row.orders || 0,
            google_ads_cost: 0,
            meta_spend: 0,
            cost: 0,
            impressions: 0,
            channel_sessions: []
        };
    });

    // Add Facebook Ads data
    facebookAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                revenue: 0,
                gross_profit: 0,
                orders: 0,
                google_ads_cost: 0,
                meta_spend: 0,
                cost: 0,
                impressions: 0,
                channel_sessions: []
            };
        }
        dataByDate[row.date].meta_spend = row.ps_cost || 0;
        dataByDate[row.date].cost += row.ps_cost || 0;
    });

    // Add Google Ads data
    googleAdsData.forEach(row => {
        if (!dataByDate[row.date]) {
            dataByDate[row.date] = {
                date: row.date,
                revenue: 0,
                gross_profit: 0,
                orders: 0,
                google_ads_cost: 0,
                meta_spend: 0,
                cost: 0,
                impressions: 0,
                channel_sessions: []
            };
        }
        dataByDate[row.date].google_ads_cost = row.ppc_cost || 0;
        dataByDate[row.date].cost += row.ppc_cost || 0;
    });

    // Calculate derived metrics for each day
    const result = Object.values(dataByDate).map(row => ({
        ...row,
        roas: row.cost > 0 ? row.revenue / row.cost : 0,
        poas: row.cost > 0 ? row.gross_profit / row.cost : 0,
        aov: row.orders > 0 ? row.revenue / row.orders : 0,
    }));

    return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * GET /api/performance-dashboard/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch performance dashboard data for a specific date range
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

        console.log(`[API] Fetching performance data for ${customerId} from ${startDate} to ${endDate}`);

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
        const data = mergePerformanceData(shopifyMetrics, facebookAdsData, googleAdsData);

        console.log(`[API] Successfully fetched ${data.length} days of performance data`);

        return NextResponse.json({ data });

    } catch (error) {
        console.error("[API] Performance dashboard error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
