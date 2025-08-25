import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";
import StaticExpenses from "@/models/StaticExpenses";

export async function GET(req) {
    try {
        await dbConnect();

        const customers = await Customer.find({}, { name: 1, _id: 1 });
        return new Response(JSON.stringify(customers), { status: 200 });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const { name, bigQueryCustomerId, bigQueryProjectId } = await req.json();

        const newCustomer = new Customer({
            name,
            bigQueryCustomerId,
            bigQueryProjectId,
        })

        const savedCustomer = await newCustomer.save();

        const newStaticExpenses = new StaticExpenses({
            customer: savedCustomer._id,
        }); 

        await newStaticExpenses.save();

        return new Response(JSON.stringify({ message: "Customer and static expenses created successfully", customer: savedCustomer }), { status: 201 });
    } catch (error) {
        console.error("Error creating customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}