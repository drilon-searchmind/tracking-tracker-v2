import { NextResponse } from "next/server";
import { fetchShopifyProductMetrics, fetchShopifyOrderMetrics } from "@/lib/shopifyApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

/**
 * GET /api/product-performance/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch Product Performance data for a specific date range
 */
export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const customerId = resolvedParams.customerId;
        const { searchParams } = new URL(request.url);
        
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "startDate and endDate are required" },
                { status: 400 }
            );
        }

        console.log(`[API] Fetching Product Performance data for ${customerId} from ${startDate} to ${endDate}`);

        // Fetch customer settings from database
        await dbConnect();
        const customerSettings = await CustomerSettings.findOne({ customer: customerId });
        
        const shopifyUrl = customerSettings?.shopifyUrl || "";
        const shopifyApiPassword = customerSettings?.shopifyApiPassword || "";

        // Shopify API configuration
        const shopifyConfig = {
            shopUrl: shopifyUrl || process.env.TEMP_SHOPIFY_URL,
            accessToken: shopifyApiPassword || process.env.TEMP_SHOPIFY_PASSWORD,
            startDate,
            endDate
        };

        // Fetch both order metrics (for accurate revenue/orders) and product metrics (for product details)
        const [orderMetrics, productMetrics] = await Promise.all([
            fetchShopifyOrderMetrics(shopifyConfig).catch(err => {
                console.error("Failed to fetch Shopify order data:", err.message);
                return [];
            }),
            fetchShopifyProductMetrics(shopifyConfig).catch(err => {
                console.error("Failed to fetch Shopify product data:", err.message);
                return { dashboard_data: [], top_products: [], product_daily_metrics: [] };
            })
        ]);

        // Merge order metrics into dashboard_data (use order metrics for revenue/orders)
        const dashboard_data = orderMetrics.map(order => ({
            date: order.date,
            revenue: order.revenue || 0,
            orders: order.orders || 0
        }));

        const data = {
            dashboard_data,
            top_products: productMetrics.top_products || [],
            product_daily_metrics: productMetrics.product_daily_metrics || []
        };

        console.log(`[API] Successfully fetched Product Performance data: ${data.dashboard_data.length} days, ${data.top_products.length} products`);

        return NextResponse.json({ data });

    } catch (error) {
        console.error("[API] Product Performance error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
