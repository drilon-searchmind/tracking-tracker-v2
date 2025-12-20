import PSDashboard from "./ps-dashboard";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PaidSocialDashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName } = await fetchCustomerDetails(customerId);

        return (
            <PSDashboard
                customerId={customerId}
                customerName={customerName}
            />
        );
    } catch (error) {
        console.error("Paid Social Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Paid Social dashboard - {error.message}</div>;
    }
}