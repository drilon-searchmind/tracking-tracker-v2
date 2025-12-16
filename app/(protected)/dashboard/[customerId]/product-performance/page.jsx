import ProductPerformanceDashboard from "./product-performance";
import { fetchShopifyProductMetrics } from "@/lib/shopifyApi";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function ProductPerformancePage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, customerValutaCode } = await fetchCustomerDetails(customerId);

        return (
            <ProductPerformanceDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
            />
        );
    } catch (error) {
        console.error("Product Performance Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load Product Performance dashboard - {error.message}</div>;
    }
}