/**
 * Check Google Cloud Project Configuration
 * Usage: node scripts/check-api-enabled.js
 */

import 'dotenv/config';

console.log('\n═══════════════════════════════════════════════════════');
console.log('  Google Ads API - Project Configuration Check');
console.log('═══════════════════════════════════════════════════════\n');

// Check OAuth project
const oauthClientId = process.env.GOOGLE_ADS_CLIENT_ID;
if (oauthClientId) {
    // Extract project number from client ID
    const projectNumber = oauthClientId.split('-')[0];
    console.log('📋 OAuth 2.0 Configuration:');
    console.log(`   Client ID: ${oauthClientId}`);
    console.log(`   Project Number: ${projectNumber}\n`);
}

// Check Service Account project
const serviceAccountCreds = process.env.GOOGLE_ADS_SERVICE_ACCOUNT_CREDENTIALS;
if (serviceAccountCreds) {
    const credentials = JSON.parse(serviceAccountCreds);
    console.log('📋 Service Account Configuration:');
    console.log(`   Email: ${credentials.client_email}`);
    console.log(`   Project ID: ${credentials.project_id}`);
    console.log(`   Project Number: ${credentials.project_id.split('-').pop() || 'N/A'}\n`);
}

console.log('═══════════════════════════════════════════════════════');
console.log('  ACTION REQUIRED: Enable Google Ads API');
console.log('═══════════════════════════════════════════════════════\n');

console.log('The 404 error means the Google Ads API is NOT enabled.');
console.log('You need to enable it in BOTH projects:\n');

if (oauthClientId) {
    const projectNumber = oauthClientId.split('-')[0];
    console.log('1️⃣  For OAuth Project:');
    console.log(`   Go to: https://console.cloud.google.com/apis/library/googleads.googleapis.com?project=${projectNumber}`);
    console.log('   Click "ENABLE"\n');
}

if (serviceAccountCreds) {
    const credentials = JSON.parse(serviceAccountCreds);
    console.log('2️⃣  For Service Account Project:');
    console.log(`   Go to: https://console.cloud.google.com/apis/library/googleads.googleapis.com?project=${credentials.project_id}`);
    console.log('   Click "ENABLE"\n');
}

console.log('═══════════════════════════════════════════════════════');
console.log('  After Enabling the API:');
console.log('═══════════════════════════════════════════════════════\n');
console.log('Run this command to test again:');
console.log('   node scripts/diagnose-google-ads-auth.js\n');
console.log('Or test the full integration:');
console.log('   npm run dev\n');
