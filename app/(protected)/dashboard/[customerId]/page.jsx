import OverviewDashboard from "./overview-dashboard";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const dynamic = 'force-dynamic';

export default async function OverviewPage({ params, searchParams }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    
    const resolvedSearchParams = await searchParams;
    
    console.log("::: Fetching customer with ID:", customerId);

    try {
        const { customerName, customerValutaCode, customerRevenueType } = await fetchCustomerDetails(customerId);

        console.log("::: Customer details:", { customerName, customerValutaCode });

        // Pass customerRevenueType to OverviewDashboard
        return (
            <OverviewDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                customerRevenueType={customerRevenueType} // Added this prop
            />
        );
    } catch (error) {
        console.error("Overview Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Overview dashboard - {error.message}</div>;
    }
}