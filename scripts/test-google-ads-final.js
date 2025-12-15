/**
 * Test Google Ads API Integration with Official Client Library
 * Run: node scripts/test-google-ads-final.js
 */

import { GoogleAdsApi } from 'google-ads-api';
import dotenv from 'dotenv';

dotenv.config();

async function testGoogleAdsAPI() {
    console.log('=== Testing Google Ads API with Official Client Library ===\n');

    // Get credentials from .env
    const config = {
        client_id: process.env.GOOGLE_ADS_CLIENT_ID,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    };

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID; // e.g., '604-203-8980'
    const managerCustomerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID; // e.g., '663-503-8416'
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

    console.log('Configuration:');
    console.log('- Developer Token:', config.developer_token ? `${config.developer_token.substring(0, 10)}...` : 'MISSING');
    console.log('- Client ID:', config.client_id ? `${config.client_id.substring(0, 20)}...` : 'MISSING');
    console.log('- Client Secret:', config.client_secret ? 'SET' : 'MISSING');
    console.log('- Customer ID:', customerId);
    console.log('- Manager Customer ID:', managerCustomerId);
    console.log('- Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'MISSING');
    console.log('');

    try {
        // Initialize Google Ads API client
        console.log('Step 1: Initializing Google Ads API client...');
        const client = new GoogleAdsApi(config);
        console.log('✓ Client initialized successfully\n');

        // Get customer client
        console.log('Step 2: Creating customer client...');
        const customer = client.Customer({
            customer_id: customerId,
            refresh_token: refreshToken,
            login_customer_id: managerCustomerId || undefined,
        });
        console.log('✓ Customer client created\n');

        // Test 1: List accessible customers
        console.log('Step 3: Listing accessible customers...');
        try {
            const customers = await customer.listAccessibleCustomers();
            console.log('✓ Accessible customers:');
            console.log(JSON.stringify(customers, null, 2));
            console.log('');
        } catch (error) {
            console.log('⚠ Could not list customers:', error.message);
            console.log('This is optional - continuing...\n');
        }

        // Test 2: Get campaign data for the last 7 days
        console.log('Step 4: Fetching campaign data (last 7 days)...');
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        console.log(`Date range: ${startDateStr} to ${endDateStr}`);

        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status,
                segments.date,
                metrics.cost_micros,
                metrics.impressions,
                metrics.clicks
            FROM campaign
            WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
            ORDER BY segments.date DESC
            LIMIT 10
        `;

        console.log('Query:', query);
        console.log('');

        const results = await customer.query(query);

        console.log('✓ Query executed successfully!');
        console.log(`Found ${results.length} rows\n`);

        if (results.length > 0) {
            console.log('Sample results (first 5 rows):');
            results.slice(0, 5).forEach((row, index) => {
                console.log(`\nRow ${index + 1}:`);
                console.log('  Campaign ID:', row.campaign.id);
                console.log('  Campaign Name:', row.campaign.name);
                console.log('  Campaign Status:', row.campaign.status);
                console.log('  Date:', row.segments.date);
                console.log('  Cost:', (row.metrics.cost_micros / 1_000_000).toFixed(2));
                console.log('  Impressions:', row.metrics.impressions);
                console.log('  Clicks:', row.metrics.clicks);
            });

            // Aggregate by date
            console.log('\n\nAggregated by date:');
            const aggregated = {};
            results.forEach(row => {
                const date = row.segments.date;
                if (!aggregated[date]) {
                    aggregated[date] = {
                        cost: 0,
                        impressions: 0,
                        clicks: 0,
                        campaigns: 0,
                    };
                }
                aggregated[date].cost += row.metrics.cost_micros / 1_000_000;
                aggregated[date].impressions += parseInt(row.metrics.impressions || 0);
                aggregated[date].clicks += parseInt(row.metrics.clicks || 0);
                aggregated[date].campaigns += 1;
            });

            Object.entries(aggregated)
                .sort(([a], [b]) => b.localeCompare(a))
                .forEach(([date, metrics]) => {
                    console.log(`\n${date}:`);
                    console.log(`  Campaigns: ${metrics.campaigns}`);
                    console.log(`  Total Cost: $${metrics.cost.toFixed(2)}`);
                    console.log(`  Total Impressions: ${metrics.impressions.toLocaleString()}`);
                    console.log(`  Total Clicks: ${metrics.clicks.toLocaleString()}`);
                    if (metrics.clicks > 0) {
                        console.log(`  CPC: $${(metrics.cost / metrics.clicks).toFixed(2)}`);
                    }
                });
        } else {
            console.log('⚠ No data found for this date range');
            console.log('This could mean:');
            console.log('  - No campaigns ran during this period');
            console.log('  - The account has no active campaigns');
            console.log('  - The customer ID is incorrect');
        }

        console.log('\n\n=== SUCCESS! ===');
        console.log('Google Ads API integration is working correctly.');
        console.log('You can now use this in your dashboard.\n');

    } catch (error) {
        console.error('\n=== ERROR ===');
        console.error('Error testing Google Ads API:', error.message);
        
        if (error.errors) {
            console.error('\nDetailed errors:');
            error.errors.forEach((err, index) => {
                console.error(`\nError ${index + 1}:`);
                console.error('  Message:', err.message);
                console.error('  Error code:', err.error_code);
                if (err.details) {
                    console.error('  Details:', err.details);
                }
            });
        }

        console.error('\nFull error object:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

testGoogleAdsAPI();
