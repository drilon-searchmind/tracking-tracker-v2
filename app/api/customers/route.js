import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";

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