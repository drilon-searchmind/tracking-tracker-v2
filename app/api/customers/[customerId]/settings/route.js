import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    console.log("::: Fetching customer settings with customer ID:", customerId);
    try {
        await dbConnect();

        const db = mongoose.connection.db;

        const customerSettings = await db.collection('customersettings').findOne({
            customer: new mongoose.Types.ObjectId(customerId)
        });

        if (!customerSettings) {
            return new Response(JSON.stringify({ message: "::: Customer settings not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customerSettings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("::: Error fetching customer settings:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}