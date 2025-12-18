/**
 * Script to generate new Google Ads OAuth tokens
 * Run this script to get a new refresh token when yours expires
 * 
 * Usage: node scripts/refresh-google-ads-token.js
 */

console.log('\n=== Google Ads OAuth Token Generator ===\n');
console.log('Step 1: Visit this URL in your browser:\n');

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline&prompt=consent`;

console.log(authUrl);
console.log('\nStep 2: After authorizing, you will get an authorization code.');
console.log('Step 3: Run the following command with your authorization code:\n');
console.log('curl -X POST https://oauth2.googleapis.com/token \\');
console.log('  -d "code=YOUR_AUTH_CODE" \\');
console.log(`  -d "client_id=${CLIENT_ID}" \\`);
console.log(`  -d "client_secret=${CLIENT_SECRET}" \\`);
console.log('  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \\');
console.log('  -d "grant_type=authorization_code"\n');
console.log('Step 4: Copy the refresh_token from the response to your .env file');
console.log('Step 5: Copy the access_token to GOOGLE_ADS_ACCESS_TOKEN in your .env file\n');
