import { queryBigQuery } from "@/lib/bigQueryConnect";

export default async function handler(req, res) {
    const { customerId } = req.query;
    const tableId = `performance-dashboard-airbyte`;
    const formattedCustomerId = `${customerId}.campaign`;
    try {
        const data = await queryBigQuery({
            tableId,
            customerId: formattedCustomerId,
            queryParams: null,
            limit: 100,
        });

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}