import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    console.log("::: Fetching customer with ID:", customerId);
    try {
        await dbConnect();

        const customer = await Customer.findById(customerId, {
            bigQueryCustomerId: 1,
            bigQueryProjectId: 1,
            name: 1,
        });

        if (!customer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
        console.error("::: Error fetching customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    console.log("::: Updating customer with ID:", customerId);
    try {
        await dbConnect();

        const body = await req.json();
        const { name, bigQueryCustomerId, bigQueryProjectId } = body;

        const updateData = {};
        if (name) updateData.name = name;
        if (bigQueryCustomerId) updateData.bigQueryCustomerId = bigQueryCustomerId;
        if (bigQueryProjectId) updateData.bigQueryProjectId = bigQueryProjectId;
        
        updateData.updatedAt = new Date();

        if (Object.keys(updateData).length <= 1) { 
            return new Response(JSON.stringify({ message: "::: At least one field (name, bigQueryCustomerId, or bigQueryProjectId) is required" }), { status: 400 });
        }

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            updateData,
            {
                new: true,
            }
        );

        if (!customer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
        console.error("::: Error updating customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;

    console.log("::: Deleting customer with ID:", customerId);
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return new Response(JSON.stringify({ message: "Not authorized" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        const deletedCustomer = await Customer.findByIdAndDelete(customerId);

        if (!deletedCustomer) {
            return new Response(JSON.stringify({ message: "::: Customer not found" }), { status: 404 });
        }

        // FIXME: delete related data here (like StaticExpenses for this customer)
        // example:
        // await StaticExpenses.deleteMany({ customer: customerId });

        return new Response(JSON.stringify({
            message: "Customer deleted successfully",
            deletedCustomerId: customerId
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("::: Error deleting customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}