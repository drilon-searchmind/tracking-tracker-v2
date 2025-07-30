import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";

export async function GET(req, {params}) {
    const { customerId } = params;
    console.log("::: Fetching customer with ID:", customerId);
    try {
        await dbConnect()

        const customer = await Customer.findById(customerId, {
            bigQueryCustomerId: 1,
            bigQueryProjectId: 1,
            name: 1,
        })

        if (!customer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
        console.error("::: Error fetching customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}