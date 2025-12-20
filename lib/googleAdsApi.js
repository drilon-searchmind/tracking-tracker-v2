/**
 * Google Ads API Integration using Official Client Library
 * Fetch ad spend data for a given date range
 */

import { GoogleAdsApi } from 'google-ads-api';
import currencyExchangeData from './static-data/currencyApiValues.json';

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

/**
 * Fetch Google Ads spend data for a given date range
 * @param {Object} config - Configuration object
 * @param {string} config.developerToken - Google Ads Developer Token
 * @param {string} config.clientId - Google Ads Client ID
 * @param {string} config.clientSecret - Google Ads Client Secret
 * @param {string} config.refreshToken - Google Ads Refresh Token
 * @param {string} config.customerId - Google Ads Customer ID (e.g., '604-203-8980')
 * @param {string} config.managerCustomerId - MCC/Manager Account ID (optional, e.g., '663-503-8416')
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of daily ad spend metrics
 */
export async function fetchGoogleAdsMetrics({ 
    developerToken, 
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    managerCustomerId,
    startDate, 
    endDate 
}) {
    try {
        // Initialize Google Ads API client
        const client = new GoogleAdsApi({
            client_id: clientId,
            client_secret: clientSecret,
            developer_token: developerToken,
        });

        // Get customer client - handles account with/without dashes
        const customer = client.Customer({
            customer_id: customerId,
            refresh_token: refreshToken,
            login_customer_id: managerCustomerId || undefined,
        });

        // Fetch account currency
        const currencyQuery = `SELECT customer.currency_code FROM customer`;
        const currencyResponse = await customer.query(currencyQuery);
        const accountCurrency = currencyResponse[0]?.customer?.currency_code || 'DKK'; // Default to USD if not found

        console.log({accountCurrency});

        // Build Google Ads Query Language (GAQL) query
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                segments.date,
                metrics.cost_micros
            FROM campaign
            WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
            ORDER BY segments.date ASC
        `;

        console.log('Executing Google Ads Query:', query);

        // Execute query
        const response = await customer.query(query);

        console.log('Raw Google Ads response rows:', response.length);

        // Transform response to match expected format
        const metrics = response.map(row => ({
            date: row.segments.date,
            campaignId: row.campaign.id,
            campaignName: row.campaign.name,
            cost: row.metrics.cost_micros / 1_000_000, // Convert micros to standard currency
        }));

        // Aggregate by date
        const aggregatedMetrics = {};
        metrics.forEach(metric => {
            if (!aggregatedMetrics[metric.date]) {
                aggregatedMetrics[metric.date] = {
                    date: metric.date,
                    ppc_cost: 0,
                    campaigns: [],
                };
            }
            aggregatedMetrics[metric.date].ppc_cost += metric.cost;
            aggregatedMetrics[metric.date].campaigns.push({
                id: metric.campaignId,
                name: metric.campaignName,
                cost: metric.cost,
            });
        });

        const result = Object.values(aggregatedMetrics);

        // Convert currency to DKK if necessary
        if (accountCurrency !== 'DKK') {
            result.forEach(day => {
                day.ppc_cost = convertCurrency(day.ppc_cost, accountCurrency, 'DKK');
                day.campaigns.forEach(camp => {
                    camp.cost = convertCurrency(camp.cost, accountCurrency, 'DKK');
                });
            });
        }

        console.log(`Fetched Google Ads data: ${result.length} days with total cost`);
        return result;

    } catch (error) {
        console.error('Error fetching Google Ads data:', error);
        throw new Error(`Failed to fetch Google Ads data: ${error.message}`);
    }
}

/**
 * Fetch comprehensive Google Ads PPC dashboard metrics
 * @param {Object} config - Configuration object
 * @param {string} config.developerToken - Google Ads Developer Token
 * @param {string} config.clientId - Google Ads Client ID
 * @param {string} config.clientSecret - Google Ads Client Secret
 * @param {string} config.refreshToken - Google Ads Refresh Token
 * @param {string} config.customerId - Google Ads Customer ID (e.g., '604-203-8980')
 * @param {string} config.managerCustomerId - MCC/Manager Account ID (optional, e.g., '663-503-8416')
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Object containing metrics_by_date, top_campaigns, and campaigns_by_date
 */
export async function fetchGoogleAdsPPCDashboardMetrics({ 
    developerToken, 
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    managerCustomerId,
    startDate, 
    endDate 
}) {
    try {
        // Initialize Google Ads API client
        const client = new GoogleAdsApi({
            client_id: clientId,
            client_secret: clientSecret,
            developer_token: developerToken,
        });

        // Get customer client
        const customer = client.Customer({
            customer_id: customerId,
            refresh_token: refreshToken,
            login_customer_id: managerCustomerId || undefined,
        });

        // Fetch account currency
        const currencyQuery = `SELECT customer.currency_code FROM customer`;
        const currencyResponse = await customer.query(currencyQuery);
        const accountCurrency = currencyResponse[0]?.customer?.currency_code || 'USD'; // Default to USD if not found

        // Build Google Ads Query Language (GAQL) query for campaign metrics
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                segments.date,
                metrics.clicks,
                metrics.impressions,
                metrics.conversions,
                metrics.conversions_value,
                metrics.cost_micros
            FROM campaign
            WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
            ORDER BY segments.date ASC
        `;

        console.log('Executing Google Ads PPC Dashboard Query:', query);

        // Execute query
        const response = await customer.query(query);
        console.log('Raw Google Ads PPC response rows:', response.length);

        // Transform response
        const rawData = response.map(row => ({
            date: row.segments.date,
            campaign_name: row.campaign.name,
            campaign_id: row.campaign.id,
            clicks: row.metrics.clicks || 0,
            impressions: row.metrics.impressions || 0,
            conversions: row.metrics.conversions || 0,
            conversions_value: row.metrics.conversions_value || 0,
            ad_spend: (row.metrics.cost_micros || 0) / 1_000_000, // Convert micros to currency
        }));

        // Aggregate metrics by date
        const metricsByDateMap = {};
        rawData.forEach(row => {
            if (!metricsByDateMap[row.date]) {
                metricsByDateMap[row.date] = {
                    date: row.date,
                    clicks: 0,
                    impressions: 0,
                    conversions: 0,
                    conversions_value: 0,
                    ad_spend: 0,
                };
            }
            metricsByDateMap[row.date].clicks += row.clicks;
            metricsByDateMap[row.date].impressions += row.impressions;
            metricsByDateMap[row.date].conversions += row.conversions;
            metricsByDateMap[row.date].conversions_value += row.conversions_value;
            metricsByDateMap[row.date].ad_spend += row.ad_spend;
        });

        // Calculate derived metrics for metrics_by_date
        const metrics_by_date = Object.values(metricsByDateMap).map(m => ({
            ...m,
            roas: m.ad_spend > 0 ? m.conversions_value / m.ad_spend : 0,
            aov: m.conversions > 0 ? m.conversions_value / m.conversions : 0,
            ctr: m.impressions > 0 ? m.clicks / m.impressions : 0,
            cpc: m.clicks > 0 ? m.ad_spend / m.clicks : 0,
            conv_rate: m.clicks > 0 ? m.conversions / m.clicks : 0,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Aggregate top campaigns by total clicks
        const campaignMap = {};
        rawData.forEach(row => {
            if (!campaignMap[row.campaign_name]) {
                campaignMap[row.campaign_name] = {
                    campaign_name: row.campaign_name,
                    clicks: 0,
                    impressions: 0,
                };
            }
            campaignMap[row.campaign_name].clicks += row.clicks;
            campaignMap[row.campaign_name].impressions += row.impressions;
        });

        const top_campaigns = Object.values(campaignMap)
            .map(c => ({
                ...c,
                ctr: c.impressions > 0 ? c.clicks / c.impressions : 0,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 1000); // Limit to top 1000 campaigns

        // Get top campaign names
        const topCampaignNames = new Set(top_campaigns.map(c => c.campaign_name));

        // Filter and aggregate campaigns by date for top campaigns
        const campaignsByDateMap = {};
        rawData
            .filter(row => topCampaignNames.has(row.campaign_name))
            .forEach(row => {
                const key = `${row.date}_${row.campaign_name}`;
                if (!campaignsByDateMap[key]) {
                    campaignsByDateMap[key] = {
                        date: row.date,
                        campaign_name: row.campaign_name,
                        clicks: 0,
                        impressions: 0,
                        conversions: 0,
                        ad_spend: 0,
                    };
                }
                campaignsByDateMap[key].clicks += row.clicks;
                campaignsByDateMap[key].impressions += row.impressions;
                campaignsByDateMap[key].conversions += row.conversions;
                campaignsByDateMap[key].ad_spend += row.ad_spend;
            });

        const campaigns_by_date = Object.values(campaignsByDateMap)
            .map(c => ({
                ...c,
                ctr: c.impressions > 0 ? c.clicks / c.impressions : 0,
                conv_rate: c.clicks > 0 ? c.conversions / c.clicks : 0,
                cpc: c.clicks > 0 ? c.ad_spend / c.clicks : 0,
            }))
            .sort((a, b) => {
                const dateCompare = new Date(a.date) - new Date(b.date);
                if (dateCompare !== 0) return dateCompare;
                return b.clicks - a.clicks;
            });

        // Convert currency to DKK if necessary
        if (accountCurrency !== 'DKK') {
            metrics_by_date.forEach(m => {
                m.ad_spend = convertCurrency(m.ad_spend, accountCurrency, 'DKK');
                m.cpc = convertCurrency(m.cpc, accountCurrency, 'DKK');
            });
            campaigns_by_date.forEach(c => {
                c.ad_spend = convertCurrency(c.ad_spend, accountCurrency, 'DKK');
                c.cpc = convertCurrency(c.cpc, accountCurrency, 'DKK');
            });
        }

        console.log(`Fetched PPC Dashboard data: ${metrics_by_date.length} days, ${top_campaigns.length} campaigns`);

        return {
            metrics_by_date,
            top_campaigns,
            campaigns_by_date,
        };

    } catch (error) {
        console.error('Error fetching Google Ads PPC dashboard data:', error);
        throw new Error(`Failed to fetch Google Ads PPC dashboard data: ${error.message}`);
    }
}
