/**
 * Setup Guide for New Google Cloud Project
 * Project: Searchmind
 * 
 * Follow these steps to configure OAuth 2.0 for Google Ads API
 */

console.log('\n═══════════════════════════════════════════════════════');
console.log('  Google Ads API Setup - New Project "Searchmind"');
console.log('═══════════════════════════════════════════════════════\n');

console.log('✅ Step 1: Enable Google Ads API (DONE)\n');

console.log('📋 Step 2: Configure OAuth Consent Screen');
console.log('─────────────────────────────────────────────────────────\n');
console.log('1. Go to: https://console.cloud.google.com/apis/credentials/consent');
console.log('2. Select "External" user type');
console.log('3. Click "CREATE"');
console.log('4. Fill in the required fields:');
console.log('   • App name: Searchmind Tracking Dashboard');
console.log('   • User support email: (your email)');
console.log('   • Developer contact: (your email)');
console.log('5. Click "SAVE AND CONTINUE"');
console.log('6. On "Scopes" page, click "ADD OR REMOVE SCOPES"');
console.log('7. Filter for "Google Ads API" and select:');
console.log('   • https://www.googleapis.com/auth/adwords');
console.log('8. Click "UPDATE" then "SAVE AND CONTINUE"');
console.log('9. On "Test users" page, click "ADD USERS"');
console.log('10. Add: mc@searchmind.dk');
console.log('11. Click "SAVE AND CONTINUE"\n');

console.log('🔑 Step 3: Create OAuth 2.0 Client ID');
console.log('─────────────────────────────────────────────────────────\n');
console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
console.log('2. Click "CREATE CREDENTIALS" → "OAuth client ID"');
console.log('3. Select "Web application"');
console.log('4. Name: "Google Ads API Client"');
console.log('5. Under "Authorized redirect URIs", click "ADD URI"');
console.log('6. Add: http://localhost:8080');
console.log('7. Click "CREATE"');
console.log('8. Copy the Client ID and Client Secret\n');

console.log('📝 Step 4: Update .env File');
console.log('─────────────────────────────────────────────────────────\n');
console.log('Update these values in your .env file:');
console.log('GOOGLE_ADS_CLIENT_ID=<paste Client ID here>');
console.log('GOOGLE_ADS_CLIENT_SECRET=<paste Client Secret here>\n');

console.log('🎫 Step 5: Generate Refresh Token');
console.log('─────────────────────────────────────────────────────────\n');
console.log('After updating .env, run:');
console.log('   node scripts/generate-google-ads-auth-url.js\n');
console.log('Then follow the instructions to get your refresh token.\n');

console.log('✅ Step 6: Test Everything');
console.log('─────────────────────────────────────────────────────────\n');
console.log('Once you have the refresh token, test with:');
console.log('   node scripts/diagnose-google-ads-auth.js\n');

console.log('═══════════════════════════════════════════════════════\n');
console.log('💡 IMPORTANT NOTES:');
console.log('   • Use the SAME Google account (mc@searchmind.dk) that has');
console.log('     the developer token');
console.log('   • Make sure mc@searchmind.dk has access to the Google Ads');
console.log('     accounts you want to query');
console.log('   • The OAuth consent screen must be "External" type');
console.log('   • Add mc@searchmind.dk as a test user\n');
