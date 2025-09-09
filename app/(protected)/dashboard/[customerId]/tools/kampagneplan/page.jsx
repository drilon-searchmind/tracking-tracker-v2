import KampagneplanDashboard from "./kampagneplanner";
import { queryBigQueryDashboardMetrics } from "@/lib/bigQueryConnect";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600;

export default async function KampagneplannerPage({ params }) {
    const { customerId } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.NODE_ENV === "development"
            ? "http://192.168.1.253:3000"
            : "http://localhost:3000";

    try {
        const { bigQueryCustomerId, bigQueryProjectId, customerName } = await fetchCustomerDetails(customerId);

        return (
            <KampagneplanDashboard
                customerId={customerId}
                customerName={customerName}
                initialData={null}
            />
        );
    } catch (error) {
        console.error("SpendShare error:", error.message, error.stack);
        return <div>Error: Failed to load KampagneplanDashboard - {error.message}</div>;
    }
}