import { fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { fetchFacebookAdsMetrics } from "@/lib/facebookAdsApi";
import { fetchGoogleAdsMetrics } from "@/lib/googleAdsApi";
import currencyExchangeData from "../../../lib/static-data/currencyApiValues.json";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "../../../models/CustomerSettings";

// Currency conversion utility
const convertCurrency = (amount, fromCurrency, toCurrency = "DKK") => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    const exchangeData = currencyExchangeData.data;
    
    if (!exchangeData[fromCurrency] || !exchangeData[toCurrency]) {
        console.warn(`Currency conversion failed: ${fromCurrency} to ${toCurrency}`);
        return amount;
    }
    
    // Convert from source currency to USD, then to target currency
    const amountInUSD = amount / exchangeData[fromCurrency].value;
    const convertedAmount = amountInUSD * exchangeData[toCurrency].value;
    
    return convertedAmount;
};

// Apply currency conversion to a data row
const convertDataRow = (row, fromCurrency, shouldConvertCurrency) => {
    if (fromCurrency === "DKK" || !shouldConvertCurrency) return row;
    
    const revenueFields = ['revenue', 'revenue_ex_tax'];
    const convertedRow = { ...row };
    
    revenueFields.forEach(field => {
        if (convertedRow[field] !== undefined && convertedRow[field] !== null) {
            convertedRow[field] = convertCurrency(convertedRow[field], fromCurrency);
        }
    });
    
    return convertedRow;
};

export async function POST(req) {
    try {
        const { childCustomers, startDate, endDate } = await req.json();

        if (!childCustomers || childCustomers.length === 0) {
            return new Response(JSON.stringify({ error: "No child customers provided" }), { status: 400 });
        }

        if (!startDate || !endDate) {
            return new Response(JSON.stringify({ error: "Both startDate and endDate must be provided" }), { status: 400 });
        }

        console.log(`[Roll-Up API] Fetching metrics for ${childCustomers.length} customers from ${startDate} to ${endDate}`);

        // Connect to database
        await dbConnect();
        
        // Fetch all customer data in parallel
        const customerDataPromises = childCustomers.map(async (customer) => {
            try {
                // Fetch customer settings
                const customerSettings = await CustomerSettings.findOne({ customer: customer._id });
                
                const shopifyUrl = customerSettings?.shopifyUrl || "";
                const shopifyApiPassword = customerSettings?.shopifyApiPassword || "";
                const facebookAdAccountId = customerSettings?.facebookAdAccountId || "";
                const googleAdsCustomerId = customerSettings?.googleAdsCustomerId || "";
                const currencyCode = customerSettings?.customerValutaCode || "DKK";
                const changeCurrency = customerSettings?.changeCurrency ?? true;

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
                    fetchShopifyOrderMetrics(shopifyConfig).catch(err => {
                        console.error(`Failed to fetch Shopify data for ${customer.name}:`, err.message);
                        return [];
                    }),
                    fetchFacebookAdsMetrics(facebookConfig).catch(err => {
                        console.error(`Failed to fetch Facebook Ads data for ${customer.name}:`, err.message);
                        return [];
                    }),
                    fetchGoogleAdsMetrics(googleAdsConfig).catch(err => {
                        console.error(`Failed to fetch Google Ads data for ${customer.name}:`, err.message);
                        return [];
                    })
                ]);

                // Merge data by date
                const dataByDate = {};

                // Process Shopify data
                shopifyMetrics.forEach(row => {
                    dataByDate[row.date] = {
                        date: row.date,
                        revenue: row.revenue || 0,
                        orders: row.orders || 0,
                        ps_cost: 0,
                        ppc_cost: 0,
                        total_ad_spend: 0,
                    };
                });

                // Add Facebook Ads data
                facebookAdsData.forEach(row => {
                    if (!dataByDate[row.date]) {
                        dataByDate[row.date] = {
                            date: row.date,
                            revenue: 0,
                            orders: 0,
                            ps_cost: 0,
                            ppc_cost: 0,
                            total_ad_spend: 0,
                        };
                    }
                    dataByDate[row.date].ps_cost = row.ps_cost || 0;
                    dataByDate[row.date].total_ad_spend += row.ps_cost || 0;
                });

                // Add Google Ads data
                googleAdsData.forEach(row => {
                    if (!dataByDate[row.date]) {
                        dataByDate[row.date] = {
                            date: row.date,
                            revenue: 0,
                            orders: 0,
                            ps_cost: 0,
                            ppc_cost: 0,
                            total_ad_spend: 0,
                        };
                    }
                    dataByDate[row.date].ppc_cost = row.ppc_cost || 0;
                    dataByDate[row.date].total_ad_spend += row.ppc_cost || 0;
                });

                // Convert to array and apply currency conversion
                const dailyData = Object.values(dataByDate).map(row => ({
                    ...row,
                    customer_id: customer._id,
                    customer_name: customer.name,
                }));

                return {
                    customer_id: customer._id,
                    customer_name: customer.name,
                    currencyCode,
                    changeCurrency,
                    dailyData
                };

            } catch (error) {
                console.error(`Error fetching data for customer ${customer.name}:`, error);
                return {
                    customer_id: customer._id,
                    customer_name: customer.name,
                    currencyCode: "DKK",
                    changeCurrency: true,
                    dailyData: []
                };
            }
        });

        const customerDataResults = await Promise.all(customerDataPromises);

        // Aggregate the data by customer
        const aggregatedMetrics = customerDataResults.map(customerData => {
            const { customer_id, customer_name, currencyCode, changeCurrency, dailyData } = customerData;

            // Sum up all daily metrics
            const totals = dailyData.reduce((acc, row) => {
                // Apply currency conversion if needed
                const revenue = changeCurrency && currencyCode !== "DKK" 
                    ? convertCurrency(row.revenue, currencyCode, "DKK")
                    : row.revenue;

                return {
                    revenue: acc.revenue + revenue,
                    orders: acc.orders + row.orders,
                    ps_cost: acc.ps_cost + row.ps_cost,
                    ppc_cost: acc.ppc_cost + row.ppc_cost,
                    total_ad_spend: acc.total_ad_spend + row.total_ad_spend,
                };
            }, { revenue: 0, orders: 0, ps_cost: 0, ppc_cost: 0, total_ad_spend: 0 });

            // Calculate derived metrics
            const roas = totals.total_ad_spend > 0 ? totals.revenue / totals.total_ad_spend : 0;
            const aov = totals.orders > 0 ? totals.revenue / totals.orders : 0;

            return {
                customer_id,
                customer_name,
                revenue: totals.revenue,
                orders: totals.orders,
                total_ad_spend: totals.total_ad_spend,
                ps_cost: totals.ps_cost,
                ppc_cost: totals.ppc_cost,
                roas,
                aov,
                days_with_data: dailyData.length
            };
        });

        console.log(`[Roll-Up API] Successfully aggregated metrics for ${aggregatedMetrics.length} customers`);

        return new Response(JSON.stringify({ customer_metrics: aggregatedMetrics }), { status: 200 });
    } catch (error) {
        console.error("Error fetching roll-up metrics:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch roll-up metrics" }), { status: 500 });
    }
}