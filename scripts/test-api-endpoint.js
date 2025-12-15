/**
 * Detailed API endpoint test
 * Usage: node scripts/test-api-endpoint.js
 */

import 'dotenv/config';
import crypto from 'crypto';

function base64UrlEncode(input) {
    const buffer = typeof input === 'string' ? Buffer.from(input) : input;
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function createJWT(credentials, scope) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: credentials.client_email,
        scope: scope,
        aud: credentials.token_uri,
        exp: now + 3600,
        iat: now
    };
    
    const headerBase64 = base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${headerBase64}.${payloadBase64}`;
    
    const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), {
        key: credentials.private_key,
        padding: crypto.constants.RSA_PKCS1_PADDING
    });
    
    const signatureBase64 = base64UrlEncode(signature);
    return `${signatureInput}.${signatureBase64}`;
}

async function getAccessToken(credentials) {
    const jwt = await createJWT(credentials, 'https://www.googleapis.com/auth/adwords');
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const params = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    const data = await response.json();
    if (data.error) throw new Error(`${data.error}: ${data.error_description}`);
    return data.access_token;
}

async function testEndpoint() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Detailed Google Ads API Endpoint Test');
    console.log('═══════════════════════════════════════════════════════\n');

    const credentials = JSON.parse(process.env.GOOGLE_ADS_SERVICE_ACCOUNT_CREDENTIALS);
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    
    console.log('📋 Configuration:');
    console.log(`   Service Account: ${credentials.client_email}`);
    console.log(`   Project: ${credentials.project_id}`);
    console.log(`   Developer Token: ${developerToken}\n`);

    // Get access token
    console.log('🔐 Getting access token...');
    const accessToken = await getAccessToken(credentials);
    console.log(`✅ Token obtained: ${accessToken.substring(0, 30)}...\n`);

    // Test different API endpoints
    const endpoints = [
        {
            name: 'List Accessible Customers',
            url: 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
            }
        },
        {
            name: 'Get Customer (6635038416)',
            url: 'https://googleads.googleapis.com/v17/customers/6635038416',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
            }
        },
        {
            name: 'Search Campaigns (6042038980)',
            url: 'https://googleads.googleapis.com/v17/customers/6042038980/googleAds:search',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
                'login-customer-id': '6635038416',
            },
            body: JSON.stringify({
                query: 'SELECT campaign.id, campaign.name FROM campaign LIMIT 1'
            })
        }
    ];

    for (const endpoint of endpoints) {
        console.log(`\n─────────────────────────────────────────────────────────`);
        console.log(`Testing: ${endpoint.name}`);
        console.log(`URL: ${endpoint.url}`);
        console.log(`Method: ${endpoint.method}\n`);

        try {
            const options = {
                method: endpoint.method,
                headers: endpoint.headers
            };
            
            if (endpoint.body) {
                options.body = endpoint.body;
            }

            const response = await fetch(endpoint.url, options);
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            
            const contentType = response.headers.get('content-type');
            console.log(`Content-Type: ${contentType}`);

            const responseText = await response.text();
            
            if (response.ok) {
                console.log('✅ SUCCESS!');
                try {
                    const data = JSON.parse(responseText);
                    console.log('Response:', JSON.stringify(data, null, 2));
                } catch {
                    console.log('Response:', responseText.substring(0, 200));
                }
            } else {
                console.log('❌ FAILED');
                
                // Try to parse JSON error
                try {
                    const error = JSON.parse(responseText);
                    console.log('Error:', JSON.stringify(error, null, 2));
                } catch {
                    // If not JSON, show first 500 chars
                    console.log('Error (raw):', responseText.substring(0, 500));
                }
            }
        } catch (error) {
            console.log(`❌ Exception: ${error.message}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════\n');
}

testEndpoint().catch(console.error);
