import { dbConnect } from "@/lib/dbConnect";
import CustomerSharings from "@/models/CustomerSharings";
import Customer from "@/models/Customer";

export async function GET() {
    try {
        await dbConnect()

        const sharings = await CustomerSharings.find({}).lean()
        const customers = await Customer.find({}, "_id name").lean()

        const customerMap = {}
        customers.forEach(customer => {
            customerMap[customer._id.toString()] = customer.name
        })

        const enrichedSharings = sharings.map(sharing => ({
            ...sharing,
            customerName: customerMap[sharing.customer] || 'Unknown Customer'
        }));

        return new Response(JSON.stringify({ data: enrichedSharings }), { status: 200 });

    } catch (error) {
        console.error("Error fetching all customer sharings:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}