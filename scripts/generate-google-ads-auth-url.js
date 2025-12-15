/**
 * Generate Google Ads OAuth URL using credentials from .env
 * Usage: node scripts/generate-google-ads-auth-url.js
 */

import 'dotenv/config';

const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const redirectUri = 'http://localhost:8080';
const scope = 'https://www.googleapis.com/auth/adwords';

if (!clientId) {
    console.error('❌ GOOGLE_ADS_CLIENT_ID not found in .env file');
    process.exit(1);
}

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code` +
    `&access_type=offline` +
    `&prompt=consent`;

console.log('\n=== Google Ads OAuth Setup ===\n');
console.log('Client ID:', clientId);
console.log('\nSTEP 1: Add redirect URI to your OAuth Client');
console.log('   Go to: https://console.cloud.google.com/apis/credentials');
console.log('   Find your OAuth Client and add this redirect URI:');
console.log('   → http://localhost:8080\n');
console.log('STEP 2: Open this URL in your browser:\n');
console.log(authUrl);
console.log('\nSTEP 3: After authorizing, you\'ll be redirected to localhost');
console.log('   Copy the "code" parameter from the URL');
console.log('   Example: http://localhost:8080/?code=4/0Adeu5BW...');
console.log('   Copy only: 4/0Adeu5BW...\n');
console.log('STEP 4: Exchange the code for tokens:');
console.log('   node scripts/exchange-google-ads-code.js YOUR_CODE_HERE\n');
