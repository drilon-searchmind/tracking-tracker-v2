import PaceReport from "./pace-report";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function PaceReportPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, customerValutaCode, customerRevenueType } = await fetchCustomerDetails(customerId);

        return (
            <PaceReport
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                customerRevenueType={customerRevenueType}
            />
        );
    } catch (error) {
        console.error("Pace Report error:", error.message, error.stack);
        return <div>Error: Failed to load Pace Report - {error.message}</div>;
    }
}