// file path:
// C:\Users\Searchmind\Documents\DEV\INTERN\TRACKING_TRACKER_V2\tracking-tracker-v2-master\lib\scripts\create-admin.js
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createAdminUser() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db();
    const users = database.collection("users");

    const existingAdmin = await users.findOne({ email: "admin@searchmind.dk" });
    
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123123", 10);

    const result = await users.insertOne({
      name: "Admin Searchmind",
      email: "admin@searchmind.dk",
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
    });

    console.log("Admin user created successfully");
  } finally {
    await client.close();
  }
}

createAdminUser().catch(console.error);