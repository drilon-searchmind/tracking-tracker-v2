import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnect } from "../lib/dbConnect.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importUsers() {
    console.log("🚀 Starting user import process...");
    
    try {
        // Connect to database
        console.log("📡 Connecting to database...");
        await dbConnect();
        console.log("✅ Database connected successfully");

        // Read JSON file
        const jsonFilePath = path.join(__dirname, "../test_data/User_Download_12112025_110014.json");
        console.log(`📖 Reading users from: ${jsonFilePath}`);
        
        if (!fs.existsSync(jsonFilePath)) {
            throw new Error(`JSON file not found at: ${jsonFilePath}`);
        }

        const jsonData = fs.readFileSync(jsonFilePath, "utf8");
        const users = JSON.parse(jsonData);
        
        console.log(`📊 Found ${users.length} users in JSON file`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each user
        for (let i = 0; i < users.length; i++) {
            const userData = users[i];
            
            try {
                // Map the fields according to requirements
                const userToCreate = {
                    name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                    email: userData.email,
                    password: "smind1337", // Set password as requested
                    // Other fields will use default values from schema
                };

                // Validate required fields
                if (!userToCreate.name) {
                    throw new Error("Name is required (first_name + last_name)");
                }
                if (!userToCreate.email) {
                    throw new Error("Email is required");
                }

                // Check if user already exists
                const existingUser = await User.findOne({ email: userToCreate.email });
                if (existingUser) {
                    console.log(`⚠️  User ${i + 1}/${users.length}: ${userToCreate.email} already exists, skipping...`);
                    continue;
                }

                // Create new user
                const newUser = new User(userToCreate);
                await newUser.save();
                
                successCount++;
                console.log(`✅ User ${i + 1}/${users.length}: Created ${userToCreate.name} (${userToCreate.email})`);
                
            } catch (error) {
                errorCount++;
                const errorMessage = `❌ User ${i + 1}/${users.length}: Failed to create user - ${error.message}`;
                console.error(errorMessage);
                errors.push({
                    index: i + 1,
                    userData: userData,
                    error: error.message
                });
            }
        }

        // Summary
        console.log("\n📈 Import Summary:");
        console.log(`✅ Successfully created: ${successCount} users`);
        console.log(`❌ Errors: ${errorCount} users`);
        console.log(`📊 Total processed: ${users.length} users`);

        // Log detailed errors if any
        if (errors.length > 0) {
            console.log("\n🔍 Detailed Error Report:");
            errors.forEach(error => {
                console.log(`User ${error.index}:`, {
                    name: `${error.userData.first_name || ''} ${error.userData.last_name || ''}`.trim(),
                    email: error.userData.email,
                    error: error.error
                });
            });
        }

    } catch (error) {
        console.error("💥 Fatal error during import process:", error.message);
        console.error("Stack trace:", error.stack);
    } finally {
        // Close database connection
        console.log("🔌 Closing database connection...");
        await mongoose.connection.close();
        console.log("👋 Import process completed");
    }
}

// Run the import
importUsers().catch(console.error);