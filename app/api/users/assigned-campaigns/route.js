import { dbConnect } from "@/lib/dbConnect";
import AssignedCampaignUsers from "@/models/AssignedCampaignUsers";
import Campaign from "@/models/Campaign";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ message: "Not authorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();
        
        const userId = session.user.id;
        
        const assignments = await AssignedCampaignUsers.find({ 
            assignedUserId: userId.toString() 
        });
        
        if (!assignments || assignments.length === 0) {
            return new Response(JSON.stringify([]), { status: 200 });
        }
        
        const campaignIds = assignments.map(assignment => assignment.campaignId);
        
        const campaigns = await Campaign.find({ 
            _id: { $in: campaignIds } 
        });
        
        const customerIds = [...new Set(campaigns.map(campaign => campaign.customerId))];
        
        const customers = await Customer.find({ 
            _id: { $in: customerIds } 
        });
        
        const customerMap = {};
        customers.forEach(customer => {
            customerMap[customer._id.toString()] = customer.name;
        });
        
        const campaignsWithCustomerNames = campaigns.map(campaign => {
            const campaignObj = campaign.toObject();
            campaignObj.customerName = customerMap[campaign.customerId] || 'Unknown Customer';
            return campaignObj;
        });
        
        return new Response(JSON.stringify(campaignsWithCustomerNames), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching user's assigned campaigns:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch assigned campaigns" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}