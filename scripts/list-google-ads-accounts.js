/**
 * List accessible Google Ads accounts
 * Usage: node scripts/list-google-ads-accounts.js
 */

import 'dotenv/config';

async function listAccounts() {
    const config = {
        developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        clientId: process.env.GOOGLE_ADS_CLIENT_ID,
        clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    };

    console.log('\n=== Listing Google Ads Accounts ===\n');

    // Get access token
    console.log('Refreshing access token...');
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenParams = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: 'refresh_token'
    });

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString()
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('✅ Access token obtained\n');

    // List accessible customers
    const listUrl = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';

    try {
        const response = await fetch(listUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': config.developerToken,
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        console.log('📋 Accessible Customer Accounts:\n');
        
        if (data.resourceNames && data.resourceNames.length > 0) {
            data.resourceNames.forEach((resourceName, index) => {
                // Extract customer ID from resource name (format: customers/1234567890)
                const customerId = resourceName.split('/')[1];
                const formattedId = customerId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                console.log(`${index + 1}. Customer ID: ${formattedId} (${customerId})`);
                console.log(`   Resource: ${resourceName}\n`);
            });

            console.log('💡 Use one of these customer IDs in your .env file or page.jsx');
        } else {
            console.log('⚠️  No accessible customers found.');
            console.log('\nThis might mean:');
            console.log('1. Your developer token is in TEST mode and you need a test account');
            console.log('2. You need to grant access to accounts during OAuth authorization');
            console.log('3. You need to be invited to manage Google Ads accounts');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listAccounts();
