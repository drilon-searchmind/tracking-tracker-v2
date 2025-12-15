/**
 * Google Ads API Integration using Official Client Library
 * Fetch ad spend data for a given date range
 */

import { GoogleAdsApi } from 'google-ads-api';

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
        console.log(`Fetched Google Ads data: ${result.length} days with total cost`);
        return result;

    } catch (error) {
        console.error('Error fetching Google Ads data:', error);
        throw new Error(`Failed to fetch Google Ads data: ${error.message}`);
    }
}
