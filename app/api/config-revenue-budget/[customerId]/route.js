import ConfigRevenueBudget from "@/models/ConfigRevenueBudget";
import Customer from "@/models/Customer";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    console.log("::: Fetching customer with ID:", customerId);
    try {
        await dbConnect();

        const revenueBudget = await ConfigRevenueBudget.findOne({ customer: customerId }).populate("customer");

        if (!revenueBudget) {
            return new Response(JSON.stringify({ message: "Revenue and budget configuration not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(revenueBudget), { status: 200 });
    } catch (error) {
        console.error("::: Fetching revenue and budget configuration for customer ID:", error);
        return new Response(JSON.stringify({ message: "::: Internal server error" }), { status: 500 });
    }
}

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    try {
        const body = await req.json();

        await dbConnect();

        const updatedConfig = await ConfigRevenueBudget.findOneAndUpdate(
            { customer: customerId },
            { $push: { configs: body } },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify(updatedConfig), { status: 200 });
    } catch (error) {
        console.error("Error adding configuration:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const { configId } = await req.json();

    try {
        await dbConnect();

        const updatedConfig = await ConfigRevenueBudget.findOneAndUpdate(
            { customer: customerId },
            { $pull: { configs: { _id: configId } } },
            { new: true }
        );

        if (!updatedConfig) {
            return new Response(JSON.stringify({ message: "Configuration not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedConfig), { status: 200 });
    } catch (error) {
        console.error("Error deleting configuration:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}