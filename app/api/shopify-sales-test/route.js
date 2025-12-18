import { NextResponse } from 'next/server';
import { fetchShopifySalesAnalytics } from '@/lib/shopifyApi';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate') || '2025-12-01';
        const endDate = searchParams.get('endDate') || '2025-12-16';

        // Hardcoded credentials for testing
        const shopify_url = '';
        const shopify_access_token = '';

        console.log('Fetching Shopify sales analytics for:', { shopify_url, startDate, endDate });

        // Fetch sales analytics
        const salesData = await fetchShopifySalesAnalytics({
            shopUrl: shopify_url,
            accessToken: shopify_access_token,
            startDate,
            endDate,
        });

        return NextResponse.json(salesData);
    } catch (error) {
        console.error('Error in shopify-sales-test API:', error);
        return NextResponse.json(
            { error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}