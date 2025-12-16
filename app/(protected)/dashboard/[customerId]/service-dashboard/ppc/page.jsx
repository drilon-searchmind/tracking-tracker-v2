import PPCDashboard from "./ppc-dashboard";
import { fetchGoogleAdsPPCDashboardMetrics } from "@/lib/googleAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function GoogleAdsDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, googleAdsCustomerId } = await fetchCustomerDetails(customerId);

        // Calculate default date range (current month to yesterday)
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = formatDate(firstDayOfMonth);
        const endDate = formatDate(yesterday);

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

        console.log(`[PPC Dashboard] Fetching data for ${customerId} from ${startDate} to ${endDate}`);

        // Fetch Google Ads PPC dashboard data
        const data = await fetchGoogleAdsPPCDashboardMetrics(googleAdsConfig);

        if (!data || !data.metrics_by_date) {
            console.warn("No data returned from Google Ads API for customerId:", customerId);
            return (
                <PPCDashboard
                    customerId={customerId}
                    customerName={customerName}
                    initialData={null}
                />
            );
        }

        const { metrics_by_date, top_campaigns, campaigns_by_date } = data;

        return (
            <PPCDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics_by_date, top_campaigns, campaigns_by_date }}
            />
        );
    } catch (error) {
        console.error("Google Ads Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Google Ads dashboard - {error.message}</div>;
    }
}