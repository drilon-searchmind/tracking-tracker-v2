export const runtime = "nodejs";

import StaticExpenses from "@/models/StaticExpenses";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        await dbConnect();

        const staticExpenses = await StaticExpenses.findOne({ customer: customerId });

        if (!staticExpenses) {
            return new Response(JSON.stringify({ message: "No static expenses found", data: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ data: staticExpenses }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching static expenses:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const body = await req.json();

    try {
        await dbConnect();

        const updatedExpenses = await StaticExpenses.findOneAndUpdate(
            { customer: customerId },
            { ...body, customer: customerId },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify({ data: updatedExpenses }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating static expenses:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}