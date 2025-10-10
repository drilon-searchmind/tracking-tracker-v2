import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";
import StaticExpenses from "@/models/StaticExpenses";
import CustomerSettings from "@/models/CustomerSettings";

export async function GET(req) {
    try {
        await dbConnect();

        const customers = await Customer.find({});
        return new Response(JSON.stringify(customers), { status: 200 });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const {
            name,
            bigQueryCustomerId,
            bigQueryProjectId,
            metricPreference,
            customerValuta,
            customerValutaCode,
            customerClickupID
        } = await req.json();

        const newCustomer = new Customer({
            name,
            bigQueryCustomerId,
            bigQueryProjectId,
        })

        const savedCustomer = await newCustomer.save();

        const newStaticExpenses = new StaticExpenses({
            customer: savedCustomer._id,
        });

        await newStaticExpenses.save();

        const newCustomerSettings = new CustomerSettings({
            customer: savedCustomer._id,
            metricPreference: metricPreference || "ROAS/POAS",
            customerValuta,
            customerValutaCode,
            customerClickupID,
        });

        await newCustomerSettings.save();

        return new Response(JSON.stringify({
            message: "Customer, static expenses and settings created successfully",
            customer: savedCustomer
        }), { status: 201 });
    } catch (error) {
        console.error("Error creating customer:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}