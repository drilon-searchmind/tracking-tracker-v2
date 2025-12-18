/**
 * Diagnose Google Ads API Authentication Issues
 * Usage: node scripts/diagnose-google-ads-auth.js
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

async function getAccessToken(credentials, scope) {
    const jwt = await createJWT(credentials, scope);
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
    
    if (data.error) {
        throw new Error(`Token error: ${data.error} - ${data.error_description}`);
    }
    
    return data.access_token;
}

async function diagnose() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Google Ads API Authentication Diagnostics');
    console.log('═══════════════════════════════════════════════════════\n');

    // Step 1: Check credentials
    console.log('STEP 1: Checking credentials...');
    
    const serviceAccountCreds = process.env.GOOGLE_ADS_SERVICE_ACCOUNT_CREDENTIALS;
    const oauthRefreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    
    if (!developerToken) {
        console.log('❌ GOOGLE_ADS_DEVELOPER_TOKEN missing\n');
        return;
    }
    
    console.log(`✅ Developer Token: ${developerToken.substring(0, 10)}...`);
    console.log(`   OAuth Refresh Token: ${oauthRefreshToken ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Service Account: ${serviceAccountCreds ? '✅ Present' : '❌ Missing'}`);
    
    // Step 2: Test OAuth (if available)
    console.log('\n─────────────────────────────────────────────────────────');
    console.log('STEP 2: Testing OAuth 2.0 Authentication...\n');
    
    if (oauthRefreshToken) {
        try {
            const tokenUrl = 'https://oauth2.googleapis.com/token';
            const params = new URLSearchParams({
                client_id: process.env.GOOGLE_ADS_CLIENT_ID,
                client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
                refresh_token: oauthRefreshToken,
                grant_type: 'refresh_token'
            });

            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            const data = await response.json();
            
            if (data.error) {
                console.log(`❌ OAuth token refresh failed: ${data.error}`);
            } else {
                console.log('✅ OAuth token refresh successful!');
                console.log(`   Access Token: ${data.access_token.substring(0, 30)}...\n`);
                
                // Test with OAuth token
                console.log('   Testing Google Ads API with OAuth token...');
                await testGoogleAdsAPI(data.access_token, developerToken);
            }
        } catch (error) {
            console.log(`❌ OAuth test error: ${error.message}`);
        }
    } else {
        console.log('⚠️  No OAuth refresh token available - skipping OAuth test');
    }
    
    // Step 3: Test Service Account (if available)
    console.log('\n─────────────────────────────────────────────────────────');
    console.log('STEP 3: Testing Service Account Authentication...\n');
    
    if (serviceAccountCreds) {
        try {
            const credentials = JSON.parse(serviceAccountCreds);
            console.log(`✅ Service Account: ${credentials.client_email}`);
            console.log(`   Project: ${credentials.project_id}\n`);
            
            // Try to get access token
            console.log('   Generating JWT and exchanging for access token...');
            const accessToken = await getAccessToken(credentials, 'https://www.googleapis.com/auth/adwords');
            
            console.log('✅ Service account token obtained!');
            console.log(`   Access Token: ${accessToken.substring(0, 30)}...\n`);
            
            // Test with service account token
            console.log('   Testing Google Ads API with Service Account token...');
            await testGoogleAdsAPI(accessToken, developerToken);
            
        } catch (error) {
            console.log(`❌ Service account test error: ${error.message}`);
        }
    } else {
        console.log('⚠️  No service account credentials - skipping service account test');
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Diagnostics Complete');
    console.log('═══════════════════════════════════════════════════════\n');
}

async function testGoogleAdsAPI(accessToken, developerToken) {
    try {
        // Test 1: List accessible customers
        const listUrl = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';
        
        const response = await fetch(listUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ API call successful!');
            
            if (data.resourceNames && data.resourceNames.length > 0) {
                console.log(`   📋 Found ${data.resourceNames.length} accessible accounts:`);
                data.resourceNames.forEach((name) => {
                    const id = name.split('/')[1];
                    const formatted = id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                    console.log(`      • ${formatted}`);
                });
            }
        } else {
            const status = response.status;
            let errorDetail = '';
            
            try {
                const text = await response.text();
                // Try to extract JSON error
                if (text.includes('{')) {
                    const jsonMatch = text.match(/\{.*\}/s);
                    if (jsonMatch) {
                        const error = JSON.parse(jsonMatch[0]);
                        errorDetail = error.error?.message || JSON.stringify(error);
                    } else {
                        errorDetail = text.substring(0, 200);
                    }
                } else {
                    errorDetail = text.substring(0, 200);
                }
            } catch (e) {
                errorDetail = 'Could not parse error';
            }
            
            console.log(`   ❌ API call failed: ${status}`);
            console.log(`   Error: ${errorDetail}`);
            
            if (status === 401) {
                console.log('\n   💡 401 Unauthorized - Token is invalid or expired');
            } else if (status === 403) {
                console.log('\n   💡 403 Forbidden - Possible reasons:');
                console.log('      • Service account not added to Google Ads account');
                console.log('      • Developer token needs approval');
                console.log('      • Account lacks necessary permissions');
            } else if (status === 404) {
                console.log('\n   💡 404 Not Found - Possible reasons:');
                console.log('      • Google Ads API may not support service account auth this way');
                console.log('      • OAuth 2.0 with user credentials is required');
                console.log('      • Check if API is enabled for this project');
            }
        }
    } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
    }
}

diagnose();
