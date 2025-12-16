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

/**
 * Fetch comprehensive Facebook Ads PS dashboard metrics
 * @param {Object} config - Configuration object
 * @param {string} config.accessToken - Facebook API access token
 * @param {string} config.adAccountId - Facebook Ad Account ID
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Object containing metrics_by_date, top_campaigns, and campaigns_by_date
 */
export async function fetchFacebookAdsPSDashboardMetrics({ accessToken, adAccountId, startDate, endDate }) {
    // Ensure adAccountId has the correct format (with act_ prefix)
    const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    const apiUrl = `https://graph.facebook.com/v21.0/${formattedAccountId}/insights`;

    console.log(`[Facebook API PS] Fetching data for account: ${formattedAccountId}, date range: ${startDate} to ${endDate}`);

    // Helper function to extract action values
    const getActionValue = (actions, actionType) => {
        if (!actions) return 0;
        const action = actions.find(a => a.action_type === actionType);
        return parseFloat(action?.value || 0);
    };

    try {
        // Step 1: Fetch account-level daily metrics
        console.log('[Facebook API PS] Fetching account-level daily metrics');
        const accountParams = new URLSearchParams({
            access_token: accessToken,
            time_range: JSON.stringify({
                since: startDate,
                until: endDate
            }),
            time_increment: '1',
            fields: 'spend,clicks,impressions,actions,action_values,date_start',
            level: 'account',
            limit: '1000'
        });

        const accountResponse = await fetch(`${apiUrl}?${accountParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!accountResponse.ok) {
            const errorText = await accountResponse.text();
            console.error(`[Facebook API PS] Account metrics error: ${accountResponse.status}`, errorText);
            throw new Error(`Facebook API error: ${accountResponse.status} - ${errorText}`);
        }

        const accountData = await accountResponse.json();
        if (accountData.error) {
            throw new Error(`Facebook API error: ${JSON.stringify(accountData.error)}`);
        }

        // Process account-level metrics by date
        const metrics_by_date = (accountData.data || []).map(row => {
            const conversions = getActionValue(row.actions, 'purchase') || 
                               getActionValue(row.actions, 'omni_purchase') ||
                               getActionValue(row.actions, 'offsite_conversion.fb_pixel_purchase');
            
            const conversion_value = getActionValue(row.action_values, 'purchase') || 
                                    getActionValue(row.action_values, 'omni_purchase') ||
                                    getActionValue(row.action_values, 'offsite_conversion.fb_pixel_purchase');

            const clicks = parseFloat(row.clicks || 0);
            const impressions = parseFloat(row.impressions || 0);
            const ad_spend = parseFloat(row.spend || 0);

            return {
                date: row.date_start,
                clicks,
                impressions,
                conversions,
                conversion_value,
                ad_spend,
                roas: ad_spend > 0 ? conversion_value / ad_spend : 0,
                aov: conversions > 0 ? conversion_value / conversions : 0,
                ctr: impressions > 0 ? clicks / impressions : 0,
                cpc: clicks > 0 ? ad_spend / clicks : 0,
                cpm: impressions > 0 ? (ad_spend / impressions) * 1000 : 0,
                conv_rate: clicks > 0 ? conversions / clicks : 0,
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Step 2: Fetch top campaigns (aggregated, no time breakdown to avoid timeout)
        console.log('[Facebook API PS] Fetching top campaigns');
        const campaignsParams = new URLSearchParams({
            access_token: accessToken,
            time_range: JSON.stringify({
                since: startDate,
                until: endDate
            }),
            fields: 'campaign_name,spend,clicks,impressions,actions',
            level: 'campaign',
            limit: '100'
        });

        const campaignsResponse = await fetch(`${apiUrl}?${campaignsParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!campaignsResponse.ok) {
            const errorText = await campaignsResponse.text();
            console.error(`[Facebook API PS] Campaigns error: ${campaignsResponse.status}`, errorText);
            throw new Error(`Facebook API error: ${campaignsResponse.status} - ${errorText}`);
        }

        const campaignsData = await campaignsResponse.json();
        if (campaignsData.error) {
            throw new Error(`Facebook API error: ${JSON.stringify(campaignsData.error)}`);
        }

        // Process top campaigns
        const top_campaigns = (campaignsData.data || [])
            .map(row => {
                const clicks = parseFloat(row.clicks || 0);
                const impressions = parseFloat(row.impressions || 0);
                const conversions = getActionValue(row.actions, 'purchase') || 
                                   getActionValue(row.actions, 'omni_purchase') ||
                                   getActionValue(row.actions, 'offsite_conversion.fb_pixel_purchase');

                return {
                    campaign_name: row.campaign_name || 'Unknown',
                    clicks,
                    impressions,
                    conversions,
                    ctr: impressions > 0 ? clicks / impressions : 0,
                };
            })
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);

        // Step 3: For top campaigns, fetch daily breakdown (smaller dataset)
        console.log('[Facebook API PS] Fetching daily breakdown for top campaigns');
        const topCampaignNames = top_campaigns.map(c => c.campaign_name);
        
        const campaigns_by_date = [];
        
        // Fetch each top campaign individually to avoid timeout
        for (const campaignName of topCampaignNames) {
            try {
                const campaignDailyParams = new URLSearchParams({
                    access_token: accessToken,
                    time_range: JSON.stringify({
                        since: startDate,
                        until: endDate
                    }),
                    time_increment: '1',
                    fields: 'campaign_name,spend,clicks,impressions,actions,date_start',
                    level: 'campaign',
                    filtering: JSON.stringify([{
                        field: 'campaign.name',
                        operator: 'EQUAL',
                        value: campaignName
                    }]),
                    limit: '1000'
                });

                const dailyResponse = await fetch(`${apiUrl}?${campaignDailyParams.toString()}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (dailyResponse.ok) {
                    const dailyData = await dailyResponse.json();
                    if (!dailyData.error && dailyData.data) {
                        dailyData.data.forEach(row => {
                            const clicks = parseFloat(row.clicks || 0);
                            const impressions = parseFloat(row.impressions || 0);
                            const ad_spend = parseFloat(row.spend || 0);
                            const conversions = getActionValue(row.actions, 'purchase') || 
                                               getActionValue(row.actions, 'omni_purchase') ||
                                               getActionValue(row.actions, 'offsite_conversion.fb_pixel_purchase');

                            campaigns_by_date.push({
                                date: row.date_start,
                                campaign_name: row.campaign_name || 'Unknown',
                                clicks,
                                impressions,
                                conversions,
                                ad_spend,
                                ctr: impressions > 0 ? clicks / impressions : 0,
                                conv_rate: clicks > 0 ? conversions / clicks : 0,
                                cpc: clicks > 0 ? ad_spend / clicks : 0,
                                cpm: impressions > 0 ? (ad_spend / impressions) * 1000 : 0,
                            });
                        });
                    }
                }
            } catch (error) {
                console.error(`[Facebook API PS] Error fetching daily data for campaign ${campaignName}:`, error);
                // Continue with other campaigns even if one fails
            }
        }

        // Sort campaigns by date
        campaigns_by_date.sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare !== 0) return dateCompare;
            return b.clicks - a.clicks;
        });

        console.log(`[Facebook API PS] Successfully fetched: ${metrics_by_date.length} days, ${top_campaigns.length} campaigns, ${campaigns_by_date.length} campaign-date records`);

        return {
            metrics_by_date,
            top_campaigns,
            campaigns_by_date,
        };

    } catch (error) {
        console.error('[Facebook API PS] Error fetching PS dashboard data:', error);
        throw new Error(`Failed to fetch Facebook Ads PS dashboard data: ${error.message}`);
    }
}
