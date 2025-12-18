/**
 * Test Google Ads API credentials
 * Usage: node scripts/test-google-ads-credentials.js
 */

import 'dotenv/config';

async function testCredentials() {
    const config = {
        developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        clientId: process.env.GOOGLE_ADS_CLIENT_ID,
        clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ADS_ACCESS_TOKEN,
    };

    console.log('\n=== Testing Google Ads API Credentials ===\n');
    
    // Check if all required credentials are present
    const missing = [];
    if (!config.developerToken) missing.push('GOOGLE_ADS_DEVELOPER_TOKEN');
    if (!config.clientId) missing.push('GOOGLE_ADS_CLIENT_ID');
    if (!config.clientSecret) missing.push('GOOGLE_ADS_CLIENT_SECRET');
    if (!config.refreshToken) missing.push('GOOGLE_ADS_REFRESH_TOKEN');
    
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing.join(', '));
        process.exit(1);
    }
    
    console.log('✅ All required environment variables are set');
    console.log(`   Developer Token: ${config.developerToken.substring(0, 10)}...`);
    console.log(`   Client ID: ${config.clientId}`);
    console.log(`   Refresh Token: ${config.refreshToken.substring(0, 20)}...`);
    console.log();
    
    // Test token refresh
    console.log('Testing token refresh...');
    try {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            refresh_token: config.refreshToken,
            grant_type: 'refresh_token'
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const data = await response.json();

        if (data.error) {
            console.error('❌ Token refresh failed:', data.error_description || data.error);
            console.error('\nFull error response:', JSON.stringify(data, null, 2));
            console.error('\n⚠️  This usually means:');
            console.error('   1. The refresh token was generated with DIFFERENT OAuth credentials');
            console.error('   2. You need to regenerate the refresh token using these exact credentials');
            console.error('\nRun: node scripts/get-google-ads-refresh-token.js');
            process.exit(1);
        }

        console.log('✅ Token refresh successful!');
        console.log(`   New access token: ${data.access_token.substring(0, 30)}...`);
        console.log(`   Expires in: ${data.expires_in} seconds (${Math.floor(data.expires_in / 60)} minutes)`);
        console.log();
        console.log('✅ All credentials are valid and working!');
        
    } catch (error) {
        console.error('❌ Error testing credentials:', error.message);
        process.exit(1);
    }
}

testCredentials();
