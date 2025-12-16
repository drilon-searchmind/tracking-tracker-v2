import { NextResponse } from "next/server";
import { fetchShopifyPnLMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

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

/**
 * GET /api/pnl-dashboard/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch P&L dashboard data for a specific date range
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

        console.log(`[API] Fetching P&L data for ${customerId} from ${startDate} to ${endDate}`);

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
            adAccountId: facebookAdAccountId || process.env.TEMP_FACEBOOK_AD_ACCOUNT_ID,
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
        const data = mergePnLData(shopifyMetrics, facebookAdsData, googleAdsData);

        console.log(`[API] Successfully fetched ${data.length} days of P&L data`);

        return NextResponse.json({ data });

    } catch (error) {
        console.error("[API] P&L dashboard error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
