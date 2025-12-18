/**
 * Test Google Ads Service Account Authentication
 * Usage: node scripts/test-service-account-auth.js
 */

import 'dotenv/config';
import crypto from 'crypto';

/**
 * Base64 URL encode
 */
function base64UrlEncode(input) {
    const buffer = typeof input === 'string' ? Buffer.from(input) : input;
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Create JWT for service account authentication
 */
async function createJWT(credentials, scope) {
    const now = Math.floor(Date.now() / 1000);
    
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };
    
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
    
    // Sign with private key
    const signature = crypto.sign(
        'RSA-SHA256',
        Buffer.from(signatureInput),
        {
            key: credentials.private_key,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }
    );
    
    const signatureBase64 = base64UrlEncode(signature);
    
    return `${signatureInput}.${signatureBase64}`;
}

/**
 * Get access token using service account
 */
async function getServiceAccountAccessToken(credentials) {
    const scope = 'https://www.googleapis.com/auth/adwords';
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    // Create JWT
    const jwt = await createJWT(credentials, scope);
    
    // Exchange JWT for access token
    const params = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    const data = await response.json();
    
    if (data.error) {
        throw new Error(`${data.error}: ${data.error_description}`);
    }
    
    return data.access_token;
}

async function testServiceAccountAuth() {
    console.log('\n=== Testing Google Ads Service Account Authentication ===\n');

    try {
        // Load service account credentials
        const credentials = JSON.parse(process.env.GOOGLE_ADS_SERVICE_ACCOUNT_CREDENTIALS);
        
        console.log('✅ Service account credentials loaded');
        console.log(`   Email: ${credentials.client_email}`);
        console.log(`   Project: ${credentials.project_id}\n`);
        
        // Get access token
        console.log('🔐 Generating JWT and requesting access token...');
        const accessToken = await getServiceAccountAccessToken(credentials);
        
        console.log('✅ Successfully obtained access token!');
        console.log(`   Token: ${accessToken.substring(0, 30)}...`);
        console.log(`   Length: ${accessToken.length} characters\n`);
        
        // Test API call
        const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
        const managerCustomerId = '6635038416'; // Without dashes
        
        console.log('📡 Testing API call: List accessible customers...');
        const listUrl = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';
        
        const response = await fetch(listUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API call failed:', response.status);
            console.error('   Error:', errorText);
            
            if (response.status === 403) {
                console.error('\n⚠️  Access forbidden. Possible reasons:');
                console.error('   1. Service account needs to be added as a user in Google Ads');
                console.error('   2. Service account needs "Standard" access level in Google Ads');
                console.error('   3. Developer token may need approval\n');
            }
            
            process.exit(1);
        }

        const data = await response.json();
        
        console.log('✅ API call successful!');
        console.log('\n📋 Accessible Customer Accounts:');
        
        if (data.resourceNames && data.resourceNames.length > 0) {
            data.resourceNames.forEach((resourceName, index) => {
                const customerId = resourceName.split('/')[1];
                const formattedId = customerId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                console.log(`   ${index + 1}. ${formattedId}`);
            });
        } else {
            console.log('   No accessible customers found.');
        }
        
        console.log('\n✅ Service account authentication is working correctly!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('invalid_grant')) {
            console.error('\n⚠️  Invalid grant error. This usually means:');
            console.error('   1. The service account credentials are incorrect');
            console.error('   2. The private key format is invalid');
            console.error('   3. Check that GOOGLE_ADS_SERVICE_ACCOUNT_CREDENTIALS is properly formatted\n');
        }
        
        process.exit(1);
    }
}

testServiceAccountAuth();
