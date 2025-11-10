import CustomerSharings from "@/models/CustomerSharings";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const body = await req.json();
    
    try {
        await dbConnect();
        
        if (body.userId) {
            const user = await User.findById(body.userId);
            
            if (!user) {
                return new Response(JSON.stringify({ 
                    message: "User not found" 
                }), { status: 404 });
            }
            
            const customerIdString = String(customerId);
            
            const existingSharing = await CustomerSharings.findOne({ 
                customer: customerIdString, 
                email: user.email 
            });
            
            if (existingSharing) {
                return new Response(JSON.stringify({ 
                    message: "This customer is already shared with this user" 
                }), { status: 409 });
            }
            
            try {
                const newSharing = new CustomerSharings({
                    customer: customerIdString,
                    email: user.email,
                    sharedWith: user.name,
                    userCreated: false
                });
                
                await newSharing.save();
                
                return new Response(JSON.stringify({
                    message: "Customer shared successfully with existing user",
                    userCreated: false
                }), { status: 201 });
            } catch (saveError) {
                if (saveError.code === 11000) {
                    console.error("Duplicate key details:", JSON.stringify({
                        keyPattern: saveError.keyPattern,
                        keyValue: saveError.keyValue,
                        message: saveError.message
                    }, null, 2));
                    
                    if (saveError.keyPattern && saveError.keyPattern.customer && saveError.keyPattern.email) {
                        return new Response(JSON.stringify({ 
                            message: "This customer is already shared with this user",
                            details: saveError.keyValue
                        }), { status: 409 });
                    } else {
                        return new Response(JSON.stringify({ 
                            message: "Duplicate key error",
                            details: saveError.keyValue
                        }), { status: 409 });
                    }
                }
                throw saveError;
            }
        } 
        else {
            const { email, sharedWith, password } = body;
            
            if (!email || !sharedWith || !password) {
                return new Response(JSON.stringify({ 
                    message: "Email, name, and password are required" 
                }), { status: 400 });
            }
            
            try {
                const customerIdString = String(customerId);
                
                const existingSharing = await CustomerSharings.findOne({ 
                    customer: customerIdString, 
                    email 
                });
                
                if (existingSharing) {
                    return new Response(JSON.stringify({ 
                        message: "Email already shared for this customer" 
                    }), { status: 400 });
                }
                
                let user = await User.findOne({ email });
                let userCreated = false;
                
                if (!user) {
                    user = new User({
                        name: sharedWith,
                        email: email,
                        password: password,
                        isAdmin: false,
                        isExternal: true
                    });
                    
                    await user.save();
                    userCreated = true;
                }
                
                const newSharing = new CustomerSharings({
                    customer: customerIdString,
                    email,
                    sharedWith,
                    userCreated
                });
                
                await newSharing.save();
                
                return new Response(JSON.stringify({
                    message: "Customer shared successfully",
                    userCreated
                }), { status: 201 });
            } catch (saveError) {
                if (saveError.code === 11000) {
                    console.error("Duplicate key details:", JSON.stringify({
                        keyPattern: saveError.keyPattern,
                        keyValue: saveError.keyValue,
                        message: saveError.message
                    }, null, 2));
                    
                    if (saveError.keyPattern && saveError.keyPattern.customer && saveError.keyPattern.email) {
                        return new Response(JSON.stringify({ 
                            message: "This customer is already shared with this user",
                            details: saveError.keyValue
                        }), { status: 409 });
                    } else {
                        return new Response(JSON.stringify({ 
                            message: "Duplicate key error",
                            details: saveError.keyValue
                        }), { status: 409 });
                    }
                }
                throw saveError;
            }
        }
    } catch (error) {
        console.error("Error sharing customer report:", error);
        return new Response(JSON.stringify({ 
            message: "Internal server error", 
            error: error.message
        }), { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const customerId = resolvedParams.customerId;

        if (!customerId) {
            return new Response(JSON.stringify({ message: "Customer ID is required" }), { status: 400 });
        }

        await dbConnect();

        console.log(`Looking for sharings with customer ID: ${customerId}`);

        const sharings = await CustomerSharings.find({
            customer: { $in: [customerId, customerId.toString()] }
        });

        console.log(`Found ${sharings.length} sharings for customer: ${customerId}`);

        return new Response(JSON.stringify({ data: sharings }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer sharings by ID:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const resolvedParams = await params;
        const customerId = resolvedParams.customerId;
        const body = await req.json();
        const { sharingId } = body;

        console.log("DELETE request - Customer ID:", customerId);
        console.log("DELETE request - Sharing ID:", sharingId);

        if (!sharingId) {
            return new Response(JSON.stringify({ 
                message: "Sharing ID is required" 
            }), { status: 400 });
        }

        await dbConnect();

        // Find and delete the specific sharing
        const deletedSharing = await CustomerSharings.findOneAndDelete({
            _id: sharingId,
            customer: customerId
        });

        if (!deletedSharing) {
            console.log("Sharing not found for deletion");
            return new Response(JSON.stringify({ 
                message: "Sharing not found" 
            }), { status: 404 });
        }

        console.log("Successfully deleted sharing:", deletedSharing.email);

        return new Response(JSON.stringify({
            message: "Shared access removed successfully",
            deletedSharing: {
                email: deletedSharing.email,
                sharedWith: deletedSharing.sharedWith
            }
        }), { status: 200 });

    } catch (error) {
        console.error("Error deleting customer sharing:", error);
        return new Response(JSON.stringify({ 
            message: "Internal server error", 
            error: error.message 
        }), { status: 500 });
    }
}