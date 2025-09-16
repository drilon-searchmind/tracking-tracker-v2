import { dbConnect } from "@/lib/dbConnect";
import AssignedCampaignUsers from "@/models/AssignedCampaignUsers";
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
        
        const url = new URL(req.url);
        const campaignId = url.searchParams.get('campaignId');
        
        if (!campaignId) {
            return new Response(
                JSON.stringify({ error: "Campaign ID is required" }),
                { status: 400 }
            );
        }
        
        const assignments = await AssignedCampaignUsers.find({ campaignId });
        
        return new Response(
            JSON.stringify(assignments),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching assigned users:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        
        if (!body.campaignId || !body.assignedUserId) {
            return new Response(
                JSON.stringify({ error: "Campaign ID and User ID are required" }), 
                { status: 400 }
            );
        }

        const assignment = new AssignedCampaignUsers({
            campaignId: body.campaignId,
            assignedUserId: body.assignedUserId,
        });

        await assignment.save();

        return new Response(
            JSON.stringify({ 
                message: "User assigned to campaign successfully",
                assignment
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error assigning user to campaign:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        
        const url = new URL(req.url);
        const campaignId = url.searchParams.get('campaignId');
        const userId = url.searchParams.get('userId');
        
        if (!campaignId || !userId) {
            return new Response(
                JSON.stringify({ error: "Campaign ID and User ID are required" }),
                { status: 400 }
            );
        }
        
        const result = await AssignedCampaignUsers.deleteOne({ 
            campaignId, 
            assignedUserId: userId 
        });
        
        if (result.deletedCount === 0) {
            return new Response(
                JSON.stringify({ error: "Assignment not found" }),
                { status: 404 }
            );
        }
        
        return new Response(
            JSON.stringify({ message: "User assignment removed successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error removing user assignment:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}