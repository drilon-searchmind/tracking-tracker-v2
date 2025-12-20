import React from "react";
import PerformanceDashboard from "./performance-dashboard";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function DashboardPage({ params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const { customerName, customerValutaCode, customerRevenueType } = await fetchCustomerDetails(customerId);

        return (
            <PerformanceDashboard
                customerId={customerId}
                customerName={customerName}
                customerValutaCode={customerValutaCode}
                customerRevenueType={customerRevenueType}
            />
        );
    } catch (error) {
        console.error("Dashboard error:", error.message, error.stack);
        return <div>Error: Failed to load dashboard - {error.message}</div>;
    }
}