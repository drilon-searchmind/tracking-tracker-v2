import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const settings = await CustomerSettings.findOne({ customer: customerId });

        if (!settings) {
            return new Response(JSON.stringify({ error: "Settings not found", customerClickupID: "" }), { status: 404 });
        }

        return new Response(JSON.stringify({ customerClickupID: settings.customerClickupID || "" }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer clickup ID:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", customerClickupID: "" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const { customerClickupID } = await req.json();

        const updatedSettings = await CustomerSettings.findOneAndUpdate(
            { customer: customerId },
            { customerClickupID },
            { new: true, upsert: true } // Create if not exists
        );

        return new Response(JSON.stringify({
            message: "Clickup ID updated successfully",
            customerClickupID: updatedSettings.customerClickupID
        }), { status: 200 });
    } catch (error) {
        console.error("Error updating customer clickup ID:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}