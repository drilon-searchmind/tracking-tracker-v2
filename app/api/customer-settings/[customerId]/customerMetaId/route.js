import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const settings = await CustomerSettings.findOne({ customer: customerId });

        if (!settings) {
            return new Response(JSON.stringify({ error: "Settings not found", customerMetaID: "" }), { status: 404 });
        }

        return new Response(JSON.stringify({ customerMetaID: settings.customerMetaID || "" }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer Meta ID:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", customerMetaID: "" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const { customerMetaID } = await req.json();

        const updatedSettings = await CustomerSettings.findOneAndUpdate(
            { customer: customerId },
            { customerMetaID },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify({
            message: "Meta ID updated successfully",
            customerMetaID: updatedSettings.customerMetaID
        }), { status: 200 });
    } catch (error) {
        console.error("Error updating customer Meta ID:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}