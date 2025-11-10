import { queryBigQueryRollUpMetrics } from "@/lib/bigQueryConnect";

export async function POST(request) {
    try {
        const body = await request.json();
        const { childCustomers, startDate, endDate } = body;

        if (!childCustomers || childCustomers.length === 0) {
            return Response.json({ error: 'No child customers provided' }, { status: 400 });
        }

        // Add date filtering to the BigQuery function
        const rollUpMetrics = await queryBigQueryRollUpMetrics({ 
            childCustomers, 
            startDate, 
            endDate 
        });

        return Response.json(rollUpMetrics);
    } catch (error) {
        console.error('Error in roll-up metrics API:', error);
        return Response.json(
            { error: 'Failed to fetch roll-up metrics' }, 
            { status: 500 }
        );
    }
}