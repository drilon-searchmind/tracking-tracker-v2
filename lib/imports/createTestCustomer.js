import "dotenv/config";
import mongoose from "mongoose";
import { dbConnect } from "../dbConnect.js";
import Customer from "../../models/Customer.js";

async function createTestCustomer() {
    try {
        await dbConnect();

        const testCustomer = new Customer({
            name: "Test Customer",
            bigQueryCustomerId: "test_customer_id",
            bigQueryProjectId: "test_project_id",
        });

        const savedCustomer = await testCustomer.save();
        console.log("Test customer created:", savedCustomer);
    } catch (error) {
        console.error("Error creating test customer:", error);
    } finally {
        mongoose.connection.close();
    }
}

createTestCustomer();