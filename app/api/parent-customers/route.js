import { dbConnect } from "@/lib/dbConnect";
import ParentCustomer from "@/models/ParentCustomer";

export async function GET(req) {
    try {
        await dbConnect();

        const parentCustomers = await ParentCustomer.find({ isArchived: false })
            .sort({ name: 1 });

        return new Response(JSON.stringify(parentCustomers), { status: 200 });
    } catch (error) {
        console.error("Error fetching parent customers:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const {
            name,
            description,
            industry,
            headquarters,
            website
        } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ message: "Parent customer name is required" }), { status: 400 });
        }

        const existingParentCustomer = await ParentCustomer.findOne({ name });
        if (existingParentCustomer) {
            return new Response(JSON.stringify({ message: "Parent customer with this name already exists" }), { status: 409 });
        }

        const newParentCustomer = new ParentCustomer({
            name,
            description: description || "",
            industry: industry || "",
            headquarters: headquarters || "",
            website: website || "",
        });

        const savedParentCustomer = await newParentCustomer.save();

        return new Response(JSON.stringify({
            message: "Parent customer created successfully",
            parentCustomer: savedParentCustomer
        }), { status: 201 });
    } catch (error) {
        console.error("Error creating parent customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}