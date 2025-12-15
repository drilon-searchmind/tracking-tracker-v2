/**
 * Facebook Marketing API Integration
 * Fetch ad spend data for a given date range
 */

/**
 * Fetch Facebook Ads spend data for a given date range
 * @param {Object} config - Configuration object
 * @param {string} config.accessToken - Facebook API access token
 * @param {string} config.adAccountId - Facebook Ad Account ID
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of daily ad spend metrics
 */
export async function fetchFacebookAdsMetrics({ accessToken, adAccountId, startDate, endDate }) {
    // Facebook API endpoint
    const apiUrl = `https://graph.facebook.com/v21.0/act_${adAccountId}/insights`;

    // Query parameters
    const params = new URLSearchParams({
        access_token: accessToken,
        time_range: JSON.stringify({
            since: startDate,
            until: endDate
        }),
        time_increment: '1', // Daily breakdown
        fields: 'spend,date_start,date_stop',
        level: 'account',
        limit: '1000'
    });

    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Facebook API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Facebook API error: ${JSON.stringify(data.error)}`);
        }

        // Process the data into daily metrics (PS Cost instead of PPC Cost)
        const metrics = (data.data || []).map(row => ({
            date: row.date_start,
            ps_cost: parseFloat(row.spend || 0)
        }));

        console.log(`Fetched Facebook Ads data: ${metrics.length} days`);

        return metrics;

    } catch (error) {
        console.error('Error fetching Facebook Ads data:', error);
        throw error;
    }
}
