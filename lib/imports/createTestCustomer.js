import "dotenv/config"; // Automatically loads .env variables into process.env
import mongoose from "mongoose";
import { dbConnect } from "../dbConnect.js"; // Add .js extension
import Customer from "../../models/Customer.js"; // Add .js extension

async function createTestCustomer() {
    try {
        // Connect to the database
        await dbConnect();

        // Create a new test customer
        const testCustomer = new Customer({
            name: "Test Customer",
            bigQueryCustomerId: "test_customer_id",
            bigQueryProjectId: "test_project_id",
        });

        // Save the customer to the database
        const savedCustomer = await testCustomer.save();
        console.log("Test customer created:", savedCustomer);
    } catch (error) {
        console.error("Error creating test customer:", error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

// Run the script
createTestCustomer();