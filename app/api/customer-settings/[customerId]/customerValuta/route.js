import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const settings = await CustomerSettings.findOne({ customer: customerId });

        if (!settings) {
            return new Response(JSON.stringify({ error: "Settings not found", customerValuta: "DKK" }), { status: 404 });
        }

        return new Response(JSON.stringify({ customerValuta: settings.customerValuta }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer valuta:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", customerValuta: "DKK" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const { customerValuta } = await req.json();

        if (!customerValuta || typeof customerValuta !== 'string') {
            return new Response(JSON.stringify({ error: "Invalid currency value" }), { status: 400 });
        }

        const updatedSettings = await CustomerSettings.findOneAndUpdate(
            { customer: customerId },
            { customerValuta },
            { new: true, upsert: true } // Create if not exists
        );

        return new Response(JSON.stringify({
            success: true,
            customerValuta: updatedSettings.customerValuta
        }), { status: 200 });
    } catch (error) {
        console.error("Error updating customer valuta:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}