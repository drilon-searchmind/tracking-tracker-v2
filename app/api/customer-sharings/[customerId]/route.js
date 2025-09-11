import CustomerSharings from "@/models/CustomerSharings";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const { email, sharedWith, password } = await req.json();

    try {
        await dbConnect();

        const existingSharing = await CustomerSharings.findOne({ customer: customerId, email });
        if (existingSharing) {
            return new Response(JSON.stringify({ message: "Email already shared for this customer" }), { status: 400 });
        }

        let user = await User.findOne({ email });
        let userCreated = false;

        if (!user) {
            user = new User({
                name: sharedWith,
                email: email,
                password: password,
                isAdmin: false,
            });

            await user.save();
            userCreated = true;
        }

        const newSharing = new CustomerSharings({
            customer: customerId,
            email,
            sharedWith,
            userCreated: userCreated
        });

        const savedSharing = await newSharing.save();
        return new Response(JSON.stringify({
            sharing: savedSharing,
            userCreated: userCreated
        }), { status: 201 });
    } catch (error) {
        console.error("Error sharing customer report:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

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