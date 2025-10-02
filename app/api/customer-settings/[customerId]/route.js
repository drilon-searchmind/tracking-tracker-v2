import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const { metricPreference } = await req.json();

        if (!["ROAS/POAS", "Spendshare"].includes(metricPreference)) {
            return new Response(JSON.stringify({ error: "Invalid metric preference" }), { status: 400 });
        }

        const updatedSettings = await CustomerSettings.findOneAndUpdate(
            { customer: customerId },
            { metricPreference },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify(updatedSettings), { status: 200 });
    } catch (error) {
        console.error("Error updating customer settings:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const settings = await CustomerSettings.findOne({ customer: customerId });

        if (!settings) {
            return new Response(JSON.stringify({ error: "Settings not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(settings), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer settings:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}