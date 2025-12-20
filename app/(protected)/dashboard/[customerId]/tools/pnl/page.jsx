import PnLDashboard from "./pnl-dashboard";
import { fetchShopifySalesAnalytics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import StaticExpenses from "@/models/StaticExpenses";
import { dbConnect } from "@/lib/dbConnect";

export const revalidate = 3600; // ISR: Revalidate every hour

function mergePnLData(salesData, facebookAdsData, googleAdsData) {
    const dataByDate = {};

    // Process Shopify sales data (from ShopifyQL)
    salesData.forEach(row => {
        dataByDate[row.day] = {
            date: row.day,
            net_sales: parseFloat(row.net_sales) || 0,
            gross_sales: parseFloat(row.total_sales) || 0,
            total_discounts: parseFloat(row.total_discounts) || 0,
            total_refunds: parseFloat(row.total_refunds) || 0,
            shipping_fees: parseFloat(row.shipping_fees) || 0,
            total_taxes: parseFloat(row.total_taxes) || 0,
            orders: parseInt(row.orders) || 0,
            marketing_spend_facebook: 0,
            marketing_spend_google: 0,
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
            };
        }
        dataByDate[row.date].marketing_spend_facebook += row.ps_cost || 0;
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
            };
        }
        dataByDate[row.date].marketing_spend_google += row.ppc_cost || 0;
    });

    const result = Object.values(dataByDate);
    return result.sort((a, b) => a.date.localeCompare(b.date));
}

export default async function PnLPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        await dbConnect(); // Ensure database connection

        const { customerName, customerValutaCode, customerRevenueType, shopifyUrl, shopifyApiPassword, facebookAdAccountId, googleAdsCustomerId, customerMetaID } = await fetchCustomerDetails(customerId);

        // Fetch static expenses for the customer
        let staticExpenses = {
            cogs_percentage: 0,
            shipping_cost_per_order: 0,
            transaction_cost_percentage: 0,
            marketing_bureau_cost: 0,
            marketing_tooling_cost: 0,
            fixed_expenses: 0,
        };

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

            const apiUrl = `${baseUrl}/api/config-static-expenses-v2/${customerId}`; // Ensure absolute URL
            const response = await fetch(apiUrl);

            if (response.ok) {
                const text = await response.text();

                if (text && text.trim()) {
                    try {
                        const result = JSON.parse(text);

                        if (result?.data) {
                            staticExpenses = result.data;
                        } else if (result && typeof result === "object" && result.cogs_percentage !== undefined) {
                            staticExpenses = result;
                        }

                        console.log("Fetched static expenses for customer ID:", customerId, staticExpenses);
                    } catch (parseErr) {
                        console.error("Error parsing static expenses JSON:", parseErr, "raw:", text);
                    }
                }
            } else {
                console.error("Failed to fetch static expenses:", response.status);
            }
        } catch (error) {
            console.error("Error fetching static expenses:", error);
        }

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

        // Fetch initial data (last 30 days) in parallel
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

        const formattedStaticExpenses = {
            cogs_percentage: staticExpenses?.cogs_percentage || 0,
            shipping_cost_per_order: staticExpenses?.shipping_cost_per_order || 0,
            transaction_cost_percentage: staticExpenses?.transaction_cost_percentage || 0,
            marketing_bureau_cost: staticExpenses?.marketing_bureau_cost || 0,
            marketing_tooling_cost: staticExpenses?.marketing_tooling_cost || 0,
            fixed_expenses: staticExpenses?.fixed_expenses || 0,
        };

        console.log("Formatted Static Expenses:", formattedStaticExpenses);

        // Merge all data sources (use salesData from the result)
        const metrics_by_date = mergePnLData(salesResult.salesData, facebookAdsData, googleAdsData);

        console.log(`[PnL Dashboard] Fetched ${metrics_by_date.length} days of initial data for ${customerId}`);

        return (
            <PnLDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                customerRevenueType={customerRevenueType}
                initialData={{
                    metrics_by_date: metrics_by_date || [],
                    staticExpenses: formattedStaticExpenses // Pass formatted static expenses
                }}
            />
        );
    } catch (error) {
        console.error("PnL Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load PnL Dashboard - {error.message}</div>;
    }
}