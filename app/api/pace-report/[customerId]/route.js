import { NextResponse } from "next/server";
import { fetchShopifySalesAnalytics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

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
export async function GET(req, { params }) {
    const { customerId } = params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
        const {
            shopifyUrl,
            shopifyApiPassword,
            facebookAdAccountId,
            googleAdsCustomerId,
            customerMetaID
        } = await fetchCustomerDetails(customerId);

        const shopifyConfig = {
            shopUrl: shopifyUrl || process.env.TEMP_SHOPIFY_URL,
            accessToken: shopifyApiPassword || process.env.TEMP_SHOPIFY_PASSWORD,
            startDate,
            endDate
        };

        const facebookConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate,
            endDate,
            countryCode: customerMetaID || undefined
        };

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

        const [salesResult, facebookAdsData, googleAdsData] = await Promise.all([
            fetchShopifySalesAnalytics(shopifyConfig).catch(err => {
                console.error("Failed to fetch Shopify sales data:", err.message);
                return { salesData: [], totals: {}, columns: [] };
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

        const dataByDate = {};

        // Process Shopify sales data
        salesResult.salesData.forEach(row => {
            dataByDate[row.day] = {
                date: row.day,
                orders: parseInt(row.orders) || 0,
                revenue: parseFloat(row.total_sales) || 0,
                net_sales: parseFloat(row.net_sales) || 0,
                ad_spend_fb: 0,
                ad_spend_google: 0,
            };
        });

        // Add Facebook Ads data
        facebookAdsData.forEach(row => {
            if (!dataByDate[row.date]) {
                dataByDate[row.date] = {
                    date: row.date,
                    orders: 0,
                    revenue: 0,
                    ad_spend_fb: 0,
                    ad_spend_google: 0,
                };
            }
            dataByDate[row.date].ad_spend_fb += row.ps_cost || 0;
        });

        // Add Google Ads data
        googleAdsData.forEach(row => {
            if (!dataByDate[row.date]) {
                dataByDate[row.date] = {
                    date: row.date,
                    orders: 0,
                    revenue: 0,
                    ad_spend_fb: 0,
                    ad_spend_google: 0,
                };
            }
            dataByDate[row.date].ad_spend_google += row.ppc_cost || 0;
        });

        const result = Object.values(dataByDate).sort((a, b) => a.date.localeCompare(b.date));

        return new Response(JSON.stringify({ daily_metrics: result }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error in Pace Report API:", error.message);
        return new Response(JSON.stringify({ error: "Failed to fetch Pace Report data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
