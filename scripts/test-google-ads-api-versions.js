/**
 * Test different Google Ads API versions and endpoints
 */

import 'dotenv/config';

async function testVersions() {
    console.log('\n=== Testing Google Ads API Versions and Endpoints ===\n');

    // Get access token
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenParams = new URLSearchParams({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
        grant_type: 'refresh_token'
    });

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString()
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

    console.log('✅ Access token obtained\n');

    // Test different versions and endpoints
    const tests = [
        {
            name: 'v17 - List Accessible Customers',
            url: 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers',
            method: 'GET'
        },
        {
            name: 'v16 - List Accessible Customers',
            url: 'https://googleads.googleapis.com/v16/customers:listAccessibleCustomers',
            method: 'GET'
        },
        {
            name: 'v15 - List Accessible Customers',
            url: 'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers',
            method: 'GET'
        },
        {
            name: 'Latest - List Accessible Customers',
            url: 'https://googleads.googleapis.com/customers:listAccessibleCustomers',
            method: 'GET'
        }
    ];

    for (const test of tests) {
        console.log(`Testing: ${test.name}`);
        console.log(`URL: ${test.url}\n`);

        try {
            const response = await fetch(test.url, {
                method: test.method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'developer-token': developerToken,
                }
            });

            const contentType = response.headers.get('content-type');
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(`Content-Type: ${contentType}`);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SUCCESS!');
                console.log('Response:', JSON.stringify(data, null, 2));
            } else {
                const text = await response.text();
                
                // Try to parse as JSON
                try {
                    const error = JSON.parse(text);
                    console.log('❌ Error (JSON):', JSON.stringify(error, null, 2));
                } catch {
                    // Check if HTML 404
                    if (text.includes('404')) {
                        console.log('❌ 404 Not Found - API endpoint does not exist');
                    } else {
                        console.log('❌ Error (raw):', text.substring(0, 300));
                    }
                }
            }
        } catch (error) {
            console.log(`❌ Network error: ${error.message}`);
        }

        console.log('\n' + '='.repeat(60) + '\n');
    }

    // Also test if the API is enabled by checking the discovery document
    console.log('Checking Google Ads API discovery...\n');
    
    try {
        const discoveryUrl = 'https://googleads.googleapis.com/$discovery/rest?version=v17';
        const discoveryResponse = await fetch(discoveryUrl);
        
        if (discoveryResponse.ok) {
            console.log('✅ Google Ads API v17 discovery document found');
            const discovery = await discoveryResponse.json();
            console.log(`API Name: ${discovery.name}`);
            console.log(`API Version: ${discovery.version}`);
            console.log(`Base URL: ${discovery.baseUrl || discovery.rootUrl}`);
        } else {
            console.log(`❌ Discovery failed: ${discoveryResponse.status}`);
        }
    } catch (error) {
        console.log(`❌ Discovery error: ${error.message}`);
    }
}

testVersions().catch(console.error);
