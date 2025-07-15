import React from "react";
import { queryBigQueryOrders } from "@/lib/bigQueryConnect";

export default async function TestPage({ params }) {
    const customerId = "airbyte_humdakin_dk"
    const tableId = `performance-dashboard-airbyte`;

    try {
        const data = await queryBigQueryOrders({
            tableId,
            customerId,
            queryParams: {},
            limit: 100,
        });

        return (
            <div>
                <h1>Analytics for {customerId} (orders) </h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    } catch (error) {
        console.error("Error in TestPage:", error);
        return (
            <div>
                <h1>Analytics for {customerId}</h1>
                <div>Error: {error.message}</div>
            </div>
        );
    }
}