import PPCDashboard from "./ppc-dashboard";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function GoogleAdsDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName } = await fetchCustomerDetails(customerId);

        return (
            <PPCDashboard
                customerId={customerId}
                customerName={customerName}
            />
        );
    } catch (error) {
        console.error("Google Ads Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Google Ads dashboard - {error.message}</div>;
    }
}