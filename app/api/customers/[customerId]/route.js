import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    console.log("::: Fetching customer with ID:", customerId);
    try {
        await dbConnect();

        const customer = await Customer.findById(customerId, {
            bigQueryCustomerId: 1,
            bigQueryProjectId: 1,
            name: 1,
        });

        if (!customer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
        console.error("::: Error fetching customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    console.log("::: Updating customer with ID:", customerId);
    try {
        await dbConnect();

        const body = await req.json();
        const { name, bigQueryCustomerId, bigQueryProjectId } = body;

        if (!name || !bigQueryCustomerId || !bigQueryProjectId) {
            return new Response(JSON.stringify({ message: "::: All fields (name, bigQueryCustomerId, bigQueryProjectId) are required" }), { status: 400 });
        }

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            {
                name,
                bigQueryCustomerId,
                bigQueryProjectId,
                updatedAt: new Date(),
            },
            {
                new: true, 
                select: 'name bigQueryCustomerId bigQueryProjectId', 
            }
        );

        if (!customer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
        console.error("::: Error updating customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}