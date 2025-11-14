// Test script to verify changeCurrency updates work directly
const { MongoClient } = require('mongodb');

async function testDirectUpdate() {
    const client = new MongoClient('mongodb+srv://dbr:7WNxAq0JC2N7x1Xd@trackingtrackerv2.h3kwij6.mongodb.net/');
    
    try {
        await client.connect();
        const db = client.db();
        
        // Find a specific document to test with
        const testCustomerId = "68ecee151a52f627aab8a674"; // From your example
        
        console.log("Testing direct MongoDB update...");
        
        // First, check current value
        const beforeDoc = await db.collection('customersettings').findOne({ customer: testCustomerId });
        console.log("Before update - changeCurrency:", beforeDoc?.changeCurrency);
        
        // Try to update to false
        const updateResult = await db.collection('customersettings').findOneAndUpdate(
            { customer: testCustomerId },
            { 
                $set: { 
                    changeCurrency: false, 
                    updatedAt: new Date() 
                } 
            },
            { returnDocument: 'after' }
        );
        
        console.log("Update result - changeCurrency:", updateResult?.changeCurrency);
        
        // Wait a moment then check again
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const afterDoc = await db.collection('customersettings').findOne({ customer: testCustomerId });
        console.log("After update - changeCurrency:", afterDoc?.changeCurrency);
        
        // Reset back to true for your testing
        await db.collection('customersettings').updateOne(
            { customer: testCustomerId },
            { $set: { changeCurrency: true, updatedAt: new Date() } }
        );
        console.log("Reset changeCurrency back to true");
        
    } finally {
        await client.close();
    }
}

testDirectUpdate().catch(console.error);