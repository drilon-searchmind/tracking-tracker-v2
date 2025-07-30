import "dotenv/config";
import mongoose from "mongoose";
import { dbConnect } from "../dbConnect.js";
import Customer from "../../models/Customer.js";
import ConfigRevenueBudget from "../../models/ConfigRevenueBudget.js";

async function createTestConfig() {
    try {
        await dbConnect();

        const customer = await Customer.findOne({ name: "Humdakin DK" });
        if (!customer) {
            throw new Error("Customer not found");
        }

        const newConfig = new ConfigRevenueBudget({
            customer: customer._id,
            configs: [
                { month: "Januar", year: "2025", revenue: "100000", budget: "30000" },
                { month: "Februar", year: "2025", revenue: "200000", budget: "60000" },
                { month: "Marts", year: "2025", revenue: "400000", budget: "50000" },
            ],
        });

        const savedConfig = await newConfig.save();
        console.log("Config created:", savedConfig);
    } catch (error) {
        console.error("Error creating config:", error);
    } finally {
        mongoose.connection.close();
    }
}

createTestConfig();