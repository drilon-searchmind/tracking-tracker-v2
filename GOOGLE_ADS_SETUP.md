# Google Ads API Integration - Complete Setup Guide

## Overview
Successfully integrated Google Ads API using the official `google-ads-api` npm package with OAuth 2.0 authentication. The API now fetches daily ad spend data (PPC cost) for ROAS calculations in the dashboard.

## ✅ Working Configuration

### 1. Authentication Method
- **Type**: OAuth 2.0 (User credentials)
- **Flow**: Authorization Code Grant with Refresh Token
- **Account**: mc@searchmind.dk
- **OAuth Consent Screen**: External (published)

### 2. Google Cloud Project
- **Project**: perfect-victor-481319-r1
- **Google Ads API**: ✅ Enabled
- **OAuth Client Type**: Web application
- **Redirect URI**: http://localhost:8080


**Important**: Customer IDs MUST be without dashes (e.g., `6042038980`, not `604-203-8980`)

### 4. Account Structure
- **Manager Account (MCC)**: 663-503-8416 (6635038416 in API)
- **Sub-account**: 604-203-8980 (6042038980 in API)
- **Developer Token Status**: Basic Access (sufficient for own accounts)

## 📦 Dependencies

### Installed Package
```bash
npm install google-ads-api
```

This package:
- Uses gRPC protocol (NOT REST API)
- Handles OAuth token refresh automatically
- Provides type-safe GAQL query interface
- Supports MCC account structures

### Why NOT REST API?
Google Ads API is unique among Google Cloud APIs:
- ❌ No REST endpoints available at `googleads.googleapis.com`
- ❌ Cannot use `fetch()` or similar HTTP libraries
- ✅ MUST use official `google-ads-api` npm package
- ✅ Communication via gRPC/Protocol Buffers

## 🔧 Implementation

### File: lib/googleAdsApi.js
```javascript
import { GoogleAdsApi } from 'google-ads-api';

export async function fetchGoogleAdsMetrics({ 
    developerToken, 
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    managerCustomerId,
    startDate, 
    endDate 
}) {
    // Initialize client
    const client = new GoogleAdsApi({
        client_id: clientId,
        client_secret: clientSecret,
        developer_token: developerToken,
    });

    // Get customer
    const customer = client.Customer({
        customer_id: customerId,
        refresh_token: refreshToken,
        login_customer_id: managerCustomerId || undefined,
    });

    // Execute GAQL query
    const query = `
        SELECT 
            campaign.id,
            campaign.name,
            segments.date,
            metrics.cost_micros
        FROM campaign
        WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        ORDER BY segments.date ASC
    `;

    const response = await customer.query(query);

    // Process and aggregate results
    // ... (see full implementation in file)
}
```

### GAQL Query Language
Google Ads uses GAQL (Google Ads Query Language), similar to SQL:
```sql
SELECT 
    campaign.id,
    campaign.name,
    segments.date,
    metrics.cost_micros,
    metrics.impressions,
    metrics.clicks
FROM campaign
WHERE segments.date BETWEEN '2025-12-08' AND '2025-12-15'
ORDER BY segments.date ASC
```

**Note**: Costs are in micros (1/1,000,000 of currency). Divide by 1,000,000 to get actual cost.

## 🧪 Testing

### Test Script: scripts/test-google-ads-final.js
```bash
node scripts/test-google-ads-final.js
```

**Expected Output**:
```
✓ Client initialized successfully
✓ Customer client created
✓ Query executed successfully!
Found 10 rows

Sample results:
  Campaign ID: 21753639107
  Campaign Name: SM - RLSA - Brand
  Date: 2025-12-15
  Cost: 51.38
  Impressions: 247
  Clicks: 94

Aggregated by date:
2025-12-15:
  Total Cost: $383.32
  Total Impressions: 4,790
  Total Clicks: 156
  CPC: $2.46
```

## 🔄 OAuth Token Management

### Refresh Tokens
- **Lifetime**: Never expires (unless revoked)
- **Refresh**: Automatic via `google-ads-api` library
- **Storage**: .env file (secure)

### Access Tokens
- **Not needed**: Library handles token refresh internally
- **Removed**: `GOOGLE_ADS_ACCESS_TOKEN` from .env (optional)

### Regenerating Tokens (if needed)
1. Generate authorization URL:
   ```bash
   node scripts/generate-google-ads-auth-url.js
   ```

2. Visit URL in browser, authorize with mc@searchmind.dk

3. Exchange code for refresh token:
   ```bash
   node scripts/exchange-google-ads-code.js
   ```

4. Update `.env` with new `GOOGLE_ADS_REFRESH_TOKEN`

## 📊 Dashboard Integration

### File: app/(protected)/dashboard/[customerId]/page.jsx
```javascript
const googleAdsConfig = {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
    managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
    startDate: startDate,
    endDate: endDate
};

const googleAdsData = await fetchGoogleAdsMetrics(googleAdsConfig);
```

Data is fetched in parallel with Shopify and Facebook Ads, then merged for ROAS calculations.

## 🚨 Common Issues & Solutions

### Issue: "Invalid customer ID"
**Cause**: Customer ID has dashes
**Solution**: Remove dashes from customer IDs in .env
- ❌ `604-203-8980`
- ✅ `6042038980`

### Issue: 404 errors on API calls
**Cause**: Attempting REST API calls instead of using official library
**Solution**: Use `google-ads-api` npm package, NOT fetch()

### Issue: "org_internal" error
**Cause**: OAuth consent screen is set to Internal
**Solution**: Change to External in Google Cloud Console

### Issue: "redirect_uri_mismatch"
**Cause**: OAuth client redirect URI doesn't match script
**Solution**: Use Web client type with redirect URI: http://localhost:8080

### Issue: "invalid_grant" with refresh token
**Cause**: Refresh token from different OAuth client
**Solution**: Regenerate refresh token using current OAuth client

## 📝 Developer Token Notes

### Current Status: Basic Access
- **Token**: 48umAb_S03Zc_KzZrr7N5g
- **Level**: Basic Access
- **Limitations**: Can only access own Google Ads accounts
- **Requirements**: No additional approval needed

### Standard Access (Future)
Only needed if accessing client accounts. Not required for current use case.

## 🎯 Next Steps

1. ✅ OAuth 2.0 authentication working
2. ✅ API queries returning data
3. ✅ Dashboard integration complete
4. ✅ Test script validates setup
5. 🔄 Monitor for token expiration issues
6. 🔄 Add error handling for API rate limits
7. 🔄 Consider caching for frequently accessed data

## 📚 Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [google-ads-api npm Package](https://www.npmjs.com/package/google-ads-api)
- [GAQL Reference](https://developers.google.com/google-ads/api/docs/query/overview)
- [OAuth 2.0 Setup Guide](https://developers.google.com/google-ads/api/docs/oauth/overview)

## ✨ Success Indicators

- ✅ Test script runs without errors
- ✅ Dashboard displays Google Ads spend data
- ✅ ROAS calculations include PPC costs
- ✅ Token refresh happens automatically
- ✅ No 401 or 404 errors in logs

---

**Last Updated**: December 15, 2025  
**Status**: ✅ Production Ready
