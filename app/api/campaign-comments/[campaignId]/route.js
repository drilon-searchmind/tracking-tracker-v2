import { dbConnect } from "@/lib/dbConnect";
import CampaignComment from "@/models/CampaignComment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
    const resolvedParams = await params;
    const campaignId = resolvedParams.resolvedParams

    try {
        await dbConnect();
        
        const comments = await CampaignComment.find({ campaignId }).sort({ createdAt: 1 });
        
        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch comments" }),
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    const resolvedParams = await params;
    const campaignId = resolvedParams.resolvedParams
    
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }
        
        const body = await req.json();
        
        if (!body.content || body.content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Comment content is required" }),
                { status: 400 }
            );
        }
        
        const comment = new CampaignComment({
            campaignId,
            content: body.content,
            userId: session.user.id,
            userName: session.user.name,
            userRole: session.user.role || "User"
        });
        
        await comment.save();
        
        return new Response(
            JSON.stringify({
                message: "Comment added successfully",
                comment
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to add comment" }),
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const resolvedParams = await params;
    const campaignId = resolvedParams.resolvedParams

    const url = new URL(req.url);
    const commentId = url.searchParams.get('id');
    
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }
        
        const body = await req.json();
        
        if (!body.content || body.content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Comment content is required" }),
                { status: 400 }
            );
        }
        
        const comment = await CampaignComment.findById(commentId);
        
        if (!comment) {
            return new Response(
                JSON.stringify({ error: "Comment not found" }),
                { status: 404 }
            );
        }
        
        if (comment.userId !== session.user.id && session.user.role !== "admin") {
            return new Response(
                JSON.stringify({ error: "Not authorized to edit this comment" }),
                { status: 403 }
            );
        }
        
        comment.content = body.content;
        comment.updatedAt = new Date();
        comment.isEdited = true;
        
        await comment.save();
        
        return new Response(
            JSON.stringify({
                message: "Comment updated successfully",
                comment
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update comment" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const campaignId = resolvedParams.resolvedParams
    
    const url = new URL(req.url);
    const commentId = url.searchParams.get('id');
    
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }
        
        const comment = await CampaignComment.findById(commentId);
        
        if (!comment) {
            return new Response(
                JSON.stringify({ error: "Comment not found" }),
                { status: 404 }
            );
        }
        
        if (comment.userId !== session.user.id && session.user.role !== "admin") {
            return new Response(
                JSON.stringify({ error: "Not authorized to delete this comment" }),
                { status: 403 }
            );
        }
        
        await CampaignComment.findByIdAndDelete(commentId);
        
        return new Response(
            JSON.stringify({ message: "Comment deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete comment" }),
            { status: 500 }
        );
    }
}