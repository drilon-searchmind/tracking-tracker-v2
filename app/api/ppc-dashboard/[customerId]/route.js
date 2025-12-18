import { NextResponse } from "next/server";
import { fetchGoogleAdsPPCDashboardMetrics } from "@/lib/googleAdsApi";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

/**
 * GET /api/ppc-dashboard/[customerId]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch PPC dashboard data for a specific date range
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

        console.log(`[API] Fetching PPC dashboard data for ${customerId} from ${startDate} to ${endDate}`);

        // Fetch customer settings from database
        await dbConnect();
        const customerSettings = await CustomerSettings.findOne({ customer: customerId });
        
        const googleAdsCustomerId = customerSettings?.googleAdsCustomerId || "";

        // Google Ads API configuration
        const googleAdsConfig = {
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            clientId: process.env.GOOGLE_ADS_CLIENT_ID,
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
            customerId: googleAdsCustomerId || process.env.GOOGLE_ADS_CUSTOMER_ID,
            managerCustomerId: process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID,
            startDate,
            endDate
        };

        // Fetch Google Ads PPC dashboard data
        const data = await fetchGoogleAdsPPCDashboardMetrics(googleAdsConfig);

        console.log(`[API] Successfully fetched PPC data: ${data.metrics_by_date?.length || 0} days, ${data.top_campaigns?.length || 0} campaigns`);

        return NextResponse.json(data);

    } catch (error) {
        console.error("[API] PPC dashboard error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch PPC dashboard data" },
            { status: 500 }
        );
    }
}
