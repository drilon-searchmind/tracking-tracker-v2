import React from "react";
import PerformanceDashboard from "./performance-dashboard";
import { fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Helper function to merge Shopify, Facebook Ads, and Google Ads data
 * Returns data in the format expected by the Performance Dashboard
 */
function mergePerformanceData(shopifyMetrics, facebookAdsData, googleAdsData) {
    const dataByDate = {};

    // Process Shopify data
    shopifyMetrics.forEach(row => {
        dataByDate[row.date] = {
            date: row.date,
            revenue: row.revenue || 0,
            gross_profit: (row.revenue || 0) * 0.3, // 30% gross profit margin (adjust as needed)
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

export default async function DashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, customerValutaCode, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId } = await fetchCustomerDetails(customerId);

        // Get initial date range - fetch minimal data (just last 30 days to start)
        // The component will fetch more data dynamically when user changes dates
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Yesterday
        
        // Fetch last 30 days only for initial load
        const thirtyDaysAgo = new Date(yesterday);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDateStr = formatDate(thirtyDaysAgo);
        const endDateStr = formatDate(yesterday);

        console.log("::: Fetching Performance Dashboard data from:", startDateStr, "to", endDateStr);

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

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No data returned for customerId:", customerId);
            return <div>No data available for {customerId}</div>;
        }

        console.log("::: Successfully fetched", data.length, "days of performance data");

        return (
            <PerformanceDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                initialData={data}
            />
        );
    } catch (error) {
        console.error("Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load dashboard - {error.message}</div>;
    }
}