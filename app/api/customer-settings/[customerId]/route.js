import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "@/models/CustomerSettings";

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    await dbConnect();

    try {
        const body = await req.json();
        const {
            metricPreference,
            customerValuta,
            customerValutaCode,
            customerClickupID,
            customerMetaID
        } = body;

        if (metricPreference && !["ROAS/POAS", "Spendshare"].includes(metricPreference)) {
            return new Response(JSON.stringify({ error: "Invalid metric preference" }), { status: 400 });
        }

        const updateData = {};
        if (metricPreference !== undefined) updateData.metricPreference = metricPreference;
        if (customerValuta !== undefined) updateData.customerValuta = customerValuta;
        if (customerValutaCode !== undefined) updateData.customerValutaCode = customerValutaCode;
        if (customerClickupID !== undefined) updateData.customerClickupID = customerClickupID;
        if (customerMetaID !== undefined) updateData.customerMetaID = customerMetaID;

        updateData.updatedAt = new Date();

        const updatedSettings = await CustomerSettings.findOneAndUpdate(
            { customer: customerId },
            updateData,
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
            const defaultSettings = {
                customer: customerId,
                metricPreference: "ROAS/POAS",
                customerValuta: "kr",
                customerValutaCode: "DKK",
                customerClickupID: "",
                customerMetaID: ""
            };
            return new Response(JSON.stringify(defaultSettings), { status: 200 });
        }

        return new Response(JSON.stringify(settings), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer settings:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}