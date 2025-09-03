import { dbConnect } from "@/lib/dbConnect";
import Spendshare from "@/models/Spendshare";

export async function GET(req, { params }) {
    const { customerId } = params;
    try {
        await dbConnect();

        const spendshare = await Spendshare.findOne({ customerId });
        return new Response(JSON.stringify(spendshare || {}), { status: 200 });
    } catch (error) {
        console.error("Error fetching spendshare data:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { customerId } = params;
    try {
        await dbConnect();

        const body = await req.json();
        const updatedSpendshare = await Spendshare.findOneAndUpdate(
            { customerId },
            { $set: body },
            { new: true, upsert: true }
        );
        return new Response(JSON.stringify(updatedSpendshare), { status: 200 });
    } catch (error) {
        console.error("Error updating spendshare data:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}