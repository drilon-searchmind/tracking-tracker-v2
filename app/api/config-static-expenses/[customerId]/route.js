export const runtime = "nodejs"; // ensure Node runtime so mongoose works

import { NextResponse } from "next/server";
import StaticExpenses from "@/models/StaticExpenses";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        await dbConnect();

        const staticExpenses = await StaticExpenses.findOne({ customer: customerId });

        if (!staticExpenses) {
            return NextResponse.json({ message: "No static expenses found", data: null }, { status: 200 });
        }

        return NextResponse.json({ data: staticExpenses }, { status: 200 });
    } catch (error) {
        console.error("Error fetching static expenses:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
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

        return NextResponse.json({ data: updatedExpenses }, { status: 200 });
    } catch (error) {
        console.error("Error updating static expenses:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}