import CustomerSharings from "@/models/CustomerSharings";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req, { params }) {
    const { customerId } = params;
    const { email, sharedWith } = await req.json();

    try {
        await dbConnect();

        const existingSharing = await CustomerSharings.findOne({ customer: customerId, email });
        if (existingSharing) {
            return new Response(JSON.stringify({ message: "Email already shared for this customer" }), { status: 400 });
        }

        const newSharing = new CustomerSharings({
            customer: customerId,
            email,
            sharedWith,
        });

        const savedSharing = await newSharing.save();
        return new Response(JSON.stringify(savedSharing), { status: 201 });
    } catch (error) {
        console.error("Error sharing customer report:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { customerId } = params;

        if (!customerId) {
            return new Response(JSON.stringify({ message: "Customer ID is required" }), { status: 400 });
        }

        await dbConnect();

        console.log(`Looking for sharings with customer ID: ${customerId}`);

        const sharings = await CustomerSharings.find({
            customer: { $in: [customerId, customerId.toString()] }
        });

        console.log(`Found ${sharings.length} sharings for customer: ${customerId}`);

        return new Response(JSON.stringify({ data: sharings }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer sharings by ID:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}