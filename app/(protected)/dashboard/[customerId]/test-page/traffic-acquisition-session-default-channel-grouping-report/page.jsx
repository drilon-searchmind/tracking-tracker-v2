import React from "react";
import { queryBigQueryTrafficAcquisitionSessionDefaultChannelGroupingReport } from "@/lib/bigQueryConnect";

export default async function TestPage({ params }) {
    const customerId = "airbyte_humdakin_dk"
    const tableId = `performance-dashboard-airbyte`;

    try {
        const data = await queryBigQueryTrafficAcquisitionSessionDefaultChannelGroupingReport({
            tableId,
            customerId,
            queryParams: {},
            limit: 100,
        });

        return (
            <div>
                <h1>Analytics for {customerId} (traffic_acquisition_session_default_channel_grouping_report) </h1>
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