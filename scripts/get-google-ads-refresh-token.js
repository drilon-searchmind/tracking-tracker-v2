/**
 * Generate Google Ads API Refresh Token
 * Run this once to get your refresh token
 * 
 * Usage: node scripts/get-google-ads-refresh-token.js
 */

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function getRefreshToken() {
    console.log('\n=== Google Ads API Refresh Token Generator ===\n');
    
    const clientId = await question('Enter your Google Ads Client ID: ');
    const clientSecret = await question('Enter your Google Ads Client Secret: ');
    
    // Generate authorization URL
    const scope = 'https://www.googleapis.com/auth/adwords';
    const redirectUri = 'http://localhost:8080'; // Works with Web apps
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&response_type=code` +
        `&access_type=offline` +
        `&prompt=consent`;
    
    console.log('\n1. First, add this redirect URI to your OAuth Client in Google Cloud Console:');
    console.log('   https://console.cloud.google.com/apis/credentials');
    console.log('   Add: http://localhost:8080');
    console.log('\n2. Then open this URL in your browser:\n');
    console.log(authUrl);
    console.log('\n3. Authorize the application');
    console.log('4. You will be redirected to localhost (it may show an error - that\'s OK!)');
    console.log('5. Copy the "code" parameter from the URL bar');
    console.log('   Example: http://localhost:8080/?code=4/0Adeu5BW...');
    console.log('   Copy only the code part: 4/0Adeu5BW...\n');
    
    const authCode = await question('Enter the authorization code: ');
    
    // Exchange auth code for refresh token
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
            console.error('\n❌ Error:', data.error_description || data.error);
            process.exit(1);
        }
        
        console.log('\n✅ Success! Add these to your .env file:\n');
        console.log(`GOOGLE_ADS_REFRESH_TOKEN=${data.refresh_token}`);
        console.log(`GOOGLE_ADS_ACCESS_TOKEN=${data.access_token}`);
        console.log('\nNote: Access token expires, but refresh token is permanent.');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
    
    rl.close();
}

getRefreshToken();
