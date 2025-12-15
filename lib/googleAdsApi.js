/**
 * Google Ads API Integration
 * Fetch ad spend data for a given date range
 */

/**
 * Fetch Google Ads spend data for a given date range
 * @param {Object} config - Configuration object
 * @param {string} config.developerToken - Google Ads Developer Token
 * @param {string} config.clientId - Google Ads Client ID
 * @param {string} config.clientSecret - Google Ads Client Secret
 * @param {string} config.refreshToken - Google Ads Refresh Token
 * @param {string} config.accessToken - Google Ads Access Token (optional, will refresh if not provided)
 * @param {string} config.customerId - Google Ads Customer ID (e.g., '806-648-1135')
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of daily ad spend metrics
 */
export async function fetchGoogleAdsMetrics({ 
    developerToken, 
    clientId, 
    clientSecret, 
    refreshToken, 
    accessToken,
    customerId, 
    startDate, 
    endDate 
}) {
    // Remove dashes from customer ID
    const customerIdClean = customerId.replace(/-/g, '');

    // Use provided access token, or refresh to get a new one
    let token = accessToken;
    if (!token) {
        console.log("No access token provided, refreshing...");
        token = await refreshAccessToken(clientId, clientSecret, refreshToken);
    }

    // Google Ads API endpoint
    const apiUrl = `https://googleads.googleapis.com/v17/customers/${customerIdClean}/googleAds:search`;

    // Convert dates to Google Ads format (YYYYMMDD)
    const startDateFormatted = startDate.replace(/-/g, '');
    const endDateFormatted = endDate.replace(/-/g, '');

    // GAQL (Google Ads Query Language) query
    const query = `
        SELECT 
            segments.date,
            metrics.cost_micros
        FROM campaign
        WHERE segments.date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
        ORDER BY segments.date ASC
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'developer-token': developerToken,
                'login-customer-id': customerIdClean,
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            // If access token expired (401), try refreshing once
            if (response.status === 401 && accessToken) {
                console.log("Access token expired, refreshing...");
                const newToken = await refreshAccessToken(clientId, clientSecret, refreshToken);
                
                // Retry the request with new token
                const retryResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                        'developer-token': developerToken,
                        'login-customer-id': customerIdClean,
                    },
                    body: JSON.stringify({ query })
                });

                if (!retryResponse.ok) {
                    const retryErrorText = await retryResponse.text();
                    throw new Error(`Google Ads API error (retry): ${retryResponse.status} - ${retryErrorText}`);
                }

                const retryData = await retryResponse.json();
                return processGoogleAdsData(retryData, startDate, endDate);
            }
            
            throw new Error(`Google Ads API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return processGoogleAdsData(data, startDate, endDate);

    } catch (error) {
        console.error('Error fetching Google Ads data:', error);
        throw error;
    }
}

/**
 * Process Google Ads API response data
 */
function processGoogleAdsData(data, startDate, endDate) {
    // Process the results
    const dailySpend = {};

    if (data.results) {
        data.results.forEach(row => {
            const date = formatDate(row.segments.date);
            const costMicros = parseInt(row.metrics.costMicros || 0);
            const cost = costMicros / 1000000; // Convert micros to currency

            if (!dailySpend[date]) {
                dailySpend[date] = 0;
            }
            dailySpend[date] += cost;
        });
    }

    // Convert to array format
    const metrics = Object.entries(dailySpend).map(([date, ppc_cost]) => ({
        date,
        ppc_cost
    }));

    console.log(`Fetched Google Ads data: ${metrics.length} days`);

    return metrics;
}

/**
 * Refresh Google Ads access token using refresh token
 * @param {string} clientId - Google Ads Client ID
 * @param {string} clientSecret - Google Ads Client Secret
 * @param {string} refreshToken - Google Ads Refresh Token
 * @returns {Promise<string>} Access token
 */
async function refreshAccessToken(clientId, clientSecret, refreshToken) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to refresh access token: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.error('Error refreshing Google Ads access token:', error);
        throw error;
    }
}

/**
 * Format date from YYYYMMDD to YYYY-MM-DD
 * @param {string} dateString - Date in YYYYMMDD format
 * @returns {string} Date in YYYY-MM-DD format
 */
function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
}
