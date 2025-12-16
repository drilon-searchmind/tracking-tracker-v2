import PSDashboard from "./ps-dashboard";
import { fetchFacebookAdsPSDashboardMetrics } from "@/lib/facebookAdsApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PaidSocialDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, facebookAdAccountId } = await fetchCustomerDetails(customerId);

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

        // Validate environment variables
        if (!process.env.TEMP_FACEBOOK_API_TOKEN) {
            throw new Error("TEMP_FACEBOOK_API_TOKEN environment variable is not set");
        }
        
        const adAccountId = facebookAdAccountId || process.env.TEMP_FACEBOOK_AD_ACCOUNT_ID;
        if (!adAccountId) {
            throw new Error("Facebook Ad Account ID is not configured for this customer");
        }

        // Facebook Ads API configuration
        const facebookAdsConfig = {
            accessToken: process.env.TEMP_FACEBOOK_API_TOKEN,
            adAccountId: adAccountId,
            startDate,
            endDate
        };

        console.log(`[PS Dashboard] Fetching data for ${customerId} from ${startDate} to ${endDate}`);
        console.log(`[PS Dashboard] Using ad account: ${adAccountId}`);

        // Fetch Facebook Ads PS dashboard data
        const data = await fetchFacebookAdsPSDashboardMetrics(facebookAdsConfig);

        if (!data || !data.metrics_by_date) {
            console.warn("No data returned from Facebook Ads API for customerId:", customerId);
            return (
                <PSDashboard
                    customerId={customerId}
                    customerName={customerName}
                    initialData={null}
                />
            );
        }

        const { metrics_by_date, top_campaigns, campaigns_by_date } = data;

        return (
            <PSDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={{ metrics_by_date, top_campaigns, campaigns_by_date }}
            />
        );
    } catch (error) {
        console.error("Paid Social Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Paid Social dashboard - {error.message}</div>;
    }
}