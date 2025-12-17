import { NextResponse } from "next/server";
import { fetchFacebookAdsPSDashboardMetrics } from "@/lib/facebookAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

/**
 * GET /api/ps-dashboard/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch PS dashboard data for a specific date range
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

        console.log(`[API] Fetching PS dashboard data for ${customerId} from ${startDate} to ${endDate}`);

        // Fetch customer settings from database
        await dbConnect();
        const customerSettings = await CustomerSettings.findOne({ customer: customerId });
        
        const facebookAdAccountId = customerSettings?.facebookAdAccountId || "";
        const customerMetaID = customerSettings?.customerMetaID || "";

        // Facebook Ads API configuration
        const facebookAdsConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: facebookAdAccountId,
            startDate,
            endDate,
            countryCode: customerMetaID || undefined // Filter by country if specified
        };

        // Validate environment variables
        if (!facebookAdsConfig.accessToken) {
            throw new Error("TEMP_FACEBOOK_API_TOKEN environment variable is not set");
        }
        if (!facebookAdsConfig.adAccountId) {
            throw new Error("Facebook Ad Account ID is not configured for this customer");
        }

        // Fetch Facebook Ads PS dashboard data
        const data = await fetchFacebookAdsPSDashboardMetrics(facebookAdsConfig);

        console.log(`[API] Successfully fetched PS data: ${data.metrics_by_date?.length || 0} days, ${data.top_campaigns?.length || 0} campaigns`);

        return NextResponse.json(data);

    } catch (error) {
        console.error("[API] PS dashboard error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch PS dashboard data" },
            { status: 500 }
        );
    }
}
