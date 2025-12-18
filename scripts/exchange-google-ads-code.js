/**
 * Exchange authorization code for refresh token
 * Usage: node scripts/exchange-google-ads-code.js YOUR_CODE_HERE
 */

import 'dotenv/config';

const authCode = process.argv[2];

if (!authCode) {
    console.error('\n❌ Missing authorization code\n');
    console.error('Usage: node scripts/exchange-google-ads-code.js YOUR_CODE_HERE\n');
    process.exit(1);
}

const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
const redirectUri = 'http://localhost:8080';

if (!clientId || !clientSecret) {
    console.error('❌ Missing GOOGLE_ADS_CLIENT_ID or GOOGLE_ADS_CLIENT_SECRET in .env');
    process.exit(1);
}

console.log('\n=== Exchanging authorization code for tokens ===\n');

const tokenUrl = 'https://oauth2.googleapis.com/token';
const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: authCode.trim(),
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
});

try {
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    
    const data = await response.json();
    
    if (data.error) {
        console.error('❌ Error:', data.error_description || data.error);
        console.error('\nFull response:', JSON.stringify(data, null, 2));
        process.exit(1);
    }
    
    console.log('✅ Success! Update your .env file with these values:\n');
    console.log(`GOOGLE_ADS_REFRESH_TOKEN=${data.refresh_token}`);
    console.log(`GOOGLE_ADS_ACCESS_TOKEN=${data.access_token}`);
    console.log('\nNote: The access token expires in 1 hour, but the refresh token is permanent.\n');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
